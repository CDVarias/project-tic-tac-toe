const displayController = (() => {
    const renderMessage = (message) => {
        document.querySelector("#message").innerHTML = message;
    }

    return{
        renderMessage,
    }
})();

const gameBoard = (() => { // gameboard object //logic of what will happen with the gameboard
    let board = ["","","","","","","","",""]; //storing a the gameboard as an array inside the gameboard object //private variable

    const render = () => {
        let boardHTML = "";
        board.forEach((square,index) => {
            boardHTML += `<div class="box" id="box-${index}">${square}</div>`
        })
        document.querySelector("#game-board").innerHTML = boardHTML;
        const boxes = document.querySelectorAll(".box");
        boxes.forEach((box) => {
            box.addEventListener("click",game.handleClick);
        })
    }

    const update = (index,value) => {
        board[index] = value;
        render();
    }

    const getGameboard = () => board;
   
    return { // return the functions or variables to make it accessible (module pattern)
        render,
        update, 
        getGameboard,
    }
})();

const createPlayer = (name,mark) => { //factory function //for creating multiple objects
    return{
        name,
        mark}
}

const game = (() => { //logic on what will be the flow of the game //module pattern
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = () => {
        players = [
            createPlayer(document.querySelector("#player1").value, "X"),
            createPlayer(document.querySelector("#player2").value, "0")
        ]
        currentPlayerIndex = 0;
        gameOver = false;
        gameBoard.render();
    }
    const handleClick = (event) => {
        let index = parseInt(event.target.id.split("-")[1]);
        if (gameBoard.getGameboard()[index] !== "")
            return;

        gameBoard.update(index,players[currentPlayerIndex].mark);

        if (checkWinner(gameBoard.getGameboard(),players[currentPlayerIndex].mark)){
            gameOver = true;
            displayController.renderMessage(`${players[currentPlayerIndex.name]} wins!`);
        } else if(checkForTie(gameBoard.getGameboard())){
            gameOver = true;
            displayController.renderMessage(`It's a tie`);
        }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }

    const restart = () => {
        for (let i = 0; i < 9; i++){
            gameBoard.update(i, "");
        }
        gameBoard.render();
        gameOver = false;
        document.querySelector("#message").innerHTML = "";
    }

    return{
        start,
        handleClick,
        restart,
    }

})();

function checkWinner(boardUsed){
    const winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ]
    for(let i = 0; i < winningCombinations.length; i++){
        const [a,b,c] = winningCombinations[i];
        if(boardUsed[a] && boardUsed[a] === boardUsed[b] && boardUsed[a] === boardUsed[c]){
            return true;
        }
    }
    return false;
}

function checkForTie (boardUsed) {
    return boardUsed.every(cell => cell !== "");
}

const vsBotButton = document.querySelector("#vs-bot");
const pvpButton = document.querySelector("#vs-p2");
const startButton = document.querySelector("#start-game");
startButton.addEventListener("click", () =>{
   startButton.style.display = "none";
   vsBotButton.style.display = "inline";
   pvpButton.style.display = "inline";
//    game.start();
})




const multiPlayer = document.querySelector("#multiplayer")
const multiPlayerBtn = document.querySelector("#vs-p2");
multiPlayerBtn.addEventListener("click",() =>{
    multiPlayer.style.display = "flex";   
})

const restartButton = document.querySelector("#restart");
restartButton.addEventListener("click", () => {
    game.restart()
})


