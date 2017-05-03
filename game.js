/**
 * Created by baultik on 11/30/16.
 */
var cellState = {
    stateDefault:"stateDefault",
    stateX:"X",
    stateO:"O"
};
var game = null;
var playerone = 0;
var playertwo = 0;
$(document).ready(setupGame);

/**
 * Main entry point. Create game object and set up event handlers
 */
function setupGame() {
    game = new Game();
    game.initGame(3);

    $(".reset").click(game.resetGame);
    $(".threeXthree").click(function () {
        game.newGame(3);
    });

    $(".fiveXfive").click(function () {
        game.newGame(5);
    });

    $(".start").click(game.startGame);

    var imageSrc1 = 'image/cursor.png';
    var imageSrc2 = 'image/cursor.png';
    initialize(imageSrc1,25,25,imageSrc2, 25, 25, 1.2 );
    var audio = {};
    audio["dataline"] = new Audio();
    audio["dataline"].src = "mp3/dataline.mp3";  //audio file source
    audio["dataline"].play(); //audio file play
}
/**
 * Click handler for all cell objects
 */
function handleCellClick() {
    if (!game.inPlay) return;
    var cell = game.getGameBoard().getCell(this);
    if (cell.getState() === cellState.stateDefault) {
        var player = game.getCurrentPlayer();
        cell.setState(player.symbol);
        game.switchPlayer();
        game.checkWin(cell);
        var audio = {};
        audio["dataline"] = new Audio();
        audio["dataline"].src = "mp3/zg_btn_sm1.wav";  //audio file source
        audio["dataline"].play(); //audio file play
    }
}
/**
 * Leap motion events call this function
 * @param x The x coordinate of the event
 * @param y The y coordinate of the event
 */
function pointerTapped(x,y) {
    var element = document.elementFromPoint(x,y);
    var cell = game.getGameBoard().getCell(element);

    //Call same function as the click handlers if pointed at a clickable element
    if (cell !== null) {
        handleCellClick.call(element);
    } else if (element === $(".reset")[0]){
        game.resetGame();
    } else if (element === $(".threeXthree")[0]){
        game.newGame(3)
    } else if (element === $(".fiveXfive")[0]){
        game.newGame(5);
    } else if (element === $(".start")[0]){
        game.startGame();
    }
}
/**
 * Main game constructor. Sets up and resets the game board, checks for win conditions and handles the timer
 * @constructor
 */
function Game() {
    var mGameBoard = null;
    var mPlayers = [];
    var mCurrentPlayer = 0;
    var mSize = 0;
    var mMoves = 0;
    var self = this;
    this.inPlay = false;
    var timer = null;
    var startTime;
    var timerCount = 0;
    var progressBar = $(".progress-bar");
    /**
     * Initialize the game to a default state
     * @param size The size of the board. The board in this case is always a square
     */
    this.initGame = function (size) {
        //create game board
        mPlayers = [];
        mSize = size;
        mMoves = 0;
        mGameBoard = new GameBoard();
        mGameBoard.initGameBoard(size,size);
        self.inPlay = false;
        self.clearBoard = true;

        //create players
        var player1 = new Player(0,cellState.stateX);
        var player2 = new Player(1,cellState.stateO);

        mPlayers.push(player1,player2);

        //Add click handlers to newly created cells
        $(".cell").click(handleCellClick);
        $(".cell5x5").click(handleCellClick);
    };
    /**
     * Game board object accessor function
     * @returns {*} The game board
     */
    this.getGameBoard = function () {
        return mGameBoard;
    };
    /**
     * Gets the current player object
     * @returns {*} The current player object
     */
    this.getCurrentPlayer = function() {
        return mPlayers[mCurrentPlayer];
    };
    /**
     * Switches from one to the next when a turn occurs or the timer times out
     */
    this.switchPlayer = function () {
        var player = mCurrentPlayer + 1;
        if (player >= mPlayers.length) {
            player = 0;
        }
        setPlayer(player);
    };
    /**
     * Set the current player
     * @param player The new current player
     */
    function setPlayer(player) {
        mCurrentPlayer = player;
        //Set the classes to show who the current player is
        if (player==0){
            $('.player1').addClass('highlightCurrentPlayer');
            $('.player2').removeClass('highlightCurrentPlayer');
        }
        else if(player==1){
            $('.player2').addClass('highlightCurrentPlayer');
            $('.player1').removeClass('highlightCurrentPlayer');
        }
    }

    /**
     * Get the size of the board
     * @returns {number} The size of the board
     */
    this.getSize = function () {
        return mSize;
    };
    /**
     * Check after every move if a player as won or no one has won
     * @param cell The cell just clicked
     */
    this.checkWin = function (cell) {
        //Keeping track of moves
        mMoves++;

        //Get what row and column the cell is currently in
        var index = cell.getCellID();
        var row = Math.floor(index/mSize);
        var col = index % mSize;

        //Using counter - not a great solution but it works
        var matchX = 0;
        var matchO = 0;

        //check row the cell that was clicked is in
        for (var i = 0; i < mSize; i++) {
            var checkCell = mGameBoard.getCellByID(row * mSize + i);
            if (checkCell.getState() === cellState.stateX) {
                matchX++;
            }else if (checkCell.getState() === cellState.stateO) {
                matchO++;
            }
        }

        //Check for win
        if (doWin(matchX,matchO)) return;

        //Reset counters
        matchX = 0;
        matchO = 0;

        //check column the cell that was clicked is in
        for (var i = 0; i < mSize; i++) {
            var checkCell = mGameBoard.getCellByID(i * mSize + col);
            if (checkCell.getState() === cellState.stateX) {
                matchX++;
            }else if (checkCell.getState() === cellState.stateO) {
                matchO++;
            }
        }
        //Check for win
        if (doWin(matchX,matchO)) return;
        //Reset counters
        matchX = 0;
        matchO = 0;

        //Check diagonals
        for (var i = 0, j = 0; i < mSize; i++, j++) {
            var checkCell = mGameBoard.getCellByID(i * mSize + j);
            if (checkCell.getState() === cellState.stateX) {
                matchX++;
            }else if (checkCell.getState() === cellState.stateO) {
                matchO++;
            }
        }
        //Check for win
        if (doWin(matchX,matchO)) return;
        //Reset counters
        matchX = 0;
        matchO = 0;
        //Check other diagonal
        for (var i = 0, j = mSize - 1; i < mSize; i++, j--) {
            var checkCell = mGameBoard.getCellByID(i * mSize + j);
            if (checkCell.getState() === cellState.stateX) {
                matchX++;
            }else if (checkCell.getState() === cellState.stateO) {
                matchO++;
            }
        }
        //Check for win
        if (doWin(matchX,matchO)) return;

        //No winnner  if all moves have been made
        if (mMoves == mSize*mSize) {
            $(".modal-title").text("No Winner");
            $('#modalWin').modal('show');
            finishGame();
        }

        //Other wise - game is still in progress - reset the timer
        resetTimer();
    };
    /**
     * Check if there is a winner and who that winner is
     * @param matchX Number of X's in the elements that are being checked
     * @param matchO Number of O's in the elements that are being checked
     * @returns {boolean} Whether there is a winner or not
     */
    function doWin(matchX,matchO) {
        if (matchX == mSize) {
            playerone = playerone + 1;
            document.querySelector('.wincount1').innerHTML = playerone;
            $(".modal-title").text("Player 1 Wins");
            $('#modalWin').modal('show');
            finishGame();
            return true;
        } else if (matchO == mSize) {
            playertwo = playertwo + 1;
            document.querySelector('.wincount2').innerHTML = playertwo;
            $(".modal-title").text("Player 2 Wins");
            $('#modalWin').modal('show');
            finishGame();
            return true;
        }
        return false;
    }

    /**
     * Game is over. Reset UI elements and forbid clicks
     */
    function finishGame() {
        $('.player1').removeClass('highlightCurrentPlayer');
        $('.player2').removeClass('highlightCurrentPlayer');
        clearTimer();
        self.inPlay = false;
    }

    /**
     * Start button pressed. Only works if the game is in an unstarted state
     */
    this.startGame = function () {
        if (self.clearBoard) {
            setPlayer(0);
            self.clearBoard = false;
            self.inPlay = true;
            startTimer();
            var audio = {};
            audio["walk"] = new Audio();
            audio["walk"].src = "mp3/11408^LASER1.mp3";  //audio file source
            audio["walk"].play(); //audio file play
        }
    };
    /**
     * Starts a timer when the game starts
     */
    function startTimer() {
        startTime = Date.now();
        timer = setTimeout(updateProgress,100);
    }

    /**
     * Reset the timer to a default state
     */
    function resetTimer() {
        startTime = Date.now();
        progressBar.css("width","0%");
        timerCount = 0;
    }

    /**
     * Update timer progress. This is a recursive function that exits after a specified number of times
     */
    function updateProgress() {
        if (timerCount == 50) {
            resetTimer();
            self.switchPlayer();
        } else {
            timerCount++;
            var percent = Math.floor(((Date.now() - startTime) / 5000) * 100);
            progressBar.css("width",percent+"%");
        }

        timer = setTimeout(updateProgress,100);
    }

    /**
     * Clear the current timer
     */
    function clearTimer() {
        timerCount = 0;
        clearTimeout(timer);
        timer = null;
        progressBar.css("width","0%");
    }

    /**
     * Reset the game
     */
    this.resetGame = function () {
        //setPlayer(0);
        //mGameBoard.resetBoard();
        self.newGame(mSize);
    };
    /**
     * Make a new game
     * @param size The size of the board
     */
    this.newGame = function(size) {
        finishGame();
        self.clearBoard = true;
        $(".row").detach();
        $(".row5x5").detach();
        game.initGame(size);
        var audio = {};
        audio["resetLaser"] = new Audio();
        audio["resetLaser"].src = "mp3/reset_laser.mp3";  //audio file source
        audio["resetLaser"].play(); //audio file play
    }
}
/**
 * Game board constructor. Game board holds the cells
 * @constructor
 */
function GameBoard() {
    var mCells = [];
    var mRows = 0;
    var mCols = 0;
    var mCellsElement = $(".game_board");
    var mRowElements = [];
    /**
     * Initialize game board
     * @param rows Number of rows
     * @param cols Number of columns
     */
    this.initGameBoard = function(rows,cols) {
        mRows = rows;
        mCols = cols;

        //create cell objects for size of board - use dom elements for count
        for (var i = 0; i < mRows*mCols; i++) {
            var cell = this.createCell(i);
            mCells.push(cell);

            //Make a new row
            if (!(i % cols)) {
                mRowElements.push(createRowElement());
            }

            //Add cells to row
            var currentRow = mRowElements[mRowElements.length - 1];
            currentRow.append(cell.getCellElement());
        }

        //Append rows to game board in dom
        for (var j in mRowElements) {
            mCellsElement.append(mRowElements[j]);
        }
    };
    /**
     * Create a cell
     * @param cellID The index of the cell
     * @returns {Cell} The new cell object
     */
    this.createCell = function (cellID) {
        return new Cell(cellID);
    };
    /**
     * Get a cell by element. Can pass in this as an argument
     * @param cellElement The element to match with a cell object
     * @returns {*} The cell object that matches or null
     */
    this.getCell = function (cellElement) {
        //get cell by element clicked - cell has element var
        for (var i in mCells) {
            if (cellElement === mCells[i].getCellElement()[0]) {
                return mCells[i];
            }
        }
        return null;
    };
    /**
     * Get cell by index
     * @param id The index of the cell
     * @returns {*} The cell that matches the index or undefined
     */
    this.getCellByID = function (id) {
      return mCells[id];
    };

    // this.resetBoard = function () {
    //     for (var i in mCells) {
    //         mCells[i].setState(cellState.stateDefault);
    //     }
    // };
    /**
     * Create a row element with jQuery. Rows contain cell elements
     * @returns {*|jQuery|HTMLElement} The new row element
     */
    function createRowElement() {
        var rowClass = "row";
        if (game.getSize() === 5) rowClass = "row5x5";
        return $("<div>",{
            class:rowClass
        })
    }
}
/**
 * The cell constructor
 * @param cellID The index of the cell
 * @constructor
 */
function Cell(cellID) {
    var mState = cellState.stateDefault;
    var mCellID = cellID;
    var cellClass = "cell";
    if (game.getSize() === 5) cellClass = "cell5x5";
    var mCellElement = $("<div>",{
        class:cellClass
    });
    /**
     * Gets the current state of the cell
     * @returns {string} The current state
     */
    this.getState = function () {
        return mState;
    };
    /**
     * Set the state of the cell to blank, X, or O
     * @param state The new state
     */
    this.setState = function (state) {
        mState = state;
        if (mState === cellState.stateX) {
            $(mCellElement).text("X");
        } else if (mState === cellState.stateO) {
            $(mCellElement).text("O");
        } else {
            $(mCellElement).text(" ");
        }
    };
    /**
     * Get the index of the cell
     * @returns {*} The index of the cell
     */
    this.getCellID = function () {
        return mCellID;
    };
    /**
     * Get the jQuery DOM element for the cell
     * @returns {*|jQuery|HTMLElement} The cell jQuery DOM element
     */
    this.getCellElement = function () {
        return mCellElement;
    }
}
/**
 * Player object
 * @param id Player ID
 * @param symbol The symbol of the player - one of the cell state properties
 * @constructor
 */
function Player(id,symbol) {
    this.playerID = id;
    this.symbol = symbol;
}
