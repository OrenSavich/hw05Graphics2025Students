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
    new THREE.TorusGeometry(0.23, 0.02, 8, 16),
    new THREE.MeshPhongMaterial({ color: 0xff6600 })
  );
  rim.rotation.x = degreesToRadians(-90);
  rim.position.set(hoopX + (hoopX < 0 ? 1.3 : -1.3), 4.5, 0);
  rim.castShadow = true;
  group.add(rim);

  // Net
  const netGroup = new THREE.Group();
  const netMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const netSegments = 16; // More vertical strands
  const netHeight = 0.5;
  const topRadius = 0.23;
  const bottomRadius = 0.13;
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
  const ringCount = 4;
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
    new THREE.MeshBasicMaterial({ map: createScoreTexture('TIME', '12:00') }), // front
    new THREE.MeshBasicMaterial({ map: createScoreTexture('TIME', '12:00') })  // back
  ];
  scoreboard.material = materials;

  scene.add(scoreboard);
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
function updatePowerIndicator() {
  const powerFill = document.getElementById('power-fill');
  const powerText = document.getElementById('power-text');
  
  if (powerFill && powerText) {
    const powerPercentage = (basketballShot.power / basketballShot.maxPower) * 100;
    powerFill.style.width = powerPercentage + '%';
    powerText.textContent = Math.round(basketballShot.power) + '%';
    
    // Color coding: green (low) -> yellow (medium) -> red (high)
    if (powerPercentage < 33) {
      powerFill.style.backgroundColor = '#00ff00'; // Green
    } else if (powerPercentage < 66) {
      powerFill.style.backgroundColor = '#ffff00'; // Yellow
    } else {
      powerFill.style.backgroundColor = '#ff6600'; // Orange/Red
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
 * Updates basketball position based on keyboard input
 */
function updateBasketballMovement() {
  if (!basketball) return;

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
    if (isWithinBounds(newX, basketball.position.z)) {
      basketball.position.x = newX;
    }
    if (isWithinBounds(basketball.position.x, newZ)) {
      basketball.position.z = newZ;
    }
  }
}

/**
 * Updates both basketball movement and shot power
 */
function updateBasketballSystem() {
  updateBasketballMovement();
  updateShotPower();
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
  }
  
  // Basketball movement controls (only when NOT in free camera mode)
  if (!isFreeCamera && e.key in basketballMovement.keys) {
    basketballMovement.keys[e.key] = true;
  }
  
  // Basketball shot power controls (only when NOT in free camera mode)
  if (!isFreeCamera) {
    if (e.key === 'w' || e.key === 'W') basketballShot.keys.w = true;
    if (e.key === 's' || e.key === 'S') basketballShot.keys.s = true;
  }
});

document.addEventListener('keyup', e => {
  // Free camera controls
  if (isFreeCamera && (e.key in freeCamKeys)) freeCamKeys[e.key] = false;
  if (isFreeCamera && (e.key in arrowKeys)) arrowKeys[e.key] = false;
  
  // Basketball movement controls
  if (e.key in basketballMovement.keys) {
    basketballMovement.keys[e.key] = false;
  }
  
  // Basketball shot power controls
  if (e.key === 'w' || e.key === 'W') basketballShot.keys.w = false;
  if (e.key === 's' || e.key === 'S') basketballShot.keys.s = false;
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
  
  // Update basketball system (movement + shot power)
  updateBasketballSystem();
  
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
animate();