import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Smartphone,
  Mic,
  Shield,
  Layers,
  Phone,
  Radio,
  FileCode,
  Download,
  CheckCircle,
  AlertTriangle,
  Bike,
  Sparkles
} from 'lucide-react';
import { TopBar } from './components/TopBar';
import { AndroidSimulator } from './components/AndroidSimulator';
import { WindowsBrainConsole } from './components/WindowsBrainConsole';
import { CrossDeviceSyncBridge } from './components/CrossDeviceSyncBridge';
import { CodebaseExplorer } from './components/CodebaseExplorer';
import { PackageReleaseModal } from './components/PackageReleaseModal';
import { Ruby3DWorkstation } from './components/Ruby3DWorkstation';
import { RubyDiamondCore } from './components/RubyDiamondCore';
import { CallLogSummaryCard } from './components/CallLogSummaryCard';
import { voiceEngine } from './services/voiceEngine';
import { brainSimulator } from './services/mockBrain';
import {
  RubyLanguage,
  ScreenId,
  Contact,
  CallSession,
  SystemTelemetry,
  AuditLogItem
} from './types/ruby';

export default function App() {
  const [activeTab, setActiveTab] = useState<'core' | 'ecosystem' | 'telephony' | 'riding' | 'memory' | 'source'>('core');
  const [selectedLanguage, setSelectedLanguage] = useState<RubyLanguage>('en');
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState('');
  const [contacts, setContacts] = useState<Contact[]>(brainSimulator.getContacts());
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [isRidingModeActive, setIsRidingModeActive] = useState(false);
  const [telemetry, setTelemetry] = useState<SystemTelemetry>(brainSimulator.getTelemetry());
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const [lastCommandResult, setLastCommandResult] = useState<any>(null);

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'log-1',
      timestamp: '09:41:02',
      category: 'SECURITY',
      description: 'HMAC-SHA256 device pairing token validated for Android client',
      severity: 'INFO',
    },
    {
      id: 'log-2',
      timestamp: '09:39:15',
      category: 'SYSTEM',
      description: 'C Native audio ringbuffer allocated (16kHz PCM / VAD 0.015f)',
      severity: 'INFO',
    },
    {
      id: 'log-3',
      timestamp: '09:35:40',
      category: 'TELEPHONY',
      description: 'Airtel India Telecom carrier screening rule loaded: InCallService active',
      severity: 'INFO',
    },
  ]);

  // Telemetry periodic polling simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(brainSimulator.getTelemetry());
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Voice Engine Callbacks
  useEffect(() => {
    voiceEngine.setCallbacks(
      (transcript, isFinal) => {
        setLastSpokenText(transcript);
        if (isFinal || transcript.length > 8) {
          handleExecuteVoiceCommand(transcript);
        }
      },
      (listening) => {
        setIsListening(listening);
      }
    );
  }, [selectedLanguage]);

  const handleVoiceTrigger = () => {
    if (isListening) {
      voiceEngine.stopListening();
    } else {
      const started = voiceEngine.startListening(selectedLanguage);
      if (!started) {
        // Fallback for demo environments: simulate voice utterance
        simulateVoiceUtterance();
      }
    }
  };

  const simulateVoiceUtterance = () => {
    setIsListening(true);
    setLastSpokenText('Listening...');
    setTimeout(() => {
      const demoQueries = {
        en: 'Ruby, call Amma',
        ta: 'ரூபி, அம்மாக்கு கால் பண்ணு',
        hi: 'रूबी, राइडिंग मोड चालू करो',
      };
      const query = demoQueries[selectedLanguage] || 'Ruby, call Amma';
      setLastSpokenText(query);
      setIsListening(false);
      handleExecuteVoiceCommand(query);
    }, 1500);
  };

  const handleExecuteVoiceCommand = (cmdText: string) => {
    const result = brainSimulator.processCommand(cmdText, selectedLanguage);
    setLastCommandResult(result);

    // Add to audit logs
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      category: 'VOICE',
      description: `Command: "${cmdText}" -> Intent: ${result.intent} (${result.status})`,
      severity: result.status === 'security_blocked' ? 'ALERT' : 'INFO',
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 40)]);

    // Trigger Android UI state changes based on intent
    if (result.intent === 'call_contact') {
      const contact = result.payload?.contact || contacts[0];
      handleSimulateIncomingCall(contact.name, contact.phone);
    } else if (result.intent === 'activate_riding_mode') {
      setIsRidingModeActive(true);
      setCurrentScreen('riding_mode');
    } else if (result.intent === 'deactivate_riding_mode') {
      setIsRidingModeActive(false);
      setCurrentScreen('home');
    } else if (result.intent === 'check_system_status') {
      setActiveTab('ecosystem');
    } else if (result.intent === 'show_memory') {
      setCurrentScreen('contacts');
    }

    // Speak audio feedback response
    setIsSpeaking(true);
    voiceEngine.speak(result.speech, selectedLanguage, () => {
      setIsSpeaking(false);
    });
  };

  const handleSimulateIncomingCall = (callerName: string, phoneNumber: string) => {
    const newCall: CallSession = {
      id: `call-${Date.now()}`,
      callerNumber: phoneNumber,
      callerName: callerName,
      carrier: 'Airtel India',
      status: 'RINGING',
      startTime: new Date().toISOString(),
      durationSeconds: 0,
    };
    setActiveCall(newCall);
    setCurrentScreen('incoming_call');

    // Add audit log
    const callLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      category: 'TELEPHONY',
      description: `Incoming call from ${callerName} (${phoneNumber}) on Airtel India SIM 1`,
      severity: 'INFO',
    };
    setAuditLogs((prev) => [callLog, ...prev.slice(0, 40)]);

    // Add to brainSimulator call records so summary dynamically updates
    brainSimulator.addCallRecord({
      id: `call-rec-${Date.now()}`,
      callerName,
      callerNumber: phoneNumber,
      type: 'INCOMING',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      durationSeconds: 0,
      carrier: 'Airtel India SIM 1',
      summaryNote: `Carrier incoming call from ${callerName} received on Airtel SIM. InCallService screening active.`,
      urgency: callerName.toLowerCase().includes('amma') || callerName.toLowerCase().includes('doctor') ? 'HIGH' : 'NORMAL',
      actionTaken: 'Telecom InCallService active',
    });
  };

  const handleAnswerCall = (mode: 'MANUAL' | 'AI_ASSISTANT') => {
    if (!activeCall) return;

    if (mode === 'AI_ASSISTANT') {
      setActiveCall({
        ...activeCall,
        status: 'AI_SCREENING',
      });
      setCurrentScreen('active_call');

      // AI Speaks formal disclosure greeting
      const greetings = {
        en: `Hello! I am RUBY, Sudeendra's AI assistant. He is currently unavailable. May I know who is calling and what this call is regarding?`,
        ta: `வணக்கம்! நான் ரூபி, சுதீந்திராவின் செயற்கை நுண்ணறிவு உதவியாளர். அவர் தற்போது பேச இயலாத நிலையில் உள்ளார். நீங்கள் யார் என்று தெரிந்து கொள்ளலாமா?`,
        hi: `नमस्ते! मैं रूबी हूँ, सुधींद्र की एआई सहायक। वे इस समय उपलब्ध नहीं हैं। क्या मैं जान सकती हूँ कि आप कौन बोल रहे हैं?`,
      };
      const textToSpeak = greetings[selectedLanguage] || greetings.en;

      setIsSpeaking(true);
      voiceEngine.speak(textToSpeak, selectedLanguage, () => {
        setIsSpeaking(false);
      });
    } else {
      setActiveCall({
        ...activeCall,
        status: 'CONNECTED',
      });
      setCurrentScreen('active_call');
    }
  };

  const handleEndCall = () => {
    setActiveCall(null);
    setCurrentScreen('home');
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col font-sans selection:bg-[#FF7900] selection:text-black">
      {/* Universal Top Bar */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onVoiceTrigger={handleVoiceTrigger}
        isListening={isListening}
        isSpeaking={isSpeaking}
        selectedLanguage={selectedLanguage}
      />

      {/* VIEW 1: HERO 3D DIAMOND CORE & ATOMIC ORBITAL SYSTEM (LAUNCH VISUAL) */}
      {activeTab === 'core' && (
        <div className="flex-1 w-full relative">
          <RubyDiamondCore
            onVoiceTrigger={handleVoiceTrigger}
            isListening={isListening}
            isSpeaking={isSpeaking}
            lastSpokenText={lastSpokenText}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            onOpenModule={(mod) => setActiveTab(mod)}
          />
        </div>
      )}

      {/* VIEW 2: COMPANION ECOSYSTEM MODULES */}
      {activeTab !== 'core' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Sub-header Context Banner with User Profile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#111111] border border-[#222222] rounded-[24px]">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-[#FF7900]/40 shrink-0">
                <img
                  src="/src/assets/images/sudeendra_user_avatar_1794431147035.jpg"
                  alt="Sudeendra"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold text-white font-display">Sudeendra's Personal Workspace</h1>
                  <span className="text-[10px] px-2 py-0.5 bg-[#FF7900]/10 text-[#FF9D32] border border-[#FF7900]/30 rounded font-mono-num">
                    Airtel SIM Active
                  </span>
                </div>
                <p className="text-xs text-[#A1A1AA]">
                  Connected to Windows 11 AI Brain (:8443) • Android Companion Ready
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Language Selector */}
              <div className="flex items-center p-1 bg-[#1B1B1B] border border-[#2A2A2A] rounded-[14px] text-xs">
                <button
                  onClick={() => setSelectedLanguage('en')}
                  className={`px-3 py-1 rounded-[10px] font-medium transition ${
                    selectedLanguage === 'en' ? 'bg-[#FF7900] text-black font-bold' : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setSelectedLanguage('ta')}
                  className={`px-3 py-1 rounded-[10px] font-medium transition ${
                    selectedLanguage === 'ta' ? 'bg-[#FF7900] text-black font-bold' : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  தமிழ்
                </button>
                <button
                  onClick={() => setSelectedLanguage('hi')}
                  className={`px-3 py-1 rounded-[10px] font-medium transition ${
                    selectedLanguage === 'hi' ? 'bg-[#FF7900] text-black font-bold' : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  हिंदी
                </button>
              </div>

              <button
                onClick={() => setIsReleaseModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#1B1B1B] hover:bg-[#252525] border border-[#2A2A2A] text-[#FF9D32] text-xs font-semibold rounded-[14px] flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Packages</span>
              </button>
            </div>
          </div>

        {/* TAB 1: DUAL ECOSYSTEM */}
        {activeTab === 'ecosystem' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Android Smartphone Simulator (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full mb-3 flex items-center justify-between text-xs text-slate-400 px-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <Smartphone className="w-4 h-4 text-orange-400" />
                    <span>Android Companion App</span>
                  </div>
                  <span className="font-mono-num text-[11px] text-emerald-400">Kotlin • Material 3</span>
                </div>
                <AndroidSimulator
                  currentScreen={currentScreen}
                  setCurrentScreen={setCurrentScreen}
                  contacts={contacts}
                  onAddContact={(c) => setContacts((prev) => [...prev, c])}
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                  onVoiceTrigger={handleVoiceTrigger}
                  activeCall={activeCall}
                  onAnswerCall={handleAnswerCall}
                  onEndCall={handleEndCall}
                  onSimulateIncomingCall={handleSimulateIncomingCall}
                  isRidingModeActive={isRidingModeActive}
                  setIsRidingModeActive={setIsRidingModeActive}
                  lastSpokenText={lastSpokenText}
                />
              </div>

              {/* Right Column: Windows 11 AI Brain Console (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <Monitor className="w-4 h-4 text-cyan-400" />
                    <span>Windows 11 AI Brain Controller</span>
                  </div>
                  <span className="font-mono-num text-[11px] text-cyan-400">Ruby 3.2 + C Systems</span>
                </div>

                <WindowsBrainConsole
                  telemetry={telemetry}
                  onExecuteCommand={handleExecuteVoiceCommand}
                  auditLogs={auditLogs}
                  lastCommandResult={lastCommandResult}
                />
              </div>
            </div>

            {/* Bottom Cross-Device Testbed Strip */}
            <CrossDeviceSyncBridge
              onSimulateIncomingCall={handleSimulateIncomingCall}
              isRidingModeActive={isRidingModeActive}
              setIsRidingModeActive={setIsRidingModeActive}
              connectedDevice="Samsung Galaxy / Airtel SIM 1"
            />
          </div>
        )}

        {/* TAB 2: TELEPHONY & SIM */}
        {activeTab === 'telephony' && (
          <div className="space-y-6">
            {/* Conversational Call Log Summary Card powered by Brain Simulator */}
            <CallLogSummaryCard
              selectedLanguage={selectedLanguage}
              onSimulateCall={handleSimulateIncomingCall}
            />

            <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white font-display">
                    Advanced Telephone Calling Subsystem (Airtel India Target)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Integrated directly with the user's existing carrier SIM. Zero extra SIM purchase required.
                  </p>
                </div>
                <div className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-mono-num">
                  InCallService Registered
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                  <span className="font-bold text-orange-400">A. Incoming Call Detection</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Leverages official Android Telecom framework and <code>CallScreeningService</code> to intercept carrier ringing events, match caller ID with local AES-256 Room DB, and display the custom RUBY in-call interface.
                  </p>
                </div>

                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                  <span className="font-bold text-orange-400">B. AI Call Answering with Disclosure</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    RUBY answers eligible calls politely, introduces herself ("I am RUBY, Sudeendra's AI assistant"), inquires about the caller's purpose, takes a message, and logs it directly into the local inbox without third-party leaks.
                  </p>
                </div>

                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                  <span className="font-bold text-orange-400">C. Outgoing SIM Dialing</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Allows natural commands like "Ruby, call Amma" or "ரூபி, என் நண்பருக்கு போன் பண்ணு", verifies the contact number, confirms critical calls, and dials through the native Airtel SIM slot.
                  </p>
                </div>
              </div>

              {/* Interactive Telephony Actions */}
              <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    handleSimulateIncomingCall('Amma', '+91 98450 11223');
                    setActiveTab('ecosystem');
                  }}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black text-xs font-bold rounded-xl transition"
                >
                  Simulate Call from Amma (Emergency Bypass)
                </button>
                <button
                  onClick={() => {
                    handleSimulateIncomingCall('Rohan (Teammate)', '+91 98765 43210');
                    setActiveTab('ecosystem');
                  }}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-xl border border-neutral-700 transition"
                >
                  Simulate Call from Rohan (AI Screening)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RIDING MODE */}
        {activeTab === 'riding' && (
          <div className="space-y-6">
            <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white font-display">
                    Dedicated Motorcycle Riding Mode
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Designed to eliminate phone handling and distraction while riding two-wheelers on Indian roads.
                  </p>
                </div>
                <button
                  onClick={() => setIsRidingModeActive(!isRidingModeActive)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isRidingModeActive ? 'bg-rose-600 text-white' : 'bg-orange-500 text-black'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  <span>{isRidingModeActive ? 'Deactivate Riding Mode' : 'Activate Riding Mode'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                  <span className="font-bold text-orange-400">Mode 1 — Normal Announce</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Announces caller name via Bluetooth helmet headset. Driver can answer via handlebar button or voice command ("Ruby, answer").
                  </p>
                </div>

                <div className="p-4 bg-neutral-900 border border-orange-500/40 rounded-xl space-y-2 bg-orange-950/20">
                  <span className="font-bold text-orange-400">Mode 2 — AI Assistant (Active)</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    RUBY answers the call, informs the caller that Sudeendra is riding, collects their message, and automatically sends an SMS confirmation.
                  </p>
                </div>

                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                  <span className="font-bold text-orange-400">Mode 3 — Emergency Whitelist</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Calls from designated contacts (Amma, Appa, Doctor) ring through immediately with high-priority audio chime and caller announcement.
                  </p>
                </div>
              </div>

              {/* Safety Regulations Compliance Notice */}
              <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl flex items-start gap-3 text-xs text-slate-400">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200">Road Safety Mandate:</strong> RUBY AI strictly complies with local motor vehicle safety laws. Never encourages phone screen interactions while in motion; all operations are strictly voice-first with single-word speech controls.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MEMORY & SECURITY */}
        {activeTab === 'memory' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Memory Vault */}
              <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white font-display">Local-First Encrypted Memory</h3>
                  <span className="text-[10px] font-mono-num px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-orange-400 rounded">
                    AES-256-GCM
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Separates temporary conversational dialog context from permanent verified personal memory (contacts, relations, routines).
                </p>

                <div className="space-y-2 text-xs">
                  {contacts.map((c) => (
                    <div key={c.id} className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-200 flex items-center gap-2">
                          <span>{c.name}</span>
                          <span className="text-[10px] text-slate-400">({c.relationship})</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono-num">{c.phone}</div>
                        <div className="text-[10px] text-orange-400 mt-0.5">Aliases: {c.aliases.join(', ')}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {c.isEmergency && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-rose-950 text-rose-400 border border-rose-800 rounded font-mono-num">
                            EMERGENCY
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security & Threat Mitigation Plan */}
              <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white font-display">Security Plan & Guardrails</h3>
                  <span className="text-[10px] font-mono-num px-2 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded">
                    Strict Compliant
                  </span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200">Zero Python Enforcement:</strong>
                      <p className="text-[11px] text-slate-400 mt-0.5">Windows brain is 100% Ruby 3.x and native C99. Android is native Kotlin.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200">Zero Arbitrary Terminal Execution:</strong>
                      <p className="text-[11px] text-slate-400 mt-0.5">Execution engine relies strictly on pre-approved allowlists in <code>security.rb</code>.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200">No Secret Audio Recording:</strong>
                      <p className="text-[11px] text-slate-400 mt-0.5">Transparent foreground indicators active whenever microphone or telephony screening operates.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SOURCE & RELEASE */}
        {activeTab === 'source' && (
          <div className="space-y-6">
            <CodebaseExplorer />
          </div>
        )}
      </main>
      )}

      {/* Package Release Modal */}
      <PackageReleaseModal isOpen={isReleaseModalOpen} onClose={() => setIsReleaseModalOpen(false)} />

      {/* Minimal Footer (only shown in companion module views) */}
      {activeTab !== 'core' && (
        <footer className="mt-auto border-t border-neutral-800/80 px-6 py-4 bg-black/95 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-display">RUBY AI</span>
            <span>·</span>
            <span>Your Personal Intelligence. Your Voice. Your Control.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono-num text-slate-400">
            <span>Windows 11 (Ruby + C)</span>
            <span>·</span>
            <span>Android 10+ (Kotlin)</span>
            <span>·</span>
            <span>Airtel India SIM</span>
          </div>
        </footer>
      )}
    </div>
  );
}
