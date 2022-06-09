import { Scene, PerspectiveCamera, WebGLRenderer, Color, SphereGeometry, TorusKnotGeometry, TextBufferGeometry } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createSculptureWithGeometry, sculptToThreeJSMaterial } from "shader-park-core";
import { spCode } from "./src/spCode.js";
import { initUIInteractions } from "./src/ui.js";
import { createEditor } from "./src/editor.js";
import { Pane } from "tweakpane";

// import { font } from "./src/helvetiker_regular1.typeface.json";
// const fonts = JSON.parse(font);

// query parameters
const urlSearchParams = new URLSearchParams(window.location.search);
const qParams = Object.fromEntries(urlSearchParams.entries());

// starter code and its UI init
const startCode = ("code" in qParams) ? decodeURI(qParams["code"]) : spCode();
const state = { code: startCode };
initUIInteractions(state);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener("resize", () =>
{
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
})

// Scene
const scene = new Scene();

// Camera
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 2;

// Renderer
const renderer = new WebGLRenderer({ antialias: true, transparent: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(new Color(1, 1, 1), 0);
document.body.appendChild(renderer.domElement);

// Controls
const controlConfig = {
  enableDamping : true,
  dampingFactor : 0.25,
  zoomSpeed : 0.5,
  rotateSpeed : 0.5
};

const controls = new OrbitControls(camera, renderer.domElement, controlConfig);

// Geometry
const sphereGeometry = new SphereGeometry(2, 45, 45);
const torusGeometry = new TorusKnotGeometry(2, .3, 100, 40);
torusGeometry.computeBoundingSphere();
torusGeometry.center();

const geometry = ("torus" in qParams) ? torusGeometry : sphereGeometry;

// Shader Park Setup
const params =  {};

params.time = 0;
params.test = { "x":.2, "y": .4 };
params.scale = ("scale" in qParams) ? qParams["scale"] : 1.0;

const mesh = createSculptureWithGeometry(geometry, state.code, () => ( {
    time: params.time,
    _scale: params.scale
} ));

state.mesh = mesh;
scene.add(mesh);

// const pane = new Pane();
// pane.addInput(
//   params, "test",
//   {min: 0, max: 2 }
// );

if("text" in qParams) {
  const loader = new FontLoader();
  const mesh = state.mesh;

  loader.load( "./helvetiker_regular1.typeface.json", function ( font ) {
    mesh.geometry = new TextBufferGeometry( qParams["text"], {
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

const uniformsToExclude = { "sculptureCenter": 0, "msdf": 0, "opacity": 0, "time": 0, "stepSize": 0, "_scale" : 1, "resolution": 0};

const onCodeChange = (code) => {
  state.code = code;
  try {
    // const newMesh = createSculpture(code, () => ( {
    //   time: params.time,
    // } ));
    // scene.remove(state.mesh);
    // scene.add(newMesh);
    // state.mesh = newMesh;

    const mesh = state.mesh;
    mesh.material = sculptToThreeJSMaterial(code);
    let uniforms = mesh.material.uniformDescriptions;
    uniforms = uniforms.filter(uniform => !(uniform.name in uniformsToExclude));
    
    console.log(uniforms);
  } catch (error) {
    console.error(error);
  }
}

// Editor
const editor = createEditor(state.code, onCodeChange);
const codeContainer = document.querySelector(".code-container");
codeContainer.appendChild(editor.dom);

// Add parameters to window
window.applications = {}
window.applications.controls = controls;
window.applications.editor = editor;

// render for each frame
const render = () => {
  requestAnimationFrame(render);
  params.time += 0.01;
  controls.update();
  renderer.render(scene, camera);
};

render();
