const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Event = require('../models/Event');
const Policy = require('../models/Policy');

// Helper to format dates
const getDaysArray = (numDays) => {
  const days = [];
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
  }
  return days;
};

// Get Worker Analytics (Mocked heavily in Phase 1/2, now using real aggregation)
router.get('/worker/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Calculate total protected earnings (total payouts)
    const payouts = await Claim.aggregate([
      { $match: { userId: userId, status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$payout' } } }
    ]);
    
    const earningsProtected = payouts.length > 0 ? payouts[0].total : 0;
    const claimsCount = await Claim.countDocuments({ userId: userId, status: 'Paid' });

    // Generate weekly chart data
    const days = getDaysArray(7);
    const weeklyEarnings = days.map(day => ({
      day,
      earnings: Math.floor(Math.random() * 500) + 500, // Base earnings still simulated for UI shape
      disruptions: 0 // Will populate below
    }));

    // Add actual claim payouts to the disruptions bar
    const last7DaysClaims = await Claim.find({ 
      userId, 
      status: 'Paid',
      date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    last7DaysClaims.forEach(claim => {
       const claimDayStr = claim.date.toLocaleDateString('en-US', { weekday: 'short' });
       const dayEntry = weeklyEarnings.find(d => d.day === claimDayStr);
       if (dayEntry) {
         dayEntry.disruptions += claim.payout;
       }
    });

    res.json({
      earningsProtected,
      claimsCount,
      weeklyEarnings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Analytics Trends
router.get('/admin', async (req, res) => {
  try {
    // Risk Trends: Aggregate Events by type over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const events = await Event.aggregate([
      { $match: { timestamp: { $gte: thirtyDaysAgo } } },
      { 
        $group: { 
          _id: { 
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            type: "$eventType"
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);

    res.json({
       trendData: events
    });
  } catch(err) {
     res.status(500).json({ error: err.message });
  }
});

module.exports = router;
