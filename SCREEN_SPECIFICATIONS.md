# RUBY AI — SCREEN SPECIFICATIONS (ANDROID & WINDOWS)

This document provides layout, interaction, and state specifications for all screens across the ecosystem.

---

## 1. Android Application Screen Specifications

### Screen 1: Splash Screen
- **Purpose**: Brand immersion & system initial checks.
- **Visuals**: Solid `#080808` canvas, centered animated 3D orange orb, "RUBY AI" wordmark, tagline.
- **Transitions**: Smooth auto-transition (600ms) or single-tap shortcut into Onboarding/Dashboard.

### Screen 2: Onboarding (4 Stages)
- **Stage 1 (Meet RUBY)**: Mission overview, ecosystem explanation (phone + PC).
- **Stage 2 (Language Selection)**: English, தமிழ் (Tamil), हिन्दी (Hindi).
- **Stage 3 (Voice Tuning)**: Wake word ("Hey Ruby", "Ruby Activate", "ரூபி", "रूबी"), speed multiplier, mic test.
- **Stage 4 (Device Pairing)**: QR code generator, mutual HMAC-SHA256 token exchange with Windows 11.

### Screen 3: Home Dashboard
- **Top Section**: Logo wordmark, greeting (localized), status chip (Airtel 5G, Wi-Fi, battery).
- **Centerpiece**: Interactive 3D Three.js RUBY AI Orb with real-time breathing and audio reactive state.
- **Control Dock**: Push-to-Talk button, Text input toggle, Conversation launcher, Riding Mode trigger.
- **Quick Action Grid**: Call Amma, Riding Mode HUD, Contacts Vault, Memory Settings.

### Screen 4: Voice Assistant Fullscreen Experience
- **Visuals**: Fullscreen focused 3D orb with multi-frequency soundwave visualizer.
- **Transcription**: Live streaming transcribed words from `gemini-3.5-transcribe` or Web Speech API.
- **Playback**: Live speech synthesis with interruption support ("Stop speaking").

### Screen 5: Chat Interface
- **Features**: User message bubbles (right, elevated `#1B1B1B`), RUBY response bubbles (left, `#111111` with orange accent border), speech replay button, regenerate response, clear history.

### Screen 6: Incoming Call Interface
- **Carrier**: Airtel India SIM 1 via Android Telecom `InCallService`.
- **Display**: Caller Name, Phone Number, Emergency Whitelist tag.
- **Actions**:
  1. *Delegate to RUBY AI*: Ruby answers with AI disclosure greeting, records message.
  2. *Answer (Manual)*: Connects audio call.
  3. *Decline*: Rejects call and sends auto-SMS if Riding Mode is active.

### Screen 7: Active Call Interface
- **Display**: Connected timer (`00:42`), AI transparency badge (*"AI Assistant Screening Active"*), live caller transcript stream, Mute, Speakerphone, Hangup.

### Screen 8: Outgoing Call Interface
- **Display**: Contact lookup search bar, keypad dialer, SIM 1 / SIM 2 picker, voice command hint.

### Screen 9: Motorcycle Riding Mode HUD
- **Ergonomics**: Extreme contrast, large typography, distraction-free voice-first HUD.
- **Indicators**: Current cruise speed (`48 km/h`), Bluetooth helmet connected, 3 Call policies (Normal, AI Assistant, Emergency Whitelist).

### Screen 10: Contacts & Aliases
- **Features**: Verified contact cards, phonetic alias tagging (Mom, Maa, அம்மா, पापा), Emergency Bypass toggle.

### Screen 11: Memory Management
- **Security**: AES-256 encrypted local vault, search, edit, export JSON, privacy wipe.

### Screen 12: Device Pairing & Networking
- **Display**: Mutual TLS state, latency probe (`1.8ms`), QR pairing token, TOTP generator.

### Screen 13: Settings
- **Categories**: General, Voice, AI Models, Calling, Riding Mode, Security & Audit Logs.

---

## 2. Windows 11 Desktop UI Specifications

- **Left Navigation Rail**: 11-item icon dock (Home, Chat, Voice, Memory, Devices, Calls, Riding, Automation, System, Security, Settings).
- **Top Bar**: Status ticker, paired phone battery & carrier status, profile.
- **Main Workspace**: Three.js 3D AI Orb, real-time command terminal, Allowlisted App Launcher.
- **Telemetry Sidebar**: Real-time Win32 CPU & RAM utilization, active thread count, C native VAD status.
