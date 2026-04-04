const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/policies', require('./routes/policyRoutes'));
app.use('/api/claims', require('./routes/claimRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Parametric Insurance API is healthy' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

module.exports = app;
