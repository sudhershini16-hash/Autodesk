import React, { useState } from 'react';
import {
  FolderPlus,
  FolderOpen,
  Save,
  Download,
  Building,
  Route,
  Trees,
  Waves,
  Sprout,
  Sun,
  Zap,
  BatteryCharging,
  Radio,
  Lightbulb,
  Trash2,
  Droplets,
  Gauge,
  Wind,
  Footprints,
  Car,
  PieChart,
  Users,
  ChevronDown,
  ChevronRight,
  Plus,
  ShieldCheck,
  Hospital,
  GraduationCap,
  Store,
  Factory,
  Check,
} from 'lucide-react';
import {
  BuildingType,
  RoadType,
  ZoneType,
  AnalysisOverlay,
} from '../../types';

interface LeftSidebarProps {
  activeTool: string | null;
  onSelectTool: (tool: string | null) => void;
  activeOverlay: AnalysisOverlay;
  onToggleOverlay: (overlay: AnalysisOverlay) => void;
  onOpenBoundaryModal: () => void;
  onOpenBuildingModal: (type?: BuildingType) => void;
  onOpenZoningModal: () => void;
  onNewProject: () => void;
  onSaveProject: () => void;
  onOpenLoadProject: () => void;
  onOpenExportModal: () => void;
  onSelectSampleCity: (name: string) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeTool,
  onSelectTool,
  activeOverlay,
  onToggleOverlay,
  onOpenBoundaryModal,
  onOpenBuildingModal,
  onOpenZoningModal,
  onNewProject,
  onSaveProject,
  onOpenLoadProject,
  onOpenExportModal,
  onSelectSampleCity,
}) => {
  const [collapsedSections, setCollapsedSections] = useState<{
    [key: string]: boolean;
  }>({
    project: false,
    siteDesign: false,
    smartSystems: false,
    analysis: false,
  });

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleToolClick = (toolName: string) => {
    if (activeTool === toolName) {
      onSelectTool(null);
    } else {
      onSelectTool(toolName);
    }
  };

  return (
    <aside className="w-72 h-[calc(100vh-4rem)] border-r border-slate-800 bg-slate-900/95 backdrop-blur-md flex flex-col z-20 select-none overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {/* SECTION: PROJECT */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 overflow-hidden">
          <button
            onClick={() => toggleSection('project')}
            className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white bg-slate-800/30 transition-all"
          >
            <span className="flex items-center gap-2">
              <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
              Project
            </span>
            {collapsedSections.project ? (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {!collapsedSections.project && (
            <div className="p-2 space-y-1 text-xs">
              <div className="grid grid-cols-2 gap-1 mb-2">
                <button
                  id="btn-project-new"
                  onClick={onNewProject}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 flex items-center gap-1.5 transition-all"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-emerald-400" />
                  New Project
                </button>
                <button
                  id="btn-project-save"
                  onClick={onSaveProject}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 flex items-center gap-1.5 transition-all"
                >
                  <Save className="w-3.5 h-3.5 text-cyan-400" />
                  Save Project
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <button
                  id="btn-project-open"
                  onClick={onOpenLoadProject}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 flex items-center gap-1.5 transition-all"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                  Open Project
                </button>
                <button
                  id="btn-project-export"
                  onClick={onOpenExportModal}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  Export
                </button>
              </div>

              {/* Sample Cities Quick Select */}
              <div className="pt-2 border-t border-slate-800/80">
                <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                  Sample Cities
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => onSelectSampleCity('green-future')}
                    className="w-full text-left px-2 py-1 rounded bg-slate-900 hover:bg-cyan-950/40 hover:text-cyan-300 text-slate-300 text-[11px] flex items-center justify-between"
                  >
                    <span>🌱 Green Future City</span>
                    <span className="text-[9px] text-emerald-400 font-mono">Active</span>
                  </button>
                  <button
                    onClick={() => onSelectSampleCity('high-density')}
                    className="w-full text-left px-2 py-1 rounded bg-slate-900 hover:bg-cyan-950/40 hover:text-cyan-300 text-slate-300 text-[11px]"
                  >
                    🏙 High-Density Metropolis
                  </button>
                  <button
                    onClick={() => onSelectSampleCity('blank')}
                    className="w-full text-left px-2 py-1 rounded bg-slate-900 hover:bg-cyan-950/40 hover:text-cyan-300 text-slate-300 text-[11px]"
                  >
                    📐 Blank Canvas
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION: SITE DESIGN */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 overflow-hidden">
          <button
            onClick={() => toggleSection('siteDesign')}
            className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white bg-slate-800/30 transition-all"
          >
            <span className="flex items-center gap-2">
              <Building className="w-3.5 h-3.5 text-indigo-400" />
              Site Design
            </span>
            {collapsedSections.siteDesign ? (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {!collapsedSections.siteDesign && (
            <div className="p-2 space-y-1 text-xs">
              {/* Site Boundary */}
              <button
                id="btn-tool-boundary"
                onClick={onOpenBoundaryModal}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 text-slate-300 flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Site Boundary
                </span>
                <span className="text-[10px] text-slate-400">Configure</span>
              </button>

              {/* Zoning */}
              <button
                id="btn-tool-zoning"
                onClick={onOpenZoningModal}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 text-slate-300 flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2">
                  <PieChart className="w-3.5 h-3.5 text-amber-400" />
                  Smart Zoning
                </span>
                <span className="text-[10px] text-slate-400">10 Zones</span>
              </button>

              {/* Buildings Category */}
              <div className="pt-1.5">
                <div className="flex items-center justify-between px-1 mb-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Add Buildings
                  </span>
                  <button
                    onClick={() => onOpenBuildingModal()}
                    className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
                  >
                    Custom <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1">
                  {[
                    { label: 'Residential', type: 'Residential', icon: Building, color: 'text-emerald-400' },
                    { label: 'Commercial', type: 'Commercial', icon: Building, color: 'text-sky-400' },
                    { label: 'Hospital', type: 'Hospital', icon: Hospital, color: 'text-red-400' },
                    { label: 'School/College', type: 'School', icon: GraduationCap, color: 'text-purple-400' },
                    { label: 'Office Tower', type: 'Office', icon: Building, color: 'text-blue-400' },
                    { label: 'Shopping Mall', type: 'Shopping Mall', icon: Store, color: 'text-amber-400' },
                    { label: 'Industrial', type: 'Industrial', icon: Factory, color: 'text-orange-400' },
                    { label: 'Civic / Gov', type: 'Government', icon: ShieldCheck, color: 'text-yellow-400' },
                  ].map((b) => (
                    <button
                      key={b.type}
                      onClick={() => handleToolClick(`Building: ${b.type}`)}
                      className={`px-2 py-1.5 rounded-lg text-left flex items-center gap-1.5 text-[11px] transition-all ${
                        activeTool === `Building: ${b.type}`
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                          : 'bg-slate-800/40 hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <b.icon className={`w-3 h-3 ${b.color}`} />
                      <span className="truncate">{b.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Roads & Transport */}
              <div className="pt-1.5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider px-1 block mb-1">
                  Roads & Pathways
                </span>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { label: 'Main (20m)', tool: 'Road: Main Road' },
                    { label: 'Secondary (12m)', tool: 'Road: Secondary Road' },
                    { label: 'Local (8m)', tool: 'Road: Local Road' },
                    { label: 'Pedestrian (4m)', tool: 'Road: Pedestrian Path' },
                  ].map((r) => (
                    <button
                      key={r.tool}
                      onClick={() => handleToolClick(r.tool)}
                      className={`px-2 py-1.5 rounded-lg text-left flex items-center gap-1.5 text-[11px] transition-all ${
                        activeTool === r.tool
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                          : 'bg-slate-800/40 hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <Route className="w-3 h-3 text-cyan-400" />
                      <span className="truncate">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Landscape & Greenery */}
              <div className="pt-1.5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider px-1 block mb-1">
                  Landscape & Nature
                </span>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => handleToolClick('Park: Urban Park')}
                    className={`px-2 py-1.5 rounded-lg text-left flex items-center gap-1.5 text-[11px] transition-all ${
                      activeTool === 'Park: Urban Park'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-800/40 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <Trees className="w-3 h-3 text-emerald-400" />
                    Urban Park
                  </button>
                  <button
                    onClick={() => handleToolClick('Water: Lake')}
                    className={`px-2 py-1.5 rounded-lg text-left flex items-center gap-1.5 text-[11px] transition-all ${
                      activeTool === 'Water: Lake'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-800/40 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <Waves className="w-3 h-3 text-sky-400" />
                    Water Lake
                  </button>
                  <button
                    onClick={() => handleToolClick('Agri: Vertical Farm')}
                    className={`px-2 py-1.5 rounded-lg text-left flex items-center gap-1.5 text-[11px] transition-all ${
                      activeTool === 'Agri: Vertical Farm'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-800/40 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <Sprout className="w-3 h-3 text-lime-400" />
                    Agri Farm
                  </button>
                  <button
                    onClick={() => handleToolClick('Tree: Canopy')}
                    className={`px-2 py-1.5 rounded-lg text-left flex items-center gap-1.5 text-[11px] transition-all ${
                      activeTool === 'Tree: Canopy'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-800/40 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <Trees className="w-3 h-3 text-green-500" />
                    Tree Cluster
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION: SMART SYSTEMS */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 overflow-hidden">
          <button
            onClick={() => toggleSection('smartSystems')}
            className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white bg-slate-800/30 transition-all"
          >
            <span className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Smart Systems
            </span>
            {collapsedSections.smartSystems ? (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {!collapsedSections.smartSystems && (
            <div className="p-2 space-y-1 text-xs">
              <div className="grid grid-cols-2 gap-1">
                {[
                  { label: 'Solar Farm', tool: 'Infra: Solar Farm', icon: Sun, color: 'text-amber-400' },
                  { label: 'Wind Turbine', tool: 'Infra: Wind Turbine', icon: Wind, color: 'text-sky-300' },
                  { label: 'EV Charging Hub', tool: 'Infra: EV Charging Station', icon: BatteryCharging, color: 'text-emerald-400' },
                  { label: 'Smart Light', tool: 'Infra: Smart Street Light', icon: Lightbulb, color: 'text-yellow-400' },
                  { label: 'Smart Bin', tool: 'Infra: Smart Waste Bin', icon: Trash2, color: 'text-teal-400' },
                  { label: 'Water Recycler', tool: 'Infra: Water Treatment Plant', icon: Droplets, color: 'text-cyan-400' },
                  { label: 'IoT Air Sensor', tool: 'Infra: IoT Air Quality Sensor', icon: Radio, color: 'text-purple-400' },
                  { label: 'Transit Bus Hub', tool: 'Infra: Electric Bus Stop', icon: Car, color: 'text-blue-400' },
                ].map((s) => (
                  <button
                    key={s.tool}
                    onClick={() => handleToolClick(s.tool)}
                    className={`px-2 py-1.5 rounded-lg text-left flex items-center gap-1.5 text-[11px] transition-all ${
                      activeTool === s.tool
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                        : 'bg-slate-800/40 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <s.icon className={`w-3 h-3 ${s.color}`} />
                    <span className="truncate">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION: ANALYSIS & SIMULATIONS */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 overflow-hidden">
          <button
            onClick={() => toggleSection('analysis')}
            className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white bg-slate-800/30 transition-all"
          >
            <span className="flex items-center gap-2">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              Analysis Overlays
            </span>
            {collapsedSections.analysis ? (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {!collapsedSections.analysis && (
            <div className="p-2 space-y-1 text-xs">
              <div className="space-y-1">
                {[
                  { id: 'sunlight', label: 'Sunlight & Shadow Exposure', icon: Sun, color: 'text-amber-400' },
                  { id: 'wind', label: 'Aerodynamic Wind Vectors', icon: Wind, color: 'text-sky-400' },
                  { id: 'walkability', label: 'Walkability Heatmap (15-min)', icon: Footprints, color: 'text-emerald-400' },
                  { id: 'traffic', label: 'Traffic Congestion Flows', icon: Car, color: 'text-orange-400' },
                  { id: 'heat', label: 'Urban Heat Island Gradient', icon: Zap, color: 'text-red-400' },
                ].map((ov) => (
                  <button
                    key={ov.id}
                    onClick={() => onToggleOverlay(ov.id as AnalysisOverlay)}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] transition-all ${
                      activeOverlay === ov.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                        : 'bg-slate-800/40 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <ov.icon className={`w-3.5 h-3.5 ${ov.color}`} />
                      {ov.label}
                    </span>
                    {activeOverlay === ov.id && (
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QUICK STATUS BAR AT FOOTER */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Snap to 5m Grid: <strong className="text-slate-200">Active</strong></span>
        <span className="text-emerald-400 font-mono">Synced</span>
      </div>
    </aside>
  );
};
