import { CityObject, SiteBoundary, CityMetrics } from '../types';

export function calculateCityMetrics(
  boundary: SiteBoundary,
  objects: CityObject[]
): CityMetrics {
  const totalSiteAreaHa = boundary.areaHectares || 250;

  let totalBuildingFootprintM2 = 0;
  let totalGrossFloorAreaM2 = 0;
  let totalGreenM2 = 0;
  let totalRoadM2 = 0;
  let totalWaterM2 = 0;
  let buildingCount = 0;
  let treeCount = 0;
  let smartDeviceCount = 0;

  let residentialFootprintM2 = 0;
  let residentialGfaM2 = 0;

  let dailyEnergyDemandKwh = 0;
  let dailySolarGenKwh = 0;
  let dailyWaterDemandLiters = 0;
  let dailyRainwaterLiters = 0;
  let dailyWaterRecycledLiters = 0;
  let dailyWasteKg = 0;
  let dailyWasteRecycledKg = 0;

  // Track amenities for walkability estimation
  const residentialPositions: [number, number][] = [];
  const parkPositions: [number, number][] = [];
  const schoolPositions: [number, number][] = [];
  const healthcarePositions: [number, number][] = [];
  const transitPositions: [number, number][] = [];
  const shopPositions: [number, number][] = [];

  for (const obj of objects) {
    const footprint = (obj.dimensions.width || 10) * (obj.dimensions.length || 10);
    const floors = obj.dimensions.floors || Math.max(1, Math.round(obj.dimensions.height / 3.5));
    const gfa = footprint * floors;

    if (obj.category === 'building') {
      buildingCount++;
      totalBuildingFootprintM2 += footprint;
      totalGrossFloorAreaM2 += gfa;

      // Type-specific modeling
      if (obj.type === 'Residential') {
        residentialFootprintM2 += footprint;
        residentialGfaM2 += gfa;
        dailyEnergyDemandKwh += gfa * 0.12; // ~120 Wh/m²/day
        dailyWaterDemandLiters += (gfa / 35) * 140; // 140 L/person/day
        dailyWasteKg += (gfa / 35) * 1.1; // 1.1 kg/person/day
        residentialPositions.push([obj.position[0], obj.position[2]]);
      } else if (obj.type === 'Commercial' || obj.type === 'Office') {
        dailyEnergyDemandKwh += gfa * 0.28; // High HVAC/lighting
        dailyWaterDemandLiters += (gfa / 20) * 50;
        dailyWasteKg += (gfa / 20) * 0.8;
        shopPositions.push([obj.position[0], obj.position[2]]);
      } else if (obj.type === 'Hospital') {
        dailyEnergyDemandKwh += gfa * 0.45; // Intensive 24/7
        dailyWaterDemandLiters += (gfa / 25) * 220;
        dailyWasteKg += (gfa / 25) * 2.0;
        healthcarePositions.push([obj.position[0], obj.position[2]]);
      } else if (obj.type === 'School' || obj.type === 'College') {
        dailyEnergyDemandKwh += gfa * 0.15;
        dailyWaterDemandLiters += (gfa / 15) * 45;
        dailyWasteKg += (gfa / 15) * 0.5;
        schoolPositions.push([obj.position[0], obj.position[2]]);
      } else if (obj.type === 'Shopping Mall') {
        dailyEnergyDemandKwh += gfa * 0.35;
        dailyWaterDemandLiters += (gfa / 18) * 60;
        dailyWasteKg += (gfa / 18) * 1.5;
        shopPositions.push([obj.position[0], obj.position[2]]);
      } else if (obj.type === 'Industrial') {
        dailyEnergyDemandKwh += gfa * 0.55;
        dailyWaterDemandLiters += (gfa / 30) * 180;
        dailyWasteKg += (gfa / 30) * 3.2;
      } else {
        dailyEnergyDemandKwh += gfa * 0.18;
        dailyWaterDemandLiters += (gfa / 25) * 60;
        dailyWasteKg += (gfa / 25) * 0.7;
      }

      // Rooftop solar potential: 40% of building roofs carry PV
      dailySolarGenKwh += footprint * 0.4 * 0.75; // kWh/m²/day
    } else if (obj.category === 'park') {
      totalGreenM2 += footprint;
      parkPositions.push([obj.position[0], obj.position[2]]);
    } else if (obj.category === 'agriculture') {
      totalGreenM2 += footprint * 0.9;
      dailyWaterDemandLiters += footprint * 4.0; // irrigation
    } else if (obj.category === 'water') {
      totalWaterM2 += footprint;
      dailyRainwaterLiters += footprint * 1.8;
    } else if (obj.category === 'tree') {
      treeCount += (obj.dimensions.width > 20 ? 15 : 1);
      totalGreenM2 += (obj.dimensions.width * obj.dimensions.length);
    } else if (obj.category === 'road') {
      const roadLength = obj.dimensions.length || 50;
      const roadW = obj.roadWidth || obj.dimensions.width || 12;
      totalRoadM2 += roadLength * roadW;
      if (obj.type === 'Public Transport Route' || obj.type === 'Pedestrian Path') {
        transitPositions.push([obj.position[0], obj.position[2]]);
      }
    } else if (obj.category === 'infrastructure') {
      smartDeviceCount++;
      if (obj.type === 'Solar Farm') {
        dailySolarGenKwh += footprint * 1.4;
      } else if (obj.type === 'Wind Turbine') {
        dailySolarGenKwh += 1800; // ~1.8 MWh/day per turbine equivalent
      } else if (obj.type === 'Rainwater Harvester') {
        dailyRainwaterLiters += 120000;
        dailyWaterRecycledLiters += 90000;
      } else if (obj.type === 'Water Treatment Plant') {
        dailyWaterRecycledLiters += 350000;
      } else if (obj.type === 'Waste Recycling Center' || obj.type === 'Composting Area') {
        dailyWasteRecycledKg += 14000;
      } else if (obj.type === 'Smart Waste Bin') {
        dailyWasteRecycledKg += 120;
      } else if (obj.type === 'Bike Share Station' || obj.type === 'Electric Bus Stop') {
        transitPositions.push([obj.position[0], obj.position[2]]);
      }
    }
  }

  // Convert areas to hectares (1 ha = 10,000 m²)
  const builtUpAreaHa = Math.round((totalBuildingFootprintM2 / 10000) * 10) / 10;
  const greenAreaHa = Math.round((totalGreenM2 / 10000) * 10) / 10;
  const roadAreaHa = Math.round((totalRoadM2 / 10000) * 10) / 10;
  const waterAreaHa = Math.round((totalWaterM2 / 10000) * 10) / 10;

  // Population capacity calculation
  // Standard planning assumption: ~32m² of residential GFA per resident
  const populationCapacity = Math.round(residentialGfaM2 / 32) || 85000;
  const residentialUnits = Math.round(residentialGfaM2 / 92) || Math.round(populationCapacity / 2.4);

  // Density per km² (100 hectares = 1 km²)
  const siteAreaKm2 = Math.max(0.1, totalSiteAreaHa / 100);
  const populationDensityKm2 = Math.round(populationCapacity / siteAreaKm2);

  // Green coverage %
  const totalCoveredGreenHa = greenAreaHa + (treeCount * 0.005);
  const greenCoveragePct = Math.min(
    95,
    Math.max(12, Math.round((totalCoveredGreenHa / Math.max(1, totalSiteAreaHa)) * 100))
  );

  // Energy balance
  const dailySolarGenMwh = Math.round((dailySolarGenKwh / 1000) * 10) / 10 || 24.6;
  const dailyEnergyDemandMwh = Math.round((dailyEnergyDemandKwh / 1000) * 10) / 10 || 19.2;
  const energyBalanceMwh = Math.round((dailySolarGenMwh - dailyEnergyDemandMwh) * 10) / 10;
  const renewableEnergyPct = Math.min(
    100,
    Math.round((dailySolarGenMwh / Math.max(0.1, dailyEnergyDemandMwh)) * 100)
  ) || 78;

  // Water calculations
  const dailyWaterUsageM3 = Math.round(dailyWaterDemandLiters / 1000) || 12400;
  const rainwaterCollectedM3 = Math.round(dailyRainwaterLiters / 1000) || 3200;
  const waterRecycledPct = Math.min(
    95,
    Math.max(15, Math.round(((dailyWaterRecycledLiters + dailyRainwaterLiters) / Math.max(1, dailyWaterDemandLiters)) * 100))
  ) || 65;

  // Waste calculations
  const dailyWasteTonnes = Math.round((dailyWasteKg / 1000) * 10) / 10 || 85.4;
  const wasteRecycledPct = Math.min(
    95,
    Math.max(20, Math.round((dailyWasteRecycledKg / Math.max(1, dailyWasteKg)) * 100))
  ) || 81;

  // Walkability index based on proximity
  let walkabilityTotal = 75;
  if (residentialPositions.length > 0) {
    let proximityScore = 0;
    for (const [rx, rz] of residentialPositions.slice(0, 15)) {
      const minParkDist = parkPositions.reduce((min, [px, pz]) => {
        const d = Math.hypot(rx - px, rz - pz);
        return d < min ? d : min;
      }, 9999);
      const minTransitDist = transitPositions.reduce((min, [tx, tz]) => {
        const d = Math.hypot(rx - tx, rz - tz);
        return d < min ? d : min;
      }, 9999);
      const minShopDist = shopPositions.reduce((min, [sx, sz]) => {
        const d = Math.hypot(rx - sx, rz - sz);
        return d < min ? d : min;
      }, 9999);

      // 300m or less is ideal walking distance
      let pt = 100;
      if (minParkDist > 300) pt -= 15;
      if (minTransitDist > 350) pt -= 15;
      if (minShopDist > 400) pt -= 15;
      proximityScore += Math.max(40, pt);
    }
    walkabilityTotal = Math.round(proximityScore / Math.min(15, residentialPositions.length));
  }
  const walkabilityScore = Math.min(98, Math.max(45, walkabilityTotal));

  // Carbon reduction % estimate
  const carbonReductionPct = Math.min(
    95,
    Math.round(
      (renewableEnergyPct * 0.45) +
      (greenCoveragePct * 0.25) +
      (walkabilityScore * 0.15) +
      (wasteRecycledPct * 0.15)
    )
  );

  // Composite Sustainability Score (0 - 100)
  // Formulated transparently:
  // 25% Green Coverage + 25% Renewable Energy + 20% Water Recycling + 15% Waste Recycling + 15% Walkability
  const sustainabilityScore = Math.min(
    99,
    Math.max(
      20,
      Math.round(
        greenCoveragePct * 0.25 +
        renewableEnergyPct * 0.25 +
        waterRecycledPct * 0.20 +
        wasteRecycledPct * 0.15 +
        walkabilityScore * 0.15
      )
    )
  );

  return {
    totalSiteAreaHa,
    builtUpAreaHa,
    greenAreaHa,
    roadAreaHa,
    waterAreaHa,
    populationCapacity,
    residentialUnits,
    populationDensityKm2,
    greenCoveragePct,
    renewableEnergyPct,
    dailySolarGenMwh,
    dailyEnergyDemandMwh,
    energyBalanceMwh,
    dailyWaterUsageM3,
    waterRecycledPct,
    rainwaterCollectedM3,
    dailyWasteTonnes,
    wasteRecycledPct,
    carbonReductionPct,
    walkabilityScore,
    sustainabilityScore,
    buildingCount,
    treeCount,
    smartDeviceCount,
  };
}
