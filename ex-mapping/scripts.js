// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Texture loader
const textureLoader = new THREE.TextureLoader();

// Load crate textures
const crateNormalMap = textureLoader.load("./crate/crate0_normal.png");
const crateBumpMap = textureLoader.load("./crate/crate0_bump.png");
const crateDiffuseMap = textureLoader.load("./crate/crate0_diffuse.png");

// Load grass textures
const grassDiffuseMap = textureLoader.load(
  "./grass/Green-Grass-Ground-Texture-DIFFUSE.jpg"
);
const grassDisplacementMap = textureLoader.load(
  "./grass/Green-Grass-Ground-Texture-DISP.jpg"
);
const grassSpecularMap = textureLoader.load(
  "./grass/Green-Grass-Ground-Texture-SPECULAR.jpg"
);
const grassNormalMap = textureLoader.load(
  "./grass/Green-Grass-Ground-Texture-NORMAL.jpg"
);

// Load skybox textures
const skyboxTextureFt = textureLoader.load("./skybox/arid2_ft.jpg");
const skyboxTextureBk = textureLoader.load("./skybox/arid2_bk.jpg");
const skyboxTextureUp = textureLoader.load("./skybox/arid2_up.jpg");
const skyboxTextureDn = textureLoader.load("./skybox/arid2_dn.jpg");
const skyboxTextureRt = textureLoader.load("./skybox/arid2_rt.jpg");
const skyboxTextureLf = textureLoader.load("./skybox/arid2_lf.jpg");

// Create materials
const normalMaterial = new THREE.MeshStandardMaterial({ map: crateNormalMap });
const bumpMaterial = new THREE.MeshStandardMaterial({ bumpMap: crateBumpMap });
const diffuseMaterial = new THREE.MeshStandardMaterial({
  map: crateDiffuseMap,
});
const mixedMaterial = new THREE.MeshStandardMaterial({
  map: crateDiffuseMap,
  bumpMap: crateBumpMap,
  normalMap: crateNormalMap,
});

// Create grass materials using MeshPhongMaterial
const grassDiffuseMaterial = new THREE.MeshPhongMaterial({
  map: grassDiffuseMap,
});

const grassDisplacementMaterial = new THREE.MeshPhongMaterial({
  displacementMap: grassDisplacementMap,
  displacementScale: 0.1,
});

// MeshPhongMaterial does not use roughness or metalness properties.
const grassSpecularMaterial = new THREE.MeshPhongMaterial({
  specularMap: grassSpecularMap,
  shininess: 20, // Adjust the shininess if needed,
  specular: 0xffffff,
});

const grassNormalMaterial = new THREE.MeshPhongMaterial({
  normalMap: grassNormalMap,
});

// Create skybox materials
const skyboxMaterials = [
  new THREE.MeshBasicMaterial({ map: skyboxTextureFt, side: THREE.BackSide }),
  new THREE.MeshBasicMaterial({ map: skyboxTextureBk, side: THREE.BackSide }),
  new THREE.MeshBasicMaterial({ map: skyboxTextureUp, side: THREE.BackSide }),
  new THREE.MeshBasicMaterial({ map: skyboxTextureDn, side: THREE.BackSide }),
  new THREE.MeshBasicMaterial({ map: skyboxTextureRt, side: THREE.BackSide }),
  new THREE.MeshBasicMaterial({ map: skyboxTextureLf, side: THREE.BackSide }),
];

// Create geometries
const boxGeometry = new THREE.BoxGeometry();
// const planeGeometry = new THREE.PlaneGeometry(5, 5);

// Create meshes
const normalMesh = new THREE.Mesh(boxGeometry, normalMaterial);
const bumpMesh = new THREE.Mesh(boxGeometry, bumpMaterial);
const diffuseMesh = new THREE.Mesh(boxGeometry, diffuseMaterial);
const mixedMesh = new THREE.Mesh(boxGeometry, mixedMaterial);

const grassDiffuseBox = new THREE.Mesh(boxGeometry, grassDiffuseMaterial);
const grassDisplacementBox = new THREE.Mesh(
  boxGeometry,
  grassDisplacementMaterial
);
const grassSpecularBox = new THREE.Mesh(boxGeometry, grassSpecularMaterial);
const grassNormalBox = new THREE.Mesh(boxGeometry, grassNormalMaterial);

const skyboxMesh = new THREE.Mesh(
  new THREE.BoxGeometry(100, 100, 100),
  skyboxMaterials
);

// Position crate meshes
normalMesh.position.x = -3;
bumpMesh.position.x = -1;
diffuseMesh.position.x = 1;
mixedMesh.position.x = 3;

// Position grass meshes side by side and rotate them to be visible
const grassBoxOffset = 1.5; // spacing between boxes
grassDiffuseBox.position.set(-grassBoxOffset * 1.5, 0, 0);
grassDisplacementBox.position.set(-grassBoxOffset * 0.5, 0, 0);
grassSpecularBox.position.set(grassBoxOffset * 0.5, 0, 0);
grassNormalBox.position.set(grassBoxOffset * 1.5, 0, 0);

// Add ambient and directional light
const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

// Animation function
function animate() {
  requestAnimationFrame(animate);
  // Rotate crate meshes
  normalMesh.rotation.x += 0.005;
  normalMesh.rotation.y += 0.005;
  bumpMesh.rotation.x += 0.005;
  bumpMesh.rotation.y += 0.005;
  diffuseMesh.rotation.x += 0.005;
  diffuseMesh.rotation.y += 0.005;
  mixedMesh.rotation.x += 0.005;
  mixedMesh.rotation.y += 0.005;

  //   Rotate grass boxes
  grassDiffuseBox.rotation.x += 0.005;
  grassDiffuseBox.rotation.y += 0.005;
  grassDisplacementBox.rotation.x += 0.005;
  grassDisplacementBox.rotation.y += 0.005;
  grassSpecularBox.rotation.x += 0.005;
  grassSpecularBox.rotation.y += 0.005;
  grassNormalBox.rotation.x += 0.005;
  grassNormalBox.rotation.y += 0.005;

  // Rotate skybox
  if (scene.getObjectByName("skybox")) {
    skyboxMesh.rotation.y += 0.005;
  }

  renderer.render(scene, camera);
}

// Start animation loop
animate();

scene.add(normalMesh, bumpMesh, diffuseMesh, mixedMesh);

// Handle selection change
document
  .getElementById("textureSelector")
  .addEventListener("change", (event) => {
    const value = event.target.value;

    // Clear the scene of objects
    scene.remove(
      normalMesh,
      bumpMesh,
      diffuseMesh,
      mixedMesh,
      grassDiffuseBox,
      grassDisplacementBox,
      grassSpecularBox,
      grassNormalBox,
      skyboxMesh
    );

    if (value === "crate") {
      camera.position.z = 5;
      scene.add(normalMesh, bumpMesh, diffuseMesh, mixedMesh);
    } else if (value === "grass") {
      camera.position.z = 5;
      scene.add(
        grassDiffuseBox,
        grassDisplacementBox,
        grassSpecularBox,
        grassNormalBox
      );
    } else if (value === "skybox") {
      skyboxMesh.name = "skybox";
      camera.position.z = 0;
      camera.position.x = 0;
      camera.position.y = 0;
      scene.add(skyboxMesh);
    }
  });

document.getElementById("textureSelector").value = "crate";
