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
 * Creates the basketball court, including floor and lines.
 */
function createBasketballCourt() {
  // Court floor
  const court = new THREE.Mesh(
    new THREE.BoxGeometry(30, 0.2, 15),
    new THREE.MeshPhongMaterial({ color: 0xc68642, shininess: 50 })
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

  // Center circle (outline)
  const centerCircle = new THREE.Mesh(
    new THREE.RingGeometry(2, 2.2, 32),
    lineMaterial
  );
  centerCircle.rotation.x = degreesToRadians(-90);
  centerCircle.position.y = 0.11;
  scene.add(centerCircle);

  // Center circle (interior)
  const centerCircleInterior = new THREE.Mesh(
    new THREE.CircleGeometry(2, 32),
    new THREE.MeshBasicMaterial({ color: 0xff6600 })
  );
  centerCircleInterior.rotation.x = degreesToRadians(-90);
  centerCircleInterior.position.y = 0.105;
  scene.add(centerCircleInterior);

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
  group.add(arm);

  // Backboard
  const backboard = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 1.6, 0.1),
    new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 })
  );
  backboard.position.set(hoopX + (hoopX < 0 ? 1 : -1), 5, 0);
  backboard.rotation.y = degreesToRadians(hoopX < 0 ? 90 : -90);
  backboard.castShadow = true;
  backboard.receiveShadow = true;
  group.add(backboard);

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
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const top = new THREE.Vector3(Math.cos(angle) * 0.23, 0, Math.sin(angle) * 0.23);
    const bottom = new THREE.Vector3(Math.cos(angle) * 0.15, -0.4, Math.sin(angle) * 0.15);
    const geometry = new THREE.BufferGeometry().setFromPoints([top, bottom]);
    netGroup.add(new THREE.Line(geometry, netMaterial));
  }
  netGroup.position.set(hoopX + (hoopX < 0 ? 1.3 : -1.3), 4.5, 0);
  group.add(netGroup);

  scene.add(group);
}

// =======================
// Basketball Creation
// =======================

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
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    // Raise the ball even higher above the court
    mesh.position.set(0, 0.30, 0); // higher Y value for more clearance
    mesh.rotation.y = Math.PI / 4;
    scene.add(mesh);
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
// Scene Initialization
// =======================

createBasketballCourt();
createBasketballHoop(-15);
createBasketballHoop(15);
createBasketball();
createBleachers();
createScoreboard();

// --- Camera Setup ---
camera.position.set(0, 15, 30);

// --- Orbit Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;

// --- HUD Toggle ---
// Get HUD elements
const scoreDisplay = document.getElementById('score-display');
const controlsDisplay = document.getElementById('controls-display');
let hudVisible = true;

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
    if (controlsDisplay) controlsDisplay.style.display = hudVisible ? '' : 'none';
  }
  if (e.key === "f") {
    isFreeCamera = !isFreeCamera;
    if (isFreeCamera) enableFreeCamera(); else disableFreeCamera();
  }
  if (isFreeCamera) {
    if (e.key in freeCamKeys) freeCamKeys[e.key] = true;
    if (e.key in arrowKeys) arrowKeys[e.key] = true;
  }
});
document.addEventListener('keyup', e => {
  if (isFreeCamera && (e.key in freeCamKeys)) freeCamKeys[e.key] = false;
  if (isFreeCamera && (e.key in arrowKeys)) arrowKeys[e.key] = false;
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