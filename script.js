$(document).ready(function(){

    var symbol = ["X", "O"];

    function Player(id, symbol){
        this.id = id;
        this.symbol = symbol;
    }

    var player1 = new Player();
    var player2 = new Player();



    $(".cell").click(function() {
        console.log("A Cell was clicked");
        var cell = $(".cell");
        for (var i=0; i<cell.length; i++){
            var currentCell = cell[i];
            if (currentCell === this && player1){
                console.log(i);
                $(this).text(symbol[0]);
            }
            else if (player2){
                $(this).text(symbol[1]);
            }

        }
    });


    $("button").click(function() {
        console.log("Button was clicked");
        var button = $("button");

        if (this.hasClass('threeXthree')){
            console.log("3x3 button was clicked");
        }
        else if (this.hasClass('fiveXfive')){
            console.log("5x5 button was clicked");
        }
        else{
            console.log("Reset button was clicked");
        }

    });

});
