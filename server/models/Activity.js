const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  issueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    required: true,
  },
  actor: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, default: 'System' },
    role: { type: String, default: 'system' }
  },
  action: {
    type: String,
    required: true,
    enum: ['CREATED', 'STATUS_CHANGE', 'ASSIGNED', 'CLUSTER_MERGED', 'AI_REANALYZED', 'COMMENT_ADDED', 'REJECTED']
  },
  details: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', activitySchema);
