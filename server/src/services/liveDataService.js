const axios = require('axios');

/**
 * Live Data Service - Phase 3 Data Layer
 * Handles fetching real-world environmental data using lat/lon.
 */
class LiveDataService {
  constructor() {
    this.weatherApiKey = process.env.OPENWEATHER_API_KEY;
    this.aqiApiKey = process.env.AQI_API_KEY;
    this.cache = new Map(); // Basic in-memory fallback
  }

  /**
   * Normalizes raw API data to 0-100 scale for TF model consumption
   */
  normalize(value, min, max) {
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  }

  async getLiveRiskFactors(lat, lon) {
    const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
    
    try {
      // 1. Fetch Real Weather (Rain intensity)
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.weatherApiKey}`;
      const weatherRes = await axios.get(weatherUrl);
      
      // Rain in last 1h (mm). Standard trigger: 50mm = 100% risk
      const rainAmount = weatherRes.data.rain ? (weatherRes.data.rain['1h'] || 0) : 0;
      const rain_risk = this.normalize(rainAmount, 0, 50);

      // 2. Fetch Real AQI
      const aqiUrl = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${this.aqiApiKey}`;
      const aqiRes = await axios.get(aqiUrl);
      
      // AQI Scale: 0-300+ (300 = Critical/Hazardous)
      const aqiValue = aqiRes.data.data.aqi || 0;
      const pollution_risk = this.normalize(aqiValue, 50, 300);

      const factors = {
        rain_risk,
        pollution_risk,
        traffic_risk: 45, // Mocked for hackathon scope
        zone_risk: 30     // Mocked based on historical zone density
      };

      this.cache.set(cacheKey, factors);
      return factors;

    } catch (err) {
      console.error(`[LiveDataService] API Failure at ${cacheKey}:`, err.message);
      // Fail-Safe: Return last known data or conservative defaults
      return this.cache.get(cacheKey) || {
        rain_risk: 10,
        pollution_risk: 10,
        traffic_risk: 20,
        zone_risk: 10,
        isFallback: true
      };
    }
  }
}

module.exports = new LiveDataService();
