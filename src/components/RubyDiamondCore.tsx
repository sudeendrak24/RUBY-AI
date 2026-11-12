import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Mic,
  Volume2,
  VolumeX,
  Sparkles,
  Maximize2,
  Minimize2,
  RefreshCw,
  Phone,
  Radio,
  Layers,
  Shield,
  Activity,
  ChevronDown
} from 'lucide-react';
import { voiceEngine } from '../services/voiceEngine';
import { brainSimulator } from '../services/mockBrain';
import { RubyLanguage } from '../types/ruby';

export type DiamondState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'processing'
  | 'offline'
  | 'error';

interface RubyDiamondCoreProps {
  state?: DiamondState;
  onStateChange?: (state: DiamondState) => void;
  onVoiceTrigger?: () => void;
  isListening?: boolean;
  isSpeaking?: boolean;
  lastSpokenText?: string;
  selectedLanguage?: RubyLanguage;
  onLanguageChange?: (lang: RubyLanguage) => void;
  onOpenModule?: (module: 'telephony' | 'riding' | 'memory' | 'source') => void;
}

export const RubyDiamondCore: React.FC<RubyDiamondCoreProps> = ({
  state = 'idle',
  onStateChange,
  onVoiceTrigger,
  isListening = false,
  isSpeaking = false,
  lastSpokenText = '',
  selectedLanguage = 'en',
  onLanguageChange,
  onOpenModule,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalState, setInternalState] = useState<DiamondState>(state);
  const [audioAmplitude, setAudioAmplitude] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Sync state from parent props
  useEffect(() => {
    if (isListening) {
      setInternalState('listening');
    } else if (isSpeaking) {
      setInternalState('speaking');
    } else {
      setInternalState(state);
    }
  }, [state, isListening, isSpeaking]);

  const currentState = internalState;

  const handleSelectState = (newState: DiamondState) => {
    setInternalState(newState);
    onStateChange?.(newState);
  };

  // Simulate audio-reactive amplitude when listening or speaking
  useEffect(() => {
    if (currentState === 'listening' || currentState === 'speaking') {
      const interval = setInterval(() => {
        setAudioAmplitude(0.3 + Math.random() * 0.7);
      }, 80);
      return () => clearInterval(interval);
    } else {
      setAudioAmplitude(0.04);
    }
  }, [currentState]);

  // Mouse Parallax Listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || window.innerHeight;

    // Detect software WebGL guard for smooth frame rates
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene, Camera, PBR Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505); // Pure black environment

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 7.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    container.appendChild(renderer.domElement);

    // 2. Studio Environment for Refraction & Specular Facet Highlights
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Cinematic Lighting Rig
    // Key Directional Specular Light (Top-Right, White-Gold)
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 4.8);
    keyLight.position.set(4.5, 5.0, 4.0);
    scene.add(keyLight);

    // Deep Ruby Fire Rim Light (Bottom-Left)
    const rubyRimLight = new THREE.DirectionalLight(0xd90429, 3.8);
    rubyRimLight.position.set(-4.5, -3.0, -3.5);
    scene.add(rubyRimLight);

    // Overhead Glint Spotlight (Creates sharp flashes as diamond facets turn)
    const glintSpot = new THREE.SpotLight(0xffffff, 5.0, 18, Math.PI / 6, 0.25);
    glintSpot.position.set(0, 6.5, 3.5);
    scene.add(glintSpot);

    // Center Dynamic Light (Inside diamond nucleus)
    const corePointLight = new THREE.PointLight(0xff7900, 6.0, 6.0);
    corePointLight.position.set(0, 0, 0);
    scene.add(corePointLight);

    // 4. Central Diamond & Atomic Orbital Groups
    const coreRoot = new THREE.Group();
    scene.add(coreRoot);

    const diamondGroup = new THREE.Group();
    coreRoot.add(diamondGroup);

    // --- A. PROCEDURAL 3D BRILLIANT RUBY DIAMOND GEOMETRY ---
    function createBrilliantDiamondGeometry(): THREE.BufferGeometry {
      const geom = new THREE.BufferGeometry();
      const positions: number[] = [];
      const numSides = 16; // 16-fold radial symmetry = 80+ sharp planar facets

      const tableY = 1.05;
      const tableRadius = 1.25;

      const crownStarY = 0.65;
      const crownStarRadius = 1.95;

      const girdleY = 0.05;
      const girdleRadius = 2.45;

      const culetY = -2.15;

      const tableCenter = [0, tableY, 0];
      const culet = [0, culetY, 0];

      const tablePts: [number, number, number][] = [];
      const starPts: [number, number, number][] = [];
      const girdlePts: [number, number, number][] = [];

      for (let i = 0; i < numSides; i++) {
        const a1 = (i / numSides) * Math.PI * 2;
        const aHalf = ((i + 0.5) / numSides) * Math.PI * 2;

        tablePts.push([Math.cos(a1) * tableRadius, tableY, Math.sin(a1) * tableRadius]);
        starPts.push([Math.cos(aHalf) * crownStarRadius, crownStarY, Math.sin(aHalf) * crownStarRadius]);
        girdlePts.push([Math.cos(a1) * girdleRadius, girdleY, Math.sin(a1) * girdleRadius]);
      }

      const addTri = (
        p1: [number, number, number] | number[],
        p2: [number, number, number] | number[],
        p3: [number, number, number] | number[]
      ) => {
        positions.push(...p1, ...p2, ...p3);
      };

      // 1. Table Facets (16 triangular facets meeting at table apex)
      for (let i = 0; i < numSides; i++) {
        const next = (i + 1) % numSides;
        addTri(tableCenter, tablePts[i], tablePts[next]);
      }

      // 2. Crown Star Facets (Table to Star Ring)
      for (let i = 0; i < numSides; i++) {
        const next = (i + 1) % numSides;
        addTri(tablePts[i], starPts[i], tablePts[next]);
      }

      // 3. Crown Bezel & Kite Facets (Star Ring to Girdle)
      for (let i = 0; i < numSides; i++) {
        const next = (i + 1) % numSides;
        addTri(tablePts[i], girdlePts[i], starPts[i]);
        addTri(tablePts[next], starPts[i], girdlePts[next]);
        addTri(starPts[i], girdlePts[i], girdlePts[next]);
      }

      // 4. Long Sharp Pavilion Facets (Girdle converging to bottom culet point)
      for (let i = 0; i < numSides; i++) {
        const next = (i + 1) % numSides;
        addTri(culet, girdlePts[next], girdlePts[i]);
      }

      geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geom.computeVertexNormals();
      return geom;
    }

    const diamondGeo = createBrilliantDiamondGeometry();

    // Physically-Based Corundum / Diamond Material
    const diamondMat = new THREE.MeshPhysicalMaterial({
      color: 0xd90429, // Deep ruby red
      emissive: 0x590d22, // Internal ruby ember luminescence
      emissiveIntensity: 0.85,
      roughness: 0.02, // Mirror-grade gemstone polish
      metalness: 0.08,
      transmission: isSoftwareGl ? 0 : 0.9, // Crystal transparency
      ior: 2.42, // High-dispersion Diamond/Ruby refraction index
      thickness: 2.5,
      attenuationColor: new THREE.Color(0xef233c),
      attenuationDistance: 0.75,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      flatShading: true, // Distinct, razor-sharp geometric crystal facets
    });

    const diamondMesh = new THREE.Mesh(diamondGeo, diamondMat);
    diamondGroup.add(diamondMesh);

    // Glowing Wireframe Facet Edges
    const edgesGeo = new THREE.EdgesGeometry(diamondGeo, 16);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xff758f,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const diamondEdges = new THREE.LineSegments(edgesGeo, edgesMat);
    diamondGroup.add(diamondEdges);

    // --- B. INTERNAL FLOWING ORANGE ENERGY CORE ---
    const innerCoreGroup = new THREE.Group();
    diamondGroup.add(innerCoreGroup);

    // Inner Faceted Octahedron
    const innerGeo = new THREE.OctahedronGeometry(0.85, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xff0054,
      emissive: 0xff7900,
      emissiveIntensity: 1.6,
      roughness: 0.1,
      metalness: 0.4,
      flatShading: true,
    });
    const innerCoreMesh = new THREE.Mesh(innerGeo, innerMat);
    innerCoreGroup.add(innerCoreMesh);

    // Inner Core Wireframe
    const innerWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(innerGeo),
      new THREE.LineBasicMaterial({ color: 0xffe6a7, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending })
    );
    innerCoreGroup.add(innerWire);

    // --- C. 3D ATOMIC ORBITAL SYSTEM (4 Elliptical Rings + Orbiting Electrons) ---
    const atomicGroup = new THREE.Group();
    coreRoot.add(atomicGroup);

    // Configuration for the 4 3D Atomic Orbital Ellipses
    const orbitalConfigs = [
      {
        rx: 3.8,
        ry: 2.8,
        rot: new THREE.Euler(Math.PI * 0.35, Math.PI * 0.15, Math.PI * 0.08),
        color: 0xff7900,
        speed: 1.0,
        electronColor: 0xffffff,
        electronGlow: 0xffc15a,
      },
      {
        rx: 4.2,
        ry: 3.0,
        rot: new THREE.Euler(-Math.PI * 0.32, -Math.PI * 0.22, -Math.PI * 0.14),
        color: 0xff9d32,
        speed: -1.25,
        electronColor: 0xffffff,
        electronGlow: 0xff7900,
      },
      {
        rx: 3.6,
        ry: 2.6,
        rot: new THREE.Euler(Math.PI * 0.12, Math.PI * 0.45, Math.PI * 0.22),
        color: 0xffc15a,
        speed: 1.45,
        electronColor: 0xffffff,
        electronGlow: 0xffe6a7,
      },
      {
        rx: 4.0,
        ry: 2.9,
        rot: new THREE.Euler(-Math.PI * 0.42, Math.PI * 0.35, -Math.PI * 0.06),
        color: 0xff3b30,
        speed: -0.9,
        electronColor: 0xffffff,
        electronGlow: 0xff5400,
      },
    ];

    interface OrbitRuntime {
      group: THREE.Group;
      rx: number;
      ry: number;
      speed: number;
      electronMesh: THREE.Mesh;
      trailPoints: THREE.Points;
      trailPositions: Float32Array;
      light: THREE.PointLight;
    }

    const orbitRuntimes: OrbitRuntime[] = [];

    // Particle Texture for Comet Trails & Ambient Dust
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 32;
    particleCanvas.height = 32;
    const pCtx = particleCanvas.getContext('2d')!;
    const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    pGrad.addColorStop(0.3, 'rgba(255, 157, 50, 0.85)');
    pGrad.addColorStop(0.7, 'rgba(217, 4, 41, 0.4)');
    pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 32, 32);
    const particleTexture = new THREE.CanvasTexture(particleCanvas);
    particleTexture.colorSpace = THREE.SRGBColorSpace;

    orbitalConfigs.forEach((cfg, idx) => {
      const ringGroup = new THREE.Group();
      ringGroup.rotation.copy(cfg.rot);
      atomicGroup.add(ringGroup);

      // 1. The Elliptical Ring Path
      const curve = new THREE.EllipseCurve(0, 0, cfg.rx, cfg.ry, 0, Math.PI * 2, false, 0);
      const points = curve.getPoints(120);
      const ringGeo = new THREE.BufferGeometry().setFromPoints(points);

      const ringMat = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
      });
      const ringLine = new THREE.LineLoop(ringGeo, ringMat);
      ringGroup.add(ringLine);

      // 2. The Orbiting Electron Energy Sphere
      const electronGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const electronMat = new THREE.MeshStandardMaterial({
        color: cfg.electronColor,
        emissive: cfg.electronGlow,
        emissiveIntensity: 3.5,
        roughness: 0.1,
      });
      const electronMesh = new THREE.Mesh(electronGeo, electronMat);
      ringGroup.add(electronMesh);

      // 3. Electron Moving Light
      const electronLight = new THREE.PointLight(cfg.color, 2.5, 4.5);
      ringGroup.add(electronLight);

      // 4. Comet Light Trail (16 Trail Particles Following the Electron)
      const trailCount = 16;
      const trailPositions = new Float32Array(trailCount * 3);
      const trailGeo = new THREE.BufferGeometry();
      trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

      const trailMat = new THREE.PointsMaterial({
        size: 0.18,
        map: particleTexture,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const trailPoints = new THREE.Points(trailGeo, trailMat);
      ringGroup.add(trailPoints);

      orbitRuntimes.push({
        group: ringGroup,
        rx: cfg.rx,
        ry: cfg.ry,
        speed: cfg.speed,
        electronMesh,
        trailPoints,
        trailPositions,
        light: electronLight,
      });
    });

    // --- D. FLOATING MICROSCOPIC BACKGROUND PARTICLES (Depth & Atmosphere) ---
    const dustCount = 850;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 18;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 0.05,
      map: particleTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // --- 5. ANIMATION LOOP ---
    let frameId = 0;
    const clock = new THREE.Clock();

    function animate() {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Mouse Parallax Damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      camera.position.x = mouseRef.current.x * 0.9;
      camera.position.y = 0.3 + mouseRef.current.y * 0.6;
      camera.lookAt(0, 0, 0);

      // State-specific behavior parameters
      let speedMult = 1.0;
      let targetColor = 0xd90429;
      let targetEmissive = 0x590d22;
      let targetEdgeColor = 0xff758f;
      let corePulseScale = 1.0;
      let levitationAmp = 0.12;

      switch (currentState) {
        case 'listening':
          speedMult = 1.65;
          targetColor = 0xd90429;
          targetEmissive = 0x800f2f;
          targetEdgeColor = 0xffc15a;
          corePulseScale = 1.05 + audioAmplitude * 0.45 + Math.sin(time * 6) * 0.05;
          break;

        case 'thinking':
          speedMult = 1.95;
          targetColor = 0xef233c;
          targetEmissive = 0xa4133c;
          targetEdgeColor = 0xffe3e9;
          corePulseScale = 1.08 + Math.sin(time * 9) * 0.08;
          break;

        case 'speaking':
          speedMult = 1.45;
          targetColor = 0xd90429;
          targetEmissive = 0x7209b7;
          targetEdgeColor = 0xffc15a;
          const vocalMod = (Math.sin(time * 8) + Math.cos(time * 14)) * 0.5;
          corePulseScale = 1.04 + vocalMod * 0.12;
          break;

        case 'processing':
          speedMult = 2.4;
          targetColor = 0xff4d6d;
          targetEmissive = 0xff7900;
          targetEdgeColor = 0xffffff;
          corePulseScale = 1.1 + Math.sin(time * 14) * 0.15;
          break;

        case 'offline':
          speedMult = 0.25;
          targetColor = 0x2b2b2b;
          targetEmissive = 0x111111;
          targetEdgeColor = 0x555555;
          corePulseScale = 0.92;
          levitationAmp = 0.03;
          break;

        case 'error':
          speedMult = 0.75;
          targetColor = 0xd90429;
          targetEmissive = 0x370617;
          targetEdgeColor = 0xff0000;
          corePulseScale = 0.96 + Math.sin(time * 3) * 0.04;
          break;

        case 'idle':
        default:
          speedMult = 1.0;
          targetColor = 0xd90429;
          targetEmissive = 0x590d22;
          targetEdgeColor = 0xff758f;
          corePulseScale = 1.0 + Math.sin(time * 1.5) * 0.04;
          break;
      }

      // Smooth color transitions
      diamondMat.color.lerp(new THREE.Color(targetColor), delta * 4);
      diamondMat.emissive.lerp(new THREE.Color(targetEmissive), delta * 4);
      edgesMat.color.lerp(new THREE.Color(targetEdgeColor), delta * 4);

      // --- Central Diamond Kinematics ---
      // Levitation floating cycle
      diamondGroup.position.y = Math.sin(time * 1.6) * levitationAmp;

      // 3D Dual-Axis Rotation
      diamondGroup.rotation.y += delta * 0.45 * speedMult;
      diamondGroup.rotation.x = Math.sin(time * 0.7) * 0.18;
      diamondGroup.rotation.z = Math.cos(time * 0.5) * 0.12;

      // Inner flowing energy core rotation & acoustic pulse
      innerCoreGroup.rotation.y -= delta * 1.2 * speedMult;
      innerCoreGroup.rotation.x = Math.cos(time * 0.8) * 0.22;
      innerCoreGroup.scale.set(corePulseScale, corePulseScale, corePulseScale);

      // Core Point Light pulsation
      corePointLight.intensity = 5.0 + corePulseScale * 3.0;

      // --- Atomic Orbital System Kinematics ---
      // Continuous overall atomic rotation in 3D
      atomicGroup.rotation.y += delta * 0.12 * speedMult;
      atomicGroup.rotation.x = Math.sin(time * 0.4) * 0.08;

      orbitRuntimes.forEach((orb, i) => {
        // Calculate electron position along ellipse
        const angle = time * orb.speed * speedMult + i * (Math.PI / 2);
        const ex = Math.cos(angle) * orb.rx;
        const ey = Math.sin(angle) * orb.ry;

        orb.electronMesh.position.set(ex, ey, 0);
        orb.light.position.set(ex, ey, 0.1);

        // Update Comet Trail particles
        const trailLen = 16;
        for (let t = 0; t < trailLen; t++) {
          const trailAngle = angle - (t + 1) * 0.08 * (orb.speed > 0 ? 1 : -1);
          orb.trailPositions[t * 3] = Math.cos(trailAngle) * orb.rx;
          orb.trailPositions[t * 3 + 1] = Math.sin(trailAngle) * orb.ry;
          orb.trailPositions[t * 3 + 2] = 0;
        }
        orb.trailPoints.geometry.attributes.position.needsUpdate = true;
      });

      // Ambient Microscopic Dust Drift
      dustParticles.rotation.y += delta * 0.02;
      dustParticles.rotation.x += delta * 0.01;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      diamondGeo.dispose();
      diamondMat.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particleTexture.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [currentState, audioAmplitude]);

  return (
    <div className="relative w-full h-screen bg-[#050505] text-white flex flex-col justify-between overflow-hidden select-none">
      {/* 3D WebGL Canvas Layer */}
      <div
        ref={containerRef}
        onClick={onVoiceTrigger}
        className="absolute inset-0 w-full h-full cursor-pointer z-0"
        title="Click anywhere on the Diamond Core to activate Voice"
      />

      {/* TOP HEADER: Subtle Status Indicators */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 pointer-events-none">
        <div className="flex items-center gap-2.5 pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF7900] shadow-[0_0_10px_#ff7900] animate-pulse" />
          <span className="text-xs font-mono-num font-bold tracking-widest text-[#FF9D32] uppercase">
            RUBY AI // CORE ONLINE
          </span>
          <span className="text-[10px] font-mono-num text-[#A1A1AA] hidden sm:inline">
            (:8443 TLS)
          </span>
        </div>

        {/* Language Selector Pills */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="flex items-center p-1 bg-[#111111]/80 backdrop-blur-md border border-[#222222] rounded-[14px] text-xs">
            <button
              onClick={() => onLanguageChange?.('en')}
              className={`px-3 py-1 rounded-[10px] font-medium transition ${
                selectedLanguage === 'en' ? 'bg-[#FF7900] text-black font-bold shadow-[0_0_8px_#ff7900]' : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange?.('ta')}
              className={`px-3 py-1 rounded-[10px] font-medium transition ${
                selectedLanguage === 'ta' ? 'bg-[#FF7900] text-black font-bold shadow-[0_0_8px_#ff7900]' : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => onLanguageChange?.('hi')}
              className={`px-3 py-1 rounded-[10px] font-medium transition ${
                selectedLanguage === 'hi' ? 'bg-[#FF7900] text-black font-bold shadow-[0_0_8px_#ff7900]' : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </header>

      {/* CENTER-LOWER HERO BRAND IDENTITY (Directly Below the 3D Diamond) */}
      <div className="relative z-10 flex flex-col items-center justify-end text-center pb-8 px-4 pointer-events-none mt-auto">
        {/* State Pill Indicators (Interactive for User Testing) */}
        <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-1.5 p-1 bg-[#111111]/80 backdrop-blur-md border border-[#222222] rounded-[18px] mb-4 shadow-2xl">
          {(['idle', 'listening', 'thinking', 'speaking', 'processing', 'offline', 'error'] as DiamondState[]).map((st) => (
            <button
              key={st}
              onClick={() => handleSelectState(st)}
              className={`px-2.5 py-1 rounded-[12px] text-[10px] font-mono-num font-semibold uppercase tracking-wider transition ${
                currentState === st
                  ? st === 'error'
                    ? 'bg-rose-600 text-white shadow-[0_0_10px_#e11d48]'
                    : st === 'thinking'
                    ? 'bg-[#54A6FF] text-black shadow-[0_0_10px_#54a6ff]'
                    : 'bg-[#FF7900] text-black shadow-[0_0_12px_#ff7900]'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* 1. Large Brand Identity Name */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-[0.2em] font-display text-white uppercase drop-shadow-[0_0_35px_rgba(255,121,0,0.45)]">
          RUBY
        </h1>

        {/* 2. Subtitle */}
        <h2 className="text-xs sm:text-sm font-semibold tracking-[0.38em] text-[#FF9D32] uppercase mt-1 drop-shadow-[0_0_15px_rgba(255,157,50,0.6)]">
          ARTIFICIAL INTELLIGENCE
        </h2>

        {/* 3. Official Product Tagline */}
        <p className="text-[11px] sm:text-xs font-mono-num text-[#A1A1AA] tracking-[0.22em] uppercase mt-2.5 max-w-lg">
          YOUR PERSONAL INTELLIGENCE. YOUR VOICE. YOUR CONTROL.
        </p>

        {/* Interactive Voice Activation Bar */}
        <div className="pointer-events-auto mt-5 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onVoiceTrigger}
            className={`px-6 py-2.5 text-xs font-bold rounded-[16px] transition flex items-center gap-2.5 shadow-2xl ${
              isListening
                ? 'bg-[#FF7900] text-black shadow-[0_0_24px_rgba(255,121,0,0.9)] animate-pulse'
                : isSpeaking
                ? 'bg-[#FF9D32] text-black shadow-[0_0_18px_rgba(255,157,50,0.8)]'
                : 'bg-gradient-to-r from-[#FF7900] to-[#FF9D32] text-black hover:brightness-110 shadow-[0_0_16px_rgba(255,121,0,0.4)]'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>
              {isListening
                ? 'Listening to your voice...'
                : isSpeaking
                ? 'Ruby is speaking...'
                : 'Tap to Speak ("Ruby, call Amma")'}
            </span>
          </button>

          {/* Quick Companion Drawer Launchers */}
          <div className="flex items-center gap-1.5 p-1 bg-[#111111]/80 backdrop-blur-md border border-[#222222] rounded-[16px]">
            <button
              onClick={() => onOpenModule?.('telephony')}
              className="px-3 py-1.5 text-xs text-[#A1A1AA] hover:text-white rounded-[12px] hover:bg-[#1a1a1a] transition flex items-center gap-1.5"
              title="Open Telephony & Carrier SIM Assistant"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Telephony</span>
            </button>
            <button
              onClick={() => onOpenModule?.('riding')}
              className="px-3 py-1.5 text-xs text-[#A1A1AA] hover:text-white rounded-[12px] hover:bg-[#1a1a1a] transition flex items-center gap-1.5"
              title="Open Motorcycle Riding Mode"
            >
              <Radio className="w-3.5 h-3.5 text-orange-400" />
              <span>Riding</span>
            </button>
            <button
              onClick={() => onOpenModule?.('memory')}
              className="px-3 py-1.5 text-xs text-[#A1A1AA] hover:text-white rounded-[12px] hover:bg-[#1a1a1a] transition flex items-center gap-1.5"
              title="Open Encrypted Memory Vault"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Memory</span>
            </button>
          </div>
        </div>

        {/* Live Speech Recognition Transcript Readout */}
        {lastSpokenText && (
          <div className="mt-3 px-4 py-1.5 bg-[#111111]/90 border border-[#FF7900]/30 rounded-[12px] text-xs font-mono-num text-[#FFC15A] max-w-md">
            &gt; "{lastSpokenText}"
          </div>
        )}
      </div>

      {/* FOOTER: Minimal telemetry indicator */}
      <footer className="relative z-10 flex items-center justify-between px-6 py-3 text-[10px] font-mono-num text-[#666666] pointer-events-none">
        <div>
          <span>AIRTEL INDIA SIM 1</span> · <span>ROOM DB ENCRYPTED</span>
        </div>
        <div>
          <span>RUBY 3.2 + C SYSTEMS CORE</span>
        </div>
      </footer>
    </div>
  );
};
