
/**
 * Created by Patrick on 11/30/2016.
 */


/*tag each cell with a score value*/
/* add to board setup*/

var cell;
var score;
    function scorecell() {
        for (n=0; n<size-1; n++) {
        cell[0].indicator = indicator;
        cell.click(set);
        row.append(cell);
        squares.push(cell);
        indicator += indicator;
        }
    }

/* how to tell if a win*/
var moves;
var scoretotal = [7, 56, 73, 84, 146, 273, 292, 448];
    function winsmall() {
        for (i=0; i<scoretotal.length; i++) {
            if (playone = scoretotal[i]) {
                return "X won!";
            } else if (playtwo = scoretotal[i]) {
                return "O won!";
            } else if (moves = 9) {
                return "It's a tie.";
            } else {
            return;
        }
        }
    }

var cell;
var score;
    function scorecell() {
        for (n=0; n<size-1; n++) {
        cell[0].indicator = indicator;
        cell.click(set);
        row.append(cell);
        squares.push(cell);
        indicator += indicator;
        }
    }

/* how to tell if a win*/
var moves;
var scoretotal = [7, 56, 73, 84, 146, 273, 292, 448];
    function winsmall() {
        for (i=0; i<scoretotal.length; i++) {
            if (playone = scoretotal[i]) {
                return "X won!";
            } else if (playtwo = scoretotal[i]) {
                return "O won!";
            } else if (moves = 9) {
                return "It's a tie.";
            } else {
            return;
        }
        }
    }

/*if on a 5x5 grid*/

var combos = [[0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22], [3,8,13,18,23], [4,9,14,19,24], [0,6,12,18,24], [0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24], [4,8,12,16,20]];
    function winbig() {
        for (i in combos) {
            var pattern = combos[i];
            var p = this.board[pattern[0]] + this.board[pattern[5]] + this.board[pattern[10]] + this.board[pattern[15]] + this.board[pattern[20]];
            if (y === "XXXXX") {
                return "X won!";
            } else if (y === "OOOOO") {
                return "O won!";
            } else if (moves = 25) {
                return ("It's a tie.");
            } else {
                return;
            }
        }

        $(document).ready(function () {

            var symbol = ["X", "O"];

            function Player(id, symbol) {
                this.id = id;
                this.symbol = symbol;
            }

            var player1 = new Player();
            var player2 = new Player();


            $(".cell").click(function () {
                console.log("A Cell was clicked");
                var cell = $(".cell");
                for (var i = 0; i < cell.length; i++) {
                    var currentCell = cell[i];
                    if (currentCell === this && player1) {
                        console.log(i);
                        $(this).text(symbol[0]);
                    }
                    else if (player2) {
                        $(this).text(symbol[1]);
                    }

                }
            });


            $("button").click(function () {
                console.log("Button was clicked");
                var button = $("button");

                if (this.hasClass('threeXthree')) {
                    console.log("3x3 button was clicked");
                }
                else if (this.hasClass('fiveXfive')) {
                    console.log("5x5 button was clicked");
                }
                else {
                    console.log("Reset button was clicked");
                }

            });

        });
    }

