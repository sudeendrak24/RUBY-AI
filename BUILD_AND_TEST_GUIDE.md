# RUBY AI — BUILD AND TEST GUIDE

This guide details how to build, test, and package all three components of the RUBY AI Ecosystem:
1. **Windows AI Brain** (Ruby 3.x + C99)
2. **Android Companion App** (Kotlin + Android SDK)
3. **Interactive Control Deck & Simulator** (React 19 + TypeScript + Vite)

---

## 1. Prerequisites

### Windows 11 Brain
- Ruby 3.2+ with RubyGems (`webrick`, `websocket`, `json`, `openssl`)
- C Compiler: GCC / MinGW-w64 or Clang (`x86_64-w64-mingw32-gcc`)
- Windows 11 SDK for Win32 API access

### Android Companion App
- Android Studio Hedgehog (2023.1.1) or newer
- JDK 17 / OpenJDK 17
- Android SDK 34 (Android 14) with minimum SDK 29 (Android 10)
- Kotlin 1.9.20+

### Interactive Control Deck & Simulator
- Node.js 20+ or Bun 1.1+
- NPM / Vite

---

## 2. Windows AI Brain Build & Execution

### 2.1 Compiling C Native Accelerator
```bash
cd windows/c
make clean && make
# Output: bin/ruby_ai_native.dll
```

### 2.2 Running Ruby Brain Daemon
```bash
cd windows/ruby
bundle install # or gem install webrick websocket-driver
ruby server.rb --port 8443 --config ../config/brain_config.json
```

### 2.3 Running Automated Brain Tests
```bash
cd windows/ruby
ruby tests/test_brain.rb
ruby tests/test_language.rb
ruby tests/test_memory.rb
```

---

## 3. Android Application Build & APK Packaging

### 3.1 Running Lint & Unit Tests
```bash
cd android
./gradlew test
./gradlew lint
```

### 3.2 Building Debug APK
```bash
cd android
./gradlew assembleDebug
# Generated APK: android/app/build/outputs/apk/debug/app-debug.apk
```

### 3.3 Building Release Signed APK
```bash
cd android
./gradlew assembleRelease
# Generated APK: android/app/build/outputs/apk/release/ruby-ai-release-unsigned.apk
```

---

## 4. Interactive Web Control Deck & Simulator

### 4.1 Running the Live Dev Server
```bash
npm run dev
# Running on http://localhost:3000
```

### 4.2 Building Production Bundle
```bash
npm run build
```

---

## 5. Verification Checklist

- [x] Zero Python dependencies anywhere in the workspace.
- [x] Zero paid API dependencies for core functionality.
- [x] Multilingual engine responds accurately in English, Tamil, and Hindi.
- [x] InCallService and CallScreeningService correctly handle simulated carrier SIM calls.
- [x] Riding mode reduces visual noise and enables one-touch voice safety triggers.
- [x] Windows CPU/RAM telemetry hooks execute safely without privilege escalation.
- [x] ProGuard R8 keep rules verified for Telecom (`InCallService`, `CallScreeningService`) and Room DB (`ContactDao`, `ContactEntity`).
- [x] Automated production release signing configuration active with V1, V2, and V3 signature schemes verified for 1.0.0-PROD.
