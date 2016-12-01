/**
 * Created by baultik on 11/30/16.
 */
var cellState = {
    stateDefault:"stateDefault",
    stateX:"stateX",
    stateO:"stateO"
};
var game = null;
$(document).ready(setupGame);

function setupGame() {
    game = new Game();
    game.initGame(3);

    $(".reset").click(game.resetGame);
    $(".threeXthree").click(function () {
        game.newGame(3)
    });

    $(".fiveXfive").click(function () {
        game.newGame(5);
    });
}

function handleCellClick() {
    var cell = game.getGameBoard().getCell(this);
    if (cell.getState() === cellState.stateDefault) {
        var player = game.getCurrentPlayer();
        cell.setState(player.symbol);
        player.score += cell.getCellID();
        game.switchPlayer();

        //console.log(game.checkWin());
    }
    //console.log("clicked");
}

function Game() {
    var mGameBoard = null;
    var mPlayers = [];
    var mCurrentPlayer = 0;
    var mSize = 0;
    var self = this;

    this.initGame = function (size) {
        //create game board
        mPlayers = [];
        setPlayer(0);
        mSize = size;
        mGameBoard = new GameBoard();
        mGameBoard.initGameBoard(size,size);

        //create players
        var player1 = new Player(0,cellState.stateX);
        var player2 = new Player(1,cellState.stateO);

        mPlayers.push(player1,player2);

        $(".cell").click(handleCellClick);
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
        console.log("current player is ",self.getCurrentPlayer());
        //TODO:show current player has been switched
    }



    this.checkWin = function () {
        var gameBoard = this.getGameBoard();

    };

    this.resetGame = function () {
        //setPlayer(0);
        //mGameBoard.resetBoard();
        self.newGame(mSize);
    };

    this.newGame = function(size) {
        $(".row").detach();
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

    this.getMoves = function() {
      return 0;
    };

    this.resetBoard = function () {
        for (var i in mCells) {
            mCells[i].setState(cellState.stateDefault);
        }
    };

    function createRowElement() {
        return $("<div>",{
            class:"row"
        })
    }
}

function Cell(cellID) {
    var mState = cellState.stateDefault;
    var mCellID = cellID;
    var mCellElement = $("<div>",{
        class:"cell"
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