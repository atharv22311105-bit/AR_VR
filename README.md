# WebAR Solar System
### TY College Project — A-Frame + AR.js (Hiro Marker)

> **Demo Stack:** HTML5 · CSS3 · JavaScript (ES6+) · [A-Frame 1.4.2](https://aframe.io) · [AR.js](https://ar-js-org.github.io/AR.js-Docs/)

---

## 📁 Project Structure

```
AR_VR/
├── index.html   — A-Frame scene + all UI overlays
├── script.js    — Interaction logic, planet data, A-Frame components
├── style.css    — Design system, animations, info-panel styles
└── README.md    — This file
```

---

## 🚀 How to Run Locally

> **Important:** Browsers block camera access on plain `file://` URLs.  
> You **must** serve the files over HTTP/HTTPS.

### Option A — VS Code Live Server (recommended)
1. Open the `AR_VR` folder in **VS Code**.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` → **Open with Live Server**.
4. Your browser opens at `http://127.0.0.1:5500`.

### Option B — Python built-in server
```bash
# Navigate to the project folder in terminal
cd "C:\Users\Athharvv Somani\OneDrive\Desktop\AR_VR"

# Python 3
python -m http.server 8080
```
Then open `http://localhost:8080` in your browser.

### Option C — Node.js http-server
```bash
npx -y http-server . -p 8080
```

### Testing on Mobile (required for real AR)
1. Make sure your **PC and phone are on the same Wi-Fi network**.
2. Find your PC's local IP: run `ipconfig` → look for **IPv4 Address** (e.g. `192.168.1.12`).
3. On your phone browser, open `http://192.168.1.12:8080`.
4. Grant camera permission when prompted.
5. Hold the **Hiro marker** in front of the camera.

---

## 🖨️ Hiro Marker

The app uses the **standard Hiro marker** bundled with AR.js.

| Method | Steps |
|--------|-------|
| **Print** | Open [this link](https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png) → print at 15–20 cm square on white paper |
| **Screen** | Open the same link on a tablet or second screen |
| **PDF** | Google "AR.js Hiro marker PDF" for a print-ready version |

**Tips for reliable tracking:**
- Good, even lighting — no harsh shadows across the marker
- Flat surface — don't crumple or fold the marker
- Keep the marker fully in frame; don't tilt more than ~45°
- Minimum marker size: ~12 cm on screen for reliable detection

---

## 🌌 Features

| Feature | Description |
|---------|-------------|
| **8 Planets** | Mercury → Neptune, all orbiting the Sun with correct relative speed |
| **Saturn's Rings** | Dual-layer ring disc with tilt |
| **Earth's Moon** | Orbiting the Earth in real-time |
| **Tap-to-Info** | Tap any planet to open a slide-up panel with stats & a fun fact |
| **Animated Orbitals** | Each planet revolves around the Sun via a custom A-Frame component |
| **Live Status** | HUD pill tracks marker detection state |
| **Help Tip** | Auto-shows a hint if no marker is detected after 8 seconds |
| **Swipe to Close** | Drag the info panel down (or tap ✕) to dismiss it |

---

## 🏗️ Architectural Overview
*(For use in College Project Report)*

### Technology Choices

| Layer | Technology | Reason |
|-------|-----------|--------|
| 3D Rendering | **A-Frame 1.4.2** | Declarative HTML-based WebGL; no heavy engine needed |
| AR Tracking | **AR.js** (marker-based) | Works in standard mobile browsers; no app install |
| Styling | **Vanilla CSS** + CSS custom properties | Full control, zero dependencies |
| Logic | **ES6 JavaScript** | Custom A-Frame components + DOM interaction |

### Architecture Diagram

```
Browser (Chrome Android / Safari iOS)
│
├── index.html
│   ├── <a-scene arjs="...">          ← AR.js intercepts webcam feed
│   │   └── <a-marker preset="hiro">  ← Tracks Hiro marker via AR.js
│   │       ├── <a-entity orbit>      ← Custom A-Frame component (script.js)
│   │       └── <a-sphere planet-tap> ← Custom A-Frame component (script.js)
│   │
│   ├── #splash       ← Landing screen (CSS animated)
│   ├── #hud          ← Top bar (exit button)
│   ├── #status-bar   ← Live marker detection feedback
│   └── #info-panel   ← Slide-up planet facts panel
│
├── style.css          ← All visual styling (dark glassmorphism theme)
└── script.js
    ├── PLANETS{}      ← Planet data (name, stats, facts, moons)
    ├── AFRAME.registerComponent('orbit')      ← Tick-based revolution
    ├── AFRAME.registerComponent('planet-tap') ← Click → info panel
    ├── openPanel() / closePanel()             ← DOM panel logic
    └── markerFound / markerLost listeners     ← Status updates
```

### Data Flow

```
User taps planet (touch event)
  → planet-tap A-Frame component fires
  → dispatches window CustomEvent "planetTapped" { planet: "mars" }
  → script.js openPanel("mars")
  → Looks up PLANETS["mars"]
  → Injects HTML into #info-panel DOM nodes
  → Adds CSS class "open" → CSS transition slides panel up
```

### Key A-Frame Concepts Used

1. **`<a-marker>`** — AR.js marker entity; all scene content is a child
2. **`orbit` component** — Custom `tick(time, delta)` component that advances `rotation.y` each frame based on elapsed delta time
3. **`planet-tap` component** — Attaches `click` listener (A-Frame cursor raycast) to spheres and bridges to vanilla JS via window events
4. **`animation` attribute** — Declarative keyframe animations (rotation, scale) without JavaScript
5. **`raycaster`** — AR.js cursor entity that casts a ray from screen-center into the 3D scene for touch-click detection

---

## 🔧 Possible Extensions (for viva / report)

- **Texture maps** — Replace flat colors with NASA texture PNGs (`<a-sphere src="#earth-texture">`)
- **Audio** — Play ambient space sounds on marker detection using the Web Audio API
- **Multi-marker** — Use different AR.js markers for different planet groups
- **WebXR Surface** — Replace marker tracking with hit-test surface placement (see `ar.html` in project)
- **Quiz mode** — After reading facts, ask a multiple-choice question about the planet

---

## 📋 Dependencies (CDN — no install needed)

```html
<!-- A-Frame 3D engine -->
<script src="https://aframe.io/releases/1.4.2/aframe.min.js"></script>

<!-- AR.js marker tracking -->
<script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
```

No `npm install`, no build step — just serve the files and open in a browser.

---

## 👨‍💻 Credits

- **AR.js** — Open source marker AR for the web · [ar-js-org.github.io](https://ar-js-org.github.io/AR.js-Docs/)
- **A-Frame** — Mozilla WebVR framework · [aframe.io](https://aframe.io)
- **Outfit Font** — Google Fonts
- Planet data sourced from NASA Solar System Exploration

---

*Built as a Third Year (TY) college project demonstrating Web-based Augmented Reality without native apps or proprietary engines.*
