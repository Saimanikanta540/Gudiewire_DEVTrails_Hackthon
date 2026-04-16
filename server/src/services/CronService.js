const cron = require('node-cron');
const Policy = require('../models/Policy');
const User = require('../models/User');
const ActuarialService = require('./ActuarialService');
const TriggerService = require('./TriggerService');

/**
 * Cron Service
 * Runs every 5 minutes to fetch live API data, calculate risk, and trigger claims.
 */
class CronService {
  start() {
    console.log('🕒 CronService initialized. Automation engine started.');
    
    // Run every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      console.log(`[Cron] Executing automated climate check at ${new Date().toISOString()}`);
      await this.runClimateCheck();
    });
  }

  async runClimateCheck() {
    try {
      // 1. Get all distinct active zones
      const activePolicies = await Policy.find({ status: 'Active' });
      if (activePolicies.length === 0) return;

      const userIds = activePolicies.map(p => p.userId);
      const users = await User.find({ _id: { $in: userIds } });
      
      const uniqueZones = [...new Set(users.map(u => JSON.stringify({ city: u.city, zone: u.zone, lat: u.location?.lat, lng: u.location?.lng })))].map(JSON.parse);

      // 2. Fetch live data for each zone and check thresholds
      for (const zoneInfo of uniqueZones) {
        const factors = await ActuarialService.getDynamicFactors(zoneInfo.city, zoneInfo.zone, zoneInfo.lat, zoneInfo.lng);
        
        // 3. Threshold Check (Parametric Logic)
        if (factors.rainProb > 0.8) {
           console.log(`[Cron] 🚨 High Rain detected in ${zoneInfo.zone}. Triggering event...`);
           await TriggerService.processEvent({
             eventType: 'Rain',
             value: factors.rainProb * 100, // percentage
             threshold: 80,
             location: { city: zoneInfo.city, zone: zoneInfo.zone }
           });
        }
        
        if (factors.pollutionIndex > 300) {
           console.log(`[Cron] 🚨 Severe AQI detected in ${zoneInfo.zone}. Triggering event...`);
           await TriggerService.processEvent({
             eventType: 'Pollution',
             value: factors.pollutionIndex,
             threshold: 300,
             location: { city: zoneInfo.city, zone: zoneInfo.zone }
           });
        }
      }
      
      console.log('[Cron] Climate check completed successfully.');
    } catch (err) {
      console.error('[Cron] Error during climate check:', err);
    }
  }
}

module.exports = new CronService();
