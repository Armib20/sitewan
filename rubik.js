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

/////////////////////////////////////	
// ADD LIGHTS  and define a simple material that uses lighting
/////////////////////////////////////	

light = new THREE.PointLight(0xffffff);
light.position.set(0,4,2);
scene.add(light);
ambientLight = new THREE.AmbientLight(0x606060);
scene.add(ambientLight);

const axesHelper = new THREE.AxesHelper( 5 );
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
  cubeMaterialArray.push( blueMaterial );
  cubeMaterialArray.push( greenMaterial );
  cubeMaterialArray.push( whiteMaterial );
  cubeMaterialArray.push( yellowMaterial );
  cubeMaterialArray.push( redMaterial );
  cubeMaterialArray.push( orangeMaterial );
  if (y == 0 || y == 1.1) {cubeMaterialArray[3] = blackMaterial;} // bottom face black
  if (y == 0 || y == -1.1) {cubeMaterialArray[2] = blackMaterial;} // top face black
  if (x == 0 || x == 1.1) {cubeMaterialArray[1] = blackMaterial;} // left face black
  if (x == 0 || x == -1.1) {cubeMaterialArray[0] = blackMaterial;} // right face black
  if (z == 0 || z == 1.1) {cubeMaterialArray[5] = blackMaterial;} // back face black
  if (z == 0 || z == -1.1) {cubeMaterialArray[4] = blackMaterial;} // front face black
  return cubeMaterialArray;
}

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

/////////////////////////////////////	
// MATERIAL CHANGING ONCLICK
/////////////////////////////////////	

/* var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
function onMouseClick(event) {
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
  // update the picking ray with the camera and pointer position
	raycaster.setFromCamera( mouse, camera );
	// calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects( cubesArray1D );
  if (intersects.length > 0) {
    if (intersects[0].object.material == normalMaterial) {
      intersects[0].object.material = generateMaterial(round(intersects[0].point.x),
                                                      round(intersects[0].point.y),
                                                      round(intersects[0].point.z));
    } else {
      intersects[0].object.material = normalMaterial;
    }
  }
}
window.addEventListener( 'click', onMouseClick ); */

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

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    // rotations in orientation red front white up
    if (keyCode == "R".charCodeAt()) {           // rotate right clockwise wrt x
      rotateXFace(1.1, -Math.PI / 4);
    } else if (keyCode == "L".charCodeAt()) {    // rotate left counterclockwise wrt x
      rotateXFace(-1.1, Math.PI / 4);
    } else if (keyCode == "M".charCodeAt()) {    // rotate middle clockwise wrt x
      rotateXFace(0, -Math.PI / 4);
    } else if (keyCode == "U".charCodeAt()) {    // rotate top clockwise wrt y
      rotateYFace(1.1, -Math.PI / 4);
    } else if (keyCode == "D".charCodeAt()) {    // rotate bottom counterclockwise wrt y
      rotateYFace(-1.1, Math.PI / 4);
    } else if (keyCode == "F".charCodeAt()) {    // rotate front clockwise wrt z
      rotateZFace(1.1, -Math.PI / 4);
    } else if (keyCode == "B".charCodeAt()) {    // rotate back counterclockwise wrt z
      rotateZFace(-1.1, Math.PI / 4);
    }
};

// helper function for rotating x faces (R,L,M)
function rotateXFace(xpos, rad) {
  var M = new THREE.Matrix4();
  M.makeRotationX(rad);
  // perform rotation
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        if (round(cubesArray3D[x][y][z].getWorldPosition().x) == xpos) {
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
  // perform rotation
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        if (round(cubesArray3D[x][y][z].getWorldPosition().y) == ypos) {
          cubesArray3D[x][y][z].matrixAutoUpdate = false;
          cubesArray3D[x][y][z].matrix.premultiply(M);
          cubesArray3D[x][y][z].updateMatrixWorld();
        }
      }
    }
  }
}
// helper function for rotating y faces (U, D)
function rotateZFace(zpos, rad) {
  var M = new THREE.Matrix4();
  M.makeRotationZ(rad);
  // perform rotation
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        if (round(cubesArray3D[x][y][z].getWorldPosition().z) == zpos) {
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

function update() {
  requestAnimationFrame(update);      // requests the next update call;  this creates a loop
  renderer.render(scene, camera);
}

update();
