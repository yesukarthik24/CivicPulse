const { analyzeIssue } = require('../services/aiService');
const { detectSimilarIssues } = require('../services/clusterService');

const analyze = async (req, res) => {
  try {
    const { title, description, category, location, image } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required for AI analysis'
      });
    }

    const aiResult = await analyzeIssue({ title, description, category, location, image });

    let potentialDuplicates = [];
    if (location && typeof location.lat === 'number' && typeof location.lng === 'number') {
      potentialDuplicates = await detectSimilarIssues({ location, category, title, description });
    }

    res.json({
      success: true,
      analysis: aiResult,
      potentialDuplicates: potentialDuplicates.map(d => ({
        id: d.issue._id,
        title: d.issue.title,
        category: d.issue.category,
        distanceKm: d.distanceKm,
        confidence: d.confidence,
        status: d.issue.status,
        createdAt: d.issue.createdAt
      }))
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { analyze };
