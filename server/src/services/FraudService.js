const Claim = require('../models/Claim');

/**
 * Fraud Service - Advanced Production Layer
 * Detects location spoofing and inactivity fraud.
 */
class FraudService {
  /**
   * Comprehensive multi-gate fraud check
   */
  async checkFraud(claimData) {
    const { userLocation, eventLocation, userId, userPersona } = claimData;
    let isFraud = false;
    const alerts = [];

    // 1. GPS Mismatch Guard (Haversine Distance)
    if (userLocation && eventLocation) {
      const dist = this.getDistance(userLocation.lat, userLocation.lng, eventLocation.lat, eventLocation.lng);
      if (dist > 15) { // 15km threshold
        isFraud = true;
        alerts.push(`GPS Mismatch: Discrepancy of ${dist.toFixed(1)}km detected.`);
      }
    }

    // 2. Activity / Inconsistency Check
    // If a worker has 0 daily hours/income recorded but triggers a "lost hours" claim
    if (userPersona.workHours === 0 || userPersona.avgIncome === 0) {
      isFraud = true;
      alerts.push("Inactivity Fraud: No active work profile data found for today.");
    }

    // 3. Velocity / Frequent Claim Check
    const recentClaims = await Claim.countDocuments({
      userId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    if (recentClaims >= 2) {
      isFraud = true;
      alerts.push(`Velocity Attack: ${recentClaims} claims in 24hrs.`);
    }

    return { isFraud, alerts };
  }

  getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }
}

module.exports = new FraudService();
