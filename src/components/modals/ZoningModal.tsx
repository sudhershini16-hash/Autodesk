import React from 'react';
import { ZoneType } from '../../types';
import {
  X,
  PieChart,
  Check,
  Building,
  Hospital,
  GraduationCap,
  Trees,
  Sprout,
  ShieldCheck,
  Laptop,
  Layers,
} from 'lucide-react';

interface ZoningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectZoneTool: (zoneType: ZoneType) => void;
}

export const ZoningModal: React.FC<ZoningModalProps> = ({
  isOpen,
  onClose,
  onSelectZoneTool,
}) => {
  if (!isOpen) return null;

  const zones: {
    type: ZoneType;
    name: string;
    color: string;
    far: string;
    heightLimit: string;
    targetGreen: string;
    desc: string;
  }[] = [
    {
      type: 'Residential',
      name: 'Residential Living District',
      color: 'bg-amber-500',
      far: '2.5 - 4.0 FAR',
      heightLimit: '45m limit',
      targetGreen: '30% target',
      desc: 'High-quality sustainable housing, neighborhood pocket parks, daycare.',
    },
    {
      type: 'Commercial',
      name: 'Commercial & Financial Hub',
      color: 'bg-sky-500',
      far: '5.0 - 8.0 FAR',
      heightLimit: '120m limit',
      targetGreen: '20% target',
      desc: 'Grade-A corporate headquarters, retail podiums, high transit access.',
    },
    {
      type: 'Mixed-Use',
      name: 'Vibrant Mixed-Use Corridor',
      color: 'bg-indigo-500',
      far: '4.0 - 6.0 FAR',
      heightLimit: '80m limit',
      targetGreen: '25% target',
      desc: 'Ground-floor retail with co-working and residential apartments above.',
    },
    {
      type: 'Green Zone',
      name: 'Parks & Ecological Corridors',
      color: 'bg-emerald-500',
      far: '0.1 FAR max',
      heightLimit: '8m pavilions',
      targetGreen: '90% target',
      desc: 'Bio-retention basins, pollinator pathways, urban cooling buffers.',
    },
    {
      type: 'Education',
      name: 'Education & University Campus',
      color: 'bg-purple-500',
      far: '2.0 - 3.5 FAR',
      heightLimit: '35m limit',
      targetGreen: '35% target',
      desc: 'Smart schools, research laboratories, pedestrian-only boulevards.',
    },
    {
      type: 'Healthcare',
      name: 'Healthcare & Wellness District',
      color: 'bg-red-500',
      far: '2.5 - 4.5 FAR',
      heightLimit: '50m limit',
      targetGreen: '30% target',
      desc: 'Tertiary hospitals, emergency vehicle priority lanes, healing gardens.',
    },
    {
      type: 'IT Park',
      name: 'Smart Tech & Innovation Campus',
      color: 'bg-cyan-500',
      far: '4.0 - 6.5 FAR',
      heightLimit: '75m limit',
      targetGreen: '25% target',
      desc: 'Data centers, incubators, rooftop solar arrays, autonomous shuttle lanes.',
    },
    {
      type: 'Public Services',
      name: 'Civic & Municipal Services',
      color: 'bg-yellow-500',
      far: '2.0 - 3.0 FAR',
      heightLimit: '40m limit',
      targetGreen: '25% target',
      desc: 'City hall, library, cultural art centers, disaster response headquarters.',
    },
    {
      type: 'Industrial',
      name: 'Clean Tech & Advanced Logistics',
      color: 'bg-orange-500',
      far: '1.5 - 2.5 FAR',
      heightLimit: '30m limit',
      targetGreen: '15% target',
      desc: 'Zero-emission assembly, smart warehousing, automated freight logistics.',
    },
    {
      type: 'Agriculture',
      name: 'Urban Agriculture & Vertical Farming',
      color: 'bg-lime-500',
      far: '1.0 - 2.0 FAR',
      heightLimit: '25m limit',
      targetGreen: '75% target',
      desc: 'Hydroponics, closed-loop vertical farms, community food security.',
    },
  ];

  const handleSelect = (zone: ZoneType) => {
    onSelectZoneTool(zone);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider">
                Smart Zoning & Land-Use Regulation
              </h2>
              <p className="text-xs text-slate-400">
                10 Statutory Urban Planning Zones with Floor Area Ratios (FAR)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ZONES LIST */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-1">
          {zones.map((z) => (
            <div
              key={z.type}
              className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all"
            >
              <div className="flex items-start gap-3">
                <div className={`w-3.5 h-3.5 rounded-md ${z.color} shrink-0 mt-0.5`} />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-200">{z.name}</h4>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
                      {z.far}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{z.desc}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1 font-mono">
                    <span>Height: {z.heightLimit}</span>
                    <span>•</span>
                    <span>Green Target: {z.targetGreen}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSelect(z.type)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all shrink-0 cursor-pointer"
              >
                Apply Zone Tool
              </button>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 mt-3">
          <span>Standards: Forma-aligned zoning classification</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
