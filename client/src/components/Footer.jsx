import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, Cpu, ShieldCheck, Heart, Github, Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-[#07090E] border-t border-slate-800/80 pt-12 pb-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800/60">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <span className="font-mono font-black text-lg text-white">CIVICPULSE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transforming individual citizen reports into actionable, location-aware civic intelligence and automated municipal priority scoring.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>AI Priority Engine Active</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="font-mono font-semibold text-xs text-slate-200 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/report" className="hover:text-cyan-400 transition-colors">Report an Issue</Link></li>
              <li><Link to="/map" className="hover:text-cyan-400 transition-colors">Explore Civic Map</Link></li>
              <li><Link to="/dashboard" className="hover:text-cyan-400 transition-colors">Civic Intelligence Dashboard</Link></li>
              <li><Link to="/" className="hover:text-cyan-400 transition-colors">AI Analysis Methodology</Link></li>
            </ul>
          </div>

          {/* Technology & Architecture */}
          <div>
            <h4 className="font-mono font-semibold text-xs text-slate-200 uppercase tracking-wider mb-3">Architecture</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-cyan-400" /> LLM Priority Scoring</li>
              <li className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-emerald-400" /> Spatial Cluster Engine</li>
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Role-Based Access</li>
              <li>OpenStreetMap / Leaflet GIS</li>
            </ul>
          </div>

          {/* Vision & Compliance */}
          <div>
            <h4 className="font-mono font-semibold text-xs text-slate-200 uppercase tracking-wider mb-3">Civic Vision</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed for public authorities, NGOs, and community advocates to allocate resources where impact and safety risks are highest.
            </p>
            <div className="mt-3 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
              <span className="text-cyan-400 font-semibold">MVP Notice:</span> Realistic simulation mode active. No government affiliation claimed.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 CivicPulse Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-200 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-200 cursor-pointer">API Docs</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
