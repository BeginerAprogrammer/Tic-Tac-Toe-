let currentPlayer = 'X';
let gameMode = null;
let gameIsOver = false;

const cells = document.querySelectorAll('.cell');
const winnerEl = document.getElementById('winner');
const gameModeSelection = document.getElementById('gameModeSelection');
const resetButton = document.getElementById('resetButton');

function resetGame() {
    gameIsOver = false;
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
    });
    winnerEl.textContent = '';
    gameModeSelection.style.display = 'block';
    resetButton.style.display = 'none';
}
function startGame(mode) {
    gameMode = mode;
    gameModeSelection.style.display = 'none';
    resetButton.style.display = 'block';

    if (gameMode === 'single') {
        cells.forEach(cell => {
            cell.addEventListener('click', playerMove);
        });
    } else {
        cells.forEach(cell => {
            cell.addEventListener('click', multiplayerMove);
        });
    }
}

function playerMove(e) {
    if (!e.target.textContent && !gameIsOver) {
        e.target.textContent = 'X';
        if (checkWinner('X')) {
            endGame('X wins!');
        } else {
            computerMove();
        }
    }
}

function multiplayerMove(e) {
    if (!e.target.textContent && !gameIsOver) {
        e.target.textContent = currentPlayer;
        if (checkWinner(currentPlayer)) {
            endGame(`${currentPlayer} wins!`);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}
// ... (rest of the code above)

function computerMove() {
    if (gameIsOver) return;

    if (tryWinOrBlock('O')) {
        endGame('O wins!');
    } else if (tryWinOrBlock('X')) {
        // block, no win check for O needed
    } else {
        playRandom();
    }
}

function tryWinOrBlock(player) {
    for (const condition of winConditions) {
        let values = condition.map(index => cells[index].textContent);
        if (values.filter(v => v === player).length === 2 && values.includes('')) {
            cells[condition[values.indexOf('')]].textContent = 'O';
            return true;
        }
    }
    return false;
}

function playRandom() {
    let emptyCells = [...cells].filter(cell => !cell.textContent);
    if (emptyCells.length) {
        let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        randomCell.textContent = 'O';
        checkWinner('O');
    } else {
        endGame('It\'s a tie!');
    }
}

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function checkWinner(player) {
    for (const condition of winConditions) {
        if (condition.every(index => cells[index].textContent === player)) {
            endGame(`${player} wins!`);
            return true;
        }
    }
    return false;
}

function endGame(message) {
    gameIsOver = true;
    winnerEl.textContent = message;
    cells.forEach(cell => {
        cell.removeEventListener('click', playerMove);
        cell.removeEventListener('click', multiplayerMove);
    });
}
