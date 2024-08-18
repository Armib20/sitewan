// Define the scene here to facilitate cube creation and modification
// Directly modifying the scene during cube creation improves performance
export let scene = new THREE.Scene();

///////////////////////////////////////////////////////////////////////////////////////////
//  MATERIALS
///////////////////////////////////////////////////////////////////////////////////////////

let blackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
let blueMaterial = new THREE.MeshBasicMaterial( { color: 0x003DA5 } );
let greenMaterial = new THREE.MeshBasicMaterial( { color: 0x009A44 } );
let whiteMaterial = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
let yellowMaterial = new THREE.MeshBasicMaterial( { color: 0xFFD700 } );
let redMaterial = new THREE.MeshBasicMaterial( { color: 0xBA0C2F } );
let orangeMaterial = new THREE.MeshBasicMaterial( { color: 0xFE5000 } );

///////////////////////////////////////////////////////////////////////////////////////////
//  OBJECTS
///////////////////////////////////////////////////////////////////////////////////////////

function createCube(x, y, z) {
  let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  let cubeMaterial = generateMaterial(x, y, z);
  let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(x, y, z);
  return cube;
}

function generateMaterial(x, y, z) {
  if (x == 0 && y == 0 && z == 0) {return blackMaterial;} // hidden piece
  let cubeMaterialArray = [];   // order to add materials: x+,x-,y+,y-,z+,z-
  
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
export let cubesArray3D = [];
for (let x = -1.1; x <= 1.1; x += 1.1) {
  let why = [];
  for (let y = -1.1; y <= 1.1; y += 1.1) {
    let zed = [];
    for (let z = -1.1; z <= 1.1; z += 1.1) {
      const c = createCube(x, y, z);
      zed.push(c);
      scene.add(c);
    }
    why.push(zed);
  }
  cubesArray3D.push(why);
}

// CURRENTLY NOT USED
export let cubesArray1D = [];
for (let x = 0; x < 3; x++) {
  for (let y = 0; y < 3; y++) {
    for (let z = 0; z < 3; z++) {
      cubesArray1D.push(cubesArray3D[x][y][z]);
    }
  }
}