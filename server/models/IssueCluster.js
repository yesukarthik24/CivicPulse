const mongoose = require('mongoose');

const issueClusterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  centerLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, default: '' },
  },
  reportCount: {
    type: Number,
    default: 1,
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  priorityScore: {
    type: Number,
    default: 50,
  },
  issueIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
  }],
  status: {
    type: String,
    enum: ['Active', 'Investigating', 'In Progress', 'Resolved'],
    default: 'Active',
  },
  aiInsight: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('IssueCluster', issueClusterSchema);
