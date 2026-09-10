import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  NavigationTab,
  CityObject,
  SiteBoundary,
  EnvironmentalSettings,
  CityMetrics,
  CityScenario,
  AnalysisOverlay,
  BuildingType,
  ZoneType,
  CameraMode,
} from './types';
import { sampleCities, sampleScenarios } from './data/sampleCities';
import { calculateCityMetrics } from './utils/calculations';

// Layout & View Components
import { TopNavbar } from './components/layout/TopNavbar';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { RightPropertyPanel } from './components/panels/RightPropertyPanel';
import { CityViewport } from './components/3d/CityViewport';
import { DashboardView } from './components/views/DashboardView';
import { AnalysisView } from './components/views/AnalysisView';
import { SustainabilityView } from './components/views/SustainabilityView';
import { ScenariosView } from './components/views/ScenariosView';
import { ReportsView } from './components/views/ReportsView';

// Modals & Assistant
import { CityAiAssistant } from './components/panels/CityAiAssistant';
import { SiteBoundaryModal } from './components/modals/SiteBoundaryModal';
import { BuildingPlannerModal } from './components/modals/BuildingPlannerModal';
import { ZoningModal } from './components/modals/ZoningModal';
import { HelpGuideModal } from './components/modals/HelpGuideModal';
import { SettingsModal } from './components/modals/SettingsModal';

// Icons
import {
  CheckCircle,
  AlertCircle,
  X,
  Compass,
  Box,
  Layers,
  Sparkles,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'smart_city_site_planner_v3';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>('planner');

  // Masterplan state
  const [projectName, setProjectName] = useState<string>('Green Future Smart City');
  const [boundary, setBoundary] = useState<SiteBoundary>(sampleCities[0].boundary);
  const [objects, setObjects] = useState<CityObject[]>(sampleCities[0].objects);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  // Tools & Overlays
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [activeOverlay, setActiveOverlay] = useState<AnalysisOverlay>('none');
  const [cameraMode, setCameraMode] = useState<CameraMode>('orbit');
  const [gridSnap, setGridSnap] = useState<number>(5);

  // Environmental settings
  const [envSettings, setEnvSettings] = useState<EnvironmentalSettings>({
    timeOfDay: 14,
    sunExposurePct: 82,
    windDirection: 'N',
    windDirectionDegrees: 0,
    windSpeedKmH: 14,
    temperatureC: 22,
    airQualityIndex: 28,
    trafficLevel: 'Low',
  });

  // Scenarios
  const [scenarios, setScenarios] = useState<CityScenario[]>(sampleScenarios);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('sc-1');

  // Modals state
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [showBoundaryModal, setShowBoundaryModal] = useState(false);
  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [buildingModalType, setBuildingModalType] = useState<BuildingType>('Residential');
  const [showZoningModal, setShowZoningModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Toast banner notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Derive city performance metrics dynamically whenever objects or boundary changes
  const metrics: CityMetrics = useMemo(() => {
    return calculateCityMetrics(boundary, objects);
  }, [boundary, objects]);

  // Selected Object lookup
  const selectedObject = useMemo(() => {
    return objects.find((o) => o.id === selectedObjectId) || null;
  }, [objects, selectedObjectId]);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.objects && parsed.boundary) {
          setObjects(parsed.objects);
          setBoundary(parsed.boundary);
          if (parsed.projectName) setProjectName(parsed.projectName);
        }
      }
    } catch (err) {
      console.warn('Could not restore cached masterplan', err);
    }
  }, []);

  // Save to LocalStorage
  const handleSaveProject = () => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          projectName,
          boundary,
          objects,
          savedAt: new Date().toISOString(),
        })
      );
      showToast(`Masterplan "${projectName}" saved successfully to browser storage!`);
    } catch (err) {
      showToast('Error saving project', 'warn');
    }
  };

  const handleNewProject = () => {
    if (window.confirm('Create a new blank project? This will reset the site objects.')) {
      setObjects([]);
      setSelectedObjectId(null);
      setProjectName('New Smart City Masterplan');
      showToast('Created new blank site masterplan', 'info');
    }
  };

  const handleSelectSampleCity = (key: string) => {
    if (key === 'green-future') {
      setObjects(sampleCities[0].objects);
      setBoundary(sampleCities[0].boundary);
      setProjectName(sampleCities[0].name);
      showToast('Loaded "Green Future City" masterplan');
    } else if (key === 'high-density') {
      const dense = sampleScenarios.find((s) => s.id === 'sc-3');
      if (dense) {
        setObjects(dense.objects);
        setProjectName(dense.name);
        showToast('Loaded "High-Density Metropolis" masterplan');
      }
    } else if (key === 'blank') {
      setObjects([]);
      setProjectName('Blank Canvas Site');
      showToast('Loaded blank canvas parcel');
    }
    setSelectedObjectId(null);
  };

  // Object manipulations
  const handleUpdateObject = (updated: CityObject) => {
    setObjects((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  const handleDuplicateObject = (id: string) => {
    const orig = objects.find((o) => o.id === id);
    if (!orig) return;
    const duplicated: CityObject = {
      ...orig,
      id: `obj-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: `${orig.name} (Copy)`,
      position: [orig.position[0] + 30, orig.position[1], orig.position[2] + 30],
    };
    setObjects((prev) => [...prev, duplicated]);
    setSelectedObjectId(duplicated.id);
    showToast(`Duplicated "${orig.name}"`);
  };

  const handleDeleteObject = (id: string) => {
    setObjects((prev) => prev.filter((o) => o.id !== id));
    if (selectedObjectId === id) setSelectedObjectId(null);
    showToast('Deleted object from site masterplan', 'info');
  };

  // 3D Terrain click placement
  const handleTerrainClick = (coords: [number, number, number]) => {
    if (!activeTool) return;

    // Parse activeTool
    // e.g. "Building: Residential", "Road: Main Road", "Park: Urban Park", "Infra: Solar Farm"
    const [categoryPrefix, typeSuffix] = activeTool.split(': ');
    const id = `obj-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    let newObj: CityObject | null = null;

    if (categoryPrefix === 'Building') {
      const zoneName: ZoneType = typeSuffix === 'Residential' ? 'Residential' :
        typeSuffix === 'Commercial' || typeSuffix === 'Office' || typeSuffix === 'Shopping Mall' ? 'Commercial' :
        typeSuffix === 'Industrial' ? 'Industrial' :
        typeSuffix === 'Hospital' ? 'Healthcare' :
        typeSuffix === 'School' || typeSuffix === 'College' ? 'Education' : 'Public Services';

      newObj = {
        id,
        name: `${typeSuffix} Structure`,
        category: 'building',
        type: typeSuffix,
        position: coords,
        dimensions: {
          width: 30,
          length: 30,
          height: 40,
          floors: 11,
        },
        zone: zoneName,
        hasGreenRoof: true,
        hasSolarRoof: true,
      };
    } else if (categoryPrefix === 'Road') {
      newObj = {
        id,
        name: typeSuffix,
        category: 'road',
        type: typeSuffix,
        position: coords,
        dimensions: {
          width: typeSuffix.includes('Main') ? 20 : 12,
          length: 60,
          height: 0.3,
        },
        zone: 'Transport',
      };
    } else if (categoryPrefix === 'Park' || categoryPrefix === 'Tree') {
      newObj = {
        id,
        name: typeSuffix,
        category: categoryPrefix === 'Tree' ? 'tree' : 'park',
        type: typeSuffix,
        position: coords,
        dimensions: {
          width: 35,
          length: 35,
          height: 6,
        },
        zone: 'Green Zone',
      };
    } else if (categoryPrefix === 'Water') {
      newObj = {
        id,
        name: typeSuffix,
        category: 'water',
        type: typeSuffix,
        position: coords,
        dimensions: {
          width: 50,
          length: 50,
          height: 1,
        },
        zone: 'Green Zone',
      };
    } else if (categoryPrefix === 'Infra') {
      newObj = {
        id,
        name: typeSuffix,
        category: 'infrastructure',
        type: typeSuffix,
        position: coords,
        dimensions: {
          width: 20,
          length: 20,
          height: typeSuffix.includes('Wind') ? 60 : 3,
        },
        zone: 'Energy',
        telemetry: {
          fillLevel: typeSuffix.includes('Bin') ? 45 : undefined,
          airQualityIndex: typeSuffix.includes('Air') ? 26 : undefined,
          lastCollection: typeSuffix.includes('Bin') ? '2h ago' : undefined,
          nextCollection: typeSuffix.includes('Bin') ? 'In 4h' : undefined,
        },
      };
    } else if (categoryPrefix === 'Agri') {
      newObj = {
        id,
        name: typeSuffix,
        category: 'agriculture',
        type: typeSuffix,
        position: coords,
        dimensions: {
          width: 40,
          length: 40,
          height: 15,
          floors: 4,
        },
        zone: 'Agriculture',
      };
    }

    if (newObj) {
      setObjects((prev) => [...prev, newObj!]);
      setSelectedObjectId(newObj.id);
      showToast(`Placed ${newObj.name} at coordinates [${Math.round(coords[0])}, ${Math.round(coords[2])}]`);
    }
  };

  // Spawn building from custom planner modal
  const handleSpawnBuildingFromModal = (config: {
    name: string;
    type: BuildingType;
    height: number;
    floors: number;
    width: number;
    length: number;
    hasGreenRoof: boolean;
    hasSolarRoof: boolean;
  }) => {
    const id = `bld-${Date.now()}`;
    // Place in center or slightly offset
    const randomOffset = (Math.random() - 0.5) * 60;
    const zoneName: ZoneType = config.type === 'Residential' ? 'Residential' :
      config.type === 'Commercial' || config.type === 'Office' || config.type === 'Shopping Mall' ? 'Commercial' :
      config.type === 'Industrial' ? 'Industrial' :
      config.type === 'Hospital' ? 'Healthcare' :
      config.type === 'School' || config.type === 'College' ? 'Education' : 'Public Services';

    const newBuilding: CityObject = {
      id,
      name: config.name,
      category: 'building',
      type: config.type,
      position: [randomOffset, config.height / 2, randomOffset],
      dimensions: {
        width: config.width,
        length: config.length,
        height: config.height,
        floors: config.floors,
      },
      zone: zoneName,
      hasGreenRoof: config.hasGreenRoof,
      hasSolarRoof: config.hasSolarRoof,
    };
    setObjects((prev) => [...prev, newBuilding]);
    setSelectedObjectId(id);
    setActiveTab('planner');
    showToast(`Added "${config.name}" to the site masterplan!`);
  };

  const handleApplyScenario = (scenario: CityScenario) => {
    setActiveScenarioId(scenario.id);
    setObjects(scenario.objects);
    setSelectedObjectId(null);
    showToast(`Applied "${scenario.name}" to 3D Viewport!`);
  };

  const handleSwitchTo3DWithOverlay = (overlay: AnalysisOverlay) => {
    setActiveOverlay(overlay);
    setActiveTab('3dcity');
    showToast(`Activated ${overlay} simulation in 3D viewport`, 'info');
  };

  const handleEnter3dView = (obj: CityObject) => {
    setCameraMode('street');
    setActiveTab('3dcity');
    showToast(`Entering street-level view near ${obj.name}`, 'info');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-cyan-500/40 text-xs font-semibold text-slate-100 shadow-2xl shadow-cyan-500/10 animate-in fade-in slide-in-from-top-4">
          {toastMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-cyan-400" />
          )}
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-500 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <TopNavbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'planner' && tab !== '3dcity') {
            setActiveTool(null);
          }
        }}
        metrics={metrics}
        onOpenAiAssistant={() => setShowAiAssistant(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenHelp={() => setShowHelpModal(true)}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT SIDEBAR (Available in planner and 3dcity) */}
        {(activeTab === 'planner' || activeTab === '3dcity') && (
          <LeftSidebar
            activeTool={activeTool}
            onSelectTool={(tool) => {
              setActiveTool(tool);
              if (tool) {
                showToast(`Tool active: ${tool}. Click terrain in 3D to place!`, 'info');
              }
            }}
            activeOverlay={activeOverlay}
            onToggleOverlay={(ov) => {
              setActiveOverlay(activeOverlay === ov ? 'none' : ov);
            }}
            onOpenBoundaryModal={() => setShowBoundaryModal(true)}
            onOpenBuildingModal={(type) => {
              if (type) setBuildingModalType(type);
              setShowBuildingModal(true);
            }}
            onOpenZoningModal={() => setShowZoningModal(true)}
            onNewProject={handleNewProject}
            onSaveProject={handleSaveProject}
            onOpenLoadProject={() => {
              const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
              if (saved) {
                const p = JSON.parse(saved);
                setObjects(p.objects || []);
                setBoundary(p.boundary || sampleCities[0].boundary);
                showToast('Loaded saved project from browser cache');
              } else {
                showToast('No saved project found in cache', 'warn');
              }
            }}
            onOpenExportModal={() => setActiveTab('reports')}
            onSelectSampleCity={handleSelectSampleCity}
          />
        )}

        {/* CENTER VIEWPORT OR ACTIVE TAB SCREEN */}
        {activeTab === 'planner' || activeTab === '3dcity' ? (
          <main className="flex-1 relative h-[calc(100vh-4rem)] overflow-hidden bg-slate-950">
            {/* ACTIVE PLACEMENT TOOL BANNER */}
            {activeTool && (
              <div className="absolute top-4 left-4 z-20 flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900/90 border border-cyan-500/50 backdrop-blur-md text-xs shadow-xl animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>
                  Active Tool: <strong className="text-cyan-300">{activeTool}</strong>
                </span>
                <span className="text-slate-400 text-[11px] hidden sm:inline">
                  (Click ground to place)
                </span>
                <button
                  onClick={() => setActiveTool(null)}
                  className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* THREE.JS 3D VIEWPORT */}
            <CityViewport
              boundary={boundary}
              objects={objects}
              selectedObjectId={selectedObjectId}
              onSelectObject={(id) => setSelectedObjectId(id)}
              onTerrainClick={handleTerrainClick}
              envSettings={envSettings}
              overlay={activeOverlay}
              cameraMode={cameraMode}
              onCameraModeChange={(m) => setCameraMode(m)}
              activeTool={activeTool}
            />
          </main>
        ) : activeTab === 'dashboard' ? (
          <DashboardView
            metrics={metrics}
            boundary={boundary}
            onContinuePlanning={() => setActiveTab('planner')}
            onCreateNewCity={handleNewProject}
            onOpenAiAssistant={() => setShowAiAssistant(true)}
          />
        ) : activeTab === 'analysis' ? (
          <AnalysisView
            envSettings={envSettings}
            metrics={metrics}
            onUpdateEnvSettings={(updated) => setEnvSettings((prev) => ({ ...prev, ...updated }))}
            onSwitchTo3DWithOverlay={handleSwitchTo3DWithOverlay}
          />
        ) : activeTab === 'sustainability' ? (
          <SustainabilityView
            metrics={metrics}
            objects={objects}
          />
        ) : activeTab === 'scenarios' ? (
          <ScenariosView
            currentMetrics={metrics}
            scenarios={scenarios}
            activeScenarioId={activeScenarioId}
            onApplyScenario={handleApplyScenario}
          />
        ) : activeTab === 'reports' ? (
          <ReportsView
            metrics={metrics}
            boundary={boundary}
            objects={objects}
            projectName={projectName}
          />
        ) : null}

        {/* RIGHT PROPERTY PANEL (Available in planner and 3dcity) */}
        {(activeTab === 'planner' || activeTab === '3dcity') && (
          <RightPropertyPanel
            selectedObject={selectedObject}
            siteBoundary={boundary}
            metrics={metrics}
            onDeselect={() => setSelectedObjectId(null)}
            onUpdateObject={handleUpdateObject}
            onDuplicateObject={handleDuplicateObject}
            onDeleteObject={handleDeleteObject}
            onEnter3dView={handleEnter3dView}
          />
        )}
      </div>

      {/* MODALS */}
      <CityAiAssistant
        isOpen={showAiAssistant}
        onClose={() => setShowAiAssistant(false)}
        metrics={metrics}
        boundary={boundary}
      />

      <SiteBoundaryModal
        isOpen={showBoundaryModal}
        onClose={() => setShowBoundaryModal(false)}
        boundary={boundary}
        onSaveBoundary={(updated) => {
          setBoundary(updated);
          showToast('Site boundary successfully updated');
        }}
        onImportGeoJSON={(geojson) => {
          showToast('Imported boundary coordinates from GeoJSON');
        }}
      />

      <BuildingPlannerModal
        isOpen={showBuildingModal}
        onClose={() => setShowBuildingModal(false)}
        initialType={buildingModalType}
        onSpawnBuilding={handleSpawnBuildingFromModal}
      />

      <ZoningModal
        isOpen={showZoningModal}
        onClose={() => setShowZoningModal(false)}
        onSelectZoneTool={(zone) => {
          setActiveTool(`Zoning: ${zone}`);
          setActiveTab('planner');
          showToast(`Selected ${zone} Zone tool`, 'info');
        }}
      />

      <HelpGuideModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        gridSnap={gridSnap}
        onUpdateGridSnap={(snap) => {
          setGridSnap(snap);
          showToast(`Grid snap updated to ${snap}m`);
        }}
      />
    </div>
  );
}
