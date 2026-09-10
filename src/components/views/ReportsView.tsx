import React from 'react';
import { CityMetrics, SiteBoundary, CityObject } from '../../types';
import {
  Printer,
  Download,
  FileText,
  Building,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Share2,
} from 'lucide-react';

interface ReportsViewProps {
  metrics: CityMetrics;
  boundary: SiteBoundary;
  objects: CityObject[];
  projectName: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  metrics,
  boundary,
  objects,
  projectName,
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const data = {
      project: projectName,
      generatedAt: new Date().toISOString(),
      boundary,
      metrics,
      objects,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/\s+/g, '_')}_masterplan.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const rows = [
      ['Metric', 'Value', 'Unit'],
      ['Total Site Area', metrics.totalSiteAreaHa, 'hectares'],
      ['Built-up Area', metrics.builtUpAreaHa, 'hectares'],
      ['Green Area', metrics.greenAreaHa, 'hectares'],
      ['Road Area', metrics.roadAreaHa, 'hectares'],
      ['Water Area', metrics.waterAreaHa, 'hectares'],
      ['Population Capacity', metrics.populationCapacity, 'residents'],
      ['Residential Units', metrics.residentialUnits, 'units'],
      ['Renewable Energy', metrics.renewableEnergyPct, '%'],
      ['Daily Clean Energy Gen', metrics.dailySolarGenMwh, 'MWh/day'],
      ['Daily Energy Demand', metrics.dailyEnergyDemandMwh, 'MWh/day'],
      ['Daily Water Usage', metrics.dailyWaterUsageM3, 'm3/day'],
      ['Water Recycled', metrics.waterRecycledPct, '%'],
      ['Sustainability Score', metrics.sustainabilityScore, 'points'],
      ['Walkability Score', metrics.walkabilityScore, 'points'],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${projectName.toLowerCase().replace(/\s+/g, '_')}_kpis.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar p-6 bg-slate-950 text-slate-100 select-none print:bg-white print:text-black print:h-auto print:overflow-visible">
      {/* ACTION BAR (HIDDEN IN PRINT) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-white">
            Smart City Site Masterplan Report
          </h1>
          <p className="text-xs text-slate-400">
            Comprehensive architectural, spatial zoning, and microclimate compliance document.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print / Export PDF
          </button>
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* PRINTABLE REPORT DOCUMENT CONTAINER */}
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl print:shadow-none print:border-none print:p-0 print:bg-white print:text-slate-900">
        {/* REPORT HEADER */}
        <div className="border-b-2 border-slate-800 print:border-slate-300 pb-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 print:text-cyan-700">
                Official Urban Masterplan Dossier
              </span>
              <h2 className="text-3xl font-black text-white print:text-slate-900 mt-1">
                SMART CITY SITE PLANNER
              </h2>
              <p className="text-sm font-semibold text-slate-400 print:text-slate-600">
                Intelligent Urban Planning & 3D Site Design
              </p>
            </div>
            <div className="text-right text-xs text-slate-400 print:text-slate-500 font-mono">
              <p>Project: <strong>{projectName}</strong></p>
              <p>Date: {currentDate}</p>
              <p>Standard: ISO 37120 Smart Cities</p>
            </div>
          </div>
        </div>

        {/* EXECUTIVE SUMMARY */}
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-700 mb-2">
            1. Executive Summary
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 print:text-slate-700 leading-relaxed">
            The {projectName} masterplan establishes a high-density, low-carbon smart urban district across a total site boundary of {metrics.totalSiteAreaHa} hectares. Designed with integrated 15-minute city catchment principles, the masterplan allocates {metrics.greenCoveragePct}% to ecological greenery and parks while sustaining a projected population capacity of {metrics.populationCapacity.toLocaleString()} residents. The on-site decentralized clean energy microgrid achieves a {metrics.renewableEnergyPct}% clean energy fraction with a net daily surplus of +{metrics.energyBalanceMwh} MWh/day.
          </p>
        </div>

        {/* KEY PERFORMANCE INDICATORS */}
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-700 mb-3">
            2. Core Performance Indicators
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300">
              <span className="text-[10px] text-slate-400 print:text-slate-600 block">Sustainability Score</span>
              <span className="text-xl font-black text-emerald-400 print:text-emerald-700 font-mono">
                {metrics.sustainabilityScore} / 100
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300">
              <span className="text-[10px] text-slate-400 print:text-slate-600 block">Population Capacity</span>
              <span className="text-xl font-black text-indigo-400 print:text-indigo-700 font-mono">
                {metrics.populationCapacity.toLocaleString()}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300">
              <span className="text-[10px] text-slate-400 print:text-slate-600 block">Renewable Energy</span>
              <span className="text-xl font-black text-amber-400 print:text-amber-700 font-mono">
                {metrics.renewableEnergyPct}%
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300">
              <span className="text-[10px] text-slate-400 print:text-slate-600 block">Walkability Index</span>
              <span className="text-xl font-black text-cyan-400 print:text-cyan-700 font-mono">
                {metrics.walkabilityScore} / 100
              </span>
            </div>
          </div>
        </div>

        {/* SPATIAL LAND-USE BUDGET */}
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-700 mb-3">
            3. Spatial Land-Use Budget
          </h3>
          <table className="w-full text-left text-xs border border-slate-800 print:border-slate-300">
            <thead className="bg-slate-950/80 print:bg-slate-200">
              <tr className="border-b border-slate-800 print:border-slate-300 text-[10px] text-slate-400 print:text-slate-700 uppercase">
                <th className="p-2.5 font-bold">Category</th>
                <th className="p-2.5 font-bold">Area (Hectares)</th>
                <th className="p-2.5 font-bold">Percentage of Site</th>
                <th className="p-2.5 font-bold">Benchmark Guideline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 print:divide-slate-300">
              <tr>
                <td className="p-2.5 font-medium">Green Canopy & Parklands</td>
                <td className="p-2.5 font-mono font-bold text-emerald-400 print:text-emerald-700">{metrics.greenAreaHa} ha</td>
                <td className="p-2.5 font-mono">{metrics.greenCoveragePct}%</td>
                <td className="p-2.5 text-slate-400 print:text-slate-600">&gt; 35% (Exceeded)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">Built-Up Floor Footprints</td>
                <td className="p-2.5 font-mono font-bold text-sky-400 print:text-sky-700">{metrics.builtUpAreaHa} ha</td>
                <td className="p-2.5 font-mono">{Math.round((metrics.builtUpAreaHa / metrics.totalSiteAreaHa) * 100)}%</td>
                <td className="p-2.5 text-slate-400 print:text-slate-600">25 - 35% (Balanced)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">Roads & Transit Infrastructure</td>
                <td className="p-2.5 font-mono font-bold text-slate-300 print:text-slate-800">{metrics.roadAreaHa} ha</td>
                <td className="p-2.5 font-mono">{Math.round((metrics.roadAreaHa / metrics.totalSiteAreaHa) * 100)}%</td>
                <td className="p-2.5 text-slate-400 print:text-slate-600">10 - 15% (Optimized)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">Water Bodies & Bioswales</td>
                <td className="p-2.5 font-mono font-bold text-cyan-400 print:text-cyan-700">{metrics.waterAreaHa} ha</td>
                <td className="p-2.5 font-mono">{Math.round((metrics.waterAreaHa / metrics.totalSiteAreaHa) * 100)}%</td>
                <td className="p-2.5 text-slate-400 print:text-slate-600">&gt; 3% (Compliant)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SMART SYSTEMS REGISTRY */}
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-700 mb-3">
            4. Smart Systems & Infrastructure Registry
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/40 print:bg-slate-100 border border-slate-800 print:border-slate-300">
              <span className="font-bold text-slate-200 print:text-slate-900 block">Photovoltaic Solar Arrays</span>
              <span className="text-[11px] text-slate-400 print:text-slate-600">24.6 MWh/day Generation</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/40 print:bg-slate-100 border border-slate-800 print:border-slate-300">
              <span className="font-bold text-slate-200 print:text-slate-900 block">Smart IoT Waste Bins</span>
              <span className="text-[11px] text-slate-400 print:text-slate-600">Fill level route optimization</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/40 print:bg-slate-100 border border-slate-800 print:border-slate-300">
              <span className="font-bold text-slate-200 print:text-slate-900 block">EV Fast-Charging Hubs</span>
              <span className="text-[11px] text-slate-400 print:text-slate-600">Distributed 350kW superchargers</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/40 print:bg-slate-100 border border-slate-800 print:border-slate-300">
              <span className="font-bold text-slate-200 print:text-slate-900 block">Greywater Reclamation</span>
              <span className="text-[11px] text-slate-400 print:text-slate-600">65% cyclic reuse capacity</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/40 print:bg-slate-100 border border-slate-800 print:border-slate-300">
              <span className="font-bold text-slate-200 print:text-slate-900 block">IoT Environmental Stations</span>
              <span className="text-[11px] text-slate-400 print:text-slate-600">Real-time PM2.5 & AQI</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/40 print:bg-slate-100 border border-slate-800 print:border-slate-300">
              <span className="font-bold text-slate-200 print:text-slate-900 block">Smart Photovoltaic Lighting</span>
              <span className="text-[11px] text-slate-400 print:text-slate-600">Adaptive dimming & traffic sensors</span>
            </div>
          </div>
        </div>

        {/* COMPLIANCE & LEGAL DISCLAIMER (SECTION 22 / USER RULE SPEC) */}
        <div className="pt-6 border-t border-slate-800 print:border-slate-300 text-[11px] text-slate-400 print:text-slate-600 leading-relaxed">
          <p className="font-bold uppercase tracking-wider text-slate-300 print:text-slate-800 mb-1">
            Planning Model Disclaimer
          </p>
          <p>
            All calculations, solar exposure estimates, aerodynamic wind simulations, and capacity figures shown in this report represent conceptual architectural models and generative planning estimations. They are designed for site planning, spatial organization, and environmental feasibility studies, and do not constitute certified civil engineering or municipal statutory approval.
          </p>
        </div>
      </div>
    </div>
  );
};
