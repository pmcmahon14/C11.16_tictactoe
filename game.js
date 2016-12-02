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

    var imageSrc1 = 'img/cursor.png';
    var imageSrc2 = 'img/cursor.png';
    initialize(imageSrc1,25,25,imageSrc2, 25, 25,1.2);
}

function handleCellClick() {
    if (!game.inPlay) return;
    var cell = game.getGameBoard().getCell(this);
    if (cell.getState() === cellState.stateDefault) {
        var player = game.getCurrentPlayer();
        cell.setState(player.symbol);
        game.switchPlayer();
        game.checkWin(cell);
    }
    //console.log("clicked");
}

function pointerTapped(x,y) {
    var element = document.elementFromPoint(x,y);
    var cell = game.getGameBoard().getCell(element);

    if (cell !== null) {
        //console.log("pointer clicked cell",cell);
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


    console.log("pointer tapped x:" + x + " y: " + y,element);
}

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

        $(".cell").click(handleCellClick);
        $(".cell5x5").click(handleCellClick);
    };

    this.getGameBoard = function () {
        return mGameBoard;
    };

    this.getCurrentPlayer = function() {
        return mPlayers[mCurrentPlayer];
    };

    this.switchPlayer = function () {
        var player = mCurrentPlayer + 1;
        if (player >= mPlayers.length) {
            player = 0;
        }
        setPlayer(player);
    };

    function setPlayer(player) {
        mCurrentPlayer = player;
        //console.log("current player is ",self.getCurrentPlayer());
        if (player==0){
            $('.player1').addClass('highlightCurrentPlayer');
            $('.player2').removeClass('highlightCurrentPlayer');
        }
        else if(player==1){
            $('.player2').addClass('highlightCurrentPlayer');
            $('.player1').removeClass('highlightCurrentPlayer');
        }
    }

    this.getSize = function () {
        return mSize;
    };

    this.checkWin = function (cell) {
        mMoves++;

        var index = cell.getCellID();
        var row = Math.floor(index/mSize);
        var col = index % mSize;

        var matchX = 0;
        var matchY = 0;

        //check row
        for (var i = 0; i < mSize; i++) {
            var checkCell = mGameBoard.getCellByID(row * mSize + i);
            if (checkCell.getState() === cellState.stateX) {
                matchX++;
            }else if (checkCell.getState() === cellState.stateO) {
                matchY++;
            }
        }

        if (doWin(matchX,matchY)) return;

        matchX = 0;
        matchY = 0;

        //check column
        for (var i = 0; i < mSize; i++) {
            var checkCell = mGameBoard.getCellByID(i * mSize + col);
            if (checkCell.getState() === cellState.stateX) {
                matchX++;
            }else if (checkCell.getState() === cellState.stateO) {
                matchY++;
            }
        }

        if (doWin(matchX,matchY)) return;

        matchX = 0;
        matchY = 0;

        for (var i = 0, j = 0; i < mSize; i++, j++) {
            var checkCell = mGameBoard.getCellByID(i * mSize + j);
            if (checkCell.getState() === cellState.stateX) {
                matchX++;
            }else if (checkCell.getState() === cellState.stateO) {
                matchY++;
            }
        }

        if (doWin(matchX,matchY)) return;

        matchX = 0;
        matchY = 0;

        for (var i = 0, j = mSize - 1; i < mSize; i++, j--) {
            var checkCell = mGameBoard.getCellByID(i * mSize + j);
            if (checkCell.getState() === cellState.stateX) {
                matchX++;
            }else if (checkCell.getState() === cellState.stateO) {
                matchY++;
            }
        }

        if (doWin(matchX,matchY)) return;

        if (mMoves == mSize*mSize) {
            console.log("No Winner");
            $(".modal-title").text("No Winner");
            $('#modalWin').modal('show');
            finishGame();
        }

        resetTimer();
    };

    function doWin(matchX,matchY) {
        if (matchX == mSize) {
            console.log("Player 1 wins");
            playerone = playerone + 1;
            document.querySelector('.wincount1').innerHTML = playerone;
            $(".modal-title").text("Player 1 Wins");
            $('#modalWin').modal('show');
            finishGame();
            return true;
        } else if (matchY == mSize) {
            console.log("Player 2 wins");
            playertwo = playertwo + 1;
            document.querySelector('.wincount2').innerHTML = playertwo;
            $(".modal-title").text("Player 2 Wins");
            $('#modalWin').modal('show');
            finishGame();
            return true;
        }
    }

    function finishGame() {
        $('.player1').removeClass('highlightCurrentPlayer');
        $('.player2').removeClass('highlightCurrentPlayer');
        clearTimer();
        self.inPlay = false;
    }

    this.startGame = function () {
        if (self.clearBoard) {
            setPlayer(0);
            self.clearBoard = false;
            self.inPlay = true;
            startTimer();
        }
    };

    function startTimer() {
        startTime = Date.now();
        timer = setTimeout(updateProgress,100);
    }

    function resetTimer() {
        startTime = Date.now();
        progressBar.css("width","0%");
        timerCount = 0;
        //console.log("resetting timer");
    }

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
        //console.log("progress count " + timerCount);
    }

    function clearTimer() {
        timerCount = 0;
        clearTimeout(timer);
        timer = null;
        progressBar.css("width","0%");
    }

    this.resetGame = function () {
        //setPlayer(0);
        //mGameBoard.resetBoard();
        self.newGame(mSize);
    };

    this.newGame = function(size) {
        finishGame();
        self.clearBoard = true;
        $(".row").detach();
        $(".row5x5").detach();
        game.initGame(size);
    }
}

function GameBoard() {
    var mCells = [];
    var mRows = 0;
    var mCols = 0;
    var mCellsElement = $(".game_board");
    var mRowElements = [];

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

    this.createCell = function (cellID) {
        return new Cell(cellID);
    };

    this.getCell = function (cellElement) {
        //get cell by element clicked - cell has element var
        for (var i in mCells) {
            if (cellElement === mCells[i].getCellElement()[0]) {
                return mCells[i];
            }
        }
        return null;
    };

    this.getCellByID = function (id) {
      return mCells[id];
    };

    this.resetBoard = function () {
        for (var i in mCells) {
            mCells[i].setState(cellState.stateDefault);
        }
    };

    function createRowElement() {
        var rowClass = "row";
        if (game.getSize() === 5) rowClass = "row5x5";
        return $("<div>",{
            class:rowClass
        })
    }
}

function Cell(cellID) {
    var mState = cellState.stateDefault;
    var mCellID = cellID;
    var cellClass = "cell";
    if (game.getSize() === 5) cellClass = "cell5x5";
    var mCellElement = $("<div>",{
        class:cellClass
    });

    this.getState = function () {
        return mState;
    };

    this.setState = function (state) {
        mState = state;
        if (mState === cellState.stateX) {
            $(mCellElement).text("X");
        } else if (mState === cellState.stateO) {
            $(mCellElement).text("O");
        } else {
            $(mCellElement).text(" ");
        }
        //TODO:set cell element based on state
    };

    this.getCellID = function () {
        return mCellID;
    };

    this.getCellElement = function () {
        return mCellElement;
    }
}

function Player(id,symbol) {
    this.playerID = id;
    this.symbol = symbol;
}
