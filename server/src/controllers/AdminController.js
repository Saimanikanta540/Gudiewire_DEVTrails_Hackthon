const User = require('../models/User');
const Event = require('../models/Event');
const Claim = require('../models/Claim');
const Policy = require('../models/Policy');
const PaymentService = require('../services/PaymentService');

class AdminController {
  /**
   * Get overall dashboard statistics
   */
  static async getStats(req, res) {
    try {
      const totalUsers = await User.countDocuments({ role: { $ne: 'Admin' } });
      const totalClaims = await Claim.countDocuments();
      const totalEvents = await Event.countDocuments();
      const totalPolicies = await Policy.countDocuments();
      
      const totalPayout = await Claim.aggregate([
        { $group: { _id: null, total: { $sum: '$payout' } } }
      ]);

      const referralStats = await User.aggregate([
        { $match: { referredBy: { $ne: null } } },
        { $count: 'referredUsers' }
      ]);

      res.json({
        totalUsers,
        totalClaims,
        totalEvents,
        totalPolicies,
        totalPayout: totalPayout.length > 0 ? totalPayout[0].total : 0,
        referredUsers: referralStats.length > 0 ? referralStats[0].referredUsers : 0
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Get all users with their referral info
   */
  static async getAllUsers(req, res) {
    try {
      const users = await User.find({ role: { $ne: 'Admin' } })
        .populate('referredBy', 'name email')
        .sort({ createdAt: -1 });
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Get all climate events
   */
  static async getAllEvents(req, res) {
    try {
      const events = await Event.find().sort({ timestamp: -1 });
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Get all claims
   */
  static async getAllClaims(req, res) {
    try {
      const claims = await Claim.find()
        .populate('userId', 'name email city')
        .sort({ date: -1 });
      res.json(claims);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Get referral leaderboard
   */
  static async getReferralLeaderboard(req, res) {
    try {
      const leaderboard = await User.find({ referralCount: { $gt: 0 } })
        .select('name email referralCount referralEarnings')
        .sort({ referralCount: -1 })
        .limit(10);
      res.json(leaderboard);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Approve or Reject a claim
   */
  static async processClaim(req, res) {
    try {
      const { claimId, status } = req.body;
      const claim = await Claim.findById(claimId).populate('userId');
      
      if (!claim) return res.status(404).json({ message: 'Claim not found' });

      claim.status = status;
      if (status === 'Paid') {
        // Integrate Razorpay via PaymentService
        const paymentResult = await PaymentService.processPayout(claim, claim.userId);
        
        if (paymentResult.success) {
          claim.txnId = paymentResult.txnId;
          claim.paidDate = paymentResult.timestamp;
          claim.steps[2].completed = true; // Fraud Check
          claim.steps[3].completed = true; // Payout
        } else {
          return res.status(500).json({ message: 'Payout failed: ' + paymentResult.error });
        }
      } else if (status === 'Rejected') {
        claim.description += ' (Rejected by Admin)';
      }

      await claim.save();
      res.json(claim);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = AdminController;
