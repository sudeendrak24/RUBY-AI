import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Camera,
  Maximize2,
  Mic,
  Monitor,
  Activity,
  Layers,
  Sparkles,
  Smartphone,
  Cpu,
  RotateCcw,
  Sun,
  Moon,
  Eye
} from 'lucide-react';
import { OrbState } from './RubyAIOrb';

interface Ruby3DWorkstationProps {
  onVoiceTrigger?: () => void;
  isListening?: boolean;
  isSpeaking?: boolean;
  lastSpokenText?: string;
  selectedLanguage?: 'en' | 'ta' | 'hi';
}

type CameraPreset = 'cinematic' | 'center' | 'left' | 'right' | 'top';

export const Ruby3DWorkstation: React.FC<Ruby3DWorkstationProps> = ({
  onVoiceTrigger,
  isListening = false,
  isSpeaking = false,
  lastSpokenText = '',
  selectedLanguage = 'en',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePreset, setActivePreset] = useState<CameraPreset>('cinematic');
  const [isCinematicDrift, setIsCinematicDrift] = useState<boolean>(true);
  const [ambientTheme, setAmbientTheme] = useState<'cyberpunk' | 'studio'>('cyberpunk');
  const [currentOrbState, setCurrentOrbState] = useState<OrbState>('idle');
  const [simulatedAudio, setSimulatedAudio] = useState<number>(0);

  // Sync state with props
  useEffect(() => {
    if (isListening) {
      setCurrentOrbState('listening');
    } else if (isSpeaking) {
      setCurrentOrbState('speaking');
    } else {
      setCurrentOrbState('idle');
    }
  }, [isListening, isSpeaking]);

  // Audio level oscillation simulation when listening/speaking
  useEffect(() => {
    if (isListening || isSpeaking) {
      const interval = setInterval(() => {
        setSimulatedAudio(0.3 + Math.random() * 0.7);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setSimulatedAudio(0.05);
    }
  }, [isListening, isSpeaking]);

  // Camera Target Reference for smooth lerping
  const cameraTargetRef = useRef<{
    pos: THREE.Vector3;
    lookAt: THREE.Vector3;
  }>({
    pos: new THREE.Vector3(2.5, 2.0, 3.4),
    lookAt: new THREE.Vector3(0, 1.45, 0),
  });

  // Switch camera views
  const handleSetPreset = useCallback((preset: CameraPreset) => {
    setActivePreset(preset);
    setIsCinematicDrift(false);

    switch (preset) {
      case 'cinematic':
        // Front Three-Quarter Perspective (All 3 monitors clearly visible in panoramic setup)
        cameraTargetRef.current.pos.set(2.4, 1.95, 3.3);
        cameraTargetRef.current.lookAt.set(0, 1.45, -0.1);
        break;
      case 'center':
        // Focused view on Center 32" Curved Ultrawide
        cameraTargetRef.current.pos.set(0, 1.48, 2.1);
        cameraTargetRef.current.lookAt.set(0, 1.48, 0);
        break;
      case 'left':
        // Focused view on Left 27" System Monitoring screen
        cameraTargetRef.current.pos.set(-1.45, 1.5, 1.6);
        cameraTargetRef.current.lookAt.set(-1.65, 1.48, -0.22);
        break;
      case 'right':
        // Focused view on Right 27" Android & Telephony screen
        cameraTargetRef.current.pos.set(1.45, 1.5, 1.6);
        cameraTargetRef.current.lookAt.set(1.65, 1.48, -0.22);
        break;
      case 'top':
        // Top-down workstation panoramic view
        cameraTargetRef.current.pos.set(0, 3.8, 2.4);
        cameraTargetRef.current.lookAt.set(0, 1.2, 0);
        break;
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 640;

    // Detect software WebGL guard
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
    scene.background = new THREE.Color(0x080808);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(2.4, 1.95, 3.3);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Keep above desk floor
    controls.minDistance = 1.0;
    controls.maxDistance = 6.5;
    controls.target.set(0, 1.45, -0.1);

    // 3. Studio Environment Reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig
    // Cinematic Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xfff0e0, 2.2);
    keyLight.position.set(3, 4.5, 3.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 10;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Cool Hemisphere Ambient Light
    const hemiLight = new THREE.HemisphereLight(0x54a6ff, 0x080808, 0.7);
    scene.add(hemiLight);

    // Rear Acoustic Wall Orange Bias Light (Backlight behind monitors)
    const rearBiasLight = new THREE.PointLight(0xff7900, 3.8, 6.0);
    rearBiasLight.position.set(0, 1.5, -1.0);
    scene.add(rearBiasLight);

    // Subtle Orange Under-Desk Neon Glow Bar
    const underDeskLight = new THREE.PointLight(0xff7900, 2.5, 3.5);
    underDeskLight.position.set(0, 0.45, 0.1);
    scene.add(underDeskLight);

    // Monitor Front Screen Glow casting onto Keyboard & Desk
    const centerScreenGlow = new THREE.PointLight(0xff9d32, 2.0, 3.0);
    centerScreenGlow.position.set(0, 1.35, 0.4);
    scene.add(centerScreenGlow);

    // 5. Workstation Root Group
    const workstationGroup = new THREE.Group();
    scene.add(workstationGroup);

    // --- A. THE MATTE BLACK DESK ---
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.85,
      metalness: 0.12,
    });

    const deskGeo = new THREE.BoxGeometry(4.4, 0.08, 1.9);
    const deskMesh = new THREE.Mesh(deskGeo, deskMat);
    deskMesh.position.set(0, 0.88, 0.15);
    deskMesh.receiveShadow = true;
    workstationGroup.add(deskMesh);

    // Heavy-duty Desk Legs (Steel Matte Black)
    const legMat = new THREE.MeshStandardMaterial({
      color: 0x181818,
      roughness: 0.5,
      metalness: 0.8,
    });
    const legGeo = new THREE.BoxGeometry(0.1, 0.88, 1.6);

    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-2.0, 0.44, 0.15);
    workstationGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(2.0, 0.44, 0.15);
    workstationGroup.add(rightLeg);

    // Desk Extended Mat (Fabric with Orange Accent Edge)
    const matGeo = new THREE.BoxGeometry(2.6, 0.006, 0.95);
    const matMat = new THREE.MeshStandardMaterial({
      color: 0x0c0c0c,
      roughness: 0.95,
      metalness: 0.05,
    });
    const deskPad = new THREE.Mesh(matGeo, matMat);
    deskPad.position.set(0, 0.923, 0.45);
    deskPad.receiveShadow = true;
    workstationGroup.add(deskPad);

    // Orange edge trim on desk pad
    const padTrimGeo = new THREE.BoxGeometry(2.62, 0.005, 0.015);
    const padTrimMat = new THREE.MeshBasicMaterial({ color: 0xff7900 });
    const padTrimFront = new THREE.Mesh(padTrimGeo, padTrimMat);
    padTrimFront.position.set(0, 0.924, 0.925);
    workstationGroup.add(padTrimFront);

    // --- B. TRIPLE-MONITOR ARTICULATING MOUNTING ARM ---
    const armMat = new THREE.MeshStandardMaterial({
      color: 0x1f1f1f,
      roughness: 0.35,
      metalness: 0.85,
    });

    // Central Desk Clamp & Vertical Heavy Steel Column
    const poleGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.85, 24);
    const poleMesh = new THREE.Mesh(poleGeo, armMat);
    poleMesh.position.set(0, 1.25, -0.65);
    workstationGroup.add(poleMesh);

    const clampGeo = new THREE.BoxGeometry(0.18, 0.15, 0.16);
    const clampMesh = new THREE.Mesh(clampGeo, armMat);
    clampMesh.position.set(0, 0.92, -0.65);
    workstationGroup.add(clampMesh);

    // Left & Right Articulated Hydraulic Extension Arms
    const crossbarGeo = new THREE.BoxGeometry(2.6, 0.04, 0.05);
    const crossbarMesh = new THREE.Mesh(crossbarGeo, armMat);
    crossbarMesh.position.set(0, 1.48, -0.6);
    workstationGroup.add(crossbarMesh);

    // Cable Management Loom (Braided black cable drop)
    const cableMat = new THREE.MeshStandardMaterial({
      color: 0x080808,
      roughness: 0.9,
    });
    const cableGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.65, 12);
    const cableMesh = new THREE.Mesh(cableGeo, cableMat);
    cableMesh.position.set(0.08, 1.15, -0.64);
    workstationGroup.add(cableMesh);

    // --- C. DYNAMIC CANVAS TEXTURES FOR THE 3 MONITORS ---
    // 1. Center Monitor Canvas (32" Ultrawide, 21:9 ratio)
    const centerCanvas = document.createElement('canvas');
    centerCanvas.width = 1280;
    centerCanvas.height = 548;
    const centerCtx = centerCanvas.getContext('2d')!;
    const centerTexture = new THREE.CanvasTexture(centerCanvas);
    centerTexture.colorSpace = THREE.SRGBColorSpace;

    // 2. Left Monitor Canvas (27" 16:9 ratio - Hardware Telemetry)
    const leftCanvas = document.createElement('canvas');
    leftCanvas.width = 960;
    leftCanvas.height = 640;
    const leftCtx = leftCanvas.getContext('2d')!;
    const leftTexture = new THREE.CanvasTexture(leftCanvas);
    leftTexture.colorSpace = THREE.SRGBColorSpace;

    // 3. Right Monitor Canvas (27" 16:9 ratio - Android & Telephony)
    const rightCanvas = document.createElement('canvas');
    rightCanvas.width = 960;
    rightCanvas.height = 640;
    const rightCtx = rightCanvas.getContext('2d')!;
    const rightTexture = new THREE.CanvasTexture(rightCanvas);
    rightTexture.colorSpace = THREE.SRGBColorSpace;

    // Screen Materials
    const centerScreenMat = new THREE.MeshBasicMaterial({
      map: centerTexture,
    });
    const leftScreenMat = new THREE.MeshBasicMaterial({
      map: leftTexture,
    });
    const rightScreenMat = new THREE.MeshBasicMaterial({
      map: rightTexture,
    });

    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.4,
      metalness: 0.8,
    });

    // --- D. PHYSICAL MONITOR 1: CENTER 32" CURVED ULTRAWIDE DISPLAY ---
    // Curved Geometry (1800R equivalent cylindrical arc)
    const centerCurveRadius = 4.8;
    const centerArc = 0.48; // ~27.5 degrees arc
    const centerHeight = 1.05;

    // Screen Surface (Curved Cylinder Slice)
    const centerScreenGeo = new THREE.CylinderGeometry(
      centerCurveRadius,
      centerCurveRadius,
      centerHeight,
      36,
      1,
      true,
      -centerArc / 2 + Math.PI / 2,
      centerArc
    );
    // Invert geometry so screen faces user inside curvature
    centerScreenGeo.scale(-1, 1, 1);

    const centerScreenMesh = new THREE.Mesh(centerScreenGeo, centerScreenMat);
    centerScreenMesh.position.set(0, 1.48, -centerCurveRadius + 0.1);
    workstationGroup.add(centerScreenMesh);

    // Center Monitor Frame / Back Bezel Housing
    const centerBackGeo = new THREE.CylinderGeometry(
      centerCurveRadius + 0.035,
      centerCurveRadius + 0.035,
      centerHeight + 0.05,
      36,
      1,
      true,
      -centerArc / 2 + Math.PI / 2,
      centerArc
    );
    const centerBackMesh = new THREE.Mesh(centerBackGeo, bezelMat);
    centerBackMesh.position.set(0, 1.48, -centerCurveRadius + 0.1);
    workstationGroup.add(centerBackMesh);

    // Center Chin with RUBY AI Logo Badge
    const centerChinGeo = new THREE.BoxGeometry(0.3, 0.035, 0.015);
    const centerChinMat = new THREE.MeshStandardMaterial({
      color: 0x080808,
      roughness: 0.2,
      metalness: 0.9,
    });
    const centerChin = new THREE.Mesh(centerChinGeo, centerChinMat);
    centerChin.position.set(0, 0.945, 0.12);
    workstationGroup.add(centerChin);

    // --- E. PHYSICAL MONITOR 2: LEFT 27" DISPLAY (Angled 28° Inward) ---
    const sideWidth = 1.38;
    const sideHeight = 0.88;
    const sideAngle = 0.50; // ~28.6 degrees inward angle

    const leftMonitorGroup = new THREE.Group();
    leftMonitorGroup.position.set(-1.64, 1.48, -0.22);
    leftMonitorGroup.rotation.y = sideAngle; // Angled inward towards center!
    workstationGroup.add(leftMonitorGroup);

    // Left Screen Surface
    const leftScreenGeo = new THREE.PlaneGeometry(sideWidth, sideHeight);
    const leftScreenMesh = new THREE.Mesh(leftScreenGeo, leftScreenMat);
    leftMonitorGroup.add(leftScreenMesh);

    // Left Monitor Metallic Bezel Frame & Housing
    const leftFrameGeo = new THREE.BoxGeometry(sideWidth + 0.04, sideHeight + 0.04, 0.045);
    const leftFrameMesh = new THREE.Mesh(leftFrameGeo, bezelMat);
    leftFrameMesh.position.set(0, 0, -0.025);
    leftMonitorGroup.add(leftFrameMesh);

    // VESA Mounting Bracket Connection
    const leftMountBracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.16, 0.08),
      armMat
    );
    leftMountBracket.position.set(0, 0, -0.07);
    leftMonitorGroup.add(leftMountBracket);

    // --- F. PHYSICAL MONITOR 3: RIGHT 27" DISPLAY (Angled 28° Inward) ---
    const rightMonitorGroup = new THREE.Group();
    rightMonitorGroup.position.set(1.64, 1.48, -0.22);
    rightMonitorGroup.rotation.y = -sideAngle; // Angled inward towards center!
    workstationGroup.add(rightMonitorGroup);

    // Right Screen Surface
    const rightScreenGeo = new THREE.PlaneGeometry(sideWidth, sideHeight);
    const rightScreenMesh = new THREE.Mesh(rightScreenGeo, rightScreenMat);
    rightMonitorGroup.add(rightScreenMesh);

    // Right Monitor Metallic Bezel Frame & Housing
    const rightFrameGeo = new THREE.BoxGeometry(sideWidth + 0.04, sideHeight + 0.04, 0.045);
    const rightFrameMesh = new THREE.Mesh(rightFrameGeo, bezelMat);
    rightFrameMesh.position.set(0, 0, -0.025);
    rightMonitorGroup.add(rightFrameMesh);

    const rightMountBracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.16, 0.08),
      armMat
    );
    rightMountBracket.position.set(0, 0, -0.07);
    rightMonitorGroup.add(rightMountBracket);

    // --- G. ACCESSORIES: MECHANICAL KEYBOARD & MOUSE ---
    // Futuristic Mechanical Keyboard (75% Anodized Black Aluminum)
    const kbBaseGeo = new THREE.BoxGeometry(0.72, 0.025, 0.28);
    const kbBaseMat = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.35,
      metalness: 0.85,
    });
    const keyboardBase = new THREE.Mesh(kbBaseGeo, kbBaseMat);
    keyboardBase.position.set(0, 0.938, 0.48);
    workstationGroup.add(keyboardBase);

    // Keycaps with Amber Backlight Glow
    const keycapGeo = new THREE.BoxGeometry(0.68, 0.015, 0.24);
    const keycapMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      emissive: 0xff7900,
      emissiveIntensity: 0.25,
      roughness: 0.6,
      metalness: 0.1,
    });
    const keycapsMesh = new THREE.Mesh(keycapGeo, keycapMat);
    keycapsMesh.position.set(0, 0.952, 0.48);
    workstationGroup.add(keycapsMesh);

    // Premium Ergonomic Wireless Mouse
    const mouseGeo = new THREE.BoxGeometry(0.12, 0.04, 0.19);
    const mouseMat = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.3,
      metalness: 0.7,
    });
    const mouseMesh = new THREE.Mesh(mouseGeo, mouseMat);
    mouseMesh.position.set(0.68, 0.942, 0.48);
    mouseMesh.rotation.y = -0.08;
    workstationGroup.add(mouseMesh);

    // Mouse Amber Accent Strip
    const mouseStripGeo = new THREE.BoxGeometry(0.01, 0.02, 0.08);
    const mouseStripMat = new THREE.MeshBasicMaterial({ color: 0xff7900 });
    const mouseStrip = new THREE.Mesh(mouseStripGeo, mouseStripMat);
    mouseStrip.position.set(0.68, 0.962, 0.46);
    workstationGroup.add(mouseStrip);

    // Nearfield Studio Reference Monitors (Speakers on Left and Right of Desk)
    const speakerMat = new THREE.MeshStandardMaterial({
      color: 0x121212,
      roughness: 0.4,
      metalness: 0.6,
    });
    const speakerConeMat = new THREE.MeshStandardMaterial({
      color: 0xff7900,
      emissive: 0xff7900,
      emissiveIntensity: 0.4,
      roughness: 0.3,
    });

    // Left Speaker
    const leftSpeakerGroup = new THREE.Group();
    leftSpeakerGroup.position.set(-1.95, 1.08, 0.15);
    leftSpeakerGroup.rotation.y = 0.45;
    workstationGroup.add(leftSpeakerGroup);

    const speakerBodyGeo = new THREE.BoxGeometry(0.24, 0.38, 0.28);
    leftSpeakerGroup.add(new THREE.Mesh(speakerBodyGeo, speakerMat));
    const leftCone = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 24), speakerConeMat);
    leftCone.rotation.x = Math.PI / 2;
    leftCone.position.set(0, -0.05, 0.14);
    leftSpeakerGroup.add(leftCone);

    // Right Speaker
    const rightSpeakerGroup = new THREE.Group();
    rightSpeakerGroup.position.set(1.95, 1.08, 0.15);
    rightSpeakerGroup.rotation.y = -0.45;
    workstationGroup.add(rightSpeakerGroup);
    rightSpeakerGroup.add(new THREE.Mesh(speakerBodyGeo, speakerMat));
    const rightCone = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 24), speakerConeMat);
    rightCone.rotation.x = Math.PI / 2;
    rightCone.position.set(0, -0.05, 0.14);
    rightSpeakerGroup.add(rightCone);

    // --- 6. ANIMATION LOOP & LIVE CANVAS SCREEN RENDERERS ---
    let frameId = 0;
    const clock = new THREE.Clock();
    let tickCount = 0;

    // Multi-core CPU simulation array
    const cpuHistory: number[][] = Array.from({ length: 8 }, () =>
      Array.from({ length: 30 }, () => 20 + Math.random() * 30)
    );

    function drawCenterScreen(time: number, audio: number, state: OrbState) {
      const w = centerCanvas.width;
      const h = centerCanvas.height;

      // Deep matte dark background with subtle cyber grid
      centerCtx.fillStyle = '#080808';
      centerCtx.fillRect(0, 0, w, h);

      // Cyber Grid
      centerCtx.strokeStyle = 'rgba(255, 121, 0, 0.06)';
      centerCtx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        centerCtx.beginPath();
        centerCtx.moveTo(x, 0);
        centerCtx.lineTo(x, h);
        centerCtx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        centerCtx.beginPath();
        centerCtx.moveTo(0, y);
        centerCtx.lineTo(w, y);
        centerCtx.stroke();
      }

      // Top Status Bar
      centerCtx.fillStyle = '#111111';
      centerCtx.fillRect(0, 0, w, 44);
      centerCtx.strokeStyle = '#222222';
      centerCtx.strokeRect(0, 0, w, 44);

      // System Header
      centerCtx.fillStyle = '#ffffff';
      centerCtx.font = 'bold 16px monospace';
      centerCtx.fillText('RUBY AI // INTELLIGENCE COMMAND WORKSTATION v2.0-PROD', 24, 28);

      centerCtx.fillStyle = '#FF7900';
      centerCtx.font = 'bold 13px monospace';
      centerCtx.fillText('PORT: 8443 (SECURE TLS) • C-AUDIO RINGBUFFER: 16kHz PCM', 840, 28);

      // Indicator LED
      centerCtx.beginPath();
      centerCtx.arc(815, 24, 5, 0, Math.PI * 2);
      centerCtx.fillStyle = state === 'listening' ? '#ff9d32' : '#35c98a';
      centerCtx.fill();

      // --- CENTER HOLOGRAPHIC RUBY GEM & ORB RENDER ---
      const centerX = w / 2;
      const centerY = h / 2 + 10;
      const gemPulse = 1.0 + Math.sin(time * 3) * 0.05 + audio * 0.25;

      // Radiating Caustic Glow
      const glowGrad = centerCtx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        140 * gemPulse
      );
      glowGrad.addColorStop(0, 'rgba(255, 121, 0, 0.85)');
      glowGrad.addColorStop(0.35, 'rgba(217, 4, 41, 0.45)');
      glowGrad.addColorStop(0.7, 'rgba(255, 121, 0, 0.15)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      centerCtx.fillStyle = glowGrad;
      centerCtx.beginPath();
      centerCtx.arc(centerX, centerY, 140 * gemPulse, 0, Math.PI * 2);
      centerCtx.fill();

      // Gyroscopic Counter-Rotating Holographic Rings
      centerCtx.save();
      centerCtx.translate(centerX, centerY);

      // Ring 1 (Clockwise)
      centerCtx.save();
      centerCtx.rotate(time * 0.8);
      centerCtx.strokeStyle = '#ff7900';
      centerCtx.lineWidth = 2.5;
      centerCtx.setLineDash([12, 10, 4, 10]);
      centerCtx.beginPath();
      centerCtx.ellipse(0, 0, 105 * gemPulse, 42 * gemPulse, 0, 0, Math.PI * 2);
      centerCtx.stroke();
      centerCtx.restore();

      // Ring 2 (Counter-Clockwise)
      centerCtx.save();
      centerCtx.rotate(-time * 1.1);
      centerCtx.strokeStyle = '#ffc15a';
      centerCtx.lineWidth = 1.8;
      centerCtx.setLineDash([8, 8]);
      centerCtx.beginPath();
      centerCtx.ellipse(0, 0, 125 * gemPulse, 34 * gemPulse, Math.PI / 4, 0, Math.PI * 2);
      centerCtx.stroke();
      centerCtx.restore();

      // Center Multifaceted Ruby Gemstone (Vector Facets)
      centerCtx.save();
      centerCtx.scale(gemPulse, gemPulse);

      // Facet Polygons Drawing
      // Table Top
      centerCtx.fillStyle = '#ff758f';
      centerCtx.beginPath();
      centerCtx.moveTo(-28, -44);
      centerCtx.lineTo(28, -44);
      centerCtx.lineTo(0, -18);
      centerCtx.closePath();
      centerCtx.fill();

      // Crown Left
      centerCtx.fillStyle = '#ef233c';
      centerCtx.beginPath();
      centerCtx.moveTo(-28, -44);
      centerCtx.lineTo(0, -18);
      centerCtx.lineTo(-48, -12);
      centerCtx.closePath();
      centerCtx.fill();

      // Crown Right
      centerCtx.fillStyle = '#d90429';
      centerCtx.beginPath();
      centerCtx.moveTo(28, -44);
      centerCtx.lineTo(48, -12);
      centerCtx.lineTo(0, -18);
      centerCtx.closePath();
      centerCtx.fill();

      // Central Heart Core
      centerCtx.fillStyle = '#a4133c';
      centerCtx.beginPath();
      centerCtx.moveTo(-48, -12);
      centerCtx.lineTo(0, -18);
      centerCtx.lineTo(0, 48);
      centerCtx.lineTo(-24, 20);
      centerCtx.closePath();
      centerCtx.fill();

      // Lower Pavilion Right
      centerCtx.fillStyle = '#590d22';
      centerCtx.beginPath();
      centerCtx.moveTo(48, -12);
      centerCtx.lineTo(24, 20);
      centerCtx.lineTo(0, 48);
      centerCtx.lineTo(0, -18);
      centerCtx.closePath();
      centerCtx.fill();

      // Facet Wireframe Edge Outlines
      centerCtx.strokeStyle = 'rgba(255, 220, 230, 0.85)';
      centerCtx.lineWidth = 1.5;
      centerCtx.setLineDash([]);
      centerCtx.stroke();

      // Inner Glowing Spark
      centerCtx.fillStyle = '#ffffff';
      centerCtx.beginPath();
      centerCtx.arc(0, -18, 4 + Math.sin(time * 8) * 2, 0, Math.PI * 2);
      centerCtx.fill();

      centerCtx.restore(); // restore gem scale
      centerCtx.restore(); // restore center translate

      // Real-time Audio Waveform Visualizer
      centerCtx.strokeStyle = '#ff7900';
      centerCtx.lineWidth = 2.5;
      centerCtx.beginPath();
      const waveWidth = 360;
      const startX = centerX - waveWidth / 2;
      const waveY = h - 68;
      for (let x = 0; x < waveWidth; x += 4) {
        const norm = (x / waveWidth) * Math.PI * 2;
        const amp = (audio * 28 + 6) * Math.sin(norm * 4 + time * 10) * Math.cos(norm * 2);
        const y = waveY + amp;
        if (x === 0) centerCtx.moveTo(startX + x, y);
        else centerCtx.lineTo(startX + x, y);
      }
      centerCtx.stroke();

      // Live Transcription / Command Line Readout
      centerCtx.fillStyle = '#111111';
      centerCtx.fillRect(startX - 20, waveY + 22, waveWidth + 40, 32);
      centerCtx.strokeStyle = '#FF7900';
      centerCtx.strokeRect(startX - 20, waveY + 22, waveWidth + 40, 32);

      centerCtx.fillStyle = '#FF9D32';
      centerCtx.font = 'bold 13px monospace';
      const promptText = lastSpokenText || (state === 'listening' ? 'Listening to speech...' : 'READY // Voice Trigger Active');
      centerCtx.fillText(`> ${promptText}`, startX - 8, waveY + 43);

      // Left Panel on Center Monitor: Active Intent & Modules
      centerCtx.fillStyle = '#111111';
      centerCtx.fillRect(32, 64, 260, 440);
      centerCtx.strokeStyle = '#222222';
      centerCtx.strokeRect(32, 64, 260, 440);

      centerCtx.fillStyle = '#FF7900';
      centerCtx.font = 'bold 12px monospace';
      centerCtx.fillText('AI ACTIVE PIPELINES', 48, 92);

      const modules = [
        { name: 'Gemini 3.8 Flash Engine', status: 'ONLINE', ping: '18ms' },
        { name: 'Gemini 3.5 Transcribe', status: 'READY', ping: '12ms' },
        { name: 'Local Ruby 3.2 Brain', status: 'ACTIVE', ping: '0.4ms' },
        { name: 'Airtel Carrier Link', status: 'CONNECTED', ping: '4G/5G' },
        { name: 'Motorcycle Safety Daemon', status: 'STANDBY', ping: 'VAD' },
      ];

      modules.forEach((mod, idx) => {
        const itemY = 126 + idx * 72;
        centerCtx.fillStyle = '#181818';
        centerCtx.fillRect(48, itemY, 228, 54);
        centerCtx.strokeStyle = '#282828';
        centerCtx.strokeRect(48, itemY, 228, 54);

        centerCtx.fillStyle = '#ffffff';
        centerCtx.font = 'bold 12px sans-serif';
        centerCtx.fillText(mod.name, 58, itemY + 22);

        centerCtx.fillStyle = '#35c98a';
        centerCtx.font = '10px monospace';
        centerCtx.fillText(mod.status, 58, itemY + 42);

        centerCtx.fillStyle = '#A1A1AA';
        centerCtx.fillText(mod.ping, 220, itemY + 42);
      });

      // Right Panel on Center Monitor: Quick Actions & Telemetry
      centerCtx.fillStyle = '#111111';
      centerCtx.fillRect(w - 292, 64, 260, 440);
      centerCtx.strokeStyle = '#222222';
      centerCtx.strokeRect(w - 292, 64, 260, 440);

      centerCtx.fillStyle = '#FF7900';
      centerCtx.font = 'bold 12px monospace';
      centerCtx.fillText('SECURITY & HARDWARE', w - 276, 92);

      const secItems = [
        { label: 'HMAC-SHA256 PAIRING', val: 'VALIDATED' },
        { label: 'AUDIO RINGBUFFER', val: 'LOCKED (16kHz)' },
        { label: 'AIRTEL IN-CALL SERVICE', val: 'SCREENING ON' },
        { label: 'OFFLINE FALLBACK', val: 'ENABLED (0ms)' },
        { label: 'TAMIL / HINDI NLU', val: 'LOADED' },
      ];

      secItems.forEach((item, idx) => {
        const itemY = 126 + idx * 72;
        centerCtx.fillStyle = '#181818';
        centerCtx.fillRect(w - 276, itemY, 228, 54);

        centerCtx.fillStyle = '#A1A1AA';
        centerCtx.font = '10px monospace';
        centerCtx.fillText(item.label, w - 264, itemY + 22);

        centerCtx.fillStyle = '#FFC15A';
        centerCtx.font = 'bold 12px monospace';
        centerCtx.fillText(item.val, w - 264, itemY + 42);
      });
    }

    function drawLeftScreen(time: number) {
      const w = leftCanvas.width;
      const h = leftCanvas.height;

      leftCtx.fillStyle = '#080808';
      leftCtx.fillRect(0, 0, w, h);

      // Top Title Bar
      leftCtx.fillStyle = '#111111';
      leftCtx.fillRect(0, 0, w, 44);
      leftCtx.strokeStyle = '#222222';
      leftCtx.strokeRect(0, 0, w, 44);

      leftCtx.fillStyle = '#54a6ff';
      leftCtx.font = 'bold 15px monospace';
      leftCtx.fillText('SYSTEM HARDWARE & RUNTIME DIAGNOSTICS', 24, 28);

      leftCtx.fillStyle = '#A1A1AA';
      leftCtx.font = '11px monospace';
      leftCtx.fillText('WIN-11 PRO // AMD RYZEN 9 7950X // 64GB DDR5', w - 340, 28);

      // Multi-Core CPU Performance Graph (8 Cores)
      leftCtx.fillStyle = '#111111';
      leftCtx.fillRect(24, 60, w - 48, 200);
      leftCtx.strokeStyle = '#222222';
      leftCtx.strokeRect(24, 60, w - 48, 200);

      leftCtx.fillStyle = '#FF7900';
      leftCtx.font = 'bold 12px monospace';
      leftCtx.fillText('CPU LOAD // 16 THREADS (LIVE 100ms SAMPLING)', 40, 84);

      const graphX = 40;
      const graphY = 100;
      const graphW = w - 80;
      const graphH = 140;

      // Draw Grid Lines
      leftCtx.strokeStyle = '#1a1a1a';
      leftCtx.lineWidth = 1;
      for (let g = 0; g <= 4; g++) {
        const y = graphY + (graphH / 4) * g;
        leftCtx.beginPath();
        leftCtx.moveTo(graphX, y);
        leftCtx.lineTo(graphX + graphW, y);
        leftCtx.stroke();
      }

      // Draw Multi-Core Load Lines
      const colors = ['#FF7900', '#FF9D32', '#FFC15A', '#54A6FF', '#35C98A', '#E01E37'];
      cpuHistory.slice(0, 4).forEach((history, coreIdx) => {
        leftCtx.strokeStyle = colors[coreIdx];
        leftCtx.lineWidth = 2;
        leftCtx.beginPath();
        history.forEach((val, ptIdx) => {
          const px = graphX + (ptIdx / (history.length - 1)) * graphW;
          const py = graphY + graphH - (val / 100) * graphH;
          if (ptIdx === 0) leftCtx.moveTo(px, py);
          else leftCtx.lineTo(px, py);
        });
        leftCtx.stroke();
      });

      // Memory & Storage Meters (2 Columns)
      // Column 1: DDR5 Memory
      leftCtx.fillStyle = '#111111';
      leftCtx.fillRect(24, 280, (w - 60) / 2, 160);
      leftCtx.strokeStyle = '#222222';
      leftCtx.strokeRect(24, 280, (w - 60) / 2, 160);

      leftCtx.fillStyle = '#FF9D32';
      leftCtx.font = 'bold 12px monospace';
      leftCtx.fillText('MEMORY (DDR5 6000MHz)', 40, 308);

      leftCtx.fillStyle = '#ffffff';
      leftCtx.font = 'bold 24px monospace';
      leftCtx.fillText('18.4 GB / 64.0 GB', 40, 345);

      // Memory Bar
      leftCtx.fillStyle = '#1c1c1c';
      leftCtx.fillRect(40, 365, 380, 16);
      leftCtx.fillStyle = '#FF7900';
      leftCtx.fillRect(40, 365, 380 * 0.287, 16);

      leftCtx.fillStyle = '#A1A1AA';
      leftCtx.font = '11px monospace';
      leftCtx.fillText('C Audio Ringbuffer: 4096 Samples (0.015s Latency)', 40, 412);

      // Column 2: PCIe Gen 5 NVMe SSD
      const col2X = 24 + (w - 60) / 2 + 12;
      leftCtx.fillStyle = '#111111';
      leftCtx.fillRect(col2X, 280, (w - 60) / 2, 160);
      leftCtx.strokeStyle = '#222222';
      leftCtx.strokeRect(col2X, 280, (w - 60) / 2, 160);

      leftCtx.fillStyle = '#35C98A';
      leftCtx.font = 'bold 12px monospace';
      leftCtx.fillText('PCIE 5.0 NVME STORAGE (SAMSUNG 990 PRO)', col2X + 16, 308);

      leftCtx.fillStyle = '#ffffff';
      leftCtx.font = 'bold 24px monospace';
      leftCtx.fillText('READ: 3.4 GB/s · WRITE: 2.1 GB/s', col2X + 16, 345);

      leftCtx.fillStyle = '#1c1c1c';
      leftCtx.fillRect(col2X + 16, 365, 380, 16);
      leftCtx.fillStyle = '#35C98A';
      leftCtx.fillRect(col2X + 16, 365, 380 * 0.42, 16);

      leftCtx.fillStyle = '#A1A1AA';
      leftCtx.font = '11px monospace';
      leftCtx.fillText('Local AES-256 Memory DB: Synced (SQLite WAL mode)', col2X + 16, 412);

      // Bottom Process Tree
      leftCtx.fillStyle = '#111111';
      leftCtx.fillRect(24, 460, w - 48, 160);
      leftCtx.strokeStyle = '#222222';
      leftCtx.strokeRect(24, 460, w - 48, 160);

      leftCtx.fillStyle = '#FFC15A';
      leftCtx.font = 'bold 12px monospace';
      leftCtx.fillText('C / RUBY 3.2 RUNTIME PROCESS MONITORS', 40, 486);

      const processes = [
        { pid: '10424', name: 'ruby.exe (Brain Core)', cpu: '2.1%', mem: '142 MB', status: 'ACTIVE' },
        { pid: '10428', name: 'ruby_c_audio.dll (PCM Ringbuffer)', cpu: '0.4%', mem: '38 MB', status: 'REALTIME' },
        { pid: '10512', name: 'webrtc_ws_server.exe', cpu: '1.2%', mem: '64 MB', status: 'PORT 8443' },
      ];

      processes.forEach((proc, idx) => {
        const py = 512 + idx * 36;
        leftCtx.fillStyle = '#A1A1AA';
        leftCtx.font = '11px monospace';
        leftCtx.fillText(`[PID ${proc.pid}]  ${proc.name}`, 40, py);
        leftCtx.fillStyle = '#FF7900';
        leftCtx.fillText(proc.cpu, 480, py);
        leftCtx.fillStyle = '#A1A1AA';
        leftCtx.fillText(proc.mem, 620, py);
        leftCtx.fillStyle = '#35C98A';
        leftCtx.fillText(proc.status, 780, py);
      });
    }

    function drawRightScreen(time: number) {
      const w = rightCanvas.width;
      const h = rightCanvas.height;

      rightCtx.fillStyle = '#080808';
      rightCtx.fillRect(0, 0, w, h);

      // Top Title Bar
      rightCtx.fillStyle = '#111111';
      rightCtx.fillRect(0, 0, w, 44);
      rightCtx.strokeStyle = '#222222';
      rightCtx.strokeRect(0, 0, w, 44);

      rightCtx.fillStyle = '#35C98A';
      rightCtx.font = 'bold 15px monospace';
      rightCtx.fillText('ANDROID TELEPHONY & ENCRYPTED MEMORY', 24, 28);

      rightCtx.fillStyle = '#A1A1AA';
      rightCtx.font = '11px monospace';
      rightCtx.fillText('AIRTEL INDIA // DUAL SIM // IN-CALL SERVICE', w - 380, 28);

      // Connected Android Phone Card
      rightCtx.fillStyle = '#111111';
      rightCtx.fillRect(24, 60, w - 48, 140);
      rightCtx.strokeStyle = '#222222';
      rightCtx.strokeRect(24, 60, w - 48, 140);

      rightCtx.fillStyle = '#FF7900';
      rightCtx.font = 'bold 12px monospace';
      rightCtx.fillText('COMPANION HARDWARE (SAMSUNG GALAXY S24 ULTRA)', 40, 88);

      rightCtx.fillStyle = '#ffffff';
      rightCtx.font = 'bold 16px sans-serif';
      rightCtx.fillText('Airtel 5G Plus • SIM 1 Active', 40, 120);

      rightCtx.fillStyle = '#35c98a';
      rightCtx.font = '12px monospace';
      rightCtx.fillText('• Telecom InCallService: BOUND & SCREENING', 40, 150);

      rightCtx.fillStyle = '#FF9D32';
      rightCtx.fillText('• Motorbike Riding Mode: AUTO-TRIGGER READY', 40, 175);

      // Battery & Signal Indicator
      rightCtx.fillStyle = '#181818';
      rightCtx.fillRect(w - 240, 80, 200, 96);
      rightCtx.strokeStyle = '#333333';
      rightCtx.strokeRect(w - 240, 80, 200, 96);

      rightCtx.fillStyle = '#ffffff';
      rightCtx.font = 'bold 12px monospace';
      rightCtx.fillText('BATTERY: 88%', w - 220, 110);
      rightCtx.fillText('CARRIER: Airtel India', w - 220, 134);
      rightCtx.fillStyle = '#35c98a';
      rightCtx.fillText('SIGNAL: -68 dBm (5G)', w - 220, 158);

      // Telephony Call Log & Screening Inbox
      rightCtx.fillStyle = '#111111';
      rightCtx.fillRect(24, 220, w - 48, 200);
      rightCtx.strokeStyle = '#222222';
      rightCtx.strokeRect(24, 220, w - 48, 200);

      rightCtx.fillStyle = '#FFC15A';
      rightCtx.font = 'bold 12px monospace';
      rightCtx.fillText('CARRIER CALL SCREENING & TELECOM AUDIT LOG', 40, 248);

      const calls = [
        { name: 'Amma', num: '+91 98450 11223', action: 'Whitelisted • Ring Passed Through', time: '09:41' },
        { name: 'Rohan (Teammate)', num: '+91 98765 43210', action: 'AI Screened • Message Taken', time: '09:35' },
        { name: 'HDFC Bank Spam', num: '+91 14099 88771', action: 'Rejected • CallScreeningService', time: '09:12' },
      ];

      calls.forEach((call, idx) => {
        const cy = 280 + idx * 44;
        rightCtx.fillStyle = '#ffffff';
        rightCtx.font = 'bold 12px sans-serif';
        rightCtx.fillText(call.name, 40, cy);

        rightCtx.fillStyle = '#A1A1AA';
        rightCtx.font = '11px monospace';
        rightCtx.fillText(call.num, 200, cy);

        rightCtx.fillStyle = idx === 0 ? '#35c98a' : idx === 1 ? '#FF9D32' : '#FF4545';
        rightCtx.fillText(call.action, 380, cy);

        rightCtx.fillStyle = '#666666';
        rightCtx.fillText(call.time, w - 90, cy);
      });

      // Long-Term Encrypted Memory Vault (AES-256)
      rightCtx.fillStyle = '#111111';
      rightCtx.fillRect(24, 440, w - 48, 180);
      rightCtx.strokeStyle = '#222222';
      rightCtx.strokeRect(24, 440, w - 48, 180);

      rightCtx.fillStyle = '#54a6ff';
      rightCtx.font = 'bold 12px monospace';
      rightCtx.fillText('AES-256 ENCRYPTED MEMORY VAULT (ROOM DB)', 40, 468);

      const memoryItems = [
        'User Profile: Sudeendra (Bengaluru, Karnataka)',
        'Primary Language: Tamil (தமிழ்) & English (IN)',
        'Emergency Contacts: Amma, Appa, Dr. Varma (Verified)',
        'Daily Route: Indiranagar <-> Whitefield (Motorcycle)',
      ];

      memoryItems.forEach((mem, idx) => {
        const my = 498 + idx * 28;
        rightCtx.fillStyle = '#FF7900';
        rightCtx.font = '11px monospace';
        rightCtx.fillText('•', 40, my);
        rightCtx.fillStyle = '#d1d5db';
        rightCtx.fillText(mem, 58, my);
      });
    }

    // Main 3D Render Animation Loop
    function animate() {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      tickCount++;

      // Update CPU simulation buffer every 20 frames
      if (tickCount % 20 === 0) {
        cpuHistory.forEach((core) => {
          core.shift();
          core.push(15 + Math.random() * 45);
        });
      }

      // Smooth Camera Lerping towards active preset target
      camera.position.lerp(cameraTargetRef.current.pos, delta * 3.5);
      controls.target.lerp(cameraTargetRef.current.lookAt, delta * 3.5);

      // Subtle Cinematic Camera Drift when enabled in 3/4 view
      if (isCinematicDrift && activePreset === 'cinematic') {
        const driftX = Math.sin(time * 0.25) * 0.15;
        const driftY = Math.cos(time * 0.3) * 0.08;
        camera.position.x = 2.4 + driftX;
        camera.position.y = 1.95 + driftY;
      }

      controls.update();

      // Render Dynamic Canvases
      drawCenterScreen(time, simulatedAudio, currentOrbState);
      drawLeftScreen(time);
      drawRightScreen(time);

      centerTexture.needsUpdate = true;
      leftTexture.needsUpdate = true;
      rightTexture.needsUpdate = true;

      // Pulse screen emissive glow on desk
      centerScreenGlow.intensity = 2.0 + simulatedAudio * 1.5;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 640;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      deskGeo.dispose();
      deskMat.dispose();
      legGeo.dispose();
      legMat.dispose();
      matGeo.dispose();
      matMat.dispose();
      centerScreenGeo.dispose();
      centerScreenMat.dispose();
      centerBackGeo.dispose();
      leftScreenGeo.dispose();
      leftScreenMat.dispose();
      rightScreenGeo.dispose();
      rightScreenMat.dispose();
      bezelMat.dispose();
      armMat.dispose();
      centerTexture.dispose();
      leftTexture.dispose();
      rightTexture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [simulatedAudio, currentOrbState, lastSpokenText, activePreset, isCinematicDrift]);

  return (
    <div className="relative w-full h-[680px] bg-[#080808] border border-[#222222] rounded-[24px] overflow-hidden flex flex-col select-none">
      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="relative w-full flex-1 cursor-grab active:cursor-grabbing" />

      {/* Top Floating Control Bar Overlay */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left Badge: Triple Monitor Identity */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2 bg-[#111111]/90 backdrop-blur-md border border-[#282828] rounded-[16px] shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF7900] shadow-[0_0_8px_#ff7900]" />
          <div>
            <h4 className="text-xs font-bold font-display text-white tracking-wide">
              RUBY AI 3D WORKSTATION
            </h4>
            <p className="text-[10px] text-[#FF9D32] font-mono-num">
              32" Ultrawide + Dual 27" Inward Displays
            </p>
          </div>
        </div>

        {/* Center: Camera Viewpoint Selector Buttons */}
        <div className="pointer-events-auto flex items-center p-1 bg-[#111111]/90 backdrop-blur-md border border-[#282828] rounded-[16px] gap-1 shadow-lg">
          <button
            onClick={() => handleSetPreset('cinematic')}
            className={`px-3 py-1.5 rounded-[12px] text-xs font-medium transition flex items-center gap-1.5 ${
              activePreset === 'cinematic'
                ? 'bg-[#FF7900] text-black font-bold shadow-[0_0_12px_rgba(255,121,0,0.5)]'
                : 'text-[#A1A1AA] hover:text-white hover:bg-[#1a1a1a]'
            }`}
            title="Cinematic Three-Quarter View"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Cinematic 3/4</span>
          </button>

          <button
            onClick={() => handleSetPreset('center')}
            className={`px-3 py-1.5 rounded-[12px] text-xs font-medium transition flex items-center gap-1.5 ${
              activePreset === 'center'
                ? 'bg-[#FF7900] text-black font-bold shadow-[0_0_12px_rgba(255,121,0,0.5)]'
                : 'text-[#A1A1AA] hover:text-white hover:bg-[#1a1a1a]'
            }`}
            title="Focus Center 32-inch Ultrawide Screen"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Center 32"</span>
          </button>

          <button
            onClick={() => handleSetPreset('left')}
            className={`px-3 py-1.5 rounded-[12px] text-xs font-medium transition flex items-center gap-1.5 ${
              activePreset === 'left'
                ? 'bg-[#FF7900] text-black font-bold shadow-[0_0_12px_rgba(255,121,0,0.5)]'
                : 'text-[#A1A1AA] hover:text-white hover:bg-[#1a1a1a]'
            }`}
            title="Focus Left 27-inch System Diagnostics Screen"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Left Hardware</span>
          </button>

          <button
            onClick={() => handleSetPreset('right')}
            className={`px-3 py-1.5 rounded-[12px] text-xs font-medium transition flex items-center gap-1.5 ${
              activePreset === 'right'
                ? 'bg-[#FF7900] text-black font-bold shadow-[0_0_12px_rgba(255,121,0,0.5)]'
                : 'text-[#A1A1AA] hover:text-white hover:bg-[#1a1a1a]'
            }`}
            title="Focus Right 27-inch Android & Telephony Screen"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Right Android</span>
          </button>

          <button
            onClick={() => setIsCinematicDrift(!isCinematicDrift)}
            className={`p-1.5 rounded-[12px] text-xs transition ${
              isCinematicDrift ? 'text-[#FF9D32] bg-[#FF7900]/10' : 'text-[#A1A1AA] hover:text-white'
            }`}
            title="Toggle Subtle Cinematic Camera Drift"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Action: Voice Trigger in 3D */}
        <div className="pointer-events-auto flex items-center gap-2">
          {onVoiceTrigger && (
            <button
              onClick={onVoiceTrigger}
              className={`px-4 py-2 text-xs font-bold rounded-[16px] transition flex items-center gap-2 shadow-lg ${
                isListening
                  ? 'bg-[#FF7900] text-black shadow-[0_0_20px_rgba(255,121,0,0.8)]'
                  : isSpeaking
                  ? 'bg-[#FF9D32] text-black'
                  : 'bg-[#181818] hover:bg-[#252525] text-white border border-[#333333]'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-orange-400" />
              <span>{isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Speak to Ruby'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Information HUD Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono-num text-[#A1A1AA] pointer-events-none">
        <div className="px-3 py-1.5 bg-[#111111]/85 backdrop-blur-md border border-[#282828] rounded-[12px]">
          <span className="text-[#FF7900] font-bold">DRAG:</span> Rotate 3D Camera • <span className="text-[#FF7900] font-bold">SCROLL:</span> Zoom In/Out • <span className="text-[#FF7900] font-bold">PAN:</span> Right Click
        </div>

        <div className="px-3 py-1.5 bg-[#111111]/85 backdrop-blur-md border border-[#282828] rounded-[12px] flex items-center gap-3">
          <span>CURVATURE: 1800R</span>
          <span>·</span>
          <span>SIDE INCLINATION: 28.6°</span>
          <span>·</span>
          <span className="text-[#35C98A]">PBR STUDIO ENVIRONMENT ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
