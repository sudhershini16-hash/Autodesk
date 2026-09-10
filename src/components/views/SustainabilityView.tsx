import React from 'react';
import { CityMetrics, CityObject } from '../../types';
import {
  Leaf,
  Sun,
  Droplets,
  Trash2,
  Wind,
  ShieldCheck,
  TrendingUp,
  BatteryCharging,
  Radio,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

interface SustainabilityViewProps {
  metrics: CityMetrics;
  objects: CityObject[];
}

export const SustainabilityView: React.FC<SustainabilityViewProps> = ({
  metrics,
  objects,
}) => {
  // Energy generation vs demand across months
  const monthlyEnergyData = [
    { month: 'Jan', generation: 520, demand: 590 },
    { month: 'Feb', generation: 580, demand: 560 },
    { month: 'Mar', generation: 720, demand: 570 },
    { month: 'Apr', generation: 840, demand: 580 },
    { month: 'May', generation: 960, demand: 620 },
    { month: 'Jun', generation: 1040, demand: 690 },
    { month: 'Jul', generation: 1080, demand: 730 },
    { month: 'Aug', generation: 1010, demand: 710 },
    { month: 'Sep', generation: 860, demand: 620 },
    { month: 'Oct', generation: 710, demand: 580 },
    { month: 'Nov', generation: 550, demand: 560 },
    { month: 'Dec', generation: 490, demand: 610 },
  ];

  // Radar multi-criteria sustainability assessment
  const radarData = [
    { subject: 'Green Canopy', score: metrics.greenCoveragePct, fullMark: 100 },
    { subject: 'Renewable Energy', score: metrics.renewableEnergyPct, fullMark: 100 },
    { subject: 'Water Circularity', score: metrics.waterRecycledPct, fullMark: 100 },
    { subject: 'Waste Diversion', score: metrics.wasteRecycledPct, fullMark: 100 },
    { subject: 'Carbon Offset', score: metrics.carbonReductionPct, fullMark: 100 },
    { subject: 'Active Mobility', score: metrics.walkabilityScore, fullMark: 100 },
  ];

  // Filter smart bins for telemetry table
  const smartBins = objects.filter((o) => o.type === 'Smart Waste Bin');

  return (
    <div className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar p-6 bg-slate-950 text-slate-100 select-none">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white">
              Green & Sustainability Performance Center
            </h1>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
              Net-Zero Digital Twin
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time environmental accounting: decentralized solar microgrids, closed-loop water treatment, and zero-waste telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Certification Status</span>
              <span className="text-xs font-bold text-emerald-300">LEED Platinum Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* COMPOSITE SUSTAINABILITY SCORE HERO (SECTION 10 SPEC) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* SCORE GAUGE CARD */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-emerald-500/30 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Composite Sustainability Score
              </span>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">Dynamic KPI</span>
          </div>

          <div className="my-6 text-center">
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-300">
              {metrics.sustainabilityScore}
            </div>
            <div className="text-sm font-bold text-slate-400 mt-1">out of 100 points</div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full mt-4 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.sustainabilityScore}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Green Coverage (25% wt.)</span>
              <span className="font-bold text-emerald-400">{metrics.greenCoveragePct}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Renewable Energy (25% wt.)</span>
              <span className="font-bold text-cyan-400">{metrics.renewableEnergyPct}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Water Circularity (20% wt.)</span>
              <span className="font-bold text-sky-400">{metrics.waterRecycledPct}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Waste Recycling (15% wt.)</span>
              <span className="font-bold text-amber-400">{metrics.wasteRecycledPct}%</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Walkability & Low-Carbon (15% wt.)</span>
              <span className="font-bold text-indigo-400">{metrics.walkabilityScore}%</span>
            </div>
          </div>
        </div>

        {/* RADAR CHART BREAKDOWN */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-200">
              Multidimensional ESG Performance
            </h3>
            <span className="text-xs text-slate-400 font-mono">Radial Isochrone</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis stroke="#64748b" angle={30} domain={[0, 100]} />
                <Radar name="Performance" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            City outperforms municipal benchmarks across all 6 core planetary boundary indicators.
          </p>
        </div>

        {/* SOLAR ENERGY PLANNING (SECTION 11 SPEC) */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-200">Solar & Clean Energy</h3>
                <span className="text-[10px] text-slate-400">Daily Energy Balance</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 my-4">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Solar & Renewable Gen.</span>
              <span className="text-lg font-black text-amber-400 font-mono">
                {metrics.dailySolarGenMwh} MWh/day
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Municipal Energy Demand</span>
              <span className="text-lg font-black text-slate-300 font-mono">
                {metrics.dailyEnergyDemandMwh} MWh/day
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between">
              <span className="text-xs text-emerald-300 font-bold">Daily Clean Energy Surplus</span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                +{metrics.energyBalanceMwh} MWh/day
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Annual Clean Generation: <strong>9,840 MWh</strong></span>
            <span className="text-cyan-400 font-bold">Grid Resilient</span>
          </div>
        </div>
      </div>

      {/* MONTHLY ENERGY GENERATION VS CONSUMPTION (SECTION 11) */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200">
              12-Month Diurnal Solar & Wind Seasonality vs Load
            </h3>
            <p className="text-xs text-slate-400">
              Clean microgrid generation (MWh/month) vs urban building HVAC demands
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-400" />
              <span className="text-slate-300">Renewable Gen (MWh)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-600" />
              <span className="text-slate-300">City Demand (MWh)</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyEnergyData}>
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="generation" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Renewable Gen" />
              <Bar dataKey="demand" fill="#475569" radius={[4, 4, 0, 0]} name="Demand" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* WATER & WASTE INFRASTRUCTURE SPLIT (SECTIONS 12 & 13) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WATER MANAGEMENT (SECTION 12) */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-200">Closed-Loop Water Management</h3>
                <span className="text-[10px] text-slate-400">Rainwater & Greywater Recovery</span>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">{metrics.waterRecycledPct}% Circular</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs mb-4">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Water Consumption</span>
              <span className="text-base font-extrabold text-slate-200">
                {metrics.dailyWaterUsageM3.toLocaleString()} m³/day
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Rainwater Harvested</span>
              <span className="text-base font-extrabold text-cyan-400">
                {metrics.rainwaterCollectedM3.toLocaleString()} m³/day
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Water Recycled</span>
              <span className="text-base font-extrabold text-emerald-400">
                {Math.round(metrics.dailyWaterUsageM3 * (metrics.waterRecycledPct / 100)).toLocaleString()} m³/day
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Underground Storage</span>
              <span className="text-base font-extrabold text-indigo-400">
                450,000 m³
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Permeable road pavements and bioswales prevent 98% of urban stormwater runoff.</span>
          </div>
        </div>

        {/* SMART WASTE MANAGEMENT (SECTION 13) */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-200">Smart Waste & Circular Economy</h3>
                <span className="text-[10px] text-slate-400">IoT Bin Fill Levels & Route Optimization</span>
              </div>
            </div>
            <span className="text-xs font-mono text-teal-400 font-bold">{metrics.wasteRecycledPct}% Diversion</span>
          </div>

          <div className="space-y-2 mb-4 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Daily Waste Generated:</span>
              <span className="font-bold text-slate-200">{metrics.dailyWasteTonnes} tonnes/day</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Diverted from Landfill:</span>
              <span className="font-bold text-emerald-400 font-mono">
                {Math.round(metrics.dailyWasteTonnes * (metrics.wasteRecycledPct / 100) * 10) / 10} tonnes/day
              </span>
            </div>
          </div>

          {/* Smart Bins Live Telemetry Feed */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Active Smart Bin Telemetry
            </span>
            {smartBins.slice(0, 2).map((bin) => (
              <div
                key={bin.id}
                className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-200">{bin.name}</p>
                  <p className="text-[10px] text-slate-400">
                    Last emptied: {bin.telemetry?.lastCollection} | Next: {bin.telemetry?.nextCollection}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    (bin.telemetry?.fillLevel || 0) > 70
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {bin.telemetry?.fillLevel}% Fill
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
