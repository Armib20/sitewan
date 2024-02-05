function displayAction(reverse, keyPressed) {
    if (keyPressed === "") {
        toggleShowDirection(reverse);
    }
    else {
        const actionDisplay = document.getElementById("action-display");
        actionDisplay.textContent = ""; // reset the display
        var move = keyPressed;
        if (reverse === true) { // add apostrophe
            move = keyPressed + "'";
        }
        actionDisplay.textContent = move;

        setTimeout(() => {
            actionDisplay.textContent = '';
        }, 700); // display for 700ms
    }
}

// Takes a boolean and updates the toggle button to show the current direction
function toggleShowDirection(reverse) {
    const clockwiseIcon = document.getElementById("clockwise-icon");
    const counterClockwiseIcon = document.getElementById("counter-clockwise-icon");

    if (reverse === true) { // Hide clockwise icon and show counter-clockwise icon
        clockwiseIcon.style.display = "none";
        counterClockwiseIcon.style.display = "block";
    } else { // Hide counter-clockwise icon and show clockwise icon
        clockwiseIcon.style.display = "block";
        counterClockwiseIcon.style.display = "none";
    }
}