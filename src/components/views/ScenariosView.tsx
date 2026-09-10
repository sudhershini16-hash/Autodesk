import React, { useState } from 'react';
import { CityScenario, CityMetrics } from '../../types';
import {
  Layers,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Building,
  Trees,
  Users,
  Zap,
  Droplets,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

interface ScenariosViewProps {
  currentMetrics: CityMetrics;
  scenarios: CityScenario[];
  activeScenarioId: string;
  onApplyScenario: (scenario: CityScenario) => void;
}

export const ScenariosView: React.FC<ScenariosViewProps> = ({
  currentMetrics,
  scenarios,
  activeScenarioId,
  onApplyScenario,
}) => {
  const [selectedScenarioForCompare, setSelectedScenarioForCompare] = useState<string>(
    scenarios[1]?.id || scenarios[0]?.id
  );

  // Prepare comparison data for Recharts
  const comparisonChartData = [
    {
      metric: 'Sustainability Score',
      'Scenario A (Current)': currentMetrics.sustainabilityScore,
      'Scenario B (Green)': 96,
      'Scenario C (High-Density)': 78,
      'Scenario D (Net-Zero)': 98,
    },
    {
      metric: 'Renewable Energy %',
      'Scenario A (Current)': currentMetrics.renewableEnergyPct,
      'Scenario B (Green)': 88,
      'Scenario C (High-Density)': 62,
      'Scenario D (Net-Zero)': 100,
    },
    {
      metric: 'Green Coverage %',
      'Scenario A (Current)': currentMetrics.greenCoveragePct,
      'Scenario B (Green)': 55,
      'Scenario C (High-Density)': 28,
      'Scenario D (Net-Zero)': 48,
    },
    {
      metric: 'Walkability Score',
      'Scenario A (Current)': currentMetrics.walkabilityScore,
      'Scenario B (Green)': 92,
      'Scenario C (High-Density)': 89,
      'Scenario D (Net-Zero)': 94,
    },
  ];

  return (
    <div className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar p-6 bg-slate-950 text-slate-100 select-none">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white">
              Urban Masterplan Scenario Comparison
            </h1>
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-xs font-semibold">
              Forma-Style Iteration Matrix
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Evaluate tradeoffs between ecological green canopy, high-density residential capacity, and carbon neutral microgrid infrastructure.
          </p>
        </div>
      </div>

      {/* SCENARIO SELECTOR CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {scenarios.map((sc) => {
          const isActive = sc.id === activeScenarioId;
          return (
            <div
              key={sc.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                    Variant
                  </span>
                  {isActive ? (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Active in 3D
                    </span>
                  ) : null}
                </div>
                <h3 className="text-base font-bold text-white mb-1">{sc.name}</h3>
                <p className="text-xs text-slate-400 mb-4 line-clamp-2">{sc.description}</p>

                <div className="space-y-1.5 text-xs py-3 border-y border-slate-800/80 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sustainability:</span>
                    <strong className="text-emerald-400 font-mono">{sc.metrics.sustainabilityScore}/100</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Population:</span>
                    <strong className="text-indigo-300 font-mono">{sc.metrics.populationCapacity.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Clean Energy:</span>
                    <strong className="text-amber-300 font-mono">{sc.metrics.renewableEnergyPct}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Green Canopy:</span>
                    <strong className="text-lime-400 font-mono">{sc.metrics.greenCoveragePct}%</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onApplyScenario(sc)}
                disabled={isActive}
                className={`w-full py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-slate-400 cursor-default'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                {isActive ? 'Loaded in Viewport' : 'Load into 3D Planner'}
              </button>
            </div>
          );
        })}
      </div>

      {/* COMPARATIVE VISUAL MATRIX TABLE */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 mb-8 overflow-x-auto">
        <h3 className="text-sm font-bold text-slate-200 mb-4">
          Masterplan Tradeoff Comparative Analysis
        </h3>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="pb-3 font-bold">Planning Dimension</th>
              {scenarios.map((s) => (
                <th key={s.id} className="pb-3 font-bold">
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            <tr>
              <td className="py-3 text-slate-300 font-sans font-semibold">Population Capacity</td>
              {scenarios.map((s) => (
                <td key={s.id} className="py-3 text-indigo-300">
                  {s.metrics.populationCapacity.toLocaleString()} residents
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 text-slate-300 font-sans font-semibold">Green Coverage Area</td>
              {scenarios.map((s) => (
                <td key={s.id} className="py-3 text-emerald-400">
                  {s.metrics.greenAreaHa} ha ({s.metrics.greenCoveragePct}%)
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 text-slate-300 font-sans font-semibold">Clean Energy Generation</td>
              {scenarios.map((s) => (
                <td key={s.id} className="py-3 text-amber-400">
                  {s.metrics.dailySolarGenMwh} MWh/d ({s.metrics.renewableEnergyPct}%)
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 text-slate-300 font-sans font-semibold">Daily Water Recycling</td>
              {scenarios.map((s) => (
                <td key={s.id} className="py-3 text-cyan-400">
                  {s.metrics.waterRecycledPct}% Circular
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 text-slate-300 font-sans font-semibold">Mobility & 15-min Walkability</td>
              {scenarios.map((s) => (
                <td key={s.id} className="py-3 text-sky-300">
                  {s.metrics.walkabilityScore} / 100
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 text-slate-300 font-sans font-semibold">Composite Sustainability</td>
              {scenarios.map((s) => (
                <td key={s.id} className="py-3 text-emerald-400 font-bold text-sm">
                  {s.metrics.sustainabilityScore} / 100
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* COMPARATIVE RECHARTS BAR GRAPH */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-sm font-bold text-slate-200 mb-4">
          Key Performance Index Across Scenarios
        </h3>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonChartData}>
              <XAxis dataKey="metric" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Scenario A (Current)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Scenario B (Green)" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Scenario C (High-Density)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Scenario D (Net-Zero)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
