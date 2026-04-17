const Claim = require('../models/Claim');
const Policy = require('../models/Policy');
const Event = require('../models/Event');

/**
 * Analytics Controller - Production Data Layer
 */
class AnalyticsController {
  /**
   * GET /analytics/risk-trends
   */
  async getRiskTrends(req, res) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Aggregate events by day and type
      const trends = await Event.aggregate([
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

      res.json(trends);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * GET /analytics/loss-ratio
   * Industry standard KPI: (Claims Payout / Total Premium)
   */
  async getLossRatio(req, res) {
    try {
      const claimsSum = await Claim.aggregate([
        { $match: { status: "Paid" } },
        { $group: { _id: null, total: { $sum: "$payout" } } }
      ]);

      const premiumSum = await Policy.aggregate([
        { $match: { status: "Active" } },
        { $group: { _id: null, total: { $sum: "$weeklyPremium" } } }
      ]);

      const totalPaid = claimsSum[0]?.total || 0;
      const totalCollected = premiumSum[0]?.total || 0;

      res.json({
        totalPaid,
        totalCollected,
        lossRatio: totalCollected > 0 ? (totalPaid / totalCollected).toFixed(2) : 0,
        healthStatus: (totalPaid / totalCollected) < 0.6 ? "Healthy" : "Risk: High Payouts"
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new AnalyticsController();
