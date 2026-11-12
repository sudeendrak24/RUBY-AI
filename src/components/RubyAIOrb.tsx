import React, { useMemo } from 'react';

export type OrbState =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'thinking'
  | 'calling'
  | 'error'
  | 'offline'
  | 'privacy';

interface RubyAIOrbProps {
  state?: OrbState;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  audioLevel?: number; // 0.0 to 1.0
  interactive?: boolean;
  statusLabel?: string;
  onClick?: () => void;
}

export const RubyAIOrb: React.FC<RubyAIOrbProps> = ({
  state = 'idle',
  size = 'md',
  audioLevel = 0,
  interactive = true,
  statusLabel,
  onClick,
}) => {
  const clampedAudio = Math.min(Math.max(audioLevel, 0), 1);

  // Responsive dimensions for SVG viewport
  const sizeConfig = {
    sm: { px: 120, labelSize: 'text-[9px]' },
    md: { px: 220, labelSize: 'text-[11px]' },
    lg: { px: 320, labelSize: 'text-xs' },
    fullscreen: { px: 440, labelSize: 'text-sm' },
  }[size];

  // Palette and thematic configuration based on current assistant state
  const stateTheme = useMemo(() => {
    switch (state) {
      case 'listening':
        return {
          glowColor: '#ff7900',
          ambientGlow: 'rgba(255, 121, 0, 0.55)',
          corePrimary: '#ff9d32',
          coreSecondary: '#ffc15a',
          facetHighlight: 'rgba(255, 210, 140, 0.95)',
          strokeColor: 'rgba(255, 193, 90, 0.75)',
          gemMain: '#d90429',
          gemDark: '#800f2f',
          gemDeep: '#590d22',
          ringColor: '#ff9d32',
          animationSpeed: '1.2s',
          pulseScale: 1.0 + clampedAudio * 0.16,
        };
      case 'processing':
        return {
          glowColor: '#ffc15a',
          ambientGlow: 'rgba(255, 193, 90, 0.65)',
          corePrimary: '#ffc15a',
          coreSecondary: '#ffe6a7',
          facetHighlight: 'rgba(255, 255, 255, 0.95)',
          strokeColor: 'rgba(255, 220, 160, 0.85)',
          gemMain: '#ef233c',
          gemDark: '#a4133c',
          gemDeep: '#590d22',
          ringColor: '#ffc15a',
          animationSpeed: '0.8s',
          pulseScale: 1.05,
        };
      case 'speaking':
        return {
          glowColor: '#ff9d32',
          ambientGlow: 'rgba(255, 157, 50, 0.5)',
          corePrimary: '#ff7900',
          coreSecondary: '#ffc15a',
          facetHighlight: 'rgba(255, 220, 180, 0.9)',
          strokeColor: 'rgba(255, 180, 120, 0.7)',
          gemMain: '#d90429',
          gemDark: '#7209b7',
          gemDeep: '#590d22',
          ringColor: '#ff7900',
          animationSpeed: '1.4s',
          pulseScale: 1.04,
        };
      case 'thinking':
        return {
          glowColor: '#54a6ff',
          ambientGlow: 'rgba(84, 166, 255, 0.5)',
          corePrimary: '#00b4d8',
          coreSecondary: '#90e0ef',
          facetHighlight: 'rgba(200, 240, 255, 0.9)',
          strokeColor: 'rgba(144, 224, 239, 0.7)',
          gemMain: '#3a86ff',
          gemDark: '#023e8a',
          gemDeep: '#001233',
          ringColor: '#54a6ff',
          animationSpeed: '2.0s',
          pulseScale: 1.02,
        };
      case 'calling':
        return {
          glowColor: '#35c98a',
          ambientGlow: 'rgba(53, 201, 138, 0.5)',
          corePrimary: '#06d6a0',
          coreSecondary: '#70e000',
          facetHighlight: 'rgba(210, 255, 230, 0.9)',
          strokeColor: 'rgba(112, 224, 0, 0.7)',
          gemMain: '#06d6a0',
          gemDark: '#023020',
          gemDeep: '#011c13',
          ringColor: '#35c98a',
          animationSpeed: '1.6s',
          pulseScale: 1.03,
        };
      case 'error':
        return {
          glowColor: '#ff4545',
          ambientGlow: 'rgba(255, 69, 69, 0.5)',
          corePrimary: '#ff0000',
          coreSecondary: '#ff4d6d',
          facetHighlight: 'rgba(255, 180, 180, 0.85)',
          strokeColor: 'rgba(255, 80, 80, 0.7)',
          gemMain: '#d90429',
          gemDark: '#590d22',
          gemDeep: '#2b0914',
          ringColor: '#ff4545',
          animationSpeed: '0.9s',
          pulseScale: 0.98,
        };
      case 'offline':
        return {
          glowColor: '#444444',
          ambientGlow: 'rgba(68, 68, 68, 0.2)',
          corePrimary: '#333333',
          coreSecondary: '#555555',
          facetHighlight: 'rgba(160, 160, 160, 0.4)',
          strokeColor: 'rgba(100, 100, 100, 0.4)',
          gemMain: '#2b2b2b',
          gemDark: '#181818',
          gemDeep: '#101010',
          ringColor: '#444444',
          animationSpeed: '4.0s',
          pulseScale: 0.96,
        };
      case 'privacy':
        return {
          glowColor: '#880000',
          ambientGlow: 'rgba(136, 0, 0, 0.35)',
          corePrimary: '#590d22',
          coreSecondary: '#3f000c',
          facetHighlight: 'rgba(220, 100, 100, 0.5)',
          strokeColor: 'rgba(150, 40, 40, 0.5)',
          gemMain: '#3f000c',
          gemDark: '#200108',
          gemDeep: '#0f0004',
          ringColor: '#880000',
          animationSpeed: '3.0s',
          pulseScale: 0.94,
        };
      case 'idle':
      default:
        return {
          glowColor: '#ff7900',
          ambientGlow: 'rgba(217, 4, 41, 0.4)',
          corePrimary: '#ff7900',
          coreSecondary: '#ffc15a',
          facetHighlight: 'rgba(255, 230, 210, 0.9)',
          strokeColor: 'rgba(255, 140, 160, 0.6)',
          gemMain: '#c9184a',
          gemDark: '#800f2f',
          gemDeep: '#48001a',
          ringColor: '#ff7900',
          animationSpeed: '3.2s',
          pulseScale: 1.0,
        };
    }
  }, [state, clampedAudio]);

  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center justify-center relative select-none ${
        interactive ? 'cursor-pointer group' : ''
      }`}
    >
      {/* Container with dynamic CSS drop-shadow filters */}
      <div
        style={{
          width: sizeConfig.px,
          height: sizeConfig.px,
          transform: `scale(${stateTheme.pulseScale})`,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative flex items-center justify-center group-hover:scale-105 duration-300"
      >
        <svg
          viewBox="0 0 260 260"
          className="w-full h-full overflow-visible drop-shadow-[0_0_24px_var(--glow)] drop-shadow-[0_0_48px_var(--ambient)]"
          style={
            {
              '--glow': stateTheme.glowColor,
              '--ambient': stateTheme.ambientGlow,
            } as React.CSSProperties
          }
        >
          <defs>
            {/* Embedded CSS Keyframes for High-Fidelity Crystalline Shimmer and Gyroscopic Orbits */}
            <style>{`
              @keyframes ruby-gem-breathe {
                0%, 100% { transform: scale(1) translateY(0px) rotate(0deg); }
                50% { transform: scale(1.025) translateY(-2px) rotate(0.8deg); }
              }
              @keyframes ruby-quantum-orbit-cw {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes ruby-quantum-orbit-ccw {
                from { transform: rotate(0deg); }
                to { transform: rotate(-360deg); }
              }
              @keyframes ruby-caustic-gleam {
                0% { opacity: 0.15; transform: translate(-30px, -30px) scale(0.9); }
                40% { opacity: 0.85; transform: translate(0px, 0px) scale(1.05); }
                70% { opacity: 0.35; transform: translate(25px, 25px) scale(1.0); }
                100% { opacity: 0.15; transform: translate(-30px, -30px) scale(0.9); }
              }
              @keyframes ruby-core-pulse {
                0%, 100% { transform: scale(0.95); opacity: 0.85; }
                50% { transform: scale(1.12); opacity: 1; }
              }
              .ruby-gem-body {
                transform-origin: 130px 130px;
                animation: ruby-gem-breathe ${stateTheme.animationSpeed} ease-in-out infinite;
              }
              .ruby-ring-cw {
                transform-origin: 130px 130px;
                animation: ruby-quantum-orbit-cw 14s linear infinite;
              }
              .ruby-ring-ccw {
                transform-origin: 130px 130px;
                animation: ruby-quantum-orbit-ccw 9s linear infinite;
              }
              .ruby-ring-outer {
                transform-origin: 130px 130px;
                animation: ruby-quantum-orbit-cw 22s linear infinite;
              }
              .ruby-gleam-effect {
                transform-origin: 130px 130px;
                animation: ruby-caustic-gleam ${stateTheme.animationSpeed} ease-in-out infinite;
              }
              .ruby-core-nucleus {
                transform-origin: 130px 126px;
                animation: ruby-core-pulse ${state === 'processing' ? '0.6s' : '1.8s'} ease-in-out infinite;
              }
            `}</style>

            {/* Background Multi-Layer Ambient Bloom Filter */}
            <filter id="rubyBackdropBloom" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
            </filter>

            {/* Linear and Radial Gradients for Multifaceted Optical Refraction */}
            <radialGradient id="rubyInternalBacklight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={stateTheme.coreSecondary} stopOpacity="0.8" />
              <stop offset="35%" stopColor={stateTheme.glowColor} stopOpacity="0.6" />
              <stop offset="70%" stopColor={stateTheme.gemMain} stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="facetTableGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="25%" stopColor={stateTheme.gemMain} />
              <stop offset="80%" stopColor={stateTheme.gemDark} />
              <stop offset="100%" stopColor={stateTheme.gemDeep} />
            </linearGradient>

            <linearGradient id="facetHighlightGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={stateTheme.gemMain} />
              <stop offset="50%" stopColor="#ff4d6d" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="facetLeftCrownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff758f" />
              <stop offset="40%" stopColor={stateTheme.gemMain} />
              <stop offset="100%" stopColor={stateTheme.gemDark} />
            </linearGradient>

            <linearGradient id="facetRightCrownGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={stateTheme.gemMain} />
              <stop offset="60%" stopColor={stateTheme.gemDark} />
              <stop offset="100%" stopColor={stateTheme.gemDeep} />
            </linearGradient>

            <linearGradient id="facetPavilionLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={stateTheme.gemMain} />
              <stop offset="65%" stopColor={stateTheme.gemDark} />
              <stop offset="100%" stopColor={stateTheme.gemDeep} />
            </linearGradient>

            <linearGradient id="facetPavilionRightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={stateTheme.gemDark} />
              <stop offset="70%" stopColor={stateTheme.gemDeep} />
              <stop offset="100%" stopColor="#180006" />
            </linearGradient>

            <linearGradient id="facetCuletGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor={stateTheme.gemDark} />
              <stop offset="50%" stopColor={stateTheme.gemDeep} />
              <stop offset="100%" stopColor="#0a0003" />
            </linearGradient>

            {/* Sharp Crystalline Core Radial Flare */}
            <radialGradient id="crystallineCoreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor={stateTheme.coreSecondary} stopOpacity="0.95" />
              <stop offset="60%" stopColor={stateTheme.corePrimary} stopOpacity="0.8" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* Specular Gleam Linear Sweep */}
            <linearGradient id="causticGleamSweep" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="60%" stopColor={stateTheme.coreSecondary} stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 1. LAYER 1: Deep Internal Backlight Bloom */}
          <circle
            cx="130"
            cy="126"
            r="68"
            fill="url(#rubyInternalBacklight)"
            filter="url(#rubyBackdropBloom)"
            opacity={0.85}
          />

          {/* 2. LAYER 2: Gyroscopic Holographic Quantum Rings (RIIS Design Identity) */}
          <g opacity="0.65">
            {/* Outer Equatorial Orbit */}
            <ellipse
              cx="130"
              cy="130"
              rx="124"
              ry="58"
              fill="none"
              stroke={stateTheme.ringColor}
              strokeWidth="1.2"
              strokeDasharray="6 8 2 8"
              className="ruby-ring-outer"
              opacity="0.4"
            />
            {/* Mid Counter-Rotating Orbit */}
            <ellipse
              cx="130"
              cy="130"
              rx="110"
              ry="42"
              fill="none"
              stroke={stateTheme.coreSecondary}
              strokeWidth="1.4"
              strokeDasharray="12 6"
              className="ruby-ring-ccw"
              opacity="0.6"
            />
            {/* Inner Fast Orbit */}
            <ellipse
              cx="130"
              cy="130"
              rx="96"
              ry="32"
              fill="none"
              stroke={stateTheme.corePrimary}
              strokeWidth="1.6"
              strokeDasharray="4 4"
              className="ruby-ring-cw"
              opacity="0.75"
            />
          </g>

          {/* 3. LAYER 3: Crystalline Ruby Gem Body (Faceted SVG Geometry) */}
          <g className="ruby-gem-body">
            {/* --- LOWER PAVILION FACETS (Depth & Internal Caustic Shadow) --- */}
            {/* P1: Far Left Pavilion */}
            <polygon
              points="40,96 58,142 92,180"
              fill="url(#facetPavilionLeftGrad)"
              stroke={stateTheme.strokeColor}
              strokeWidth="0.8"
            />
            {/* P2: Far Right Pavilion */}
            <polygon
              points="220,96 168,180 202,142"
              fill="url(#facetPavilionRightGrad)"
              stroke={stateTheme.strokeColor}
              strokeWidth="0.8"
            />
            {/* P3: Mid Left Pavilion */}
            <polygon
              points="58,142 100,114 130,154 92,180"
              fill="url(#facetLeftCrownGrad)"
              stroke={stateTheme.strokeColor}
              strokeWidth="0.8"
            />
            {/* P4: Mid Right Pavilion */}
            <polygon
              points="202,142 168,180 130,154 160,114"
              fill="url(#facetRightCrownGrad)"
              stroke={stateTheme.strokeColor}
              strokeWidth="0.8"
            />
            {/* P5: Lower Left Culet */}
            <polygon
              points="92,180 130,154 130,226"
              fill="url(#facetPavilionLeftGrad)"
              stroke={stateTheme.strokeColor}
              strokeWidth="0.9"
            />
            {/* P6: Lower Right Culet */}
            <polygon
              points="168,180 130,226 130,154"
              fill="url(#facetCuletGrad)"
              stroke={stateTheme.strokeColor}
              strokeWidth="0.9"
            />
            {/* P7: Central Pavilion Keel / Ridge */}
            <polygon
              points="100,114 160,114 130,154"
              fill="url(#facetTableGrad)"
              stroke={stateTheme.strokeColor}
              strokeWidth="0.8"
            />

            {/* --- CROWN & GIRDLE FACETS (Prismatic Front Facing Planes) --- */}
            {/* C1: Crown Top Apex */}
            <polygon
              points="100,62 130,42 160,62"
              fill="url(#facetHighlightGrad)"
              stroke={stateTheme.strokeColor}
              strokeWidth="0.8"
            />
            {/* C2: Top Left Corner Bezel */}
            <polygon
              points="70,56 130,42 100,62"
              fill="url(#facetLeftCrownGrad)"
              stroke={stateTheme.strokeColor}
              strokeWidth="0.8"
            />
            {/* C3: Top Right Corner Bezel */}
            <polygon
              points="160,62 130,42 190,56"
              fill="url(#facetRightCrownGrad)"
              stroke={stateTheme.strokeColor}
              strokeWidth="0.8"
            />
            {/* C4: Upper Left Flank Kite */}
            <polygon
              points="70,56 100,62 76,88 40,96"
              fill="url(#facetLeftCrownGrad)"
              stroke={stateTheme.strokeColor}
              strokeWidth="0.8"
            />
            {/* C5: Upper Right Flank Kite */}
            <polygon
              points="190,56 220,96 184,88 160,62"
              fill="url(#facetRightCrownGrad)"
              stroke={stateTheme.strokeColor}
              strokeWidth="0.8"
            />
            {/* M1: Left Girdle Transition */}
            <polygon
              points="40,96 76,88 100,114 58,142"
              fill="url(#facetLeftCrownGrad)"
              stroke={stateTheme.strokeColor}
              strokeWidth="0.8"
            />
            {/* M2: Right Girdle Transition */}
            <polygon
              points="220,96 202,142 160,114 184,88"
              fill="url(#facetRightCrownGrad)"
              stroke={stateTheme.strokeColor}
              strokeWidth="0.8"
            />

            {/* --- TOP TABLE FACETS (Mirror Polished Octagonal Cap) --- */}
            {/* T1: Table Top Sector */}
            <polygon
              points="100,62 160,62 130,88"
              fill="url(#facetHighlightGrad)"
              stroke={stateTheme.strokeColor}
              strokeWidth="1.0"
            />
            {/* T2: Table Right Sector */}
            <polygon
              points="160,62 184,88 160,114 130,88"
              fill="url(#facetRightCrownGrad)"
              stroke={stateTheme.strokeColor}
              strokeWidth="1.0"
            />
            {/* T3: Table Bottom Sector */}
            <polygon
              points="160,114 100,114 130,88"
              fill="url(#facetTableGrad)"
              stroke={stateTheme.strokeColor}
              strokeWidth="1.0"
            />
            {/* T4: Table Left Sector (High-Specular Glint) */}
            <polygon
              points="100,114 76,88 100,62 130,88"
              fill="url(#facetHighlightGrad)"
              stroke={stateTheme.strokeColor}
              strokeWidth="1.0"
            />

            {/* --- LAYER 4: SHARP CRYSTALLINE CENTER (Nested Quantum Octahedron) --- */}
            <g className="ruby-core-nucleus">
              {/* Internal Radiant Energy Sphere */}
              <circle cx="130" cy="126" r="26" fill="url(#crystallineCoreGlow)" />

              {/* Optic Axis Hexagonal Laser Spire */}
              <polygon
                points="126,82 134,82 137,166 123,166"
                fill="none"
                stroke={stateTheme.coreSecondary}
                strokeWidth="1.0"
                opacity="0.85"
              />

              {/* Nested Sharp Faceted Octahedral Core */}
              <polygon
                points="130,98 152,126 130,126"
                fill={stateTheme.coreSecondary}
                opacity="0.75"
              />
              <polygon
                points="130,126 152,126 130,154"
                fill={stateTheme.corePrimary}
                opacity="0.8"
              />
              <polygon
                points="130,98 130,126 108,126"
                fill="#ffffff"
                opacity="0.9"
              />
              <polygon
                points="108,126 130,126 130,154"
                fill={stateTheme.corePrimary}
                opacity="0.8"
              />

              {/* Core Sharp Wireframe Diamond */}
              <polygon
                points="130,96 154,126 130,156 106,126"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.2"
                opacity="0.9"
              />
            </g>

            {/* --- LAYER 5: SPECULAR GLEAM & CAUSTIC LIGHT REFLECTION SWEEP --- */}
            <g className="ruby-gleam-effect" pointerEvents="none">
              <polygon
                points="84,52 142,44 196,86 154,118"
                fill="url(#causticGleamSweep)"
                opacity="0.6"
              />
              {/* Micro-sparkle stars on high facet vertices */}
              <circle cx="100" cy="62" r="2" fill="#ffffff" opacity="0.95" />
              <circle cx="76" cy="88" r="1.5" fill="#ffffff" opacity="0.9" />
              <circle cx="130" cy="42" r="2.5" fill="#ffffff" opacity="0.95" />
              <circle cx="130" cy="88" r="2" fill="#ffffff" opacity="0.85" />
              <circle cx="130" cy="226" r="1.5" fill="#ffffff" opacity="0.8" />
            </g>

            {/* Perimeter Sharp Edge Highlight */}
            <polygon
              points="130,42 190,56 220,96 202,142 168,180 130,226 92,180 58,142 40,96 70,56"
              fill="none"
              stroke={stateTheme.facetHighlight}
              strokeWidth="1.2"
              opacity="0.85"
            />
          </g>
        </svg>
      </div>

      {statusLabel && (
        <span
          className={`mt-2 font-mono-num uppercase tracking-wider text-orange-400/90 font-medium text-center transition-opacity duration-300 ${sizeConfig.labelSize}`}
        >
          {statusLabel}
        </span>
      )}
    </div>
  );
};
