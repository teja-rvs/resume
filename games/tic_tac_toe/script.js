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

    const addHighlightToCell = (index) => {
        const cellElement = document.querySelector(`#board .cell:nth-child(${index + 1})`);
        cellElement.classList.add('highlight');
    };

    const removeHighlights = () => {
        const highlightedCells = document.querySelectorAll('.highlight');
        highlightedCells.forEach(cell => {
            cell.classList.remove('highlight');
        });
    };

    const makeMove = (index) => {
        if (gameBoard[index] || !gameActive) return;

        // Track the current move for the player
        let movesArray = currentPlayer === 'X' ? xMoves : oMoves;
        movesArray.push(index);

        // If the current player has placed 3 moves, highlight the first move of the opponent
        if (xMoves.length > 3 || oMoves.length >= 3) {
            let opponentMovesArray = currentPlayer === 'X' ? oMoves : xMoves;
            removeHighlights(); // Remove previous highlights
            addHighlightToCell(opponentMovesArray[0]); // Highlight the opponent's first move
        }

        // Place the current player's move
        gameBoard[index] = currentPlayer;

        // After placing the move, check if there is a winner
        if (checkWinner()) {
            gameActive = false;
            removeHighlights();
            notifyObservers();
        } else {
            // If no winner, remove the first move of the current player after placing the 4th item
            if (movesArray.length > 3) {
                removeFirstMove(movesArray);
            }

            // Switch player after each move
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            notifyObservers();
        }
    };

    // Private method to remove the first move of the current player
    const removeFirstMove = (movesArray) => {
        const firstMoveIndex = movesArray[0]; // Get the first move
        gameBoard[firstMoveIndex] = null; // Remove the first move from the board
        movesArray.shift(); // Remove the first move from the array
        notifyObservers();
    };

    // Public method to restart the game
    const restartGame = () => {
        gameBoard = Array(9).fill(null);
        xMoves = [];
        oMoves = [];
        currentPlayer = 'X';
        gameActive = true;
        removeHighlights(); // Clear any existing highlights
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
            cellElement.textContent = cell || ''; // Ensure to update text content properly
            if (cell) {
                cellElement.classList.add('taken');
            } else {
                cellElement.classList.remove('taken');
            }
        });
    }

    // Update the status UI
    updateStatus() {
        const playerXName = document.getElementById('player-x-name')?.value || 'Player X';
        const playerOName = document.getElementById('player-o-name')?.value || 'Player O';

        if (!Game.isGameActive()) {
            this.statusElement.textContent = `${Game.getCurrentPlayer() === 'X' ? playerXName : playerOName} Wins!`;
        } else {
            this.statusElement.textContent = `${Game.getCurrentPlayer() === 'X' ? playerXName : playerOName}'s Turn`;
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
