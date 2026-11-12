# RUBY AI — REUSABLE COMPONENT LIBRARY

Specification of reusable UI components conforming to RIIS (Ruby Intelligent Interface System).

---

## 1. Core Component Catalog

1. **RubyAIOrb (Three.js 3D Procedural Engine)**:
   - Interactive 3D Canvas with WebGL2 / WebGL fallback.
   - PBR Materials: Metallic core, emissive tori, dynamic 600-point particle field.
   - 9 States: `idle`, `listening`, `processing`, `speaking`, `thinking`, `calling`, `error`, `offline`, `privacy`.
   - Audio-reactive frequency modulation via Web Audio API AnalyserNode.

2. **RubyPrimaryButton**:
   - Electric orange background (`#FF7900`), black high-contrast bold typography (`#080808`), rounded `14dp` geometry, active press feedback (`scale-[0.98]`).

3. **RubySecondaryButton**:
   - Elevated charcoal background (`#1B1B1B`), subtle border (`#2A2A2A`), white text, hover glow.

4. **RubyIconButton**:
   - Circular $44 \times 44\text{dp}$ touch target, centered Lucide SVG icon, accessibility tooltip.

5. **RubyCard**:
   - Flat surface (`#111111`), 1px border (`#222222`), `18dp` corner radius, internal padding 16dp.

6. **RubyGlassPanel**:
   - Translucent dark overlay with subtle border highlight and high-contrast foreground text.

7. **RubyVoiceVisualizer**:
   - Multi-bar audio reactive equalizer with fluid oscillation during microphone input and speech synthesis.

8. **RubyMessageBubble**:
   - Conversational bubble with distinct user vs. assistant alignment, copy action, and audio replay.

9. **RubyCallActionButton**:
   - Distinctive large round action triggers: Green for Answer, Red for Decline, Orange for AI Delegate.

10. **RubyStatusIndicator**:
    - Clean static typography paired with semantic color badges for Wi-Fi, Bluetooth, Carrier SIM, and Battery.

11. **RubyToast & ConfirmationDialog**:
    - Accessible feedback overlays for security-sensitive operations (e.g. Memory wipe, App launch).
