import React from 'react';
import {
  CityObject,
  BuildingType,
  ZoneType,
  SiteBoundary,
  CityMetrics,
} from '../../types';
import {
  X,
  Copy,
  Trash2,
  Eye,
  Sliders,
  Zap,
  Droplets,
  Users,
  Compass,
  ArrowUpRight,
  Sparkles,
  Info,
  Radio,
  BatteryCharging,
} from 'lucide-react';

interface RightPropertyPanelProps {
  selectedObject: CityObject | null;
  siteBoundary: SiteBoundary;
  metrics: CityMetrics;
  onDeselect: () => void;
  onUpdateObject: (updated: CityObject) => void;
  onDuplicateObject: (id: string) => void;
  onDeleteObject: (id: string) => void;
  onEnter3dView: (obj: CityObject) => void;
}

export const RightPropertyPanel: React.FC<RightPropertyPanelProps> = ({
  selectedObject,
  siteBoundary,
  metrics,
  onDeselect,
  onUpdateObject,
  onDuplicateObject,
  onDeleteObject,
  onEnter3dView,
}) => {
  if (!selectedObject) {
    return (
      <aside className="w-80 h-[calc(100vh-4rem)] border-l border-slate-800 bg-slate-900/95 backdrop-blur-md p-4 flex flex-col z-20 select-none overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Site Intelligence
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
            {metrics.totalSiteAreaHa} ha
          </span>
        </div>

        {/* Empty selection state prompt */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 text-center">
          <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-2">
            <Compass className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-200">
            No Object Selected
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Click any building, road, park, or sensor in the 3D viewport to inspect, edit dimensions, and view live telemetry.
          </p>
        </div>

        {/* Quick KPI Overview */}
        <div className="space-y-2 mb-4">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Masterplan Snapshot
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-[10px] text-slate-400">Sustainability</span>
              <p className="text-base font-extrabold text-emerald-400 mt-0.5">
                {metrics.sustainabilityScore}<span className="text-xs text-slate-400">/100</span>
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-[10px] text-slate-400">Renewable Energy</span>
              <p className="text-base font-extrabold text-cyan-400 mt-0.5">
                {metrics.renewableEnergyPct}%
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-[10px] text-slate-400">Pop. Capacity</span>
              <p className="text-base font-extrabold text-indigo-400 mt-0.5">
                {metrics.populationCapacity.toLocaleString()}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-[10px] text-slate-400">Green Canopy</span>
              <p className="text-base font-extrabold text-lime-400 mt-0.5">
                {metrics.greenCoveragePct}%
              </p>
            </div>
          </div>
        </div>

        {/* Zoning Key / Legend */}
        <div className="pt-2 border-t border-slate-800">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Zone Legend
          </label>
          <div className="space-y-1.5 text-xs">
            {[
              { name: 'Residential', color: 'bg-emerald-500', icon: '🏠' },
              { name: 'Commercial & Office', color: 'bg-sky-500', icon: '🏢' },
              { name: 'Healthcare & Hospital', color: 'bg-red-500', icon: '🏥' },
              { name: 'Education & College', color: 'bg-purple-500', icon: '🏫' },
              { name: 'Green Space & Parks', color: 'bg-green-600', icon: '🌳' },
              { name: 'Agriculture & Food', color: 'bg-lime-500', icon: '🌾' },
              { name: 'Clean Energy & Solar', color: 'bg-amber-500', icon: '⚡' },
              { name: 'Public Civic Services', color: 'bg-yellow-500', icon: '🏛' },
            ].map((z) => (
              <div
                key={z.name}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-950/30 text-[11px] text-slate-300"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: z.color.replace('bg-', '') }} />
                  <span>{z.name}</span>
                </div>
                <span>{z.icon}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  // OBJECT IS SELECTED
  const { width, length, height, floors = 1 } = selectedObject.dimensions;
  const footprintM2 = Math.round(width * length);
  const grossFloorAreaM2 = footprintM2 * floors;

  const handleDimensionChange = (key: 'width' | 'length' | 'height' | 'floors', val: number) => {
    const updated = {
      ...selectedObject,
      dimensions: {
        ...selectedObject.dimensions,
        [key]: val,
        // Sync floors with height if height is changed
        ...(key === 'height' ? { floors: Math.max(1, Math.round(val / 3.5)) } : {}),
        ...(key === 'floors' ? { height: Math.round(val * 3.5) } : {}),
      },
    };
    onUpdateObject(updated);
  };

  const handleNameChange = (newName: string) => {
    onUpdateObject({ ...selectedObject, name: newName });
  };

  const handleTypeChange = (newType: string) => {
    onUpdateObject({ ...selectedObject, type: newType });
  };

  return (
    <aside className="w-80 h-[calc(100vh-4rem)] border-l border-slate-800 bg-slate-900/95 backdrop-blur-md p-4 flex flex-col z-20 select-none overflow-y-auto custom-scrollbar">
      {/* HEADER & CLOSE */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Object Properties
          </h3>
        </div>
        <button
          onClick={onDeselect}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          title="Deselect"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* QUICK ACTIONS BAR */}
      <div className="flex items-center gap-1.5 mb-4">
        <button
          id="btn-enter-3d-view"
          onClick={() => onEnter3dView(selectedObject)}
          className="flex-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          ENTER 3D VIEW
        </button>

        <button
          id="btn-duplicate-obj"
          onClick={() => onDuplicateObject(selectedObject.id)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
          title="Duplicate Object"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        <button
          id="btn-delete-obj"
          onClick={() => onDeleteObject(selectedObject.id)}
          className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 transition-all"
          title="Delete Object"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* OBJECT IDENTITY */}
      <div className="space-y-2 mb-4">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Entity Name
          </label>
          <input
            type="text"
            value={selectedObject.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Category
            </label>
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 text-cyan-300 font-mono text-[11px] capitalize">
              {selectedObject.category}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Type
            </label>
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-200 text-[11px] truncate">
              {selectedObject.type}
            </div>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Spatial Coordinates
          </label>
          <div className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-300 flex items-center justify-between">
            <span>X: {Math.round(selectedObject.position[0])}m</span>
            <span>Y: {Math.round(selectedObject.position[1])}m</span>
            <span>Z: {Math.round(selectedObject.position[2])}m</span>
          </div>
        </div>
      </div>

      {/* DIMENSION SLIDERS (IF BUILDING OR SHAPED OBJECT) */}
      <div className="space-y-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
            Geometry Controls
          </span>
          <span className="text-[10px] text-cyan-400 font-mono">Live 3D Sync</span>
        </div>

        {/* Building Height Slider */}
        {selectedObject.category === 'building' && (
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">Building Height</span>
              <span className="font-mono text-cyan-300 font-bold">{height}m</span>
            </div>
            <input
              type="range"
              min="10"
              max="120"
              step="2"
              value={height}
              onChange={(e) => handleDimensionChange('height', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        )}

        {/* Floors Slider */}
        {selectedObject.category === 'building' && (
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">Number of Floors</span>
              <span className="font-mono text-cyan-300 font-bold">{floors}</span>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              step="1"
              value={floors}
              onChange={(e) => handleDimensionChange('floors', parseInt(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        )}

        {/* Width Slider */}
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-400">Width</span>
            <span className="font-mono text-cyan-300 font-bold">{width}m</span>
          </div>
          <input
            type="range"
            min="5"
            max="120"
            step="5"
            value={width}
            onChange={(e) => handleDimensionChange('width', parseFloat(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Length Slider */}
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-400">Length</span>
            <span className="font-mono text-cyan-300 font-bold">{length}m</span>
          </div>
          <input
            type="range"
            min="5"
            max="120"
            step="5"
            value={length}
            onChange={(e) => handleDimensionChange('length', parseFloat(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* METRICS & ESTIMATED IMPACT */}
      <div className="space-y-2 mb-4 text-xs">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Calculated Capacity & Load
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
            <span className="text-[10px] text-slate-400">Footprint</span>
            <p className="font-bold text-slate-200">{footprintM2.toLocaleString()} m²</p>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
            <span className="text-[10px] text-slate-400">Gross Floor Area</span>
            <p className="font-bold text-slate-200">{grossFloorAreaM2.toLocaleString()} m²</p>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
            <span className="text-[10px] text-slate-400">Est. Occupancy</span>
            <p className="font-bold text-indigo-400">
              {selectedObject.occupancy || Math.round(grossFloorAreaM2 / 30)} people
            </p>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
            <span className="text-[10px] text-slate-400">Energy Consumption</span>
            <p className="font-bold text-amber-400">
              {Math.round(grossFloorAreaM2 * 0.22)} kWh/d
            </p>
          </div>
        </div>
      </div>

      {/* TELEMETRY DATA (IF SMART SENSOR / INFRASTRUCTURE) */}
      {selectedObject.telemetry && (
        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs mb-3 space-y-2">
          <div className="flex items-center gap-1.5 text-cyan-300 font-bold uppercase tracking-wider text-[10px]">
            <Radio className="w-3.5 h-3.5" />
            Live IoT Telemetry
          </div>

          {selectedObject.telemetry.fillLevel !== undefined && (
            <div>
              <div className="flex justify-between text-[11px] mb-1 text-slate-300">
                <span>Waste Fill Level</span>
                <span className="font-bold text-amber-400">
                  {selectedObject.telemetry.fillLevel}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-400"
                  style={{ width: `${selectedObject.telemetry.fillLevel}%` }}
                />
              </div>
            </div>
          )}

          {selectedObject.telemetry.airQualityIndex !== undefined && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300">Air Quality Index (AQI):</span>
              <span className="font-bold text-emerald-400">
                {selectedObject.telemetry.airQualityIndex} (Good)
              </span>
            </div>
          )}

          {selectedObject.telemetry.lastCollection && (
            <div className="text-[10px] text-slate-400">
              Last Cleared: {selectedObject.telemetry.lastCollection}
            </div>
          )}
        </div>
      )}

      {/* DISCLAIMER BADGE */}
      <div className="mt-auto pt-2 border-t border-slate-800/60 text-[10px] text-slate-500 flex items-center gap-1">
        <Info className="w-3 h-3 text-slate-500 shrink-0" />
        <span>All calculations are estimated architectural models.</span>
      </div>
    </aside>
  );
};
