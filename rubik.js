/////////////////////////////////////////////////////////////////////////////////////////
//  Template taken from UBC CPSC 314, September 2022, Assignment 1 
/////////////////////////////////////////////////////////////////////////////////////////

// SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
  // set background colour to 0xRRGGBB  where RR,GG,BB are values in [00,ff] in hexadecimal, i.e., [0,255] 
renderer.setClearColor(0x30322F);     
canvas.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30,1,0.1,1000); // view angle, aspect ratio, near, far
camera.position.set(15,10,10);
camera.lookAt(0,0,0);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
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

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
}

var reverse = false;
// Motion/animation-related variables
var animRight = false;
var animLeft = false;
var animMid = false;
var animUp = false;
var animDown = false;
var animFront = false;
var animBack = false;
var rightMotion;
var leftMotion;
var middleMotion;
var upMotion;
var downMotion;
var frontMotion;
var backMotion;

function initMotions() {
  var theta = Math.PI / 8;
  if (reverse) theta = -theta;
  rightMotion = new Motion(rotateRFace);
  leftMotion = new Motion(rotateLFace);
  middleMotion = new Motion(rotateMFace);
  upMotion = new Motion(rotateUFace);
  downMotion = new Motion(rotateDFace);
  frontMotion = new Motion(rotateFFace);
  backMotion = new Motion(rotateBFace);
  // keyframes for motion: name, time, [xpos, theta (rad)]
  rightMotion.addKeyFrame(new Keyframe('beg', 0.0, [1.1, 0, true]));
  rightMotion.addKeyFrame(new Keyframe('beg', 0.2, [1.1, -theta, true]));
  rightMotion.addKeyFrame(new Keyframe('mid', 0.4, [1.1, -theta, true]));
  rightMotion.addKeyFrame(new Keyframe('end', 0.6, [1.1, 0, false]));

  leftMotion.addKeyFrame(new Keyframe('beg', 0.0, [-1.1, 0, true]));
  leftMotion.addKeyFrame(new Keyframe('beg', 0.2, [-1.1, theta, true]));
  leftMotion.addKeyFrame(new Keyframe('mid', 0.4, [-1.1, theta, true]));
  leftMotion.addKeyFrame(new Keyframe('end', 0.6, [-1.1, 0, false]));

  middleMotion.addKeyFrame(new Keyframe('beg', 0.0, [0, 0, true]));
  middleMotion.addKeyFrame(new Keyframe('beg', 0.2, [0, -theta, true]));
  middleMotion.addKeyFrame(new Keyframe('mid', 0.4, [0, -theta, true]));
  middleMotion.addKeyFrame(new Keyframe('end', 0.6, [0, 0, false]));

  upMotion.addKeyFrame(new Keyframe('beg', 0.0, [1.1, 0, true]));
  upMotion.addKeyFrame(new Keyframe('beg', 0.2, [1.1, -theta, true]));
  upMotion.addKeyFrame(new Keyframe('mid', 0.4, [1.1, -theta, true]));
  upMotion.addKeyFrame(new Keyframe('end', 0.6, [1.1, 0, false]));

  downMotion.addKeyFrame(new Keyframe('beg', 0.0, [-1.1, 0, true]));
  downMotion.addKeyFrame(new Keyframe('beg', 0.2, [-1.1, theta, true]));
  downMotion.addKeyFrame(new Keyframe('mid', 0.4, [-1.1, theta, true]));
  downMotion.addKeyFrame(new Keyframe('end', 0.6, [-1.1, 0, false]));

  frontMotion.addKeyFrame(new Keyframe('beg', 0.0, [1.1, 0, true]));
  frontMotion.addKeyFrame(new Keyframe('beg', 0.2, [1.1, -theta, true]));
  frontMotion.addKeyFrame(new Keyframe('mid', 0.4, [1.1, -theta, true]));
  frontMotion.addKeyFrame(new Keyframe('end', 0.6, [1.1, 0, false]));

  backMotion.addKeyFrame(new Keyframe('beg', 0.0, [-1.1, 0, true]));
  backMotion.addKeyFrame(new Keyframe('beg', 0.2, [-1.1, theta, true]));
  backMotion.addKeyFrame(new Keyframe('mid', 0.4, [-1.1, theta, true]));
  backMotion.addKeyFrame(new Keyframe('end', 0.6, [-1.1, 0, false]));
}

// Helper function to toggle reverse and update motions
// Takes a boolean ifReverse and updates value of reverse variable
// If param is null, toggles to opposite of current state
function setReverse(ifReverse = null) {
  reverse = ifReverse === null ? !reverse : ifReverse;
  initMotions();
  toggleShowDirection(reverse);
}

/////////////////////////////////////	
// TODO: Define different modes
/////////////////////////////////////
autoSolveMode = false;
function setAutoSolve(status) {
  autoSolveMode = status;
}

/////////////////////////////////////	
// ADD LIGHTS  and define a simple material that uses lighting
/////////////////////////////////////	

light = new THREE.PointLight(0xffffff);
light.position.set(0,4,2);
scene.add(light);
ambientLight = new THREE.AmbientLight(0x606060);
scene.add(ambientLight);

const axesHelper = new THREE.AxesHelper( 4 );
scene.add( axesHelper );

///////////////////////////////////////////////////////////////////////////////////////////
//  MATERIALS
///////////////////////////////////////////////////////////////////////////////////////////

var blackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
var blueMaterial = new THREE.MeshBasicMaterial( { color: 0x003DA5 } );
var greenMaterial = new THREE.MeshBasicMaterial( { color: 0x009A44 } );
var whiteMaterial = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
var yellowMaterial = new THREE.MeshBasicMaterial( { color: 0xFFD700 } );
var redMaterial = new THREE.MeshBasicMaterial( { color: 0xBA0C2F } );
var orangeMaterial = new THREE.MeshBasicMaterial( { color: 0xFE5000 } );
var normalMaterial = new THREE.MeshNormalMaterial();

///////////////////////////////////////////////////////////////////////////////////////////
//  OBJECTS
///////////////////////////////////////////////////////////////////////////////////////////

function createCube(x, y, z) {
  var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  var cubeMaterial = generateMaterial(x, y, z);
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(x, y, z);
  return cube;
}

function generateMaterial(x, y, z) {
  if (x == 0 && y == 0 && z == 0) {return blackMaterial;} // hidden piece
  var cubeMaterialArray = [];   // order to add materials: x+,x-,y+,y-,z+,z-
  
  if (x == 0 || x == -1.1) {cubeMaterialArray[0] = blackMaterial;} // right face black
  else cubeMaterialArray.push( blueMaterial );
  if (x == 0 || x == 1.1) {cubeMaterialArray[1] = blackMaterial;} // left face black
  else cubeMaterialArray.push( greenMaterial );
  if (y == 0 || y == -1.1) {cubeMaterialArray[2] = blackMaterial;} // top face black
  else cubeMaterialArray.push( whiteMaterial );
  if (y == 0 || y == 1.1) {cubeMaterialArray[3] = blackMaterial;} // bottom face black
  else cubeMaterialArray.push( yellowMaterial );
  if (z == 0 || z == -1.1) {cubeMaterialArray[4] = blackMaterial;} // front face black
  else cubeMaterialArray.push( redMaterial );
  if (z == 0 || z == 1.1) {cubeMaterialArray[5] = blackMaterial;} // back face black
  else cubeMaterialArray.push( orangeMaterial );
  
  return cubeMaterialArray;
}

// CREATE CUBE USING BOTH 3D AND 1D ARRAYS
var cubesArray3D = [];
for (x = -1.1; x <= 1.1; x += 1.1) {
  var why = [];
  for (y = -1.1; y <= 1.1; y += 1.1) {
    var zed = [];
    for (z = -1.1; z <= 1.1; z += 1.1) {
      c = createCube(x, y, z);
      zed.push(c);
      scene.add(c);
    }
    why.push(zed);
  }
  cubesArray3D.push(why);
}

var cubesArray1D = [];
for (x = 0; x < 3; x++) {
  for (y = 0; y < 3; y++) {
    for (z = 0; z < 3; z++) {
      cubesArray1D.push(cubesArray3D[x][y][z]);
    }
  }
}

// special rounding helper function, rounds value to -1.1, 0, 1.1
function round(v) {
  var distToZero = Math.abs(v);
  var distToPos = Math.abs(1.1-v);
  var distToNeg = Math.abs(-1.1-v);
  if (distToZero < distToNeg && distToZero < distToPos) {
    return 0;
  }
  if (distToNeg < distToZero && distToNeg < distToPos) {
    return -1.1;
  } 
  return 1.1; // closer to 1.1 case
}

///////////////////////////////////////////////////////////////////////////////////////
// LISTEN TO KEYBOARD
///////////////////////////////////////////////////////////////////////////////////////
const keyActions = {
  82: { // "R".charCodeAt()
    condition: () => !animUp && !animDown && !animFront && !animBack,
    action: () => animRight = true, // rotate right clockwise wrt x
    move: "R"
  },
  76: { // "L".charCodeAt()
    condition: () => !animUp && !animDown && !animFront && !animBack,
    action: () => animLeft = true, // rotate left counterclockwise wrt x
    move: "L"
  },
  77: { // "M".charCodeAt()
    condition: () => !animUp && !animDown && !animFront && !animBack,
    action: () => animMid = true, // rotate middle clockwise wrt x
    move: "M"
  },
  85: { // "U".charCodeAt()
    condition: () => !animRight && !animLeft && !animMid && !animFront && !animBack,
    action: () => animUp = true, // rotate top clockwise wrt y
    move: "U"
  },
  68: { // "D".charCodeAt()
    condition: () => !animRight && !animLeft && !animMid && !animFront && !animBack,
    action: () => animDown = true, // rotate bottom counterclockwise wrt y
    move: "D"
  },
  70: { // "F".charCodeAt()
    condition: () => !animUp && !animDown && !animRight && !animLeft && !animMid,
    action: () => animFront = true, // rotate front clockwise wrt z
    move: "F"
  },
  66: { // "B".charCodeAt()
    condition: () => !animUp && !animDown && !animRight && !animLeft && !animMid,
    action: () => animBack = true, // rotate back counterclockwise wrt z
    move: "B"
  },
  49: { // "1".charCodeAt()
    action: () => setReverse(false),
  },
  50: { // "2".charCodeAt()
    action: () => setReverse(true),
  },
};

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
  var keyCode = event.which;
  if (event.ctrlKey && keyCode === 90) { // ctrl+z
    undoLastMove();
  }
  if (keyActions[keyCode]) {
    const { condition, action, move } = keyActions[keyCode];
    if (!condition || condition()) { // if condition is not defined (i.e. for direction changes) or is true
        action();
    }
    if (move) { // helps exclude non rotation moves from being displayed or saved
      displayAction(reverse, move); // TODO: make sure undo disables this function
      saveAction(reverse, move);
    }
  }
};

// Face rotations
function rotateRFace(avars) {
  animRight = avars[2];
  rotateXFace(avars[0], avars[1]);
}
function rotateLFace(avars) {
  animLeft = avars[2];
  rotateXFace(avars[0], avars[1]);
}
function rotateMFace(avars) {
  animMid = avars[2];
  rotateXFace(avars[0], avars[1]);
}
function rotateUFace(avars) {
  animUp = avars[2];
  rotateYFace(avars[0], avars[1]);
}
function rotateDFace(avars) {
  animDown = avars[2];
  rotateYFace(avars[0], avars[1]);
}
function rotateFFace(avars) {
  animFront = avars[2];
  rotateZFace(avars[0], avars[1]);
}
function rotateBFace(avars) {
  animBack = avars[2];
  rotateZFace(avars[0], avars[1]);
}

// helper function for rotating x faces (R,L,M)
function rotateXFace(xpos, rad) {
  var M = new THREE.Matrix4();
  M.makeRotationX(rad);
  var cubePos = new THREE.Vector3();
  // perform rotation
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        if (round(cubesArray3D[x][y][z].getWorldPosition(cubePos).x) == xpos) {
          cubesArray3D[x][y][z].matrixAutoUpdate = false;
          cubesArray3D[x][y][z].matrix.premultiply(M);
          cubesArray3D[x][y][z].updateMatrixWorld();
        }
      }
    }
  }
}
// helper function for rotating y faces (U, D)
function rotateYFace(ypos, rad) {
  var M = new THREE.Matrix4();
  M.makeRotationY(rad);
  var cubePos = new THREE.Vector3();
  // perform rotation
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        if (round(cubesArray3D[x][y][z].getWorldPosition(cubePos).y) == ypos) {
          cubesArray3D[x][y][z].matrixAutoUpdate = false;
          cubesArray3D[x][y][z].matrix.premultiply(M);
          cubesArray3D[x][y][z].updateMatrixWorld();
        }
      }
    }
  }
}
// helper function for rotating z faces (F, B)
function rotateZFace(zpos, rad) {
  var M = new THREE.Matrix4();
  M.makeRotationZ(rad);
  var cubePos = new THREE.Vector3();
  // perform rotation
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        if (round(cubesArray3D[x][y][z].getWorldPosition(cubePos).z) == zpos) {
          cubesArray3D[x][y][z].matrixAutoUpdate = false;
          cubesArray3D[x][y][z].matrix.premultiply(M);
          cubesArray3D[x][y][z].updateMatrixWorld();
        }
      }
    }
  }
}


///////////////////////////////////////////////////////////////////////////////////////
// UPDATE CALLBACK
///////////////////////////////////////////////////////////////////////////////////////

// Called by the autosolver / undo/redo. 
// Takes in move (string) in Rubik's notation, both forward and reverse e.g. R, R'
function updateMove(move) {
  // if move contains apostrophe, reverse direction
  if (move.charAt(1) === "'") setReverse(true);
  else setReverse(false);

  keyCode = move.charAt(0).charCodeAt()
  if (keyActions[keyCode]) {
    const { condition, action } = keyActions[keyCode];
    if (!condition || condition()) {
        action();
    }
  } else console.log("Invalid move: " + move);
}

async function update() {
  var dt=0.1;
  if (animRight) rightMotion.timestep(dt);
  else if (animLeft) leftMotion.timestep(dt);
  else if (animMid) middleMotion.timestep(dt);
  else if (animUp) upMotion.timestep(dt);
  else if (animDown) downMotion.timestep(dt);
  else if (animFront) frontMotion.timestep(dt);
  else if (animBack) backMotion.timestep(dt);
  
  requestAnimationFrame(update);      // requests the next update call;  this creates a loop
  renderer.render(scene, camera);
}
initMotions();
update();