const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  policyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: false },
  date: { type: Date, default: Date.now },
  event: { type: String, required: true },
  eventIcon: { type: String },
  description: String,
  lostHours: { type: Number, required: true },
  hourlyRate: { type: Number, required: true },
  payout: { type: Number, required: true },
  status: { type: String, enum: ['Processing', 'Paid', 'Rejected', 'Fraud Flagged'], default: 'Processing' },
  txnId: String,
  paidDate: Date,
  fraudAlerts: [{ type: String }],
  steps: [
    {
      step: String,
      completed: { type: Boolean, default: false },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Claim', claimSchema);
