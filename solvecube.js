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