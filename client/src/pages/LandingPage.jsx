import React from 'react';
import { Link } from 'react-router-dom';
import { HeroCanvas } from '../components/HeroCanvas';
import { 
  Radio, 
  Sparkles, 
  MapPin, 
  Sliders, 
  BarChart3, 
  ArrowRight, 
  ShieldAlert, 
  Layers, 
  Zap, 
  Bot, 
  Flame, 
  CheckCircle2,
  TrendingUp,
  Building2,
  Users
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-[#07090E] text-slate-100 overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <HeroCanvas />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold shadow-glow-cyan">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>AI-POWERED CIVIC INTELLIGENCE PLATFORM</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Turn Civic Problems Into{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 bg-clip-text text-transparent">
              Actionable Intelligence.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300 font-normal leading-relaxed">
            CivicPulse transforms citizen reports into structured, prioritized and location-aware civic insights using spatial clustering and automated LLM hazard assessment.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/map"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-glow-cyan flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Civic Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/report"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 transition-all"
            >
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Report an Issue</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <span className="block font-mono font-black text-2xl text-cyan-400">98.4%</span>
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">AI Analysis Accuracy</span>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <span className="block font-mono font-black text-2xl text-emerald-400">&lt; 1.5 km</span>
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Spatial Cluster Radius</span>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <span className="block font-mono font-black text-2xl text-amber-400">4.2x</span>
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Faster Risk Prioritization</span>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <span className="block font-mono font-black text-2xl text-rose-400">Real-Time</span>
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Hotspot Detection</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 1: HOW IT WORKS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-mono text-xs text-cyan-400 uppercase tracking-widest font-semibold">The Civic Workflow</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">How CivicPulse Works</h3>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">
            From raw citizen reports to real-time municipal command center intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          
          <div className="glass-card p-6 rounded-2xl space-y-4 border border-slate-800 relative">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-lg">
              01
            </div>
            <h4 className="text-lg font-bold text-slate-100">Citizen Report</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Citizens log issues with photos, descriptions, and pin-point GPS coordinates on mobile or desktop.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4 border border-slate-800 relative">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-bold text-lg">
              02
            </div>
            <h4 className="text-lg font-bold text-slate-100">AI Hazard Analysis</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              LLM models extract category, safety risks, urgency, and recommended municipal actions in real time.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4 border border-slate-800 relative">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-lg">
              03
            </div>
            <h4 className="text-lg font-bold text-slate-100">Spatial Clustering</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Haversine distance algorithms group duplicate reports into single actionable problem hotspots.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4 border border-slate-800 relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-lg">
              04
            </div>
            <h4 className="text-lg font-bold text-slate-100">Priority Engine</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Weighted algorithms score issues 0–100 based on safety risk, duration, duplicates, and location impact.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 2: AI-POWERED ANALYSIS & PRIORITY ENGINE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80 bg-slate-950/40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>TRANSPARENT AI ASSESSMENT</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Explainable AI & Multi-Factor Priority Scoring
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Instead of treating every issue as a simple timestamped complaint, CivicPulse evaluates the composite risk factor using weighted dimensions.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Safety & Vulnerability Impact (35%)</h4>
                  <p className="text-[11px] text-slate-400">Proximity to schools, hospitals, pedestrian crossings, or high-speed transit zones.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <Flame className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Duplicate Frequency & Cluster Density (25%)</h4>
                  <p className="text-[11px] text-slate-400">Multiple citizen reports in the same geographic cluster increase priority weight.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <TrendingUp className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Duration & Escalation Rate (20%)</h4>
                  <p className="text-[11px] text-slate-400">Unresolved hazards decay over time, automatically escalating their priority score.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive AI Preview Card */}
          <div className="glass-panel-glow p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                <span className="font-mono text-xs font-bold text-rose-400 uppercase">Live AI Evaluation</span>
              </div>
              <span className="font-mono text-xs text-slate-400">Confidence: 94%</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Detected Category:</span>
                <span className="font-semibold text-slate-200">Water & Leakage</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Assessed Severity:</span>
                <span className="font-bold text-rose-400">CRITICAL</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Assessed Urgency:</span>
                <span className="font-bold text-amber-400">HIGH</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold">AI Generated Summary</span>
              <p className="text-xs text-slate-300 italic">
                "Major water main rupture near commercial hub threatening building foundations. High risk of pedestrian path collapse."
              </p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">Priority Score</span>
                <span className="text-3xl font-mono font-black text-white">94<span className="text-xs text-slate-400 font-normal">/100</span></span>
              </div>
              <Link
                to="/report"
                className="py-2 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Test AI Reporter
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: FUTURE VISION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-mono text-xs text-cyan-400 uppercase tracking-widest font-semibold">Scalable Impact</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Built for Communities, Authorities & NGOs</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-card p-6 rounded-2xl space-y-4 border border-slate-800">
            <Users className="w-8 h-8 text-cyan-400" />
            <h4 className="text-lg font-bold text-slate-100">Citizens & Communities</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent tracking of reported issues with clear AI breakdown so citizens know their concerns are prioritized accurately.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4 border border-slate-800">
            <Building2 className="w-8 h-8 text-emerald-400" />
            <h4 className="text-lg font-bold text-slate-100">Public Authorities</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Central command center dashboard to assign field crews, track resolution SLAs, and merge duplicate reports automatically.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4 border border-slate-800">
            <BarChart3 className="w-8 h-8 text-amber-400" />
            <h4 className="text-lg font-bold text-slate-100">NGOs & Urban Researchers</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Macro spatial analytics on infrastructure breakdown patterns to advocate for budget allocation in neglected wards.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
