var view = {
    displayMessage: function (msg) {
        "use strict";
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function (location) {
        "use strict";
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function (location) {
        "use strict";
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [{locations: ["06", "16", "26"], hits: ["", "", ""]},
        {locations: ["24", "34", "44"], hits: ["", "", ""]},
        {locations: ["10", "11", "12"], hits: ["", "", ""]}],

    fire: function (guess) {
        "use strict";

        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("TRAFIONY!");
                if (this.isSunk(ship)) {
                    view.displayMessage("Zatopiłeś mój okręt!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("Spudłowałeś!");
        return false;
    },
    isSunk: function (ship) {
        "use strict";

        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
            return true;
        }
    },
    generateShipLocations: function () {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
                this.ships[i].locations = locations;
            }
        },
    generateShip: function () {
        var direction = Math.floor(Math.random() * 2);
        var row, col;
        if (direction === 1) {
            row = Math.random() * this.boardSize;
            col = Math.random() * (this.boardSize - this.shipLength);
        } else {
            row = Math.random() * (this.boardSize - this.shipLength);
            col = Math.random() * this.boardSize;
        }
        var newShipLocations = [];

        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    }
};

var controller = {
        guesses: 0,

        processGuess: function (guess) {
            "use strict";
            var location = parseGuess(guess);
            if (location) {
                this.guesses++;
                var hit = model.fire(location);
                if (hit && model.shipsSunk === model.numShips) {
                    view.displayMessage("Zatopiłeś wszystkie moje okręty, w " + this.guesses + "próbach.");
                }
            }

        }
    }
;

function parseGuess(guess) {
    "use strict";
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if (guess === null || guess.length !== 2) {
        alert("Proszę wpisać literę i cyfrę");
    } else {
        var firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert("To nie są współrzędne!");
        } else if (row < 0 || row > model.boardSize || column < 0 || column > model.boardSize) {
            alert("Pole poaza planszą");
        } else {
            return row + column;
        }
        return null;
    }
}

function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;

    controller.processGuess(guess);

    guessInput.value = "";
}

function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
}

window.onload = init;