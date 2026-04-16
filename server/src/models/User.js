const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Delivery Partner' },
  city: { type: String, required: true },
  zone: { type: String, required: true },
  avatar: { type: String, default: '👨‍💼' },
  dailyIncome: { type: Number, default: 0 },
  workHours: { type: Number, default: 0 },
  avgIncome: { type: Number, default: 0 },
  workType: { type: String, enum: ['Zomato', 'Swiggy', 'Amazon', 'Other', 'Uber', 'Ola', 'Dunzo', 'Porter'], required: true },
  employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Freelance'], default: 'Full-time' },
  vehicleType: { type: String, enum: ['2-Wheeler', '3-Wheeler', '4-Wheeler', 'Cycle'], default: '2-Wheeler' },
  experienceLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], default: 'Beginner' },
  hasHealthInsurance: { type: Boolean, default: false },
  riskProfile: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  location: {
    lat: Number,
    lng: Number
  },
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referralCount: { type: Number, default: 0 },
  referralEarnings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
