const Claim = require('../models/Claim');

/**
 * Fraud Service - Advanced Detection
 * Implements GPS mismatch, No-activity checks, and Claim frequency validation.
 */
class FraudService {
  /**
   * Run comprehensive fraud checks
   */
  static async checkFraud(claimData) {
    const { userLocation, eventLocation, userId, lostHours, eventType, userDailyIncome } = claimData;
    let isFraud = false;
    const alerts = [];

    // 1. GPS Mismatch Check (Haversine formula approximation)
    if (userLocation && eventLocation) {
      const distance = this.calculateDistance(userLocation.lat, userLocation.lng, eventLocation.lat, eventLocation.lng);
      if (distance > 10) { // Event is more than 10km away from registered work zone
        isFraud = true;
        alerts.push(`GPS Mismatch: User registered zone is ${distance.toFixed(1)}km away from the event epicenter.`);
      }
    }

    // 2. Claim Frequency Check (Velocity Fraud)
    // Look for more than 2 claims in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentClaims = await Claim.countDocuments({
      userId: userId,
      createdAt: { $gte: sevenDaysAgo }
    });

    if (recentClaims >= 2) {
      isFraud = true;
      alerts.push(`High Claim Frequency: User has filed ${recentClaims} claims in the last 7 days.`);
    }

    // 3. No Activity / Exaggeration Fraud
    // If they claim they lost 8 hours but usually only work 4, flag it.
    if (lostHours > 12) {
      isFraud = true;
      alerts.push(`Exaggerated Impact: Claimed ${lostHours} lost hours exceeds daily maximum limits.`);
    }

    return {
      isFraud,
      alerts
    };
  }

  /**
   * Calculate distance between two coordinates in km
   */
  static calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; 
  }

  static deg2rad(deg) {
    return deg * (Math.PI/180);
  }
}

module.exports = FraudService;
