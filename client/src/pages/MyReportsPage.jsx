import React, { useEffect, useState } from 'react';
import { issueAPI } from '../services/api';
import { PriorityBadge, SeverityBadge, StatusBadge } from '../components/PriorityBadge';
import { MapPin, Calendar, Clock, PlusCircle, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const MyReportsPage = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        setLoading(true);
        const res = await issueAPI.getAll({ limit: 50 });
        if (res.data.success) {
          setReports(res.data.issues);
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyReports();
  }, []);

  return (
    <div className="min-h-screen bg-[#07090E] p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="font-mono text-2xl font-black text-white">MY CIVIC REPORTS</h1>
          <p className="text-xs text-slate-400 mt-1">Track status updates, priority score progression, and municipal responses.</p>
        </div>
        <Link
          to="/report"
          className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-glow-cyan"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Problem</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center font-mono text-xs text-slate-400 animate-pulse">
          Loading your report history...
        </div>
      ) : reports.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-4 max-w-md mx-auto">
          <AlertTriangle className="w-10 h-10 text-cyan-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No Reports Submitted Yet</h3>
          <p className="text-xs text-slate-400">Help your community by reporting potholes, broken streetlights, or leakage hazards.</p>
          <Link
            to="/report"
            className="inline-block py-2.5 px-5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Create Your First Report
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((issue) => (
            <div key={issue._id} className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 space-y-3 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-cyan-400 font-semibold">{issue.category}</span>
                  <StatusBadge status={issue.status} />
                </div>
                <PriorityBadge score={issue.priorityScore} size="sm" />
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-slate-100 text-base">{issue.title}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{issue.location?.address}</span>
                  <span className="text-slate-600">•</span>
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                </p>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {issue.description}
              </p>

              {issue.aiAnalysis?.summary && (
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 italic">
                  <span className="font-bold text-cyan-400 font-mono not-italic block mb-0.5">AI Summary:</span>
                  "{issue.aiAnalysis.summary}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
