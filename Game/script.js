/* =========================================================
   SNAKE & SNACK ARCADE - DELUXE GAME ENGINE
   Features:
   - Dynamic 60+ FPS Canvas Renderer with HiDPI support
   - Multi-Theme Snack System & Power-ups
   - Smooth Particles, Floating Text & Confetti
   - Custom Snake Skins & Animated Eyes
   - Combo Multiplier System
   - Robust Input Buffering (Keyboard, Swipe, D-Pad)
   - Achievements & LocalStorage Persistence
   ========================================================= */

(function() {
  'use strict';

  // --- CONFIGURATION & CONSTANTS ---
  const GRID_SIZE = 22; // 22 x 22 grid

  const SPEEDS = {
    easy: 140,     // ms per tick
    normal: 105,
    hard: 75,
    insane: 50
  };

  const DIRECTIONS = {
    UP:    { x:  0, y: -1 },
    DOWN:  { x:  0, y:  1 },
    LEFT:  { x: -1, y:  0 },
    RIGHT: { x:  1, y:  0 }
  };

  // Snack Themes definitions
  const SNACK_THEMES = {
    fastfood: {
      name: "Fast Food Feast",
      items: [
        { type: "apple", emoji: "🍔", points: 10, color: "#f39c12", label: "Burger" },
        { type: "super", emoji: "🍕", points: 25, color: "#e74c3c", label: "Pizza Slice" },
        { type: "donut", emoji: "🍩", points: 50, color: "#e84393", label: "Donut" },
        { type: "gem",   emoji: "🍟", points: 100, color: "#f1c40f", label: "French Fries" }
      ]
    },
    fruits: {
      name: "Fruit Garden",
      items: [
        { type: "apple", emoji: "🍎", points: 10, color: "#ff4757", label: "Red Apple" },
        { type: "super", emoji: "🍓", points: 25, color: "#e84118", label: "Strawberry" },
        { type: "donut", emoji: "🍉", points: 50, color: "#2ed573", label: "Watermelon" },
        { type: "gem",   emoji: "🍍", points: 100, color: "#ffa502", label: "Golden Pineapple" }
      ]
    },
    candies: {
      name: "Sweet Candyland",
      items: [
        { type: "apple", emoji: "🍬", points: 10, color: "#00d2d3", label: "Candy" },
        { type: "super", emoji: "🍭", points: 25, color: "#ff9ff3", label: "Lollipop" },
        { type: "donut", emoji: "🍫", points: 50, color: "#a55eea", label: "Chocolate" },
        { type: "gem",   emoji: "🧁", points: 100, color: "#feca57", label: "Cupcake" }
      ]
    },
    jewels: {
      name: "Arcade Gems",
      items: [
        { type: "apple", emoji: "🟢", points: 10, color: "#2ecc71", label: "Emerald" },
        { type: "super", emoji: "🔷", points: 25, color: "#3498db", label: "Sapphire" },
        { type: "donut", emoji: "🟣", points: 50, color: "#9b59b6", label: "Amethyst" },
        { type: "gem",   emoji: "💎", points: 100, color: "#00f5d4", label: "Diamond" }
      ]
    }
  };

  // Snake Skins definitions
  const SKINS = {
    cyan: {
      name: "Neon Cyan",
      headColor: "#00f5d4",
      bodyColor: "#00bbf9",
      glowColor: "rgba(0, 245, 212, 0.6)",
      eyeColor: "#050811"
    },
    pink: {
      name: "Cyber Magenta",
      headColor: "#f72585",
      bodyColor: "#7209b7",
      glowColor: "rgba(247, 37, 133, 0.6)",
      eyeColor: "#ffffff"
    },
    toxic: {
      name: "Toxic Lime",
      headColor: "#39ff14",
      bodyColor: "#10b981",
      glowColor: "rgba(57, 255, 20, 0.6)",
      eyeColor: "#041608"
    },
    gold: {
      name: "Golden King",
      headColor: "#ffbe0b",
      bodyColor: "#fb5607",
      glowColor: "rgba(255, 190, 11, 0.6)",
      eyeColor: "#000000"
    },
    rainbow: {
      name: "Rainbow Prism",
      headColor: "#ff007f",
      bodyColor: "rainbow",
      glowColor: "rgba(255, 255, 255, 0.6)",
      eyeColor: "#ffffff"
    }
  };

  // Power-up types
  const POWERUPS = {
    SPEED: {
      type: "SPEED",
      name: "Speed Surge",
      emoji: "⚡",
      duration: 6000,
      color: "#ffbe0b",
      effect: "Double Points & Turbo Speed!"
    },
    GHOST: {
      type: "GHOST",
      name: "Ghost Mode",
      emoji: "👻",
      duration: 6500,
      color: "#70a1ff",
      effect: "Phase through walls & tail!"
    },
    FREEZE: {
      type: "FREEZE",
      name: "Slow Motion",
      emoji: "🧊",
      duration: 6000,
      color: "#00d2d3",
      effect: "Relaxed speed control!"
    },
    SNIP: {
      type: "SNIP",
      name: "Tail Trimmer",
      emoji: "✂️",
      duration: 0, // Instant
      color: "#ff4757",
      effect: "Trimmed 3 segments!"
    }
  };

  // Achievements definitions
  const ACHIEVEMENTS = [
    { id: "first_bite", title: "First Snack", desc: "Eat your very first delicious snack", icon: "🍎" },
    { id: "snack_25", title: "Snack Feast", desc: "Eat 25 snacks in a single run", icon: "🍕" },
    { id: "combo_3", title: "Combo Master", desc: "Reach a 3x Combo multiplier", icon: "⚡" },
    { id: "combo_5", title: "Combo God", desc: "Reach the maximum 5x Combo multiplier", icon: "🔥" },
    { id: "len_20", title: "Growing Serpent", desc: "Reach a length of 20 segments", icon: "🐍" },
    { id: "len_40", title: "Centipede Titan", desc: "Reach an enormous length of 40 segments", icon: "🐉" },
    { id: "score_500", title: "Arcade Legend", desc: "Score 500 or more points in one game", icon: "🏆" },
    { id: "score_1000", title: "Grand Champion", desc: "Score 1,000 points in one game", icon: "👑" },
    { id: "ghost_eat", title: "Phantom Hunter", desc: "Eat a snack while in Ghost Mode", icon: "👻" },
    { id: "zen_master", title: "Zen Master", desc: "Survive over 2 minutes without crashing", icon: "🧘" }
  ];

  // --- STATE ---
  let canvas, ctx;
  let canvasWidth, canvasHeight, cellSize;
  
  // Game states
  let isRunning = false;
  let isPaused = false;
  let gameMode = "classic"; // "classic", "arcade", "zen"
  let currentDifficulty = "normal";
  let activeSkin = "cyan";
  let activeTheme = "fastfood";
  
  // Snake state
  let snake = [];
  let direction = DIRECTIONS.RIGHT;
  let inputQueue = [];
  let score = 0;
  let highScore = 0;
  let snacksEaten = 0;
  let startTime = 0;
  let runDuration = 0;

  // Food and power-up items
  let activeFood = null;
  let specialFood = null;
  let specialFoodTimer = 0;
  let activePowerup = null; // Currently spawning pickup on map
  let powerupTimer = 0;
  let appliedPowerup = null; // Active buff currently on snake
  let powerupExpiresAt = 0;
  let powerupMaxDuration = 0;

  // Combo system
  let comboCount = 1;
  let comboTimer = 0;
  const COMBO_WINDOW = 4200; // ms
  let maxComboThisRun = 1;

  // Particle and visual effects
  let particles = [];
  let floatingTexts = [];
  let confetti = [];

  // Timing
  let lastTickTime = 0;
  let animationFrameId = null;

  // Achievements cache
  let unlockedAchievements = new Set();

  // --- LOCAL STORAGE HANDLING ---
  function loadPersistedData() {
    try {
      highScore = parseInt(localStorage.getItem("snack_high_score")) || 0;
      activeSkin = localStorage.getItem("snack_skin") || "cyan";
      activeTheme = localStorage.getItem("snack_theme") || "fastfood";
      currentDifficulty = localStorage.getItem("snack_difficulty") || "normal";
      gameMode = localStorage.getItem("snack_mode") || "classic";

      const savedAch = JSON.parse(localStorage.getItem("snack_achievements") || "[]");
      savedAch.forEach(id => unlockedAchievements.add(id));
    } catch (e) {
      console.warn("Could not load from localStorage", e);
    }
  }

  function savePersistedData() {
    try {
      localStorage.setItem("snack_high_score", highScore);
      localStorage.setItem("snack_skin", activeSkin);
      localStorage.setItem("snack_theme", activeTheme);
      localStorage.setItem("snack_difficulty", currentDifficulty);
      localStorage.setItem("snack_mode", gameMode);
      localStorage.setItem("snack_achievements", JSON.stringify(Array.from(unlockedAchievements)));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }

  // --- INITIALIZATION ---
  function init() {
    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");

    loadPersistedData();
    setupCanvasResolution();
    bindEvents();
    renderCustomizationSelectors();
    updateUIElements();

    // Initial canvas render background
    drawGrid();
  }

  function setupCanvasResolution() {
    const container = document.getElementById("canvas-container");
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const size = Math.floor(rect.width);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.scale(dpr, dpr);
    canvasWidth = size;
    canvasHeight = size;
    cellSize = size / GRID_SIZE;
  }

  window.addEventListener("resize", () => {
    setupCanvasResolution();
    if (!isRunning) {
      drawStaticScene();
    }
  });

  // --- GAMEPLAY LOGIC ---
  function startNewGame() {
    sound.ensureContext();
    sound.playClick();

    // Reset game state
    snake = [
      { x: 6, y: 10 },
      { x: 5, y: 10 },
      { x: 4, y: 10 }
    ];
    direction = DIRECTIONS.RIGHT;
    inputQueue = [];
    score = 0;
    snacksEaten = 0;
    comboCount = 1;
    comboTimer = 0;
    maxComboThisRun = 1;
    startTime = Date.now();
    runDuration = 0;
    particles = [];
    floatingTexts = [];
    confetti = [];
    specialFood = null;
    activePowerup = null;
    appliedPowerup = null;

    isRunning = true;
    isPaused = false;
    lastTickTime = performance.now();

    // Spawn first food
    spawnFood();

    // Hide overlays & modals
    document.getElementById("start-overlay").classList.add("hidden");
    document.getElementById("pause-overlay").classList.add("hidden");
    document.getElementById("game-over-modal").classList.add("hidden");
    hideActivePowerupUI();

    updateUIElements();

    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(gameLoop);
  }

  function pauseGame() {
    if (!isRunning) return;
    isPaused = true;
    sound.playClick();
    document.getElementById("pause-overlay").classList.remove("hidden");
  }

  function resumeGame() {
    if (!isRunning) return;
    isPaused = false;
    sound.playClick();
    document.getElementById("pause-overlay").classList.add("hidden");
    lastTickTime = performance.now();
  }

  function togglePause() {
    if (!isRunning) return;
    if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  }

  function gameOver(cause = "Game Over!") {
    isRunning = false;
    sound.playGameOver();
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

    runDuration = Math.floor((Date.now() - startTime) / 1000);

    // Check for high score
    const isNewRecord = score > highScore;
    if (isNewRecord) {
      highScore = score;
      savePersistedData();
      sound.playHighScore();
      createConfetti();
    }

    // Check achievements
    checkAchievementsAtGameOver();

    // Show Game Over Modal
    document.getElementById("modal-trophy-badge").classList.toggle("hidden", !isNewRecord);
    document.getElementById("game-over-cause").textContent = cause;
    document.getElementById("final-score").textContent = score.toLocaleString();
    document.getElementById("stat-snacks-eaten").textContent = snacksEaten;
    document.getElementById("stat-max-length").textContent = snake.length;
    document.getElementById("stat-max-combo").textContent = `${maxComboThisRun}x`;
    
    const minutes = Math.floor(runDuration / 60);
    const seconds = runDuration % 60;
    document.getElementById("stat-time-survived").textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    document.getElementById("game-over-modal").classList.remove("hidden");
    updateUIElements();
  }

  // --- SPAWNING MECHANICS ---
  function getRandomGridPosition() {
    let position;
    let collision;
    let attempts = 0;

    do {
      collision = false;
      position = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };

      // Check collision with snake
      for (const seg of snake) {
        if (seg.x === position.x && seg.y === position.y) {
          collision = true;
          break;
        }
      }

      // Check collision with other items
      if (activeFood && activeFood.x === position.x && activeFood.y === position.y) collision = true;
      if (specialFood && specialFood.x === position.x && specialFood.y === position.y) collision = true;
      if (activePowerup && activePowerup.x === position.x && activePowerup.y === position.y) collision = true;

      attempts++;
    } while (collision && attempts < 200);

    return position;
  }

  function spawnFood() {
    const pos = getRandomGridPosition();
    const themeItems = SNACK_THEMES[activeTheme].items;
    const baseItem = themeItems[0]; // base snack

    activeFood = {
      x: pos.x,
      y: pos.y,
      ...baseItem,
      pulse: 0
    };

    // Chance to spawn a special snack in Arcade or Classic mode
    if (!specialFood && Math.random() < 0.28 && snacksEaten >= 2) {
      spawnSpecialFood();
    }

    // Chance to spawn power-up in Arcade mode
    if (gameMode === "arcade" && !activePowerup && Math.random() < 0.22) {
      spawnPowerup();
    }
  }

  function spawnSpecialFood() {
    const pos = getRandomGridPosition();
    const themeItems = SNACK_THEMES[activeTheme].items;
    // pick 2nd, 3rd, or 4th item randomly
    const idx = 1 + Math.floor(Math.random() * (themeItems.length - 1));
    const item = themeItems[idx];

    specialFood = {
      x: pos.x,
      y: pos.y,
      ...item,
      pulse: 0,
      lifespan: 11000, // 11 seconds to grab it
      maxLifespan: 11000
    };
  }

  function spawnPowerup() {
    const pos = getRandomGridPosition();
    const powerKeys = Object.keys(POWERUPS);
    const key = powerKeys[Math.floor(Math.random() * powerKeys.length)];
    const pData = POWERUPS[key];

    activePowerup = {
      x: pos.x,
      y: pos.y,
      ...pData,
      pulse: 0,
      lifespan: 12000,
      maxLifespan: 12000
    };
  }

  // --- GAME LOOP ---
  function gameLoop(timestamp) {
    if (!isRunning) return;

    if (!isPaused) {
      const dt = timestamp - lastTickTime;
      const currentTickInterval = getEffectiveTickInterval();

      // Update Powerups and Combo timers
      updateTimers(dt);

      if (dt >= currentTickInterval) {
        stepGame();
        lastTickTime = timestamp;
      }

      // Update particles and floating texts every frame
      updateEffects(dt);
    }

    render();
    animationFrameId = requestAnimationFrame(gameLoop);
  }

  function getEffectiveTickInterval() {
    let interval = SPEEDS[currentDifficulty] || SPEEDS.normal;

    // Apply speed modifiers
    if (appliedPowerup && appliedPowerup.type === "SPEED") {
      interval = Math.round(interval * 0.65); // Faster
    } else if (appliedPowerup && appliedPowerup.type === "FREEZE") {
      interval = Math.round(interval * 1.55); // Slower
    }

    // Dynamic gradual speed increase as snake grows
    const speedBoostFactor = Math.min(snake.length * 0.5, 30);
    return Math.max(interval - speedBoostFactor, 38);
  }

  function updateTimers(dt) {
    // Combo timer
    if (comboCount > 1) {
      comboTimer -= dt;
      if (comboTimer <= 0) {
        comboCount = 1;
        comboTimer = 0;
        updateComboUI();
      } else {
        updateComboUI();
      }
    }

    // Special Food expiration
    if (specialFood) {
      specialFood.lifespan -= dt;
      if (specialFood.lifespan <= 0) {
        createPoofParticles(specialFood.x, specialFood.y, "#8e9bb0");
        specialFood = null;
      }
    }

    // Active power-up pickup expiration
    if (activePowerup) {
      activePowerup.lifespan -= dt;
      if (activePowerup.lifespan <= 0) {
        createPoofParticles(activePowerup.x, activePowerup.y, "#8e9bb0");
        activePowerup = null;
      }
    }

    // Applied power-up duration
    if (appliedPowerup) {
      const remaining = powerupExpiresAt - Date.now();
      if (remaining <= 0) {
        // Power-up ended
        addFloatingText("BUFF EXPIRED", snake[0].x * cellSize + cellSize / 2, snake[0].y * cellSize - 10, "#8e9bb0");
        appliedPowerup = null;
        hideActivePowerupUI();
      } else {
        updateActivePowerupUI(remaining);
      }
    }
  }

  // --- STEP TICK ---
  function stepGame() {
    // Process input buffer
    if (inputQueue.length > 0) {
      direction = inputQueue.shift();
    }

    // Calculate new head position
    const head = snake[0];
    let nextX = head.x + direction.x;
    let nextY = head.y + direction.y;

    // Handle Wall Collision depending on mode and power-up
    const isGhostMode = appliedPowerup && appliedPowerup.type === "GHOST";

    if (gameMode === "zen" || isGhostMode) {
      // Wrap around walls
      if (nextX < 0) nextX = GRID_SIZE - 1;
      else if (nextX >= GRID_SIZE) nextX = 0;
      if (nextY < 0) nextY = GRID_SIZE - 1;
      else if (nextY >= GRID_SIZE) nextY = 0;
    } else {
      // Classic wall collision
      if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE) {
        createImpactParticles(head.x, head.y);
        gameOver("You slammed into the wall!");
        return;
      }
    }

    // Handle Self-Collision (Ignore if Ghost Mode active)
    if (!isGhostMode) {
      // Snake head colliding with any segment (excluding tail which moves forward)
      for (let i = 0; i < snake.length - 1; i++) {
        if (snake[i].x === nextX && snake[i].y === nextY) {
          createImpactParticles(nextX, nextY);
          gameOver("You bit your own tail!");
          return;
        }
      }
    }

    const newHead = { x: nextX, y: nextY };
    snake.unshift(newHead);

    let hasEaten = false;

    // Check collision with Base Food
    if (activeFood && nextX === activeFood.x && nextY === activeFood.y) {
      consumeFood(activeFood);
      hasEaten = true;
      spawnFood();
    }
    // Check collision with Special Food
    else if (specialFood && nextX === specialFood.x && nextY === specialFood.y) {
      consumeFood(specialFood);
      hasEaten = true;
      specialFood = null;
    }

    // Check collision with Power-up pickup
    if (activePowerup && nextX === activePowerup.x && nextY === activePowerup.y) {
      consumePowerup(activePowerup);
      activePowerup = null;
    }

    // If no food eaten, remove snake tail
    if (!hasEaten) {
      snake.pop();
    }

    // Update stats
    updateUIElements();
    checkLiveAchievements();
  }

  // --- FOOD CONSUMPTION ---
  function consumeFood(foodItem) {
    snacksEaten++;
    if (navigator.vibrate) navigator.vibrate([25]);

    // Calculate score with combo multiplier and active powerups
    let multiplier = comboCount;
    if (appliedPowerup && appliedPowerup.type === "SPEED") {
      multiplier *= 2;
    }

    const pointsEarned = foodItem.points * multiplier;
    score += pointsEarned;

    // Trigger audio
    sound.playEat(foodItem.type);

    // Particle explosion
    createFoodParticles(foodItem.x, foodItem.y, foodItem.color, foodItem.emoji);

    // Floating score text
    const multLabel = multiplier > 1 ? ` (+${pointsEarned} x${multiplier}!)` : ` +${pointsEarned}`;
    addFloatingText(multLabel, foodItem.x * cellSize + cellSize / 2, foodItem.y * cellSize - 10, foodItem.color);

    // Update combo
    comboCount = Math.min(comboCount + 1, 5);
    comboTimer = COMBO_WINDOW;
    if (comboCount > maxComboThisRun) {
      maxComboThisRun = comboCount;
    }
    if (comboCount >= 2) {
      sound.playCombo(comboCount);
    }
    updateComboUI();

    // Check ghost eat achievement
    if (appliedPowerup && appliedPowerup.type === "GHOST") {
      unlockAchievement("ghost_eat");
    }
  }

  // --- POWER-UP APPLICATION ---
  function consumePowerup(pItem) {
    sound.playPowerup();
    createFoodParticles(pItem.x, pItem.y, pItem.color, pItem.emoji);

    if (pItem.type === "SNIP") {
      // Instant tail trim
      const trimmed = Math.min(3, Math.max(snake.length - 3, 0));
      for (let i = 0; i < trimmed; i++) {
        if (snake.length > 3) snake.pop();
      }
      addFloatingText("TRIMMED -3!", snake[0].x * cellSize + cellSize / 2, snake[0].y * cellSize - 10, "#ff4757");
    } else {
      appliedPowerup = pItem;
      powerupMaxDuration = pItem.duration;
      powerupExpiresAt = Date.now() + pItem.duration;
      showActivePowerupUI(pItem);
      addFloatingText(`${pItem.name.toUpperCase()}!`, snake[0].x * cellSize + cellSize / 2, snake[0].y * cellSize - 10, pItem.color);
    }
  }

  // --- PARTICLES & VISUAL EFFECTS ---
  function createFoodParticles(gridX, gridY, color, emoji) {
    const px = gridX * cellSize + cellSize / 2;
    const py = gridY * cellSize + cellSize / 2;

    // Burst sparkles
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      particles.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 2,
        color: color,
        alpha: 1,
        decay: Math.random() * 0.03 + 0.02
      });
    }
  }

  function createPoofParticles(gridX, gridY, color) {
    const px = gridX * cellSize + cellSize / 2;
    const py = gridY * cellSize + cellSize / 2;
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 0.5;
      particles.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 2 + 1,
        color: color,
        alpha: 0.8,
        decay: 0.04
      });
    }
  }

  function createImpactParticles(gridX, gridY) {
    const px = gridX * cellSize + cellSize / 2;
    const py = gridY * cellSize + cellSize / 2;
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      particles.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 4 + 2,
        color: "#f72585",
        alpha: 1,
        decay: 0.025
      });
    }
  }

  function createConfetti() {
    const colors = ["#00f5d4", "#f72585", "#ffbe0b", "#7209b7", "#39ff14", "#ffffff"];
    for (let i = 0; i < 70; i++) {
      confetti.push({
        x: Math.random() * canvasWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        alpha: 1
      });
    }
  }

  function addFloatingText(text, x, y, color = "#00f5d4") {
    floatingTexts.push({
      text,
      x,
      y,
      vy: -1.2,
      alpha: 1,
      color
    });
  }

  function updateEffects(dt) {
    // Update Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.alpha -= p.decay;
      if (p.alpha <= 0) particles.splice(i, 1);
    }

    // Update Floating Texts
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= 0.02;
      if (ft.alpha <= 0) floatingTexts.splice(i, 1);
    }

    // Update Confetti
    for (let i = confetti.length - 1; i >= 0; i--) {
      const c = confetti[i];
      c.x += c.vx;
      c.y += c.vy;
      c.rotation += c.rotSpeed;
      if (c.y > canvasHeight + 20) confetti.splice(i, 1);
    }
  }

  // --- RENDERING ---
  function render() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 1. Draw Grid Backdrop
    drawGrid();

    // 2. Draw Food and Powerups
    drawItems();

    // 3. Draw Snake
    drawSnake();

    // 4. Draw Particles & Visual FX
    drawEffects();
  }

  function drawGrid() {
    ctx.fillStyle = "#0c101a";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
    ctx.lineWidth = 1;

    for (let i = 0; i <= GRID_SIZE; i++) {
      const p = i * cellSize;
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, canvasHeight);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, p);
      ctx.lineTo(canvasWidth, p);
      ctx.stroke();
    }
  }

  function drawItems() {
    const time = performance.now() * 0.005;

    // Draw Base Food
    if (activeFood) {
      drawEmojiItem(activeFood.x, activeFood.y, activeFood.emoji, activeFood.color, Math.sin(time) * 2);
    }

    // Draw Special Food with pulsing circle & countdown bar
    if (specialFood) {
      const pulse = Math.sin(time * 2) * 3;
      drawSpecialItemWithTimer(specialFood.x, specialFood.y, specialFood.emoji, specialFood.color, specialFood.lifespan / specialFood.maxLifespan, pulse);
    }

    // Draw Power-up Pickup with rotating aura & countdown bar
    if (activePowerup) {
      const pulse = Math.sin(time * 3) * 3;
      drawSpecialItemWithTimer(activePowerup.x, activePowerup.y, activePowerup.emoji, activePowerup.color, activePowerup.lifespan / activePowerup.maxLifespan, pulse);
    }
  }

  function drawEmojiItem(gridX, gridY, emoji, glowColor, offsetY = 0) {
    const cx = gridX * cellSize + cellSize / 2;
    const cy = gridY * cellSize + cellSize / 2 + offsetY;

    ctx.save();
    // Ambient subtle radial glow behind food
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 14;

    ctx.font = `${Math.floor(cellSize * 0.78)}px "Outfit", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, cx, cy);

    ctx.restore();
  }

  function drawSpecialItemWithTimer(gridX, gridY, emoji, color, ratio, pulse = 0) {
    const cx = gridX * cellSize + cellSize / 2;
    const cy = gridY * cellSize + cellSize / 2;

    ctx.save();
    // Glowing ring
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.arc(cx, cy, (cellSize / 2 - 3) + pulse * 0.5, 0, Math.PI * 2 * ratio);
    ctx.stroke();

    ctx.font = `${Math.floor(cellSize * 0.8)}px "Outfit", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, cx, cy);
    ctx.restore();
  }

  function drawSnake() {
    if (snake.length === 0) return;

    const skin = SKINS[activeSkin] || SKINS.cyan;
    const isGhost = appliedPowerup && appliedPowerup.type === "GHOST";

    ctx.save();

    // Ghost mode gives ethereal transparency
    if (isGhost) {
      ctx.globalAlpha = 0.65;
      ctx.shadowColor = "#70a1ff";
      ctx.shadowBlur = 20;
    } else {
      ctx.shadowColor = skin.glowColor;
      ctx.shadowBlur = 12;
    }

    // 1. Draw Body Segments from tail to head
    for (let i = snake.length - 1; i > 0; i--) {
      const seg = snake[i];
      const cx = seg.x * cellSize + cellSize / 2;
      const cy = seg.y * cellSize + cellSize / 2;

      // Dynamic color interpolation
      if (skin.bodyColor === "rainbow") {
        const hue = (i * 18 + performance.now() * 0.1) % 360;
        ctx.fillStyle = `hsl(${hue}, 95%, 60%)`;
      } else {
        const factor = 1 - (i / snake.length) * 0.45;
        ctx.fillStyle = skin.bodyColor;
      }

      // Slightly taper tail tip
      const radius = i === snake.length - 1 ? (cellSize / 2) * 0.72 : (cellSize / 2) * 0.85;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Connector pill between segments for smooth body
      const nextSeg = snake[i - 1];
      const nx = nextSeg.x * cellSize + cellSize / 2;
      const ny = nextSeg.y * cellSize + cellSize / 2;

      // Don't draw connector across wrap-around boundaries
      if (Math.abs(seg.x - nextSeg.x) <= 1 && Math.abs(seg.y - nextSeg.y) <= 1) {
        ctx.lineWidth = radius * 1.7;
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nx, ny);
        ctx.stroke();
      }
    }

    // 2. Draw Snake Head
    const head = snake[0];
    const hx = head.x * cellSize + cellSize / 2;
    const hy = head.y * cellSize + cellSize / 2;
    const headRadius = (cellSize / 2) * 0.92;

    ctx.fillStyle = skin.headColor;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(hx, hy, headRadius, 0, Math.PI * 2);
    ctx.fill();

    // 3. Draw Snake Eyes (Look toward current direction!)
    drawSnakeEyes(hx, hy, headRadius, skin.eyeColor);

    ctx.restore();
  }

  function drawSnakeEyes(hx, hy, headRadius, eyeColor) {
    const eyeOffsetDist = headRadius * 0.45;
    const eyeSize = headRadius * 0.28;
    const pupilSize = headRadius * 0.15;

    // Perpendicular vector for eye separation
    const perpX = -direction.y;
    const perpY = direction.x;

    const eye1X = hx + direction.x * (headRadius * 0.35) + perpX * eyeOffsetDist;
    const eye1Y = hy + direction.y * (headRadius * 0.35) + perpY * eyeOffsetDist;

    const eye2X = hx + direction.x * (headRadius * 0.35) - perpX * eyeOffsetDist;
    const eye2Y = hy + direction.y * (headRadius * 0.35) - perpY * eyeOffsetDist;

    // Eyeballs (White)
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(eye1X, eye1Y, eyeSize, 0, Math.PI * 2);
    ctx.arc(eye2X, eye2Y, eyeSize, 0, Math.PI * 2);
    ctx.fill();

    // Pupils looking in movement direction
    const pupilLookX = direction.x * (eyeSize * 0.4);
    const pupilLookY = direction.y * (eyeSize * 0.4);

    ctx.fillStyle = eyeColor;
    ctx.beginPath();
    ctx.arc(eye1X + pupilLookX, eye1Y + pupilLookY, pupilSize, 0, Math.PI * 2);
    ctx.arc(eye2X + pupilLookX, eye2Y + pupilLookY, pupilSize, 0, Math.PI * 2);
    ctx.fill();

    // Pupil light shine
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.beginPath();
    ctx.arc(eye1X + pupilLookX - 1, eye1Y + pupilLookY - 1, pupilSize * 0.45, 0, Math.PI * 2);
    ctx.arc(eye2X + pupilLookX - 1, eye2Y + pupilLookY - 1, pupilSize * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawEffects() {
    // 1. Draw Particles
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. Draw Floating Score Texts
    for (const ft of floatingTexts) {
      ctx.save();
      ctx.globalAlpha = Math.max(ft.alpha, 0);
      ctx.fillStyle = ft.color;
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 12;
      ctx.font = `bold 16px "Outfit", sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    // 3. Draw Confetti (high score celebration)
    for (const c of confetti) {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rotation * Math.PI) / 180);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.5);
      ctx.restore();
    }
  }

  function drawStaticScene() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawGrid();
  }

  // --- INPUT HANDLING ---
  function requestDirectionChange(newDir) {
    if (!isRunning || isPaused) return;

    // Get the reference direction (last queued or current)
    const lastDir = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : direction;

    // Prevent immediate 180 degree reverse turns
    if (newDir.x === -lastDir.x && newDir.y === -lastDir.y) {
      return;
    }

    // Limit buffer queue to prevent long delayed inputs
    if (inputQueue.length < 2) {
      inputQueue.push(newDir);
    }
  }

  function bindEvents() {
    // 1. Keyboard Controls
    window.addEventListener("keydown", (e) => {
      // Spacebar controls
      if (e.code === "Space") {
        e.preventDefault();
        if (!isRunning) {
          startNewGame();
        } else {
          togglePause();
        }
        return;
      }

      // 'P' key for Pause
      if (e.code === "KeyP") {
        e.preventDefault();
        togglePause();
        return;
      }

      // 'R' key for restart
      if (e.code === "KeyR") {
        e.preventDefault();
        startNewGame();
        return;
      }

      // 'M' key for music toggle
      if (e.code === "KeyM") {
        e.preventDefault();
        toggleMusicBtn();
        return;
      }

      // Arrow and WASD direction controls
      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
          e.preventDefault();
          requestDirectionChange(DIRECTIONS.UP);
          break;
        case "ArrowDown":
        case "KeyS":
          e.preventDefault();
          requestDirectionChange(DIRECTIONS.DOWN);
          break;
        case "ArrowLeft":
        case "KeyA":
          e.preventDefault();
          requestDirectionChange(DIRECTIONS.LEFT);
          break;
        case "ArrowRight":
        case "KeyD":
          e.preventDefault();
          requestDirectionChange(DIRECTIONS.RIGHT);
          break;
      }
    });

    // 2. Mobile Swipe Gestures on Canvas
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
      }
    }, { passive: true });

    canvas.addEventListener("touchend", (e) => {
      if (e.changedTouches.length === 1) {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;
        const timeDiff = Date.now() - touchStartTime;

        // Minimum swipe distance & speed
        if (timeDiff < 500 && (Math.abs(deltaX) > 24 || Math.abs(deltaY) > 24)) {
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 0) requestDirectionChange(DIRECTIONS.RIGHT);
            else requestDirectionChange(DIRECTIONS.LEFT);
          } else {
            // Vertical swipe
            if (deltaY > 0) requestDirectionChange(DIRECTIONS.DOWN);
            else requestDirectionChange(DIRECTIONS.UP);
          }
        }
      }
    }, { passive: true });

    // 3. Mobile D-Pad Buttons
    document.querySelectorAll(".dpad-btn").forEach((btn) => {
      const handlePress = (e) => {
        e.preventDefault();
        const dirKey = btn.getAttribute("data-dir");
        if (DIRECTIONS[dirKey]) {
          requestDirectionChange(DIRECTIONS[dirKey]);
          btn.classList.add("pressed");
          setTimeout(() => btn.classList.remove("pressed"), 120);
        }
      };
      btn.addEventListener("touchstart", handlePress, { passive: false });
      btn.addEventListener("mousedown", handlePress);
    });

    // Mobile Pause & Restart
    document.getElementById("btn-mobile-pause")?.addEventListener("click", () => {
      if (isRunning) togglePause();
    });
    document.getElementById("btn-mobile-restart")?.addEventListener("click", () => {
      startNewGame();
    });

    // 4. Buttons in Canvas Overlays & Header
    document.getElementById("btn-start").addEventListener("click", startNewGame);
    document.getElementById("btn-resume").addEventListener("click", resumeGame);
    document.getElementById("btn-restart-paused").addEventListener("click", startNewGame);
    document.getElementById("btn-restart-gameover").addEventListener("click", startNewGame);

    // Header Sound & Music toggles
    document.getElementById("btn-sound").addEventListener("click", () => {
      const active = sound.toggleSound();
      document.querySelector("#btn-sound .icon").textContent = active ? "🔊" : "🔇";
    });

    document.getElementById("btn-music").addEventListener("click", toggleMusicBtn);

    // Modal Triggers
    document.getElementById("btn-skins").addEventListener("click", () => {
      sound.playClick();
      document.getElementById("skins-modal").classList.remove("hidden");
    });

    document.getElementById("btn-achievements").addEventListener("click", () => {
      sound.playClick();
      renderAchievementsList();
      document.getElementById("achievements-modal").classList.remove("hidden");
    });

    document.getElementById("btn-help").addEventListener("click", () => {
      sound.playClick();
      document.getElementById("help-modal").classList.remove("hidden");
    });

    // Close Modal Buttons
    document.querySelectorAll("[data-close]").forEach((btn) => {
      btn.addEventListener("click", () => {
        sound.playClick();
        const targetId = btn.getAttribute("data-close");
        document.getElementById(targetId)?.classList.add("hidden");
      });
    });

    // Mode Selector Buttons
    document.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        sound.playClick();
        document.querySelectorAll(".mode-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        gameMode = btn.getAttribute("data-mode");
        savePersistedData();
      });
    });

    // Difficulty Selector Buttons
    document.querySelectorAll(".diff-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        sound.playClick();
        document.querySelectorAll(".diff-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentDifficulty = btn.getAttribute("data-speed");
        savePersistedData();
      });
    });

    // Share Score Button
    document.getElementById("btn-share").addEventListener("click", () => {
      sound.playClick();
      const text = `🎮 I just scored ${score.toLocaleString()} points eating tasty snacks in Snake & Snack Arcade! Can you beat my record?`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          showToast("Copied score to clipboard! 📋");
        }).catch(() => {
          showToast(`Score: ${score}!`);
        });
      }
    });
  }

  function toggleMusicBtn() {
    sound.ensureContext();
    const active = sound.toggleMusic();
    const icon = document.querySelector("#btn-music .icon");
    icon.textContent = active ? "🎶" : "🎵";
    document.getElementById("btn-music").style.borderColor = active ? "var(--accent-cyan)" : "";
  }

  function showToast(msg) {
    const toast = document.getElementById("share-toast");
    if (toast) {
      toast.textContent = msg;
      toast.classList.remove("hidden");
      setTimeout(() => toast.classList.add("hidden"), 2200);
    }
  }

  // --- UI UPDATES & HUD ---
  function updateUIElements() {
    document.getElementById("current-score").textContent = score.toLocaleString();
    document.getElementById("high-score").textContent = highScore.toLocaleString();
    document.getElementById("snake-length").textContent = snake.length;
  }

  function updateComboUI() {
    const badge = document.getElementById("combo-multiplier");
    const fill = document.getElementById("combo-fill");

    if (comboCount > 1) {
      badge.textContent = `x${comboCount}!`;
      badge.style.transform = "scale(1.25)";
      setTimeout(() => badge.style.transform = "scale(1)", 120);

      const ratio = Math.max(0, Math.min(comboTimer / COMBO_WINDOW, 1));
      fill.style.width = `${(ratio * 100).toFixed(1)}%`;
    } else {
      badge.textContent = "x1";
      fill.style.width = "0%";
    }
  }

  function showActivePowerupUI(powerup) {
    const bar = document.getElementById("active-powerup-bar");
    const icon = document.getElementById("powerup-icon");
    const name = document.getElementById("powerup-name");
    
    icon.textContent = powerup.emoji;
    name.textContent = powerup.name;
    bar.classList.remove("hidden");
  }

  function updateActivePowerupUI(remainingMs) {
    const timerText = document.getElementById("powerup-timer");
    const progress = document.getElementById("powerup-progress");
    
    const seconds = (remainingMs / 1000).toFixed(1);
    timerText.textContent = `${seconds}s`;

    const ratio = Math.max(0, remainingMs / powerupMaxDuration);
    progress.style.width = `${(ratio * 100).toFixed(1)}%`;
  }

  function hideActivePowerupUI() {
    document.getElementById("active-powerup-bar").classList.add("hidden");
  }

  // --- CUSTOMIZATION RENDERING ---
  function renderCustomizationSelectors() {
    // 1. Snake Skins
    const skinsContainer = document.getElementById("snake-skins-list");
    skinsContainer.innerHTML = "";
    Object.keys(SKINS).forEach((key) => {
      const skin = SKINS[key];
      const card = document.createElement("div");
      card.className = `skin-card ${activeSkin === key ? "active" : ""}`;
      
      const previewGradient = skin.bodyColor === "rainbow"
        ? "linear-gradient(90deg, red, yellow, lime, cyan, blue, magenta)"
        : `linear-gradient(90deg, ${skin.headColor}, ${skin.bodyColor})`;

      card.innerHTML = `
        <div class="skin-preview" style="background: ${previewGradient};"></div>
        <span class="skin-name">${skin.name}</span>
      `;

      card.addEventListener("click", () => {
        sound.playClick();
        activeSkin = key;
        savePersistedData();
        renderCustomizationSelectors();
      });

      skinsContainer.appendChild(card);
    });

    // 2. Snack Themes
    const themesContainer = document.getElementById("snack-themes-list");
    themesContainer.innerHTML = "";
    Object.keys(SNACK_THEMES).forEach((key) => {
      const theme = SNACK_THEMES[key];
      const card = document.createElement("div");
      card.className = `snack-card ${activeTheme === key ? "active" : ""}`;

      const emojiList = theme.items.map((i) => i.emoji).join(" ");

      card.innerHTML = `
        <div class="snack-icons-preview">${emojiList}</div>
        <span class="snack-name">${theme.name}</span>
      `;

      card.addEventListener("click", () => {
        sound.playClick();
        activeTheme = key;
        savePersistedData();
        renderCustomizationSelectors();
        if (activeFood) {
          activeFood.emoji = theme.items[0].emoji;
          activeFood.color = theme.items[0].color;
        }
      });

      themesContainer.appendChild(card);
    });

    // Sync Mode & Difficulty buttons in overlay
    document.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-mode") === gameMode);
    });
    document.querySelectorAll(".diff-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-speed") === currentDifficulty);
    });
  }

  // --- ACHIEVEMENTS SYSTEM ---
  function unlockAchievement(id) {
    if (unlockedAchievements.has(id)) return;
    unlockedAchievements.add(id);
    savePersistedData();

    const ach = ACHIEVEMENTS.find((a) => a.id === id);
    if (ach) {
      sound.playHighScore();
      showToast(`🏆 UNLOCKED: ${ach.title}!`);
    }
  }

  function checkLiveAchievements() {
    if (snacksEaten >= 1) unlockAchievement("first_bite");
    if (snacksEaten >= 25) unlockAchievement("snack_25");
    if (comboCount >= 3) unlockAchievement("combo_3");
    if (comboCount >= 5) unlockAchievement("combo_5");
    if (snake.length >= 20) unlockAchievement("len_20");
    if (snake.length >= 40) unlockAchievement("len_40");
    if (score >= 500) unlockAchievement("score_500");
    if (score >= 1000) unlockAchievement("score_1000");

    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed >= 120) unlockAchievement("zen_master");
  }

  function checkAchievementsAtGameOver() {
    if (score >= 500) unlockAchievement("score_500");
    if (score >= 1000) unlockAchievement("score_1000");
    if (snake.length >= 20) unlockAchievement("len_20");
  }

  function renderAchievementsList() {
    const list = document.getElementById("achievements-list");
    list.innerHTML = "";

    ACHIEVEMENTS.forEach((ach) => {
      const isUnlocked = unlockedAchievements.has(ach.id);
      const row = document.createElement("div");
      row.className = `achievement-row ${isUnlocked ? "unlocked" : "locked"}`;
      row.innerHTML = `
        <div class="achievement-icon">${ach.icon}</div>
        <div class="achievement-details">
          <div class="achievement-title">${ach.title}</div>
          <div class="achievement-desc">${ach.desc}</div>
        </div>
        <div class="achievement-status">${isUnlocked ? "UNLOCKED ✨" : "LOCKED 🔒"}</div>
      `;
      list.appendChild(row);
    });
  }

  // Kickstart on DOM load
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
