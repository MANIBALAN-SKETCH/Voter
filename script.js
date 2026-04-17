let scene, camera, renderer, model;

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", init);

async function init() {
  startBtn.style.display = "none";

  // ✅ Start FRONT camera
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
    audio: false
  });

  video.srcObject = stream;

  // ✅ THREE.JS SETUP
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );
  camera.position.z = 2;

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // ✅ LIGHTING
  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  scene.add(light);

  // ✅ LOAD GLB MODEL
  const loader = new THREE.GLTFLoader();

  loader.load(
    "voter1.glb",
    (gltf) => {
      model = gltf.scene;
      model.scale.set(0.5, 0.5, 0.5);
      model.position.set(0, 0, -1);

      scene.add(model);
    },
    undefined,
    (error) => {
      console.error("Error loading model:", error);
    }
  );

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  if (model) {
    model.rotation.y += 0.01; // simple animation
  }

  renderer.render(scene, camera);
}

// ✅ HANDLE RESIZE
window.addEventListener("resize", () => {
  if (!camera || !renderer) return;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});
