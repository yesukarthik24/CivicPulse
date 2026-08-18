# CIVICPULSE
### AI-Powered Civic Intelligence & Public Problem Prioritization Platform

CivicPulse is a modern, full-stack civic tech application that transforms isolated citizen complaint reports into structured, prioritized, and location-aware civic intelligence.

---

## 🌟 Product Vision

Rather than treating civic problem reports (potholes, streetlights, water leaks, traffic hazards) as individual CRUD complaints, **CivicPulse** utilizes spatial clustering algorithms and automated AI risk assessment to evaluate composite risk factors:

```
Citizen Report
      ↓
AI Analysis (Category + Severity + Urgency)
      ↓
Duplicate / Similar Issue Spatial Detection
      ↓
Geographic Clustering Engine
      ↓
Weighted Multi-Factor Priority Score (0 - 100)
      ↓
Civic Intelligence Command Center Dashboard
```

---

## ⚡ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS (Dark-first glassmorphism design system), Lucide Icons, Leaflet / React-Leaflet GIS Map, Recharts visual analytics.
- **Backend**: Node.js, Express.js, REST API endpoints.
- **Database**: MongoDB & Mongoose. *(Includes zero-config fallback to embedded `mongodb-memory-server` if local MongoDB is offline)*.
- **Authentication**: JWT (JSON Web Tokens), bcryptjs password hashing, Role-Based Access Control (`citizen`, `admin`).
- **AI & Priority Engine**: Pluggable AI Service (supports LLM API keys or deterministic intelligent mock fallback engine).

---

## 🚀 Key Features

### 1. Landing Page & Hero Canvas
- Animated cybernetic node network canvas representing real-time geographic problem nodes, severity waves, and telemetry data movement.
- Problem statement, multi-step workflow storytelling, and platform metrics counters.

### 2. Multi-Step Citizen Reporting Experience
- **Step 1**: Describe the problem with title, category, description, photo link, and interactive/preset map coordinates.
- **Step 2**: Live AI Hazard Analysis (Extracts Category, Severity, Urgency, AI Summary, Suggested Action, and Confidence level).
- **Step 3**: Priority Score Breakdown (Weighted score out of 100 with factor bars for Safety risk, Urgency, Duration, and Duplicate frequency).
- **Step 4**: Unique Issue ID tracking confirmation & spatial duplicate report warning alerts.

### 3. Interactive Civic GIS Map
- OpenStreetMap / Leaflet map rendering with dark-first styling overrides.
- Custom marker pins color-coded by severity (Rose = Critical, Amber = High, Cyan = Medium, Emerald = Low).
- Category, Severity, and Status filters.
- **Hotspots Mode**: Visual spatial cluster overlay depicting high-density risk zones.
- Slide-over Issue Inspection drawer.

### 4. Civic Intelligence Command Center Dashboard
- Authority metrics: Total Reports, Active Pipeline, Critical Issues, Resolution Rate, Avg SLA time.
- System-generated AI Insights feed.
- Recharts visualizations: Category distribution & Priority risk spectrum.
- Master Priority Queue table with search, category filtering, and status/dispatch management modal.

### 5. Demo & Role Switcher Mode
- Header & Profile options to instantly switch between **Citizen User** and **Municipal Admin** modes for effortless testing.

---

## 🛠️ Quick Start & Setup Instructions

### Prerequisites
- **Node.js**: v18+ or v22+
- **npm**: v9+ or v10+

### 1. Clone & Setup Project
```bash
git clone https://github.com/your-repo/CivicPulse.git
cd CivicPulse
```

### 2. Backend Setup (`/server`)
```bash
cd server
npm install

# (Optional) Environment configuration
cp .env.example .env

# Run database seed (Pre-populates realistic demo data)
npm run seed

# Start development server (Port 5000)
npm run dev
```

### 3. Frontend Setup (`/client`)
In a new terminal window:
```bash
cd client
npm install

# Start Vite dev server (Port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Login Credentials

The application seeds out-of-the-box demo accounts. You can log in manually or click the **1-Click Demo Login** buttons on the sign-in modal or top navbar:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Municipal Admin** | `admin@civicpulse.org` | `admin123` | Full Command Center, Dispatch & Status Updates, Analytics, Cluster Merging |
| **Citizen User** | `citizen@civicpulse.org` | `citizen123` | Create Reports, Track Submitted Reports, Explore Civic Map |

---

## 📡 API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Create citizen or admin user
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Retrieve current session user

### Issues (`/api/issues`)
- `POST /api/issues` — Create report (Triggers AI analysis & spatial clustering)
- `GET /api/issues` — Query issues (supports `category`, `severity`, `status`, `search`, `sort`)
- `GET /api/issues/:id` — Retrieve single issue details & activity history
- `PATCH /api/issues/:id` — Update issue status, assign department/officer (Protected)
- `DELETE /api/issues/:id` — Delete issue (Admin only)

### AI Analysis (`/api/ai`)
- `POST /api/ai/analyze` — Run standalone AI analysis on issue title & description

### Analytics & Clusters (`/api/analytics`, `/api/clusters`)
- `GET /api/analytics/overview` — Overview KPI stats
- `GET /api/analytics/trends` — Category & priority charts data
- `GET /api/analytics/hotspots` — Hotspots & AI insights feed
- `GET /api/clusters` — Retrieve spatial issue clusters
- `POST /api/clusters/merge` — Merge two spatial clusters (Admin only)

---

## 📁 Project Structure

```
d:\CivicPulse
├── client/                     # Vite + React + Tailwind CSS + Leaflet
│   ├── src/
│   │   ├── components/         # Navbar, Footer, HeroCanvas, InteractiveMap, PriorityBadge, AuthModal
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── pages/              # LandingPage, ReportIssuePage, MapPage, DashboardPage, MyReportsPage, ProfilePage
│   │   ├── services/           # api.js (Axios API client)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Glassmorphism & dark-first styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                     # Node.js + Express + Mongoose API
│   ├── config/                 # db.js (Mongoose + mongodb-memory-server fallback)
│   ├── controllers/            # authController, issueController, aiController, analyticsController, clusterController
│   ├── middleware/             # auth.js (JWT & Role authorization)
│   ├── models/                 # User.js, Issue.js, IssueCluster.js, Activity.js
│   ├── routes/                 # Express API routes
│   ├── services/               # aiService.js, clusterService.js
│   ├── seed.js                 # Seed script with realistic civic demo dataset
│   ├── index.js                # App entry point
│   └── package.json
│
├── .env.example
└── README.md
```

---

## 🚀 Deployment Instructions

### Frontend (Vite Static Build)
```bash
cd client
npm run build
# Deploy the generated dist/ folder to Vercel, Netlify, or AWS CloudFront
```

### Backend (Node.js Server)
```bash
cd server
# Deploy to Render, Railway, Heroku, or DigitalOcean App Platform
# Set environment variables (MONGODB_URI, JWT_SECRET, PORT)
```
