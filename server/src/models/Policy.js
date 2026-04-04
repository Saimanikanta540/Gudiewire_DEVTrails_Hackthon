const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planName: { type: String, enum: ['Basic', 'Essential', 'Premium'], required: true },
  coverageAmount: { type: Number, required: true },
  weeklyPremium: { type: Number, required: true },
  coveredEvents: [{ type: String }],
  exclusions: { type: [String], default: ['War', 'Pandemic', 'Terrorism', 'Fraud'] },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  status: { type: String, enum: ['Active', 'Expired', 'Cancelled'], default: 'Active' },
  riskScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Policy', policySchema);
