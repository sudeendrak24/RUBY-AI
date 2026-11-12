import React from 'react';
import { Mic, Radio, Smartphone, Monitor, Sparkles } from 'lucide-react';

interface TopBarProps {
  activeTab: 'core' | 'ecosystem' | 'telephony' | 'riding' | 'memory' | 'source';
  setActiveTab: (tab: 'core' | 'ecosystem' | 'telephony' | 'riding' | 'memory' | 'source') => void;
  onVoiceTrigger: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  selectedLanguage: 'en' | 'ta' | 'hi';
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onVoiceTrigger,
  isListening,
  isSpeaking,
  selectedLanguage,
}) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-8 px-6 py-3.5 bg-[#080808]/95 backdrop-blur-md border-b border-[#222222]">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a href="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white font-display whitespace-nowrap">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF7900] shadow-[0_0_10px_#ff7900]" />
          <span>RUBY AI</span>
          <span className="text-xs font-normal text-[#FF9D32] font-mono-num ml-1">v2.0.0-PROD</span>
        </a>
      </div>

      {/* Zone 2: 4-5 single-line clean navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#A1A1AA]">
        <button
          onClick={() => setActiveTab('core')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'core' ? 'text-[#FF7900] font-semibold' : ''
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#FF7900]" />
          <span>Diamond Core</span>
        </button>

        <button
          onClick={() => setActiveTab('ecosystem')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'ecosystem' ? 'text-[#FF7900] font-semibold' : ''
          }`}
        >
          <Monitor className="w-4 h-4" />
          <span>Dual Ecosystem</span>
        </button>

        <button
          onClick={() => setActiveTab('telephony')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'telephony' ? 'text-[#FF7900] font-semibold' : ''
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Telephony & SIM</span>
        </button>

        <button
          onClick={() => setActiveTab('riding')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'riding' ? 'text-[#FF7900] font-semibold' : ''
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Riding Mode</span>
        </button>

        <button
          onClick={() => setActiveTab('memory')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'memory' ? 'text-[#FF7900] font-semibold' : ''
          }`}
        >
          <span>Memory & Security</span>
        </button>

        <button
          onClick={() => setActiveTab('source')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'source' ? 'text-[#FF7900] font-semibold' : ''
          }`}
        >
          <span>Source & Release</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="hidden sm:inline-block text-xs font-mono-num text-[#A1A1AA] uppercase tracking-wider">
          {selectedLanguage === 'ta' ? 'தமிழ்' : selectedLanguage === 'hi' ? 'हिंदी' : 'EN-IN'}
        </span>
        <button
          onClick={onVoiceTrigger}
          className={`px-4 py-2 text-xs font-medium rounded-[14px] transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
            isListening
              ? 'bg-[#FF7900] text-black shadow-[0_0_20px_rgba(255,121,0,0.8)] font-bold'
              : isSpeaking
              ? 'bg-[#FF9D32] text-black shadow-[0_0_15px_rgba(255,157,50,0.6)] font-bold'
              : 'bg-[#FF7900] hover:bg-[#FF9D32] text-black font-semibold shadow-[0_0_15px_rgba(255,121,0,0.35)]'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>{isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Activate Ruby'}</span>
        </button>
      </div>
    </header>
  );
};
