const TriggerService = require('../services/TriggerService');

/**
 * Event Controller handles parametric triggers
 */
class EventController {
  /**
   * Simulate a parametric event (Rain, Pollution etc)
   */
  static async triggerEvent(req, res) {
    try {
      const { eventType, value, threshold, location, description } = req.body;
      
      const result = await TriggerService.processEvent({
        eventType,
        value,
        threshold,
        location,
        description
      });

      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = EventController;
