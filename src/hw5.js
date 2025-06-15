import {OrbitControls} from './OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);
// Set background color
scene.background = new THREE.Color(0x000000);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

// Enable shadows
renderer.shadowMap.enabled = true;
directionalLight.castShadow = true;

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}

// Create basketball court
function createBasketballCourt() {
  // Court floor - just a simple brown surface
  const courtGeometry = new THREE.BoxGeometry(30, 0.2, 15);
  const courtMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xc68642,  // Brown wood color
    shininess: 50
  });
  const court = new THREE.Mesh(courtGeometry, courtMaterial);
  court.receiveShadow = true;
  scene.add(court);

  // White line material for all court markings
  const courtLinesMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  
  // Center line running down the middle of the court
  const centerLineGeometry = new THREE.BoxGeometry(0.2, 0, 15);
  const centerLineMesh = new THREE.Mesh(centerLineGeometry, courtLinesMaterial);
  centerLineMesh.position.y = 0.11;
  scene.add(centerLineMesh);
  
  // Center circle at court center (WHITE OUTLINE)
  const centerCircleGeometry = new THREE.RingGeometry(2, 2.2, 32);
  const centerCircleMesh = new THREE.Mesh(centerCircleGeometry, courtLinesMaterial);
  centerCircleMesh.rotation.x = degrees_to_radians(-90);
  centerCircleMesh.position.y = 0.11;
  scene.add(centerCircleMesh);
  
  // Center circle interior (ORANGE FILL)
  const centerCircleInteriorGeometry = new THREE.CircleGeometry(2, 32);
  const orangeMaterial = new THREE.MeshBasicMaterial({ color: 0xff6600 }); // Orange
  const centerCircleInterior = new THREE.Mesh(centerCircleInteriorGeometry, orangeMaterial);
  centerCircleInterior.rotation.x = degrees_to_radians(-90);
  centerCircleInterior.position.y = 0.105; // Slightly below the white outline
  scene.add(centerCircleInterior);
  
  // Left side three-point line
  const leftThreePointGeometry = new THREE.RingGeometry(6.7, 6.9, 16, 1, 0, Math.PI);
  const leftThreePointMesh = new THREE.Mesh(leftThreePointGeometry, courtLinesMaterial);
  leftThreePointMesh.rotation.x = degrees_to_radians(-90);
  leftThreePointMesh.rotation.z = degrees_to_radians(-90);
  leftThreePointMesh.position.set(-15, 0.11, 0);
  scene.add(leftThreePointMesh);
  
  // Right side three-point line
  const rightThreePointGeometry = new THREE.RingGeometry(6.7, 6.9, 16, 1, 0, Math.PI);
  const rightThreePointMesh = new THREE.Mesh(rightThreePointGeometry, courtLinesMaterial);
  rightThreePointMesh.rotation.x = degrees_to_radians(-90);
  rightThreePointMesh.rotation.z = degrees_to_radians(90);
  rightThreePointMesh.position.set(15, 0.11, 0);
  scene.add(rightThreePointMesh);

  // ADDED: Create key areas (painted areas under baskets)
  createKeyAreas(courtLinesMaterial);
}

// Create key areas (rectangles and free throw circles)
function createKeyAreas(lineMaterial) {
  // Key area material (ORANGE COLOR for painted areas)
  const keyMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xff6600,  // Orange color for key area
    shininess: 50
  });

  // Left key area (rectangle)
  const leftKeyGeometry = new THREE.BoxGeometry(4, 0.01, 6);
  const leftKeyMesh = new THREE.Mesh(leftKeyGeometry, keyMaterial);
  leftKeyMesh.position.set(-13, 0.105, 0);
  scene.add(leftKeyMesh);

  // Right key area (rectangle)
  const rightKeyGeometry = new THREE.BoxGeometry(4, 0.01, 6);
  const rightKeyMesh = new THREE.Mesh(rightKeyGeometry, keyMaterial);
  rightKeyMesh.position.set(13, 0.105, 0);
  scene.add(rightKeyMesh);

  // Key area outlines (white lines)
  // Left key outline
  createKeyOutline(-13, lineMaterial);
  
  // Right key outline
  createKeyOutline(13, lineMaterial);

  // Free throw circles
  const freeThrowCircleGeometry = new THREE.RingGeometry(1.8, 2.0, 32);
  
  // Left free throw circle
  const leftFTCircle = new THREE.Mesh(freeThrowCircleGeometry, lineMaterial);
  leftFTCircle.rotation.x = degrees_to_radians(-90);
  leftFTCircle.position.set(-11, 0.115, 0);
  scene.add(leftFTCircle);
  
  // Right free throw circle
  const rightFTCircle = new THREE.Mesh(freeThrowCircleGeometry, lineMaterial);
  rightFTCircle.rotation.x = degrees_to_radians(-90);
  rightFTCircle.position.set(11, 0.115, 0);
  scene.add(rightFTCircle);

  // Free throw lines
  const ftLineGeometry = new THREE.BoxGeometry(0.15, 0.05, 6);
  
  const leftFTLine = new THREE.Mesh(ftLineGeometry, lineMaterial);
  leftFTLine.position.set(-11, 0.115, 0);
  scene.add(leftFTLine);
  
  const rightFTLine = new THREE.Mesh(ftLineGeometry, lineMaterial);
  rightFTLine.position.set(11, 0.115, 0);
  scene.add(rightFTLine);
}

// Create key area outline
function createKeyOutline(centerX, lineMaterial) {
  const lineWidth = 0.15;
  const lineHeight = 0.05;
  
  // Top line of key
  const topLineGeometry = new THREE.BoxGeometry(4, lineHeight, lineWidth);
  const topLine = new THREE.Mesh(topLineGeometry, lineMaterial);
  topLine.position.set(centerX, 0.115, 3);
  scene.add(topLine);
  
  // Bottom line of key
  const bottomLineGeometry = new THREE.BoxGeometry(4, lineHeight, lineWidth);
  const bottomLine = new THREE.Mesh(bottomLineGeometry, lineMaterial);
  bottomLine.position.set(centerX, 0.115, -3);
  scene.add(bottomLine);
  
  // Left side line of key
  const leftSideGeometry = new THREE.BoxGeometry(lineWidth, lineHeight, 6);
  const leftSide = new THREE.Mesh(leftSideGeometry, lineMaterial);
  if (centerX < 0) {
    leftSide.position.set(centerX - 2, 0.115, 0);
  } else {
    leftSide.position.set(centerX + 2, 0.115, 0);
  }
  scene.add(leftSide);
}

function createBasketballHoop(hoopPositionX) {
  // Group all hoop components together
  const basketballHoopGroup = new THREE.Group();
  
  // Support pole behind the backboard
  const supportPoleGeometry = new THREE.CylinderGeometry(0.15, 0.15, 6);
  const supportPoleMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
  const supportPoleMesh = new THREE.Mesh(supportPoleGeometry, supportPoleMaterial);
  supportPoleMesh.position.set(hoopPositionX, 3, 0);
  supportPoleMesh.castShadow = true;
  basketballHoopGroup.add(supportPoleMesh);

  // Support arm connecting pole to backboard
  const supportArmGeometry = new THREE.BoxGeometry(0.2, 0.15, 1);
  const supportArmMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
  const supportArmMesh = new THREE.Mesh(supportArmGeometry, supportArmMaterial);
  
  // Position and rotate arm based on which side of court
  if (hoopPositionX < 0) {
    // Left hoop - arm points toward positive X (center)
    supportArmMesh.position.set(hoopPositionX + 0.5, 5, 0);
    supportArmMesh.rotation.y = degrees_to_radians(90);
  } else {
    // Right hoop - arm points toward negative X (center)
    supportArmMesh.position.set(hoopPositionX - 0.5, 5, 0);
    supportArmMesh.rotation.y = degrees_to_radians(-90);
  }
  
  supportArmMesh.castShadow = true;
  basketballHoopGroup.add(supportArmMesh);

  // Backboard (white and partially transparent)
  const backboardGeometry = new THREE.BoxGeometry(2.8, 1.6, 0.1);
  const backboardMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffffff, 
    transparent: true, 
    opacity: 0.8 
  });
  const backboardMesh = new THREE.Mesh(backboardGeometry, backboardMaterial);

  // Position and rotate backboard based on which side of court
  if (hoopPositionX < 0) {
    // Left backboard faces toward positive X (center)
    backboardMesh.position.set(hoopPositionX + 1, 5, 0);
    backboardMesh.rotation.y = degrees_to_radians(90);
  } else {
    // Right backboard faces toward negative X (center)
    backboardMesh.position.set(hoopPositionX - 1, 5, 0);
    backboardMesh.rotation.y = degrees_to_radians(-90);
  }

  backboardMesh.castShadow = true;
  backboardMesh.receiveShadow = true;
  basketballHoopGroup.add(backboardMesh);
  
  scene.add(basketballHoopGroup);

  // Basketball rim (orange color at regulation height)
  const basketballRimGeometry = new THREE.TorusGeometry(0.23, 0.02, 8, 16);
  const basketballRimMaterial = new THREE.MeshPhongMaterial({ color: 0xff6600 });
  const basketballRimMesh = new THREE.Mesh(basketballRimGeometry, basketballRimMaterial);

  basketballRimMesh.rotation.x = degrees_to_radians(-90);

  if (hoopPositionX < 0) {
    basketballRimMesh.position.set(hoopPositionX + 1.3, 4.5, 0);
  } else {
    basketballRimMesh.position.set(hoopPositionX - 1.3, 4.5, 0);
  }

  basketballRimMesh.castShadow = true;
  basketballHoopGroup.add(basketballRimMesh);

  // Basketball net using line segments
  const basketballNetGroup = new THREE.Group();
  const numberOfNetSegments = 8;
  const netLineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

  for (let segmentIndex = 0; segmentIndex < numberOfNetSegments; segmentIndex++) {
    const segmentAngle = (segmentIndex / numberOfNetSegments) * Math.PI * 2;
    const rimTopX = Math.cos(segmentAngle) * 0.23;
    const rimTopZ = Math.sin(segmentAngle) * 0.23;
    const netBottomX = Math.cos(segmentAngle) * 0.15;
    const netBottomZ = Math.sin(segmentAngle) * 0.15;
    
    const netSegmentPoints = [
      new THREE.Vector3(rimTopX, 0, rimTopZ),
      new THREE.Vector3(netBottomX, -0.4, netBottomZ)
    ];
    
    const netSegmentGeometry = new THREE.BufferGeometry().setFromPoints(netSegmentPoints);
    const netSegmentLine = new THREE.Line(netSegmentGeometry, netLineMaterial);
    basketballNetGroup.add(netSegmentLine);
  }

  if (hoopPositionX < 0) {
    basketballNetGroup.position.set(hoopPositionX + 1.3, 4.5, 0);
  } else {
    basketballNetGroup.position.set(hoopPositionX - 1.3, 4.5, 0);
  }

  basketballHoopGroup.add(basketballNetGroup);
}

// Create basketball with your custom texture
function createBasketball() {
  // Create texture loader
  const textureLoader = new THREE.TextureLoader();
  
  // Basketball geometry
  const basketballGeometry = new THREE.SphereGeometry(0.12, 64, 64);
  
  // Load your basketball texture
  const basketballTexture = textureLoader.load(
    './src/basketball.png',
    
    function(texture) {
      console.log('Basketball texture loaded successfully');
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    },
    
    function(progress) {
      console.log('Loading basketball texture: ' + Math.round(progress.loaded / progress.total * 100) + '%');
    },
    
    function(error) {
      console.error('Failed to load basketball texture:', error);
      console.log('Using fallback orange material');
      
      basketballMesh.material = new THREE.MeshPhongMaterial({ 
        color: 0xff6600,
        shininess: 30
      });
    }
  );
  
  const basketballMaterial = new THREE.MeshPhongMaterial({ 
    map: basketballTexture,
    shininess: 20,
    bumpScale: 0.1
  });
  
  const basketballMesh = new THREE.Mesh(basketballGeometry, basketballMaterial);
  basketballMesh.castShadow = true;
  basketballMesh.receiveShadow = true;
  
  basketballMesh.position.set(0, 0.25, 0);
  basketballMesh.rotation.y = Math.PI / 4;
  
  scene.add(basketballMesh);
}

// Create all elements
createBasketballCourt();
createBasketballHoop(-15);
createBasketballHoop(15);
createBasketball();

// Set camera position for better view
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0, 15, 30);
camera.applyMatrix4(cameraTranslate);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;

// Instructions display
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

// Handle key events
function handleKeyDown(e) {
  if (e.key === "o") {
    isOrbitEnabled = !isOrbitEnabled;
  }
}

document.addEventListener('keydown', handleKeyDown);

// Animation function
function animate() {
  requestAnimationFrame(animate);
  
  // Update controls
  controls.enabled = isOrbitEnabled;
  controls.update();
  
  renderer.render(scene, camera);
}

animate();