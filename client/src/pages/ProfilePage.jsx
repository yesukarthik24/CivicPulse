import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Mail, Calendar, Activity, CheckCircle2 } from 'lucide-react';

export const ProfilePage = () => {
  const { user, switchRole, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#07090E] p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      
      <div className="border-b border-slate-800 pb-6">
        <h1 className="font-mono text-2xl font-black text-white">USER PROFILE & ROLE MANAGEMENT</h1>
        <p className="text-xs text-slate-400 mt-1">Manage user preferences, active credentials, and demo role access.</p>
      </div>

      <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl border border-cyan-500/30 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 flex items-center justify-center text-xl font-bold font-mono overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0) || 'U'
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.name || 'Demo Citizen User'}</h2>
            <p className="text-xs text-slate-400 font-mono">{user?.email || 'citizen@civicpulse.org'}</p>
            <span className={`inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${user?.role === 'admin' ? 'bg-rose-950 text-rose-300 border border-rose-600/40' : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'}`}>
              Role: {user?.role || 'citizen'}
            </span>
          </div>
        </div>

        {/* Quick Demo Role Switcher Section */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <span className="text-xs font-mono uppercase text-cyan-400 font-bold block">
            ⚡ Demo Access Control Switcher
          </span>
          <p className="text-xs text-slate-400">
            Switch between Citizen reporter mode and Municipal Command Center Admin mode for testing.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => switchRole('citizen')}
              className={`py-2.5 px-4 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-2 ${
                user?.role === 'citizen' ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-glow-cyan' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Switch to Citizen</span>
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`py-2.5 px-4 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-2 ${
                user?.role === 'admin' ? 'bg-rose-500 text-white border-rose-400 shadow-glow-rose' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Switch to Admin</span>
            </button>
          </div>
        </div>

        {/* Account Details */}
        <div className="space-y-3 text-xs">
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Platform ID</span>
            <span className="font-mono text-slate-200">{user?.id || 'demo-user-101'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">AI Priority Engine SLA</span>
            <span className="font-mono text-emerald-400 font-bold">ACTIVE</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 font-bold text-xs border border-slate-800 hover:border-rose-600/30 transition-all"
        >
          Sign Out of Platform
        </button>
      </div>

    </div>
  );
};
