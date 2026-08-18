import React from 'react';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export const PriorityBadge = ({ score, showLabel = true, size = 'md' }) => {
  let colorClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let label = 'Low Priority';
  
  if (score >= 80) {
    colorClass = 'bg-rose-500/15 text-rose-400 border-rose-500/40 shadow-glow-rose';
    label = 'CRITICAL PRIORITY';
  } else if (score >= 65) {
    colorClass = 'bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-glow-amber';
    label = 'HIGH PRIORITY';
  } else if (score >= 40) {
    colorClass = 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40 shadow-glow-cyan';
    label = 'MEDIUM PRIORITY';
  }

  const py = size === 'sm' ? 'py-0.5 px-2 text-xs' : size === 'lg' ? 'py-2 px-4 text-sm font-semibold' : 'py-1 px-3 text-xs font-medium';

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md transition-all ${colorClass} ${py}`}>
      <span className="font-mono font-bold">{score}</span>
      <span className="text-[10px] opacity-75">/100</span>
      {showLabel && <span className="ml-1 tracking-wider uppercase">{label}</span>}
    </div>
  );
};

export const SeverityBadge = ({ severity }) => {
  let color = 'bg-slate-800 text-slate-300 border-slate-700';
  let icon = <Info className="w-3.5 h-3.5 text-slate-400" />;

  if (severity === 'Critical') {
    color = 'bg-rose-950/80 text-rose-300 border-rose-600/50 shadow-rose-950/40';
    icon = <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />;
  } else if (severity === 'High') {
    color = 'bg-amber-950/80 text-amber-300 border-amber-600/50';
    icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
  } else if (severity === 'Medium') {
    color = 'bg-cyan-950/80 text-cyan-300 border-cyan-600/50';
    icon = <Info className="w-3.5 h-3.5 text-cyan-400" />;
  } else if (severity === 'Low') {
    color = 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50';
    icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${color}`}>
      {icon}
      <span>{severity} Severity</span>
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  let style = 'bg-slate-800 text-slate-300 border-slate-700';
  if (status === 'Reported') style = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  if (status === 'Under Review') style = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
  if (status === 'Assigned') style = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
  if (status === 'In Progress') style = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  if (status === 'Resolved') style = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  if (status === 'Closed') style = 'bg-slate-800 text-slate-400 border-slate-700';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
      <span>{status}</span>
    </span>
  );
};
