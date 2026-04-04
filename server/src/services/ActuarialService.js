const AIService = require('./AIService');

/**
 * Actuarial Service handles risk calculations and premium pricing logic
 */
class ActuarialService {
  /**
   * Calculate Dynamic Risk Score based on environmental factors
   * @param {Object} factors - { rainProb, pollutionIndex, trafficLevel, zoneRisk }
   * @returns {Number} - Score from 0 to 100
   */
  static calculateRiskScore(factors) {
    const { rainProb, pollutionIndex, trafficLevel, zoneRisk } = factors;
    
    // Normalize factors to 0-1 range for the neural network
    const rain = rainProb || 0; // 0 to 1
    const pollution = (pollutionIndex || 0) / 500; // AQI 0-500 -> 0 to 1
    const traffic = (trafficLevel || 0) / 100; // 0-100 index -> 0 to 1
    const zone = (zoneRisk || 0) / 10; // 0-10 risk rating -> 0 to 1
    
    // PREDICT RISK SCORE USING THE TRAINED TENSORFLOW MODEL
    return AIService.predictRisk(rain, pollution, traffic, zone);
  }

  /**
   * Calculate Weekly Premium using actuarial model
   * premium = expected_loss + profit_margin
   * expected_loss = probability_of_event * avg_income_loss
   */
  static calculatePremium(userData, riskScore) {
    const basePrice = 100; // Base administrative cost
    const profitMargin = 50; // Fixed profit margin
    
    // avg_income_loss estimation
    // If a delivery partner earns 1000/day, a major event might cause 50% loss
    const avgDailyIncome = userData.avgIncome || 1000;
    const avgIncomeLoss = avgDailyIncome * 0.5; 
    
    const probabilityOfEvent = riskScore / 100;
    const expectedLoss = probabilityOfEvent * avgIncomeLoss;
    
    const calculatedPremium = expectedLoss + profitMargin + basePrice;
    
    return Math.round(calculatedPremium);
  }

  /**
   * Get dynamic factors (mocked for now, in real app would call weather/traffic APIs)
   * It uses city and zone to generate hyper-local baseline risk factors.
   */
  static async getDynamicFactors(city, zone) {
    // Base risk profiles to simulate different geographic and environmental conditions
    const locationRisks = {
      'Mumbai': { rainBase: 0.85, pollutionBase: 150, trafficBase: 85, zoneRiskBase: 8 },
      'Delhi': { rainBase: 0.20, pollutionBase: 420, trafficBase: 90, zoneRiskBase: 7 },
      'Bangalore': { rainBase: 0.60, pollutionBase: 120, trafficBase: 95, zoneRiskBase: 6 },
      'Hyderabad': { rainBase: 0.40, pollutionBase: 180, trafficBase: 75, zoneRiskBase: 5 },
      'Default': { rainBase: 0.30, pollutionBase: 100, trafficBase: 60, zoneRiskBase: 4 }
    };

    const cityKey = city || 'Default';
    // Match city or fallback to default
    const base = locationRisks[cityKey] || locationRisks['Default'];

    // Add slight randomness (noise) to simulate live real-time API fluctuations (+/- 10%)
    const noise = () => (Math.random() * 0.2) - 0.1;

    return {
      rainProb: Math.max(0, Math.min(1, base.rainBase + noise())),
      pollutionIndex: Math.round(Math.max(0, Math.min(500, base.pollutionBase + (noise() * 100)))),
      trafficLevel: Math.round(Math.max(0, Math.min(100, base.trafficBase + (noise() * 20)))),
      zoneRisk: Math.max(0, Math.min(10, base.zoneRiskBase + (noise() * 2)))
    };
  }
}

module.exports = ActuarialService;
