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

//overall AR.js "manager" object
const locar = new LocAR.LocationBased(scene, camera);
//responsible for rendering the camera feed
const cam = new LocAR.WebcamRenderer(renderer);

let firstLocation = true;

const deviceOrientationControls = new LocAR.DeviceOrientationControls(camera);

// Models
const models = {
  // m12: {
  //   uri: "12_escolaCiencias.glb",
  //   latitude: 41.45312023533569,
  //   longitude: -8.288810318146739,
  //   altitude: 275,
  //   orientation: 45,
  //   descritpion: " <p>Testing description</p>",
  // },
  m14: {
    uri: "14_ccg.glb",
    latitude: 41.4534311145121,
    longitude: -8.288169382564208,
    altitude: 278,
    orientation: 0,
    descritpion: "Testing description",
  },
};

// const box = new THREE.BoxGeometry(20, 20, 20);
// const cube = new THREE.Mesh(
//   box,
//   new THREE.MeshBasicMaterial({ color: 0xff0000 })
// );
// locar.fakeGps(-8.288169382564208, 41.4534311145121, 100);
// locar.add(cube, -8.288169382564208, 41.455, 20);

locar.on("gpsupdate", async (pos, distMoved) => {
  if (firstLocation) {
    alert(
      `Got the initial location: longitude ${pos.coords.longitude}, latitude ${pos.coords.latitude}. altitude ${pos.coords.altitude}`
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
