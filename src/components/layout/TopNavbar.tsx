import React, { useState } from 'react';
import {
  NavigationTab,
  CityMetrics,
} from '../../types';
import {
  Building2,
  LayoutDashboard,
  Box,
  Compass,
  BarChart3,
  Leaf,
  Layers,
  FileText,
  Search,
  Bell,
  HelpCircle,
  Settings,
  Sparkles,
  ChevronDown,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface TopNavbarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  metrics: CityMetrics;
  onOpenAiAssistant: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  onSelectTab,
  metrics,
  onOpenAiAssistant,
  onOpenSettings,
  onOpenHelp,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    {
      id: 1,
      title: 'Renewable Energy Surplus',
      desc: `Clean energy generation is +${metrics.energyBalanceMwh} MWh/day above site consumption.`,
      type: 'success',
      time: '10m ago',
    },
    {
      id: 2,
      title: 'Sustainability Score Updated',
      desc: `Current site masterplan achieved ${metrics.sustainabilityScore}/100 rating.`,
      type: 'info',
      time: '25m ago',
    },
    {
      id: 3,
      title: 'Smart Waste Telemetry',
      desc: 'Smart Bin 05 in Commercial District reached 78% capacity.',
      type: 'warning',
      time: '1h ago',
    },
  ];

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 flex items-center justify-between z-30 select-none">
      {/* BRAND & LOGO */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Building2 className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-wider text-slate-100 uppercase">
              Smart City Site Planner
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              v3.2 PRO
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Intelligent Urban Planning & 3D Site Design
          </p>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
        <button
          id="nav-tab-dashboard"
          onClick={() => onSelectTab('dashboard')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'dashboard'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Dashboard
        </button>

        <button
          id="nav-tab-planner"
          onClick={() => onSelectTab('planner')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'planner'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          Site Planner
        </button>

        <button
          id="nav-tab-3dcity"
          onClick={() => onSelectTab('3dcity')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === '3dcity'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          3D City
        </button>

        <button
          id="nav-tab-analysis"
          onClick={() => onSelectTab('analysis')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'analysis'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Analysis
        </button>

        <button
          id="nav-tab-sustainability"
          onClick={() => onSelectTab('sustainability')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'sustainability'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Leaf className="w-3.5 h-3.5" />
          Sustainability
        </button>

        <button
          id="nav-tab-scenarios"
          onClick={() => onSelectTab('scenarios')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'scenarios'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Scenarios
        </button>

        <button
          id="nav-tab-reports"
          onClick={() => onSelectTab('reports')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'reports'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Reports
        </button>
      </nav>

      {/* RIGHT CONTROLS */}
      <div className="flex items-center gap-2">
        {/* AI SMART CITY ADVISOR BUTTON */}
        <button
          id="btn-top-ai-advisor"
          onClick={onOpenAiAssistant}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold shadow-lg shadow-cyan-500/10 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">CITY AI</span>
        </button>

        {/* NOTIFICATIONS POPOVER */}
        <div className="relative">
          <button
            id="btn-notifications-toggle"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Site Telemetry Alerts
                </span>
                <span className="text-[10px] text-cyan-400 font-medium">3 New</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-start gap-2.5 text-xs"
                  >
                    {n.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : n.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-200">{n.title}</p>
                        <span className="text-[10px] text-slate-500">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{n.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* HELP BUTTON */}
        <button
          id="btn-help-dialog"
          onClick={onOpenHelp}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all"
          title="Guide & Shortcuts"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* SETTINGS BUTTON */}
        <button
          id="btn-settings-dialog"
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all"
          title="Project & Graphic Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* USER PROFILE */}
        <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center font-bold text-xs text-white">
            SC
          </div>
          <div className="text-left leading-tight hidden xl:block">
            <p className="text-xs font-semibold text-slate-200">Urban Architect</p>
            <p className="text-[10px] text-slate-400 truncate max-w-[110px]">
              sudhershini16
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
