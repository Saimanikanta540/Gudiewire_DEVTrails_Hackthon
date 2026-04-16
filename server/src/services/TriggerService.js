const Event = require('../models/Event');
const Claim = require('../models/Claim');
const User = require('../models/User');
const Policy = require('../models/Policy');
const FraudService = require('./FraudService');
const ActuarialService = require('./ActuarialService');

/**
 * Trigger Service handles automatic claim generation from parametric events
 */
class TriggerService {
  /**
   * Process a parametric event and auto-generate claims
   */
  static async processEvent(eventData) {
    // 1. Create the event record
    const event = new Event({
      ...eventData,
      isTriggered: true
    });
    await event.save();

    // 2. Find all active policies in the affected area
    const usersInZone = await User.find({ city: eventData.location.city, zone: eventData.location.zone });
    const userIds = usersInZone.map(u => u._id);
    
    const activePolicies = await Policy.find({ 
      userId: { $in: userIds },
      status: 'Active',
      coveredEvents: eventData.eventType
    });

    const claimsGenerated = [];
    const globalExclusions = ['War', 'Pandemic', 'Terrorism'];

    // 3. For each policy, auto-trigger a claim
    for (const policy of activePolicies) {
      const user = usersInZone.find(u => u._id.toString() === policy.userId.toString());
      
      // Standard Insurance Domain Check: Exclusions
      const isExcluded = globalExclusions.some(ex => eventData.eventType.includes(ex) || (eventData.description && eventData.description.includes(ex)));
      if (isExcluded) {
        console.log(`[Domain Exclusion] Claim blocked for user ${user._id} due to global exclusion policy (War/Pandemic/Terrorism).`);
        continue;
      }

      // Persona-Specific Actuarial Logic
      // Different segments have different "Lost Hour" sensitivity to the same event value
      let segmentSensitivity = 1.0;
      if (user.vehicleType === '2-Wheeler' && eventData.eventType === 'Rain') {
        segmentSensitivity = 1.5; // 2-wheelers lose 50% more time in rain
      } else if (user.workType === 'Amazon' || user.workType === 'Porter') {
        segmentSensitivity = 0.8; // Logistics/Parcel can defer, less sensitive to 1-hour spikes
      }

      const rawFactors = {
        rain_risk: eventData.eventType === 'Rain' ? Math.min(100, eventData.value * 2) : 10,
        pollution_risk: eventData.eventType === 'Pollution' ? Math.min(100, (eventData.value / 500) * 100) : 10,
        traffic_risk: eventData.eventType === 'Traffic' ? eventData.value : 10,
        zone_risk: 50
      };

      const riskEvaluation = await ActuarialService.evaluateRisk(rawFactors, {
        vehicleType: user.vehicleType,
        workType: user.workType,
        experienceLevel: user.experienceLevel
      });

      const lostHours = Math.min((eventData.value / 10) * segmentSensitivity, 8); 
      const hourlyRate = (user.avgIncome || 1000) / 10;
      const payout = Math.round(lostHours * hourlyRate);

      // 4. Run Fraud Detection
      const fraudCheck = await FraudService.checkFraud({
        userLocation: user.location,
        eventLocation: eventData.location,
        userId: user._id,
        lostHours: lostHours,
        eventType: eventData.eventType
      });

      const claim = new Claim({
        userId: user._id,
        policyId: policy._id,
        eventId: event._id,
        event: eventData.eventType,
        eventIcon: this.getIcon(eventData.eventType),
        description: `${eventData.eventType} event detected in ${eventData.location.zone}. Automatic claim triggered. (Stability: ${riskEvaluation.stability_score}%)`,
        lostHours,
        hourlyRate,
        payout,
        status: fraudCheck.isFraud ? 'Fraud Flagged' : 'Processing',
        fraudAlerts: fraudCheck.alerts,
        steps: [
          { step: 'Event Detected', completed: true },
          { step: 'Claim Generated', completed: true },
          { step: 'Fraud Check Passed', completed: !fraudCheck.isFraud },
          { step: 'Payout Initiated', completed: false }
        ]
      });

      await claim.save();
      
      // Removed simulatePayout here to allow manual admin approval as requested
      // If needed for demo, this can be triggered by the admin "Approve" button
      
      claimsGenerated.push(claim);
    }

    return { event, claimsCount: claimsGenerated.length };
  }

  static getIcon(type) {
    const icons = {
      'Rain': '🌧️',
      'Pollution': '💨',
      'Curfew': '🛑',
      'Traffic': '🚗'
    };
    return icons[type] || '⚠️';
  }

  static async simulatePayout(claim) {
    // Artificial delay to simulate banking system
    claim.status = 'Paid';
    claim.txnId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    claim.paidDate = new Date();
    claim.steps[3].completed = true; // Payout initiated/completed
    await claim.save();
  }
}

module.exports = TriggerService;
