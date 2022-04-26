import { Scene, PerspectiveCamera, WebGLRenderer, Color, TorusKnotGeometry, SphereGeometry } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createSculptureWithGeometry, sculptToThreeJSMaterial, createMultiPassSculptureWithGeometry } from 'shader-park-core';
import { spCode, defaultPassCode } from './src/spCode.js';
import { initUIInteractions } from './src/ui.js';
import {createEditor} from './src/editor.js';
import {Pane} from 'tweakpane';
import { Vector2 } from 'three';


let tabs = document.querySelectorAll('.tablinks');
let activeTab = document.querySelector('.active');
let activeContainer = document.querySelector('.final-image');
let getContainerClass = (tab) => '.'+tab.innerHTML.toLocaleLowerCase().replace(' ', '-');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    if(activeTab == tab) {
      if(activeTab.classList.contains('active')) {
        activeTab.classList.remove('active');
        activeContainer.classList.add('hidden');
      } else {
        activeTab.classList.add('active');
        activeContainer.classList.remove('hidden');
      }
      return;
    }
    activeTab.classList.remove('active');
    tab.classList.add('active');
    activeTab = tab;
    activeContainer.classList.add('hidden');
    activeContainer = document.querySelector(getContainerClass(tab))
    
    activeContainer.classList.remove('hidden');
  }, false);
});


// import {font} from './src/helvetiker_regular1.typeface.json';

// let fonts = JSON.parse(font)
let state = {};

// const pane = new Pane();

// initUIInteractions(state);

let startCode = spCode();

let scene = new Scene();
let params = { time: 0, test: {'x':.2, 'y': .4}};
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
let scale = 1.0;
if('scale' in qParams) {
  scale = qParams['scale'];
}

state.code = startCode;
// Shader Park Setup
let res = new Vector2();
renderer.getSize(res);
let filler = `let s = enable2D()`;

function initMultiPass(finalImage, bufferA, bufferB, bufferC, bufferD) {
  return createMultiPassSculptureWithGeometry(geometry, { finalImage, bufferA, bufferB, bufferC, bufferD }, () => ( {
      time: params.time,
      _scale: scale,
      resolution: res
  } ));
}
let mesh = initMultiPass(startCode, defaultPassCode(), filler, filler, filler);



scene.add(mesh);

// if( 'text' in qParams) {
//   const loader = new FontLoader();

//   loader.load( './helvetiker_regular1.typeface.json', function ( font ) {
//     mesh.geometry = new TextBufferGeometry( qParams['text'], {
//       font: font,
//       size: 2,
//       height: .1,
//       curveSegments: 12,
//       bevelEnabled: true,
//       bevelThickness: .01,
//       bevelSize: .1,
//       bevelOffset: 0,
//       bevelSegments: 1
//     });
//     mesh.geometry.computeBoundingSphere();
//     mesh.geometry.center();
//   });
// }

let controls = new OrbitControls( camera, renderer.domElement, {
  enableDamping : true,
  dampingFactor : 0.25,
  zoomSpeed : 0.5,
  rotateSpeed : 0.5
} );
camera.position.z = 2;

window.controls = controls;

const uniformsToExclude = { 'sculptureCenter': 0, 'msdf': 0, 'opacity': 0, 'time': 0, 'stepSize': 0, '_scale' : 1, 'resolution': 0};;

let getAllCode = () => {
  let output = {}
  for (const [key, value] of Object.entries(editors)) {    
    output[key] = value.state.doc.toString()
  }
  return output;
}

let onCodeChange = (code, editorID) => {
  state.code = code;
  
  try {
    // console.log(editorID, editors)
    let allCode = getAllCode();
    renderer.getSize(res);
    let newMesh = initMultiPass(allCode.finalImage, allCode.bufferA, allCode.bufferB, allCode.bufferC, allCode.bufferD);
    // let newMesh = createMultiPassSculptureWithGeometry(geometry, {bufferA:allCode.bufferA, finalImage: allCode.finalImage}, () => ( {
    //   time: params.time,
    //   _scale: scale,
    //   resolution: res
    // } ));
    scene.remove(mesh);
    
    scene.add(newMesh);
    mesh = newMesh;

  } catch(e) {
    console.error(e);
  }

  //   mesh.material = sculptToThreeJSMaterial(code);
  //   let uniforms = mesh.material.uniformDescriptions;
  //   uniforms = uniforms.filter(uniform => !(uniform.name in uniformsToExclude))
    
  //   console.log(uniforms);
  // } catch (error) {
  //   console.error(error);
  // }
}

/////Editor
// let editor = createEditor(startCode, onCodeChange);
// let codeContainer = document.querySelector('.final-image');
// codeContainer.appendChild(editor.dom);

let editorsCodeRef = {
  '.common' : '',
  '.buffera' : defaultPassCode(),
  '.bufferb' : filler,
  '.bufferc' : filler,
  '.bufferd' : filler,
  '.final-image' : spCode(),
}
let lookup = {
  '.common' : 'common',
  '.buffera' : 'bufferA',
  '.bufferb' : 'bufferB',
  '.bufferc' : 'bufferC',
  '.bufferd' : 'bufferD',
  '.final-image' : 'finalImage'
};
let editors = {}
for (const [key, value] of Object.entries(editorsCodeRef)) {
  
  let container = document.querySelector(key);
  let editor = createEditor(value, (code) => {
    onCodeChange(code, lookup[key]);
  });
  container.appendChild(editor.dom);
  editors[lookup[key]] = editor;
}

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