const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Potholes & Roads',
      'Streetlights & Power',
      'Water & Leakage',
      'Garbage & Sanitation',
      'Drainage & Sewage',
      'Traffic & Signage',
      'Public Infrastructure',
      'Other Safety Hazards'
    ],
  },
  location: {
    address: { type: String, default: 'Unknown Location' },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    city: { type: String, default: 'Civic Metro' },
    district: { type: String, default: 'Central' }
  },
  image: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Reported', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
    default: 'Reported',
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  urgency: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  priorityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50,
  },
  priorityFactors: {
    severityScore: { type: Number, default: 20 },
    urgencyScore: { type: Number, default: 20 },
    duplicateFrequency: { type: Number, default: 10 },
    safetyRisk: { type: Number, default: 25 },
    affectedPopulation: { type: Number, default: 15 },
    durationDays: { type: Number, default: 10 }
  },
  aiAnalysis: {
    summary: { type: String, default: '' },
    suggestedAction: { type: String, default: '' },
    confidence: { type: Number, default: 0.85 },
    keywords: [{ type: String }],
    analyzedAt: { type: Date, default: Date.now }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reporterName: {
    type: String,
    default: 'Anonymous Citizen'
  },
  clusterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IssueCluster',
    default: null,
  },
  relatedIssueIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
  }],
  upvotes: {
    type: Number,
    default: 1
  },
  assignedTo: {
    department: { type: String, default: 'Unassigned' },
    officer: { type: String, default: '' },
    assignedAt: { type: Date }
  },
  resolutionDetails: {
    notes: { type: String, default: '' },
    resolvedAt: { type: Date }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Issue', issueSchema);
