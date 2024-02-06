// Takes reverse boolean and keyPressed string and displays the action in Rubik's notation
function displayAction(reverse, keyPressed) {
    const actionDisplay = document.getElementById("action-display");
        actionDisplay.textContent = ""; // reset the display
        var move = keyPressed;
        if (reverse === true) { // add apostrophe
            move = keyPressed + "'";
        }
        actionDisplay.textContent = move;

        setTimeout(() => {
            actionDisplay.textContent = "";
        }, 700); // display for 700ms
}

// Takes a boolean and updates the toggle button to show the current direction
function toggleShowDirection(reverse) {
    const clockwiseIcon = document.getElementById("clockwise-icon");
    const counterClockwiseIcon = document.getElementById("counter-clockwise-icon");

    clockwiseIcon.style.display = reverse ? "none" : "block";
    counterClockwiseIcon.style.display = reverse ? "block" : "none";
}

// Saves actions to local storage, so undo/redo can be implemented
// sessionStorage["keyEventHistory"] is already initialized and is a list of moves in Rubik notation (string)
// reverse is the most recent state of the reverse toggle, after the effects of the key event is applied
function saveAction(reverse, keyPressed) {
    if (keyPressed === "1" || keyPressed === "2") {
        return; // don't save direction changes
    } else {
        var move = keyPressed;
        if (reverse === true) { // add apostrophe
            move = keyPressed + "'";
        }
        let historyString = sessionStorage.getItem("keyEventHistory");
        let history = historyString ? JSON.parse(historyString) : [];
        history.push(move)
        sessionStorage.setItem("keyEventHistory", JSON.stringify(history));
    }
}

function undoLastMove() {
    const reverseMap = {
        "R": "R'",
        "R'": "R",
        "L": "L'",
        "L'": "L",
        "M": "M'",
        "M'": "M",
        "U": "U'",
        "U'": "U",
        "D": "D'",
        "D'": "D",
        "F": "F'",
        "F'": "F",
        "B": "B'",
        "B'": "B",
    };
    let historyString = sessionStorage.getItem("keyEventHistory");
    if (!historyString) return; // nothing to undo

    let history = JSON.parse(historyString);
    if (history.length > 0) {
        var lastMove = history.pop();
        updateMove(reverseMap[lastMove]);
        sessionStorage.setItem("keyEventHistory", JSON.stringify(history));
    }
    console.log(sessionStorage.getItem("keyEventHistory"));
}