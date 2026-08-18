import React, { useState } from 'react';
import { X, Shield, User, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const toast = useToast();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(name, email, password, role);
        toast.success(`Account registered successfully as ${role.toUpperCase()}`);
      } else {
        await login(email, password);
        toast.success('Signed in successfully!');
      }
      onClose();
    } catch (err) {
      toast.error(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoRole) => {
    setLoading(true);
    try {
      const demoEmail = demoRole === 'admin' ? 'admin@civicpulse.org' : 'citizen@civicpulse.org';
      const demoPass = demoRole === 'admin' ? 'admin123' : 'citizen123';
      await login(demoEmail, demoPass);
      toast.success(`Signed in with Demo ${demoRole.toUpperCase()} Account!`);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel-glow p-6 sm:p-8 rounded-2xl border border-cyan-500/30 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <h2 className="font-mono text-2xl font-black text-white">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isRegister ? 'Join the CivicPulse Intelligence Platform' : 'Access citizen reporting & municipal priority insights'}
          </p>
        </div>

        {/* Quick Demo Credentials Buttons */}
        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
          <p className="text-[11px] font-mono uppercase text-cyan-400 font-semibold tracking-wider">
            ⚡ Quick 1-Click Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('citizen')}
              disabled={loading}
              className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Demo Citizen</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
              className="py-2 px-3 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-xs font-bold text-rose-300 border border-rose-600/40 flex items-center justify-center gap-1.5 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@civicpulse.org"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('citizen')}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                    role === 'citizen' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  Citizen User
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                    role === 'admin' ? 'bg-rose-500/20 text-rose-300 border-rose-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  Municipal Admin
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-glow-cyan flex items-center justify-center gap-2 transition-all mt-2"
          >
            <span>{loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-2 border-t border-slate-800">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-slate-400 hover:text-cyan-400 transition-colors font-medium"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>

      </div>
    </div>
  );
};
