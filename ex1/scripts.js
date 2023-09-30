const canvas = document.getElementById("carCanvas");
const ctx = canvas.getContext("2d");
let current3DModel = "primitive";
let canvasContainer = document.getElementById("canvasContainer");
const loadingElement = document.getElementById("loadingStatus");
loadingElement.style.display = "block";
let is3DMode = false;
let currentMode = "2D";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function draw2DCar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 - 25, 200, 50);

  ctx.fillRect(canvas.width / 2 - 80, canvas.height / 2 - 55, 120, 30);

  ctx.fillStyle = "gray";

  ctx.fillRect(canvas.width / 2 - 65, canvas.height / 2 - 50, 30, 25);

  ctx.fillRect(canvas.width / 2 - 25, canvas.height / 2 - 50, 50, 25);

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(canvas.width / 2 - 70, canvas.height / 2 + 25, 15, 0, Math.PI * 2);
  ctx.arc(canvas.width / 2 + 70, canvas.height / 2 + 25, 15, 0, Math.PI * 2);
  ctx.fill();
}

const scene = new THREE.Scene();
const car = createCar();
scene.add(car);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(200, 500, 300);
dirLight.castShadow = true;
scene.add(dirLight);

const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 300;
const cameraHeight = cameraWidth / aspectRatio;
const camera = new THREE.OrthographicCamera(
  -cameraWidth / 2,
  cameraWidth / 2,
  cameraHeight / 2,
  -cameraHeight / 2,
  0.1,
  1000
);
camera.position.set(0, 150, 200);
camera.lookAt(0, 10, 0);

function updateCameraDimensions() {
  const aspectRatio = 700 / 700;
  const cameraWidth = 300;
  const cameraHeight = cameraWidth / aspectRatio;
  camera.left = -cameraWidth / 2;
  camera.right = cameraWidth / 2;
  camera.top = cameraHeight / 2;
  camera.bottom = -cameraHeight / 2;
  camera.updateProjectionMatrix();
}

updateCameraDimensions();

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setAnimationLoop(() => {
  if (is3DMode) {
    if (currentMode === "3DPrimitive") {
      car.rotation.y -= 0.007;
    } else if (currentMode === "3DGlb" && bmwCar) {
      bmwCar.rotation.y -= 0.007;
    }
    renderer.render(scene, camera);
  }
});

function createCar() {
  const car = new THREE.Group();
  const backWheel = createWheels();
  backWheel.position.y = 6;
  backWheel.position.x = -18;
  car.add(backWheel);
  const frontWheel = createWheels();
  frontWheel.position.y = 6;
  frontWheel.position.x = 18;
  car.add(frontWheel);
  const main = new THREE.Mesh(
    new THREE.BoxBufferGeometry(60, 15, 30),
    new THREE.MeshLambertMaterial({ color: 0xa52523 })
  );
  main.position.y = 12;
  car.add(main);
  const carFrontTexture = getCarFrontTexture();
  const carBackTexture = getCarFrontTexture();
  const carRightSideTexture = getCarSideTexture();
  const carLeftSideTexture = getCarSideTexture();
  carLeftSideTexture.center = new THREE.Vector2(0.5, 0.5);
  carLeftSideTexture.rotation = Math.PI;
  carLeftSideTexture.flipY = false;
  const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(33, 12, 24), [
    new THREE.MeshLambertMaterial({ map: carFrontTexture }),
    new THREE.MeshLambertMaterial({ map: carBackTexture }),
    new THREE.MeshLambertMaterial({ color: 0xa52523 }),
    new THREE.MeshLambertMaterial({ color: 0xa52523 }),
    new THREE.MeshLambertMaterial({ map: carRightSideTexture }),
    new THREE.MeshLambertMaterial({ map: carLeftSideTexture }),
  ]);
  cabin.position.x = -6;
  cabin.position.y = 25.5;
  car.add(cabin);
  car.position.y = -10;
  car.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return car;
}

function createWheels() {
  const geometry = new THREE.BoxBufferGeometry(12, 12, 33);
  const material = new THREE.MeshLambertMaterial({ color: 0x333333 });
  const wheel = new THREE.Mesh(geometry, material);
  return wheel;
}

function getCarFrontTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 32;
  const context = canvas.getContext("2d");
  context.fillStyle = "#a52523";
  context.fillRect(0, 0, 64, 32);
  context.fillStyle = "#666666";
  context.fillRect(8, 8, 48, 24);
  return new THREE.CanvasTexture(canvas);
}

function getCarSideTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 32;
  const context = canvas.getContext("2d");
  context.fillStyle = "#a52523";
  context.fillRect(0, 0, 128, 32);
  context.fillStyle = "#666666";
  context.fillRect(10, 8, 38, 24);
  context.fillRect(58, 8, 60, 24);
  return new THREE.CanvasTexture(canvas);
}

const loader = new THREE.GLTFLoader();
let bmwCar;

loader.load("free_bmw_m3_e30.glb", function (gltf) {
  bmwCar = gltf.scene;

  bmwCar.scale.set(0.5, 0.5, 0.5);
  bmwCar.position.y = -10;
  loadingElement.style.display = "none";
  bmwCar.position.y = 0;
  bmwCar.scale.set(30, 30, 30);
  bmwCar.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
});

const spotlight = new THREE.SpotLight(0xffffff, 1);
spotlight.position.set(0, 150, 100);
spotlight.castShadow = true;
spotlight.angle = Math.PI / 6;
spotlight.distance = 400;
spotlight.penumbra = 0.1;
spotlight.shadow.mapSize.width = 1024;
spotlight.shadow.mapSize.height = 1024;
spotlight.lookAt(0, 10, 0);
scene.add(spotlight);

function adjustSpotlightIntensity(mode) {
  switch (mode) {
    case "3DGlb":
      spotlight.intensity = 30;
      break;
    default:
      spotlight.intensity = 1;
      break;
  }
}

document.getElementById("upgradeBtn").addEventListener("click", function () {
  switch (currentMode) {
    case "2D":
      currentMode = "3DPrimitive";
      scene.add(car);
      document
        .getElementById("canvasContainer")
        .appendChild(renderer.domElement);
      canvas.style.display = "none";
      renderer.setSize(700, 700);
      this.textContent = "Upgrade";
      is3DMode = true;
      break;
    case "3DPrimitive":
      if (bmwCar) {
        currentMode = "3DGlb";
        scene.remove(car);
        scene.add(bmwCar);
        this.textContent = "Reverse";
        is3DMode = true;
      } else {
        alert("Please wait for the car model to finish loading.");
      }
      break;
    case "3DGlb":
      currentMode = "2D";
      if (bmwCar) {
        scene.remove(bmwCar);
      }
      let canvasContainer = document.getElementById("canvasContainer");
      if (canvasContainer.contains(renderer.domElement)) {
        canvasContainer.removeChild(renderer.domElement);
      }
      canvas.width = 700;
      canvas.height = 700;
      draw2DCar();
      canvas.style.display = "block";
      this.textContent = "Upgrade";
      is3DMode = false;
      break;
  }

  adjustSpotlightIntensity(currentMode);
});

draw2DCar();
