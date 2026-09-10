import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  CityObject,
  SiteBoundary,
  CameraMode,
  EnvironmentalSettings,
} from '../../types';
import {
  Maximize,
  Minimize,
  Eye,
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Wind,
  Navigation,
  Footprints,
} from 'lucide-react';

interface CityViewportProps {
  objects: CityObject[];
  boundary: SiteBoundary;
  selectedObjectId: string | null;
  activeTool: string | null;
  cameraMode: CameraMode;
  envSettings: EnvironmentalSettings;
  overlay?: AnalysisOverlay;
  onSelectObject: (id: string | null) => void;
  onPlaceObject?: (coords: [number, number, number]) => void;
  onTerrainClick?: (coords: [number, number, number]) => void;
  onUpdateObjectPosition?: (id: string, newPos: [number, number, number]) => void;
  onCameraModeChange: (mode: CameraMode) => void;
}

export const CityViewport: React.FC<CityViewportProps> = ({
  objects,
  boundary,
  selectedObjectId,
  activeTool,
  cameraMode,
  envSettings,
  overlay,
  onSelectObject,
  onPlaceObject,
  onTerrainClick,
  onUpdateObjectPosition,
  onCameraModeChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredObjectId, setHoveredObjectId] = useState<string | null>(null);

  const activeOverlay = overlay || envSettings?.overlay || 'none';

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Groups
  const groundGroupRef = useRef<THREE.Group | null>(null);
  const objectsGroupRef = useRef<THREE.Group | null>(null);
  const vehiclesGroupRef = useRef<THREE.Group | null>(null);
  const particlesGroupRef = useRef<THREE.Points | null>(null);
  const selectionBoxRef = useRef<THREE.Box3Helper | null>(null);
  const placementGhostRef = useRef<THREE.Mesh | null>(null);

  // First-person state
  const keysPressedRef = useRef<{ [key: string]: boolean }>({});
  const fpRotationRef = useRef({ yaw: 0, pitch: 0 });

  // Map to store mesh references for raycasting
  const meshToObjectIdMap = useRef<Map<THREE.Object3D, string>>(new Map());

  // Ground plane for raycasting placement/movement
  const groundMeshRef = useRef<THREE.Mesh | null>(null);

  // -------------------------------------------------------------
  // INITIALIZE THREE.JS SCENE
  // -------------------------------------------------------------
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);
    scene.fog = new THREE.FogExp2(0x090d16, 0.0012);
    sceneRef.current = scene;

    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
    camera.position.set(240, 200, 320);
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // prevent going below ground
    controls.minDistance = 15;
    controls.maxDistance = 1200;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // LIGHTING
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 0.7);
    hemiLight.position.set(0, 400, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.6);
    dirLight.position.set(200, 300, 150);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 900;
    const shadowD = 450;
    dirLight.shadow.camera.left = -shadowD;
    dirLight.shadow.camera.right = shadowD;
    dirLight.shadow.camera.top = shadowD;
    dirLight.shadow.camera.bottom = -shadowD;
    dirLight.shadow.bias = -0.0004;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // GROUPS
    const groundGroup = new THREE.Group();
    scene.add(groundGroup);
    groundGroupRef.current = groundGroup;

    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);
    objectsGroupRef.current = objectsGroup;

    const vehiclesGroup = new THREE.Group();
    scene.add(vehiclesGroup);
    vehiclesGroupRef.current = vehiclesGroup;

    // SELECTION HIGHLIGHT BOX
    const bbox = new THREE.Box3();
    const selectionBox = new THREE.Box3Helper(bbox, new THREE.Color(0x38bdf8));
    selectionBox.visible = false;
    scene.add(selectionBox);
    selectionBoxRef.current = selectionBox;

    // GHOST PLACEMENT PREVIEW MESH
    const ghostGeo = new THREE.BoxGeometry(20, 30, 20);
    const ghostMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.5,
      roughness: 0.2,
    });
    const ghostMesh = new THREE.Mesh(ghostGeo, ghostMat);
    ghostMesh.visible = false;
    scene.add(ghostMesh);
    placementGhostRef.current = ghostMesh;

    // RESIZE OBSERVER
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // ANIMATION LOOP
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // First person movement if enabled
      if (cameraMode === 'firstperson' && cameraRef.current) {
        const moveSpeed = 40 * delta;
        const keys = keysPressedRef.current;
        const forward = new THREE.Vector3();
        cameraRef.current.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();
        const right = new THREE.Vector3()
          .crossVectors(forward, new THREE.Vector3(0, 1, 0))
          .normalize();

        if (keys['KeyW'] || keys['ArrowUp']) {
          cameraRef.current.position.addScaledVector(forward, moveSpeed);
        }
        if (keys['KeyS'] || keys['ArrowDown']) {
          cameraRef.current.position.addScaledVector(forward, -moveSpeed);
        }
        if (keys['KeyA'] || keys['ArrowLeft']) {
          cameraRef.current.position.addScaledVector(right, -moveSpeed);
        }
        if (keys['KeyD'] || keys['ArrowRight']) {
          cameraRef.current.position.addScaledVector(right, moveSpeed);
        }
        // Keep camera above ground
        cameraRef.current.position.y = Math.max(3, cameraRef.current.position.y);
      } else {
        controls.update();
      }

      // Rotate Wind Turbines
      objectsGroup.traverse((child) => {
        if (child.name === 'windBlades') {
          child.rotation.z += delta * (envSettings.windSpeedKmH * 0.15 + 1.2);
        }
      });

      // Animate Vehicles along roads
      vehiclesGroup.children.forEach((vehicle, idx) => {
        const speed = (idx % 2 === 0 ? 1 : -1) * (18 + (idx % 3) * 6);
        const axis = idx % 2 === 0 ? 'z' : 'x';
        vehicle.position[axis] +=
          speed *
          delta *
          (envSettings.trafficLevel === 'High'
            ? 0.5
            : envSettings.trafficLevel === 'Low'
            ? 1.4
            : 1.0);
        if (vehicle.position[axis] > 400) vehicle.position[axis] = -400;
        if (vehicle.position[axis] < -400) vehicle.position[axis] = 400;
      });

      // Animate Wind Particles if enabled
      if (particlesGroupRef.current) {
        const positions = particlesGroupRef.current.geometry.attributes.position
          .array as Float32Array;
        const rad = (envSettings.windDirectionDegrees * Math.PI) / 180;
        const dx = Math.sin(rad) * envSettings.windSpeedKmH * delta * 1.5;
        const dz = Math.cos(rad) * envSettings.windSpeedKmH * delta * 1.5;

        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += dx;
          positions[i + 2] += dz;

          if (Math.abs(positions[i]) > 500) positions[i] = -positions[i] * 0.9;
          if (Math.abs(positions[i + 2]) > 500)
            positions[i + 2] = -positions[i + 2] * 0.9;
        }
        particlesGroupRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // -------------------------------------------------------------
  // UPDATE LIGHTING & SUN POSITION ACCORDING TO TIME OF DAY
  // -------------------------------------------------------------
  useEffect(() => {
    if (!dirLightRef.current || !hemiLightRef.current || !sceneRef.current)
      return;

    const dirLight = dirLightRef.current;
    const hemiLight = hemiLightRef.current;
    const scene = sceneRef.current;

    const time = envSettings.timeOfDay; // 6 to 20
    const isNight = envSettings.nightMode || time < 6.5 || time > 19.5;

    // Sun arc: 6:00 (East, low) -> 12:00 (High, South) -> 18:00 (West, low)
    const progress = Math.max(0, Math.min(1, (time - 6) / 12));
    const sunAngle = progress * Math.PI; // 0 to PI

    const distance = 420;
    const sunX = Math.cos(sunAngle) * distance;
    const sunY = Math.max(15, Math.sin(sunAngle) * 380);
    const sunZ = Math.sin(sunAngle * 0.5) * 180 + 40;

    dirLight.position.set(sunX, sunY, sunZ);

    if (isNight) {
      // Midnight / Twilight
      scene.background = new THREE.Color(0x030712);
      scene.fog = new THREE.FogExp2(0x030712, 0.0018);
      dirLight.intensity = 0.15;
      dirLight.color.setHex(0x38bdf8); // Moonlight cyan tint
      hemiLight.intensity = 0.25;
      hemiLight.color.setHex(0x1e1b4b);
      hemiLight.groundColor.setHex(0x09090b);
    } else {
      // Daytime lighting with golden hour transitions
      const isGoldenHour = (time >= 6 && time <= 8) || (time >= 17 && time <= 19);
      if (isGoldenHour) {
        scene.background = new THREE.Color(0x1e1b2e);
        scene.fog = new THREE.FogExp2(0x1e1b2e, 0.0012);
        dirLight.intensity = 1.3;
        dirLight.color.setHex(0xfbbf24); // Warm amber
        hemiLight.intensity = 0.6;
        hemiLight.color.setHex(0xfdba74);
      } else {
        scene.background = new THREE.Color(0x0a101d);
        scene.fog = new THREE.FogExp2(0x0a101d, 0.001);
        dirLight.intensity = 1.8;
        dirLight.color.setHex(0xfffbeb); // Crisp architectural sunlight
        hemiLight.intensity = 0.8;
        hemiLight.color.setHex(0xe0f2fe);
        hemiLight.groundColor.setHex(0x1e293b);
      }
    }
  }, [envSettings.timeOfDay, envSettings.nightMode]);

  // -------------------------------------------------------------
  // BUILD GROUND & BOUNDARY
  // -------------------------------------------------------------
  useEffect(() => {
    if (!groundGroupRef.current) return;
    const group = groundGroupRef.current;
    group.clear();

    // Base endless terrain plane
    const terrainGeo = new THREE.PlaneGeometry(2400, 2400);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x090e17,
      roughness: 0.95,
      metalness: 0.05,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.rotation.x = -Math.PI / 2;
    terrainMesh.position.y = -0.2;
    terrainMesh.receiveShadow = true;
    group.add(terrainMesh);
    groundMeshRef.current = terrainMesh;

    // Architectural Grid Floor
    const gridHelper = new THREE.GridHelper(1200, 120, 0x334155, 0x1e293b);
    gridHelper.position.y = 0.01;
    group.add(gridHelper);

    // Site Boundary Polygon / Shape
    const bWidth = boundary.width || 1000;
    const bLength = boundary.length || 1000;

    // Site Boundary Surface Base
    const siteSurfaceGeo = new THREE.PlaneGeometry(bWidth, bLength);
    const siteSurfaceMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.85,
      metalness: 0.1,
    });
    const siteSurface = new THREE.Mesh(siteSurfaceGeo, siteSurfaceMat);
    siteSurface.rotation.x = -Math.PI / 2;
    siteSurface.position.y = 0.02;
    siteSurface.receiveShadow = true;
    group.add(siteSurface);

    // Boundary Neon Outline
    const borderPoints = [
      new THREE.Vector3(-bWidth / 2, 0.2, -bLength / 2),
      new THREE.Vector3(bWidth / 2, 0.2, -bLength / 2),
      new THREE.Vector3(bWidth / 2, 0.2, bLength / 2),
      new THREE.Vector3(-bWidth / 2, 0.2, bLength / 2),
      new THREE.Vector3(-bWidth / 2, 0.2, -bLength / 2),
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(borderPoints);
    const lineMat = new THREE.LineDashedMaterial({
      color: 0x06b6d4,
      dashSize: 12,
      gapSize: 6,
      linewidth: 2,
    });
    const borderLine = new THREE.Line(lineGeo, lineMat);
    borderLine.computeLineDistances();
    group.add(borderLine);

    // Boundary Corner Pylons
    const pylonGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 8);
    const pylonMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.6,
    });
    [
      [-bWidth / 2, -bLength / 2],
      [bWidth / 2, -bLength / 2],
      [bWidth / 2, bLength / 2],
      [-bWidth / 2, bLength / 2],
    ].forEach(([px, pz]) => {
      const pylon = new THREE.Mesh(pylonGeo, pylonMat);
      pylon.position.set(px, 4, pz);
      group.add(pylon);
    });

    // Walkability Heatmap Overlay if enabled
    if (activeOverlay === 'walkability') {
      const heatmapCanvas = document.createElement('canvas');
      heatmapCanvas.width = 256;
      heatmapCanvas.height = 256;
      const ctx = heatmapCanvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
        grad.addColorStop(0, 'rgba(34, 197, 94, 0.6)'); // Green
        grad.addColorStop(0.5, 'rgba(234, 179, 8, 0.45)'); // Yellow
        grad.addColorStop(0.85, 'rgba(239, 68, 68, 0.35)'); // Red
        grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 256);

        const tex = new THREE.CanvasTexture(heatmapCanvas);
        const heatMat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: 0.8,
        });
        const heatMesh = new THREE.Mesh(siteSurfaceGeo, heatMat);
        heatMesh.rotation.x = -Math.PI / 2;
        heatMesh.position.y = 0.08;
        group.add(heatMesh);
      }
    }
  }, [boundary, activeOverlay]);

  // -------------------------------------------------------------
  // BUILD 3D CITY OBJECTS
  // -------------------------------------------------------------
  useEffect(() => {
    if (!objectsGroupRef.current) return;
    const group = objectsGroupRef.current;
    group.clear();
    meshToObjectIdMap.current.clear();

    const isNight =
      envSettings.nightMode ||
      envSettings.timeOfDay < 6.5 ||
      envSettings.timeOfDay > 19.5;

    // Shared reusable geometry caches for high performance
    const treeTrunkGeo = new THREE.CylinderGeometry(0.8, 1.2, 4, 6);
    const treeTrunkMat = new THREE.MeshStandardMaterial({
      color: 0x472f1b,
      roughness: 0.9,
    });
    const treeFoliageGeo = new THREE.DodecahedronGeometry(5, 1);
    const treeFoliageMat = new THREE.MeshStandardMaterial({
      color: 0x166534,
      roughness: 0.8,
    });

    objects.forEach((obj) => {
      const objContainer = new THREE.Group();
      objContainer.position.set(obj.position[0], obj.position[1], obj.position[2]);
      if (obj.rotation) {
        objContainer.rotation.set(obj.rotation[0], obj.rotation[1], obj.rotation[2]);
      }

      // BUILDINGS
      if (obj.category === 'building') {
        const { width, length, height, floors = 1 } = obj.dimensions;

        // Distinctive architectural podium + tower styling
        const baseColor =
          obj.color ||
          (obj.type === 'Residential'
            ? '#10b981'
            : obj.type === 'Commercial'
            ? '#38bdf8'
            : obj.type === 'Hospital'
            ? '#ef4444'
            : obj.type === 'School'
            ? '#8b5cf6'
            : '#64748b');

        // Facade color with glass reflections
        const bldgMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(baseColor),
          roughness: 0.25,
          metalness: 0.45,
          emissive: isNight
            ? new THREE.Color(baseColor).multiplyScalar(0.2)
            : new THREE.Color(0x000000),
        });

        // Building main volume
        const bldgGeo = new THREE.BoxGeometry(width, height, length);
        const bldgMesh = new THREE.Mesh(bldgGeo, bldgMat);
        bldgMesh.position.y = height / 2;
        bldgMesh.castShadow = true;
        bldgMesh.receiveShadow = true;
        objContainer.add(bldgMesh);

        // Architectural Roof Parapet & Heli-pad / Solar Rooftop
        const roofGeo = new THREE.BoxGeometry(width * 0.85, 1.5, length * 0.85);
        const roofMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          roughness: 0.9,
        });
        const roofMesh = new THREE.Mesh(roofGeo, roofMat);
        roofMesh.position.y = height + 0.75;
        roofMesh.castShadow = true;
        objContainer.add(roofMesh);

        // Rooftop Solar or Green Terrace indicator
        if (floors > 4) {
          const pvGeo = new THREE.PlaneGeometry(width * 0.7, length * 0.7);
          const pvMat = new THREE.MeshStandardMaterial({
            color: 0x0284c7,
            roughness: 0.15,
            metalness: 0.8,
          });
          const pvMesh = new THREE.Mesh(pvGeo, pvMat);
          pvMesh.rotation.x = -Math.PI / 2;
          pvMesh.position.y = height + 1.6;
          objContainer.add(pvMesh);
        }

        // Window floor bands (visual rhythm)
        const windowBandsCount = Math.min(floors, 15);
        if (windowBandsCount > 1) {
          const bandGeo = new THREE.BoxGeometry(
            width * 1.01,
            0.6,
            length * 1.01
          );
          const bandMat = new THREE.MeshBasicMaterial({
            color: isNight ? 0xfef08a : 0x0f172a,
            transparent: true,
            opacity: isNight ? 0.75 : 0.4,
          });
          for (let f = 1; f <= windowBandsCount; f++) {
            const bandMesh = new THREE.Mesh(bandGeo, bandMat);
            bandMesh.position.y = (height / windowBandsCount) * f;
            objContainer.add(bandMesh);
          }
        }

        // Tag mesh for raycasting
        meshToObjectIdMap.current.set(bldgMesh, obj.id);
      }
      // ROADS
      else if (obj.category === 'road') {
        const roadW = obj.roadWidth || obj.dimensions.width || 12;
        const roadL = obj.dimensions.length || 200;

        const roadGeo = new THREE.PlaneGeometry(roadW, roadL);
        const roadMat = new THREE.MeshStandardMaterial({
          color: obj.type === 'Pedestrian Path' ? 0x475569 : 0x1e293b,
          roughness: 0.9,
        });
        const roadMesh = new THREE.Mesh(roadGeo, roadMat);
        roadMesh.rotation.x = -Math.PI / 2;
        roadMesh.position.y = 0.05;
        roadMesh.receiveShadow = true;
        objContainer.add(roadMesh);

        // Center line dashed marking
        if (obj.type !== 'Pedestrian Path') {
          const lineGeo = new THREE.PlaneGeometry(0.5, roadL * 0.9);
          const lineMat = new THREE.MeshBasicMaterial({
            color: 0xfacc15,
          });
          const lineMesh = new THREE.Mesh(lineGeo, lineMat);
          lineMesh.rotation.x = -Math.PI / 2;
          lineMesh.position.y = 0.06;
          objContainer.add(lineMesh);
        }

        // Sidewalk curb edges
        const curbGeo = new THREE.BoxGeometry(1.2, 0.3, roadL);
        const curbMat = new THREE.MeshStandardMaterial({
          color: 0x64748b,
          roughness: 0.8,
        });
        const leftCurb = new THREE.Mesh(curbGeo, curbMat);
        leftCurb.position.set(-roadW / 2 - 0.6, 0.15, 0);
        objContainer.add(leftCurb);

        const rightCurb = new THREE.Mesh(curbGeo, curbMat);
        rightCurb.position.set(roadW / 2 + 0.6, 0.15, 0);
        objContainer.add(rightCurb);

        meshToObjectIdMap.current.set(roadMesh, obj.id);
      }
      // PARKS & GREENERY
      else if (obj.category === 'park') {
        const { width, length } = obj.dimensions;
        const parkGeo = new THREE.PlaneGeometry(width, length);
        const parkMat = new THREE.MeshStandardMaterial({
          color: 0x15803d,
          roughness: 0.95,
        });
        const parkMesh = new THREE.Mesh(parkGeo, parkMat);
        parkMesh.rotation.x = -Math.PI / 2;
        parkMesh.position.y = 0.04;
        parkMesh.receiveShadow = true;
        objContainer.add(parkMesh);

        // Trees scattered in the park
        for (let i = 0; i < 6; i++) {
          const tx = (Math.sin(i * 1.8) * width * 0.35);
          const tz = (Math.cos(i * 1.8) * length * 0.35);
          const treeGroup = new THREE.Group();
          treeGroup.position.set(tx, 0, tz);

          const trunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
          trunk.position.y = 2;
          trunk.castShadow = true;
          treeGroup.add(trunk);

          const foliage = new THREE.Mesh(treeFoliageGeo, treeFoliageMat);
          foliage.position.y = 6;
          foliage.castShadow = true;
          treeGroup.add(foliage);

          objContainer.add(treeGroup);
        }

        meshToObjectIdMap.current.set(parkMesh, obj.id);
      }
      // WATER BODIES
      else if (obj.category === 'water') {
        const { width, length } = obj.dimensions;
        const waterGeo = new THREE.PlaneGeometry(width, length);
        const waterMat = new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          roughness: 0.1,
          metalness: 0.7,
        });
        const waterMesh = new THREE.Mesh(waterGeo, waterMat);
        waterMesh.rotation.x = -Math.PI / 2;
        waterMesh.position.y = 0.03;
        waterMesh.receiveShadow = true;
        objContainer.add(waterMesh);

        meshToObjectIdMap.current.set(waterMesh, obj.id);
      }
      // TREES
      else if (obj.category === 'tree') {
        const treeGroup = new THREE.Group();
        const trunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
        trunk.position.y = 2;
        trunk.castShadow = true;
        treeGroup.add(trunk);

        const foliage = new THREE.Mesh(treeFoliageGeo, treeFoliageMat);
        foliage.position.y = 6;
        foliage.castShadow = true;
        treeGroup.add(foliage);

        objContainer.add(treeGroup);
        meshToObjectIdMap.current.set(foliage, obj.id);
      }
      // INFRASTRUCTURE (Solar, Wind, EV, Lighting, Sensors)
      else if (obj.category === 'infrastructure') {
        if (obj.type === 'Solar Farm') {
          const { width, length } = obj.dimensions;
          const rackGroup = new THREE.Group();
          const rows = Math.min(6, Math.floor(length / 10));
          const cols = Math.min(6, Math.floor(width / 12));

          const panelGeo = new THREE.BoxGeometry(10, 0.4, 6);
          const panelMat = new THREE.MeshStandardMaterial({
            color: 0x0369a1,
            roughness: 0.15,
            metalness: 0.8,
          });

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const panel = new THREE.Mesh(panelGeo, panelMat);
              panel.position.set(
                (c - cols / 2 + 0.5) * 12,
                2.5,
                (r - rows / 2 + 0.5) * 10
              );
              panel.rotation.x = 0.35; // optimal solar tilt angle
              panel.castShadow = true;
              rackGroup.add(panel);
            }
          }
          objContainer.add(rackGroup);
          meshToObjectIdMap.current.set(rackGroup.children[0] || rackGroup, obj.id);
        } else if (obj.type === 'Wind Turbine') {
          const mastGeo = new THREE.CylinderGeometry(0.8, 1.8, 65, 12);
          const mastMat = new THREE.MeshStandardMaterial({
            color: 0xf8fafc,
            roughness: 0.3,
          });
          const mast = new THREE.Mesh(mastGeo, mastMat);
          mast.position.y = 32.5;
          mast.castShadow = true;
          objContainer.add(mast);

          // Hub & Blades group
          const bladesGroup = new THREE.Group();
          bladesGroup.name = 'windBlades';
          bladesGroup.position.set(0, 65, 1.5);

          const bladeGeo = new THREE.BoxGeometry(1.2, 28, 0.3);
          const bladeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

          for (let b = 0; b < 3; b++) {
            const blade = new THREE.Mesh(bladeGeo, bladeMat);
            blade.position.y = 14;
            blade.rotation.z = (b * Math.PI * 2) / 3;
            bladesGroup.add(blade);
          }
          objContainer.add(bladesGroup);
          meshToObjectIdMap.current.set(mast, obj.id);
        } else if (obj.type === 'Smart Street Light') {
          const poleGeo = new THREE.CylinderGeometry(0.2, 0.3, 8, 8);
          const poleMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
          const pole = new THREE.Mesh(poleGeo, poleMat);
          pole.position.y = 4;
          pole.castShadow = true;
          objContainer.add(pole);

          // Fixture head
          const headGeo = new THREE.BoxGeometry(0.6, 0.2, 1.6);
          const headMat = new THREE.MeshStandardMaterial({
            color: 0xfacc15,
            emissive: isNight ? 0xfacc15 : 0x000000,
            emissiveIntensity: isNight ? 1.0 : 0.0,
          });
          const head = new THREE.Mesh(headGeo, headMat);
          head.position.set(0, 8, 0.6);
          objContainer.add(head);

          meshToObjectIdMap.current.set(pole, obj.id);
        } else {
          // Generic infrastructure box/kiosk
          const { width, length, height } = obj.dimensions;
          const kGeo = new THREE.BoxGeometry(width, height, length);
          const kMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(obj.color || 0x10b981),
            roughness: 0.4,
            metalness: 0.6,
          });
          const kMesh = new THREE.Mesh(kGeo, kMat);
          kMesh.position.y = height / 2;
          kMesh.castShadow = true;
          objContainer.add(kMesh);
          meshToObjectIdMap.current.set(kMesh, obj.id);
        }
      }
      // AGRICULTURE
      else if (obj.category === 'agriculture') {
        const { width, length, height = 5 } = obj.dimensions;
        const agriGeo = new THREE.BoxGeometry(width, height, length);
        const agriMat = new THREE.MeshStandardMaterial({
          color: 0x65a30d,
          roughness: 0.7,
        });
        const agriMesh = new THREE.Mesh(agriGeo, agriMat);
        agriMesh.position.y = height / 2;
        agriMesh.castShadow = true;
        objContainer.add(agriMesh);
        meshToObjectIdMap.current.set(agriMesh, obj.id);
      }

      group.add(objContainer);
    });
  }, [objects, envSettings.timeOfDay, envSettings.nightMode]);

  // -------------------------------------------------------------
  // SPAWN DYNAMIC VEHICLES ON ROADS
  // -------------------------------------------------------------
  useEffect(() => {
    if (!vehiclesGroupRef.current) return;
    const vGroup = vehiclesGroupRef.current;
    vGroup.clear();

    const carGeo = new THREE.BoxGeometry(2.4, 1.4, 4.8);
    const busGeo = new THREE.BoxGeometry(3.2, 3.0, 11.0);

    const carColors = [0x38bdf8, 0xef4444, 0xfacc15, 0x10b981, 0xe2e8f0];

    // Spawn 14 animated vehicles along primary arteries
    for (let i = 0; i < 14; i++) {
      const isBus = i % 4 === 0;
      const mat = new THREE.MeshStandardMaterial({
        color: isBus ? 0x06b6d4 : carColors[i % carColors.length],
        metalness: 0.7,
        roughness: 0.3,
      });
      const vMesh = new THREE.Mesh(isBus ? busGeo : carGeo, mat);
      vMesh.castShadow = true;

      // Position on main axes
      if (i % 2 === 0) {
        vMesh.position.set((i - 7) * 45, 0.8, -4.5); // East-West road
      } else {
        vMesh.position.set(4.5, 0.8, (i - 7) * 45); // North-South road
        vMesh.rotation.y = Math.PI / 2;
      }
      vGroup.add(vMesh);
    }
  }, []);

  // -------------------------------------------------------------
  // WIND PARTICLES STREAMLINE SIMULATION
  // -------------------------------------------------------------
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // If wind overlay is active, create particle streamlines
    if (envSettings.overlay === 'wind') {
      const particleCount = 1200;
      const geo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 800;
        posArray[i + 1] = Math.random() * 80 + 5;
        posArray[i + 2] = (Math.random() - 0.5) * 800;
      }

      geo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const mat = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 2.2,
        transparent: true,
        opacity: 0.7,
      });

      const particles = new THREE.Points(geo, mat);
      scene.add(particles);
      particlesGroupRef.current = particles;

      return () => {
        scene.remove(particles);
        particlesGroupRef.current = null;
      };
    } else if (particlesGroupRef.current) {
      scene.remove(particlesGroupRef.current);
      particlesGroupRef.current = null;
    }
  }, [envSettings.overlay]);

  // -------------------------------------------------------------
  // UPDATE SELECTION BOX
  // -------------------------------------------------------------
  useEffect(() => {
    if (!selectionBoxRef.current || !objectsGroupRef.current) return;
    const box = selectionBoxRef.current;

    if (!selectedObjectId) {
      box.visible = false;
      return;
    }

    const selectedObj = objects.find((o) => o.id === selectedObjectId);
    if (!selectedObj) {
      box.visible = false;
      return;
    }

    // Find the 3D container or mesh
    const [x, y, z] = selectedObj.position;
    const { width, length, height } = selectedObj.dimensions;

    // Create a bounding box wireframe around selected object
    const bbox = new THREE.Box3(
      new THREE.Vector3(x - width / 2 - 1, 0, z - length / 2 - 1),
      new THREE.Vector3(x + width / 2 + 1, height + 2, z + length / 2 + 1)
    );

    box.box.copy(bbox);
    box.visible = true;
    box.updateMatrixWorld(true);
  }, [selectedObjectId, objects]);

  // -------------------------------------------------------------
  // CAMERA MODE CONTROLS
  // -------------------------------------------------------------
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    switch (cameraMode) {
      case 'top':
        camera.position.set(0, 650, 0.1);
        controls.target.set(0, 0, 0);
        controls.maxPolarAngle = 0.05;
        controls.minPolarAngle = 0;
        break;
      case 'street':
        camera.position.set(0, 3.5, 45);
        controls.target.set(0, 3.5, 0);
        controls.maxPolarAngle = Math.PI / 2 - 0.01;
        controls.minPolarAngle = Math.PI / 2 - 0.4;
        break;
      case 'isometric':
        camera.position.set(380, 380, 380);
        controls.target.set(0, 0, 0);
        controls.maxPolarAngle = Math.PI / 2 - 0.05;
        controls.minPolarAngle = 0.1;
        break;
      case 'firstperson':
        camera.position.set(0, 2.5, 40);
        controls.enabled = false;
        break;
      case 'orbit':
      default:
        controls.enabled = true;
        controls.maxPolarAngle = Math.PI / 2 - 0.02;
        controls.minPolarAngle = 0.1;
        break;
    }
    controls.update();
  }, [cameraMode]);

  // -------------------------------------------------------------
  // MOUSE CLICK & RAYCASTING FOR SELECTION & PLACEMENT
  // -------------------------------------------------------------
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!rendererRef.current || !cameraRef.current) return;
      // Only handle left click
      if (e.button !== 0) return;

      const rect = rendererRef.current.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      // If in placement mode with activeTool
      if (activeTool && groundMeshRef.current) {
        const groundHits = raycaster.intersectObject(groundMeshRef.current);
        if (groundHits.length > 0) {
          const hit = groundHits[0];
          // Snap to 5-meter architectural grid
          const snapX = Math.round(hit.point.x / 5) * 5;
          const snapZ = Math.round(hit.point.z / 5) * 5;
          const placeHandler = onPlaceObject || onTerrainClick;
          if (placeHandler) {
            placeHandler([snapX, 0, snapZ]);
          }
          return;
        }
      }

      // Check object selection
      if (objectsGroupRef.current) {
        const intersects = raycaster.intersectObjects(
          objectsGroupRef.current.children,
          true
        );

        if (intersects.length > 0) {
          // Find matching mapped object ID
          for (const hit of intersects) {
            let curr: THREE.Object3D | null = hit.object;
            while (curr) {
              const matchedId = meshToObjectIdMap.current.get(curr);
              if (matchedId) {
                onSelectObject(matchedId);
                return;
              }
              curr = curr.parent;
            }
          }
        } else {
          // Clicked empty ground: deselect
          onSelectObject(null);
        }
      }
    },
    [activeTool, onPlaceObject, onTerrainClick, onSelectObject]
  );

  // Mouse move for placement ghost preview & hover detection
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!rendererRef.current || !cameraRef.current) return;
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      // Update placement ghost
      if (activeTool && groundMeshRef.current && placementGhostRef.current) {
        const hits = raycaster.intersectObject(groundMeshRef.current);
        if (hits.length > 0) {
          const snapX = Math.round(hits[0].point.x / 5) * 5;
          const snapZ = Math.round(hits[0].point.z / 5) * 5;
          placementGhostRef.current.position.set(snapX, 15, snapZ);
          placementGhostRef.current.visible = true;
        }
      } else if (placementGhostRef.current) {
        placementGhostRef.current.visible = false;
      }
    },
    [activeTool]
  );

  // Focus on selected object
  const handleFocusSelected = useCallback(() => {
    if (!selectedObjectId || !controlsRef.current || !cameraRef.current) return;
    const obj = objects.find((o) => o.id === selectedObjectId);
    if (!obj) return;

    const [x, y, z] = obj.position;
    controlsRef.current.target.set(x, y + 10, z);
    cameraRef.current.position.set(x + 70, y + 50, z + 70);
    controlsRef.current.update();
  }, [selectedObjectId, objects]);

  // Reset camera view
  const handleResetCamera = useCallback(() => {
    if (!controlsRef.current || !cameraRef.current) return;
    cameraRef.current.position.set(240, 200, 320);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
    onCameraModeChange('orbit');
  }, [onCameraModeChange]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!mountRef.current) return;
    if (!document.fullscreenElement) {
      mountRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={mountRef}
      id="three-city-viewport-container"
      className="relative w-full h-full bg-slate-950 overflow-hidden cursor-crosshair select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      {/* 3D CAMERA & NAVIGATION CONTROLS HUD */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-2xl text-xs">
        <button
          id="btn-cam-orbit"
          onClick={() => onCameraModeChange('orbit')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
            cameraMode === 'orbit'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title="Perspective Orbit View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Orbit
        </button>

        <button
          id="btn-cam-top"
          onClick={() => onCameraModeChange('top')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
            cameraMode === 'top'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title="Orthographic Top-Down Masterplan"
        >
          <Compass className="w-3.5 h-3.5" />
          Top View
        </button>

        <button
          id="btn-cam-iso"
          onClick={() => onCameraModeChange('isometric')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
            cameraMode === 'isometric'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title="Architectural Axonometric View"
        >
          <Layers className="w-3.5 h-3.5" />
          Isometric
        </button>

        <button
          id="btn-cam-street"
          onClick={() => onCameraModeChange('street')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
            cameraMode === 'street'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title="Pedestrian Eye-Level View"
        >
          <Eye className="w-3.5 h-3.5" />
          Street View
        </button>

        <button
          id="btn-cam-fp"
          onClick={() => onCameraModeChange('firstperson')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
            cameraMode === 'firstperson'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title="Walk around with W/A/S/D"
        >
          <Footprints className="w-3.5 h-3.5" />
          First Person
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        <button
          id="btn-focus-obj"
          onClick={handleFocusSelected}
          disabled={!selectedObjectId}
          className={`p-1.5 rounded-lg transition-all ${
            selectedObjectId
              ? 'text-cyan-400 hover:bg-cyan-500/20'
              : 'text-slate-600 cursor-not-allowed'
          }`}
          title="Focus Selected Object"
        >
          <Navigation className="w-3.5 h-3.5" />
        </button>

        <button
          id="btn-reset-cam"
          onClick={handleResetCamera}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          title="Reset Camera"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          id="btn-fullscreen-toggle"
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? (
            <Minimize className="w-3.5 h-3.5" />
          ) : (
            <Maximize className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* ACTIVE PLACEMENT INDICATOR */}
      {activeTool && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-950/80 backdrop-blur-md border border-cyan-500/40 shadow-xl text-xs text-cyan-200 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Click ground to place: <strong>{activeTool}</strong></span>
        </div>
      )}

      {/* FIRST PERSON WALK INSTRUCTIONS */}
      {cameraMode === 'firstperson' && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs text-slate-300 shadow-2xl flex items-center gap-3">
          <span>🎮 Use <strong>W A S D</strong> or Arrow keys to walk through the smart city</span>
          <button
            onClick={() => onCameraModeChange('orbit')}
            className="px-2 py-0.5 rounded bg-cyan-600/30 text-cyan-300 hover:bg-cyan-600/50"
          >
            Exit (Orbit)
          </button>
        </div>
      )}

      {/* SUN & TIME BADGE */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs text-slate-300">
        <Sun className="w-3.5 h-3.5 text-amber-400" />
        <span>
          Time: <strong>{Math.floor(envSettings.timeOfDay)}:{String(Math.round((envSettings.timeOfDay % 1) * 60)).padStart(2, '0')}</strong>
        </span>
        <span className="text-slate-600">|</span>
        <Wind className="w-3.5 h-3.5 text-cyan-400" />
        <span>
          Wind: <strong>{envSettings.windDirection} {envSettings.windSpeedKmH} km/h</strong>
        </span>
      </div>
    </div>
  );
};
