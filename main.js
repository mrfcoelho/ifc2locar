import "./style.css";
import * as LocAR from "locar";
import * as THREE from "three";
import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as WEBIFC from "web-ifc";

//

// document.querySelector("#app").innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `;

// setupCounter(document.querySelector("#counter"));

// hello world
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
const box = new THREE.BoxGeometry(20, 20, 20);
const cube = new THREE.Mesh(
  box,
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

//overall AR.js "manager" object
const locar = new LocAR.LocationBased(scene, camera);
//responsible for rendering the camera feed
const cam = new LocAR.WebcamRenderer(renderer);

/**
 * fakeGps(lon, lat, elev=null, acc=0) : fakes a GPS position being received. Elevation and accuracy can optionally be provided.
 * To place ourselves (i.e. the camera) at a given real-world location.
 * lon: longitude, distance to Greenwich
 * lat: latitude, distance to equator
 */
//locar.fakeGps(-8.4053, 41.5466);
// add 3D model to a specific real-world location defined by longitude and latitude
//locar.add(cube, -8.4053, 41.546601);
locar.add(cube, -8.410888279369487, 41.538707419973);

renderer.setAnimationLoop(animate);

function animate() {
  cam.update();
  renderer.render(scene, camera);
}
