// =======================
// Basketball Court Scene
// =======================

import { OrbitControls } from './OrbitControls.js';

// --- Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// --- Renderer Setup ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// --- Lighting ---
// Remove old lights if present
// Add realistic lighting: ambient, spotlights, and soft fill

// Soft ambient light for base illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(ambientLight);

// Main stadium spotlights (simulate arena lights)
const spotlights = [];
const spotlightPositions = [
  [0, 25, 0],    // Center
  [-12, 22, 7], // Corners
  [12, 22, 7],
  [-12, 22, -7],
  [12, 22, -7]
];
spotlightPositions.forEach(([x, y, z]) => {
  const spot = new THREE.SpotLight(0xffffff, 1.1, 80, Math.PI / 5, 0.3, 1.5);
  spot.position.set(x, y, z);
  spot.castShadow = true;
  spot.shadow.mapSize.width = 1024;
  spot.shadow.mapSize.height = 1024;
  spot.shadow.bias = -0.0005;
  spot.target.position.set(0, 0, 0);
  scene.add(spot);
  scene.add(spot.target);
  spotlights.push(spot);
});

// Soft fill light to reduce harsh shadows
const fillLight = new THREE.HemisphereLight(0xffffff, 0x222233, 0.25);
scene.add(fillLight);

// --- Utility Functions ---
/**
 * Converts degrees to radians.
 * @param {number} degrees
 * @returns {number}
 */
function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// =======================
// Court Construction
// =======================

/**
 * Creates a realistic wood grain texture for the basketball court.
 */
function createWoodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  // Base wood color
  ctx.fillStyle = '#D2691E';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Create wood grain lines
  const numLines = 40;
  for (let i = 0; i < numLines; i++) {
    const y = (i / numLines) * canvas.height;
    const opacity = 0.1 + Math.random() * 0.3;
    const width = 1 + Math.random() * 3;
    
    // Vary the color slightly
    const shade = Math.floor(180 + Math.random() * 40);
    ctx.strokeStyle = `rgba(${shade}, ${Math.floor(shade * 0.6)}, ${Math.floor(shade * 0.3)}, ${opacity})`;
    ctx.lineWidth = width;
    
    ctx.beginPath();
    ctx.moveTo(0, y);
    // Add some wave to the grain
    for (let x = 0; x <= canvas.width; x += 10) {
      const waveY = y + Math.sin(x * 0.02) * 2 + Math.random() * 1;
      ctx.lineTo(x, waveY);
    }
    ctx.stroke();
  }
  
  // Add some darker grain details
  for (let i = 0; i < 15; i++) {
    const y = Math.random() * canvas.height;
    ctx.strokeStyle = `rgba(101, 67, 33, ${0.2 + Math.random() * 0.3})`;
    ctx.lineWidth = 0.5 + Math.random() * 1.5;
    
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= canvas.width; x += 8) {
      const waveY = y + Math.sin(x * 0.03) * 3 + Math.random() * 2;
      ctx.lineTo(x, waveY);
    }
    ctx.stroke();
  }
  
  return new THREE.CanvasTexture(canvas);
}

/**
 * Creates the basketball court, including floor and lines.
 */
function createBasketballCourt() {
  // Create wood texture
  const woodTexture = createWoodTexture();
  woodTexture.wrapS = THREE.RepeatWrapping;
  woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(8, 4); // Repeat to show more wood planks
  
  // Court floor with wood texture
  const court = new THREE.Mesh(
    new THREE.BoxGeometry(30, 0.2, 15),
    new THREE.MeshPhongMaterial({ 
      map: woodTexture,
      color: 0xc68642,
      shininess: 80,
      specular: 0x222222
    })
  );
  court.receiveShadow = true;
  scene.add(court);

  // White line material for all court markings
  const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  // Center line
  const centerLine = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.01, 15),
    lineMaterial
  );
  centerLine.position.y = 0.11;
  scene.add(centerLine);
/**
 * Creates a team logo texture for the center court.
 */
function createTeamLogoTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  // Clear background
  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw team logo background circle
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 100;
  
  // Main logo circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#FF6600';
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.stroke();
  
  // Inner circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.8, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  
  // Team name
  ctx.fillStyle = '#FF6600';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('BASKETBALL', centerX, centerY - 10);
  ctx.fillText('CHAMPIONS', centerX, centerY + 15);
  
  // Basketball icon in the center
  ctx.beginPath();
  ctx.arc(centerX, centerY + 35, 20, 0, Math.PI * 2);
  ctx.fillStyle = '#FF6600';
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Basketball lines
  ctx.beginPath();
  ctx.moveTo(centerX - 20, centerY + 35);
  ctx.lineTo(centerX + 20, centerY + 35);
  ctx.moveTo(centerX, centerY + 15);
  ctx.lineTo(centerX, centerY + 55);
  ctx.stroke();
  
  // Curved lines on basketball
  ctx.beginPath();
  ctx.arc(centerX, centerY + 35, 20, -Math.PI/2, Math.PI/2, false);
  ctx.moveTo(centerX - 20, centerY + 35);
  ctx.arc(centerX, centerY + 35, 20, Math.PI/2, 3*Math.PI/2, false);
  ctx.stroke();
  
  return new THREE.CanvasTexture(canvas);
}  // Center circle (outline)
  const centerCircle = new THREE.Mesh(
    new THREE.RingGeometry(2, 2.2, 32),
    lineMaterial
  );
  centerCircle.rotation.x = degreesToRadians(-90);
  centerCircle.position.y = 0.11;
  scene.add(centerCircle);

  // Center circle (interior) - plain orange
  const centerCircleInterior = new THREE.Mesh(
    new THREE.CircleGeometry(2, 32),
    new THREE.MeshBasicMaterial({ color: 0xff6600 })
  );
  centerCircleInterior.rotation.x = degreesToRadians(-90);
  centerCircleInterior.position.y = 0.105;
  scene.add(centerCircleInterior);
  // Team logo on top of center line
  const logoTexture = createTeamLogoTexture();
  const centerLogo = new THREE.Mesh(
    new THREE.CircleGeometry(1.5, 32),
    new THREE.MeshBasicMaterial({ 
      map: logoTexture,
      transparent: true,
      alphaTest: 0.1
    })
  );
  centerLogo.rotation.x = degreesToRadians(-90);
  centerLogo.position.set(0, 0.12, 0); // Positioned on top of the center line
  scene.add(centerLogo);

  // Three-point lines (left & right)
  createThreePointArc(-15, lineMaterial, -90);
  createThreePointArc(15, lineMaterial, 90);

  // Key areas (painted rectangles, outlines, free throw circles/lines)
  createKeyAreas(lineMaterial);
}

/**
 * Creates a three-point arc at the specified X position.
 */
function createThreePointArc(x, material, zRotationDeg) {
  const arc = new THREE.Mesh(
    new THREE.RingGeometry(6.7, 6.9, 16, 1, 0, Math.PI),
    material
  );
  arc.rotation.x = degreesToRadians(-90);
  arc.rotation.z = degreesToRadians(zRotationDeg);
  arc.position.set(x, 0.11, 0);
  scene.add(arc);
}

/**
 * Creates key areas (painted rectangles, outlines, free throw circles/lines).
 */
function createKeyAreas(lineMaterial) {
  // Key area material (orange)
  const keyMaterial = new THREE.MeshPhongMaterial({ color: 0xff6600, shininess: 50 });

  // Left & right key rectangles
  [-13, 13].forEach(centerX => {
    const key = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.01, 6),
      keyMaterial
    );
    key.position.set(centerX, 0.105, 0);
    scene.add(key);

    createKeyOutline(centerX, lineMaterial);
  });

  // Free throw circles & lines
  [-11, 11].forEach(centerX => {
    // Circle
    const ftCircle = new THREE.Mesh(
      new THREE.RingGeometry(1.8, 2.0, 32),
      lineMaterial
    );
    ftCircle.rotation.x = degreesToRadians(-90);
    ftCircle.position.set(centerX, 0.115, 0);
    scene.add(ftCircle);

    // Line
    const ftLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.05, 6),
      lineMaterial
    );
    ftLine.position.set(centerX, 0.115, 0);
    scene.add(ftLine);
  });
}

/**
 * Creates the white outline for a key area at the given X position.
 */
function createKeyOutline(centerX, lineMaterial) {
  const lineWidth = 0.15, lineHeight = 0.05, keyWidth = 4, keyDepth = 6;

  // Top & bottom lines
  [3, -3].forEach(z => {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(keyWidth, lineHeight, lineWidth),
      lineMaterial
    );
    line.position.set(centerX, 0.115, z);
    scene.add(line);
  });

  // Side line
  const sideLine = new THREE.Mesh(
    new THREE.BoxGeometry(lineWidth, lineHeight, keyDepth),
    lineMaterial
  );
  sideLine.position.set(centerX + (centerX < 0 ? -2 : 2), 0.115, 0);
  scene.add(sideLine);
}

// =======================
// Hoop Construction
// =======================

/**
 * Creates a basketball hoop at the specified X position.
 */
function createBasketballHoop(hoopX) {
  const group = new THREE.Group();

  // Support pole
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 6),
    new THREE.MeshPhongMaterial({ color: 0x666666 })
  );
  pole.position.set(hoopX, 3, 0);
  pole.castShadow = true;
  group.add(pole);

  // Support arm
  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.15, 1),
    new THREE.MeshPhongMaterial({ color: 0x666666 })
  );
  arm.position.set(hoopX + (hoopX < 0 ? 0.5 : -0.5), 5, 0);
  arm.rotation.y = degreesToRadians(hoopX < 0 ? 90 : -90);
  arm.castShadow = true;
  group.add(arm);  // Backboard (white base)
  const backboard = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 1.6, 0.1),
    new THREE.MeshPhongMaterial({ 
      color: 0xffffff, 
      transparent: true, 
      opacity: 0.6 
    })
  );
  backboard.position.set(hoopX + (hoopX < 0 ? 1 : -1), 5, 0);
  backboard.rotation.y = degreesToRadians(hoopX < 0 ? 90 : -90);
  backboard.castShadow = true;
  backboard.receiveShadow = true;
  group.add(backboard);
  // Backboard border (orange)
  const borderThickness = 0.08;
  const borderLengthX = 2.8 + borderThickness;
  const borderLengthY = 1.6 + borderThickness;
  // Top border
  const borderTop = new THREE.Mesh(
    new THREE.BoxGeometry(borderLengthX, borderThickness, 0.12),
    new THREE.MeshBasicMaterial({ color: 0xff6600 })
  );
  borderTop.position.set(
    0,
    (1.6 / 2),
    0.06
  );
  // Bottom border
  const borderBottom = borderTop.clone();
  borderBottom.position.y = -(1.6 / 2);  // Left border
  const borderLeft = new THREE.Mesh(
    new THREE.BoxGeometry(borderThickness, borderLengthY, 0.12),
    new THREE.MeshBasicMaterial({ color: 0xff6600 })
  );
  borderLeft.position.set(
    -(2.8 / 2),
    0,
    0.06
  );
  // Right border
  const borderRight = borderLeft.clone();
  borderRight.position.x = (2.8 / 2);
  // Shooter's square (orange)
  const squareWidth = 0.6;
  const squareHeight = 0.45;
  const squareThickness = 0.05; // Increased thickness for the shooter's square
  // Top of square
  const squareTop = new THREE.Mesh(
    new THREE.BoxGeometry(squareWidth, squareThickness, 0.13),
    new THREE.MeshBasicMaterial({ color: 0xff6600 })
  );
  squareTop.position.set(
    0,
    (squareHeight / 2),
    0.07
  );
  // Bottom of square
  const squareBottom = squareTop.clone();
  squareBottom.position.y = -(squareHeight / 2);  // Left of square
  const squareLeft = new THREE.Mesh(
    new THREE.BoxGeometry(squareThickness, squareHeight, 0.13),
    new THREE.MeshBasicMaterial({ color: 0xff6600 })
  );
  squareLeft.position.set(
    -(squareWidth / 2),
    0,
    0.07
  );
  // Right of square
  const squareRight = squareLeft.clone();
  squareRight.position.x = (squareWidth / 2);

  // Group all orange parts for easier rotation/positioning
  const boardDeco = new THREE.Group();
  boardDeco.add(borderTop, borderBottom, borderLeft, borderRight, squareTop, squareBottom, squareLeft, squareRight);
  // Rotate the group 90 degrees around Y to match the backboard
  boardDeco.rotation.y = degreesToRadians(hoopX < 0 ? 90 : -90);
  boardDeco.position.set(hoopX + (hoopX < 0 ? 1 : -1), 5, 0.051);
  group.add(boardDeco);

  // Rim
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.4, 0.02, 8, 16), // Realistic size - larger than original but not too big
    new THREE.MeshPhongMaterial({ color: 0xff6600 })
  );
  rim.rotation.x = degreesToRadians(-90);
  rim.position.set(hoopX + (hoopX < 0 ? 1.3 : -1.3), 4.5, 0);
  rim.castShadow = true;
  group.add(rim);

  // Net
  const netGroup = new THREE.Group();
  const netMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const netSegments = 12; // Fewer vertical strands for less rigid appearance
  const netHeight = 0.5;
  const topRadius = 0.4; // Match the realistic rim size
  const bottomRadius = 0.2; // Realistic taper while still allowing ball passage
  // Vertical strands
  for (let i = 0; i < netSegments; i++) {
    const angle = (i / netSegments) * Math.PI * 2;
    const top = new THREE.Vector3(Math.cos(angle) * topRadius, 0, Math.sin(angle) * topRadius);
    // Curve the net slightly inward at the bottom
    const bottom = new THREE.Vector3(Math.cos(angle) * bottomRadius, -netHeight, Math.sin(angle) * bottomRadius);
    const geometry = new THREE.BufferGeometry().setFromPoints([top, bottom]);
    netGroup.add(new THREE.Line(geometry, netMaterial));
  }
  // Horizontal rings (simulate net structure)
  const ringCount = 3; // Fewer rings for less rigid appearance
  for (let j = 1; j <= ringCount; j++) {
    const ringRadius = topRadius - (topRadius - bottomRadius) * (j / ringCount);
    const ringY = -netHeight * (j / ringCount);
    const ringPoints = [];
    for (let i = 0; i <= netSegments; i++) {
      const angle = (i / netSegments) * Math.PI * 2;
      ringPoints.push(new THREE.Vector3(Math.cos(angle) * ringRadius, ringY, Math.sin(angle) * ringRadius));
    }
    const ringGeometry = new THREE.BufferGeometry().setFromPoints(ringPoints);
    netGroup.add(new THREE.Line(ringGeometry, netMaterial));
  }
  netGroup.position.set(hoopX + (hoopX < 0 ? 1.3 : -1.3), 4.5, 0);
  group.add(netGroup);

  scene.add(group);
}

// =======================
// Basketball Creation
// =======================

// Global basketball reference for movement controls
let basketball = null;

/**
 * Creates a basketball with a custom texture.
 */
function createBasketball() {
  const loader = new THREE.TextureLoader();
  // Increased radius from 0.12 to 0.2
  const geometry = new THREE.SphereGeometry(0.2, 64, 64);

  // Fallback material in case texture fails
  const fallbackMaterial = new THREE.MeshPhongMaterial({ color: 0xff6600, shininess: 30 });

  // Load texture
  loader.load(
    './src/basketball.png',
    texture => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 20,
        bumpScale: 0.1
      });
      addBasketballMesh(geometry, material);
    },
    undefined,
    error => {
      console.error('Failed to load basketball texture:', error);
      addBasketballMesh(geometry, fallbackMaterial);
    }
  );

  // Helper to add basketball mesh to scene
  function addBasketballMesh(geometry, material) {
    basketball = new THREE.Mesh(geometry, material);
    basketball.castShadow = true;
    basketball.receiveShadow = true;
    // Raise the ball even higher above the court
    basketball.position.set(0, 0.30, 0); // higher Y value for more clearance
    basketball.rotation.y = Math.PI / 4;
    scene.add(basketball);
  }
}

// =======================
// Bleachers Construction
// =======================

/**
 * Creates simple bleachers (audience seating) along the sides of the court.
 */
function createBleachers() {
  const bleacherColor = 0x888888;
  const stepDepth = 1.2;
  const stepHeight = 0.4;
  const stepWidth = 24;
  const numSteps = 5;
  const zOffset = 8.5; // Place outside the court (court is 15 wide)

  // Left and right sides
  [-1, 1].forEach(side => {
    for (let i = 0; i < numSteps; i++) {
      const geometry = new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth);
      const material = new THREE.MeshPhongMaterial({ color: bleacherColor });
      const step = new THREE.Mesh(geometry, material);
      step.position.set(0, (stepHeight / 2) + i * stepHeight, side * (zOffset + i * stepDepth));
      step.castShadow = true;
      step.receiveShadow = true;
      scene.add(step);
    }
  });
}

// =======================
// Scoreboard Construction
// =======================

/**
 * Creates a simple NBA-style scoreboard above center court.
 */
function createScoreboard() {
  // Main scoreboard body
  const scoreboardGeometry = new THREE.BoxGeometry(4, 1.2, 2);
  const scoreboardMaterial = new THREE.MeshPhongMaterial({ color: 0x222233 });
  const scoreboard = new THREE.Mesh(scoreboardGeometry, scoreboardMaterial);
  scoreboard.position.set(0, 7.5, 0);
  scoreboard.castShadow = true;
  scoreboard.receiveShadow = true;

  // Create digital-style score textures for each side
  const createScoreTexture = (label, score) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#222233';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 36px monospace';
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.fillText(label, canvas.width / 2, 50);
    ctx.font = 'bold 56px monospace';
    ctx.fillStyle = '#FF3333';
    ctx.fillText(score, canvas.width / 2, 110);
    return new THREE.CanvasTexture(canvas);
  };

  // Four sides: front/back (Player A/B), left/right (Game Time)
  const materials = [
    new THREE.MeshBasicMaterial({ map: createScoreTexture('PLAYER A', '00') }), // right
    new THREE.MeshBasicMaterial({ map: createScoreTexture('PLAYER B', '00') }), // left
    new THREE.MeshBasicMaterial({ color: 0x222233 }), // top
    new THREE.MeshBasicMaterial({ color: 0x222233 }), // bottom
    new THREE.MeshBasicMaterial({ map: createScoreTexture('TIME', '00:00') }), // front - start at 00:00
    new THREE.MeshBasicMaterial({ map: createScoreTexture('TIME', '00:00') })  // back - start at 00:00
  ];
  scoreboard.material = materials;

  // Store reference for timer updates
  gameTimer.scoreboard = scoreboard;
  gameTimer.createScoreTexture = createScoreTexture; // Store function for updates

  scene.add(scoreboard);
}

/**
 * Starts the game timer
 */
function startGameTimer() {
  if (!gameTimer.startTime) {
    gameTimer.startTime = performance.now();
  }
}

/**
 * Updates the game timer on the scoreboard
 */
function updateGameTimer() {
  if (!gameTimer.startTime || !gameTimer.scoreboard) return;
  
  const elapsedSeconds = Math.floor((performance.now() - gameTimer.startTime) / 1000);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Only update if time has changed
  if (timeString !== gameTimer.currentTime) {
    gameTimer.currentTime = timeString;
    
    // Update the scoreboard time displays (front and back faces)
    gameTimer.scoreboard.material[4].map = gameTimer.createScoreTexture('TIME', timeString); // front
    gameTimer.scoreboard.material[5].map = gameTimer.createScoreTexture('TIME', timeString); // back
    
    // Mark textures for update
    gameTimer.scoreboard.material[4].map.needsUpdate = true;
    gameTimer.scoreboard.material[5].map.needsUpdate = true;
  }
}

// =======================
// Basketball Movement System (HW6 Phase 1)
// =======================

// Basketball movement variables
const basketballMovement = {
  speed: 0.15,
  keys: {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
  },
  boundaries: {
    minX: -14,   // Court width is 30, so -15 to 15, with some margin
    maxX: 14,
    minZ: -6.5,  // Court depth is 15, so -7.5 to 7.5, with some margin  
    maxZ: 6.5
  }
};

// Basketball shot power system (HW6 Phase 2)
const basketballShot = {
  power: 0, // Power level 0-100%
  maxPower: 100,
  minPower: 0,
  powerIncrement: 2, // How fast power increases/decreases
  keys: {
    w: false, // Increase power
    s: false  // Decrease power
  }
};

// Basketball physics system (HW6 Phase 3, 4, 5 & 6)
const basketballPhysics = {
  isFlying: false,
  velocity: new THREE.Vector3(0, 0, 0),
  gravity: -9.81 * 1.2, // Reduced gravity for slower, more controllable shots
  groundY: 0.30, // Ball rest height on court
  bounceDecay: 0.7, // Energy loss on ground bounce (improved)
  rimBounceDecay: 0.05, // Almost no energy loss on rim bounce (ball passes through easily)
  backboardBounceDecay: 0.4, // Energy loss on backboard bounce
  minBounceVelocity: 0.3, // Minimum velocity to continue bouncing (lowered)
  airResistance: 0.99, // Air resistance factor (reduced drag)
  rotationSpeed: new THREE.Vector3(0, 0, 0),
  ballRadius: 0.2, // Basketball radius for collision detection
  startTime: null, // Track when physics started for timeout prevention
  // Phase 5: Rotation animation settings
  rotationScaleFactor: 8, // How much rotation per unit of velocity (reduced for realism)
  rotationDecay: 0.95 // How quickly rotation slows down when not moving
};

// Phase 6: Scoring System
const basketballScoring = {
  totalScore: 0,
  shotsAttempted: 0,
  shotsMade: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastShotResult: null, // 'made', 'missed', or null
  lastShotDistance: 0,
  isTrackingShot: false,
  shotStartTime: null,
  consecutiveMisses: 0,
  hasScored: false, // Prevent multiple scores for same shot
  // Score values
  twoPointZone: 6.8, // Distance threshold for 2-point shots (inside 3-point line - matches visual arc)
  threePointValue: 3,
  twoPointValue: 2
};

// Game timer system
const gameTimer = {
  startTime: null,
  currentTime: '00:00',
  scoreboard: null // Will hold reference to the scoreboard for updates
};

// Hoop positions for shot targeting and collision detection (HW6 Phase 4)
const hoopPositions = [
  { 
    x: -14, y: 4.5, z: 0, // Left hoop (targeting position)
    rimCenter: { x: -13.7, y: 4.5, z: 0 }, // Actual rim position (-15 + 1.3)
    rimRadius: 0.4, // Balanced size - larger than original but still realistic
    backboardCenter: { x: -14, y: 5, z: 0 }, // Actual backboard position (-15 + 1)
    backboardWidth: 2.8,
    backboardHeight: 1.6
  },
  { 
    x: 14, y: 4.5, z: 0, // Right hoop (targeting position)  
    rimCenter: { x: 13.7, y: 4.5, z: 0 }, // Actual rim position (15 - 1.3)
    rimRadius: 0.4, // Balanced size - larger than original but still realistic
    backboardCenter: { x: 14, y: 5, z: 0 }, // Actual backboard position (15 - 1)
    backboardWidth: 2.8,
    backboardHeight: 1.6
  }
];

/**
 * Checks if basketball scored through a hoop (Phase 6)
 */
function checkBasketballScore() {
  if (!basketball || !basketballPhysics.isFlying || basketballScoring.hasScored) return false;
  
  const ballPos = basketball.position;
  
  for (const hoop of hoopPositions) {
    const rimCenter = new THREE.Vector3(hoop.rimCenter.x, hoop.rimCenter.y, hoop.rimCenter.z);
    const distanceToRim = ballPos.distanceTo(rimCenter);
    
    // Check if ball is anywhere near the hoop for extremely easy scoring
    if (distanceToRim < hoop.rimRadius * 2.0 && // Very large detection zone (double the rim!)
        ballPos.y < hoop.rimCenter.y + 0.5 && ballPos.y > hoop.rimCenter.y - 1.5 && // Extremely generous vertical range
        Math.abs(basketballPhysics.velocity.y) < 5) { // Allow almost any movement
      
      // Calculate shot distance for scoring
      const shotDistance = Math.sqrt(
        Math.pow(basketballScoring.shotStartPosition.x - hoop.rimCenter.x, 2) +
        Math.pow(basketballScoring.shotStartPosition.z - hoop.rimCenter.z, 2)
      );
      
      // Determine point value
      const points = shotDistance > basketballScoring.twoPointZone ? 
                    basketballScoring.threePointValue : basketballScoring.twoPointValue;
      
      // Register the score and mark as scored
      basketballScoring.hasScored = true;
      registerScore(true, points, shotDistance);
      
      return true;
    }
  }
  
  return false;
}

/**
 * Registers a score or miss and updates statistics (Phase 6)
 */
function registerScore(scored, points = 0, distance = 0) {
  basketballScoring.shotsAttempted++;
  basketballScoring.lastShotDistance = distance;
  
  if (scored) {
    basketballScoring.shotsMade++;
    basketballScoring.totalScore += points;
    basketballScoring.currentStreak++;
    basketballScoring.consecutiveMisses = 0;
    basketballScoring.lastShotResult = 'made';
    
    // Update best streak
    if (basketballScoring.currentStreak > basketballScoring.bestStreak) {
      basketballScoring.bestStreak = basketballScoring.currentStreak;
    }
    
    // Enhanced shot feedback with more variety (Phase 7)
    let feedbackText, feedbackType;
    
    // Determine shot type and distance category
    const isThreePointer = points === 3;
    const isLongRange = distance > 6.0;
    const isMidRange = distance > 3.0 && distance <= 6.0;
    const isCloseRange = distance <= 3.0;
    
    // Special streak achievements
    if (basketballScoring.currentStreak >= 10) {
      feedbackText = `🔥 ON FIRE! ${basketballScoring.currentStreak} STRAIGHT! 🔥`;
      feedbackType = 'perfect-shot';
    } else if (basketballScoring.currentStreak >= 5) {
      feedbackText = `🎯 HOT STREAK! ${basketballScoring.currentStreak} IN A ROW!`;
      feedbackType = 'streak-bonus';
    } else if (isThreePointer && isLongRange) {
      const messages = [
        '🏀 DEEP THREE! NOTHING BUT NET!',
        '⭐ DOWNTOWN! SPLASH!',
        '🎯 FROM WAY OUT! SWISH!',
        '🌟 LONG BOMB! PERFECT!'
      ];
      feedbackText = messages[Math.floor(Math.random() * messages.length)] + ` +${points}`;
      feedbackType = 'perfect-shot';
    } else if (isThreePointer) {
      const messages = [
        '🏀 THREE-POINTER!',
        '⭐ FROM BEYOND THE ARC!',
        '🎯 TRIPLE THREAT!',
        '🌟 THREE-BALL!'
      ];
      feedbackText = messages[Math.floor(Math.random() * messages.length)] + ` +${points}`;
      feedbackType = 'success';
    } else if (isMidRange) {
      const messages = [
        '🏀 MID-RANGE MONEY!',
        '⭐ SMOOTH JUMPER!',
        '🎯 TEXTBOOK SHOT!',
        '🌟 PURE STROKE!'
      ];
      feedbackText = messages[Math.floor(Math.random() * messages.length)] + ` +${points}`;
      feedbackType = 'success';
    } else if (isCloseRange) {
      const messages = [
        '🏀 EASY BUCKET!',
        '⭐ IN THE PAINT!',
        '🎯 CLOSE RANGE!',
        '🌟 LAYUP GOOD!'
      ];
      feedbackText = messages[Math.floor(Math.random() * messages.length)] + ` +${points}`;
      feedbackType = 'success';
    } else {
      feedbackText = `${isThreePointer ? '3-POINTER!' : 'BASKET!'} +${points}`;
      feedbackType = 'success';
    }
    
    showScorePopup(feedbackText, feedbackType);
    
  } else {
    basketballScoring.currentStreak = 0;
    basketballScoring.consecutiveMisses++;
    basketballScoring.lastShotResult = 'missed';
    
    // Enhanced miss feedback with more variety (Phase 7)
    let missText, missType;
    
    if (basketballScoring.consecutiveMisses === 1) {
      const messages = [
        '❌ MISS!',
        '🚫 OFF THE MARK!',
        '😫 NO GOOD!',
        '💔 ALMOST!'
      ];
      missText = messages[Math.floor(Math.random() * messages.length)];
      missType = 'miss';
    } else if (basketballScoring.consecutiveMisses === 2) {
      const messages = [
        '😰 TWO IN A ROW!',
        '🥶 COOLING OFF!',
        '💔 BACK-TO-BACK MISSES!',
        '😤 SHAKE IT OFF!'
      ];
      missText = messages[Math.floor(Math.random() * messages.length)];
      missType = 'miss';
    } else if (basketballScoring.consecutiveMisses >= 5) {
      const messages = [
        `🧊 ICE COLD! ${basketballScoring.consecutiveMisses} STRAIGHT MISSES!`,
        `😱 BRUTAL STREAK! ${basketballScoring.consecutiveMisses} IN A ROW!`,
        `💀 NIGHTMARE! ${basketballScoring.consecutiveMisses} MISSES!`,
        `😭 CAN'T BUY A BUCKET! ${basketballScoring.consecutiveMisses} MISSES!`
      ];
      missText = messages[Math.floor(Math.random() * messages.length)];
      missType = 'streak-miss';
    } else if (basketballScoring.consecutiveMisses >= 3) {
      const messages = [
        `😬 ${basketballScoring.consecutiveMisses} MISSES IN A ROW!`,
        `🥶 COLD STREAK! ${basketballScoring.consecutiveMisses} STRAIGHT!`,
        `💔 STRUGGLING! ${basketballScoring.consecutiveMisses} MISSES!`,
        `😤 TOUGH STRETCH! ${basketballScoring.consecutiveMisses} IN A ROW!`
      ];
      missText = messages[Math.floor(Math.random() * messages.length)];
      missType = 'streak-miss';
    } else {
      missText = 'MISS!';
      missType = 'miss';
    }
    
    showScorePopup(missText, missType);
  }
  
  // Update UI
  updateScoreDisplay();
  updateDynamicTips(); // Add dynamic tips update (Phase 7)
  basketballScoring.isTrackingShot = false;
}

/**
 * Dynamic tips system based on player performance (Phase 7)
 */
function updateDynamicTips() {
  const tipContent = document.getElementById('tip-content');
  if (!tipContent) return;
  
  const accuracy = basketballScoring.shotsAttempted > 0 ? 
                  Math.round((basketballScoring.shotsMade / basketballScoring.shotsAttempted) * 100) : 0;
  
  let tip = '';
  
  // Performance-based tips
  if (basketballScoring.shotsAttempted === 0) {
    tip = "🏀 <strong>Getting Started:</strong> Use arrow keys to position the ball, adjust power with W/S, then press SPACE to shoot!";
  } else if (basketballScoring.shotsAttempted < 5) {
    tip = "🎯 <strong>Learning the Basics:</strong> Try different power levels! Low power for close shots, high power for three-pointers.";
  } else if (accuracy >= 80) {
    tip = "🔥 <strong>You're On Fire!</strong> Amazing accuracy! Try challenging yourself with longer shots from the three-point line.";
  } else if (accuracy >= 60) {
    tip = "⭐ <strong>Great Shooting:</strong> Solid performance! Focus on consistency and try mixing up your shot locations.";
  } else if (accuracy >= 40) {
    tip = "💪 <strong>Keep Practicing:</strong> You're improving! Remember: aim for the back of the rim and use appropriate power.";
  } else if (accuracy >= 20) {
    tip = "🎯 <strong>Shooting Tips:</strong> Focus on your fundamentals. Use medium power for mid-range shots and position carefully.";
  } else {
    tip = "🤔 <strong>Struggling?</strong> Try getting closer to the basket first. Use low power for close shots and practice your timing!";
  }
  
  // Streak-based tips
  if (basketballScoring.currentStreak >= 5) {
    tip = "🔥 <strong>Hot Streak!</strong> You're in the zone! Keep this rhythm going and try for even longer shots!";
  } else if (basketballScoring.consecutiveMisses >= 5) {
    tip = "😔 <strong>Cold Streak?</strong> Take a breath! Try closer shots to build confidence, or reset with R key.";
  } else if (basketballScoring.consecutiveMisses >= 3) {
    tip = "🎯 <strong>Adjustment Time:</strong> Maybe try different power levels or get closer to the basket for easier shots.";
  }
  
  // Shot-specific tips based on last shot
  if (basketballScoring.lastShotResult === 'made' && basketballScoring.lastShotDistance > 6.0) {
    tip = "🌟 <strong>Deep Shot Master!</strong> Excellent long-range shooting! You've mastered the three-point game.";
  } else if (basketballScoring.lastShotResult === 'missed' && basketballScoring.lastShotDistance > 6.0) {
    tip = "📏 <strong>Long Range Challenge:</strong> Long shots need high power but also precise aim. Try 80-90% power for deep threes.";
  }
  
  // Power-related tips
  const currentPowerPercentage = (basketballShot.power / basketballShot.maxPower) * 100;
  if (currentPowerPercentage > 90 && basketballScoring.consecutiveMisses >= 2) {
    tip = "⚡ <strong>Power Management:</strong> High power shots can overshoot! Try reducing power slightly for better accuracy.";
  } else if (currentPowerPercentage < 30 && basketballScoring.lastShotDistance > 4.0) {
    tip = "💪 <strong>Need More Power:</strong> Increase shot power (W key) for longer distance shots. Low power is for close-range only.";
  }
  
  // Advanced tips for experienced players
  if (basketballScoring.shotsAttempted >= 20) {
    if (basketballScoring.bestStreak < 3) {
      tip = "🎯 <strong>Consistency Challenge:</strong> Try to build longer streaks by finding your sweet spot power level.";
    } else if (accuracy < 40) {
      tip = "📊 <strong>Analysis:</strong> Your accuracy could improve. Focus on 2-point shots first, then work on three-pointers.";
    }
  }
  
  // Special achievement tips
  if (basketballScoring.totalScore >= 50) {
    tip = "🏆 <strong>High Scorer!</strong> Impressive total! You're becoming a basketball simulator expert!";
  } else if (basketballScoring.bestStreak >= 10) {
    tip = "🔥 <strong>Streak Legend!</strong> Double-digit streak achieved! You have incredible consistency!";
  }
  
  tipContent.innerHTML = tip;
  
  // Add subtle animation when tip changes
  const tipsPanel = document.getElementById('tips-panel');
  if (tipsPanel) {
    tipsPanel.style.transform = 'scale(1.02)';
    setTimeout(() => {
      tipsPanel.style.transform = 'scale(1)';
    }, 200);
  }
}

/**
 * Shows visual feedback popup for shots (Phase 6)
 */
function showScorePopup(text, type) {
  // Remove existing popup
  const existingPopup = document.getElementById('score-popup');
  if (existingPopup) {
    existingPopup.remove();
  }
  
  // Create new popup
  const popup = document.createElement('div');
  popup.id = 'score-popup';
  popup.textContent = text;
  popup.className = `score-popup ${type}`;
  
  // Enhanced styling with better animations and effects
  let backgroundColor, borderColor, textShadow;
  
  switch(type) {
    case 'success':
      backgroundColor = 'linear-gradient(135deg, rgba(76, 175, 80, 0.95), rgba(139, 195, 74, 0.95))';
      borderColor = '#4CAF50';
      textShadow = '0 0 10px rgba(76, 175, 80, 0.8), 2px 2px 4px rgba(0,0,0,0.8)';
      break;
    case 'miss':
      backgroundColor = 'linear-gradient(135deg, rgba(244, 67, 54, 0.95), rgba(255, 87, 34, 0.95))';
      borderColor = '#f44336';
      textShadow = '0 0 10px rgba(244, 67, 54, 0.8), 2px 2px 4px rgba(0,0,0,0.8)';
      break;
    case 'streak-miss':
      backgroundColor = 'linear-gradient(135deg, rgba(156, 39, 176, 0.95), rgba(233, 30, 99, 0.95))';
      borderColor = '#9C27B0';
      textShadow = '0 0 10px rgba(156, 39, 176, 0.8), 2px 2px 4px rgba(0,0,0,0.8)';
      break;
    case 'streak-bonus':
      backgroundColor = 'linear-gradient(135deg, rgba(255, 193, 7, 0.95), rgba(255, 152, 0, 0.95))';
      borderColor = '#FFC107';
      textShadow = '0 0 15px rgba(255, 193, 7, 0.9), 2px 2px 4px rgba(0,0,0,0.8)';
      break;
    case 'perfect-shot':
      backgroundColor = 'linear-gradient(135deg, rgba(255, 215, 0, 0.95), rgba(255, 193, 7, 0.95))';
      borderColor = '#FFD700';
      textShadow = '0 0 20px rgba(255, 215, 0, 1), 2px 2px 4px rgba(0,0,0,0.8)';
      break;
    default:
      backgroundColor = 'linear-gradient(135deg, rgba(96, 125, 139, 0.95), rgba(120, 144, 156, 0.95))';
      borderColor = '#607D8B';
      textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
  }
  
  // Enhanced popup styling
  popup.style.cssText = `
    position: fixed;
    top: 25%;
    left: 50%;
    transform: translateX(-50%);
    background: ${backgroundColor};
    color: white;
    padding: 25px 50px;
    border-radius: 15px;
    font-size: ${type === 'perfect-shot' || type === 'streak-bonus' ? '32px' : '26px'};
    font-weight: bold;
    text-align: center;
    z-index: 1000;
    animation: ${type === 'perfect-shot' ? 'perfectShotAnimation' : type === 'streak-bonus' ? 'streakBonusAnimation' : 'enhancedScorePopupAnimation'} 3s ease-out forwards;
    text-shadow: ${textShadow};
    border: 3px solid ${borderColor};
    box-shadow: 
      0 0 30px rgba(0,0,0,0.5),
      0 0 20px ${borderColor}40,
      inset 0 1px 0 rgba(255,255,255,0.2);
    backdrop-filter: blur(2px);
    letter-spacing: 1px;
  `;
  
  // Add enhanced CSS animation keyframes if not already added
  if (!document.getElementById('enhanced-score-popup-styles')) {
    const style = document.createElement('style');
    style.id = 'enhanced-score-popup-styles';
    style.textContent = `
      @keyframes enhancedScorePopupAnimation {
        0% {
          opacity: 0;
          transform: translateX(-50%) translateY(-30px) scale(0.7) rotateX(20deg);
        }
        15% {
          opacity: 1;
          transform: translateX(-50%) translateY(-5px) scale(1.15) rotateX(-5deg);
        }
        25% {
          transform: translateX(-50%) translateY(0) scale(1.05) rotateX(0deg);
        }
        85% {
          opacity: 1;
          transform: translateX(-50%) translateY(0) scale(1) rotateX(0deg);
        }
        100% {
          opacity: 0;
          transform: translateX(-50%) translateY(15px) scale(0.8) rotateX(-10deg);
        }
      }
      
      @keyframes perfectShotAnimation {
        0% {
          opacity: 0;
          transform: translateX(-50%) translateY(-40px) scale(0.5) rotate(-10deg);
        }
        10% {
          opacity: 1;
          transform: translateX(-50%) translateY(-10px) scale(1.3) rotate(5deg);
        }
        20% {
          transform: translateX(-50%) translateY(0) scale(1.1) rotate(-2deg);
        }
        30% {
          transform: translateX(-50%) translateY(0) scale(1.2) rotate(1deg);
        }
        40% {
          transform: translateX(-50%) translateY(0) scale(1.1) rotate(0deg);
        }
        80% {
          opacity: 1;
          transform: translateX(-50%) translateY(0) scale(1.1) rotate(0deg);
        }
        100% {
          opacity: 0;
          transform: translateX(-50%) translateY(20px) scale(0.7) rotate(5deg);
        }
      }
      
      @keyframes streakBonusAnimation {
        0% {
          opacity: 0;
          transform: translateX(-50%) translateY(-50px) scale(0.3);
        }
        10% {
          opacity: 1;
          transform: translateX(-50%) translateY(-10px) scale(1.4);
        }
        15% {
          transform: translateX(-50%) translateY(0) scale(1.1);
        }
        20% {
          transform: translateX(-50%) translateY(-5px) scale(1.25);
        }
        25% {
          transform: translateX(-50%) translateY(0) scale(1.15);
        }
        30% {
          transform: translateX(-50%) translateY(-2px) scale(1.2);
        }
        35% {
          transform: translateX(-50%) translateY(0) scale(1.1);
        }
        85% {
          opacity: 1;
          transform: translateX(-50%) translateY(0) scale(1.1);
        }
        100% {
          opacity: 0;
          transform: translateX(-50%) translateY(25px) scale(0.6);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(popup);
  
  // Remove popup after animation
  setTimeout(() => {
    if (popup.parentNode) {
      popup.remove();
    }
  }, 3000);
}

/**
 * Updates the score display UI (Phase 7: Enhanced)
 */
function updateScoreDisplay() {
  // Update center title and score
  const centerScoreDisplay = document.getElementById('center-score-display');
  if (centerScoreDisplay) {
    centerScoreDisplay.innerHTML = `
      <h2 style="margin: 0 0 10px 0; color: #FFD700; font-size: 18px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
        🏀 Basketball Simulator 🏀
      </h2>
      <div style="text-align: center;">
        <div style="font-size: 32px; font-weight: bold; color: #FFD700; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
          ${basketballScoring.totalScore}
        </div>
        <div style="font-size: 12px; color: #AAA; margin-top: 4px;">TOTAL POINTS</div>
      </div>
    `;
  }

  // Update detailed statistics display
  const scoreDisplay = document.getElementById('score-display');
  if (!scoreDisplay) return;
  
  const accuracy = basketballScoring.shotsAttempted > 0 ? 
                  Math.round((basketballScoring.shotsMade / basketballScoring.shotsAttempted) * 100) : 0;
  
  // Detailed statistics display
  scoreDisplay.innerHTML = `
    <!-- Statistics Grid -->
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; font-size: 11px; margin-bottom: 8px;">
      
      <!-- Shooting Stats -->
      <div style="background: rgba(255,215,0,0.1); padding: 6px; border-radius: 5px; text-align: center; border: 1px solid rgba(255,215,0,0.3);">
        <div style="font-weight: bold; color: #FFD700; margin-bottom: 4px; font-size: 9px;">📊 SHOOTING</div>
        <div style="font-size: 10px;"><strong>Made:</strong> ${basketballScoring.shotsMade}</div>
        <div style="font-size: 10px;"><strong>Attempts:</strong> ${basketballScoring.shotsAttempted}</div>
        <div style="color: ${accuracy >= 50 ? '#4CAF50' : accuracy >= 30 ? '#FF9800' : '#f44336'}; font-size: 10px;">
          <strong>Accuracy:</strong> ${accuracy}%
        </div>
      </div>
      
      <!-- Streak Stats -->
      <div style="background: rgba(76,175,80,0.1); padding: 6px; border-radius: 5px; text-align: center; border: 1px solid rgba(76,175,80,0.3);">
        <div style="font-weight: bold; color: #4CAF50; margin-bottom: 4px; font-size: 9px;">🔥 STREAKS</div>
        <div style="font-size: 10px;"><strong>Current:</strong> ${basketballScoring.currentStreak}</div>
        <div style="font-size: 10px;"><strong>Best:</strong> ${basketballScoring.bestStreak}</div>
        <div style="color: ${basketballScoring.consecutiveMisses > 2 ? '#f44336' : '#AAA'}; font-size: 10px;">
          <strong>Misses:</strong> ${basketballScoring.consecutiveMisses}
        </div>
      </div>
      
      <!-- Shot Analysis -->
      <div style="background: rgba(33,150,243,0.1); padding: 6px; border-radius: 5px; text-align: center; border: 1px solid rgba(33,150,243,0.3);">
        <div style="font-weight: bold; color: #2196F3; margin-bottom: 4px; font-size: 9px;">🎯 ANALYSIS</div>
        ${basketballScoring.lastShotResult ? 
          `<div style="color: ${basketballScoring.lastShotResult === 'made' ? '#4CAF50' : '#f44336'}; font-size: 10px;">
            <strong>Last:</strong> ${basketballScoring.lastShotResult.toUpperCase()}
          </div>` : '<div style="font-size: 10px;"><strong>Last:</strong> ---</div>'}
        ${basketballScoring.lastShotDistance > 0 ? 
          `<div style="font-size: 10px;"><strong>Distance:</strong> ${basketballScoring.lastShotDistance.toFixed(1)}m</div>` : 
          '<div style="font-size: 10px;"><strong>Distance:</strong> ---</div>'}
        <div style="color: #AAA; font-size: 9px;">
          ${basketballScoring.lastShotDistance > basketballScoring.twoPointZone ? '3-Point Zone' : '2-Point Zone'}
        </div>
      </div>
    </div>
    
    <!-- Performance Indicators -->
    <div style="border-top: 1px solid rgba(255,215,0,0.3); padding-top: 6px;">
      <div style="display: flex; justify-content: center; align-items: center; font-size: 9px;">
        <div style="color: #AAA;">
          Performance: 
          <span style="color: ${accuracy >= 70 ? '#4CAF50' : accuracy >= 50 ? '#FF9800' : accuracy >= 30 ? '#FFC107' : '#f44336'};">
            ${accuracy >= 70 ? 'EXCELLENT' : accuracy >= 50 ? 'GOOD' : accuracy >= 30 ? 'AVERAGE' : 'NEEDS PRACTICE'}
          </span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Finds the nearest hoop to the basketball
 */
function getNearestHoop() {
  if (!basketball) return hoopPositions[0];
  
  const ballPos = basketball.position;
  let nearestHoop = hoopPositions[0];
  let minDistance = ballPos.distanceTo(new THREE.Vector3(nearestHoop.x, nearestHoop.y, nearestHoop.z));
  
  for (let i = 1; i < hoopPositions.length; i++) {
    const hoop = hoopPositions[i];
    const distance = ballPos.distanceTo(new THREE.Vector3(hoop.x, hoop.y, hoop.z));
    if (distance < minDistance) {
      minDistance = distance;
      nearestHoop = hoop;
    }
  }
  
  return nearestHoop;
}

/**
 * Checks collision with rim (Phase 4)
 */
function checkRimCollision() {
  if (!basketball || !basketballPhysics.isFlying) return false;
  
  const ballPos = basketball.position;
  
  for (const hoop of hoopPositions) {
    const rimCenter = new THREE.Vector3(hoop.rimCenter.x, hoop.rimCenter.y, hoop.rimCenter.z);
    const distanceToRim = ballPos.distanceTo(rimCenter);
    
    // Check if ball is close enough to rim (minimal collision to allow passage)
    if (distanceToRim < (hoop.rimRadius + basketballPhysics.ballRadius * 0.1)) {
      // Check if ball is at approximately rim height (minimal height check)
      if (Math.abs(ballPos.y - hoop.rimCenter.y) < basketballPhysics.ballRadius * 0.5) {
        // Calculate bounce direction
        const bounceDirection = ballPos.clone().sub(rimCenter).normalize();
        
        // Apply rim bounce with energy loss
        const currentSpeed = basketballPhysics.velocity.length();
        basketballPhysics.velocity = bounceDirection.multiplyScalar(currentSpeed * basketballPhysics.rimBounceDecay);
        
        // Add almost no randomness for rim bounces (let ball pass through)
        basketballPhysics.velocity.add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          Math.random() * 0.2,
          (Math.random() - 0.5) * 0.1
        ));
        
        // Phase 5: Update rotation based on new velocity after rim bounce
        basketballPhysics.rotationSpeed.multiplyScalar(0.8);
        basketballPhysics.rotationSpeed.add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.3
        ));
        
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Checks collision with backboard (Phase 4)
 */
function checkBackboardCollision() {
  if (!basketball || !basketballPhysics.isFlying) return false;
  
  const ballPos = basketball.position;
  
  for (const hoop of hoopPositions) {
    const backboardCenter = hoop.backboardCenter;
    
    // Check if ball is close to backboard plane
    const distanceToBackboard = Math.abs(ballPos.x - backboardCenter.x);
    
    if (distanceToBackboard < basketballPhysics.ballRadius) {
      // Check if ball is within backboard bounds
      const withinHeight = Math.abs(ballPos.y - backboardCenter.y) < (hoop.backboardHeight / 2);
      const withinWidth = Math.abs(ballPos.z - backboardCenter.z) < (hoop.backboardWidth / 2);
      
      if (withinHeight && withinWidth) {
        // Reverse X velocity for backboard bounce
        basketballPhysics.velocity.x = -basketballPhysics.velocity.x * basketballPhysics.backboardBounceDecay;
        basketballPhysics.velocity.y *= basketballPhysics.backboardBounceDecay;
        basketballPhysics.velocity.z *= basketballPhysics.backboardBounceDecay;
        
        // Position ball slightly away from backboard
        if (ballPos.x > backboardCenter.x) {
          ballPos.x = backboardCenter.x + basketballPhysics.ballRadius + 0.01;
        } else {
          ballPos.x = backboardCenter.x - basketballPhysics.ballRadius - 0.01;
        }
        
        // Phase 5: Realistic rotation after backboard collision
        basketballPhysics.rotationSpeed.x *= 0.9; // Preserve most X rotation
        basketballPhysics.rotationSpeed.y *= 0.7; // Reduce Y rotation
        basketballPhysics.rotationSpeed.z = -basketballPhysics.rotationSpeed.z * 0.8; // Reverse and reduce Z rotation
        
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Calculates the initial velocity needed to reach the target hoop
 */
function calculateShotVelocity(startPos, targetPos, power) {
  const powerFactor = (power / 100) * 1.2 + 0.5; // Balanced power: 0.5 to 1.7 (strong enough but not excessive)
  const dx = targetPos.x - startPos.x;
  const dz = targetPos.z - startPos.z;
  const distance = Math.sqrt(dx * dx + dz * dz);
  
  // Ensure proper arc for close shots (inside paint)
  let optimalAngle;
  if (distance < 4.0) {
    // For close shots, use a steeper angle (50-60 degrees) for proper arc
    optimalAngle = Math.PI / 3 + (Math.PI / 12); // ~55-60 degrees
  } else {
    // For longer shots, use standard calculation
    optimalAngle = Math.PI / 4 + (distance / 30) * (Math.PI / 6); // Adjust angle based on distance
  }
  
  // Calculate initial speed needed to reach target (balanced multiplier)
  const speed = Math.sqrt(Math.abs(basketballPhysics.gravity) * distance / Math.sin(2 * optimalAngle)) * powerFactor * 1.3;
  
  // Convert to velocity components
  const horizontalSpeed = speed * Math.cos(optimalAngle);
  const verticalSpeed = speed * Math.sin(optimalAngle);
  
  // Normalize horizontal direction
  const horizontalDistance = Math.sqrt(dx * dx + dz * dz);
  const vx = horizontalDistance > 0 ? (dx / horizontalDistance) * horizontalSpeed : 0;
  const vz = horizontalDistance > 0 ? (dz / horizontalDistance) * horizontalSpeed : 0;
  
  return new THREE.Vector3(vx, verticalSpeed, vz);
}

/**
 * Shoots the basketball toward the nearest hoop (Phase 3, 5 & 6)
 */
function shootBasketball() {
  if (!basketball || basketballPhysics.isFlying) return;
  
  const nearestHoop = getNearestHoop();
  const targetPos = new THREE.Vector3(nearestHoop.x, nearestHoop.y, nearestHoop.z);
  const startPos = basketball.position.clone();
  
  // Phase 6: Start tracking this shot
  basketballScoring.isTrackingShot = true;
  basketballScoring.shotStartTime = performance.now();
  basketballScoring.shotStartPosition = startPos.clone();
  basketballScoring.hasScored = false; // Reset scoring flag for new shot
  
  // Calculate initial velocity based on power and target
  basketballPhysics.velocity = calculateShotVelocity(startPos, targetPos, basketballShot.power);
  
  // Phase 5: Enhanced rotation based on shot direction and power
  const shotDirection = targetPos.clone().sub(startPos).normalize();
  const powerFactor = (basketballShot.power / 100) * 0.5 + 0.3; // Scale rotation with power
  
  basketballPhysics.rotationSpeed.set(
    // X rotation based on shot arc (higher power = more backspin)
    -powerFactor * 0.8,
    // Y rotation for slight side spin based on direction
    shotDirection.x * powerFactor * 0.3,
    // Z rotation based on horizontal shot direction
    shotDirection.z * powerFactor * 0.4
  );
  
  // Initialize physics state properly
  basketballPhysics.isFlying = true;
  basketballPhysics.startTime = performance.now(); // Track when physics started
  
  // Clear trajectory preview when shot starts (Phase 7)
  if (trajectoryLine) {
    scene.remove(trajectoryLine);
    trajectoryLine = null;
  }
}

/**
 * Updates basketball physics during flight (Phase 3, 4, 5 & 6)
 */
function updateBasketballPhysics(deltaTime) {
  if (!basketball || !basketballPhysics.isFlying) return;
  
  // Phase 6: Check for scoring first
  if (basketballScoring.isTrackingShot && checkBasketballScore()) {
    // Ball scored! Continue with physics but scoring is registered
  }
  
  // Check rim and backboard collisions (Phase 4)
  if (checkRimCollision() || checkBackboardCollision()) {
    // Collision occurred, continue with updated velocity
  }
  
  // Apply gravity
  basketballPhysics.velocity.y += basketballPhysics.gravity * deltaTime;
  
  // Apply air resistance
  basketballPhysics.velocity.multiplyScalar(basketballPhysics.airResistance);
  
  // Phase 5: Update rotation based on flight velocity
  updateFlightRotation();
  
  // Update position
  const deltaPos = basketballPhysics.velocity.clone().multiplyScalar(deltaTime);
  basketball.position.add(deltaPos);
  
  // Apply rotation (Phase 5: Enhanced rotation during flight)
  basketball.rotation.x += basketballPhysics.rotationSpeed.x * deltaTime;
  basketball.rotation.y += basketballPhysics.rotationSpeed.y * deltaTime;
  basketball.rotation.z += basketballPhysics.rotationSpeed.z * deltaTime;
  
  // Ground collision detection (Phase 4 - improved)
  if (basketball.position.y <= basketballPhysics.groundY) {
    basketball.position.y = basketballPhysics.groundY;
    
    // Bounce if velocity is high enough
    if (Math.abs(basketballPhysics.velocity.y) > basketballPhysics.minBounceVelocity) {
      basketballPhysics.velocity.y = -basketballPhysics.velocity.y * basketballPhysics.bounceDecay;
      basketballPhysics.velocity.x *= basketballPhysics.bounceDecay;
      basketballPhysics.velocity.z *= basketballPhysics.bounceDecay;
      
      // Phase 5: Realistic ground bounce rotation
      basketballPhysics.rotationSpeed.x *= 0.8; // Reduce forward spin
      basketballPhysics.rotationSpeed.y *= 0.9; // Preserve most side spin  
      basketballPhysics.rotationSpeed.z *= 0.8; // Reduce lateral spin
    } else {
      // Stop bouncing - Phase 5: Stop all rotation too
      basketballPhysics.velocity.set(0, 0, 0);
      basketballPhysics.rotationSpeed.set(0, 0, 0);
      basketballPhysics.isFlying = false;
      return; // Exit early to prevent further processing
    }
  }
  
  // Enhanced state checking to prevent stuck physics
  const totalSpeed = basketballPhysics.velocity.length();
  const rotationSpeed = basketballPhysics.rotationSpeed.length();
  
  // Multiple conditions to detect when ball should stop flying
  const isOnGround = basketball.position.y <= basketballPhysics.groundY + 0.02;
  const isMovingSlowly = totalSpeed < 0.2;
  const isRotatingSlowly = rotationSpeed < 0.1;
  const hasLowVerticalVelocity = Math.abs(basketballPhysics.velocity.y) < 0.3;
  
  // If ball is essentially at rest, stop physics completely
  if (isOnGround && isMovingSlowly && (isRotatingSlowly || hasLowVerticalVelocity)) {
    basketballPhysics.velocity.set(0, 0, 0);
    basketballPhysics.rotationSpeed.set(0, 0, 0);
    basketballPhysics.isFlying = false;
    basketball.position.y = basketballPhysics.groundY; // Ensure exact ground position
    
    // Phase 6: Register miss if shot was being tracked
    if (basketballScoring.isTrackingShot) {
      const shotDistance = basketballScoring.shotStartPosition ? 
        Math.sqrt(
          Math.pow(basketballScoring.shotStartPosition.x - basketball.position.x, 2) +
          Math.pow(basketballScoring.shotStartPosition.z - basketball.position.z, 2)
        ) : 0;
      registerScore(false, 0, shotDistance);
    }
    
    return; // Exit early
  }
  
  // Additional failsafe: if physics has been running for too long with low speed
  if (!basketballPhysics.startTime) {
    basketballPhysics.startTime = performance.now();
  }
  
  const physicsRunTime = (performance.now() - basketballPhysics.startTime) / 1000;
  if (physicsRunTime > 10 && totalSpeed < 0.5) { // 10 seconds timeout with low speed
    basketballPhysics.velocity.set(0, 0, 0);
    basketballPhysics.rotationSpeed.set(0, 0, 0);
    basketballPhysics.isFlying = false;
    basketball.position.y = basketballPhysics.groundY;
    basketballPhysics.startTime = null;
    
    // Phase 6: Register miss if shot was being tracked
    if (basketballScoring.isTrackingShot) {
      const shotDistance = basketballScoring.shotStartPosition ? 
        Math.sqrt(
          Math.pow(basketballScoring.shotStartPosition.x - basketball.position.x, 2) +
          Math.pow(basketballScoring.shotStartPosition.z - basketball.position.z, 2)
        ) : 0;
      registerScore(false, 0, shotDistance);
    }
    
    return;
  }
  
  // Check boundaries (keep ball on court during flight) - Phase 4 improved
  const courtBounce = 0.3; // Reduced bounce on court walls
  
  if (basketball.position.x < -15) {
    basketball.position.x = -15;
    basketballPhysics.velocity.x = -basketballPhysics.velocity.x * courtBounce;
  }
  if (basketball.position.x > 15) {
    basketball.position.x = 15;
    basketballPhysics.velocity.x = -basketballPhysics.velocity.x * courtBounce;
  }
  if (basketball.position.z < -7.5) {
    basketball.position.z = -7.5;
    basketballPhysics.velocity.z = -basketballPhysics.velocity.z * courtBounce;
  }
  if (basketball.position.z > 7.5) {
    basketball.position.z = 7.5;
    basketballPhysics.velocity.z = -basketballPhysics.velocity.z * courtBounce;
  }
}

/**
 * Updates shot power based on W/S key input
 */
function updateShotPower() {
  let powerChange = 0;
  
  if (basketballShot.keys.w) powerChange += basketballShot.powerIncrement;
  if (basketballShot.keys.s) powerChange -= basketballShot.powerIncrement;
  
  if (powerChange !== 0) {
    basketballShot.power += powerChange;
    // Clamp power within limits
    basketballShot.power = Math.max(basketballShot.minPower, 
                                   Math.min(basketballShot.maxPower, basketballShot.power));
    
    // Update power indicator in UI
    updatePowerIndicator();
  }
}

/**
 * Updates the visual power indicator in the UI
 */
/**
 * Updates the power indicator with enhanced visuals and tips (Phase 7)
 */
function updatePowerIndicator() {
  const powerFill = document.getElementById('power-fill');
  const powerText = document.getElementById('power-text');
  
  if (powerFill && powerText) {
    const powerPercentage = (basketballShot.power / basketballShot.maxPower) * 100;
    powerFill.style.width = powerPercentage + '%';
    
    // Enhanced power text with descriptive labels (Phase 7)
    let powerLabel, powerTip;
    if (powerPercentage < 20) {
      powerLabel = 'SOFT';
      powerTip = 'Too weak! Press W to increase';
      powerFill.style.background = 'linear-gradient(90deg, #4CAF50, #66BB6A)';
    } else if (powerPercentage < 40) {
      powerLabel = 'LIGHT';
      powerTip = 'Good for close shots';
      powerFill.style.background = 'linear-gradient(90deg, #8BC34A, #9CCC65)';
    } else if (powerPercentage < 60) {
      powerLabel = 'MEDIUM';
      powerTip = 'Perfect for mid-range';
      powerFill.style.background = 'linear-gradient(90deg, #CDDC39, #D4E157)';
    } else if (powerPercentage < 80) {
      powerLabel = 'STRONG';
      powerTip = 'Great for three-pointers';
      powerFill.style.background = 'linear-gradient(90deg, #FFC107, #FFCA28)';
    } else if (powerPercentage < 95) {
      powerLabel = 'HARD';
      powerTip = 'Max power! Aim carefully';
      powerFill.style.background = 'linear-gradient(90deg, #FF9800, #FFB74D)';
    } else {
      powerLabel = 'MAX!';
      powerTip = 'Full power! Long range shots';
      powerFill.style.background = 'linear-gradient(90deg, #FF5722, #FF7043)';
    }
    
    powerText.innerHTML = `${Math.round(basketballShot.power)}%`;
    
    // Add power tip below the bar
    const powerControls = document.querySelector('.power-controls');
    if (powerControls) {
      powerControls.innerHTML = `
        <div style="margin-bottom: 4px; font-size: 10px; color: #FFD700; font-weight: bold; text-align: center;">
          ${powerLabel} - ${powerTip}
        </div>
        <div style="font-size: 11px; text-align: center;">
          <strong style="color: #4CAF50;">W</strong> increase • 
          <strong style="color: #f44336;">S</strong> decrease • 
          <strong style="color: #FFD700;">SPACE</strong> shoot
        </div>
      `;
    }
    
    // Add visual effects for max power
    if (powerPercentage >= 95) {
      powerFill.style.boxShadow = '0 0 20px rgba(255, 87, 34, 0.8), inset 0 2px 4px rgba(255,255,255,0.3)';
      powerFill.style.animation = 'powerPulse 0.5s ease-in-out infinite alternate';
    } else {
      powerFill.style.boxShadow = 'inset 0 2px 4px rgba(255,255,255,0.3), 0 0 10px rgba(255,215,0,0.4)';
      powerFill.style.animation = 'none';
    }
    
    // Update shot trajectory preview (Phase 7 Enhancement)
    updateTrajectoryPreview();
  }
  
  // Add power pulse animation if not exists
  if (!document.getElementById('power-pulse-styles')) {
    const style = document.createElement('style');
    style.id = 'power-pulse-styles';
    style.textContent = `
      @keyframes powerPulse {
        0% { transform: scaleY(1); }
        100% { transform: scaleY(1.1); }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Visual trajectory preview system (Phase 7 Enhancement)
 */
let trajectoryLine = null;

function updateTrajectoryPreview() {
  // Remove existing trajectory line
  if (trajectoryLine) {
    scene.remove(trajectoryLine);
    trajectoryLine = null;
  }
  
  // Only show trajectory when aiming (power > 0)
  if (basketballShot.power > 0 && basketball) {
    const nearestHoop = getNearestHoop();
    const ballPos = basketball.position.clone();
    const targetPos = new THREE.Vector3(nearestHoop.x, nearestHoop.y - 0.5, nearestHoop.z);
    
    // Calculate trajectory points
    const points = [];
    const numPoints = 20;
    const gravity = basketballPhysics.gravity;
    
    // Calculate initial velocity based on power and distance
    const distance = ballPos.distanceTo(targetPos);
    const angle = Math.PI / 4; // 45 degree angle for optimal trajectory
    const power = basketballShot.power / 100;
    const initialSpeed = power * 25; // Scale power to speed
    
    const vx = (targetPos.x - ballPos.x) / distance * initialSpeed * Math.cos(angle);
    const vz = (targetPos.z - ballPos.z) / distance * initialSpeed * Math.cos(angle);
    const vy = initialSpeed * Math.sin(angle);
    
    // Generate trajectory points
    for (let i = 0; i <= numPoints; i++) {
      const t = (i / numPoints) * 2; // Time scale
      const x = ballPos.x + vx * t;
      const y = ballPos.y + vy * t - 0.5 * Math.abs(gravity) * t * t;
      const z = ballPos.z + vz * t;
      
      if (y < ballPos.y - 2) break; // Stop if trajectory goes too low
      points.push(new THREE.Vector3(x, y, z));
    }
    
    // Create trajectory line
    if (points.length > 1) {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ 
        color: basketballShot.power > 80 ? 0xff6600 : 0x00ff00,
        opacity: 0.6,
        transparent: true,
        linewidth: 2
      });
      trajectoryLine = new THREE.Line(geometry, material);
      scene.add(trajectoryLine);
    }
  }
}

/**
 * Checks if basketball is within court boundaries
 */
function isWithinBounds(x, z) {
  return x >= basketballMovement.boundaries.minX && 
         x <= basketballMovement.boundaries.maxX &&
         z >= basketballMovement.boundaries.minZ && 
         z <= basketballMovement.boundaries.maxZ;
}

/**
 * Calculates rotation speed based on movement direction and velocity (Phase 5)
 */
function calculateRotationFromMovement(deltaX, deltaZ) {
  if (!basketball || (deltaX === 0 && deltaZ === 0)) return;
  
  // Calculate rotation axis perpendicular to movement direction
  // For ground movement: rotation around axis perpendicular to movement
  const rotationX = deltaZ * basketballPhysics.rotationScaleFactor; // Forward/backward movement rotates around X
  const rotationZ = -deltaX * basketballPhysics.rotationScaleFactor; // Left/right movement rotates around Z
  
  // Apply rotation with realistic physics
  basketballPhysics.rotationSpeed.x = rotationX;
  basketballPhysics.rotationSpeed.z = rotationZ;
  basketballPhysics.rotationSpeed.y *= 0.98; // Slight decay on Y rotation
}

/**
 * Updates ball rotation during flight based on velocity (Phase 5)
 */
function updateFlightRotation() {
  if (!basketball || !basketballPhysics.isFlying) return;
  
  const velocity = basketballPhysics.velocity;
  const speed = velocity.length();
  
  if (speed > 0.1) {
    // Calculate rotation based on flight velocity
    const rotationFactor = basketballPhysics.rotationScaleFactor * 0.3; // Reduced for flight
    
    // X rotation from forward/backward movement
    basketballPhysics.rotationSpeed.x = velocity.z * rotationFactor;
    
    // Z rotation from left/right movement  
    basketballPhysics.rotationSpeed.z = -velocity.x * rotationFactor;
    
    // Y rotation based on overall horizontal movement for spin effect
    const horizontalSpeed = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);
    basketballPhysics.rotationSpeed.y = horizontalSpeed * rotationFactor * 0.5;
  }
}

/**
 * Applies rotation decay when ball is not moving (Phase 5)
 */
function applyRotationDecay() {
  if (!basketball || basketballPhysics.isFlying) return;
  
  // Gradually slow down rotation when not moving
  basketballPhysics.rotationSpeed.multiplyScalar(basketballPhysics.rotationDecay);
  
  // Stop very small rotations to prevent endless spinning
  if (basketballPhysics.rotationSpeed.length() < 0.01) {
    basketballPhysics.rotationSpeed.set(0, 0, 0);
  }
}

/**
 * Updates basketball position based on keyboard input (Phase 1 & 5)
 */
function updateBasketballMovement() {
  if (!basketball || basketballPhysics.isFlying) return; // Don't move if ball is flying

  let deltaX = 0;
  let deltaZ = 0;

  // Calculate movement based on pressed keys
  if (basketballMovement.keys.ArrowLeft) deltaX -= basketballMovement.speed;
  if (basketballMovement.keys.ArrowRight) deltaX += basketballMovement.speed;
  if (basketballMovement.keys.ArrowUp) deltaZ -= basketballMovement.speed;
  if (basketballMovement.keys.ArrowDown) deltaZ += basketballMovement.speed;

  // Apply movement if within boundaries
  if (deltaX !== 0 || deltaZ !== 0) {
    const newX = basketball.position.x + deltaX;
    const newZ = basketball.position.z + deltaZ;

    // Check boundaries and apply movement
    let actualDeltaX = 0;
    let actualDeltaZ = 0;
    
    if (isWithinBounds(newX, basketball.position.z)) {
      basketball.position.x = newX;
      actualDeltaX = deltaX;
    }
    if (isWithinBounds(basketball.position.x, newZ)) {
      basketball.position.z = newZ;
      actualDeltaZ = deltaZ;
    }
    
    // Phase 5: Calculate rotation based on actual movement
    calculateRotationFromMovement(actualDeltaX, actualDeltaZ);
    
    // Update trajectory preview when ball moves (Phase 7)
    updateTrajectoryPreview();
  } else {
    // Phase 5: Apply rotation decay when not moving
    applyRotationDecay();
  }
  
  // Phase 5: Apply rotation to the basketball
  basketball.rotation.x += basketballPhysics.rotationSpeed.x;
  basketball.rotation.y += basketballPhysics.rotationSpeed.y;
  basketball.rotation.z += basketballPhysics.rotationSpeed.z;
}

/**
 * Manually resets basketball to center court and stops all physics AND resets camera position (Phase 1 & 6)
 */
function resetBasketball() {
  if (!basketball) return;
  
  // Reset basketball position and physics
  basketball.position.set(0, basketballPhysics.groundY, 0);
  basketballPhysics.velocity.set(0, 0, 0);
  basketballPhysics.rotationSpeed.set(0, 0, 0);
  basketballPhysics.isFlying = false;
  basketballPhysics.startTime = null;
  basketballShot.power = 0;
  updatePowerIndicator();
  
  // Reset camera position to initial position
  camera.position.set(0, 10, 20);
  
  // Reset orbit controls target to look at center court (where ball is)
  controls.target.set(0, 0, 0);
  controls.update();
  
  // Phase 6: Stop tracking any current shot
  basketballScoring.isTrackingShot = false;
}

/**
 * Resets all scoring statistics (Phase 6)
 */
function resetScoreSystem() {
  basketballScoring.totalScore = 0;
  basketballScoring.shotsAttempted = 0;
  basketballScoring.shotsMade = 0;
  basketballScoring.currentStreak = 0;
  basketballScoring.bestStreak = 0;
  basketballScoring.lastShotResult = null;
  basketballScoring.lastShotDistance = 0;
  basketballScoring.isTrackingShot = false;
  basketballScoring.consecutiveMisses = 0;
  updateScoreDisplay();
  updateDynamicTips(); // Update tips after reset (Phase 7)
  
  // Show reset confirmation
  showScorePopup('STATS RESET', 'miss');
}

/**
 * Updates both basketball movement, shot power, and physics
 */
function updateBasketballSystem(deltaTime = 0.016) {
  updateBasketballMovement();
  updateShotPower();
  updateBasketballPhysics(deltaTime);
}

// =======================
// Scene Initialization
// =======================

createBasketballCourt();
createBasketballHoop(-15);
createBasketballHoop(15);
createBasketball();
createBleachers();
createScoreboard();

// Phase 6: Initialize score display
updateScoreDisplay();

// --- Camera Setup ---
camera.position.set(0, 10, 20);

// --- Orbit Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;

// --- HUD Toggle ---
// Get HUD elements
const scoreDisplay = document.getElementById('score-display');
const controlsDisplay = document.getElementById('controls-display');
let hudVisible = true;

// Controls visibility management
let controlsVisible = true;

function hideControls() {
  controlsVisible = false;
  if (controlsDisplay) controlsDisplay.style.display = 'none';
  const reopenButton = document.getElementById('reopen-controls');
  if (reopenButton) {
    reopenButton.style.display = 'block';
    reopenButton.style.visibility = 'visible';
    reopenButton.style.opacity = '1';
  }
}

function showControls() {
  controlsVisible = true;
  if (controlsDisplay) controlsDisplay.style.display = 'block';
  const reopenButton = document.getElementById('reopen-controls');
  if (reopenButton) {
    reopenButton.style.display = 'none';
    reopenButton.style.visibility = 'hidden';
    reopenButton.style.opacity = '0';
  }
}

// Initialize controls after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setupControlEventListeners();
});

// Also try to add listeners immediately (fallback)
setTimeout(() => {
  setupControlEventListeners();
}, 100);

// Enhanced event handling with more debugging
document.addEventListener('click', (event) => {
  if (event.target.id === 'close-controls') {
    event.preventDefault();
    event.stopPropagation();
    hideControls();
  } else if (event.target.id === 'reopen-controls') {
    event.preventDefault();
    event.stopPropagation();
    showControls();
  }
});

// Add a specific click listener to the reopen button area
document.addEventListener('click', (event) => {
  // Check if we're clicking near where the reopen button should be
  if (event.clientX < 200 && event.clientY > window.innerHeight - 100) {
    const reopenButton = document.getElementById('reopen-controls');
    if (reopenButton && reopenButton.style.display !== 'none') {
      showControls();
    }
  }
});

function setupControlEventListeners() {
  const closeControlsButton = document.getElementById('close-controls');
  const reopenControlsButton = document.getElementById('reopen-controls');
  
  if (closeControlsButton) {
    // Remove any existing listeners
    closeControlsButton.onclick = null;
    closeControlsButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      hideControls();
    });
  }
  
  if (reopenControlsButton) {
    // Remove any existing listeners and try multiple approaches
    reopenControlsButton.onclick = null;
    
    // Method 1: Standard event listener
    reopenControlsButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showControls();
    });
    
    // Method 2: onclick property as backup
    reopenControlsButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      showControls();
    };
    
    // Method 3: Mouse events for debugging
    reopenControlsButton.addEventListener('mousedown', (e) => {
      // Mouse event detected
    });
    
    reopenControlsButton.addEventListener('mouseup', (e) => {
      // Mouse event detected
    });
  }
}

// --- Free Camera Controls ---
let isFreeCamera = false;
let freeCamVelocity = new THREE.Vector3();
let freeCamDirection = new THREE.Vector3();
let freeCamSpeed = 0.4;
let freeCamKeys = { w: false, a: false, s: false, d: false, q: false, e: false };
let arrowKeys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
let lastMouse = null;

function enableFreeCamera() {
  controls.enabled = false;
  document.body.style.cursor = 'none';
}
function disableFreeCamera() {
  controls.enabled = isOrbitEnabled;
  document.body.style.cursor = '';
}

// --- Keyboard and Mouse Controls ---
document.addEventListener('keydown', e => {
  if (e.key === "o") isOrbitEnabled = !isOrbitEnabled;
  if (e.key === "h") {
    hudVisible = !hudVisible;
    if (scoreDisplay) scoreDisplay.style.display = hudVisible ? '' : 'none';
    const centerScoreDisplay = document.getElementById('center-score-display');
    if (centerScoreDisplay) centerScoreDisplay.style.display = hudVisible ? '' : 'none';
    // Only show/hide controls if they're supposed to be visible
    if (hudVisible && controlsVisible) {
      showControls();
    } else if (!hudVisible) {
      if (controlsDisplay) controlsDisplay.style.display = 'none';
      const reopenButton = document.getElementById('reopen-controls');
      if (reopenButton) reopenButton.style.display = 'none';
    }
  }
  if (e.key === "f") {
    isFreeCamera = !isFreeCamera;
    if (isFreeCamera) enableFreeCamera(); else disableFreeCamera();
  }
  
  // Free camera controls (only when in free camera mode)
  if (isFreeCamera) {
    if (e.key in freeCamKeys) freeCamKeys[e.key] = true;
    if (e.key in arrowKeys) arrowKeys[e.key] = true;
  } else {
    // Basketball movement controls (only when NOT in free camera mode)
    if (e.key in basketballMovement.keys) {
      basketballMovement.keys[e.key] = true;
    }
    
    // Basketball shot power controls (only when NOT in free camera mode)
    if (e.key === 'w' || e.key === 'W') basketballShot.keys.w = true;
    if (e.key === 's' || e.key === 'S') basketballShot.keys.s = true;
  }
  
  // Basketball shooting (spacebar)
  if (e.key === ' ' || e.key === 'Spacebar') {
    e.preventDefault(); // Prevent page scroll
    if (!isFreeCamera) {
      shootBasketball();
    }
  }
  
  // Basketball reset (R key)
  if (e.key === 'r' || e.key === 'R') {
    if (!isFreeCamera) {
      resetBasketball();
    }
  }
  
  // Score system reset (T key) - Phase 6
  if (e.key === 't' || e.key === 'T') {
    if (!isFreeCamera) {
      resetScoreSystem();
    }
  }
});

document.addEventListener('keyup', e => {
  // Free camera controls
  if (isFreeCamera) {
    if (e.key in freeCamKeys) freeCamKeys[e.key] = false;
    if (e.key in arrowKeys) arrowKeys[e.key] = false;
  } else {
    // Basketball movement controls
    if (e.key in basketballMovement.keys) {
      basketballMovement.keys[e.key] = false;
    }
    
    // Basketball shot power controls
    if (e.key === 'w' || e.key === 'W') basketballShot.keys.w = false;
    if (e.key === 's' || e.key === 'S') basketballShot.keys.s = false;
  }
});
document.addEventListener('mousemove', e => {
  // Only allow mouse look if not in free camera mode
  // (No-op in free camera mode)
  if (!isFreeCamera) {
    if (lastMouse) {
      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;
      camera.rotation.y -= dx * 0.002;
      camera.rotation.x -= dy * 0.002;
      camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x));
    }
    lastMouse = { x: e.clientX, y: e.clientY };
  }
});
document.addEventListener('mouseleave', () => { lastMouse = null; });

// --- Animation Loop ---
function animate() {
  requestAnimationFrame(animate);
  
  // Calculate delta time for physics
  const currentTime = performance.now() * 0.001; // Convert to seconds
  const deltaTime = Math.min(currentTime - (animate.lastTime || currentTime), 0.033); // Cap at ~30fps
  animate.lastTime = currentTime;
  
  // Start timer on first frame
  startGameTimer();
  
  // Update game timer
  updateGameTimer();
  
  // Update basketball system (movement + shot power + physics)
  updateBasketballSystem(deltaTime);
  
  if (isFreeCamera) {
    // WASDQE movement
    freeCamDirection.set(0,0,0);
    if (freeCamKeys.w) freeCamDirection.z -= 1;
    if (freeCamKeys.s) freeCamDirection.z += 1;
    if (freeCamKeys.a) freeCamDirection.x -= 1;
    if (freeCamKeys.d) freeCamDirection.x += 1;
    if (freeCamKeys.q) freeCamDirection.y -= 1;
    if (freeCamKeys.e) freeCamDirection.y += 1;
    freeCamDirection.normalize();
    // Move in camera's local space
    const move = freeCamDirection.clone().applyEuler(camera.rotation).multiplyScalar(freeCamSpeed);
    camera.position.add(move);
    // Arrow keys: rotate camera view
    if (arrowKeys.ArrowLeft) camera.rotation.y += 0.03;
    if (arrowKeys.ArrowRight) camera.rotation.y -= 0.03;
    if (arrowKeys.ArrowUp) camera.rotation.x += 0.02; // Inverted: up arrow looks up
    if (arrowKeys.ArrowDown) camera.rotation.x -= 0.02; // Inverted: down arrow looks down
    camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x));
  } else {
    controls.enabled = isOrbitEnabled;
    controls.update();
  }
  renderer.render(scene, camera);
}

// Initialize UI elements (Phase 7)
updateScoreDisplay();
updateDynamicTips();

// Tips panel toggle functionality (Phase 7)
const closeTipsButton = document.getElementById('close-tips');
const reopenTipsButton = document.getElementById('reopen-tips');
const tipsPanel = document.getElementById('tips-panel');

if (closeTipsButton && reopenTipsButton && tipsPanel) {
  closeTipsButton.addEventListener('click', () => {
    tipsPanel.style.display = 'none';
    reopenTipsButton.style.display = 'flex';
  });
  
  reopenTipsButton.addEventListener('click', () => {
    tipsPanel.style.display = 'block';
    reopenTipsButton.style.display = 'none';
  });
}

animate();