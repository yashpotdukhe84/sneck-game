# 🐍 Snake & Snack Arcade (Deluxe Edition)

A responsive, feature-packed modern web game built with **Vanilla HTML5, CSS3, and JavaScript**. Designed with a cyber-arcade aesthetic, smooth animations, procedural synthesizer audio, custom skins, dynamic snack themes, and mobile touch support.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Vanilla JS](https://img.shields.io/badge/Pure-Vanilla%20JS-yellow.svg)
![Web Audio](https://img.shields.io/badge/Audio-Web%20Audio%20API-brightgreen.svg)

---

## 🌟 Key Features

### 1. 🕹️ Dynamic Gameplay & Game Modes
- **Classic Mode**: Traditional snake challenge—walls and self-collision are lethal.
- **Arcade Frenzy Mode**: Random special snacks, power-up items, and speed multipliers.
- **Zen Mode**: Relaxing gameplay with wrap-around boundaries (no death from wall collisions).
- **Difficulty Speed Selector**: Easy (Relaxed), Normal (Balanced), Hard (Fast), Insane (Hyper-speed).

### 2. 🍔 Delicious Snack Variety & Themes
Switch between 4 customizable culinary snack themes on the fly:
- **Fast Food Feast**: Burger 🍔 (+10), Pizza 🍕 (+25), Donut 🍩 (+50), French Fries 🍟 (+100).
- **Fruit Garden**: Apple 🍎 (+10), Strawberry 🍓 (+25), Watermelon 🍉 (+50), Golden Pineapple 🍍 (+100).
- **Sweet Candyland**: Candy 🍬 (+10), Lollipop 🍭 (+25), Chocolate 🍫 (+50), Cupcake 🧁 (+100).
- **Arcade Gems**: Emerald 🟢 (+10), Sapphire 🔷 (+25), Amethyst 🟣 (+50), Diamond 💎 (+100).

### 3. ✨ Special Power-Ups (Arcade Mode)
- ⚡ **Speed Surge**: 2x speed burst with double points for 6 seconds.
- 👻 **Ghost Phase**: Phase through walls and snake segments without collision.
- 🧊 **Slow Motion (Freeze)**: Reduces snake speed for surgical control in tight spaces.
- ✂️ **Tail Trimmer**: Instantly snips back 3 body segments.

### 4. 🎨 Snake Skins & Visual Polish
- **5 Unlockable/Selectable Skins**:
  - *Neon Cyan* (Cyberpunk classic)
  - *Cyber Magenta* (Neon synthwave)
  - *Toxic Lime* (Radioactive glow)
  - *Golden King* (Solar gold prestige)
  - *Rainbow Prism* (Dynamic animated HSL color spectrum)
- **Living Snake Head**: Animated eyes that dynamically look in the direction the snake is traveling.
- **Particle System**: Sparkle bursts on munching snacks, collision impacts, poofs on item expiration, and celebratory confetti when breaking high scores.

### 5. 🔊 Procedural Web Audio Engine (Zero Lag, No External Files)
- 100% synthesized in real-time via the browser's **Web Audio API**.
- Munch sound effects that pitch-shift with higher snack values.
- Rising combo fanfares.
- Retro 8-bit chiptune/synthwave arpeggio background music with real-time toggle.

### 6. 📱 Responsive & Mobile-Ready
- **Dynamic HiDPI Canvas**: Automatically adjusts to `window.devicePixelRatio` for sharp rendering on 4K monitors and Retina displays.
- **Touch Swipe Gestures**: Smooth directional swipes on touchscreens.
- **Virtual Glass D-Pad**: On-screen tactile controls with active feedback.
- **Haptic Feedback**: Subtle vibration on mobile devices (`navigator.vibrate`).

### 7. 🏆 Combo System, Stats & Achievements
- **Combo Multiplier (up to 5x)**: Eat snacks quickly within 4.2 seconds to trigger score multipliers.
- **10 Achievements**: Tracked and saved in `localStorage`.
- **Game Over Breakdown**: Shows snacks eaten, max length, time survived, and peak combo with a one-click "Share Score" button.

---

## 🎮 Controls

| Action | Desktop Keyboard | Mobile / Touch |
| :--- | :--- | :--- |
| **Move Up** | <kbd>W</kbd> or <kbd>↑</kbd> | Swipe Up / D-Pad <kbd>▲</kbd> |
| **Move Down** | <kbd>S</kbd> or <kbd>↓</kbd> | Swipe Down / D-Pad <kbd>▼</kbd> |
| **Move Left** | <kbd>A</kbd> or <kbd>←</kbd> | Swipe Left / D-Pad <kbd>◀</kbd> |
| **Move Right** | <kbd>D</kbd> or <kbd>→</kbd> | Swipe Right / D-Pad <kbd>▶</kbd> |
| **Pause / Resume** | <kbd>Space</kbd> or <kbd>P</kbd> | Mobile Pause Button <kbd>⏸️</kbd> |
| **Restart Game** | <kbd>R</kbd> | Mobile Restart Button <kbd>🔄</kbd> |
| **Toggle Music** | <kbd>M</kbd> | Top Bar Music Icon <kbd>🎵</kbd> |

---

## 🚀 How to Run the Project

No build steps or Node.js required! You can open the project immediately:

### Option 1: Direct Browser Open
Double-click `index.html` or open it in any modern browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server (Optional)
Run Python's built-in web server or any static server:
```bash
# In d:\Game directory:
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

---

## 📁 File Structure

```text
d:\Game/
├── index.html        # Semantic HTML5 layout, HUD, overlays, and modals
├── style.css         # Cyber-arcade glassmorphic styling, responsive layout, animations
├── audio.js          # Procedural Web Audio API sound synthesis and BGM engine
├── script.js         # Canvas rendering, snake physics, combo & particle system, storage
└── README.md         # Project documentation and guide
```

---

## 💡 Tech Stack
- **HTML5 Canvas & Semantic Tags**
- **Modern CSS3** (Flexbox, CSS Grid, Custom Properties, Glassmorphism, Backdrop Filters)
- **Vanilla JavaScript ES6+** (Zero external libraries or framework overhead)
- **Web Audio API**
- **Web Storage API (`localStorage`)**
