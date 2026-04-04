const Claim = require('../models/Claim');
const User = require('../models/User');
const Policy = require('../models/Policy');

/**
 * Claim Controller handles claim history and management
 */
class ClaimController {
  /**
   * Submit a manual claim query
   */
  static async requestClaim(req, res) {
    try {
      const { userId, event, date, lostHours, description } = req.body;
      
      const user = await User.findById(userId);
      const policy = await Policy.findOne({ userId, status: 'Active' });

      if (!policy) {
        return res.status(400).json({ message: 'No active policy found' });
      }

      const hourlyRate = (user.avgIncome || 1000) / 10;
      const payout = Math.round(lostHours * hourlyRate);

      const claim = new Claim({
        userId,
        policyId: policy._id,
        date: date || new Date(),
        event,
        eventIcon: '📝', // Note icon to signify it was a manual entry
        description: `[Manual Query] ${description}`,
        lostHours,
        hourlyRate,
        payout,
        status: 'Processing',
        steps: [
          { step: 'Claim Submitted', completed: true },
          { step: 'Manual Review', completed: false },
          { step: 'Fraud Check', completed: false },
          { step: 'Payout Initiated', completed: false }
        ]
      });

      await claim.save();
      res.status(201).json(claim);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Get all claims for a user
   */
  static async getClaims(req, res) {
    try {
      const claims = await Claim.find({ userId: req.params.userId }).sort({ createdAt: -1 });
      res.json(claims);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Get claim details
   */
  static async getClaimDetails(req, res) {
    try {
      const claim = await Claim.findById(req.params.id);
      if (!claim) return res.status(404).json({ message: 'Claim not found' });
      res.json(claim);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Manual payout (for admin use)
   */
  static async processPayout(req, res) {
    try {
      const claim = await Claim.findById(req.params.id);
      if (!claim) return res.status(404).json({ message: 'Claim not found' });
      
      claim.status = 'Paid';
      claim.txnId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      claim.paidDate = new Date();
      claim.steps[3].completed = true;
      
      await claim.save();
      res.json(claim);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = ClaimController;
