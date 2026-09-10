export type BuildingType =
  | 'Residential'
  | 'Commercial'
  | 'School'
  | 'College'
  | 'Hospital'
  | 'Office'
  | 'Shopping Mall'
  | 'Government'
  | 'Industrial';

export type ZoneType =
  | 'Residential'
  | 'Commercial'
  | 'Industrial'
  | 'Green Zone'
  | 'Education'
  | 'Healthcare'
  | 'Agriculture'
  | 'Public Services'
  | 'Transport'
  | 'Energy'
  | 'Mixed-Use'
  | 'IT Park';

export type RoadType =
  | 'Main Road'
  | 'Secondary Road'
  | 'Local Road'
  | 'Pedestrian Path'
  | 'Cycling Path'
  | 'Emergency Route'
  | 'Public Transport Route';

export type InfrastructureType =
  | 'Solar Farm'
  | 'Solar Rooftop'
  | 'Wind Turbine'
  | 'Battery Storage'
  | 'EV Charging Station'
  | 'Smart Street Light'
  | 'Smart Waste Bin'
  | 'Waste Recycling Center'
  | 'Composting Area'
  | 'Rainwater Harvester'
  | 'Water Treatment Plant'
  | 'IoT Air Quality Sensor'
  | 'IoT Noise Sensor'
  | 'Smart Traffic Signal'
  | 'Bike Share Station'
  | 'Electric Bus Stop';

export type ObjectCategory =
  | 'building'
  | 'road'
  | 'park'
  | 'water'
  | 'agriculture'
  | 'infrastructure'
  | 'tree'
  | 'zone_polygon';

export interface CityObject {
  id: string;
  name: string;
  category: ObjectCategory;
  type: string;
  position: [number, number, number]; // [x, y, z] in meters
  rotation?: [number, number, number]; // Euler angles
  dimensions: {
    width: number;
    length: number;
    height: number;
    floors?: number;
  };
  zone: ZoneType;
  color?: string;
  occupancy?: number;
  energyDemand?: number; // kWh/day
  solarGen?: number; // kWh/day
  waterDemand?: number; // Liters/day
  wasteGen?: number; // kg/day
  hasGreenRoof?: boolean;
  hasSolarRoof?: boolean;
  // Road / Line specific
  points?: [number, number][]; // 2D path coordinates
  roadWidth?: number;
  // Smart sensor / telemetry
  telemetry?: {
    fillLevel?: number; // 0 - 100%
    collectionStatus?: 'Normal' | 'Attention' | 'Full';
    lastCollection?: string;
    nextCollection?: string;
    airQualityIndex?: number; // AQI
    noiseLevelDb?: number;
    solarOutputKw?: number;
    batteryChargePct?: number;
    evChargingActive?: number;
  };
}

export interface SiteBoundary {
  shape: 'rectangle' | 'polygon' | 'circle';
  width: number; // meters
  length: number; // meters
  radius?: number; // meters
  points: [number, number][]; // Polygon coordinates
  center: [number, number];
  areaHectares: number;
  perimeterMeters: number;
  areaHa?: number;
  widthM?: number;
  lengthM?: number;
  centerCoordinates?: [number, number];
}

export type CameraMode = 'orbit' | 'top' | 'street' | 'firstperson' | 'isometric';

export type NavigationTab =
  | 'dashboard'
  | 'planner'
  | '3dcity'
  | 'analysis'
  | 'sustainability'
  | 'scenarios'
  | 'reports';

export type AnalysisOverlay =
  | 'none'
  | 'sunlight'
  | 'wind'
  | 'walkability'
  | 'zoning'
  | 'traffic'
  | 'heat';

export interface EnvironmentalSettings {
  timeOfDay: number; // 6.0 to 20.0 (e.g. 14.5 = 14:30)
  sunAzimuth: number; // degrees
  sunElevation: number; // degrees
  windDirection: string; // 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW'
  windDirectionDegrees: number; // 0 to 360
  windSpeedKmH: number; // e.g. 14 km/h
  trafficLevel: 'Low' | 'Medium' | 'High';
  overlay: AnalysisOverlay;
  nightMode: boolean;
}

export interface ScenarioPlan {
  id: string;
  name: string;
  description: string;
  population: number;
  greenAreaHectares: number;
  builtAreaHectares: number;
  energyDemandMwh: number;
  solarGenMwh: number;
  waterUsageM3: number;
  sustainabilityScore: number;
  walkabilityScore: number;
  trafficIndex: number;
  objects: CityObject[];
}

export type CityScenario = ScenarioPlan;

export interface CityMetrics {
  totalSiteAreaHa: number;
  builtUpAreaHa: number;
  greenAreaHa: number;
  roadAreaHa: number;
  waterAreaHa: number;
  populationCapacity: number;
  residentialUnits: number;
  populationDensityKm2: number;
  greenCoveragePct: number;
  renewableEnergyPct: number;
  dailySolarGenMwh: number;
  dailyEnergyDemandMwh: number;
  energyBalanceMwh: number;
  dailyWaterUsageM3: number;
  waterRecycledPct: number;
  rainwaterCollectedM3: number;
  dailyWasteTonnes: number;
  wasteRecycledPct: number;
  carbonReductionPct: number;
  walkabilityScore: number; // 0 - 100
  sustainabilityScore: number; // 0 - 100
  buildingCount: number;
  treeCount: number;
  smartDeviceCount: number;
}
