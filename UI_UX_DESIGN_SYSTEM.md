# RUBY INTELLIGENT INTERFACE SYSTEM (RIIS) — DESIGN SYSTEM SPECIFICATION

**Product:** RUBY AI  
**Tagline:** Your Personal Intelligence. Your Voice. Your Control.  
**Version:** 2.0.0-PROD  
**Design Philosophy:** Minimalist Futuristic Holographic Operating Environment  

---

## 1. Five Core Design Principles

1. **Voice-First**: Every primary capability (calling, navigation, riding, memory, system controls) is directly accessible and operable via voice in English, Tamil, and Hindi.
2. **Visual Intelligence**: The interface communicates the real-time AI state (Idle, Listening, Processing, Speaking, Thinking, Calling, Error, Offline, Privacy Mode) through the Three.js 3D Procedural AI Orb and dynamic audio waveforms.
3. **Minimal Interaction**: Streamlined single-touch workflows, thumb-zone optimized touch targets ($\ge 48\text{dp}$), and zero unnecessary nested menus.
4. **Context Awareness**: Dynamic situational adaptations for Motorcycle Riding, In-Call Screening, Windows Desktop Workstation, and Hands-Free Voice.
5. **Ecosystem Consistency**: Shared design tokens, typography, visual weight, and interaction logic across Android and Windows 11.

---

## 2. Design Tokens & Color Palette

| Token | Hex Value | Semantic Purpose |
|---|---|---|
| `--color-background` | `#080808` | Primary deep black canvas |
| `--color-surface` | `#111111` | Primary cards, panels, and sidebars |
| `--color-elevated` | `#1B1B1B` | Elevated dialogs, tooltips, and floating docks |
| `--color-primary` | `#FF7900` | Electric orange primary action buttons and active focus |
| `--color-secondary` | `#FF9D32` | Warm secondary accents and highlights |
| `--color-amber` | `#FFC15A` | AI cognitive activity, orb particle glow, speaking state |
| `--color-text` | `#FFFFFF` | High-contrast primary headings and active labels |
| `--color-muted` | `#A1A1AA` | Subdued metadata, subtitles, and inactive tabs |
| `--color-success` | `#35C98A` | Connected Wi-Fi/BT, verified signature, call connected |
| `--color-error` | `#FF4545` | Security blocks, call decline, disconnect alert |
| `--color-info` | `#54A6FF` | Windows telemetry, system diagnostics, informational notices |

---

## 3. Typography Hierarchy

- **Display**: 32–40sp (`Outfit`, Bold 700 / ExtraBold 800)
- **Screen Title**: 24–28sp (`Outfit` / `Plus Jakarta Sans`, SemiBold 600)
- **Section Heading**: 18–20sp (`Plus Jakarta Sans`, SemiBold 600)
- **Body Prose**: 14–16sp (`Plus Jakarta Sans`, Regular 400 / Medium 500)
- **Secondary Subtitle**: 12–14sp (`Plus Jakarta Sans`, Regular 400, muted)
- **Technical & Telemetry**: 11–13sp (`JetBrains Mono`, tabular figures `tabular-nums`)

Multilingual font fallbacks:
- Tamil: Noto Sans Tamil / system Tamil
- Hindi: Noto Sans Devanagari / system Devanagari

---

## 4. Spacing & Geometric Radii

- **Grid**: Strict 4dp base spacing unit (4dp, 8dp, 12dp, 16dp, 24dp, 32dp).
- **Corner Radii**:
  - Small Controls / Tags: `10dp` (`rounded-[10px]`)
  - Standard Buttons: `14dp` (`rounded-[14px]`)
  - Cards & Viewport Panels: `18dp` (`rounded-[18px]`)
  - Hero Cards & Dialogs: `24dp` (`rounded-[24px]`)
  - AI Orb & Floating Buttons: Circular (`rounded-full`)
- **Touch Target**: Minimum $48 \times 48\text{dp}$ on interactive mobile triggers.

---

## 5. 3D Procedural AI Orb Architecture (Three.js)

The signature RUBY AI Orb is built with Three.js using procedural composite geometry, PBR studio lighting, and zero external image/404 dependencies:
1. **Core Dark Nucleus**: `SphereGeometry` with low roughness, subtle rim reflection.
2. **Concentric Gyroscopic Rings**: `TorusGeometry` (inner and outer rings) rotating on dual axes with frame-rate independent exponential damping.
3. **Orbital Particle Vortex**: 600+ procedural point particles with radial luminance decay and dynamic expansion.
4. **9 Distinct States**:
   - `IDLE`: Ambient breathing cycle ($0.5\text{Hz}$)
   - `LISTENING`: Expanding waveform rings reacting to microphone volume
   - `PROCESSING`: High-velocity particle spin
   - `SPEAKING`: Audio-reactive pulse and warm amber luminescence
   - `THINKING`: Concentric counter-rotating gyroscopes
   - `CALLING`: Steady pulse with carrier telephony ring
   - `ERROR`: Crimson alert flare
   - `OFFLINE`: Graphite muted sleep state
   - `PRIVACY`: Microphone shield lockdown indicator
