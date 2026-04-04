const Policy = require('../models/Policy');
const User = require('../models/User');
const ActuarialService = require('../services/ActuarialService');

/**
 * Policy Controller handles insurance policy management
 */
class PolicyController {
  /**
   * Calculate premium for a potential policy
   */
  static async calculatePremium(req, res) {
    try {
      const { userId, planName } = req.body;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const factors = await ActuarialService.getDynamicFactors(user.city, user.zone);
      const riskScore = ActuarialService.calculateRiskScore(factors);
      const premium = ActuarialService.calculatePremium(user, riskScore);

      res.json({
        planName,
        weeklyPremium: premium,
        riskScore,
        factors
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Create a new policy
   */
  static async createPolicy(req, res) {
    try {
      const { userId, planName, coverageAmount, weeklyPremium, coveredEvents, riskScore } = req.body;
      
      const policy = new Policy({
        userId,
        planName,
        coverageAmount,
        weeklyPremium,
        coveredEvents,
        riskScore,
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) 
      });

      await policy.save();

      // Referral Reward System:
      // If this user was referred by someone, reward the referrer
      const user = await User.findById(userId);
      if (user && user.referredBy) {
        // Only reward if it's the user's first policy
        const policyCount = await Policy.countDocuments({ userId });
        if (policyCount === 1) {
          await User.findByIdAndUpdate(user.referredBy, {
            $inc: { referralCount: 1, referralEarnings: 200 } // ₹200 reward
          });
        }
      }

      res.status(201).json(policy);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Get active policy for user
   */
  static async getActivePolicy(req, res) {
    try {
      const policy = await Policy.findOne({ userId: req.params.userId, status: 'Active' });
      res.json(policy);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = PolicyController;
