// Game Module (Singleton Pattern)
const Game = (function() {
    // Private variables
    let currentPlayer = 'X';
    let gameActive = true;
    let gameBoard = Array(9).fill(null);
    let xMoves = [];
    let oMoves = [];
    let observers = []; // Store observers (UI updates)

    // Winning combinations (index-based)
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Check for a winner
    const checkWinner = () => {
        return winningCombinations.some(combination => {
            const [a, b, c] = combination;
            return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
        });
    };

    // Notify all observers
    const notifyObservers = () => {
        observers.forEach(observer => observer.update());
    };

    // Private method to handle the move logic
    const makeMove = (index) => {
        if (gameBoard[index] || !gameActive) return;

        gameBoard[index] = currentPlayer;
        if (currentPlayer === 'X') {
            xMoves.push(index);
        } else {
            oMoves.push(index);
        }

        // Check for winner after each move
        if (checkWinner()) {
            gameActive = false;
            notifyObservers();
        } else {
            // If no winner and player has made 5 moves, remove the first move
            if ((currentPlayer === 'X' && xMoves.length > 4) || (currentPlayer === 'O' && oMoves.length > 4)) {
                removeFirstMove();
            }
            // Switch to next player
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            notifyObservers();
        }
    };

    // Private method to remove the first move after the 5th move
    const removeFirstMove = () => {
        const movesArray = currentPlayer === 'X' ? xMoves : oMoves;
        const firstMoveIndex = movesArray.shift();
        gameBoard[firstMoveIndex] = null;
        notifyObservers();
    };

    // Public method to restart the game
    const restartGame = () => {
        gameBoard = Array(9).fill(null);
        xMoves = [];
        oMoves = [];
        currentPlayer = 'X';
        gameActive = true;
        notifyObservers();
    };

    // Public methods
    return {
        makeMove,
        restartGame,
        getCurrentPlayer: () => currentPlayer,
        getGameBoard: () => gameBoard,
        addObserver: (observer) => observers.push(observer),
        isGameActive: () => gameActive
    };
})();

// UI Observer
class UIObserver {
    constructor(boardElement, statusElement) {
        this.boardElement = boardElement;
        this.statusElement = statusElement;
    }

    // Update the board and status based on game state
    update() {
        const gameBoard = Game.getGameBoard();
        this.updateBoard(gameBoard);
        this.updateStatus();
    }

    // Update the board UI
    updateBoard(gameBoard) {
        gameBoard.forEach((cell, index) => {
            const cellElement = this.boardElement.children[index];
            cellElement.textContent = cell || '';
            if (cell) {
                cellElement.classList.add('taken');
            } else {
                cellElement.classList.remove('taken');
            }
        });
    }

    // Update the status UI
    updateStatus() {
        if (!Game.isGameActive()) {
            this.statusElement.textContent = `${Game.getCurrentPlayer()} Wins!`;
        } else {
            this.statusElement.textContent = `${Game.getCurrentPlayer()}'s Turn`;
        }
    }
}

// Game Setup
const boardElement = document.querySelector('#board');
const statusElement = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');

// Initialize UI Observer
const uiObserver = new UIObserver(boardElement, statusElement);
Game.addObserver(uiObserver);

// Add event listener for board cells
boardElement.addEventListener('click', (event) => {
    const index = Array.from(boardElement.children).indexOf(event.target);
    if (index !== -1) {
        Game.makeMove(index);
    }
});

// Add event listener for the restart button
restartBtn.addEventListener('click', () => {
    Game.restartGame();
});

// Initial status update
uiObserver.update();
