const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');

router.get('/stats', AdminController.getStats);
router.get('/users', AdminController.getAllUsers);
router.get('/events', AdminController.getAllEvents);
router.get('/claims', AdminController.getAllClaims);
router.post('/process-claim', AdminController.processClaim);
router.get('/referrals/leaderboard', AdminController.getReferralLeaderboard);

module.exports = router;
