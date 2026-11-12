# RUBY AI — Complete Personal AI Assistant Ecosystem

> **"Your Personal Intelligence. Your Voice. Your Control."**

RUBY AI is an extensible, privacy-respecting, two-device personal intelligence ecosystem spanning **Android** and **Windows 11**. It combines a native Kotlin Android companion with a local-first Windows intelligence brain implemented in pure **Ruby** and **C**, connected through mutual cryptographically authenticated protocols.

---

## Key Highlights

- **Strict Technology Compliance**: Zero Python runtime dependencies, zero mandatory paid APIs, zero proprietary cloud lock-in.
- **Multilingual Voice Engine**: Native tri-lingual capability in **English**, **Tamil (தமிழ்)**, and **Hindi (हिंदी)** with colloquial Tanglish/Hinglish understanding.
- **Advanced Airtel SIM Telephony**: Leverages official Android Telecom framework (`InCallService`, `CallScreeningService`) to screen carrier calls, answer with AI transparency disclosure, and transcribe voicemails.
- **Motorcycle Riding Mode**: Voice-first HUD minimizing phone handling, emergency contact whitelist bypass, and automatic SMS responder.
- **Local-First Encrypted Memory**: AES-256-GCM local storage for contacts, aliases, preferences, and system audit logs.
- **Windows Desktop Brain**: Intel Core i5 / 16GB RAM calibrated, Win32 telemetry hooks, C native audio VAD, and allowlisted application launching.
- **Unified Live Interactive Cockpit**: Web-based simulator and development cockpit running on port 3000 for dual-device orchestration, live mic speech recognition, and package release generation.

---

## Subsystem Architecture

```
RUBY_AI/
├── android/                             # Native Android Companion (Kotlin)
│   ├── app/src/main/AndroidManifest.xml # Telecom & Voice Foreground Services
│   ├── app/src/main/kotlin/.../
│   │   ├── telephony/                   # RubyInCallService & RubyCallScreeningService
│   │   ├── riding/                      # RidingModeController & Auto-SMS
│   │   ├── voice/                       # VoiceInteractionManager (EN/TA/HI)
│   │   ├── memory/                      # Room Database (SQLCipher)
│   │   └── ui/screens/                  # 18 Material 3 Compose Screens
│   └── build.gradle.kts
│
├── windows/                             # Windows 11 Central Intelligence
│   ├── ruby/                            # Ruby 3.x Orchestration
│   │   ├── brain.rb                     # CLI Brain Entry Point
│   │   ├── assistant.rb                 # Conversational & Action Engine
│   │   ├── language.rb                  # Multilingual Intent Engine (EN/TA/HI)
│   │   ├── memory.rb                    # AES-256 Encrypted Store
│   │   ├── planner.rb                   # DAG Multi-step Task Planner
│   │   ├── telephony.rb                 # Call Screening & Answering Scripts
│   │   ├── security.rb                  # Execution Allowlist & HMAC Tokens
│   │   ├── server.rb                    # REST (:8443) & WebSocket Daemon
│   │   └── tests/test_brain.rb          # Automated Ruby Unit Tests
│   └── c/                               # Native C Systems Layer (C99)
│       ├── audio.c                      # 16kHz PCM Ring Buffer & VAD
│       ├── processing.c                 # Fast Phonetic & Levenshtein Tokenizer
│       ├── native_sys.c                 # Win32 Memory/CPU Telemetry
│       ├── include/ruby_ai_native.h     # Shared C Header
│       └── Makefile                     # MinGW / MSVC build
│
├── shared/                              # Shared Schemas & Protocols
│   ├── protocols/ipc_protocol.json      # Cross-Device JSON-RPC Protocol
│   ├── schemas/memory_schema.json       # Structured Personal Memory Schema
│   └── schemas/call_event_schema.json   # Telecom Event Schema
│
└── src/                                 # Interactive Web Control Deck & Simulator
    ├── components/                      # Android Simulator, Windows Console, Orb
    ├── services/                        # Real Web Speech Engine & Mock Brain
    └── types/                           # TypeScript Domain Models
```

---

## Architectural & Audit Documentation

1. `PROJECT_AUDIT.md`: Complete audit of baseline repository and module inventory.
2. `RUBY_AI_ARCHITECTURE.md`: Subsystem architecture, mutual auth, and telecom framework design.
3. `DEVELOPMENT_ROADMAP.md`: Status of all 10 core milestones.
4. `FEATURE_STATUS.md`: Feature verification matrix across all platforms.
5. `SECURITY_PLAN.md`: Threat model, execution allowlists, and privacy safeguards.
6. `BUILD_AND_TEST_GUIDE.md`: Build and execution instructions for Android, Windows, and Web.

---

## Running the Ecosystem Cockpit

```bash
npm run dev
# Live control deck active on http://localhost:3000
```
