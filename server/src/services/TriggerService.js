const Event = require('../models/Event');
const Claim = require('../models/Claim');
const User = require('../models/User');
const Policy = require('../models/Policy');
const FraudService = require('./FraudService');

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

    // 3. For each policy, auto-trigger a claim
    for (const policy of activePolicies) {
      const user = usersInZone.find(u => u._id.toString() === policy.userId.toString());
      
      // Calculate lost hours and payout based on event severity
      // In a real app, this would be based on historical correlation
      const lostHours = Math.min(eventData.value / 10, 8); // Example formula
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
        description: `${eventData.eventType} event detected in ${eventData.location.zone}. Automatic claim triggered.`,
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
      
      // If not fraud, simulate instant payout for Phase 2 demo
      if (!fraudCheck.isFraud) {
        await this.simulatePayout(claim);
      }
      
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
