const express = require('express');
const router = express.Router();
const PolicyController = require('../controllers/PolicyController');

router.post('/calculate-premium', PolicyController.calculatePremium);
router.post('/', PolicyController.createPolicy);
router.get('/user/:userId', PolicyController.getActivePolicy);

module.exports = router;
