import React from 'react';

interface HolographicOrbProps {
  isListening: boolean;
  isSpeaking: boolean;
  size?: 'sm' | 'md' | 'lg';
  statusText?: string;
}

export const HolographicOrb: React.FC<HolographicOrbProps> = ({
  isListening,
  isSpeaking,
  size = 'md',
  statusText,
}) => {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-44 h-44',
    lg: 'w-60 h-60',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center p-2 relative">
      <div className={`relative ${sizeClasses} flex items-center justify-center`}>
        {/* Ambient Radial Glowing Aura */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-700 pointer-events-none ${
            isListening
              ? 'bg-orange-500/30 blur-2xl scale-125 animate-pulse'
              : isSpeaking
              ? 'bg-amber-400/35 blur-2xl scale-120'
              : 'bg-orange-600/15 blur-xl scale-100'
          }`}
        />

        {/* Orbiting Rotating Rings */}
        <div
          className={`absolute inset-[-8px] rounded-full border border-orange-500/25 border-dashed pointer-events-none transition-transform duration-1000 ${
            isListening || isSpeaking ? 'animate-[spin_6s_linear_infinite]' : 'animate-[spin_20s_linear_infinite]'
          }`}
        />

        {/* Core Hologram Image */}
        <div className="relative w-full h-full rounded-full overflow-hidden border border-orange-500/40 shadow-[0_0_35px_rgba(249,115,22,0.3)] bg-black">
          <img
            src="/src/assets/images/ruby_ai_holographic_core_1794431146283.jpg"
            alt="RUBY AI Core"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isListening ? 'scale-110 filter brightness-115' : isSpeaking ? 'scale-105 filter brightness-110' : 'scale-100'
            }`}
          />
        </div>
      </div>

      {/* Dynamic Soundwave Visualizer when active */}
      {(isListening || isSpeaking) && (
        <div className="flex items-center gap-1 mt-4 h-6 px-4">
          {[40, 75, 95, 60, 85, 50, 90, 70, 45].map((height, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isListening ? 'bg-orange-500' : 'bg-amber-400'
              }`}
              style={{
                height: `${isListening ? (i % 2 === 0 ? height : height * 0.6) : height * 0.8}%`,
                animation: `waveOscillate ${0.4 + (i * 0.1)}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>
      )}

      {statusText && (
        <p className="mt-3 text-xs tracking-wider uppercase font-mono-num text-orange-400/90 text-center font-medium">
          {statusText}
        </p>
      )}
    </div>
  );
};
