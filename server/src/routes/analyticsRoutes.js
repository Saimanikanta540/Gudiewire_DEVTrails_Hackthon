const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Policy = require('../models/Policy');
const Claim = require('../models/Claim');

/**
 * Analytics Controller (Inline for simplicity)
 */
router.get('/worker/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    const claims = await Claim.find({ userId, status: 'Paid' });
    const earningsProtected = claims.reduce((sum, c) => sum + c.payout, 0);
    const activePolicy = await Policy.findOne({ userId, status: 'Active' });

    // Generate user-specific weekly earnings based on their dailyIncome
    const baseIncome = user ? (user.dailyIncome || 800) : 800;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyEarnings = days.map(day => {
      const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
      const disruptions = Math.floor(Math.random() * 5);
      return {
        day,
        earnings: Math.round(baseIncome * randomFactor),
        disruptions
      };
    });

    res.json({
      earningsProtected,
      claimsCount: claims.length,
      weeklyPremium: activePolicy ? activePolicy.weeklyPremium : 0,
      riskScore: activePolicy ? activePolicy.riskScore : 0,
      weeklyEarnings // Add this for the chart
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/admin', async (req, res) => {
  try {
    const totalClaims = await Claim.countDocuments();
    const totalPayout = await Claim.aggregate([{ $group: { _id: null, total: { $sum: '$payout' } } }]);
    const fraudAlerts = await Claim.countDocuments({ status: 'Fraud Flagged' });
    const lossRatio = 0.45; // Mock for now

    res.json({
      totalClaims,
      totalPayout: totalPayout[0] ? totalPayout[0].total : 0,
      fraudAlerts,
      lossRatio
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
