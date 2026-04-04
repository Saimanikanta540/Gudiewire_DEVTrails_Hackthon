const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');
const Policy = require('./src/models/Policy');
const Claim = require('./src/models/Claim');
const Event = require('./src/models/Event');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/parametric_insurance';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Policy.deleteMany({});
    await Claim.deleteMany({});
    await Event.deleteMany({});

    console.log('Database cleared.');

    // 1. Create a Sample User (Gig Worker)
    const user = new User({
      _id: new mongoose.Types.ObjectId('660000000000000000000001'),
      name: 'Badari Swiggy Partner',
      email: 'badari@example.com',
      password: 'password123',
      city: 'Hyderabad',
      zone: 'KPHB',
      workType: 'Swiggy',
      avgIncome: 1200,
      dailyIncome: 1100,
      workHours: 10,
      riskProfile: 'Medium',
      location: { lat: 17.44, lng: 78.34 },
      referralCode: 'BADARI89J2'
    });
    await user.save();
    console.log('Sample User created.');

    // 2. Create an Active Policy
    const policy = new Policy({
      userId: user._id,
      planName: 'Essential',
      coverageAmount: 15000,
      weeklyPremium: 450,
      coveredEvents: ['Rain', 'Pollution'],
      riskScore: 65,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });
    await policy.save();
    console.log('Active Policy created.');

    // 3. Create a Triggered Event (Mocking a past rain event)
    const event = new Event({
      eventType: 'Rain',
      value: 45, // 45mm rain
      threshold: 20,
      location: { city: 'Hyderabad', zone: 'KPHB' },
      isTriggered: true,
      description: 'Heavy Monsoon rain detected via OpenWeather API.'
    });
    await event.save();

    // 4. Create sample Claims
    const claims = [
      {
        userId: user._id,
        policyId: policy._id,
        eventId: event._id,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        event: 'Rain',
        eventIcon: '🌧️',
        description: 'Heavy rain disruption in KPHB. Auto-triggered claim.',
        lostHours: 4.5,
        hourlyRate: 120,
        payout: 540,
        status: 'Paid',
        txnId: 'TXN-ABC123XYZ',
        paidDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        steps: [
            { step: 'Event Detected', completed: true },
            { step: 'Claim Generated', completed: true },
            { step: 'Fraud Check Passed', completed: true },
            { step: 'Payout Initiated', completed: true }
        ]
      },
      {
        userId: user._id,
        policyId: policy._id,
        eventId: event._id,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        event: 'Pollution',
        eventIcon: '💨',
        description: 'Severe AQI alert (>300) in work zone.',
        lostHours: 3,
        hourlyRate: 120,
        payout: 360,
        status: 'Paid',
        txnId: 'TXN-PQR456LMN',
        paidDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        steps: [
            { step: 'Event Detected', completed: true },
            { step: 'Claim Generated', completed: true },
            { step: 'Fraud Check Passed', completed: true },
            { step: 'Payout Initiated', completed: true }
        ]
      }
    ];

    await Claim.insertMany(claims);
    console.log('Sample Claims created.');

    console.log('Database Seeding Completed Successfully! 🚀');
    process.exit();
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedData();
