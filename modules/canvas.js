import { face_animation_status, motions} from "./face_rotation.js";
import { scene } from "./rubik.js";

// SETUP RENDERER & SCENE
let canvas = document.getElementById('canvas');
let renderer = new THREE.WebGLRenderer();
  // set background colour to 0xRRGGBB  where RR,GG,BB are values in [00,ff] in hexadecimal, i.e., [0,255] 
renderer.setClearColor(0x30322F);     
canvas.appendChild(renderer.domElement);

// SETUP CAMERA
let camera = new THREE.PerspectiveCamera(30,1,0.1,1000); // view angle, aspect ratio, near, far
camera.position.set(15,10,10);
camera.lookAt(0,0,0);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
let controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;
controls.autoRotate = false;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

// SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
    window.scrollTo(0,0);
}

////////////////////////////////////////////////////////////////////
// ADD LIGHTS  and define a simple material that uses lighting
////////////////////////////////////////////////////////////////////	

const light = new THREE.PointLight(0xffffff);
light.position.set(0,4,2);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0x606060);
scene.add(ambientLight);

const axesHelper = new THREE.AxesHelper( 4 );
scene.add( axesHelper );

////////////////////////
// UPDATE CALLBACK
////////////////////////

async function update() {
  let dt=0.1;
  if (face_animation_status.right) motions.right.timestep(dt);
  else if (face_animation_status.left) motions.left.timestep(dt);
  else if (face_animation_status.mid) motions.mid.timestep(dt);
  else if (face_animation_status.up) motions.up.timestep(dt);
  else if (face_animation_status.down) motions.down.timestep(dt);
  else if (face_animation_status.front) motions.front.timestep(dt);
  else if (face_animation_status.back) motions.back.timestep(dt);
  
  requestAnimationFrame(update);      // requests the next update call;  this creates a loop
  renderer.render(scene, camera);
}

update();