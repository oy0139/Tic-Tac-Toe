const Element = function () {
    let value = 0;

    const addToken = (player) => { value = player; }
    const getValue = () => value;

    return { addToken, getValue };
};

function Gameboard() {
    let rows = 3;
    let columns = 3;
    let board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Element());
        }
    }

    const getBoard = () => board;

    const dropToken = (player, row, column) => {
    const b = board; // or board.getBoard()
    if (b[row][column].getValue() === 0) {
        b[row][column].addToken(player);
        return true;  // success
    } else {
        console.log("This spot is taken");
        return false; // failure
    }
};

    const printBoard = () => {
        const boardWithElements = board.map(row => row.map(element => element.getValue()));
        console.log(boardWithElements);
    };

    return { getBoard, dropToken, printBoard };
};

function Game() {
    const board = Gameboard();

    const players = [
        { name: "player1", token: 1 },
        { name: "player2", token: 2 }
    ];

    let player1Points = 0;
    let player2Points = 0;
    let activePlayer = players[0];
    const getPlayer1Score = () => player1Points;
    const getPlayer2Score = () => player2Points;

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        console.log(`It is ${getActivePlayer().name}'s turn`);
    };


    const getActivePlayer = () => activePlayer;

    const addPoint = () => {
        if (getActivePlayer() === players[0]) {
            player1Points++;
            console.log("Player 1 has won this round");
        } else {
            player2Points++;
            console.log("Player 2 has won this round");
        }
    };

    const printNewRound = () => {
        board.printBoard();
    };

    const checkWin = (row, column) => {
        const b = board.getBoard();

        if (
            b[row][0].getValue() !== 0 &&
            b[row][0].getValue() === b[row][1].getValue() &&
            b[row][1].getValue() === b[row][2].getValue()
        ) {
            addPoint();
            return true;
        }

        if (
            b[0][column].getValue() !== 0 &&
            b[0][column].getValue() === b[1][column].getValue() &&
            b[1][column].getValue() === b[2][column].getValue()
        ) {
            addPoint();
            return true;
        }

        if (
            b[0][0].getValue() !== 0 &&
            b[0][0].getValue() === b[1][1].getValue() &&
            b[1][1].getValue() === b[2][2].getValue()
        ) {
            addPoint();
            return true;
        }

        if (
            b[0][2].getValue() !== 0 &&
            b[0][2].getValue() === b[1][1].getValue() &&
            b[1][1].getValue() === b[2][0].getValue()
        ) {
            addPoint();
            return true;
        }

        return false;
    };

    const clearBoard = () => {
        board.getBoard().forEach(row => {
            row.forEach(element => element.addToken(0));
        });
        activePlayer = players[0];
    };

    const checkDraw = () => {
        const b = board.getBoard();
        const allFilled = b.flat().every(element=> element.getValue() !== 0);

        if (allFilled) {
            console.log("Ladies and gentlemen we have a draw!");
            return true;
        }
        return false;
    };

    const endRound = (row, column) => {
        if (checkWin(row, column)) {
            clearBoard();
            printNewRound();
            return "win";
        } else if (checkDraw()) {
            clearBoard();
            printNewRound();
            return "draw";
        } else {
            switchPlayer();
            printNewRound();
            return "continue";
        }
    };

    const playRound = (row, column) => {
        console.log(`It is ${getActivePlayer().name}'s turn`);
        console.log(`${getActivePlayer().name}'s token is getting dropped into row ${row}, column ${column}`);

        if (board.dropToken(getActivePlayer().token, row, column) === false) {
            return "invalid"; //this move is invalid, so we return invalid
    }
        return endRound(row, column);
    };

    printNewRound();
    console.log(`It is ${getActivePlayer().name}'s turn`);
    return { playRound, getActivePlayer, getBoard: board.getBoard, getPlayer1Score, getPlayer2Score };
};

function ScreenController() {
    const boardDiv = document.querySelector('.board');
    const startBtn = document.querySelector("#startGameBtn")
    const playerTurn = document.querySelector('.turn');
    const resultOfRound = document.querySelector('.resultOfRound');
    const player1Score = document.querySelector('.player1Score');
    const player2Score = document.querySelector('.player2Score');

    let game; 

    function startNewGame() {
        game = Game(); 
        resultOfRound.textContent = ""; 
        player1Score.textContent = "Score: "
        player2Score.textContent = "Score: "
        updateScreen(); 
    }


    const updateScreen = () => {
        if (!game) return; 

        boardDiv.textContent = '';
        const board = game.getBoard();

        const activePlayer = game.getActivePlayer();
        playerTurn.textContent =  `It is ${activePlayer.name}'s turn`

        board.forEach((row, rowIndex) => {
            row.forEach((element, index)=> {
                const elementButton = document.createElement('button');
                elementButton.classList.add("element");

                elementButton.dataset.column = index;
                elementButton.dataset.row = rowIndex;
                const val = element.getValue();
                elementButton.textContent = val === 1 ? "X" : val === 2 ? "O" : "";
                boardDiv.appendChild(elementButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        if (!game) return; // ignore clicks before start

        if (!e.target.classList.contains("element")) return;

        const selectedRow = Number(e.target.dataset.row);
        const selectedColumn = Number(e.target.dataset.column);

        if (isNaN(selectedRow) || isNaN(selectedColumn)) return;

        const currentPlayer = game.getActivePlayer();

        const result = game.playRound(selectedRow, selectedColumn);
        if (result === "win") {
            resultOfRound.textContent = `${currentPlayer.name} wins!`;
            player1Score.textContent = `Score: ${game.getPlayer1Score()}`;
            player2Score.textContent =`Score: ${game.getPlayer2Score()}`;
        } else if (result === "draw") {
            resultOfRound.textContent = "It's a draw!";
        } 
        else if (result === "invalid") {
        resultOfRound.textContent = "That spot is already taken!";
        } else {
            resultOfRound.textContent = "";
        }



        updateScreen();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);


    startBtn.addEventListener("click", startNewGame);

    startNewGame();
}

ScreenController();
