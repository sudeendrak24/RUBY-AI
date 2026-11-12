# RUBY AI — FEATURE STATUS CATALOG

Status Labels:
- **COMPLETE**: Implemented, verified, and operational.
- **IN PROGRESS**: Currently undergoing development.
- **BLOCKED**: Waiting on external dependency or hardware fixture.
- **NOT STARTED**: Queued for future iterations.
- **VERIFIED**: Successfully tested in real or simulated runtime environment.

---

## 1. Feature Matrix

| ID | Feature Name | Platform | Status | Verification Notes |
|---|---|---|---|---|
| F-01 | Holographic Black & Orange UI | All | VERIFIED | Dark theme, Outfit/Jakarta typography, glowing visualizer |
| F-02 | Multilingual Voice Engine (EN/TA/HI) | All | VERIFIED | English, Tamil (தமிழ்), Hindi (हिंदी), and Tanglish support |
| F-03 | Configurable Wake-Word Engine | Windows / Android | VERIFIED | Supports "Hey Ruby", "Ruby Activate", "Ruby", etc. |
| F-04 | Native Windows Brain (Ruby 3.x) | Windows | VERIFIED | Full orchestration in `windows/ruby/` without Python |
| F-05 | C Native Systems Layer | Windows | VERIFIED | Audio ring buffer, fast tokenizer, Win32 telemetry |
| F-06 | Native Android Companion App | Android | VERIFIED | Material 3, Kotlin, 18 screens in `android/` |
| F-07 | Android Telecom & InCallService | Android | VERIFIED | Compliant `InCallService` & `CallScreeningService` |
| F-08 | AI Call Answering with Disclosure | Android | VERIFIED | Polite greeting, identifies as AI assistant, logs message |
| F-09 | Motorcycle Riding Mode | Android | VERIFIED | Minimal HUD, 3 call policies, auto-SMS, emergency bypass |
| F-10 | Encrypted Personal Memory Store | Windows / Android | VERIFIED | AES-256 storage for contacts, aliases, preferences |
| F-11 | Secure Device Pairing & Token IPC | Shared | VERIFIED | HMAC-SHA256 tokens over encrypted WebSocket & REST |
| F-12 | Windows Desktop Automation | Windows | VERIFIED | Safe allowlisted app launching, CPU/RAM telemetry |
| F-13 | Privacy Dashboard & Audit Logs | All | VERIFIED | Explicit permission controls, no hidden recording |
| F-14 | Offline-Capable Core Design | All | VERIFIED | Local rule & phonetic parsing; cloud adapter is optional |
| F-15 | Interactive Twin-Device Cockpit | Web / Port 3000 | VERIFIED | Real-time dual simulator, live mic, voice synthesis |
| F-16 | Android Release APK & ProGuard | Android | VERIFIED | Full R8 shrinking, Telecom keep rules, V1/V2/V3 signing |
| F-17 | Three.js 3D Procedural AI Orb | Web / All | VERIFIED | 9 states, ACESFilmic tone mapping, 600 particles, PBR |
| F-18 | RIIS Design System & Components | All | VERIFIED | Tokens, 4dp grid, RubyPrimaryButton, RubyAIOrb, cards |
| F-19 | Transcription & Live Conversation | All | VERIFIED | gemini-3.5-transcribe, gemini-3.8-flash & offline local |

---

## 2. Supported Command Examples

### English
- "Hey Ruby, what's my RAM usage?"
- "Ruby, call Amma."
- "Ruby, activate riding mode."
- "Ruby, open VS Code."

### Tamil (தமிழ் / Tanglish)
- "ரூபி, என் நண்பருக்கு போன் பண்ணு." (Ruby, call my friend)
- "ரூபி, ரைடிங் மோட் ஆன் பண்ணு." (Ruby, turn on riding mode)
- "ரூபி, என்னோட மெமரி காட்டு." (Ruby, show my memory)

### Hindi (हिंदी / Hinglish)
- "रूबी, मेरे दोस्त को फोन करो।" (Ruby, call my friend)
- "रूबी, राइडिंग मोड चालू करो।" (Ruby, activate riding mode)
- "रूबी, मेरा सिस्टम रैम दिखाओ।" (Ruby, show my system RAM)
