const Element = function () {
    let value = 0;

    const addToken = (player) => { value = player; }
    const getValue = () => value;

    return { addToken, getValue };
};

const Gameboard = (function () {
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
        const boardWithCells = board.map(row => row.map(el => el.getValue()));
        console.log(boardWithCells);
    };

    return { getBoard, dropToken, printBoard };
})();

const Game = (function() {
    const board = Gameboard;

    const players = [
        { name: "player1", token: 1 },
        { name: "player2", token: 2 }
    ];

    let player1Points = 0;
    let player2Points = 0;
    let activePlayer = players[0];

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
            row.forEach(cell => cell.addToken(0));
        });
        activePlayer = players[0];
    };

    const checkDraw = () => {
        const b = board.getBoard();
        const allFilled = b.flat().every(cell => cell.getValue() !== 0);

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
        } else if (checkDraw()) {
            clearBoard();
            printNewRound();
        } else {
            switchPlayer();
            printNewRound();
        }
    };

    const playRound = (row, column) => {
        console.log(`It is ${getActivePlayer().name}'s turn`);
        console.log(`${getActivePlayer().name}'s token is getting dropped into row ${row}, column ${column}`);

        if (board.dropToken(getActivePlayer().token, row, column) === false) {
            return; //this move is invalid, so we return 
    }
        endRound(row, column);
    };

    printNewRound();
    console.log(`It is ${getActivePlayer().name}'s turn`);
    return { playRound, getActivePlayer };
})();
