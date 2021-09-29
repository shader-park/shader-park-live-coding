import { Scene, PerspectiveCamera, WebGLRenderer, Color, TorusKnotGeometry, SphereGeometry, FontLoader, TextBufferGeometry } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createSculptureWithGeometry, sculptToThreeJSMaterial } from 'shader-park-core';
import { spCode } from './src/spCode.js';
import { initUIInteractions } from './src/ui.js';
import {createEditor} from './src/editor.js';

let state = {};
initUIInteractions(state);

let startCode = spCode();

let scene = new Scene();
let params = { time: 0 };

let camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 4;

let renderer = new WebGLRenderer({ antialias: true, transparent: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );

renderer.setClearColor( new Color(1, 1, 1), 0 );
document.body.appendChild( renderer.domElement );

let geometry  = new SphereGeometry(1, 45, 45);
const urlSearchParams = new URLSearchParams(window.location.search);
const qParams = Object.fromEntries(urlSearchParams.entries());
if ('torus' in qParams) {
  geometry = new TorusKnotGeometry( 1, .3, 100, 40);
  geometry.computeBoundingSphere();
  geometry.center();
}

if ('code' in qParams) {
  startCode = decodeURI(qParams['code'])
}

state.code = startCode;
// Shader Park Setup
let mesh = createSculptureWithGeometry(geometry, startCode, () => ( {
    time: params.time,
} ));
scene.add(mesh);

if( 'text' in qParams) {
  const loader = new FontLoader();
  loader.load( 'https://cdn.glitch.com/44b034f5-6c9a-414c-96b3-8280ecf82f27%2Fhelvetiker_regular.typeface.json?v=1615399030749', function ( font ) {
    mesh.geometry = new TextBufferGeometry( qParams['text'], {
      font: font,
      size: 2,
      height: .1,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: .01,
      bevelSize: .1,
      bevelOffset: 0,
      bevelSegments: 1
    } );
    mesh.geometry.computeBoundingSphere();
    mesh.geometry.center();
  });
}

let controls = new OrbitControls( camera, renderer.domElement, {
  enableDamping : true,
  dampingFactor : 0.25,
  zoomSpeed : 0.5,
  rotateSpeed : 0.5
} );
camera.position.z = 2;

window.controls = controls;

let onCodeChange = (code) => {
  state.code = code;
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


/////Editor
let editor = createEditor(startCode, onCodeChange);
window.editor = editor;
let codeContainer = document.querySelector('.code-container');
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