const Issue = require('../models/Issue');
const IssueCluster = require('../models/IssueCluster');

/**
 * Calculates Haversine distance between two lat/lng points in kilometers.
 */
function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

/**
 * Simple token Jaccard similarity for text matching.
 */
function getTextSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;
  const words1 = new Set(text1.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/).filter(w => w.length > 2));
  const words2 = new Set(text2.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/).filter(w => w.length > 2));
  
  if (words1.size === 0 || words2.size === 0) return 0;

  let intersection = 0;
  for (const w of words1) {
    if (words2.has(w)) intersection++;
  }

  const union = new Set([...words1, ...words2]).size;
  return intersection / union;
}

/**
 * Find similar reports nearby (default radius 1.5 km).
 */
async function detectSimilarIssues(newIssueData, excludeId = null) {
  const { location, category, title, description } = newIssueData;
  if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    return [];
  }

  const query = { status: { $ne: 'Closed' } };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existingIssues = await Issue.find(query).limit(100);

  const matched = [];

  for (const issue of existingIssues) {
    const distKm = getHaversineDistance(
      location.lat,
      location.lng,
      issue.location.lat,
      issue.location.lng
    );

    // Distance threshold: within 1.5 km
    if (distKm <= 1.5) {
      const categoryMatch = issue.category === category;
      const titleSim = getTextSimilarity(title, issue.title);
      const descSim = getTextSimilarity(description, issue.description);
      const textSim = Math.max(titleSim, descSim);

      // Score combination
      if (categoryMatch || distKm <= 0.3 || textSim >= 0.35) {
        matched.push({
          issue,
          distanceKm: parseFloat(distKm.toFixed(2)),
          categoryMatch,
          textSimilarity: parseFloat(textSim.toFixed(2)),
          confidence: parseFloat((categoryMatch ? 0.4 + (1.5 - distKm) * 0.4 : (1.5 - distKm) * 0.3).toFixed(2))
        });
      }
    }
  }

  // Sort by highest confidence / closest distance
  return matched.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Assigns or merges issue into a Cluster if nearby cluster exists or creates a cluster.
 */
async function processClustering(issue) {
  try {
    const radiusKm = 1.0;
    let existingCluster = await IssueCluster.findOne({
      category: issue.category,
      status: { $ne: 'Resolved' }
    });

    if (existingCluster) {
      const dist = getHaversineDistance(
        issue.location.lat,
        issue.location.lng,
        existingCluster.centerLocation.lat,
        existingCluster.centerLocation.lng
      );

      if (dist <= radiusKm) {
        if (!existingCluster.issueIds.includes(issue._id)) {
          existingCluster.issueIds.push(issue._id);
          existingCluster.reportCount += 1;
          existingCluster.priorityScore = Math.max(existingCluster.priorityScore, issue.priorityScore);
          await existingCluster.save();
        }
        issue.clusterId = existingCluster._id;
        await issue.save();
        return existingCluster;
      }
    }

    // Check if there are >= 2 nearby issues of the same category to create a brand new cluster
    const similarList = await detectSimilarIssues(issue, issue._id);
    const sameCatNearby = similarList.filter(m => m.categoryMatch && m.distanceKm <= 1.0);

    if (sameCatNearby.length >= 1) {
      const relatedIds = [issue._id, ...sameCatNearby.map(m => m.issue._id)];
      const newCluster = new IssueCluster({
        name: `${issue.category} Cluster - ${issue.location.district || issue.location.city || 'Zone'}`,
        category: issue.category,
        centerLocation: {
          lat: issue.location.lat,
          lng: issue.location.lng,
          address: issue.location.address
        },
        reportCount: relatedIds.length,
        severity: issue.severity,
        priorityScore: Math.max(issue.priorityScore, ...sameCatNearby.map(m => m.issue.priorityScore)),
        issueIds: relatedIds,
        aiInsight: `Cluster generated from ${relatedIds.length} related citizen reports in close proximity.`
      });

      await newCluster.save();

      issue.clusterId = newCluster._id;
      await issue.save();

      // Update related issues with this clusterId
      for (const m of sameCatNearby) {
        m.issue.clusterId = newCluster._id;
        await m.issue.save();
      }

      return newCluster;
    }

  } catch (err) {
    console.error('[ClusterService] Error during cluster processing:', err);
  }
  return null;
}

module.exports = {
  getHaversineDistance,
  getTextSimilarity,
  detectSimilarIssues,
  processClustering
};
