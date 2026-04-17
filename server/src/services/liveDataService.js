const axios = require('axios');

/**
 * Live Data Service - Unified Production Data Layer
 * Provides consistent real-world data for UI, AI Inference, and Cron Triggers.
 */
class LiveDataService {
  constructor() {
    this.weatherApiKey = process.env.OPENWEATHER_API_KEY;
    this.aqiApiKey = process.env.AQI_API_KEY;
    this.cache = new Map(); // Reliability fallback
  }

  /**
   * Normalizes raw API data to 0-100 scale
   */
  normalize(value, min, max) {
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  }

  async getLiveRiskFactors(lat, lon) {
    // Default coordinates if missing (New Delhi)
    const latitude = lat || 28.61;
    const longitude = lon || 77.20;
    const cacheKey = `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
    
    try {
      // 1. Fetch Real Weather (OpenWeather API)
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.weatherApiKey}`;
      const weatherRes = await axios.get(weatherUrl, { timeout: 5000 });
      
      const rainAmount = weatherRes.data.rain ? (weatherRes.data.rain['1h'] || 0) : 0;
      const rain_risk = this.normalize(rainAmount, 0, 50); // 50mm/h is critical

      // 2. Fetch Real AQI (WAQI API)
      const aqiUrl = `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${this.aqiApiKey}`;
      const aqiRes = await axios.get(aqiUrl, { timeout: 5000 });
      
      const aqiValue = aqiRes.data.data.aqi || 0;
      const pollution_risk = this.normalize(aqiValue, 50, 300); // 300 AQI is hazardous

      const factors = {
        rain_risk: Math.round(rain_risk),
        pollution_risk: Math.round(pollution_risk),
        traffic_risk: 40, // Industrial average for urban centers
        zone_risk: 25,    // Standard zonal risk constant
        timestamp: new Date().toISOString(),
        source: "REAL_API"
      };

      // 🔥 [DATA_AUDIT] - Verification Logging for Audit Compliance
      console.log(`[DATA_AUDIT] REAL API | Lat:${latitude} Lon:${longitude} Rain:${rainAmount}mm AQI:${aqiValue} Time:${factors.timestamp}`);

      this.cache.set(cacheKey, factors);
      return factors;

    } catch (err) {
      console.error(`[LiveDataService] API Failure/Rate-limit. Falling back to cache for ${cacheKey}`);
      return this.cache.get(cacheKey) || {
        rain_risk: 15,
        pollution_risk: 20,
        traffic_risk: 30,
        zone_risk: 10,
        source: "FALLBACK_CACHE",
        error: err.message
      };
    }
  }
}

module.exports = new LiveDataService();
