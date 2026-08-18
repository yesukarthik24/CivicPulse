const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const issueRoutes = require('./routes/issueRoutes');
const aiRoutes = require('./routes/aiRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const clusterRoutes = require('./routes/clusterRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/clusters', clusterRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'CivicPulse AI-Powered Civic Intelligence API',
    timestamp: new Date().toISOString()
  });
});

// Auto-seed check helper
const User = require('./models/User');
const Issue = require('./models/Issue');
const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[App Auto-Seed] Empty database detected. Seeding demo dataset...');
      const bcrypt = require('bcryptjs');
      const IssueCluster = require('./models/IssueCluster');
      const Activity = require('./models/Activity');

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

      const sampleIssues = [
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
            confidence: 0.94
          },
          createdBy: citizenUser._id,
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
            confidence: 0.97
          },
          createdBy: citizenUser._id,
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
            confidence: 0.90
          },
          createdBy: citizenUser._id,
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
            confidence: 0.89
          },
          createdBy: citizenUser._id,
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
            confidence: 0.92
          },
          createdBy: citizenUser._id,
          reporterName: "Carlos Santana"
        }
      ];

      const created = [];
      for (const item of sampleIssues) {
        const iss = await Issue.create(item);
        created.push(iss);
        await Activity.create({
          issueId: iss._id,
          actor: { userId: citizenUser._id, name: citizenUser.name, role: 'citizen' },
          action: 'CREATED',
          details: `Report registered with priority score ${iss.priorityScore}/100.`
        });
      }

      // Create a cluster
      const cluster = await IssueCluster.create({
        name: "Downtown Drainage & Flood Hazard Zone",
        category: "Drainage & Sewage",
        centerLocation: { lat: 37.7810, lng: -122.4180, address: "5th & Elm St Metro District" },
        reportCount: 2,
        severity: "High",
        priorityScore: 88,
        issueIds: [created[0]._id, created[4]._id],
        aiInsight: "Cluster detected from multiple high-water reports near low-lying Downtown intersections."
      });

      created[0].clusterId = cluster._id;
      created[4].clusterId = cluster._id;
      await created[0].save();
      await created[4].save();

      console.log('[App Auto-Seed] Demo dataset seeded successfully.');
    }
  } catch (err) {
    console.error('[App Auto-Seed] Error:', err);
  }
};

// Global JSON error handler middleware
app.use((err, req, res, next) => {
  console.error('[Server Error Middleware]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  seedData().then(() => {
    app.listen(PORT, () => {
      console.log(`[Server] CivicPulse Backend running on port ${PORT} (http://localhost:${PORT})`);
    });
  });
});

