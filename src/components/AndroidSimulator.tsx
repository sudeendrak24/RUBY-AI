import React, { useState } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  Shield,
  Wifi,
  Battery,
  Radio,
  Settings,
  Users,
  Clock,
  Compass,
  Lock,
  Globe,
  Sliders,
  CheckCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Bike,
  MessageSquare,
  Send,
  Copy,
  RefreshCw,
  Volume2
} from 'lucide-react';
import { Contact, RubyLanguage, ScreenId, CallSession } from '../types/ruby';
import { RubyAIOrb, OrbState } from './RubyAIOrb';
import {
  RubyPrimaryButton,
  RubySecondaryButton,
  RubyIconButton,
  RubyCard,
  RubyCallActionButton,
  RubyMessageBubble,
  RubyStatusIndicator
} from './ui/RubyComponents';

interface AndroidSimulatorProps {
  currentScreen: ScreenId;
  setCurrentScreen: (s: ScreenId) => void;
  contacts: Contact[];
  onAddContact: (contact: Contact) => void;
  selectedLanguage: RubyLanguage;
  setSelectedLanguage: (l: RubyLanguage) => void;
  isListening: boolean;
  isSpeaking: boolean;
  onVoiceTrigger: () => void;
  activeCall: CallSession | null;
  onAnswerCall: (mode: 'MANUAL' | 'AI_ASSISTANT') => void;
  onEndCall: () => void;
  onSimulateIncomingCall: (contactName: string, phoneNumber: string) => void;
  isRidingModeActive: boolean;
  setIsRidingModeActive: (active: boolean) => void;
  lastSpokenText: string;
}

export const AndroidSimulator: React.FC<AndroidSimulatorProps> = ({
  currentScreen,
  setCurrentScreen,
  contacts,
  onAddContact,
  selectedLanguage,
  setSelectedLanguage,
  isListening,
  isSpeaking,
  onVoiceTrigger,
  activeCall,
  onAnswerCall,
  onEndCall,
  onSimulateIncomingCall,
  isRidingModeActive,
  setIsRidingModeActive,
  lastSpokenText,
}) => {
  const [onboardingStage, setOnboardingStage] = useState<1 | 2 | 3 | 4>(1);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactIsEmergency, setNewContactIsEmergency] = useState(false);
  const [aiDisclosureOn, setAiDisclosureOn] = useState(true);
  const [pairingToken, setPairingToken] = useState('RUBY-7821-X9');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ruby'; text: string; time: string }>>([
    {
      sender: 'ruby',
      text: 'Hello Sudeendra! I am RUBY, your personal intelligence assistant. How may I assist you today?',
      time: '09:40',
    },
  ]);
  const [chatInputText, setChatInputText] = useState('');

  // Determine current 3D Orb State
  const currentOrbState: OrbState = activeCall
    ? 'calling'
    : isListening
    ? 'listening'
    : isSpeaking
    ? 'speaking'
    : isRidingModeActive
    ? 'processing'
    : 'idle';

  const screens: { id: ScreenId; label: string; icon: any }[] = [
    { id: 'home', label: 'Dashboard', icon: Compass },
    { id: 'voice', label: 'Voice 3D Orb', icon: Mic },
    { id: 'history', label: 'AI Chat', icon: MessageSquare },
    { id: 'incoming_call', label: 'Incoming Call', icon: PhoneCall },
    { id: 'active_call', label: 'Active Call', icon: Phone },
    { id: 'riding_mode', label: 'Riding Mode', icon: Bike },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'memory', label: 'Memory', icon: Lock },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'call_settings', label: 'Call Settings', icon: Sliders },
    { id: 'pairing', label: 'Pairing', icon: Radio },
    { id: 'permissions', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'about', label: 'About', icon: HelpCircle },
    { id: 'splash', label: 'Splash', icon: RotateCcw },
    { id: 'onboarding', label: 'Onboarding (4-Stage)', icon: Play },
    { id: 'outgoing_call', label: 'Dialer', icon: Phone },
    { id: 'windows_sync', label: 'Sync', icon: Wifi },
  ];

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    onAddContact({
      id: `c-${Date.now()}`,
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      aliases: [newContactName.trim()],
      relationship: 'Friend',
      isEmergency: newContactIsEmergency,
      ridingBypass: newContactIsEmergency,
    });
    setNewContactName('');
    setNewContactPhone('');
    setNewContactIsEmergency(false);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;
    const userText = chatInputText.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [...prev, { sender: 'user', text: userText, time: now }]);
    setChatInputText('');

    // Simulated contextual reply
    setTimeout(() => {
      let reply = `Understood: "${userText}". Executing through RUBY AI orchestrator.`;
      if (selectedLanguage === 'ta') {
        reply = `சரிங்க: "${userText}". செயல்முறை துவக்கப்பட்டது.`;
      } else if (selectedLanguage === 'hi') {
        reply = `समझ गया: "${userText}". कार्य प्रगति पर है।`;
      }
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ruby',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Quick Screen Selector Toolbar */}
      <div className="w-full max-w-[390px] mb-3 flex items-center justify-between text-xs text-[#A1A1AA]">
        <span className="font-semibold text-white">Screen View:</span>
        <select
          value={currentScreen}
          onChange={(e) => setCurrentScreen(e.target.value as ScreenId)}
          className="bg-[#111111] border border-[#222222] text-[#FF7900] rounded-[10px] px-2.5 py-1 text-xs outline-none focus:border-[#FF7900]"
        >
          {screens.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Realistic Smartphone Shell (380px x 780px viewport) */}
      <div className="relative w-[380px] h-[780px] bg-[#080808] border-4 border-[#1B1B1B] rounded-[48px] shadow-[0_25px_60px_-15px_rgba(255,121,0,0.2)] overflow-hidden flex flex-col">
        {/* Dynamic Island / Camera Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#080808] rounded-full z-40 flex items-center justify-between px-3 border border-[#222222]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#111111] border border-[#333333]" />
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7900]" />
          </div>
        </div>

        {/* Mobile Status Bar */}
        <div className="flex items-center justify-between px-7 pt-3.5 pb-2 text-[11px] font-mono-num text-[#A1A1AA] z-30 select-none">
          <span>09:41</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#FF7900] font-semibold tracking-wider">Airtel 5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1">
              <span className="text-[10px]">94%</span>
              <Battery className="w-3.5 h-3.5 text-[#35C98A]" />
            </div>
          </div>
        </div>

        {/* Dynamic Screen Viewport */}
        <div className="flex-1 overflow-y-auto px-4 py-2 text-white flex flex-col justify-between">
          {/* SCREEN 1: SPLASH */}
          {currentScreen === 'splash' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
              <RubyAIOrb state="idle" size="md" />
              <h1 className="text-2xl font-bold font-display text-white tracking-wide">RUBY AI</h1>
              <p className="text-xs text-[#FF9D32] font-medium">Your Personal Intelligence. Your Voice. Your Control.</p>
              <RubyPrimaryButton onClick={() => setCurrentScreen('home')} className="mt-6">
                Enter Assistant
              </RubyPrimaryButton>
            </div>
          )}

          {/* SCREEN 2: 4-STAGE ONBOARDING */}
          {currentScreen === 'onboarding' && (
            <div className="flex-1 flex flex-col justify-between p-3 space-y-3">
              <div className="flex items-center justify-between border-b border-[#222222] pb-2 text-xs">
                <span className="text-[#FF7900] font-bold font-mono-num">STAGE {onboardingStage} OF 4</span>
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="text-[#A1A1AA] hover:text-white text-[11px]"
                >
                  Skip Setup
                </button>
              </div>

              {onboardingStage === 1 && (
                <div className="space-y-3 text-center my-auto">
                  <RubyAIOrb state="idle" size="sm" />
                  <h2 className="text-lg font-bold font-display text-white">Meet RUBY AI</h2>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    Your personal intelligence ecosystem connecting your Android smartphone and Windows 11 computer with voice-first controls.
                  </p>
                </div>
              )}

              {onboardingStage === 2 && (
                <div className="space-y-3 my-auto">
                  <div className="text-center">
                    <h2 className="text-base font-bold text-white">Choose Primary Language</h2>
                    <p className="text-xs text-[#A1A1AA]">RUBY seamlessly understands and speaks:</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { id: 'en', title: 'English (Indian Accent)', sub: 'Default' },
                      { id: 'ta', title: 'தமிழ் (Tamil)', sub: 'Tanglish code-switching' },
                      { id: 'hi', title: 'हिंदी (Hindi)', sub: 'Hinglish code-switching' },
                    ].map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setSelectedLanguage(l.id as RubyLanguage)}
                        className={`w-full p-3 rounded-[14px] border text-left flex items-center justify-between text-xs transition ${
                          selectedLanguage === l.id
                            ? 'bg-[#111111] border-[#FF7900] text-[#FF7900]'
                            : 'bg-[#080808] border-[#222222] text-[#A1A1AA]'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-white">{l.title}</div>
                          <div className="text-[10px] text-[#A1A1AA]">{l.sub}</div>
                        </div>
                        {selectedLanguage === l.id && <CheckCircle className="w-4 h-4 text-[#FF7900]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {onboardingStage === 3 && (
                <div className="space-y-3 my-auto">
                  <div className="text-center">
                    <h2 className="text-base font-bold text-white">Configure Voice & Wake Word</h2>
                    <p className="text-xs text-[#A1A1AA]">Configure hands-free voice triggers:</p>
                  </div>
                  <div className="p-3 bg-[#111111] border border-[#222222] rounded-[14px] space-y-2 text-xs">
                    <div className="text-[#FF9D32] font-semibold">Active Wake Words:</div>
                    <div className="flex flex-wrap gap-1.5 text-[11px] font-mono-num">
                      <span className="px-2 py-0.5 bg-[#1B1B1B] rounded border border-[#2A2A2A]">"Hey Ruby"</span>
                      <span className="px-2 py-0.5 bg-[#1B1B1B] rounded border border-[#2A2A2A]">"Ruby Activate"</span>
                      <span className="px-2 py-0.5 bg-[#1B1B1B] rounded border border-[#2A2A2A]">"ரூபி"</span>
                      <span className="px-2 py-0.5 bg-[#1B1B1B] rounded border border-[#2A2A2A]">"रूबी"</span>
                    </div>
                  </div>
                </div>
              )}

              {onboardingStage === 4 && (
                <div className="space-y-3 text-center my-auto">
                  <Shield className="w-10 h-10 text-[#35C98A] mx-auto" />
                  <h2 className="text-base font-bold text-white">Connect Windows 11 Brain</h2>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    Pairing token generated. Mutual TLS and HMAC-SHA256 handshake established.
                  </p>
                  <div className="p-2.5 bg-[#111111] border border-[#222222] rounded-[14px] text-xs font-mono-num text-[#FF7900]">
                    TOKEN: RUBY-PAIR-9041-SECURE
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                {onboardingStage > 1 ? (
                  <button
                    onClick={() => setOnboardingStage((p) => (p - 1) as any)}
                    className="px-4 py-2 text-xs text-[#A1A1AA] hover:text-white"
                  >
                    Back
                  </button>
                ) : <div />}

                {onboardingStage < 4 ? (
                  <RubyPrimaryButton
                    onClick={() => setOnboardingStage((p) => (p + 1) as any)}
                  >
                    Next Stage
                  </RubyPrimaryButton>
                ) : (
                  <RubyPrimaryButton onClick={() => setCurrentScreen('home')}>
                    Finish Setup
                  </RubyPrimaryButton>
                )}
              </div>
            </div>
          )}

          {/* SCREEN 3: HOME DASHBOARD (Centered 3D Orb) */}
          {currentScreen === 'home' && (
            <div className="flex-1 flex flex-col justify-between space-y-3">
              {/* Top Header */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h2 className="text-base font-bold font-display text-white">RUBY AI</h2>
                  <p className="text-[11px] text-[#FF9D32]">
                    {selectedLanguage === 'ta' ? 'வணக்கம், சுதீந்திரா' : selectedLanguage === 'hi' ? 'नमस्ते, सुधींद्र' : 'Good Morning, Sudeendra'}
                  </p>
                </div>
                <button
                  onClick={() => setIsRidingModeActive(!isRidingModeActive)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-[10px] flex items-center gap-1.5 transition ${
                    isRidingModeActive
                      ? 'bg-[#FF7900] text-black shadow-[0_0_10px_#ff7900]'
                      : 'bg-[#111111] border border-[#222222] text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>{isRidingModeActive ? 'Riding ON' : 'Riding OFF'}</span>
                </button>
              </div>

              {/* Three.js 3D Procedural AI Orb Centerpiece */}
              <div className="my-auto py-1 flex flex-col items-center">
                <RubyAIOrb
                  state={currentOrbState}
                  size="md"
                  audioLevel={isListening || isSpeaking ? 0.75 : 0}
                  statusLabel={
                    isListening
                      ? 'Listening to your command...'
                      : isSpeaking
                      ? 'Speaking response...'
                      : isRidingModeActive
                      ? 'Motorcycle Riding Mode Active'
                      : 'Say "Hey Ruby" or tap below'
                  }
                  onClick={onVoiceTrigger}
                />
                {lastSpokenText && (
                  <div className="mt-2 p-2 bg-[#111111] border border-[#FF7900]/30 rounded-[14px] text-center w-full max-w-[280px]">
                    <p className="text-xs text-[#FFC15A] font-medium truncate">"{lastSpokenText}"</p>
                  </div>
                )}
              </div>

              {/* Quick Action Matrix */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => onSimulateIncomingCall('Amma', '+91 98450 11223')}
                  className="p-3 bg-[#111111] border border-[#222222] hover:border-[#FF7900]/40 rounded-[14px] flex items-center gap-2.5 text-left transition"
                >
                  <PhoneCall className="w-4 h-4 text-[#35C98A] shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Call Amma</div>
                    <div className="text-[10px] text-[#A1A1AA]">Airtel SIM 1</div>
                  </div>
                </button>

                <button
                  onClick={() => onSimulateIncomingCall('Rohan (Teammate)', '+91 98765 43210')}
                  className="p-3 bg-[#111111] border border-[#222222] hover:border-[#FF7900]/40 rounded-[14px] flex items-center gap-2.5 text-left transition"
                >
                  <Users className="w-4 h-4 text-[#FF7900] shrink-0" />
                  <div>
                    <div className="font-semibold text-white">AI Screening</div>
                    <div className="text-[10px] text-[#A1A1AA]">Test Message</div>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentScreen('riding_mode')}
                  className="p-3 bg-[#111111] border border-[#222222] hover:border-[#FF7900]/40 rounded-[14px] flex items-center gap-2.5 text-left transition"
                >
                  <Bike className="w-4 h-4 text-[#FFC15A] shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Riding HUD</div>
                    <div className="text-[10px] text-[#A1A1AA]">Voice-first mode</div>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentScreen('history')}
                  className="p-3 bg-[#111111] border border-[#222222] hover:border-[#FF7900]/40 rounded-[14px] flex items-center gap-2.5 text-left transition"
                >
                  <MessageSquare className="w-4 h-4 text-[#54A6FF] shrink-0" />
                  <div>
                    <div className="font-semibold text-white">AI Chat</div>
                    <div className="text-[10px] text-[#A1A1AA]">Conversations</div>
                  </div>
                </button>
              </div>

              {/* Push To Talk Tap Zone */}
              <RubyPrimaryButton
                onClick={onVoiceTrigger}
                className="w-full py-3.5"
                icon={Mic}
              >
                {isListening ? 'Tap to Stop Listening' : 'Push to Talk (Voice Assistant)'}
              </RubyPrimaryButton>
            </div>
          )}

          {/* SCREEN 5: AI CHAT INTERFACE */}
          {currentScreen === 'history' && (
            <div className="flex-1 flex flex-col justify-between py-2 space-y-3">
              <div className="flex items-center justify-between border-b border-[#222222] pb-2">
                <div>
                  <h3 className="text-base font-bold text-white">AI Conversations</h3>
                  <p className="text-[11px] text-[#A1A1AA]">Local & Live Cloud Assistant</p>
                </div>
                <button
                  onClick={() => setChatMessages([])}
                  className="text-[11px] text-[#FF4545] hover:underline"
                >
                  Clear
                </button>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[460px]">
                {chatMessages.map((msg, idx) => (
                  <RubyMessageBubble
                    key={idx}
                    sender={msg.sender}
                    text={msg.text}
                    timestamp={msg.time}
                    onReplay={() => {}}
                  />
                ))}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendChatMessage} className="flex items-center gap-2 pt-2 border-t border-[#222222]">
                <input
                  type="text"
                  placeholder="Ask RUBY in English, தமிழ், or हिंदी..."
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  className="flex-1 bg-[#111111] border border-[#222222] rounded-[14px] px-3 py-2 text-xs text-white placeholder-[#A1A1AA] outline-none focus:border-[#FF7900]"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-[#FF7900] hover:bg-[#FF9D32] text-[#080808] rounded-[14px] transition active:scale-95 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* SCREEN 4: VOICE ASSISTANT 3D FULLSCREEN */}
          {currentScreen === 'voice' && (
            <div className="flex-1 flex flex-col justify-between items-center text-center py-4">
              <div className="w-full text-left">
                <span className="text-[10px] font-mono-num text-[#FF7900] uppercase tracking-widest">3D Voice Interaction</span>
                <h3 className="text-lg font-bold text-white">Three.js Faceted Ruby Gem</h3>
              </div>
              <RubyAIOrb state={currentOrbState} size="lg" audioLevel={0.8} />
              <div className="w-full bg-[#111111] border border-[#FF7900]/30 p-3.5 rounded-[18px] text-left space-y-1">
                <span className="text-[10px] font-mono-num text-[#A1A1AA]">Live Transcription:</span>
                <p className="text-xs text-white font-medium">
                  {lastSpokenText || 'Say "Ruby, call Amma" or "ரூபி, கால் பண்ணு"...'}
                </p>
              </div>
              <RubyPrimaryButton onClick={onVoiceTrigger} className="w-full py-3" icon={Mic}>
                {isListening ? 'Stop Listening' : 'Speak to Ruby'}
              </RubyPrimaryButton>
            </div>
          )}

          {/* SCREEN 6: INCOMING CALL */}
          {currentScreen === 'incoming_call' && (
            <div className="flex-1 flex flex-col justify-between py-6 items-center text-center">
              <div className="space-y-1">
                <span className="text-[10px] font-mono-num text-[#FF7900] uppercase tracking-widest">
                  Airtel India SIM 1 • Telecom Framework
                </span>
                <h2 className="text-2xl font-bold text-white mt-2">
                  {activeCall ? activeCall.callerName : 'Amma'}
                </h2>
                <p className="text-xs font-mono-num text-[#A1A1AA]">
                  {activeCall ? activeCall.callerNumber : '+91 98450 11223'}
                </p>
                <div className="inline-block mt-2 px-2.5 py-0.5 bg-[#FF7900]/10 border border-[#FF7900]/40 text-[#FF9D32] text-[10px] rounded-full">
                  Verified Contact • Emergency Whitelist
                </div>
              </div>

              {/* Central Three.js Calling Ruby Gem */}
              <RubyAIOrb state="calling" size="md" />

              {/* Action Buttons: Manual Answer, AI Screening, Reject */}
              <div className="w-full space-y-2.5">
                <RubyCallActionButton
                  type="delegate"
                  label="Delegate to RUBY AI Assistant"
                  icon={Radio}
                  onClick={() => onAnswerCall('AI_ASSISTANT')}
                />
                <div className="grid grid-cols-2 gap-3">
                  <RubyCallActionButton
                    type="answer"
                    label="Answer"
                    icon={Phone}
                    onClick={() => onAnswerCall('MANUAL')}
                  />
                  <RubyCallActionButton
                    type="reject"
                    label="Decline"
                    icon={PhoneOff}
                    onClick={onEndCall}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 7: ACTIVE CALL */}
          {currentScreen === 'active_call' && (
            <div className="flex-1 flex flex-col justify-between py-6">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF7900]/10 border border-[#FF7900]/30 text-[#FF9D32] text-xs rounded-full font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#FF7900]" />
                  <span>RUBY AI Call Answering Active</span>
                </div>
                <h3 className="text-xl font-bold text-white mt-3">
                  {activeCall?.callerName || 'Rohan (Teammate)'}
                </h3>
                <p className="text-xs font-mono-num text-[#A1A1AA]">00:42 • Airtel India Carrier Call</p>
              </div>

              <div className="bg-[#111111] border border-[#222222] rounded-[18px] p-4 text-left space-y-3">
                <div className="text-[11px] font-semibold text-[#FF9D32] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>AI Transparency Disclosure Active</span>
                </div>
                <div className="text-xs text-[#A1A1AA] space-y-2 font-mono-num text-[11px] bg-[#080808] p-3 rounded-lg border border-[#222222]">
                  <p className="text-[#FFC15A]">
                    <strong>RUBY:</strong> "Hello! I am RUBY, Sudeendra's AI assistant. He is currently riding. May I take a message?"
                  </p>
                  <p className="text-white">
                    <strong>Caller:</strong> "Hey, please tell him the project submission deadline is tomorrow at 5 PM."
                  </p>
                  <p className="text-[#FFC15A]">
                    <strong>RUBY:</strong> "Message recorded. I will inform him once he safely parks. Thank you!"
                  </p>
                </div>
              </div>

              <RubyCallActionButton
                type="reject"
                label="End Call Session"
                icon={PhoneOff}
                onClick={onEndCall}
              />
            </div>
          )}

          {/* SCREEN 9: MOTORCYCLE RIDING MODE HUD */}
          {currentScreen === 'riding_mode' && (
            <div className="flex-1 flex flex-col justify-between py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono-num text-[#FF7900] uppercase tracking-widest">Motorcycle Mode</span>
                  <h3 className="text-lg font-bold text-white">Riding HUD Active</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono-num text-[#35C98A]">
                  <Radio className="w-3.5 h-3.5" />
                  <span>Helmet Audio</span>
                </div>
              </div>

              {/* Big High-Contrast Minimalist Speedometer */}
              <div className="flex flex-col items-center justify-center py-6 bg-[#111111] border-2 border-[#FF7900]/50 rounded-[24px]">
                <span className="text-5xl font-extrabold font-mono-num text-white tracking-tighter">
                  {isRidingModeActive ? '48' : '00'}
                </span>
                <span className="text-xs font-mono-num text-[#FF7900] mt-1 uppercase">km/h • Cruise</span>
                <div className="mt-3 text-[11px] text-[#A1A1AA] font-medium">
                  Call Policy: <strong className="text-[#FF9D32]">AI Assistant + Emergency Whitelist</strong>
                </div>
              </div>

              <div className="p-3 bg-[#111111] border border-[#222222] rounded-[14px] space-y-2 text-xs">
                <span className="font-semibold text-white">Emergency Callers (Ring Through):</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-[#1B1B1B] text-[#35C98A] rounded text-[11px] font-mono-num">
                    Amma (+91 98450 11223)
                  </span>
                  <span className="px-2 py-0.5 bg-[#1B1B1B] text-[#35C98A] rounded text-[11px] font-mono-num">
                    Appa (+91 98450 22334)
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsRidingModeActive(!isRidingModeActive)}
                className={`w-full py-3.5 rounded-[14px] font-bold text-xs flex items-center justify-center gap-2 transition ${
                  isRidingModeActive
                    ? 'bg-[#FF4545] hover:bg-[#e63e3e] text-white'
                    : 'bg-[#FF7900] hover:bg-[#FF9D32] text-black'
                }`}
              >
                <Bike className="w-4 h-4" />
                <span>{isRidingModeActive ? 'Exit Riding Mode' : 'Activate Riding Mode'}</span>
              </button>
            </div>
          )}

          {/* SCREEN 10: CONTACTS */}
          {currentScreen === 'contacts' && (
            <div className="flex-1 flex flex-col justify-between py-2 space-y-3">
              <div>
                <h3 className="text-base font-bold text-white">Contacts & Aliases</h3>
                <p className="text-[11px] text-[#A1A1AA]">AES-256 Encrypted Local Store</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[360px]">
                {contacts.map((c) => (
                  <div key={c.id} className="p-2.5 bg-[#111111] border border-[#222222] rounded-[14px] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span>{c.name}</span>
                        {c.isEmergency && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-rose-950 text-rose-400 border border-rose-800/50 rounded font-mono-num">
                            EMERGENCY
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono-num text-[#A1A1AA]">{c.phone}</div>
                      <div className="text-[10px] text-[#FF9D32]">Aliases: {c.aliases.join(', ')}</div>
                    </div>
                    <button
                      onClick={() => onSimulateIncomingCall(c.name, c.phone)}
                      className="p-2 bg-[#1B1B1B] hover:bg-[#FF7900] hover:text-black rounded-lg transition"
                      title="Trigger Call"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Contact Form */}
              <form onSubmit={handleCreateContact} className="p-2.5 bg-[#111111] border border-[#222222] rounded-[14px] space-y-2">
                <span className="text-[11px] font-semibold text-[#FF7900]">Quick Add Contact</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="bg-[#080808] border border-[#222222] rounded px-2 py-1 text-white outline-none focus:border-[#FF7900]"
                  />
                  <input
                    type="text"
                    placeholder="+91 Phone"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="bg-[#080808] border border-[#222222] rounded px-2 py-1 text-white outline-none focus:border-[#FF7900]"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-1.5 text-[#A1A1AA] text-[11px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newContactIsEmergency}
                      onChange={(e) => setNewContactIsEmergency(e.target.checked)}
                      className="accent-[#FF7900]"
                    />
                    <span>Emergency Bypass</span>
                  </label>
                  <RubyPrimaryButton type="submit" className="px-3 py-1 text-xs">
                    Save
                  </RubyPrimaryButton>
                </div>
              </form>
            </div>
          )}

          {/* SCREEN 14: LANGUAGE SETTINGS */}
          {currentScreen === 'language' && (
            <div className="flex-1 flex flex-col justify-between py-4 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Multilingual Voice Engine</h3>
                <p className="text-xs text-[#A1A1AA]">Select conversational voice & dialect</p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'en', title: 'English (Indian Accent)', sample: '"Hello Ruby, call my friend."' },
                  { id: 'ta', title: 'தமிழ் (Tamil & Tanglish)', sample: '"ரூபி, என் நண்பருக்கு போன் பண்ணு."' },
                  { id: 'hi', title: 'हिंदी (Hindi & Hinglish)', sample: '"रूबी, मेरे दोस्त को फोन करो।"' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setSelectedLanguage(l.id as RubyLanguage)}
                    className={`w-full p-3.5 rounded-[14px] border text-left transition flex items-center justify-between ${
                      selectedLanguage === l.id
                        ? 'bg-[#111111] border-[#FF7900] shadow-[0_0_15px_rgba(255,121,0,0.2)]'
                        : 'bg-[#080808] border-[#222222] hover:border-[#333333]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white text-xs">{l.title}</div>
                      <div className="text-[11px] text-[#FF9D32] font-mono-num mt-1">{l.sample}</div>
                    </div>
                    {selectedLanguage === l.id && <CheckCircle className="w-4 h-4 text-[#FF7900] shrink-0" />}
                  </button>
                ))}
              </div>

              <RubyPrimaryButton onClick={() => setCurrentScreen('home')} className="w-full py-3">
                Apply Language Preferences
              </RubyPrimaryButton>
            </div>
          )}

          {/* DEFAULT CATCH-ALL FOR REMAINING SCREENS */}
          {!['splash', 'onboarding', 'home', 'voice', 'history', 'incoming_call', 'active_call', 'riding_mode', 'contacts', 'language'].includes(currentScreen) && (
            <div className="flex-1 flex flex-col justify-between py-6 text-center space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono-num text-[#FF7900] uppercase tracking-widest">RIIS Screen</span>
                <h3 className="text-lg font-bold text-white capitalize">{currentScreen.replace('_', ' ')}</h3>
              </div>
              <div className="p-6 bg-[#111111] border border-[#222222] rounded-[18px] text-xs text-[#A1A1AA] space-y-2">
                <Shield className="w-8 h-8 text-[#FF7900] mx-auto" />
                <p className="font-semibold text-white">Module Initialized & Verified</p>
                <p className="text-[11px] text-[#A1A1AA]">
                  Wired with Kotlin Jetpack Compose and local-first memory repository.
                </p>
              </div>
              <RubyPrimaryButton onClick={() => setCurrentScreen('home')} className="w-full py-3">
                Return to Dashboard
              </RubyPrimaryButton>
            </div>
          )}
        </div>

        {/* Mobile Navigation Tab Bar (Bottom 4 destinations) */}
        <div className="h-14 bg-[#080808] border-t border-[#222222] px-6 flex items-center justify-between text-[#A1A1AA] z-30">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center gap-1 transition ${
              currentScreen === 'home' ? 'text-[#FF7900]' : 'hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button
            onClick={() => setCurrentScreen('history')}
            className={`flex flex-col items-center gap-1 transition ${
              currentScreen === 'history' ? 'text-[#FF7900]' : 'hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-[10px] font-medium">Chat</span>
          </button>
          <button
            onClick={() => setCurrentScreen('riding_mode')}
            className={`flex flex-col items-center gap-1 transition ${
              currentScreen === 'riding_mode' ? 'text-[#FF7900]' : 'hover:text-white'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span className="text-[10px] font-medium">Riding</span>
          </button>
          <button
            onClick={() => setCurrentScreen('contacts')}
            className={`flex flex-col items-center gap-1 transition ${
              currentScreen === 'contacts' ? 'text-[#FF7900]' : 'hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-medium">Contacts</span>
          </button>
        </div>
      </div>
    </div>
  );
};
