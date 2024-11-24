const crypto = require('crypto');
const Event = require('../models/Event');
const path = require('path');

// Helper to check event consistency
const checkInconsistencies = (event) => {
  const issues = [];
  if (!event.eventType) issues.push("Missing eventType");
  if (!event.sourceAppId) issues.push("Missing sourceAppId");
  if (!event.dataPayload || typeof event.dataPayload !== "object") issues.push("Invalid or missing dataPayload");
  return issues;
};

// Fetching paginated, sorted events with filters
const getPaginatedEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'timestamp', order = 'desc', timestampStart, timestampEnd, eventType, sourceAppId } = req.query;
    const skip = (page - 1) * limit;

    const filters = {};
    if (timestampStart) filters.timestamp = { $gte: new Date(timestampStart) };
    if (timestampEnd) filters.timestamp = { ...filters.timestamp, $lte: new Date(timestampEnd) };
    if (eventType) filters.eventType = eventType;
    if (sourceAppId) filters.sourceAppId = sourceAppId;

    const events = await Event.find(filters)
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Event.countDocuments(filters);

    // Attachig the inconsistencies to events
    const eventsWithInconsistencies = events.map(event => ({
      ...event._doc,
      inconsistencies: checkInconsistencies(event)
    }));

    res.status(200).json({
      events: eventsWithInconsistencies,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events. Please check server logs.' });
  }
};

// Logging an event
const logEvent = async (req, res) => {
  try {
    const { eventType, sourceAppId, dataPayload } = req.body;

    if (!eventType || !sourceAppId || !dataPayload) {
      return res.status(400).json({ error: 'The fields are empty, which are invalid event logs.' });
    }

    let parsedDataPayload;
    try {
      parsedDataPayload = JSON.parse(dataPayload);
    } catch (error) {
      parsedDataPayload = {}; 
    }

    const inconsistencies = checkInconsistencies({
      eventType,
      sourceAppId,
      dataPayload: parsedDataPayload,
    });

    if (inconsistencies.length > 0) {
      return res.status(400).json({
        error: 'Invalid event log due to inconsistencies.',
        inconsistencies,
      });
    }

    const lastEvent = await Event.findOne().sort({ timestamp: -1 });
    const previousHash = lastEvent ? lastEvent.hash : 'GENESIS_HASH';
    const dataToHash = `${eventType}${sourceAppId}${JSON.stringify(parsedDataPayload)}${previousHash}`;
    const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');

    const newEvent = new Event({
      eventType,
      sourceAppId,
      dataPayload: parsedDataPayload,
      previousHash,
      hash,
    });
    await newEvent.save();

    res.status(201).json({ message: 'Event logged successfully.', event: newEvent });
  } catch (error) {
    console.error('Error logging event:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Serving dashboard HTML
const serveDashboard = (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
};

module.exports = {
  getPaginatedEvents,
  logEvent,
  serveDashboard,
};
