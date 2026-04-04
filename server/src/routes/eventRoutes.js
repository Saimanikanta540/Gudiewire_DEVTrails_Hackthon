const express = require('express');
const router = express.Router();
const EventController = require('../controllers/EventController');

router.post('/trigger', EventController.triggerEvent);

module.exports = router;
