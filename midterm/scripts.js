import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Scene
const scene = new THREE.Scene();

// Create GLTF loader
const gltfLoader = new GLTFLoader();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 10;
camera.position.y = 5;
// camera.lookAt(0, 3, 0); // Adjust as needed to center the tree in the viewport

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6); // Brighter light
directionalLight.position.set(0, 1, 0.5);
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Optional, but this gives a smoother control feeling
controls.dampingFactor = 0.1;
controls.enableZoom = true;
// Restrict vertical orbit angle
controls.minPolarAngle = 0; // 0 radians (0 degrees) - prevent moving below the horizon
controls.maxPolarAngle = Math.PI / 2 - 0.1; // Slightly less than 90 degrees - prevent moving too far upwards

// Texture loader
const textureLoader = new THREE.TextureLoader();

// Load snow textures
const snowDiffuseTexture = textureLoader.load("./textures/snow_diff.jpg");
const snowDispTexture = textureLoader.load("./textures/snow_disp.png");
const snowRoughTexture = textureLoader.load("./textures/snow_rough.jpg");
const snowTranslucentTexture = textureLoader.load(
  "./textures/snow_translucent.png"
);
const snowNormalTexture = textureLoader.load("./textures/snow_nor.jpg");

// Create ground plane
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({
  map: snowDiffuseTexture,
  displacementMap: snowDispTexture,
  roughnessMap: snowRoughTexture,
  alphaMap: snowTranslucentTexture,
  normalMap: snowNormalTexture,
  transparent: true,
  displacementScale: 0.1,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate the ground to be horizontal
ground.position.y = -0.75; // Adjust ground position
scene.add(ground);

// Load skybox textures
const skyboxTextureRt = textureLoader.load("./snow/posx.jpg"); // Right
const skyboxTextureLf = textureLoader.load("./snow/negx.jpg"); // Left
const skyboxTextureUp = textureLoader.load("./snow/posy.jpg"); // Up
const skyboxTextureDn = textureLoader.load("./snow/negy.jpg"); // Down
const skyboxTextureFt = textureLoader.load("./snow/posz.jpg"); // Front
const skyboxTextureBk = textureLoader.load("./snow/negz.jpg"); // Back

const skyboxMaterials = [
  new THREE.MeshBasicMaterial({ map: skyboxTextureRt, side: THREE.BackSide }),
  new THREE.MeshBasicMaterial({ map: skyboxTextureLf, side: THREE.BackSide }),
  new THREE.MeshBasicMaterial({ map: skyboxTextureUp, side: THREE.BackSide }),
  new THREE.MeshBasicMaterial({ map: skyboxTextureDn, side: THREE.BackSide }),
  new THREE.MeshBasicMaterial({ map: skyboxTextureFt, side: THREE.BackSide }),
  new THREE.MeshBasicMaterial({ map: skyboxTextureBk, side: THREE.BackSide }),
];

// [Box Geometry, Ambient and Directional Light code remains the same]

const skyboxMesh = new THREE.Mesh(
  new THREE.BoxGeometry(100, 100, 100),
  skyboxMaterials
);
skyboxMesh.name = "skybox"; // Naming the skybox mesh
skyboxMesh.position.y = 10;
scene.add(skyboxMesh);

const woodDiffuseTexture = textureLoader.load("./wood/diffuse.jpg");
const woodBumpTexture = textureLoader.load("./wood/bump.jpg");
const woodNormalTexture = textureLoader.load("./wood/normal.jpg");

// Trunk material with textures
const trunkMaterial = new THREE.MeshStandardMaterial({
  map: woodDiffuseTexture,
  bumpMap: woodBumpTexture,
  normalMap: woodNormalTexture,
});

// Create tree trunk
const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.5, 3.5, 32);
const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
trunk.position.y = 1; // Positioning the trunk above the ground
scene.add(trunk);

// Function to create a tree leaf layer
function createTreeLeafLayer(height, radius, positionY) {
  const geometry = new THREE.ConeGeometry(radius, height, 32);
  const material = new THREE.MeshLambertMaterial({ color: 0x2b4529 }); // Green color
  const cone = new THREE.Mesh(geometry, material);
  cone.position.y = positionY;
  return cone;
}

const treeGroup = new THREE.Group(); // Group to hold all tree parts
const layerHeights = [1.7, 1.5, 1, 0.7]; // Heights of each layer
const layerRadii = [2.5, 2, 1.5, 1]; // Radii of each layer
let posY = 1; // Adjust starting position for the first layer

layerHeights.forEach((height, index) => {
  const layer = createTreeLeafLayer(
    height,
    layerRadii[index],
    posY + height / 2
  );
  posY += height - 0.25;
  treeGroup.add(layer);
});

treeGroup.add(trunk); // Add the trunk to the group
treeGroup.scale.set(1, 1, 1); // Scale down the entire tree
scene.add(treeGroup);

let starLight;
let breatheDirection = 1;

function loadStar() {
  gltfLoader.load("./star/scene.gltf", (gltf) => {
    const starModel = gltf.scene;

    // Traverse the model and adjust materials
    starModel.traverse((child) => {
      if (child.isMesh) {
        child.material.emissive = new THREE.Color(0xffffaa); // Bright yellow
      }
    });

    // Adjust the scale and position of the star model
    starModel.scale.set(0.008, 0.008, 0.008);
    starModel.position.set(0, posY + 0.3, 0);

    // Optionally, create a point light inside the star if the model doesn't have one
    starLight = new THREE.PointLight(0xffff00, 1.5, 10); // Increased intensity
    starModel.add(starLight);

    scene.add(starModel);
  });
}

loadStar();

// Breathing light animation
function animateStarLight() {
  const minIntensity = 0.1;
  const maxIntensity = 2;
  const breatheSpeed = 0.01;

  if (starLight) {
    starLight.intensity += breatheSpeed * breatheDirection;
    if (
      starLight.intensity > maxIntensity ||
      starLight.intensity < minIntensity
    ) {
      breatheDirection *= -1;
    }
  }
}

let rudolphLights = []; // Array to hold lights for animation
let colorChangeTimer = 0;

function loadRudolphBall() {
  gltfLoader.load("./rudolph-ball/scene.gltf", (gltf) => {
    const rudolphBall = gltf.scene;

    // Adjust the scale of the Rudolph ball model
    rudolphBall.scale.set(0.004, 0.004, 0.004);

    const numBalls = 12;
    const bottomCone = treeGroup.children[0];
    const radius = bottomCone.geometry.parameters.radius - 0.2;
    const yPos =
      bottomCone.position.y - bottomCone.geometry.parameters.height / 2;

    for (let i = 0; i < numBalls; i++) {
      const angle = (i / numBalls) * Math.PI * 2;
      const ballClone = rudolphBall.clone();

      // Position the ball
      ballClone.position.set(
        radius * Math.cos(angle),
        yPos - 0.15,
        radius * Math.sin(angle)
      );

      // Add a point light to the ball
      const ballLight = new THREE.PointLight(0xff0000, 1, 2);
      ballClone.add(ballLight);
      rudolphLights.push(ballLight); // Store the light for animation

      scene.add(ballClone);
    }
  });
}

loadRudolphBall();

function animateRudolphLights() {
  const breatheSpeed = 0.01; // Slower breathing
  const maxIntensity = 1.2; // Reduced maximum intensity
  const minIntensity = 0.2; // Reduced minimum intensity
  const colorChangeSpeed = 0.001; // Slower color change

  rudolphLights.forEach((light) => {
    // Initialize breatheDirection if it's undefined
    if (light.userData.breatheDirection === undefined) {
      light.userData.breatheDirection = 1;
    }

    // Breathing light intensity
    if (light.intensity > maxIntensity || light.intensity < minIntensity) {
      light.userData.breatheDirection *= -1;
    }
    light.intensity += breatheSpeed * light.userData.breatheDirection;

    // Color change over time
    colorChangeTimer += colorChangeSpeed;
    light.color.setHSL(colorChangeTimer % 1, 1, 0.5);
  });
}

class Snowflake {
  constructor(model) {
    this.mesh = model.clone(); // Clone the provided snowflake model
    this.mesh.scale.set(0.001, 0.001, 0.001); // Scale down the snowflake
    this.reset();
    scene.add(this.mesh); // Add the snowflake mesh to the scene
  }

  reset() {
    // Position the snowflake at a random location above the viewport
    this.mesh.position.x = (Math.random() - 0.5) * 20;
    this.mesh.position.y = 10 + Math.random() * 5;
    this.mesh.position.z = (Math.random() - 0.5) * 20;
    this.speed = 0.02 + Math.random() * 0.03; // Random falling speed
  }

  update() {
    // Move the snowflake down
    this.mesh.position.y -= this.speed;

    // Check if the snowflake has hit the ground
    if (this.mesh.position.y <= ground.position.y) {
      // Reset the snowflake to a new position above the viewport
      this.reset();
    }
  }
}

let snowflakes = [];

function loadSnowflake() {
  gltfLoader.load("./snowflake/scene.gltf", (gltf) => {
    const snowflakeModel = gltf.scene;

    // Create multiple snowflakes
    for (let i = 0; i < 200; i++) {
      const snowflake = new Snowflake(snowflakeModel);
      snowflakes.push(snowflake);
    }
  });
}

loadSnowflake();

function createSnowman() {
  const snowmanGroup = new THREE.Group();

  // Snowman body (larger sphere)
  const bodyGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.set(0, 0.5, 0); // Position the body above the ground
  snowmanGroup.add(body);

  // Snowman head (smaller sphere)
  const headGeometry = new THREE.SphereGeometry(0.3, 32, 32);
  const headMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.set(0, 1.1, 0); // Position the head on top of the body
  snowmanGroup.add(head);

  // Eyes (small black spheres)
  const eyeGeometry = new THREE.SphereGeometry(0.05, 32, 32);
  const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  rightEye.position.set(0.15, 1.2, 0.25);
  snowmanGroup.add(rightEye);

  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(-0.15, 1.2, 0.25);
  snowmanGroup.add(leftEye);

  // Nose (orange cone)
  const noseGeometry = new THREE.ConeGeometry(0.1, 0.5, 32);
  const noseMaterial = new THREE.MeshPhongMaterial({ color: 0xffa500 });
  const nose = new THREE.Mesh(noseGeometry, noseMaterial);
  nose.position.set(0, 1.1, 0.3);
  nose.rotation.x = Math.PI / 2; // Rotate the cone to point outwards
  snowmanGroup.add(nose);

  // Hat (red cone)
  const hatGeometry = new THREE.ConeGeometry(0.3, 0.5, 32);
  const hatMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 }); // Red color
  const hat = new THREE.Mesh(hatGeometry, hatMaterial);
  hat.position.set(0, 1.6, 0); // Position the hat on top of the head
  snowmanGroup.add(hat);

  // Position the entire snowman group under the tree
  snowmanGroup.position.set(3, -0.7, 0); // Adjust position as needed

  return snowmanGroup;
}

const snowman = createSnowman();
scene.add(snowman);

function createLightBalls() {
  const ballsPerLayer = [60, 50, 30, 0]; // Number of light balls per layer

  treeGroup.children.forEach((layer, index) => {
    const layerRadius = layer.geometry.parameters.radius;
    const layerHeight = layer.geometry.parameters.height;

    for (let i = 0; i < ballsPerLayer[index]; i++) {
      // Random color for each ball
      const color = new THREE.Color(
        Math.random(),
        Math.random(),
        Math.random()
      );
      const ballMaterial = new THREE.MeshStandardMaterial({ emissive: color });
      const ballGeometry = new THREE.SphereGeometry(0.1, 16, 16); // Small ball size
      const ball = new THREE.Mesh(ballGeometry, ballMaterial);

      // Calculate position on the cone
      const theta = Math.random() * Math.PI * 2; // Angle around the cone
      const y = Math.random() * layerHeight; // Vertical position along the cone's height

      // Calculate the radius at the height y
      const radiusAtY = layerRadius * ((layerHeight - y) / layerHeight);

      // Position the ball on the surface of the cone
      ball.position.x = radiusAtY * Math.cos(theta);
      ball.position.y = y - layerHeight / 2; // Adjust for the cone's bottom position
      ball.position.z = radiusAtY * Math.sin(theta);

      layer.add(ball); // Add the ball to the cone layer
    }
  });
}

createLightBalls();

// Load Christmas Ball Model
function loadChristmasBall() {
  gltfLoader.load("./christmas-ball/scene.gltf", (gltf) => {
    const christmasBallModel = gltf.scene;

    christmasBallModel.scale.set(0.05, 0.05, 0.05);
    const numBallsList = [10, 8, 6];
    // Add Christmas balls to the second, third, and fourth layers of the tree
    for (let i = 1; i <= 3; i++) {
      const layer = treeGroup.children[i];
      const layerRadius = layer.geometry.parameters.radius - 0.2;
      const numBalls = numBallsList[i - 1];
      const yPos = layer.position.y - layer.geometry.parameters.height / 2;

      for (let j = 0; j < numBalls; j++) {
        const angle = (j / numBalls) * Math.PI * 2;
        const ballClone = christmasBallModel.clone();

        // Position the Christmas ball
        ballClone.position.set(
          layerRadius * Math.cos(angle) - 0.4,
          yPos - 0.1,
          layerRadius * Math.sin(angle)
        );

        const ballLight = new THREE.PointLight(0xff0000, 1, 2);
        ballClone.add(ballLight);

        scene.add(ballClone);
      }
    }
  });
}

// Define the positions of the Christmas gifts near each child
const giftPositions = [
  { x: -2, y: -0.7, z: -1 }, // Adjust the positions as needed
  // Add positions for other children's gifts here
];

// Load Christmas gifts and add lights for each child
function loadChristmasGifts() {
  // Iterate over each child's gift position
  giftPositions.forEach((position) => {
    gltfLoader.load("./christmas-gift/scene.gltf", (gltf) => {
      const christmasGiftModel = gltf.scene;

      // Scale and position the Christmas gift model
      christmasGiftModel.scale.set(0.3, 0.3, 0.3); // Adjust scale as needed
      christmasGiftModel.position.set(position.x, position.y, position.z);

      // Add a point light near each child's gift with increased intensity
      const giftLight = new THREE.PointLight(0xffffff, 3.0, 0.5); // Adjust intensity and distance as needed
      giftLight.position.copy(christmasGiftModel.position);
      scene.add(giftLight);

      scene.add(christmasGiftModel);
    });
  });
}

// Call the function to load Christmas gifts and add lights for each child
loadChristmasGifts();

// Call the functions to load Christmas ball and Christmas gift
loadChristmasBall();

// [Rest of the animate function]
function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.update();

  // Rotate skybox
  skyboxMesh.rotation.y += 0.0005;

  // Animate the star light
  animateStarLight();

  // Animate Rudolph lights
  animateRudolphLights();

  // Update each snowflake
  snowflakes.forEach((snowflake) => snowflake.update());

  renderer.render(scene, camera);
}

// Start animation loop
animate();
