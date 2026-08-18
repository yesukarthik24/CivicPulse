const Issue = require('../models/Issue');
const Activity = require('../models/Activity');
const { analyzeIssue } = require('../services/aiService');
const { detectSimilarIssues, processClustering } = require('../services/clusterService');

// @route POST /api/issues
const createIssue = async (req, res) => {
  try {
    const { title, description, category, location, image, isAnonymous } = req.body;

    if (!title || !description || !category || !location || !location.lat || !location.lng) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, category, and valid location coordinates are required.'
      });
    }

    // Run AI analysis automatically if not passed in
    const aiResult = await analyzeIssue({ title, description, category, location, image });

    const newIssue = new Issue({
      title,
      description,
      category: aiResult.category || category,
      location,
      image: image || '',
      severity: aiResult.severity,
      urgency: aiResult.urgency,
      priorityScore: aiResult.priorityScore,
      priorityFactors: aiResult.factors,
      aiAnalysis: {
        summary: aiResult.summary,
        suggestedAction: aiResult.suggestedAction,
        confidence: aiResult.confidence,
        keywords: [aiResult.category, aiResult.severity]
      },
      createdBy: req.user ? req.user.id : null,
      reporterName: isAnonymous ? 'Anonymous Citizen' : (req.user ? req.user.name : 'Citizen User')
    });

    // Check for similar duplicate issues
    const similar = await detectSimilarIssues(newIssue);
    if (similar.length > 0) {
      newIssue.relatedIssueIds = similar.slice(0, 5).map(s => s.issue._id);
    }

    await newIssue.save();

    // Process clustering in background
    processClustering(newIssue);

    // Create activity record
    await Activity.create({
      issueId: newIssue._id,
      actor: {
        userId: req.user ? req.user.id : null,
        name: isAnonymous ? 'Anonymous Citizen' : (req.user ? req.user.name : 'Citizen User'),
        role: req.user ? req.user.role : 'citizen'
      },
      action: 'CREATED',
      details: `Report created with AI priority score ${newIssue.priorityScore}/100 (${newIssue.severity} severity).`
    });

    res.status(201).json({
      success: true,
      issue: newIssue,
      potentialDuplicatesCount: similar.length
    });
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/issues
const getIssues = async (req, res) => {
  try {
    const { category, severity, status, search, minPriority, limit, page, sort } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;
    if (minPriority) filter.priorityScore = { $gte: Number(minPriority) };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }

    const sortOption = sort === 'oldest' ? { createdAt: 1 } 
                     : sort === 'priority_desc' ? { priorityScore: -1 } 
                     : { createdAt: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 100; // default 100 for responsive map/dashboard
    const skip = (pageNum - 1) * limitNum;

    const [issues, total] = await Promise.all([
      Issue.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .populate('clusterId', 'name priorityScore reportCount'),
      Issue.countDocuments(filter)
    ]);

    res.json({
      success: true,
      count: issues.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      issues
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/issues/:id
const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('clusterId')
      .populate('relatedIssueIds', 'title category status severity priorityScore createdAt location');

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    const activities = await Activity.find({ issueId: issue._id }).sort({ timestamp: -1 });

    res.json({
      success: true,
      issue,
      activities
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PATCH /api/issues/:id
const updateIssue = async (req, res) => {
  try {
    const { status, severity, urgency, priorityScore, department, officer, resolutionNotes } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    let actionDetail = '';

    if (status && status !== issue.status) {
      actionDetail += `Status updated from "${issue.status}" to "${status}". `;
      issue.status = status;
      if (status === 'Resolved' || status === 'Closed') {
        issue.resolutionDetails = {
          notes: resolutionNotes || 'Issue marked as resolved.',
          resolvedAt: new Date()
        };
      }
    }

    if (severity) issue.severity = severity;
    if (urgency) issue.urgency = urgency;
    if (typeof priorityScore === 'number') issue.priorityScore = priorityScore;

    if (department || officer) {
      issue.assignedTo = {
        department: department || issue.assignedTo.department,
        officer: officer || issue.assignedTo.officer,
        assignedAt: new Date()
      };
      actionDetail += `Assigned to ${department || 'Department'}${officer ? ` (${officer})` : ''}. `;
    }

    await issue.save();

    await Activity.create({
      issueId: issue._id,
      actor: {
        userId: req.user ? req.user.id : null,
        name: req.user ? req.user.name : 'System Admin',
        role: req.user ? req.user.role : 'admin'
      },
      action: status ? 'STATUS_CHANGE' : 'ASSIGNED',
      details: actionDetail || 'Issue details updated.'
    });

    res.json({
      success: true,
      issue
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/issues/:id
const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    await Issue.findByIdAndDelete(req.params.id);
    await Activity.deleteMany({ issueId: req.params.id });

    res.json({ success: true, message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue
};
