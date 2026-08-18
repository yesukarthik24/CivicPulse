import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { PriorityBadge, SeverityBadge, StatusBadge } from './PriorityBadge';
import { Layers, Flame, MapPin, Navigation, Eye } from 'lucide-react';

// Custom Marker Icon generator using Leaflet DivIcon
const createCustomMarker = (severity, score) => {
  let color = '#06B6D4';
  if (severity === 'Critical') color = '#F43F5E';
  else if (severity === 'High') color = '#F59E0B';
  else if (severity === 'Low') color = '#10B981';

  const html = `
    <div style="position: relative; width: 34px; height: 34px; display: flex; items-center: center; justify-content: center;">
      <div style="position: absolute; inset: 0; border-radius: 50%; background: ${color}; opacity: 0.25; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: relative; width: 26px; height: 26px; border-radius: 50%; background: #0B0F19; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px ${color};">
        <span style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; color: #FFFFFF;">${score}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18]
  });
};

// Map Recenter Helper
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.2 });
    }
  }, [center, map]);
  return null;
};

export const InteractiveMap = ({ 
  issues = [], 
  hotspots = [], 
  onSelectIssue,
  selectedIssueId = null,
  height = "650px"
}) => {
  const [hotspotMode, setHotspotMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');

  // Default center around San Francisco / Metro coordinates
  const defaultCenter = [37.7780, -122.4180];

  const filteredIssues = issues.filter(issue => {
    if (selectedCategory && issue.category !== selectedCategory) return false;
    if (selectedSeverity && issue.severity !== selectedSeverity) return false;
    return true;
  });

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl" style={{ height }}>
      
      {/* Map Control Bar Overlay */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-3 p-3 glass-panel rounded-xl border border-slate-700/60 shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900/90 text-xs text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-medium"
          >
            <option value="">All Categories ({issues.length})</option>
            <option value="Potholes & Roads">Potholes & Roads</option>
            <option value="Streetlights & Power">Streetlights & Power</option>
            <option value="Water & Leakage">Water & Leakage</option>
            <option value="Garbage & Sanitation">Garbage & Sanitation</option>
            <option value="Drainage & Sewage">Drainage & Sewage</option>
            <option value="Traffic & Signage">Traffic & Signage</option>
            <option value="Public Infrastructure">Public Infrastructure</option>
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-900/90 text-xs text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-medium"
          >
            <option value="">All Severities</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Hotspots Mode Toggle */}
        <button
          onClick={() => setHotspotMode(!hotspotMode)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            hotspotMode
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-glow-rose'
              : 'bg-slate-900/80 text-slate-300 border border-slate-700 hover:text-white'
          }`}
        >
          <Flame className={`w-4 h-4 ${hotspotMode ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
          <span>{hotspotMode ? 'Hotspots Overlay Active' : 'Hotspots Mode'}</span>
        </button>
      </div>

      {/* Leaflet Map Canvas */}
      <MapContainer
        center={defaultCenter}
        zoom={13}
        zoomControl={false}
        className="w-full h-full dark-tiles"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render Hotspot Cluster Circles if Hotspot mode is enabled */}
        {hotspotMode && hotspots.map((cluster, idx) => {
          if (!cluster.centerLocation?.lat || !cluster.centerLocation?.lng) return null;
          return (
            <CircleMarker
              key={`hotspot-${cluster._id || idx}`}
              center={[cluster.centerLocation.lat, cluster.centerLocation.lng]}
              radius={35 + (cluster.priorityScore / 3)}
              pathOptions={{
                color: cluster.priorityScore >= 80 ? '#F43F5E' : '#F59E0B',
                fillColor: cluster.priorityScore >= 80 ? '#F43F5E' : '#F59E0B',
                fillOpacity: 0.25,
                weight: 2
              }}
            >
              <Popup>
                <div className="p-2 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase">
                    <Flame className="w-4 h-4" />
                    <span>Spatial Cluster Hotspot</span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm">{cluster.name}</h4>
                  <p className="text-xs text-slate-300">{cluster.reportCount} Associated Reports</p>
                  <p className="text-xs text-slate-400 italic">"{cluster.aiInsight}"</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Issue Markers */}
        {filteredIssues.map((issue) => {
          if (!issue.location?.lat || !issue.location?.lng) return null;
          const isSelected = selectedIssueId === issue._id;

          return (
            <Marker
              key={issue._id}
              position={[issue.location.lat, issue.location.lng]}
              icon={createCustomMarker(issue.severity, issue.priorityScore)}
            >
              <Popup>
                <div className="p-2 space-y-3 max-w-xs">
                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge status={issue.status} />
                    <PriorityBadge score={issue.priorityScore} size="sm" showLabel={false} />
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono text-cyan-400 font-semibold">{issue.category}</span>
                    <h3 className="font-bold text-slate-100 text-sm leading-snug line-clamp-2">{issue.title}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{issue.location.address || 'Metro District'}</span>
                    </p>
                  </div>

                  <SeverityBadge severity={issue.severity} />

                  {issue.aiAnalysis?.summary && (
                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 italic">
                      AI Summary: "{issue.aiAnalysis.summary.substring(0, 85)}..."
                    </div>
                  )}

                  <button
                    onClick={() => onSelectIssue && onSelectIssue(issue)}
                    className="w-full py-1.5 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-cyan-500/40"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Issue Detail</span>
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[400] glass-panel px-3 py-2 rounded-xl border border-slate-800 text-xs flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-glow-rose" />
          <span className="text-slate-300 text-[11px]">Critical (80+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-slate-300 text-[11px]">High (65+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
          <span className="text-slate-300 text-[11px]">Medium (40+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-300 text-[11px]">Low (&lt;40)</span>
        </div>
      </div>

    </div>
  );
};
