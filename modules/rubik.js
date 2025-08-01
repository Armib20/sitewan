// Import the scene here to facilitate cube creation and modification
// Directly modifying the scene during cube creation improves performance
import { scene } from "./sceneManager.js";

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

function createCubelet(x, y, z) {
  let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  let cubeMaterial = generateMaterial(x, y, z);
  let cubelet = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cubelet.position.set(x, y, z);
  return cubelet;
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

export let cubesArray3D = [];
export let cubeGroup = new THREE.Group(); // Group to hold all cubelets for ambient rotation

// Hover state management
let hoveredFace = null;
let hoveredCubelet = null;
const originalPositions = new Map(); // Store original positions for reset
const POP_DISTANCE = 0.3; // How far faces pop out
const ANIMATION_SPEED = 0.15; // Animation lerp speed

export function createCube() {
  cubesArray3D = [];
  // Clear the group
  cubeGroup.clear();
  scene.remove(cubeGroup);
  cubeGroup = new THREE.Group();
  
  for (let x = -1.1; x <= 1.1; x += 1.1) {
    let why = [];
    for (let y = -1.1; y <= 1.1; y += 1.1) {
      let zed = [];
      for (let z = -1.1; z <= 1.1; z += 1.1) {
        const c = createCubelet(x, y, z);
        zed.push(c);
        cubeGroup.add(c); // Add to group instead of scene directly
      }
      why.push(zed);
    }
    cubesArray3D.push(why);
  }
  scene.add(cubeGroup); // Add the group to scene
}

export function resetCubeObject() {
  scene.remove(cubeGroup);
  createCube();
}

///////////////////////////////////////////////////////////////////////////////////////
// FACE ROTATION HELPER FUNCTIONS (shared rotation behaviour for each axis)
///////////////////////////////////////////////////////////////////////////////////////

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
// HOVER EFFECTS
///////////////////////////////////////////////////////////////////////////////////////

// Handle mouse hover for face pop effects
export function handleHover(raycaster) {
  const intersects = raycaster.intersectObjects(cubeGroup.children, true);
  
  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;
    const face = intersects[0].face;
    
    // Determine which face of the cube is being hovered
    const faceDirection = getFaceDirection(face.normal, intersectedObject);
    const key = `${intersectedObject.uuid}_${faceDirection}`;
    
    if (hoveredFace !== key) {
      // Reset previous hover
      resetHover();
      
      // Apply new hover effect
      hoveredFace = key;
      hoveredCubelet = intersectedObject;
      
      // Check if it's the center square of a face
      if (isCenterSquare(intersectedObject, faceDirection)) {
        popOutEntireFace(faceDirection);
      } else {
        popOutSingleCubelet(intersectedObject, faceDirection);
      }
    }
  } else {
    // No intersection, reset hover
    resetHover();
  }
}

// Determine face direction based on normal vector
function getFaceDirection(normal, cubelet) {
  const worldNormal = normal.clone().transformDirection(cubelet.matrixWorld);
  const absNormal = {
    x: Math.abs(worldNormal.x),
    y: Math.abs(worldNormal.y),
    z: Math.abs(worldNormal.z)
  };
  
  if (absNormal.x > absNormal.y && absNormal.x > absNormal.z) {
    return worldNormal.x > 0 ? 'right' : 'left';
  } else if (absNormal.y > absNormal.x && absNormal.y > absNormal.z) {
    return worldNormal.y > 0 ? 'up' : 'down';
  } else {
    return worldNormal.z > 0 ? 'front' : 'back';
  }
}

// Check if the hovered cubelet is the center square of a face
function isCenterSquare(cubelet, faceDirection) {
  const position = new THREE.Vector3();
  cubelet.getWorldPosition(position);
  
  // Apply cube group transformations
  const localPos = position.clone().sub(cubeGroup.position);
  
  // Check if it's approximately at the center of a face
  const tolerance = 0.1;
  
  switch (faceDirection) {
    case 'front':
    case 'back':
      return Math.abs(localPos.x) < tolerance && Math.abs(localPos.y) < tolerance;
    case 'left':
    case 'right':
      return Math.abs(localPos.y) < tolerance && Math.abs(localPos.z) < tolerance;
    case 'up':
    case 'down':
      return Math.abs(localPos.x) < tolerance && Math.abs(localPos.z) < tolerance;
  }
  return false;
}

// Pop out entire face when hovering center square
function popOutEntireFace(faceDirection) {
  const facePosition = getFacePosition(faceDirection);
  const direction = getFaceNormal(faceDirection);
  
  cubesArray3D.forEach((layer, x) => {
    layer.forEach((row, y) => {
      row.forEach((cubelet, z) => {
        const worldPos = new THREE.Vector3();
        cubelet.getWorldPosition(worldPos);
        
        if (isOnFace(worldPos, faceDirection, facePosition)) {
          if (!originalPositions.has(cubelet.uuid)) {
            originalPositions.set(cubelet.uuid, cubelet.position.clone());
          }
          animateToPosition(cubelet, cubelet.position.clone().add(direction.multiplyScalar(POP_DISTANCE)));
        }
      });
    });
  });
}

// Pop out single cubelet
function popOutSingleCubelet(cubelet, faceDirection) {
  if (!originalPositions.has(cubelet.uuid)) {
    originalPositions.set(cubelet.uuid, cubelet.position.clone());
  }
  
  const direction = getFaceNormal(faceDirection);
  const targetPosition = cubelet.position.clone().add(direction.multiplyScalar(POP_DISTANCE * 0.5));
  animateToPosition(cubelet, targetPosition);
}

// Get face position based on direction
function getFacePosition(faceDirection) {
  switch (faceDirection) {
    case 'front': return 1.1;
    case 'back': return -1.1;
    case 'left': return -1.1;
    case 'right': return 1.1;
    case 'up': return 1.1;
    case 'down': return -1.1;
  }
}

// Get face normal vector
function getFaceNormal(faceDirection) {
  switch (faceDirection) {
    case 'front': return new THREE.Vector3(0, 0, 1);
    case 'back': return new THREE.Vector3(0, 0, -1);
    case 'left': return new THREE.Vector3(-1, 0, 0);
    case 'right': return new THREE.Vector3(1, 0, 0);
    case 'up': return new THREE.Vector3(0, 1, 0);
    case 'down': return new THREE.Vector3(0, -1, 0);
  }
}

// Check if position is on specific face
function isOnFace(worldPos, faceDirection, facePosition) {
  const tolerance = 0.1;
  
  switch (faceDirection) {
    case 'front':
    case 'back':
      return Math.abs(worldPos.z - facePosition) < tolerance;
    case 'left':
    case 'right':
      return Math.abs(worldPos.x - facePosition) < tolerance;
    case 'up':
    case 'down':
      return Math.abs(worldPos.y - facePosition) < tolerance;
  }
  return false;
}

// Animate cubelet to target position
function animateToPosition(cubelet, targetPosition) {
  // Simple lerp animation (this will be called each frame)
  cubelet.position.lerp(targetPosition, ANIMATION_SPEED);
}

// Reset all hover effects
function resetHover() {
  if (hoveredFace) {
    // Reset all cubelets to original positions
    originalPositions.forEach((originalPos, uuid) => {
      const cubelet = cubeGroup.children.find(child => child.uuid === uuid);
      if (cubelet) {
        animateToPosition(cubelet, originalPos);
        // Remove from original positions after a delay to allow animation
        setTimeout(() => originalPositions.delete(uuid), 500);
      }
    });
    
    hoveredFace = null;
    hoveredCubelet = null;
  }
}

// rotate x faces (R,L,M)
export function rotateXFace(xpos, rad) {
  let M = new THREE.Matrix4();
  M.makeRotationX(rad);
  let cubePos = new THREE.Vector3();
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
// rotate y faces (U, D)
export function rotateYFace(ypos, rad) {
  let M = new THREE.Matrix4();
  M.makeRotationY(rad);
  let cubePos = new THREE.Vector3();
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
// rotate z faces (F, B)
export function rotateZFace(zpos, rad) {
  let M = new THREE.Matrix4();
  M.makeRotationZ(rad);
  let cubePos = new THREE.Vector3();
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