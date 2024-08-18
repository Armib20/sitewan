import modes from "./modes.js";
import { cubesArray3D } from "./rubik.js";

///////////////////////////////////////////////////////////////////////////////////////
// ANIMATION RELATED VARIABLES
///////////////////////////////////////////////////////////////////////////////////////
export const face_animation_status = {
    right: false,
    left: false,
    mid: false,
    up: false,
    down: false,
    front: false,
    back: false
};
// functions to call to update transformation matrices
// avars=[xpos (x world coordinate for cubelets on the face), theta (rad amount to rotate by), face_animation_status]
function rotateRFace(avars) {
    face_animation_status.right = avars[2];
    rotateXFace(avars[0], avars[1]);
}
function rotateLFace(avars) {
    face_animation_status.left = avars[2];
    rotateXFace(avars[0], avars[1]);
}
function rotateMFace(avars) {
    face_animation_status.mid = avars[2];
    rotateXFace(avars[0], avars[1]);
}
function rotateUFace(avars) {
    face_animation_status.up = avars[2];
    rotateYFace(avars[0], avars[1]);
}
function rotateDFace(avars) {
    face_animation_status.down = avars[2];
    rotateYFace(avars[0], avars[1]);
}
function rotateFFace(avars) {
    face_animation_status.front = avars[2];
    rotateZFace(avars[0], avars[1]);
}
function rotateBFace(avars) {
    face_animation_status.back = avars[2];
    rotateZFace(avars[0], avars[1]);
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

// rotate x faces (R,L,M)
function rotateXFace(xpos, rad) {
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
function rotateYFace(ypos, rad) {
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
function rotateZFace(zpos, rad) {
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

///////////////////////////////////////////////////////////////////////////////////////
// KEYFRAME ANIMATIONS FOR EACH FACE ROTATION
///////////////////////////////////////////////////////////////////////////////////////

// Motion-related variables
export const motions = {
    right: null,
    left: null,
    mid: null,
    up: null,
    down: null,
    front: null,
    back: null
};

export function initMotions() {
  let theta = Math.PI / 8;
  if (modes.reverse) theta = -theta;
  motions.right = new Motion(rotateRFace);
  motions.left = new Motion(rotateLFace);
  motions.mid = new Motion(rotateMFace);
  motions.up = new Motion(rotateUFace);
  motions.down = new Motion(rotateDFace);
  motions.front = new Motion(rotateFFace);
  motions.back = new Motion(rotateBFace);
  // keyframes for motion: name, time, avars=[xpos, theta (rad), face_animation_status]
  motions.right.addKeyFrame(new Keyframe('beg', 0.0, [1.1, 0, true]));
  motions.right.addKeyFrame(new Keyframe('beg', 0.2, [1.1, -theta, true]));
  motions.right.addKeyFrame(new Keyframe('mid', 0.4, [1.1, -theta, true]));
  motions.right.addKeyFrame(new Keyframe('end', 0.6, [1.1, 0, false]));

  motions.left.addKeyFrame(new Keyframe('beg', 0.0, [-1.1, 0, true]));
  motions.left.addKeyFrame(new Keyframe('beg', 0.2, [-1.1, theta, true]));
  motions.left.addKeyFrame(new Keyframe('mid', 0.4, [-1.1, theta, true]));
  motions.left.addKeyFrame(new Keyframe('end', 0.6, [-1.1, 0, false]));

  motions.mid.addKeyFrame(new Keyframe('beg', 0.0, [0, 0, true]));
  motions.mid.addKeyFrame(new Keyframe('beg', 0.2, [0, -theta, true]));
  motions.mid.addKeyFrame(new Keyframe('mid', 0.4, [0, -theta, true]));
  motions.mid.addKeyFrame(new Keyframe('end', 0.6, [0, 0, false]));

  motions.up.addKeyFrame(new Keyframe('beg', 0.0, [1.1, 0, true]));
  motions.up.addKeyFrame(new Keyframe('beg', 0.2, [1.1, -theta, true]));
  motions.up.addKeyFrame(new Keyframe('mid', 0.4, [1.1, -theta, true]));
  motions.up.addKeyFrame(new Keyframe('end', 0.6, [1.1, 0, false]));

  motions.down.addKeyFrame(new Keyframe('beg', 0.0, [-1.1, 0, true]));
  motions.down.addKeyFrame(new Keyframe('beg', 0.2, [-1.1, theta, true]));
  motions.down.addKeyFrame(new Keyframe('mid', 0.4, [-1.1, theta, true]));
  motions.down.addKeyFrame(new Keyframe('end', 0.6, [-1.1, 0, false]));

  motions.front.addKeyFrame(new Keyframe('beg', 0.0, [1.1, 0, true]));
  motions.front.addKeyFrame(new Keyframe('beg', 0.2, [1.1, -theta, true]));
  motions.front.addKeyFrame(new Keyframe('mid', 0.4, [1.1, -theta, true]));
  motions.front.addKeyFrame(new Keyframe('end', 0.6, [1.1, 0, false]));

  motions.back.addKeyFrame(new Keyframe('beg', 0.0, [-1.1, 0, true]));
  motions.back.addKeyFrame(new Keyframe('beg', 0.2, [-1.1, theta, true]));
  motions.back.addKeyFrame(new Keyframe('mid', 0.4, [-1.1, theta, true]));
  motions.back.addKeyFrame(new Keyframe('end', 0.6, [-1.1, 0, false]));
}

initMotions();