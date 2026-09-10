import React from 'react';
import { CityMetrics, SiteBoundary } from '../../types';
import {
  Compass,
  PlusCircle,
  Building,
  Trees,
  Route,
  Users,
  Zap,
  Droplets,
  ShieldCheck,
  TrendingUp,
  Leaf,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';

interface DashboardViewProps {
  metrics: CityMetrics;
  boundary: SiteBoundary;
  onContinuePlanning: () => void;
  onCreateNewCity: () => void;
  onOpenAiAssistant: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  boundary,
  onContinuePlanning,
  onCreateNewCity,
  onOpenAiAssistant,
}) => {
  const landUseData = [
    { name: 'Greenery & Parks', value: metrics.greenAreaHa, color: '#22c55e' },
    { name: 'Buildings & Built-up', value: metrics.builtUpAreaHa, color: '#0ea5e9' },
    { name: 'Roads & Transit', value: metrics.roadAreaHa, color: '#64748b' },
    { name: 'Water Bodies', value: Math.max(8, metrics.waterAreaHa), color: '#06b6d4' },
    { name: 'Open / Reserve', value: Math.max(10, metrics.totalSiteAreaHa - (metrics.greenAreaHa + metrics.builtUpAreaHa + metrics.roadAreaHa)), color: '#334155' },
  ];

  const energyBreakdown = [
    { source: 'Solar Farm', gen: 14.8 },
    { source: 'Rooftop PV', gen: 6.2 },
    { source: 'Wind Turbines', gen: 3.6 },
    { source: 'Grid Demand', gen: metrics.dailyEnergyDemandMwh },
  ];

  return (
    <div className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar p-6 bg-slate-950 text-slate-100 select-none">
      {/* HERO BANNER & PRIMARY ACTIONS */}
      <div className="relative rounded-3xl overflow-hidden p-8 border border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 shadow-2xl mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold w-fit mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Urban Digital Twin & AI Generative Planning Platform
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
              Smart City Site Masterplan
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Design, simulate, and optimize futuristic net-zero urban masterplans in real-time 3D. Inspect sunlight exposure, aerodynamic wind corridors, 15-minute walkability, and renewable microgrids.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="btn-dash-continue-planning"
              onClick={onContinuePlanning}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-cyan-500/25 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4 text-slate-950" />
              Continue Planning
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              id="btn-dash-new-city"
              onClick={onCreateNewCity}
              className="px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              Create New Smart City
            </button>

            <button
              id="btn-dash-ai-advisor"
              onClick={onOpenAiAssistant}
              className="px-4 py-3 rounded-2xl bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 font-bold text-sm flex items-center gap-2 border border-indigo-500/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Ask City AI
            </button>
          </div>
        </div>
      </div>

      {/* OVERVIEW CARDS WITH METRICS (SECTION 4 SPEC) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Site Area */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Site Area</span>
            <div className="p-2 rounded-xl bg-slate-800 text-cyan-400">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {metrics.totalSiteAreaHa} <span className="text-sm font-semibold text-slate-400">hectares</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            <span className="text-cyan-400 font-bold">100%</span> delimited parcel boundary
          </p>
        </div>

        {/* Built-up Area */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Built-up Area</span>
            <div className="p-2 rounded-xl bg-slate-800 text-sky-400">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-sky-400">
            {metrics.builtUpAreaHa} <span className="text-sm font-semibold text-slate-400">hectares</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {metrics.buildingCount} architectural structures placed
          </p>
        </div>

        {/* Green Coverage */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Green Coverage</span>
            <div className="p-2 rounded-xl bg-slate-800 text-emerald-400">
              <Trees className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {metrics.greenCoveragePct}%
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {metrics.greenAreaHa} ha canopy & parkland area
          </p>
        </div>

        {/* Sustainability Score */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md relative overflow-hidden shadow-lg shadow-cyan-500/5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Sustainability Score</span>
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-cyan-300">
            {metrics.sustainabilityScore} <span className="text-sm font-semibold text-slate-400">/ 100</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> High Net-Zero Potential
          </p>
        </div>
      </div>

      {/* SECONDARY METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Population Capacity */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Population Capacity
            </span>
            <p className="text-lg font-black text-slate-100">
              {metrics.populationCapacity.toLocaleString()} <span className="text-xs font-normal text-slate-400">residents</span>
            </p>
          </div>
        </div>

        {/* Renewable Energy */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Renewable Energy
            </span>
            <p className="text-lg font-black text-amber-400">
              {metrics.renewableEnergyPct}% <span className="text-xs font-normal text-slate-400">({metrics.dailySolarGenMwh} MWh/d)</span>
            </p>
          </div>
        </div>

        {/* Water Usage & Recycling */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Water Consumption
            </span>
            <p className="text-lg font-black text-cyan-400">
              {metrics.dailyWaterUsageM3.toLocaleString()} <span className="text-xs font-normal text-slate-400">m³/d ({metrics.waterRecycledPct}% recycled)</span>
            </p>
          </div>
        </div>

        {/* Road & Transit Area */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-400 flex items-center justify-center shrink-0">
            <Route className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Road & Transit Area
            </span>
            <p className="text-lg font-black text-slate-200">
              {metrics.roadAreaHa} <span className="text-xs font-normal text-slate-400">hectares (Mobility index 84)</span>
            </p>
          </div>
        </div>
      </div>

      {/* ANALYTICS CHARTS SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Land Use Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-200">
                Land Use Masterplan Allocation
              </h3>
              <p className="text-xs text-slate-400">
                Spatial breakdown across 250 hectares
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">100% Total</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={landUseData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {landUseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs mt-2">
            {landUseData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300">{item.name}:</span>
                <span className="font-bold text-slate-100">{item.value} ha</span>
              </div>
            ))}
          </div>
        </div>

        {/* Clean Energy Generation vs Consumption */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-200">
                Clean Energy Generation vs Demand
              </h3>
              <p className="text-xs text-slate-400">
                Daily MWh power balance ({metrics.energyBalanceMwh > 0 ? `+${metrics.energyBalanceMwh} MWh Surplus` : 'Deficit'})
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold">
              {metrics.dailySolarGenMwh} MWh/d Total
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={energyBreakdown}>
                <XAxis dataKey="source" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="gen" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-xs mt-2">
            <span className="text-slate-400">Daily Clean Generation: <strong>{metrics.dailySolarGenMwh} MWh</strong></span>
            <span className="text-slate-400">Site Municipal Demand: <strong>{metrics.dailyEnergyDemandMwh} MWh</strong></span>
            <span className="text-emerald-400 font-bold font-mono">+{metrics.energyBalanceMwh} MWh Clean Surplus</span>
          </div>
        </div>
      </div>
    </div>
  );
};
