import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bot, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldAlert, 
  Copy, 
  Eye, 
  FileText,
  Upload,
  Info,
  Radio
} from 'lucide-react';
import { aiAPI, issueAPI } from '../services/api';
import { PriorityBadge, SeverityBadge } from '../components/PriorityBadge';
import { useToast } from '../context/ToastContext';

export const ReportIssuePage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [step, setStep] = useState(1);

  // Step 1 Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Potholes & Roads');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('5th Ave & Pine Street');
  const [lat, setLat] = useState(37.7833);
  const [lng, setLng] = useState(-122.4167);
  const [image, setImage] = useState('');

  // Step 2 & 3 AI & Priority state
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [potentialDuplicates, setPotentialDuplicates] = useState([]);

  // Step 4 Confirmation state
  const [createdIssue, setCreatedIssue] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Quick Preset Locations
  const presetLocations = [
    { label: 'Downtown (5th Ave)', address: '5th Ave & Pine St', lat: 37.7833, lng: -122.4167 },
    { label: 'West Ward (12th St)', address: '450 12th St', lat: 37.7780, lng: -122.4250 },
    { label: 'Eastside Mall', address: '102 Grand Ave', lat: 37.7850, lng: -122.4090 },
    { label: 'Green Valley Park', address: 'Green Valley Park North', lat: 37.7690, lng: -122.4320 },
  ];

  // Run AI Analysis (Step 1 -> Step 2)
  const handleRunAIAnalysis = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      toast.warning('Please fill in the title and description.');
      return;
    }

    setAnalyzing(true);
    try {
      const res = await aiAPI.analyze({
        title,
        description,
        category,
        location: { address, lat: Number(lat), lng: Number(lng) },
        image
      });

      if (res.data.success) {
        setAiResult(res.data.analysis);
        setPotentialDuplicates(res.data.potentialDuplicates || []);
        setStep(2);
        toast.success('AI hazard analysis completed!');
      }
    } catch (err) {
      toast.error(err.message || 'AI analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  // Final Submit Issue (Step 3 -> Step 4)
  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await issueAPI.create({
        title,
        description,
        category: aiResult?.category || category,
        location: { address, lat: Number(lat), lng: Number(lng) },
        image
      });

      if (res.data.success) {
        setCreatedIssue(res.data.issue);
        setStep(4);
        toast.success('Issue report submitted successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Error submitting report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Wizard Header Progress Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-mono text-2xl font-black text-white flex items-center gap-2">
              <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
              <span>CIVIC REPORT ENGINE</span>
            </h1>
            <p className="text-xs text-slate-400">Multi-Step AI Prioritization & Spatial Hazard Analysis</p>
          </div>
          <span className="font-mono text-xs text-cyan-400 font-bold px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30">
            STEP {step} OF 4
          </span>
        </div>

        {/* Step Indicator Bar */}
        <div className="grid grid-cols-4 gap-2">
          <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? 'bg-cyan-400 shadow-glow-cyan' : 'bg-slate-800'}`} />
          <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? 'bg-cyan-400 shadow-glow-cyan' : 'bg-slate-800'}`} />
          <div className={`h-1.5 rounded-full transition-all ${step >= 3 ? 'bg-cyan-400 shadow-glow-cyan' : 'bg-slate-800'}`} />
          <div className={`h-1.5 rounded-full transition-all ${step >= 4 ? 'bg-emerald-400 shadow-glow-emerald' : 'bg-slate-800'}`} />
        </div>
      </div>

      {/* STEP 1: DESCRIBE THE PROBLEM */}
      {step === 1 && (
        <form onSubmit={handleRunAIAnalysis} className="glass-panel-glow p-6 sm:p-8 rounded-2xl space-y-6 border border-cyan-500/30">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>Step 1: Describe the Civic Problem</span>
            </h2>
            <p className="text-xs text-slate-400">Provide details so AI can categorize and evaluate hazard severity.</p>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Deep Pothole Causing Vehicle Damage near School"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Potholes & Roads">Potholes & Roads</option>
                <option value="Streetlights & Power">Streetlights & Power</option>
                <option value="Water & Leakage">Water & Leakage</option>
                <option value="Garbage & Sanitation">Garbage & Sanitation</option>
                <option value="Drainage & Sewage">Drainage & Sewage</option>
                <option value="Traffic & Signage">Traffic & Signage</option>
                <option value="Public Infrastructure">Public Infrastructure</option>
                <option value="Other Safety Hazards">Other Safety Hazards</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description *</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the exact problem, size, duration, and safety hazards..."
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Location Address & Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Location Address & Coordinates *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address or landmark"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />

              {/* Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400 font-mono">Presets:</span>
                {presetLocations.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAddress(p.address);
                      setLat(p.lat);
                      setLng(p.lng);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] text-cyan-300 font-mono transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image URL / Metadata Optional */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Photo Image URL (Optional)</label>
              <div className="relative">
                <Upload className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={analyzing}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-glow-cyan flex items-center gap-2 transition-all"
            >
              <span>{analyzing ? 'Running AI Engine...' : 'Proceed to AI Analysis'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: AI ANALYSIS RESULTS */}
      {step === 2 && aiResult && (
        <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl space-y-6 border border-cyan-500/30">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span>Step 2: AI Hazard Assessment</span>
              </h2>
              <p className="text-xs text-slate-400">Automated classification & severity evaluation.</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full">
              Confidence: {Math.round(aiResult.confidence * 100)}%
            </span>
          </div>

          {/* AI Detection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Detected Issue</span>
              <p className="font-bold text-slate-100 text-base">{title}</p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-cyan-400 font-mono bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  {aiResult.category}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Assessed Severity & Urgency</span>
              <div className="flex items-center gap-2">
                <SeverityBadge severity={aiResult.severity} />
                <span className="text-xs font-mono text-amber-400 bg-amber-950/80 border border-amber-500/30 px-2 py-1 rounded">
                  {aiResult.urgency} Urgency
                </span>
              </div>
            </div>
          </div>

          {/* AI Summary & Suggested Action */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">AI Summary</span>
              <p className="text-xs text-slate-200 leading-relaxed italic">"{aiResult.summary}"</p>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">Suggested Action</span>
              <p className="text-xs text-cyan-200 leading-relaxed font-medium">{aiResult.suggestedAction}</p>
            </div>
          </div>

          {/* Similar Duplicate Report Warning Banner */}
          {potentialDuplicates.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-500/40 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>POTENTIAL RELATED ISSUES DETECTED ({potentialDuplicates.length})</span>
              </div>
              <p className="text-xs text-amber-200/80">
                Our spatial engine found nearby active reports within 1.5 km. Submitting will auto-associate with this cluster.
              </p>
              <div className="space-y-1 pt-1">
                {potentialDuplicates.map(d => (
                  <div key={d.id} className="flex items-center justify-between p-2 rounded bg-slate-900/80 text-[11px] text-slate-300">
                    <span className="font-semibold">{d.title}</span>
                    <span className="font-mono text-amber-400">{d.distanceKm} km away</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="py-2.5 px-4 rounded-xl glass-panel text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Edit Details</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-glow-cyan flex items-center gap-2"
            >
              <span>View Priority Score Matrix</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: GENERATED PRIORITY SCORE */}
      {step === 3 && aiResult && (
        <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl space-y-6 border border-cyan-500/30">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Step 3: Generated Priority Score Breakdown</span>
            </h2>
            <p className="text-xs text-slate-400">Multi-factor weighted priority score explanation.</p>
          </div>

          {/* Big Score Gauge */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono uppercase text-cyan-400 font-bold block mb-1">Calculated Priority Score</span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-5xl font-black text-white">{aiResult.priorityScore}</span>
                <span className="text-sm font-mono text-slate-400">/ 100</span>
              </div>
              <p className="text-xs text-slate-300 mt-2">High urgency allocation index for municipal dispatch queue.</p>
            </div>
            <PriorityBadge score={aiResult.priorityScore} size="lg" />
          </div>

          {/* Factor Breakdown Weights */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-300 font-bold tracking-wider">Priority Factor Weights</h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Assessed Severity Impact</span>
                  <span className="font-mono text-cyan-400 font-bold">{aiResult.factors?.severityScore || 25} pts</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${(aiResult.factors?.severityScore || 25) * 3}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Urgency & Response Window</span>
                  <span className="font-mono text-amber-400 font-bold">{aiResult.factors?.urgencyScore || 20} pts</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(aiResult.factors?.urgencyScore || 20) * 3.5}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Safety Risk & Vulnerability</span>
                  <span className="font-mono text-rose-400 font-bold">{aiResult.factors?.safetyRisk || 18} pts</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 rounded-full" style={{ width: `${(aiResult.factors?.safetyRisk || 18) * 4}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Affected Population / Footfall</span>
                  <span className="font-mono text-emerald-400 font-bold">{aiResult.factors?.affectedPopulation || 12} pts</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(aiResult.factors?.affectedPopulation || 12) * 5}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="py-2.5 px-4 rounded-xl glass-panel text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to AI Analysis</span>
            </button>
            <button
              onClick={handleFinalSubmit}
              disabled={submitting}
              className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-sm shadow-glow-emerald flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>{submitting ? 'Submitting Report...' : 'Confirm & Submit Report'}</span>
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CONFIRMATION */}
      {step === 4 && createdIssue && (
        <div className="glass-panel-glow p-8 rounded-2xl text-center space-y-6 border border-emerald-500/40 shadow-glow-emerald">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-glow-emerald">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-widest block mb-1">Report Registered</span>
            <h2 className="text-2xl font-extrabold text-white">Civic Issue Submitted Successfully!</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
              Your report has been analyzed by AI and queued for municipal prioritization.
            </p>
          </div>

          {/* Issue ID Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 max-w-md mx-auto space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">Unique Tracking Issue ID</span>
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-lg font-bold text-cyan-400">{createdIssue._id}</span>
            </div>
            <div className="flex justify-center items-center gap-3 pt-2">
              <PriorityBadge score={createdIssue.priorityScore} />
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/map"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-glow-cyan flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>View On Interactive Civic Map</span>
            </Link>
            <button
              onClick={() => {
                setStep(1);
                setTitle('');
                setDescription('');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl glass-panel text-slate-200 font-bold text-xs border border-slate-700"
            >
              Report Another Problem
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
