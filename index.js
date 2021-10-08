import { Scene, PerspectiveCamera, WebGLRenderer, Color, TorusKnotGeometry, SphereGeometry, FontLoader, TextBufferGeometry } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createSculptureWithGeometry, sculptToThreeJSMaterial } from 'shader-park-core';
import { spCode } from './src/spCode.js';
import { initUIInteractions } from './src/ui.js';
import {createEditor} from './src/editor.js';
import {Pane} from 'tweakpane';


// import {font} from './src/helvetiker_regular1.typeface.json';

// let fonts = JSON.parse(font)
let state = {
  csgMode: 'mixGeo(mixAmt);'
};

// const pane = new Pane();



let startCode = spCode();
let startCode2 = 'sphere(.5);';

let scene = new Scene();
let params = { time: 0, mixAmt: 0.1};
initUIInteractions(state, params);
// pane.addInput(
//   params, 'test',
//   {min: 0, max: 2 }
// );

let camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 4;

let renderer = new WebGLRenderer({ antialias: true, transparent: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );

renderer.setClearColor( new Color(1, 1, 1), 0 );
document.body.appendChild( renderer.domElement );

let geometry  = new SphereGeometry(2, 45, 45);
const urlSearchParams = new URLSearchParams(window.location.search);
const qParams = Object.fromEntries(urlSearchParams.entries());
if ('torus' in qParams) {
  geometry = new TorusKnotGeometry( 2, .3, 100, 40);
  geometry.computeBoundingSphere();
  geometry.center();
}

if ('code' in qParams) {
  startCode = decodeURI(qParams['code'])
}
if ('code2' in qParams) {
  startCode2 = decodeURI(qParams['code2']);
}

let scale = 1.0;
if('scale' in qParams) {
  scale = qParams['scale'];
}

state.code = startCode;
state.code2 = startCode2;

let options = ['union();', 'difference();', 'intersect();', 'blend(mixAmt);', 'mixGeo(mixAmt);']

let blendCode = () => {
  state.mixedCode = `
let mixAmt = input();
shape(() => {
${state.code}
})();
${state.csgMode}
shape(() => {
${state.code2}
})();`
}
blendCode();
// Shader Park Setup
let mesh = createSculptureWithGeometry(geometry, state.mixedCode, () => ( {
    time: params.time,
    mixAmt: params.mixAmt,
    _scale: scale
} ));

scene.add(mesh);

if( 'text' in qParams) {
  const loader = new FontLoader();
    // './helvetiker_regular1.typeface.json'
    loader.load('https://cdn.glitch.com/44b034f5-6c9a-414c-96b3-8280ecf82f27%2Fhelvetiker_regular.typeface.json?v=1615399030749', function ( font ) {
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

const uniformsToExclude = { 'sculptureCenter': 0, 'msdf': 0, 'opacity': 0, 'time': 0, 'stepSize': 0, '_scale' : 1, 'resolution': 0};

let onCodeChange = (code) => {
  state.code = code;
  blendCode();
  compileShader();
}

let onCode2Change = (code) => {
  state.code2 = code;
  blendCode();
  compileShader();
}

let compileShader = () => {
  try {
    mesh.material = sculptToThreeJSMaterial(state.mixedCode);
    let uniforms = mesh.material.uniformDescriptions;
    uniforms = uniforms.filter(uniform => !(uniform.name in uniformsToExclude))
    
    console.log(uniforms);
  } catch (error) {
    console.error(error);
  }  
}
window.blendCode = blendCode;
window.compileShader = compileShader;

/////Editor
let editor = createEditor(startCode, onCodeChange);
// window.editor = editor;
let editor2 = createEditor(startCode2, onCode2Change);
let codeContainer2 = document.querySelector('.code-container2');
codeContainer2.appendChild(editor2.dom);
// window.editor = editor;
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