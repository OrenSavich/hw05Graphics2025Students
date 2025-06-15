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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 15);
directionalLight.castShadow = true;
scene.add(directionalLight);

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
  const geometry = new THREE.SphereGeometry(0.12, 64, 64);

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
    mesh.position.set(0, 0.25, 0);
    mesh.rotation.y = Math.PI / 4;
    scene.add(mesh);
  }
}

// =======================
// Scene Initialization
// =======================

createBasketballCourt();
createBasketballHoop(-15);
createBasketballHoop(15);
createBasketball();

// --- Camera Setup ---
camera.position.set(0, 15, 30);

// --- Orbit Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;

// --- Instructions Overlay ---
const instructionsElement = document.createElement('div');
instructionsElement.style.position = 'absolute';
instructionsElement.style.bottom = '20px';
instructionsElement.style.left = '20px';
instructionsElement.style.color = 'white';
instructionsElement.style.fontSize = '16px';
instructionsElement.style.fontFamily = 'Arial, sans-serif';
instructionsElement.style.textAlign = 'left';
instructionsElement.innerHTML = `
  <h3>Controls:</h3>
  <p>O - Toggle orbit camera</p>
`;
document.body.appendChild(instructionsElement);

// --- Keyboard Controls ---
document.addEventListener('keydown', e => {
  if (e.key === "o") isOrbitEnabled = !isOrbitEnabled;
});

// --- Animation Loop ---
function animate() {
  requestAnimationFrame(animate);
  controls.enabled = isOrbitEnabled;
  controls.update();
  renderer.render(scene, camera);
}
animate();