import React from 'react';
import {
  EnvironmentalSettings,
  CityMetrics,
  AnalysisOverlay,
} from '../../types';
import {
  Sun,
  Wind,
  Footprints,
  Thermometer,
  Car,
  Users,
  Zap,
  Droplets,
  Trash2,
  Info,
  CheckCircle2,
  Sliders,
  Compass,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';

interface AnalysisViewProps {
  envSettings: EnvironmentalSettings;
  metrics: CityMetrics;
  onUpdateEnvSettings: (updated: Partial<EnvironmentalSettings>) => void;
  onSwitchTo3DWithOverlay: (overlay: AnalysisOverlay) => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  envSettings,
  metrics,
  onUpdateEnvSettings,
  onSwitchTo3DWithOverlay,
}) => {
  const solarHourlyCurve = [
    { hour: '06:00', radiation: 80, shadows: 85 },
    { hour: '08:00', radiation: 320, shadows: 60 },
    { hour: '10:00', radiation: 650, shadows: 35 },
    { hour: '12:00', radiation: 980, shadows: 15 },
    { hour: '14:00', radiation: 850, shadows: 25 },
    { hour: '16:00', radiation: 520, shadows: 45 },
    { hour: '18:00', radiation: 180, shadows: 75 },
    { hour: '20:00', radiation: 20, shadows: 95 },
  ];

  const directions = [
    { label: 'N', deg: 0 },
    { label: 'NE', deg: 45 },
    { label: 'E', deg: 90 },
    { label: 'SE', deg: 135 },
    { label: 'S', deg: 180 },
    { label: 'SW', deg: 225 },
    { label: 'W', deg: 270 },
    { label: 'NW', deg: 315 },
  ];

  // Calculate sunlight metrics based on timeOfDay
  const currentHour = envSettings.timeOfDay;
  const isDaylight = currentHour >= 6 && currentHour <= 19;
  const shadowCoveragePct = isDaylight
    ? Math.round(Math.abs(currentHour - 12) * 8 + 15)
    : 95;
  const solarExposurePct = Math.max(0, 100 - shadowCoveragePct);

  return (
    <div className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar p-6 bg-slate-950 text-slate-100 select-none">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white">
              Environmental & Microclimate Analysis
            </h1>
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-xs font-semibold">
              Estimated Simulations
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Forma-grade multi-physics environmental simulations: real-time solar shadows, aerodynamic wind ventilation, and 15-minute walkability isochrones.
          </p>
        </div>

        <button
          onClick={() => onSwitchTo3DWithOverlay('sunlight')}
          className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          View 3D Live Simulations
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* PANEL 1: SUNLIGHT & SHADOW SIMULATION */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-200">Sunlight Analysis</h3>
                <span className="text-[10px] text-slate-400">Solar Position & Shadows</span>
              </div>
            </div>
            <button
              onClick={() => onSwitchTo3DWithOverlay('sunlight')}
              className="text-[11px] text-cyan-400 hover:underline"
            >
              Overlay in 3D
            </button>
          </div>

          {/* Time of Day Slider */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400">Time of Day</span>
              <span className="font-mono text-amber-300 font-bold text-sm">
                {Math.floor(envSettings.timeOfDay)}:{String(Math.round((envSettings.timeOfDay % 1) * 60)).padStart(2, '0')}
              </span>
            </div>
            <input
              type="range"
              min="6"
              max="20"
              step="0.5"
              value={envSettings.timeOfDay}
              onChange={(e) => onUpdateEnvSettings({ timeOfDay: parseFloat(e.target.value) })}
              className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>06:00 (Dawn)</span>
              <span>12:00 (Noon)</span>
              <span>18:00 (Dusk)</span>
              <span>20:00</span>
            </div>
          </div>

          {/* Real-time calculated sun numbers */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Solar Exposure</span>
              <span className="text-base font-extrabold text-amber-400">{solarExposurePct}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Avg. Sunlight</span>
              <span className="text-base font-extrabold text-yellow-300">7.8 hrs</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Shadow Cover</span>
              <span className="text-base font-extrabold text-slate-300">{shadowCoveragePct}%</span>
            </div>
          </div>

          {/* Diurnal Solar Curve */}
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={solarHourlyCurve}>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="radiation" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PANEL 2: WIND & VENTILATION SIMULATION */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                <Wind className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-200">Wind Simulation</h3>
                <span className="text-[10px] text-slate-400">Aerodynamic Canyon Flow</span>
              </div>
            </div>
            <button
              onClick={() => onSwitchTo3DWithOverlay('wind')}
              className="text-[11px] text-cyan-400 hover:underline"
            >
              Overlay in 3D
            </button>
          </div>

          {/* Wind Direction Selector */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4">
            <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1.5">
              Wind Direction: <strong className="text-sky-300 font-mono">{envSettings.windDirection} ({envSettings.windDirectionDegrees}°)</strong>
            </label>
            <div className="grid grid-cols-4 gap-1">
              {directions.map((d) => (
                <button
                  key={d.label}
                  onClick={() => onUpdateEnvSettings({ windDirection: d.label, windDirectionDegrees: d.deg })}
                  className={`py-1 rounded text-xs font-mono font-bold transition-all ${
                    envSettings.windDirection === d.label
                      ? 'bg-sky-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Wind Speed Slider */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400">Wind Velocity</span>
              <span className="font-mono text-sky-300 font-bold text-sm">
                {envSettings.windSpeedKmH} km/h
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="50"
              step="1"
              value={envSettings.windSpeedKmH}
              onChange={(e) => onUpdateEnvSettings({ windSpeedKmH: parseInt(e.target.value) })}
              className="w-full accent-sky-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Comfort indicators */}
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Pedestrian Comfort Level:</span>
              <span className="font-bold text-emerald-400">Lawson Stroll Grade</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Canyon Venturi Effect:</span>
              <span className="font-bold text-amber-400">Low (Optimized Spacing)</span>
            </div>
          </div>
        </div>

        {/* PANEL 3: 15-MINUTE WALKABILITY & MOBILITY */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Footprints className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-200">Walkability Analysis</h3>
                <span className="text-[10px] text-slate-400">15-Minute City Catchment</span>
              </div>
            </div>
            <button
              onClick={() => onSwitchTo3DWithOverlay('walkability')}
              className="text-[11px] text-cyan-400 hover:underline"
            >
              Overlay Heatmap
            </button>
          </div>

          {/* Score Badge */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-slate-950 border border-emerald-500/30 text-center mb-4">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">
              Walkability Score
            </span>
            <div className="text-3xl font-black text-emerald-400 my-1">
              {metrics.walkabilityScore} <span className="text-sm text-slate-400">/ 100</span>
            </div>
            <p className="text-[11px] text-emerald-300">
              Excellent pedestrian proximity to daily essentials
            </p>
          </div>

          {/* Proximity Breakdown */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
              <span className="text-slate-400">Parks & Green Corridors</span>
              <span className="font-bold text-emerald-400">&lt; 280m (3.5 min walk)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
              <span className="text-slate-400">Schools & Daycare</span>
              <span className="font-bold text-emerald-400">&lt; 350m (4.2 min walk)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
              <span className="text-slate-400">Retail & Grocery</span>
              <span className="font-bold text-emerald-400">&lt; 320m (4 min walk)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
              <span className="text-slate-400">Rapid Transit & Bus Hubs</span>
              <span className="font-bold text-cyan-400">&lt; 400m (5 min walk)</span>
            </div>
          </div>
        </div>
      </div>

      {/* LOWER ROW: POPULATION PLANNING & HEAT ISLAND */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Population Planning Section 20 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">
                Population & Housing Capacity Planning
              </h3>
              <p className="text-xs text-slate-400">
                Derived from residential footprints, floor levels, and unit density
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Est. Population</span>
              <span className="text-lg font-black text-indigo-400">
                {metrics.populationCapacity.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Residential Units</span>
              <span className="text-lg font-black text-sky-400">
                {metrics.residentialUnits.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Avg. Density</span>
              <span className="text-lg font-black text-slate-200">
                {metrics.populationDensityKm2} / km²
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Household Size</span>
              <span className="text-lg font-black text-slate-200">
                2.4 ppl
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p>
              Calculations assume standard architectural planning ratios of 32 m² of gross floor area per resident, and 2.4 residents per household unit. Values are modeled as planning estimates.
            </p>
          </div>
        </div>

        {/* Urban Heat Island & Traffic Congestion */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
              <Thermometer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">
                Thermal & Microclimate Heat Island Mitigation
              </h3>
              <p className="text-xs text-slate-400">
                Canopy cooling and high-albedo paving analysis
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">Urban Heat Island Index</span>
                <span className="text-[10px] text-slate-400">Delta vs surrounding rural baseline</span>
              </div>
              <span className="font-mono text-base font-extrabold text-emerald-400">+1.2°C (Low Impact)</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">Canopy Evapotranspiration</span>
                <span className="text-[10px] text-slate-400">42% green cover + water bodies cooling buffer</span>
              </div>
              <span className="font-mono text-base font-extrabold text-cyan-400">-2.4°C Micro-cooling</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">Traffic Simulation Pressure</span>
                <span className="text-[10px] text-slate-400">Modal split: 62% public & active mobility</span>
              </div>
              <span className="font-mono text-base font-extrabold text-emerald-400">
                {envSettings.trafficLevel} Congestion
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
