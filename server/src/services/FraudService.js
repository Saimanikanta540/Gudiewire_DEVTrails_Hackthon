/**
 * Fraud Service handles risk and fraud detection logic for claims
 */
class FraudService {
  /**
   * Validate a claim against potential fraud
   * @param {Object} claimData - { userId, location, eventLocation, lastClaimDate }
   * @returns {Object} - { isFraud: Boolean, alerts: Array }
   */
  static async checkFraud(claimData) {
    const { userLocation, eventLocation, userId, eventType } = claimData;
    const alerts = [];
    let isFraud = false;

    // 1. GPS Mismatch Detection
    if (userLocation && eventLocation) {
      const distance = this.calculateDistance(
        userLocation.lat, userLocation.lng,
        eventLocation.lat, eventLocation.lng
      );
      
      if (distance > 50) { // If user is more than 50km from event location
        alerts.push('GPS Mismatch: User location does not match event location.');
        isFraud = true;
      }
    }

    // 2. Unrealistic Activity Detection
    // This could involve checking if the user claimed too many hours
    if (claimData.lostHours > 16) {
      alerts.push('Unrealistic Activity: Claimed lost hours exceed maximum working day.');
      isFraud = true;
    }

    return { isFraud, alerts };
  }

  /**
   * Helper: Calculate distance between two coordinates in km
   */
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

module.exports = FraudService;
