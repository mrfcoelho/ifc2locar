import "./mian.css";
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

// setup the models to be shown in the scene
const box = new THREE.BoxGeometry(20, 20, 20);
const cube = new THREE.Mesh(
  box,
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

//overall AR.js "manager" object
const locar = new LocAR.LocationBased(scene, camera);
//responsible for rendering the camera feed
const cam = new LocAR.WebcamRenderer(renderer);

//--------------------- example with fake gps and cube ---------------------//
/**
 * fakeGps(lon, lat, elev=null, acc=0) : fakes a GPS position being received. Elevation and accuracy can optionally be provided.
 * To place ourselves (i.e. the camera) at a given real-world location.
 * lon: longitude, distance to Greenwich
 * lat: latitude, distance to equator
 */
//locar.fakeGps(-8.40, 41.457); //H
//locar.fakeGps(-8.29, 41.45); //O
// add 3D model to a specific real-world location defined by longitude and latitude
//locar.add(cube, -8.40, 41.548); //H
//locar.add(cube, -8.29, 41.451); //O

//--------------------- example with fake gps and cube ---------------------//
//--------------------- example with real gps and cube ---------------------//

let firstLocation = true;

const deviceOrientationControls = new LocAR.DeviceOrientationControls(camera);

locar.on("gpsupdate", (pos, distMoved) => {
  if (firstLocation) {
    alert(
      `Got the initial location: longitude ${pos.coords.longitude}, latitude ${pos.coords.latitude}`
    );

    const boxProps = [
      {
        latDis: 0.001,
        lonDis: 0,
        colour: 0xff0000,
      },
      {
        latDis: -0.001,
        lonDis: 0,
        colour: 0xffff00,
      },
      {
        latDis: 0,
        lonDis: -0.001,
        colour: 0x00ffff,
      },
      {
        latDis: 0,
        lonDis: 0.001,
        colour: 0x00ff00,
      },
    ];

    const geom = new THREE.BoxGeometry(20, 20, 20);

    for (const boxProp of boxProps) {
      const mesh = new THREE.Mesh(
        geom,
        new THREE.MeshBasicMaterial({ color: boxProp.colour })
      );

      console.log(
        `adding at ${pos.coords.longitude + boxProp.lonDis},${
          pos.coords.latitude + boxProp.latDis
        }`
      );
      locar.add(
        mesh,
        pos.coords.longitude + boxProp.lonDis,
        pos.coords.latitude + boxProp.latDis
      );
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
