const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventType: { type: String, enum: ['Rain', 'Pollution', 'Curfew', 'Traffic'], required: true },
  value: { type: Number, required: true }, // e.g., rainfall in mm, AQI index
  threshold: { type: Number, required: true },
  location: {
    city: String,
    zone: String,
    lat: Number,
    lng: Number
  },
  timestamp: { type: Date, default: Date.now },
  description: String,
  isTriggered: { type: Boolean, default: false },
});

module.exports = mongoose.model('Event', eventSchema);
