/* ============================================================
   script.js — WebAR Solar System
   TY College Project  |  A-Frame + AR.js (Hiro Marker)
   ============================================================ */

'use strict';

// ─── Planet Data ────────────────────────────────────────────────────────────
const PLANETS = {
  sun: {
    name:    'The Sun',
    icon:    '☀️',
    type:    'G-Type Star',
    stats: [
      { label: 'Diameter',       value: '1,392,700 km' },
      { label: 'Surface Temp',   value: '5,500 °C' },
      { label: 'Age',            value: '4.6 Billion yrs' },
      { label: 'Mass',           value: '1.989 × 10³⁰ kg' },
    ],
    fact:    'The Sun accounts for 99.86% of all mass in the Solar System. Its core reaches 15 million °C, fusing 620 million tonnes of hydrogen every second.',
    moons:   [],
  },
  mercury: {
    name:    'Mercury',
    icon:    '🪨',
    type:    'Terrestrial Planet',
    stats: [
      { label: 'Diameter',       value: '4,879 km' },
      { label: 'Day Length',     value: '58.6 Earth days' },
      { label: 'Year Length',    value: '88 Earth days' },
      { label: 'Avg Temp',       value: '-80 to 430 °C' },
    ],
    fact:    'Mercury has no atmosphere to retain heat, so temperatures swing wildly — hotter than an oven by day, colder than Antarctica at night.',
    moons:   [],
  },
  venus: {
    name:    'Venus',
    icon:    '🌕',
    type:    'Terrestrial Planet',
    stats: [
      { label: 'Diameter',       value: '12,104 km' },
      { label: 'Day Length',     value: '243 Earth days' },
      { label: 'Year Length',    value: '225 Earth days' },
      { label: 'Avg Temp',       value: '465 °C' },
    ],
    fact:    'Venus rotates backwards compared to most planets — and its day is longer than its year! Its thick CO₂ atmosphere creates a runaway greenhouse effect.',
    moons:   [],
  },
  earth: {
    name:    'Earth',
    icon:    '🌍',
    type:    'Terrestrial Planet',
    stats: [
      { label: 'Diameter',       value: '12,742 km' },
      { label: 'Day Length',     value: '24 hours' },
      { label: 'Year Length',    value: '365.25 days' },
      { label: 'Avg Temp',       value: '15 °C' },
    ],
    fact:    'Earth is the densest planet in the Solar System and the only one known to harbor life. 71% of its surface is covered by liquid water.',
    moons:   ['The Moon 🌕'],
  },
  mars: {
    name:    'Mars',
    icon:    '🔴',
    type:    'Terrestrial Planet',
    stats: [
      { label: 'Diameter',       value: '6,779 km' },
      { label: 'Day Length',     value: '24.6 hours' },
      { label: 'Year Length',    value: '687 Earth days' },
      { label: 'Avg Temp',       value: '-63 °C' },
    ],
    fact:    'Mars hosts Olympus Mons — the tallest volcano in the Solar System at 22 km high — and Valles Marineris, a canyon system as long as the USA is wide.',
    moons:   ['Phobos 🌑', 'Deimos 🌑'],
  },
  jupiter: {
    name:    'Jupiter',
    icon:    '🪐',
    type:    'Gas Giant',
    stats: [
      { label: 'Diameter',       value: '139,820 km' },
      { label: 'Day Length',     value: '9.9 hours' },
      { label: 'Year Length',    value: '11.9 Earth yrs' },
      { label: 'Avg Temp',       value: '-110 °C (cloud top)' },
    ],
    fact:    'Jupiter\'s Great Red Spot is a storm that has raged for over 350 years. It is large enough to swallow three Earths whole.',
    moons:   ['Io 🌋', 'Europa 🧊', 'Ganymede 🌑', 'Callisto 🌑', '+91 more'],
  },
  saturn: {
    name:    'Saturn',
    icon:    '🪐',
    type:    'Gas Giant',
    stats: [
      { label: 'Diameter',       value: '116,460 km' },
      { label: 'Day Length',     value: '10.7 hours' },
      { label: 'Year Length',    value: '29.5 Earth yrs' },
      { label: 'Ring Span',      value: '~282,000 km' },
    ],
    fact:    'Saturn is the least dense planet — less dense than water! If you had a bathtub big enough, Saturn would float in it. Its rings are 90–95% pure water ice.',
    moons:   ['Titan 🧪', 'Enceladus 💧', 'Mimas 🎮', '+143 more'],
  },
};

// ─── DOM Refs ────────────────────────────────────────────────────────────────
const splash         = document.getElementById('splash');
const startBtn       = document.getElementById('start-btn');
const notSupported   = document.getElementById('not-supported-msg');
const arWrapper      = document.getElementById('ar-scene-wrapper');
const hud            = document.getElementById('hud');
const exitBtn        = document.getElementById('exit-btn');
const statusBar      = document.getElementById('status-bar');
const statusTxt      = document.getElementById('status-txt');
const infoPanel      = document.getElementById('info-panel');
const closePanelBtn  = document.getElementById('close-panel-btn');
const helpTip        = document.getElementById('help-tip');

// Panel inner elements
const panelIcon      = document.getElementById('panel-planet-icon');
const panelName      = document.getElementById('panel-planet-name');
const panelType      = document.getElementById('panel-planet-type');
const panelStats     = document.getElementById('panel-stats');
const panelFact      = document.getElementById('panel-fact');
const panelMoons     = document.getElementById('panel-moons');

// ─── State ───────────────────────────────────────────────────────────────────
let markerVisible  = false;
let helpTimer      = null;
let activePlanet   = null;
let helpShown      = false;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Update the status pill text and style class */
function setStatus(text, cls = '') {
  statusTxt.innerHTML = text;
  statusBar.className = cls;
  statusBar.style.opacity = '1';
}

/** Fade-out + hide status bar after delay */
function fadeStatus(delay = 2800) {
  setTimeout(() => { statusBar.style.opacity = '0'; }, delay);
}

// ─── AR.js Support Check ─────────────────────────────────────────────────────
function checkSupport() {
  // AR.js works in any browser with getUserMedia (camera access)
  const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  if (!hasCamera) {
    notSupported.style.display = 'block';
    startBtn.disabled = true;
    startBtn.textContent = '⚠️ Camera Not Available';
  }
}

// ─── Launch AR ───────────────────────────────────────────────────────────────
function launchAR() {
  splash.classList.add('hide');

  setTimeout(() => {
    splash.style.display    = 'none';
    arWrapper.style.display = 'block';
    hud.style.display       = 'flex';
    statusBar.style.display = 'block';
    setStatus('<span class="pulse-dot"></span> Point your camera at the <strong>Hiro marker</strong>');
    startHelpTimer();
  }, 600);
}

// ─── Show help tip after 8 s of no marker ────────────────────────────────────
function startHelpTimer() {
  helpTimer = setTimeout(() => {
    if (!markerVisible && !helpShown) {
      helpTip.style.display = 'block';
      helpShown = true;
    }
  }, 8000);
}

// ─── Marker Events (from A-Frame components) ─────────────────────────────────
window.addEventListener('markerFound', () => {
  markerVisible = true;
  clearTimeout(helpTimer);
  helpTip.style.display = 'none';
  setStatus('<span class="pulse-dot"></span> Marker detected — Tap a planet!', 'active');

  // Animate solar system entities in
  document.querySelectorAll('[data-planet]').forEach(el => {
    el.setAttribute('animation__scale', 'property:scale; from: 0 0 0; to: 1 1 1; dur: 600; easing: easeOutBack');
  });
});

window.addEventListener('markerLost', () => {
  markerVisible = false;
  setStatus('<span class="pulse-dot"></span> Marker lost — point back at the Hiro marker');
  startHelpTimer();
});

// ─── Planet Tap Handler ───────────────────────────────────────────────────────
window.addEventListener('planetTapped', (e) => {
  const key = e.detail && e.detail.planet;
  if (!key || !PLANETS[key]) return;
  openPanel(key);
});

// ─── Panel: Open ─────────────────────────────────────────────────────────────
function openPanel(key) {
  const p = PLANETS[key];
  activePlanet = key;

  // Populate header
  panelIcon.textContent = p.icon;
  panelName.textContent = p.name;
  panelType.textContent = p.type;

  // Populate stats grid
  panelStats.innerHTML = p.stats.map(s => `
    <div class="stat-card">
      <div class="stat-label">${s.label}</div>
      <div class="stat-value">${s.value}</div>
    </div>
  `).join('');

  // Populate fun fact
  panelFact.textContent = p.fact;

  // Moons
  panelMoons.innerHTML = '';
  if (p.moons.length > 0) {
    const label = document.createElement('div');
    label.className = 'fact-label';
    label.textContent = '🌑 Known Moons';
    panelMoons.appendChild(label);
    const row = document.createElement('div');
    row.className = 'moons-row';
    p.moons.forEach(m => {
      const badge = document.createElement('span');
      badge.className = 'moon-badge';
      badge.textContent = m;
      row.appendChild(badge);
    });
    panelMoons.appendChild(row);
  }

  infoPanel.classList.add('open');
  hud.style.pointerEvents = 'none';   // prevent accidental exit during panel
}

// ─── Panel: Close ────────────────────────────────────────────────────────────
function closePanel() {
  infoPanel.classList.remove('open');
  activePlanet = null;
  hud.style.pointerEvents = 'all';
}

// ─── Exit AR ─────────────────────────────────────────────────────────────────
function exitAR() {
  closePanel();
  arWrapper.style.display = 'none';
  hud.style.display       = 'none';
  statusBar.style.display = 'none';
  helpTip.style.display   = 'none';
  splash.style.display    = 'flex';
  splash.classList.remove('hide');
  markerVisible = false;
  helpShown     = false;
  clearTimeout(helpTimer);
}

// ─── A-Frame Custom Component: planet-tap ────────────────────────────────────
// Registers a component that listens for click on an a-entity and dispatches
// a "planetTapped" window event with the planet key.
AFRAME.registerComponent('planet-tap', {
  schema: { planet: { type: 'string', default: '' } },
  init() {
    this.el.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('planetTapped', {
        detail: { planet: this.data.planet }
      }));
    });
    // Visual hover feedback via cursor
    this.el.addEventListener('mouseenter', () => {
      this.el.setAttribute('animation__hover',
        'property: scale; to: 1.25 1.25 1.25; dur: 250; easing: easeOutSine');
    });
    this.el.addEventListener('mouseleave', () => {
      this.el.setAttribute('animation__hover',
        'property: scale; to: 1 1 1; dur: 250; easing: easeOutSine');
    });
  },
});

// ─── A-Frame Custom Component: orbit ─────────────────────────────────────────
// Rotates parent entity around Y axis (orbital revolution).
AFRAME.registerComponent('orbit', {
  schema: { duration: { type: 'number', default: 8000 } },
  init() {
    this.angle = 0;
    this.speed = (2 * Math.PI) / (this.data.duration / 1000);
  },
  tick(time, delta) {
    this.angle += this.speed * (delta / 1000);
    this.el.object3D.rotation.y = this.angle;
  },
});

// ─── Event Listeners ─────────────────────────────────────────────────────────
startBtn.addEventListener('click', launchAR);
exitBtn.addEventListener('click', exitAR);
closePanelBtn.addEventListener('click', closePanel);

// Swipe down on panel to close
let panelTouchStartY = 0;
infoPanel.addEventListener('touchstart', e => {
  panelTouchStartY = e.touches[0].clientY;
}, { passive: true });
infoPanel.addEventListener('touchend', e => {
  const dy = e.changedTouches[0].clientY - panelTouchStartY;
  if (dy > 60) closePanel();
}, { passive: true });

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  checkSupport();
});
