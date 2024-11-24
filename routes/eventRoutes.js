const express = require('express');
const {
  getPaginatedEvents,
  logEvent,
  serveDashboard,
} = require('../controllers/eventController');

const router = express.Router();

// Routes
router.post('/log-event', logEvent);
router.get('/', getPaginatedEvents);
router.get('/dashboard', serveDashboard);

module.exports = router;
