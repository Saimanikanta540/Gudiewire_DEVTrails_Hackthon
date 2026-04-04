const express = require('express');
const router = express.Router();
const ClaimController = require('../controllers/ClaimController');

router.post('/request', ClaimController.requestClaim);
router.get('/user/:userId', ClaimController.getClaims);
router.get('/:id', ClaimController.getClaimDetails);
router.post('/:id/payout', ClaimController.processPayout);

module.exports = router;
