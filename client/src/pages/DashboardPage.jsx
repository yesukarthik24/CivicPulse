import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { analyticsAPI, issueAPI, clusterAPI } from '../services/api';
import { PriorityBadge, SeverityBadge, StatusBadge } from '../components/PriorityBadge';
import { 
  BarChart3, 
  Activity, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  Bot, 
  Filter, 
  Search, 
  Eye, 
  GitMerge, 
  RefreshCw,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const DashboardPage = () => {
  const toast = useToast();

  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [issues, setIssues] = useState([]);
  const [clusters, setClusters] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  // Selected issue for quick edit modal
  const [editingIssue, setEditingIssue] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editOfficer, setEditOfficer] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ovRes, trRes, hsRes, isRes, clRes] = await Promise.all([
        analyticsAPI.getOverview(),
        analyticsAPI.getTrends(),
        analyticsAPI.getHotspots(),
        issueAPI.getAll({ limit: 100, sort: 'priority_desc' }),
        clusterAPI.getAll()
      ]);

      if (ovRes.data.success) setOverview(ovRes.data.data);
      if (trRes.data.success) setTrends(trRes.data.data);
      if (hsRes.data.success) {
        setHotspots(hsRes.data.hotspots);
        setAiInsights(hsRes.data.aiInsights || []);
      }
      if (isRes.data.success) setIssues(isRes.data.issues);
      if (clRes.data.success) setClusters(clRes.data.clusters);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateIssue = async (e) => {
    e.preventDefault();
    if (!editingIssue) return;
    setSavingEdit(true);
    try {
      const res = await issueAPI.update(editingIssue._id, {
        status: editStatus,
        department: editDepartment,
        officer: editOfficer
      });
      if (res.data.success) {
        toast.success('Issue details & assignment updated successfully!');
        setEditingIssue(null);
        fetchDashboardData();
      }
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSavingEdit(false);
    }
  };

  const filteredIssues = issues.filter(i => {
    if (categoryFilter && i.category !== categoryFilter) return false;
    if (severityFilter && i.severity !== severityFilter) return false;
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      return i.title.toLowerCase().includes(query) || i.category.toLowerCase().includes(query) || i.location?.address?.toLowerCase().includes(query);
    }
    return true;
  });

  const COLORS = ['#06B6D4', '#3B82F6', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6'];

  return (
    <div className="min-h-screen bg-[#07090E] p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h1 className="font-mono text-2xl font-black text-white">CIVIC INTELLIGENCE COMMAND CENTER</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Real-time public issue prioritization, cluster detection & authority dispatch metrics.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono font-semibold border border-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* OVERVIEW METRICS WIDGETS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Total Reports</span>
          <span className="text-3xl font-mono font-black text-white">{overview?.totalReports || 0}</span>
          <span className="text-[10px] text-cyan-400 block font-mono">100% Ingested</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Active Pipeline</span>
          <span className="text-3xl font-mono font-black text-amber-400">{overview?.activeIssues || 0}</span>
          <span className="text-[10px] text-amber-400/80 block font-mono">Under Dispatch</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-rose-500/30 shadow-glow-rose space-y-2">
          <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block">Critical Risk</span>
          <span className="text-3xl font-mono font-black text-rose-400">{overview?.criticalIssues || 0}</span>
          <span className="text-[10px] text-rose-400/80 block font-mono">Immediate Action</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Resolved</span>
          <span className="text-3xl font-mono font-black text-emerald-400">{overview?.resolvedIssues || 0}</span>
          <span className="text-[10px] text-emerald-400 block font-mono">{overview?.resolutionRate || 0}% Closed Rate</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2 col-span-2 md:col-span-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Avg SLA Time</span>
          <span className="text-3xl font-mono font-black text-cyan-300">{overview?.avgResolutionHours || 38.5}<span className="text-xs font-normal"> hrs</span></span>
          <span className="text-[10px] text-slate-400 block font-mono">Resolution Window</span>
        </div>
      </div>

      {/* AI INSIGHTS FEED */}
      <div className="glass-panel-glow p-6 rounded-2xl border border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider">System-Generated AI Insights</h2>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
            AUTO SYNTHESIS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aiInsights.map((insight, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-200 leading-relaxed font-medium">"{insight}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* ANALYTICS CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Distribution Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-mono text-xs text-slate-300 font-bold uppercase tracking-wider">Issues by Category</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends?.byCategory || []}>
                <XAxis dataKey="category" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Score Buckets */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-mono text-xs text-slate-300 font-bold uppercase tracking-wider">Priority Risk Spectrum</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends?.priorityBuckets || []}>
                <XAxis dataKey="range" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#F43F5E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* MASTER ISSUE TABLE & ACTION MANAGER */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">Priority Dispatch Queue</h3>
            <p className="text-xs text-slate-400">Inspect reports, update status, and assign municipal departments.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="">All Categories</option>
              <option value="Potholes & Roads">Potholes & Roads</option>
              <option value="Streetlights & Power">Streetlights & Power</option>
              <option value="Water & Leakage">Water & Leakage</option>
              <option value="Garbage & Sanitation">Garbage & Sanitation</option>
              <option value="Drainage & Sewage">Drainage & Sewage</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Priority Score</th>
                <th className="py-3 px-4">Title & Location</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Dept</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredIssues.map((issue) => (
                <tr key={issue._id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <PriorityBadge score={issue.priorityScore} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <span className="font-bold text-slate-100 block line-clamp-1">{issue.title}</span>
                    <span className="text-[10px] text-slate-400 truncate block">{issue.location?.address}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-cyan-400 font-medium">
                    {issue.category}
                  </td>
                  <td className="py-3.5 px-4">
                    <SeverityBadge severity={issue.severity} />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={issue.status} />
                  </td>
                  <td className="py-3.5 px-4 text-[11px] font-mono text-slate-400">
                    {issue.assignedTo?.department || 'Unassigned'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setEditingIssue(issue);
                        setEditStatus(issue.status);
                        setEditDepartment(issue.assignedTo?.department || 'Public Works');
                        setEditOfficer(issue.assignedTo?.officer || '');
                      }}
                      className="py-1 px-3 rounded bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold text-[11px] transition-colors border border-cyan-500/30"
                    >
                      Manage / Dispatch
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUICK EDIT & DISPATCH MODAL */}
      {editingIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleUpdateIssue} className="w-full max-w-lg glass-panel-glow p-6 rounded-2xl border border-cyan-500/40 space-y-4">
            <h3 className="font-bold text-white text-base">Manage Dispatch & Status</h3>
            <p className="text-xs text-slate-400">Updating issue "{editingIssue.title}"</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Status Workflow</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-100"
                >
                  <option value="Reported">Reported</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Department</label>
                <input
                  type="text"
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  placeholder="e.g. Department of Public Works"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Officer / Crew Lead</label>
                <input
                  type="text"
                  value={editOfficer}
                  onChange={(e) => setEditOfficer(e.target.value)}
                  placeholder="e.g. Officer Miller (Unit 4B)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingIssue(null)}
                className="py-2 px-4 rounded-xl glass-panel text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingEdit}
                className="py-2 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                {savingEdit ? 'Saving...' : 'Save Updates'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
