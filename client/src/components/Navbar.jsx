import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  MapPin, 
  PlusCircle, 
  BarChart3, 
  User as UserIcon, 
  LogOut, 
  Shield, 
  Menu, 
  X, 
  Flame,
  Radio
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onOpenAuth }) => {
  const { user, logout, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'Home', path: '/', icon: <Activity className="w-4 h-4" /> },
    { label: 'Report Issue', path: '/report', icon: <PlusCircle className="w-4 h-4 text-cyan-400" /> },
    { label: 'Explore Map', path: '/map', icon: <MapPin className="w-4 h-4 text-emerald-400" /> },
    { label: 'Dashboard', path: '/dashboard', icon: <BarChart3 className="w-4 h-4 text-amber-400" /> },
    ...(user ? [{ label: 'My Reports', path: '/my-reports', icon: <UserIcon className="w-4 h-4" /> }] : [])
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 group-hover:border-cyan-400 transition-all shadow-glow-cyan">
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
              <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-sm group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black tracking-wider text-xl bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                  CIVICPULSE
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                  AI v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">Civic Intelligence Platform</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Role Switcher for Demo Testing */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 px-2 font-semibold">Role:</span>
              <button
                onClick={() => switchRole('citizen')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  user?.role === 'citizen' || !user
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Citizen
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                  user?.role === 'admin'
                    ? 'bg-rose-500 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-3 h-3" />
                Admin
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-xs font-bold text-cyan-400">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors leading-tight">{user.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono capitalize">{user.role}</p>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-glow-cyan transition-all"
              >
                Sign In / Demo
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 font-mono font-semibold">Demo Role:</span>
            <div className="flex gap-1">
              <button
                onClick={() => { switchRole('citizen'); setMobileMenuOpen(false); }}
                className={`px-3 py-1 text-xs rounded font-bold ${user?.role === 'citizen' || !user ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'}`}
              >
                Citizen
              </button>
              <button
                onClick={() => { switchRole('admin'); setMobileMenuOpen(false); }}
                className={`px-3 py-1 text-xs rounded font-bold ${user?.role === 'admin' ? 'bg-rose-500 text-white' : 'text-slate-400'}`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {!user && (
            <button
              onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 rounded-xl text-sm font-bold bg-cyan-500 text-slate-950 text-center"
            >
              Sign In / Demo Accounts
            </button>
          )}
        </div>
      )}
    </header>
  );
};
