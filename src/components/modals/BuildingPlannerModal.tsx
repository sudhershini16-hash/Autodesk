import React, { useState } from 'react';
import { BuildingType } from '../../types';
import {
  X,
  Building,
  Hospital,
  GraduationCap,
  Store,
  Factory,
  ShieldCheck,
  Sun,
  Leaf,
  Plus,
  Compass,
} from 'lucide-react';

interface BuildingPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpawnBuilding: (buildingConfig: {
    name: string;
    type: BuildingType;
    height: number;
    floors: number;
    width: number;
    length: number;
    hasGreenRoof: boolean;
    hasSolarRoof: boolean;
  }) => void;
  initialType?: BuildingType;
}

export const BuildingPlannerModal: React.FC<BuildingPlannerModalProps> = ({
  isOpen,
  onClose,
  onSpawnBuilding,
  initialType = 'Residential',
}) => {
  const [type, setType] = useState<BuildingType>(initialType);
  const [name, setName] = useState<string>('Futuristic Tower');
  const [height, setHeight] = useState<number>(45);
  const [floors, setFloors] = useState<number>(12);
  const [width, setWidth] = useState<number>(35);
  const [length, setLength] = useState<number>(35);
  const [hasGreenRoof, setHasGreenRoof] = useState<boolean>(true);
  const [hasSolarRoof, setHasSolarRoof] = useState<boolean>(true);

  if (!isOpen) return null;

  const footprintM2 = width * length;
  const grossFloorAreaM2 = footprintM2 * floors;
  const estimatedResidents = Math.round(grossFloorAreaM2 / 32);
  const dailyEnergyKwh = Math.round(grossFloorAreaM2 * 0.22);
  const dailySolarKwh = hasSolarRoof ? Math.round(footprintM2 * 0.6) : 0;

  const handleHeightChange = (val: number) => {
    setHeight(val);
    setFloors(Math.max(1, Math.round(val / 3.5)));
  };

  const handleFloorsChange = (val: number) => {
    setFloors(val);
    setHeight(Math.round(val * 3.5));
  };

  const handleCreate = () => {
    onSpawnBuilding({
      name: name || `${type} Complex`,
      type,
      height,
      floors,
      width,
      length,
      hasGreenRoof,
      hasSolarRoof,
    });
    onClose();
  };

  const buildingTypes: { type: BuildingType; label: string; icon: any; color: string }[] = [
    { type: 'Residential', label: 'Residential Living', icon: Building, color: 'text-emerald-400' },
    { type: 'Commercial', label: 'Commercial Complex', icon: Building, color: 'text-sky-400' },
    { type: 'Office', label: 'Office Skyscraper', icon: Building, color: 'text-blue-400' },
    { type: 'Hospital', label: 'Medical Hospital', icon: Hospital, color: 'text-red-400' },
    { type: 'School', label: 'School / Academy', icon: GraduationCap, color: 'text-purple-400' },
    { type: 'College', label: 'University Campus', icon: GraduationCap, color: 'text-indigo-400' },
    { type: 'Shopping Mall', label: 'Retail & Mall', icon: Store, color: 'text-amber-400' },
    { type: 'Government', label: 'Civic / Government', icon: ShieldCheck, color: 'text-yellow-400' },
    { type: 'Industrial', label: 'Clean Tech Industry', icon: Factory, color: 'text-orange-400' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider">
                Architectural Building Planner
              </h2>
              <p className="text-xs text-slate-400">Configure massing, height, and sustainability systems</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BUILDING TYPE GRID */}
        <div className="mb-4">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Structure Typology
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {buildingTypes.map((b) => (
              <button
                key={b.type}
                onClick={() => {
                  setType(b.type);
                  setName(`${b.type} Tower`);
                }}
                className={`p-2 rounded-xl border text-left flex items-center gap-2 text-xs transition-all ${
                  type === b.type
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                    : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <b.icon className={`w-3.5 h-3.5 ${b.color} shrink-0`} />
                <span className="truncate">{b.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* DIMENSIONS SLIDERS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 mb-4 text-xs">
          {/* Height */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">Height (10m - 120m)</span>
              <span className="font-mono text-cyan-300 font-bold">{height}m</span>
            </div>
            <input
              type="range"
              min="10"
              max="120"
              step="2"
              value={height}
              onChange={(e) => handleHeightChange(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Floors */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">Number of Floors</span>
              <span className="font-mono text-cyan-300 font-bold">{floors}</span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={floors}
              onChange={(e) => handleFloorsChange(parseInt(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Width */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">Width</span>
              <span className="font-mono text-cyan-300 font-bold">{width}m</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              step="5"
              value={width}
              onChange={(e) => setWidth(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Length */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">Length</span>
              <span className="font-mono text-cyan-300 font-bold">{length}m</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              step="5"
              value={length}
              onChange={(e) => setLength(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* SUSTAINABLE FEATURES TOGGLES */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setHasGreenRoof(!hasGreenRoof)}
            className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
              hasGreenRoof
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-950/40 border-slate-800 text-slate-400'
            }`}
          >
            <span className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              Green Living Roof
            </span>
            <span className="text-[10px] font-bold">{hasGreenRoof ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setHasSolarRoof(!hasSolarRoof)}
            className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
              hasSolarRoof
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                : 'bg-slate-950/40 border-slate-800 text-slate-400'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              Solar PV Canopy
            </span>
            <span className="text-[10px] font-bold">{hasSolarRoof ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* ESTIMATED OUTPUT METRICS */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/40 border border-slate-800 mb-5 text-center text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Gross Floor Area</span>
            <span className="font-extrabold text-white">{grossFloorAreaM2.toLocaleString()} m²</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Capacity</span>
            <span className="font-extrabold text-indigo-400">~{estimatedResidents} ppl</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Energy Balance</span>
            <span className="font-extrabold text-amber-400">
              {dailySolarKwh > 0 ? `+${dailySolarKwh} kWh/d Clean` : `${dailyEnergyKwh} kWh/d`}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            Place Structure into 3D Site
          </button>
        </div>
      </div>
    </div>
  );
};
