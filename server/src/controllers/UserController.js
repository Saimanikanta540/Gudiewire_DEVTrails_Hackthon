const User = require('../models/User');

/**
 * User Controller handles user registration and profile management
 */
class UserController {
  /**
   * Register a new user (gig worker)
   */
  static async register(req, res) {
    try {
      const { name, email, password, city, zone, workType, avgIncome, dailyIncome, workHours, referralCode } = req.body;
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Generate a unique referral code based on name and random string
      const personalReferralCode = name.split(' ')[0].toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();

      // Check if this user was referred by someone
      let referrer = null;
      if (referralCode) {
        referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
      }

      const user = new User({
        name,
        email,
        password, 
        city,
        zone,
        workType,
        avgIncome,
        dailyIncome,
        workHours,
        referralCode: personalReferralCode,
        referredBy: referrer ? referrer._id : null,
        location: { lat: 17.44, lng: 78.34 } 
      });

      await user.save();

      // If referred, increment referrer's count
      if (referrer) {
        referrer.referralCount += 1;
        await referrer.save();
      }

      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Login user
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      // In a production app, use bcrypt.compare here
      if (user.password !== password) {
         return res.status(401).json({ message: 'Invalid email or password' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Get user profile
   */
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Update user persona/profile
   */
  static async updateProfile(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = UserController;
