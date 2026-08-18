import React, { useEffect, useState } from 'react';
import { InteractiveMap } from '../components/InteractiveMap';
import { issueAPI, analyticsAPI } from '../services/api';
import { PriorityBadge, SeverityBadge, StatusBadge } from '../components/PriorityBadge';
import { 
  MapPin, 
  Search, 
  Filter, 
  Flame, 
  X, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  User, 
  ShieldCheck,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const MapPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [issues, setIssues] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected issue for detail drawer
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

  const fetchMapData = async () => {
    try {
      setLoading(true);
      const [issuesRes, hotspotsRes] = await Promise.all([
        issueAPI.getAll({ limit: 100 }),
        analyticsAPI.getHotspots()
      ]);

      if (issuesRes.data.success) {
        setIssues(issuesRes.data.issues);
      }
      if (hotspotsRes.data.success) {
        setHotspots(hotspotsRes.data.hotspots);
      }
    } catch (err) {
      console.error('Error fetching map data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
  }, []);

  const handleSelectIssue = (issue) => {
    setSelectedIssue(issue);
    setSelectedStatus(issue.status);
  };

  const handleUpdateStatus = async () => {
    if (!selectedIssue || !selectedStatus) return;
    setUpdatingStatus(true);
    try {
      const res = await issueAPI.update(selectedIssue._id, { status: selectedStatus });
      if (res.data.success) {
        toast.success(`Issue status updated to ${selectedStatus}`);
        setSelectedIssue(res.data.issue);
        fetchMapData();
      }
    } catch (err) {
      toast.error(err.message || 'Status update failed');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredList = issues.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.location?.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#07090E] p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Map Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
        <div>
          <h1 className="font-mono text-xl font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>CIVIC INTELLIGENCE GIS MAP</span>
          </h1>
          <p className="text-xs text-slate-400">Interactive spatial layer with real-time hazard pin markers & cluster hotspots.</p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search address or title..."
            className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Main Grid: Left Side List & Right Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        
        {/* Left Side Quick Issue Feed Drawer */}
        <div className="lg:col-span-4 space-y-3 max-h-[650px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-xs text-slate-400 uppercase font-semibold">Active Reports ({filteredList.length})</span>
            <span className="text-[10px] text-cyan-400 font-mono">Sorted by Priority</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500 font-mono animate-pulse">
              Loading spatial data layers...
            </div>
          ) : filteredList.length === 0 ? (
            <div className="p-8 text-center glass-panel rounded-2xl text-xs text-slate-400">
              No matching reports found.
            </div>
          ) : (
            filteredList.map((issue) => (
              <div
                key={issue._id}
                onClick={() => handleSelectIssue(issue)}
                className={`p-4 rounded-xl glass-card cursor-pointer space-y-2 border transition-all ${
                  selectedIssue?._id === issue._id
                    ? 'border-cyan-500/60 bg-cyan-950/20 shadow-glow-cyan'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">{issue.category}</span>
                  <PriorityBadge score={issue.priorityScore} size="sm" showLabel={false} />
                </div>

                <h3 className="font-bold text-slate-100 text-sm leading-snug line-clamp-1">{issue.title}</h3>
                
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{issue.location?.address || 'Metro District'}</span>
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                  <StatusBadge status={issue.status} />
                  <SeverityBadge severity={issue.severity} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Map Canvas */}
        <div className="lg:col-span-8">
          <InteractiveMap
            issues={filteredList}
            hotspots={hotspots}
            onSelectIssue={handleSelectIssue}
            selectedIssueId={selectedIssue?._id}
            height="650px"
          />
        </div>

      </div>

      {/* Slide-over Detail Drawer Modal */}
      {selectedIssue && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md glass-panel-glow border-l border-cyan-500/30 p-6 shadow-2xl overflow-y-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-cyan-400 font-bold uppercase">Issue Inspection</span>
              <PriorityBadge score={selectedIssue.priorityScore} size="sm" />
            </div>
            <button
              onClick={() => setSelectedIssue(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold">{selectedIssue.category}</span>
            <h2 className="font-extrabold text-white text-lg leading-snug mt-1">{selectedIssue.title}</h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{selectedIssue.location?.address}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Status</span>
              <StatusBadge status={selectedIssue.status} />
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Severity</span>
              <SeverityBadge severity={selectedIssue.severity} />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-300">Description</span>
            <p className="text-xs text-slate-300 leading-relaxed p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              {selectedIssue.description}
            </p>
          </div>

          {/* AI Analysis Summary */}
          {selectedIssue.aiAnalysis?.summary && (
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">AI Assessment Summary</span>
              <p className="text-xs text-cyan-200 italic font-medium">"{selectedIssue.aiAnalysis.summary}"</p>
              {selectedIssue.aiAnalysis.suggestedAction && (
                <div className="pt-2 border-t border-cyan-500/20 text-[11px] text-slate-300">
                  <span className="font-bold text-cyan-400">Action:</span> {selectedIssue.aiAnalysis.suggestedAction}
                </div>
              )}
            </div>
          )}

          {/* Admin Workflow Action Control */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-mono uppercase text-cyan-400 font-bold block">Update Status (Admin / Authority)</span>
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-slate-950 text-xs text-slate-100 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
              >
                <option value="Reported">Reported</option>
                <option value="Under Review">Under Review</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>

              <button
                onClick={handleUpdateStatus}
                disabled={updatingStatus}
                className="py-2 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0"
              >
                {updatingStatus ? 'Updating...' : 'Save'}
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
