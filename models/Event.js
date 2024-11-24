const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    index: true, 
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  sourceAppId: {
    type: String,
    required: true,
    index: true, 
  },
  dataPayload: {
    type: Object,
    required: true,
  },
  inconsistencies: {
    type: [String], 
    default: [], 
  },
  previousHash: {
    type: String,
    required: true, 
  },
  hash: {
    type: String,
    required: true,
    unique: true, 
  },
});

// method to check for inconsistencies
eventSchema.methods.checkInconsistencies = function () {
  const issues = [];
  if (!this.eventType) issues.push('Missing eventType');
  if (!this.sourceAppId) issues.push('Missing sourceAppId');
  if (!this.dataPayload || typeof this.dataPayload !== 'object') {
    issues.push('Invalid or missing dataPayload');
  }
  return issues;
};

// Middleware to populate inconsistencies before saving
eventSchema.pre('save', function (next) {
  this.inconsistencies = this.checkInconsistencies();
  next();
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
