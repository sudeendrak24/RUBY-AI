# RUBY AI — SYSTEM ARCHITECTURE SPECIFICATION

**Tagline:** Your Personal Intelligence. Your Voice. Your Control.  
**Version:** 1.0.0-PROD  
**Platform Architecture:** Two-Device Distributed Ecosystem (Windows 11 + Android 10+)

```
+---------------------------------------------------------------------------------------+
|                                    RUBY AI ECOSYSTEM                                  |
+---------------------------------------------------------------------------------------+
                                           ▲
                                           │ Mutual Auth (AES-256-GCM / TLS Token)
                                           ▼
+-------------------------------------+         +-------------------------------------+
|        RUBY AI WINDOWS BRAIN        |         |          RUBY AI ANDROID            |
|       (Central Intelligence)        |         |       (Primary Mobile Companion)    |
|                                     |         |                                     |
|  [ Ruby Brain Orchestration ]       |         |  [ Kotlin UI (Material 3) ]        |
|   • LanguageEngine (EN/TA/HI)       |         |   • 18 Production Screens           |
|   • MemoryEngine (AES-256 Store)    |         |   • Voice Visualizer & Orb          |
|   • PlannerEngine (DAG Tasks)       |         |                                     |
|   • ActionEngine (Safe OS Exec)     |         |  [ Android Telecom Framework ]     |
|   • SecurityEngine (Allowlists)     |         |   • InCallService (Live SIM Calls)  |
|                                     |         |   • CallScreeningService (Airtel)   |
|  [ C Native Subsystem ]             |         |   • AI Call Answering & Voicemail   |
|   • Low-latency Audio Ringbuffer    |         |                                     |
|   • Fast Phonetic Tokenizer & VAD   |         |  [ Riding Mode Subsystem ]          |
|   • Win32 Memory & CPU Telemetry    |         |   • Bluetooth / Speed Trigger       |
|                                     |         |   • Emergency Whitelist Bypass      |
|  [ Networking Daemon ]              |         |   • Auto-SMS Auto-Responder         |
|   • REST API (Port 8443 / 8080)     |         |                                     |
|   • WebSocket Streaming (Events)    |         |  [ Local Room Database ]            |
+-------------------------------------+         +-------------------------------------+
```

---

## 1. Subsystem Architecture

### 1.1 Windows Brain Architecture (Ruby + C)
The Windows intelligence unit executes locally on Windows 11 hardware (Intel Core i5, 16 GB RAM, integrated graphics):
- **Ruby Core Orchestrator (`windows/ruby/brain.rb`)**: Handles lifecycle, daemon loop, thread pooling, and signal trapping.
- **Language & Intent Classifier (`windows/ruby/language.rb`)**:
  - Implements multi-lingual tokenization supporting **English**, **Tamil (தமிழ்)**, and **Hindi (हिंदी)**, with Tanglish/Hinglish phrase matching.
  - Uses phonetic and keyword intent parsing with Levenshtein distance fallback.
  - Zero mandatory cloud API requirement; supports pluggable local or remote AI adapters.
- **Memory Subsystem (`windows/ruby/memory.rb`)**:
  - Local-first JSON/SQLite storage encrypted with AES-256-GCM.
  - Distinguishes **Ephemeral Session Context** (dialog state, temporary references) from **Long-term Personal Memory** (contact relationships, preferences, custom routines).
- **Task Planner (`windows/ruby/planner.rb`)**:
  - Deconstructs compound requests (e.g., "Find my project folder and read the readme") into a directed acyclic graph (DAG) of verified steps with pre-execution safety checks.
- **C Systems Accelerator (`windows/c/`)**:
  - `audio.c`: High-efficiency PCM ringbuffer with real-time energy threshold Voice Activity Detection (VAD).
  - `processing.c`: Fast C-based n-gram matching and phonetic similarity scoring.
  - `native_sys.c`: Windows Win32 API bindings for RAM/CPU queries, process monitoring, and safe application launching.

### 1.2 Android Companion Architecture (Kotlin + Android Telecom)
- **Telecom Integration (`android/app/src/main/kotlin/telephony/`)**:
  - `RubyInCallService`: Interacts with Android Telecom subsystem to provide custom in-call controls on incoming SIM calls (Airtel India and Indian cellular carriers).
  - `RubyCallScreeningService`: Screens incoming calls against contacts, spam blacklists, and user-configured AI delegation policies.
  - `RubyAICallAssistant`: Greets the caller with natural synthesized voice in Tamil, Hindi, or English, discloses AI identity, requests caller purpose, and transcribes messages.
- **Riding Mode Subsystem (`android/app/src/main/kotlin/riding/`)**:
  - Activated by voice ("Ruby, activate riding mode"), manual toggle, or Bluetooth helmet/headset pairing.
  - High-contrast minimal HUD, audio-first voice control, auto-SMS responder, and emergency contact bypass.
- **Local Storage (`android/app/src/main/kotlin/memory/`)**:
  - Room database with SQLCipher encryption for contacts, call history, voice notes, and paired device credentials.

### 1.3 Communication Protocol (`shared/protocols/`)
- **Transport**: Mutual TLS 1.3 or AES-256-GCM encrypted local WebSocket/REST over Wi-Fi.
- **Discovery**: Zero-configuration mDNS / UDP broadcast with cryptographic QR-code pairing.
- **Packet Structure**: JSON-RPC 2.0 frames with nonce, timestamp, signature, and payload.

---

## 2. Multilingual Voice Matrix

| Capability | English (EN) | Tamil (TA) | Hindi (HI) |
|---|---|---|---|
| Wake-word Detection | "Hey Ruby", "Ruby Activate" | "ரூபி கேள்", "ரூபி" | "रूबी सुनो", "रूबी एक्टिवेट" |
| Intent Classification | Full grammatical & colloquial | Pure Tamil + Tanglish transliteration | Pure Hindi + Hinglish transliteration |
| Speech-to-Text | Native Android SpeechRecognizer / Web Speech / Offline Vosk | Android Tamil Speech model / Web Speech | Android Hindi Speech model / Web Speech |
| Text-to-Speech | Clear, friendly assistant tone | Natural Tamil acoustic synthesis | Natural Hindi acoustic synthesis |
| Telephony Scripts | Professional disclosure & message collection | மரியாதையான குரல் அறிவிப்பு மற்றும் செய்தி பதிவு | विनम्र पहचान और संदेश संग्रहण |

---

## 3. Strict Security & Hardware Constraints
1. **Zero Python**: Verified pure Ruby 3.x, C99, Kotlin 1.9+, TypeScript 5+.
2. **Zero Hidden Recording**: Strict visual microphone badge, audio session state tracking, explicit user confirmations.
3. **No Unauthenticated Endpoints**: Every REST/WebSocket message requires Bearer token HMAC authentication.
4. **Lightweight Footprint**: Idle memory $<80\text{MB}$ on Windows, $<45\text{MB}$ on Android.
