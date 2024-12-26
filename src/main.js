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
// console.log("aqui");

// locar.fakeGps(-8.288, 41.45);

const box = new THREE.BoxGeometry(2, 2, 2);
const cube = new THREE.Mesh(
  box,
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

// locar.add(cube, -8.288, 41.4501);

// Instantiate the GLTFLoader
// const loader = new GLTFLoader();

// loader.load(models["m12"].uri, function (gltf) {
//   console.log(gltf.scene);
//   const model = gltf.scene;
//   locar.add(model, models["m12"].longitude, models["m12"].latitude + 0.002);
// });

// // load the model
// let model;
// let modelLoader = await new GLTFLoader(model)
//   .loadAsync(models["m12"].uri)
//   .then(function (gltfModel) {
//     // console.log("tudo", gltfModel);
//     model = gltfModel.scene.children;
//     // console.log("testing", model);
//   });

// // // console.log("outside", model);

// model.forEach((child) => {
//   if (child.isMesh) {
//     // console.log(child);
//     child.material.color.set("0xff0000");
//     locar.add(child, models["m12"].longitude, models["m12"].latitude);
//   }
// });

locar.on("gpsupdate", async (pos, distMoved) => {
  if (firstLocation) {
    alert(
      `Got the initial location: longitude ${pos.coords.longitude}, latitude ${pos.coords.latitude}`
    );

    // console.log("aqui dentro");

    // add all models
    for (const key in models) {
      // load the model
      let model;
      let modelLoader = await new GLTFLoader(model)
        .loadAsync(models[key].uri)
        .then(function (gltfModel) {
          // console.log("tudo", gltfModel);
          model = gltfModel.scene.children;
          // console.log("testing", model);
        });

      // console.log("outside", model);

      model.forEach((child) => {
        if (child.isMesh) {
          // console.log(child);
          locar.add(child, models[key].longitude, models[key].latitude);
        }
      });
    }

    firstLocation = false;
  }
});

console.log("aqui fora");

locar.startGps();

//--------------------- example with real gps and cube ---------------------//

renderer.setAnimationLoop(animate);

// function that will update the cam
function animate() {
  cam.update();
  deviceOrientationControls.update();
  renderer.render(scene, camera);
}
