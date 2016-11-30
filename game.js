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
    game.initGame($(".cell"));

    $(".cell").click(function () {
        var cell = game.getGameBoard().getCell(this);
        if (cell.getState() === cellState.stateDefault) {
            var player = game.getCurrentPlayer();
            cell.setState(player.symbol);
            game.switchPlayer();
        }
    });
}

function Game() {
    var mGameBoard = null;
    var players = [];
    var currentPlayer = 0;

    this.initGame = function (cellsElement) {
        //create game board
        mGameBoard = new GameBoard();
        mGameBoard.initGameBoard(3,3,cellsElement);

        //create players
        var player1 = new Player(0,cellState.stateX);
        var player2 = new Player(1,cellState.stateO);

        players.push(player1,player2);
    };

    this.getGameBoard = function () {
        return mGameBoard;
    };

    this.getCurrentPlayer = function() {
        return players[currentPlayer];
    };

    this.switchPlayer = function () {
        currentPlayer++;
        if (currentPlayer >= players.length) {
            currentPlayer = 0;
        }
        console.log("current player is ",this.getCurrentPlayer());
        //TODO:show current player has been switched
    };
}

function GameBoard() {
    var mCells = [];
    var mRows = 0;
    var mCols = 0;
    var mCellsElement = null;

    //create game board - using elements in the dom
    this.initGameBoard = function(rows,cols,cellsElement) {
        mRows = rows;
        mCols = cols;
        mCellsElement = cellsElement;

        //create cell objects for size of board - use dom elements for count
        for (var i = 0; i < mCellsElement.length; i++) {
            var cell = this.createCell(i);
            mCells.push(cell);
        }
    };

    this.createCell = function (cellID) {
        return new Cell(cellID,mCellsElement[cellID]);
    };

    this.getCell = function (cellElement) {
        //get cell by element clicked - cell has element var
        for (var i in mCells) {
            if (cellElement === mCells[i].getCellElement()) {
                return mCells[i];
            }
        }
        return null;
    }
}

function Cell(cellID,cellElement) {
    var mState = cellState.stateDefault;
    var mCellID = cellID;
    var mCellElement = cellElement;

    this.getState = function () {
        return mState;
    };

    this.setState = function (cellState) {
        mState = cellState;
        if (mState === cellState.stateX) {

        } else if (mState === cellState.stateO) {

        }
        //TODO:set cell element based on state
        $(mCellElement).text(mState);
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