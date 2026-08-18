const IssueCluster = require('../models/IssueCluster');
const Issue = require('../models/Issue');

// @route GET /api/clusters
const getClusters = async (req, res) => {
  try {
    const clusters = await IssueCluster.find()
      .populate('issueIds', 'title category severity status priorityScore location createdAt')
      .sort({ priorityScore: -1 });

    res.json({
      success: true,
      count: clusters.length,
      clusters
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/clusters/:id
const getClusterById = async (req, res) => {
  try {
    const cluster = await IssueCluster.findById(req.params.id)
      .populate({
        path: 'issueIds',
        populate: { path: 'createdBy', select: 'name email' }
      });

    if (!cluster) {
      return res.status(404).json({ success: false, message: 'Cluster not found' });
    }

    res.json({
      success: true,
      cluster
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/clusters/merge
const mergeClusters = async (req, res) => {
  try {
    const { primaryClusterId, secondaryClusterId } = req.body;

    const primary = await IssueCluster.findById(primaryClusterId);
    const secondary = await IssueCluster.findById(secondaryClusterId);

    if (!primary || !secondary) {
      return res.status(404).json({ success: false, message: 'One or both clusters not found' });
    }

    // Combine issue IDs
    const mergedIssueIds = Array.from(new Set([...primary.issueIds.map(id => id.toString()), ...secondary.issueIds.map(id => id.toString())]));

    primary.issueIds = mergedIssueIds;
    primary.reportCount = mergedIssueIds.length;
    primary.priorityScore = Math.max(primary.priorityScore, secondary.priorityScore);
    primary.aiInsight = `Merged cluster containing ${mergedIssueIds.length} combined reports.`;
    await primary.save();

    // Update all issues in secondary to point to primary cluster
    await Issue.updateMany(
      { _id: { $in: secondary.issueIds } },
      { $set: { clusterId: primary._id } }
    );

    // Delete secondary cluster
    await IssueCluster.findByIdAndDelete(secondaryClusterId);

    res.json({
      success: true,
      message: 'Clusters merged successfully',
      cluster: primary
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getClusters,
  getClusterById,
  mergeClusters
};
