function animateSolution() {
    document.getElementById("solve-button").disabled = true;
    const solutionDisplay = document.getElementById("solution-display");
    solution = ['D2', "R'", "D'", 'F2', 'B', 'D', 'R2', 'D2', "R'", 'F2', "D'", 'F2', "U'", 'B2', 'L2', 'U2', 'D', 'R2', 'U'];
    sol = ['D', 'D', '2', 'R', '1', '2', 'D', '1', 'F', 'F', 'B', 'D', 'R', 'R', 'D', 'D', '2', 'R', '1', 'F', 'F', '2', 'D', '1', 'F', 'F', '2', 'U', '1', 'B', 'B', 'L', 'L', 'U', 'U', 'D', 'R', 'R', 'U'];
    let index = 0;
    let mi = 0; // the index in the moves in the solution, not the transformed one
    function nextMove() {
        if (index < sol.length) {
            const move = sol[index];
            updateMove(move);
            // since '1' and '2' indicate forward/reverse direction changes and not a face turn
            // do not require pause for those moves
            if (move === '1' || move === '2') {
                setTimeout(nextMove, 0);
            } else if (index < sol.length-1 && move === sol[index+1]) { // double rotations can be done quicker
                solutionDisplay.textContent += " " + solution[mi];
                mi++; 
                setTimeout(nextMove, 300);
            } else {
                if (index > 0 && move !== sol[index-1]) { // only write down the move if it's not the second part of a double
                    solutionDisplay.textContent += " " + solution[mi];
                    mi++;
                }
                setTimeout(nextMove, 500);
            }
            index++;
        } else {
            document.getElementById("solve-button").disabled = false;
        }
    }
    nextMove();   
}

function viewPos() {
//    for (let i = 18; i < 27; i++) {
//        console.log(cubesArray1D[i].userData.materials[0].color.getHexString());
//    }

    for (x = 0; x < 3; x++) {
        for (y = 0; y < 3; y++) {
            for (z = 0; z < 3; z++) {
                const worldPosition = new THREE.Vector3();
                cubesArray3D[x][y][z].getWorldPosition( worldPosition );
                console.log(worldPosition);
            }
        }
    }
}

// returns the cube definition string for the current state (see https://pypi.org/project/kociemba/)
function getDefinitionString() {
    var listres = [];

}

// (U, R, F, D, L, B)
// key: (x,y,z) tuple of floats
// val: indices[] list of ints
var coordIndexMap = {};
var numZeros;
for (var x = -1.1; x <= 1.1; x += 1.1) {
    for (var y = -1.1; y <= 1.1; y += 1.1) {
        for (var z = -1.1; z <= 1.1; z += 1.1) {
            // list of faces (multipliers)
            facesPos = [];
            // e.g. x === -1.1 --> L --> index 4 in faces list (positions 4*9:5*9)
            if (x === -1.1) facesPos.push(4);
            if (y === -1.1) facesPos.push(3);
            if (z === -1.1) facesPos.push(5);
            if (x === 1.1) facesPos.push(1);
            if (y === 1.1) facesPos.push(0);
            if (z === 1.1) facesPos.push(2);
            
            // position on face
            numZeros = 0;
            if (x === 0) numZeros++;
            if (y === 0) numZeros++;
            if (z === 0) numZeros++;

            indices = [];
            if (numZeros === 2) { // center
                indices.push(facesPos[0]*9+5);
            } else if (numZeros === 1) { // edge
                facesPos.forEach(f => {
                    //indices.append(0);
                });
            } else { // corner
                //
            }
            coordIndexMap[(x,y,z)] = indices;
        }
    }
}