const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const AnalyticsController = require('./controllers/AnalyticsController');

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/policies', require('./routes/policyRoutes'));
app.use('/api/claims', require('./routes/claimRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Production Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'LIVE', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    automation: 'Cron Engine Active'
  });
});

// Analytics Extended Endpoints (Production Analytics)
app.get('/api/analytics/risk-trends', (req, res) => AnalyticsController.getRiskTrends(req, res));
app.get('/api/analytics/loss-ratio', (req, res) => AnalyticsController.getLossRatio(req, res));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

module.exports = app;
