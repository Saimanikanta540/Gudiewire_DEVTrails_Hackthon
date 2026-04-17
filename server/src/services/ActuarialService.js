const AIService = require('./AIService');
const LiveDataService = require('./liveDataService');

/**
 * Actuarial Service - Unified Real-Time Layer
 * Standardizes risk assessment for the UI and Policy creation.
 */
class ActuarialService {
  /**
   * Evaluate risk using RiskPulse AI and Real-Time APIs
   */
  static async evaluateRisk(factors, persona = {}) {
    // 🔥 [ACTUARIAL_AUDIT] - Tracing factor transition to AI
    console.log(`[ACTUARIAL_AUDIT] Data Feed -> RainRisk:${factors.rain_risk} PollRisk:${factors.pollution_risk} Source:${factors.source}`);

    // Standardizing raw factor mapping for AI brain
    const rawFactors = {
      rain_risk: factors.rain_risk,
      pollution_risk: factors.pollution_risk,
      traffic_risk: factors.traffic_risk,
      zone_risk: factors.zone_risk
    };
    
    return await AIService.calculateStabilityScore(rawFactors, persona);
  }

  /**
   * Calculate Premium using Actuarial Pure Premium Model
   */
  static calculatePremium(userData, riskScore) {
    const expenseLoading = 0.15; 
    const profitMargin = 0.10;   
    const riskSafetyBuffer = 5;  
    
    const avgDailyIncome = userData.avgIncome || 800;
    const severity = 0.6; 
    const frequency = (riskScore / 100) * 0.4; 
    
    const purePremium = frequency * (avgDailyIncome * severity);
    const grossPremium = (purePremium / (1 - (expenseLoading + profitMargin))) + riskSafetyBuffer;
    
    return {
      weeklyPremium: Math.max(20, Math.round(grossPremium)),
      purePremium: Math.round(purePremium),
      expectedLoss: Math.round(purePremium),
      riskBuffer: riskSafetyBuffer
    };
  }

  /**
   * UNIFIED DATA ENTRY POINT: Replaces all mock data with Real APIs
   * Ensures UI and Backend are always in sync.
   */
  static async getDynamicFactors(city, zone, lat, lon) {
    // Audit Note: Removed locationRisks switch-case and Math.random()
    // Now consistently calling LiveDataService
    return await LiveDataService.getLiveRiskFactors(lat, lon);
  }
}

module.exports = ActuarialService;
