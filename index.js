import { Scene, PerspectiveCamera, WebGLRenderer, Color, TorusKnotGeometry, SphereGeometry } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createSculptureWithGeometry, sculptToThreeJSMaterial } from 'shader-park-core';
import { spCode } from './src/spCode.js';

import {createEditor} from './src/editor.js';

let codeContainer = document.querySelector('.code-container');

let scene = new Scene();
let params = { time: 0 };

let camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 4;

let renderer = new WebGLRenderer({ antialias: true, transparent: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );

renderer.setClearColor( new Color(1, 1, 1), 0 );
document.body.appendChild( renderer.domElement );


let geometry = new SphereGeometry(1, 45, 45);
// let geometry = new TorusKnotGeometry( 1, .3, 100, 40);
// geometry.computeBoundingSphere();
// geometry.center();

// Shader Park Setup
let mesh = createSculptureWithGeometry(geometry, spCode(), () => ( {
    time: params.time,
} ));
scene.add(mesh);

// *** Uncomment to try using a custom geometry. Make sure to comment out likes 26-29 ***.

// let mesh = createSculptureWithGeometry(geometry, spCode, () => ( {
//   time: params.time,
// } ));
// scene.add(mesh);

let controls = new OrbitControls( camera, renderer.domElement, {
  enableDamping : true,
  dampingFactor : 0.25,
  zoomSpeed : 0.5,
  rotateSpeed : 0.5
} );
camera.position.z = 2;

window.controls = controls;

let onCodeChange = (code) => {
  console.log(code);
  try {
    // let newMesh = createSculpture(code, () => ( {
    //   time: params.time,
    // } ));
    // scene.remove(mesh);
    // scene.add(newMesh);
    // mesh = newMesh;
    mesh.material = sculptToThreeJSMaterial(code);
  } catch (error) {
    console.error(error);
  }
}

let editor = createEditor(onCodeChange);
window.editor = editor;
codeContainer.appendChild(editor.dom);

let onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener( 'resize', onWindowResize );

let render = () => {
  requestAnimationFrame( render );
  params.time += 0.01;
  controls.update();
  renderer.render( scene, camera );
};

render();