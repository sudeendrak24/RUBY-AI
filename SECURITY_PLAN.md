# RUBY AI — SECURITY PLAN & THREAT MODEL

**Version:** 1.0.0-PROD  
**Classification:** Internal System Security & Privacy Standard

---

## 1. Security Architecture Principles

1. **Zero Trust Local Network**:
   - The Windows Brain and Android device do not assume local Wi-Fi is trusted.
   - All REST requests require a cryptographically signed Bearer token (`Authorization: Bearer <HMAC-SHA256>`).
   - Pairing is initiated using out-of-band mutual challenge exchange (QR Code or 6-digit cryptographic TOTP).

2. **No Arbitrary Shell Command Execution**:
   - The Assistant Action Engine will NEVER execute arbitrary shell commands supplied directly from speech or text.
   - Only pre-approved, strictly parameterized commands on the **Allowlist** (`windows/ruby/security.rb`) are executed.
   - Destructive operations (file deletion, formatting, termination of system services) require explicit verbal or UI confirmation.

3. **Privacy & Telephony Safeguards**:
   - **No Deceptive Impersonation**: The AI call answering system always discloses its identity: *"Hello, I am RUBY, Sudeendra's AI assistant."*
   - **No Secret Audio Recording**: A persistent foreground notification and visible status indicator are mandatory whenever the microphone or call screening is engaged.
   - **Zero Contact Leaks**: Contact lists and conversation logs are encrypted on disk with AES-256-GCM and never transmitted to external third-party servers.

4. **Rate Limiting & Anti-Brute Force**:
   - The REST/WebSocket daemon throttles unauthenticated requests to 5 attempts per minute before imposing a 15-minute IP lockout.
   - Replay attacks are mitigated using nonce tracking and 30-second timestamp drift windows.

---

## 2. Threat Mitigation Matrix

| Threat | Risk Level | Mitigation in RUBY AI |
|---|---|---|
| Malicious Voice Injection | High | Wake-word speaker verification threshold + destructive action pin requirement |
| Wi-Fi Eavesdropping | High | AES-256-GCM / TLS 1.3 encryption across all sockets and endpoints |
| Telephony Audio Abuse | Critical | Strict compliance with official Android Telecom APIs; zero root/accessibility exploits |
| Token Theft | Medium | Ephemeral session tokens with 24-hour expiration stored in encrypted keystore |
| Data Corruption | Low | Atomic writes with write-ahead journaling and automated backup snapshots |
