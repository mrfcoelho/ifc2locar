import "./main.css";
import * as LocAR from "locar";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// setup the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.001,
  10000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", (e) => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// locar.fakeGps(-8.288810318146739, 41.45312023533569);

//overall AR.js "manager" object
const locar = new LocAR.LocationBased(scene, camera);
//responsible for rendering the camera feed
const cam = new LocAR.WebcamRenderer(renderer);

let firstLocation = true;

const deviceOrientationControls = new LocAR.DeviceOrientationControls(camera);

// Models
const models = {
  m12: {
    uri: "12_escolaCiencias.glb",
    latitude: 41.45312023533569,
    longitude: -8.288810318146739,
    orientation: 45,
    descritpion: " <p>Testing description</p>",
  },
  m14: {
    uri: "14_ccg.glb",
    latitude: 41.4534311145121,
    longitude: -8.288169382564208,
    orientation: -90,
    descritpion: "Testing description",
  },
};

locar.on("gpsupdate", async (pos, distMoved) => {
  if (firstLocation) {
    alert(
      `Got the initial location: longitude ${pos.coords.longitude}, latitude ${pos.coords.latitude}`
    );

    // add all models
    for (const key in models) {
      // load the model
      let model;
      let modelLoader = await new GLTFLoader(model)
        .loadAsync(models[key].uri)
        .then(function (gltfModel) {
          // get all children of current model
          model = gltfModel.scene.children;
        });

      model.forEach((child) => {
        // only add to the scene the child of type mesh
        if (child.isMesh) {
          locar.add(child, models[key].longitude, models[key].latitude);
        }
      });
    }

    firstLocation = false;
  }
});

locar.startGps();

//--------------------- example with real gps and cube ---------------------//

renderer.setAnimationLoop(animate);

// function that will update the cam
function animate() {
  cam.update();
  deviceOrientationControls.update();
  renderer.render(scene, camera);
}
