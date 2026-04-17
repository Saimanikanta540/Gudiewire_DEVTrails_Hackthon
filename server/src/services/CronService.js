const cron = require('node-cron');
const Policy = require('../models/Policy');
const User = require('../models/User');
const AIService = require('./AIService');
const TriggerService = require('./TriggerService');
const LiveDataService = require('./liveDataService');

/**
 * Cron Service - The Platform's "Reflexes"
 * Automates real-time condition monitoring and claim triggering.
 */
class CronService {
  start() {
    console.log('🕒 Phase 3 Cron Engine: Active (Polling every 5 mins)');
    
    // Check every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      console.log(`[Cron] Autonomous Scan Initiated: ${new Date().toISOString()}`);
      await this.monitorActivePolicies();
    });
  }

  async monitorActivePolicies() {
    try {
      const activePolicies = await Policy.find({ status: 'Active' }).populate('userId');
      
      // Group by distinct lat/lon clusters to save API credits
      const coordinates = [...new Set(activePolicies.map(p => 
        JSON.stringify({ lat: p.userId.location.lat, lon: p.userId.location.lng })
      ))].map(JSON.parse);

      for (const coord of coordinates) {
        const liveFactors = await LiveDataService.getLiveRiskFactors(coord.lat, coord.lon);
        
        // Find users in this cluster
        const affectedPolicies = activePolicies.filter(p => 
          p.userId.location.lat === coord.lat && p.userId.location.lng === coord.lon
        );

        for (const policy of affectedPolicies) {
          const user = policy.userId;
          
          // AI Inference with Real Data
          const score = await AIService.calculateStabilityScore(liveFactors, {
            vehicleType: user.vehicleType,
            experienceLevel: user.experienceLevel
          });

          // Parametric Trigger logic
          if (score.risk_level === 'CRITICAL') {
            console.log(`[Cron] 🚨 CRITICAL RISK for ${user.name}. Triggering automated payout.`);
            await TriggerService.processEvent({
              eventType: liveFactors.rain_risk > 50 ? 'Rain' : 'Pollution',
              value: liveFactors.rain_risk > 50 ? liveFactors.rain_risk : liveFactors.pollution_risk,
              threshold: 80,
              location: { city: user.city, zone: user.zone, lat: coord.lat, lng: coord.lon },
              description: `Autonomous trigger via RiskPulse AI™ (Score: ${score.stability_score}).`
            });
          }
        }
      }
    } catch (err) {
      console.error('[Cron] Engine Error:', err);
    }
  }
}

module.exports = new CronService();
