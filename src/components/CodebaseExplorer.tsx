import React, { useState } from 'react';
import { Code2, Copy, Check, FileText, Download } from 'lucide-react';

export const CodebaseExplorer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState('windows/ruby/language.rb');

  const filesMap: Record<string, { lang: string; description: string; preview: string }> = {
    'windows/ruby/language.rb': {
      lang: 'ruby',
      description: 'Multilingual Natural Language Engine (English, Tamil, Hindi, Tanglish, Hinglish)',
      preview: `# frozen_string_literal: true
# RUBY AI — Multilingual NLP & Intent Engine
module RubyAI
  class LanguageEngine
    SUPPORTED_LANGUAGES = %i[en ta hi].freeze

    INTENTS = {
      call_contact: {
        en: [/\\b(call|phone|ring|dial)\\s+([a-zA-Z\\s]+)/i],
        ta: [/(?:என்\\s+)?([^\\s]+)(?:க்கு|கிட்ட)\\s+(?:போன்|கால்)\\s+(?:பண்ணு|போடு)/u],
        hi: [/(?:मेरे\\s+)?([^\\s]+)(?:\\s+को)?\\s+(?:फोन|कॉल)\\s+(?:करो|लगाओ)/u]
      },
      activate_riding_mode: {
        en: [/\\b(activate|start|turn on)\\s+riding\\s+mode/i],
        ta: [/ரைடிங்\\s+மோட்\\s+ஆன்\\s+பண்ணு/u],
        hi: [/राइडिंग\\s+मोड\\s+चालू\\s+करो/u]
      }
    }.freeze
    # Detects Tamil/Hindi unicode or colloquial Tanglish/Hinglish
  end
end`
    },
    'windows/c/audio.c': {
      lang: 'c',
      description: 'Low-latency PCM audio ring buffer with real-time energy VAD',
      preview: `/**
 * RUBY AI — Low-Latency Audio Ringbuffer & VAD Implementation
 * C99 Standard. Zero external runtime dependencies.
 */
#include "include/ruby_ai_native.h"
#include <stdlib.h>
#include <math.h>

RubyAudioRingBuffer* ruby_audio_create(size_t sample_capacity, float energy_threshold) {
    RubyAudioRingBuffer *ring = malloc(sizeof(RubyAudioRingBuffer));
    ring->capacity = sample_capacity > 0 ? sample_capacity : 16000 * 5;
    ring->buffer = calloc(ring->capacity, sizeof(int16_t));
    ring->energy_threshold = energy_threshold;
    return ring;
}

bool ruby_audio_detect_speech(RubyAudioRingBuffer *ring) {
    // Computes RMS energy across 512 PCM samples
    int64_t sum_squares = 0;
    ...
    return ring->is_speaking;
}`
    },
    'android/app/src/main/kotlin/telephony/RubyInCallService.kt': {
      lang: 'kotlin',
      description: 'Official Android Telecom InCallService for Airtel India SIM calls',
      preview: `package com.rubyai.assistant.telephony

import android.telecom.Call
import android.telecom.InCallService
import android.util.Log

class RubyInCallService : InCallService() {
    override fun onCallAdded(call: Call) {
        super.onCallAdded(call)
        val handle = call.details?.handle?.schemeSpecificPart
        Log.i("RubyInCallService", "Telephony Carrier Call: $handle")
        // Triggers RUBY incoming call UI and AI Screening delegate
    }

    fun answerCall() {
        activeCallInstance?.answer(android.telecom.VideoProfile.STATE_AUDIO_ONLY)
    }
}`
    },
    'android/app/src/main/kotlin/riding/RidingModeController.kt': {
      lang: 'kotlin',
      description: 'Motorcycle Riding Mode Controller & Emergency Whitelist Bypass',
      preview: `package com.rubyai.assistant.riding

class RidingModeController(private val context: Context) {
    fun activateRidingMode(policy: RidingCallPolicy = RidingCallPolicy.AI_ASSISTANT) {
        _ridingState.value = _ridingState.value.copy(isActive = true, callPolicy = policy)
        // Disables screen distractions, routes audio to Bluetooth helmet headset
    }

    fun sendAutoSms(phoneNumber: String, customMessage: String?) {
        val smsManager = context.getSystemService(SmsManager::class.java)
        smsManager.sendTextMessage(phoneNumber, null, "I am riding my bike right now...", null, null)
    }
}`
    },
    'android/app/proguard-rules.pro': {
      lang: 'pro',
      description: 'Production R8 and ProGuard rules with Telecom and Room keep policies',
      preview: `# RUBY AI — Android Production ProGuard & R8 Configuration
-keep public class com.rubyai.assistant.telephony.RubyInCallService { public *; }
-keep public class com.rubyai.assistant.telephony.RubyCallScreeningService { public *; }
-keep class androidx.room.** { *; }
-keep @androidx.room.Dao interface * { *; }
-keep @androidx.room.Entity class * { *; }
-keep class com.rubyai.assistant.voice.VoiceInteractionManager { *; }
-keep class com.rubyai.assistant.riding.RidingModeController { *; }
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod`
    },
    'shared/protocols/ipc_protocol.json': {
      lang: 'json',
      description: 'Inter-Process Communication Schema between Windows Brain and Android',
      preview: `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "RubyAI_IPC_Protocol",
  "version": "1.0.0",
  "transport": {
    "rest_port": 8443,
    "websocket_port": 8444,
    "encryption": "AES-256-GCM / TLS 1.3"
  },
  "message_types": {
    "VOICE_COMMAND": { "direction": "Android -> Windows" },
    "TELEPHONY_CALL_EVENT": { "direction": "Android <-> Windows" },
    "RIDING_MODE_STATE": { "direction": "Android -> Windows" }
  }
}`
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(filesMap[selectedFile]?.preview || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-orange-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono-num">
            Source Codebase Explorer
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-slate-300 text-xs rounded-lg border border-neutral-800 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Source'}</span>
          </button>
        </div>
      </div>

      {/* File selector tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {Object.keys(filesMap).map((fileName) => (
          <button
            key={fileName}
            onClick={() => setSelectedFile(fileName)}
            className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap flex items-center gap-1.5 ${
              selectedFile === fileName
                ? 'bg-neutral-900 border-orange-500 text-orange-400 font-semibold'
                : 'bg-neutral-950 border-neutral-800 text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{fileName.split('/').pop()}</span>
          </button>
        ))}
      </div>

      {/* File metadata */}
      <div className="text-xs text-slate-400">
        <span className="font-semibold text-slate-300">Target Path:</span>{' '}
        <code className="text-orange-400 font-mono-num">{selectedFile}</code>
        <p className="text-[11px] text-slate-500 mt-0.5">{filesMap[selectedFile]?.description}</p>
      </div>

      {/* Code preview window */}
      <div className="p-4 bg-black border border-neutral-800/90 rounded-xl overflow-x-auto">
        <pre className="text-xs font-mono-num text-slate-200 leading-relaxed">
          <code>{filesMap[selectedFile]?.preview}</code>
        </pre>
      </div>
    </div>
  );
};
