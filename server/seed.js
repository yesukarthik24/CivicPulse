const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Issue = require('./models/Issue');
const IssueCluster = require('./models/IssueCluster');
const Activity = require('./models/Activity');

dotenv.config();

const mockIssuesData = [
  {
    title: "Major Pothole Causing Vehicle Damage near School Zone",
    description: "Deep 8-inch pothole at the intersection of 5th Ave and Pine St. Multiple commuters reported tire punctures. Located directly in front of Lincoln High School.",
    category: "Potholes & Roads",
    location: { address: "5th Ave & Pine St, Lincoln Ward", lat: 37.7833, lng: -122.4167, city: "Metro City", district: "Downtown" },
    status: "In Progress",
    severity: "High",
    urgency: "High",
    priorityScore: 88,
    priorityFactors: { severityScore: 28, urgencyScore: 22, duplicateFrequency: 15, safetyRisk: 18, affectedPopulation: 5 },
    aiAnalysis: {
      summary: "High-priority road hazard in active school zone posing immediate traffic safety risk.",
      suggestedAction: "Emergency asphalt patch crew dispatched. Traffic cone safety perimeter deployed.",
      confidence: 0.94,
      keywords: ["pothole", "school zone", "vehicle damage", "hazard"]
    },
    reporterName: "Sarah Jenkins"
  },
  {
    title: "Burst Water Main Flooding Sidewalk",
    description: "Water gushing from fractured underground pipe near Grand Mall entrance. Water level rising on pedestrian walkway.",
    category: "Water & Leakage",
    location: { address: "102 Grand Ave, Commercial Hub", lat: 37.7850, lng: -122.4090, city: "Metro City", district: "Eastside" },
    status: "Under Review",
    severity: "Critical",
    urgency: "Critical",
    priorityScore: 94,
    priorityFactors: { severityScore: 32, urgencyScore: 25, duplicateFrequency: 18, safetyRisk: 14, affectedPopulation: 5 },
    aiAnalysis: {
      summary: "CRITICAL: Major water main break threatening commercial infrastructure foundation.",
      suggestedAction: "IMMEDIATE DISPATCH: Direct emergency water authority valve shut-off team.",
      confidence: 0.97,
      keywords: ["water main", "flooding", "gushing", "critical"]
    },
    reporterName: "David Miller"
  },
  {
    title: "Broken Streetlight Cluster along 12th Street Pedestrian Path",
    description: "Four consecutive streetlights out for over 5 days. Path is completely unlit at night, raising public safety concerns for night commuters.",
    category: "Streetlights & Power",
    location: { address: "450 12th St, Westside", lat: 37.7780, lng: -122.4250, city: "Metro City", district: "West Ward" },
    status: "Reported",
    severity: "High",
    urgency: "Medium",
    priorityScore: 78,
    priorityFactors: { severityScore: 24, urgencyScore: 18, duplicateFrequency: 14, safetyRisk: 15, affectedPopulation: 7 },
    aiAnalysis: {
      summary: "Cluster of unlit public lamps on high-footfall pedestrian pathway.",
      suggestedAction: "Schedule electrical utility technician for LED driver and transformer check.",
      confidence: 0.90,
      keywords: ["streetlight", "unlit", "night safety", "pedestrian"]
    },
    reporterName: "Elena Rostova"
  },
  {
    title: "Illegal Garbage Dumping near Community Park",
    description: "Large pile of construction debris and bio-waste dumped adjacent to Green Valley park entrance. Strong odors and pest infestation noticed.",
    category: "Garbage & Sanitation",
    location: { address: "Green Valley Park North, Sector 8", lat: 37.7690, lng: -122.4320, city: "Metro City", district: "Southside" },
    status: "Assigned",
    severity: "Medium",
    urgency: "Medium",
    priorityScore: 64,
    priorityFactors: { severityScore: 18, urgencyScore: 16, duplicateFrequency: 10, safetyRisk: 12, affectedPopulation: 8 },
    aiAnalysis: {
      summary: "Sanitation violation with bio-waste risk near public recreation zone.",
      suggestedAction: "Sanitation heavy vehicle team scheduled for cleanup within 24 hours.",
      confidence: 0.89,
      keywords: ["garbage", "dumping", "park", "odor"]
    },
    reporterName: "Marcus Vance"
  },
  {
    title: "Clogged Storm Drain Causing Street Inundation",
    description: "Heavy leaf litter and debris blocking storm inlet at Elm & Market. Water accumulating 4 inches deep during rainfall.",
    category: "Drainage & Sewage",
    location: { address: "Elm St & Market St", lat: 37.7810, lng: -122.4180, city: "Metro City", district: "Downtown" },
    status: "In Progress",
    severity: "High",
    urgency: "High",
    priorityScore: 82,
    priorityFactors: { severityScore: 26, urgencyScore: 22, duplicateFrequency: 16, safetyRisk: 12, affectedPopulation: 6 },
    aiAnalysis: {
      summary: "Storm drain blockage resulting in localized street flooding during rain events.",
      suggestedAction: "Deploy hydro-vac drainage truck to clear inlet grate and vacuum debris.",
      confidence: 0.92,
      keywords: ["storm drain", "clogged", "flooding", "rain"]
    },
    reporterName: "Carlos Santana"
  },
  {
    title: "Damaged Traffic Signal Light at High-Traffic Intersection",
    description: "Red signal light hanging loosely from wire pole after strong wind storm. Poses risk of falling onto crossing vehicles.",
    category: "Traffic & Signage",
    location: { address: "Broadway & 2nd Ave", lat: 37.7900, lng: -122.4010, city: "Metro City", district: "North District" },
    status: "Assigned",
    severity: "Critical",
    urgency: "Critical",
    priorityScore: 91,
    priorityFactors: { severityScore: 30, urgencyScore: 25, duplicateFrequency: 15, safetyRisk: 16, affectedPopulation: 5 },
    aiAnalysis: {
      summary: "Damaged overhead traffic fixture in danger of detachment above active roadway.",
      suggestedAction: "Priority traffic management crew dispatched to secure signal housing.",
      confidence: 0.96,
      keywords: ["traffic signal", "hanging pole", "wind storm", "hazard"]
    },
    reporterName: "Priya Sharma"
  },
  {
    title: "Cracked Concrete Guardrail on Overpass Bridge",
    description: "Structural fissures visible on the protective guardrail of 8th Street Overpass. Rebar exposed near pedestrian footbridge.",
    category: "Public Infrastructure",
    location: { address: "8th Street Overpass Bridge", lat: 37.7720, lng: -122.4110, city: "Metro City", district: "Central" },
    status: "Under Review",
    severity: "High",
    urgency: "Medium",
    priorityScore: 76,
    priorityFactors: { severityScore: 26, urgencyScore: 16, duplicateFrequency: 12, safetyRisk: 14, affectedPopulation: 8 },
    aiAnalysis: {
      summary: "Structural concrete deterioration on elevated transportation bridge.",
      suggestedAction: "Request structural engineering assessment and temporary barrier placement.",
      confidence: 0.91,
      keywords: ["bridge", "guardrail", "structural crack", "infrastructure"]
    },
    reporterName: "Alex Rivera"
  },
  {
    title: "Leaking Sewage Manhole with Pungent Gas Odor",
    description: "Dark liquid oozing from manhole cover on Oak Street. Strong sewer gas smell affecting nearby shopkeepers and residents.",
    category: "Drainage & Sewage",
    location: { address: "220 Oak St", lat: 37.7760, lng: -122.4220, city: "Metro City", district: "West Ward" },
    status: "Reported",
    severity: "High",
    urgency: "High",
    priorityScore: 85,
    priorityFactors: { severityScore: 27, urgencyScore: 22, duplicateFrequency: 14, safetyRisk: 16, affectedPopulation: 6 },
    aiAnalysis: {
      summary: "Wastewater overflow hazard with potential public health implication.",
      suggestedAction: "Route municipal water treatment unit for sewer line clearing.",
      confidence: 0.93,
      keywords: ["sewage", "manhole", "odor", "waste overflow"]
    },
    reporterName: "Jessica Alba"
  }
];

async function seedData() {
  await connectDB();

  console.log('[Seed] Clearing existing collections...');
  await User.deleteMany({});
  await Issue.deleteMany({});
  await IssueCluster.deleteMany({});
  await Activity.deleteMany({});

  console.log('[Seed] Creating demo users...');
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('admin123', salt);
  const citizenPasswordHash = await bcrypt.hash('citizen123', salt);

  const adminUser = await User.create({
    name: 'Chief Civic Commander',
    email: 'admin@civicpulse.org',
    passwordHash: adminPasswordHash,
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  const citizenUser = await User.create({
    name: 'Jane Doe (Citizen)',
    email: 'citizen@civicpulse.org',
    passwordHash: citizenPasswordHash,
    role: 'citizen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  });

  console.log('[Seed] Inserting mock issues...');
  const createdIssues = [];
  for (const item of mockIssuesData) {
    const issue = await Issue.create({
      ...item,
      createdBy: citizenUser._id
    });
    createdIssues.push(issue);

    await Activity.create({
      issueId: issue._id,
      actor: { userId: citizenUser._id, name: citizenUser.name, role: 'citizen' },
      action: 'CREATED',
      details: `Report created with priority score ${issue.priorityScore}/100.`
    });
  }

  console.log('[Seed] Creating issue clusters and hotspots...');
  const cluster1 = await IssueCluster.create({
    name: "Downtown Drainage & Flood Hazard Zone",
    category: "Drainage & Sewage",
    centerLocation: { lat: 37.7810, lng: -122.4180, address: "5th & Elm St Metro District" },
    reportCount: 2,
    severity: "High",
    priorityScore: 88,
    issueIds: [createdIssues[0]._id, createdIssues[4]._id],
    aiInsight: "Cluster detected from multiple high-water reports near low-lying Downtown intersections."
  });

  const cluster2 = await IssueCluster.create({
    name: "West Ward Lighting Deficit Corridor",
    category: "Streetlights & Power",
    centerLocation: { lat: 37.7770, lng: -122.4235, address: "12th & Oak Street Transit Corridor" },
    reportCount: 2,
    severity: "High",
    priorityScore: 85,
    issueIds: [createdIssues[2]._id, createdIssues[7]._id],
    aiInsight: "Geographic clustering confirms multi-block infrastructure deficiency in West Ward."
  });

  // Link issues to clusters
  createdIssues[0].clusterId = cluster1._id;
  createdIssues[4].clusterId = cluster1._id;
  createdIssues[2].clusterId = cluster2._id;
  createdIssues[7].clusterId = cluster2._id;

  for (const issue of createdIssues) {
    await issue.save();
  }

  console.log('====================================================');
  console.log('CIVICPULSE DEMO DATA SEEDED SUCCESSFULLY!');
  console.log('Admin Account: admin@civicpulse.org | Password: admin123');
  console.log('Citizen Account: citizen@civicpulse.org | Password: citizen123');
  console.log('====================================================');

  process.exit(0);
}

seedData().catch(err => {
  console.error('[Seed Error]:', err);
  process.exit(1);
});
