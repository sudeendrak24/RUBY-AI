import React, { useState, useEffect } from 'react';
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Shield,
  ShieldAlert,
  Bot,
  Bike,
  Volume2,
  VolumeX,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Radio
} from 'lucide-react';
import { brainSimulator, CallRecord, CallLogSummary } from '../services/mockBrain';
import { voiceEngine } from '../services/voiceEngine';
import { RubyLanguage } from '../types/ruby';

interface CallLogSummaryCardProps {
  selectedLanguage?: RubyLanguage;
  onSimulateCall?: (callerName: string, phoneNumber: string) => void;
}

export const CallLogSummaryCard: React.FC<CallLogSummaryCardProps> = ({
  selectedLanguage = 'en',
  onSimulateCall,
}) => {
  const [lang, setLang] = useState<RubyLanguage>(selectedLanguage);
  const [summaryData, setSummaryData] = useState<CallLogSummary>(
    brainSimulator.generateCallLogSummary(selectedLanguage)
  );
  const [callRecords, setCallRecords] = useState<CallRecord[]>(brainSimulator.getCallRecords());
  const [isSpeakingSummary, setIsSpeakingSummary] = useState(false);
  const [isExpandedLog, setIsExpandedLog] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync language with parent if changed
  useEffect(() => {
    setLang(selectedLanguage);
    refreshSummary(selectedLanguage);
  }, [selectedLanguage]);

  const refreshSummary = (targetLang: RubyLanguage = lang) => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSummaryData(brainSimulator.generateCallLogSummary(targetLang));
      setCallRecords([...brainSimulator.getCallRecords()]);
      setIsRefreshing(false);
    }, 250);
  };

  const handleLanguageChange = (newLang: RubyLanguage) => {
    setLang(newLang);
    refreshSummary(newLang);
  };

  const handleToggleReadAloud = () => {
    if (isSpeakingSummary) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeakingSummary(false);
    } else {
      setIsSpeakingSummary(true);
      voiceEngine.speak(summaryData.conversationalSummary, lang, () => {
        setIsSpeakingSummary(false);
      });
    }
  };

  const handleAddDemoCall = () => {
    const newDemoRecord: CallRecord = {
      id: `call-rec-${Date.now()}`,
      callerName: 'Vijay (Courier)',
      callerNumber: '+91 98200 55441',
      type: 'AI_SCREENED',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      durationSeconds: 42,
      carrier: 'Airtel India SIM 1',
      summaryNote: 'AI screening: Package delivery at gate. Security guard authorized to collect.',
      urgency: 'NORMAL',
      actionTaken: 'Gate security OTP shared via AI Assistant',
    };
    brainSimulator.addCallRecord(newDemoRecord);
    refreshSummary(lang);
    onSimulateCall?.('Vijay (Courier)', '+91 98200 55441');
  };

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-[24px] p-5 sm:p-6 space-y-5 select-none shadow-xl relative overflow-hidden">
      {/* Background Subtle Gradient Flare */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#FF7900]/10 via-[#D90429]/5 to-transparent pointer-events-none rounded-full blur-3xl" />

      {/* 1. Header with Assistant Persona & Language Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f1f1f] pb-4 relative z-10">
        <div className="flex items-center gap-3">
          {/* Multifaceted Ruby Gem Avatar Icon */}
          <div className="relative w-10 h-10 rounded-[14px] bg-[#1a1a1a] border border-[#FF7900]/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,121,0,0.25)]">
            <Sparkles className="w-5 h-5 text-[#FF7900]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#35C98A] shadow-[0_0_6px_#35c98a]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-display tracking-wide">
                {summaryData.title}
              </h3>
              <span className="text-[10px] font-mono-num px-2 py-0.5 bg-[#FF7900]/15 text-[#FF9D32] border border-[#FF7900]/30 rounded">
                AI Synthesis
              </span>
            </div>
            <p className="text-xs text-[#A1A1AA] flex items-center gap-1.5 mt-0.5">
              <span>Airtel India SIM 1</span>
              <span>·</span>
              <span>InCallService & Room DB</span>
              <span>·</span>
              <span className="text-[#FFC15A] font-mono-num">Updated {summaryData.lastUpdated}</span>
            </p>
          </div>
        </div>

        {/* Action Controls: Refresh + Language Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center p-1 bg-[#181818] border border-[#262626] rounded-[12px] text-xs">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-2.5 py-1 rounded-[8px] font-medium transition ${
                lang === 'en' ? 'bg-[#FF7900] text-black font-bold' : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => handleLanguageChange('ta')}
              className={`px-2.5 py-1 rounded-[8px] font-medium transition ${
                lang === 'ta' ? 'bg-[#FF7900] text-black font-bold' : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => handleLanguageChange('hi')}
              className={`px-2.5 py-1 rounded-[8px] font-medium transition ${
                lang === 'hi' ? 'bg-[#FF7900] text-black font-bold' : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>

          <button
            onClick={() => refreshSummary(lang)}
            disabled={isRefreshing}
            className="p-2 bg-[#181818] hover:bg-[#222222] border border-[#262626] rounded-[12px] text-[#A1A1AA] hover:text-white transition"
            title="Refresh Summary"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FF7900]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Primary Conversational Card (The AI Assistant Speech Bubble) */}
      <div className="relative z-10 bg-gradient-to-r from-[#181818]/90 via-[#161616]/95 to-[#181818]/90 border border-[#FF7900]/35 rounded-[20px] p-4 sm:p-5 shadow-lg">
        {/* Subtle Assistant Quote Icon */}
        <div className="flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-full bg-[#FF7900]/15 border border-[#FF7900]/30 flex items-center justify-center shrink-0 mt-0.5">
            <Bot className="w-4 h-4 text-[#FF7900]" />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#FF9D32] uppercase tracking-wider font-mono-num flex items-center gap-1.5">
                <span>RUBY AI TELEPHONY INTELLIGENCE</span>
              </span>

              {/* TTS Read Aloud Button */}
              <button
                onClick={handleToggleReadAloud}
                className={`px-2.5 py-1 rounded-[10px] text-xs font-medium flex items-center gap-1.5 transition ${
                  isSpeakingSummary
                    ? 'bg-[#FF7900] text-black font-bold shadow-[0_0_10px_#ff7900]'
                    : 'bg-[#222222] hover:bg-[#2c2c2c] text-[#A1A1AA] hover:text-white border border-[#333333]'
                }`}
              >
                {isSpeakingSummary ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stop Speech</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-orange-400" />
                    <span>Read Aloud</span>
                  </>
                )}
              </button>
            </div>

            {/* The Natural Language Conversational Summary Text */}
            <p className="text-sm sm:text-[14px] text-slate-100 leading-relaxed font-sans font-normal">
              "{summaryData.conversationalSummary}"
            </p>
          </div>
        </div>
      </div>

      {/* 3. Carrier Statistics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        <div className="bg-[#161616] border border-[#222222] rounded-[16px] p-3 text-center">
          <span className="text-[10px] font-mono-num uppercase tracking-wider text-[#A1A1AA]">Total Calls</span>
          <p className="text-lg font-bold font-mono-num text-white mt-0.5">{summaryData.stats.totalCalls}</p>
        </div>

        <div className="bg-[#161616] border border-[#222222] rounded-[16px] p-3 text-center">
          <span className="text-[10px] font-mono-num uppercase tracking-wider text-[#FF9D32]">AI Screened</span>
          <p className="text-lg font-bold font-mono-num text-[#FF9D32] mt-0.5">{summaryData.stats.screenedCalls}</p>
        </div>

        <div className="bg-[#161616] border border-[#222222] rounded-[16px] p-3 text-center">
          <span className="text-[10px] font-mono-num uppercase tracking-wider text-rose-400">Spam Blocked</span>
          <p className="text-lg font-bold font-mono-num text-rose-400 mt-0.5">{summaryData.stats.spamBlocked}</p>
        </div>

        <div className="bg-[#161616] border border-[#222222] rounded-[16px] p-3 text-center">
          <span className="text-[10px] font-mono-num uppercase tracking-wider text-emerald-400">Talk Duration</span>
          <p className="text-lg font-bold font-mono-num text-emerald-400 mt-0.5">{summaryData.stats.totalDurationFormatted}</p>
        </div>
      </div>

      {/* 4. Synthesized Key Highlights List */}
      <div className="space-y-2.5 relative z-10">
        <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
          <span className="font-semibold text-white tracking-wide uppercase text-[11px] font-mono-num">
            Key Call Highlights & Actions Taken
          </span>
          <span className="text-[11px] font-mono-num text-[#FF9D32]">Room DB Encrypted</span>
        </div>

        <div className="space-y-2">
          {summaryData.keyTakeaways.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#161616] hover:bg-[#1a1a1a] border border-[#222222] rounded-[16px] p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition"
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-[10px] bg-[#202020] border border-[#2a2a2a] flex items-center justify-center shrink-0 mt-0.5">
                  {item.icon === 'shield-alert' ? (
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  ) : item.icon === 'bot' ? (
                    <Bot className="w-3.5 h-3.5 text-orange-400" />
                  ) : item.icon === 'bike' ? (
                    <Bike className="w-3.5 h-3.5 text-blue-400" />
                  ) : (
                    <PhoneOutgoing className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white font-sans">{item.contact}</h4>
                  <p className="text-[11px] text-[#A1A1AA] mt-0.5 leading-relaxed">{item.detail}</p>
                </div>
              </div>

              <div className="shrink-0 self-start sm:self-center">
                <span
                  className={`text-[10px] font-mono-num px-2.5 py-1 rounded-[8px] font-semibold border ${
                    item.tagType === 'alert'
                      ? 'bg-rose-950/40 text-rose-400 border-rose-800/60'
                      : item.tagType === 'warning'
                      ? 'bg-orange-950/40 text-orange-400 border-orange-800/60'
                      : item.tagType === 'success'
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                      : 'bg-blue-950/40 text-blue-400 border-blue-800/60'
                  }`}
                >
                  {item.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Collapsible Raw Carrier Call Log View */}
      <div className="border-t border-[#1f1f1f] pt-4 relative z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpandedLog(!isExpandedLog)}
            className="text-xs text-[#A1A1AA] hover:text-white flex items-center gap-1.5 transition font-medium"
          >
            <span>{isExpandedLog ? 'Hide Raw Carrier Call Records' : 'View All Raw Carrier Call Records'}</span>
            {isExpandedLog ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleAddDemoCall}
            className="text-xs text-[#FF9D32] hover:text-[#ffb766] flex items-center gap-1.5 transition font-medium"
          >
            <span>+ Simulate New Incoming Screened Call</span>
          </button>
        </div>

        {isExpandedLog && (
          <div className="mt-3.5 space-y-2 pt-2">
            {callRecords.map((rec) => (
              <div
                key={rec.id}
                className="bg-[#141414] border border-[#222222] rounded-[14px] p-3 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#1e1e1e] flex items-center justify-center">
                    {rec.type === 'OUTGOING' ? (
                      <PhoneOutgoing className="w-3 h-3 text-emerald-400" />
                    ) : rec.type === 'AI_SCREENED' ? (
                      <Bot className="w-3 h-3 text-orange-400" />
                    ) : rec.type === 'MISSED' ? (
                      <PhoneMissed className="w-3 h-3 text-rose-400" />
                    ) : (
                      <PhoneIncoming className="w-3 h-3 text-cyan-400" />
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-white mr-2">{rec.callerName}</span>
                    <span className="text-[11px] text-[#A1A1AA] font-mono-num">{rec.callerNumber}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{rec.actionTaken}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono-num text-[11px] text-[#A1A1AA]">{rec.timestamp}</span>
                  <div className="text-[10px] text-emerald-400 font-mono-num">
                    {rec.durationSeconds > 0 ? `${rec.durationSeconds}s` : '0s'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
