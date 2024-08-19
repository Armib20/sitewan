import modes from './modes.js';
import { face_animation_status, initMotions } from './face_rotation.js';
import { showAlert } from './canvas.js';

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
    if (modes.autoSolveMode === true) {
        return;
    }
    const clockwiseIcon = document.getElementById("clockwise-icon");
    const counterClockwiseIcon = document.getElementById("counter-clockwise-icon");

    clockwiseIcon.style.display = reverse ? "none" : "block";
    counterClockwiseIcon.style.display = reverse ? "block" : "none";
}

// Saves actions to local storage, so undo/redo can be implemented
// sessionStorage["keyEventHistory"] is already initialized and is a list of moves in Rubik notation (string)
// reverse is the most recent state of the reverse toggle, after the effects of the key event is applied
export function saveAction(reverse, keyPressed) {
    if (keyPressed === "1" || keyPressed === "2") {
        return; // don't save direction changes
    } else {
        var move = keyPressed;
        if (reverse === true) { // add apostrophe
            move = keyPressed + "'";
        }
        let historyString = sessionStorage.getItem("keyEventHistory");
        let history = historyString ? JSON.parse(historyString) : [];
        if (history.length > 10) // set a limit to the number of saved moves
            history.shift() // get rid of oldest move
        history.push(move)
        sessionStorage.setItem("keyEventHistory", JSON.stringify(history));
    }
}

// Undo the previous action by reversing the move
function undoLastMove() {
    if (modes.autoSolveMode === true) {
        console.log("Manual moves are disabled during autosolve mode.")
        return;
    }
    function reverseMove(move) {
        return move.endsWith("'") ? move.slice(0, -1) : move + "'";
    }
    let historyString = sessionStorage.getItem("keyEventHistory");
    if (!historyString) return; // nothing to undo
    let history = JSON.parse(historyString);
    if (history.length > 0) {
        var lastMove = history.pop();
        makeAutoMove(reverseMove(lastMove));
        sessionStorage.setItem("keyEventHistory", JSON.stringify(history));
    }
}
window.undoLastMove = undoLastMove;

// Helper function to toggle reverse and update motions
// Takes a boolean ifReverse and updates value of reverse variable
// If param is null, toggles to opposite of current state
export function setReverse(ifReverse = null) {
    modes.reverse = ifReverse === null ? !modes.reverse : ifReverse;
    initMotions();
    toggleShowDirection(modes.reverse);
}
window.setReverse = setReverse

///////////////////////////////////////////////////////////////////////////////////////
// LISTEN TO KEYBOARD
///////////////////////////////////////////////////////////////////////////////////////
const actionDuration = 100 // for setting a timeout to ensure that following actions do not conflict
const keyActions = {
    82: { // "R".charCodeAt()
      condition: () => !face_animation_status.up && !face_animation_status.down && !face_animation_status.front && !face_animation_status.back, // make sure other non-parallel faces are not currently being animated
      action: () => {
        face_animation_status.right = true; 
        return new Promise(resolve => setTimeout(resolve, actionDuration));
      }, // rotate right clockwise wrt x
      move: "R"
    },
    76: { // "L".charCodeAt()
      condition: () => !face_animation_status.up && !face_animation_status.down && !face_animation_status.front && !face_animation_status.back,
      action: () => {
        face_animation_status.left = true;
        return new Promise(resolve => setTimeout(resolve, actionDuration));
      }, // rotate left counterclockwise wrt x
      move: "L"
    },
    77: { // "M".charCodeAt()
      condition: () => !face_animation_status.up && !face_animation_status.down && !face_animation_status.front && !face_animation_status.back,
      action: () => {
        face_animation_status.mid = true;
        return new Promise(resolve => setTimeout(resolve, actionDuration));
      }, // rotate middle clockwise wrt x
      move: "M"
    },
    85: { // "U".charCodeAt()
      condition: () => !face_animation_status.right && !face_animation_status.left && !face_animation_status.mid && !face_animation_status.front && !face_animation_status.back,
      action: () => {
        face_animation_status.up = true;
        return new Promise(resolve => setTimeout(resolve, actionDuration));
      }, // rotate top clockwise wrt y
      move: "U"
    },
    68: { // "D".charCodeAt()
      condition: () => !face_animation_status.right && !face_animation_status.left && !face_animation_status.mid && !face_animation_status.front && !face_animation_status.back,
      action: () => {
        face_animation_status.down = true;
        return new Promise(resolve => setTimeout(resolve, actionDuration));
      }, // rotate bottom counterclockwise wrt y
      move: "D"
    },
    70: { // "F".charCodeAt()
      condition: () => !face_animation_status.up && !face_animation_status.down && !face_animation_status.right && !face_animation_status.left && !face_animation_status.mid,
      action: () => {
        face_animation_status.front = true;
        return new Promise(resolve => setTimeout(resolve, actionDuration));
      }, // rotate front clockwise wrt z
      move: "F"
    },
    66: { // "B".charCodeAt()
      condition: () => !face_animation_status.up && !face_animation_status.down && !face_animation_status.right && !face_animation_status.left && !face_animation_status.mid,
      action: () => {
        face_animation_status.back = true;
        return new Promise(resolve => setTimeout(resolve, actionDuration));
      }, // rotate back counterclockwise wrt z
      move: "B"
    },
    49: { // "1".charCodeAt()
      action: () => { setReverse(false); return Promise.resolve(); },
    },
    50: { // "2".charCodeAt()
      action: () => { setReverse(true); return Promise.resolve(); },
    },
    17: { action: () => Promise.resolve() }, // "ctrl".charCodeAt()
    90: { action: () => Promise.resolve() } // "z".charCodeAt()
};
  
let lastKeyTime = 0;
const keyCooldown = 100;
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (!keyActions[keyCode]) return; // ignore non-relevant keys

    // Enforce cooldown period except for key combinations with ctrl, or 1 and 2 (direction change)
    const currentTime = Date.now();
    if (!event.ctrlKey && keyCode != 49 && keyCode != 50 && (currentTime - lastKeyTime < keyCooldown)) {
        showAlert("Too quick!", "Calm down buddy, you won't break a world record here...");
        return;
    }
    lastKeyTime = currentTime;
    // Ignore manual moves when in autosolve mode
    if (modes.autoSolveMode === true) {
        showAlert("In autosolve mode:", "manual moves are temporarily disabled.");
        return;
    }
    const { condition, action, move } = keyActions[keyCode];
    // special combo for undo: ctrl+z
    if (event.ctrlKey && keyCode == 90) undoLastMove();
    // update animation status if condition is not defined (i.e. for direction changes) or is satisfied
    if (condition == null) action();
    else if (condition() === true) { 
        action();
        displayAction(modes.reverse, move);
        saveAction(modes.reverse, move);
    }
};
document.addEventListener("keydown", onDocumentKeyDown, false);

// Called by the autosolver / undo/redo. 
// Takes in move (string) in Rubik's notation, both forward and reverse e.g. R, R'
export async function makeAutoMove(move) {
    const previousReverseMode = modes.reverse;
    // if move contains apostrophe, reverse direction
    if (move.charAt(1) === "'") setReverse(true);
    else setReverse(false);
  
    const keyCode = move.charAt(0).charCodeAt()
    if (keyActions[keyCode]) {
      const { condition, action } = keyActions[keyCode];
      if (!condition || condition()) {
          await action();
      }
    } else console.log("Invalid move: " + move);
    setReverse(previousReverseMode); // Restore previous state after delay for animation to complete
}
