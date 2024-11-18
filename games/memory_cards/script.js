// Module to encapsulate the game logic
const MemoryGame = (() => {
    const cardValues = ['A', 'A', 'W', 'W', 'T', 'T', 'Y', 'Y', 'U', 'U', 'I', 'I', 'O', 'O', 'H', 'H'];
    let flippedCards = [];
    let matchedCards = [];
    let rotationCount = 0;
    let moveCount = 0;  // Initialize move counter

    const gameBoard = document.getElementById('game-board');
    const resetButton = document.getElementById('reset-button');
    const moveCounterDisplay = document.getElementById('move-counter'); // Get the move counter display element

    // Shuffle the cards using the Fisher-Yates shuffle algorithm
    function shuffleCards() {
        return cardValues.sort(() => Math.random() - 0.5);
    }

    // Card Factory: Creates and returns a new card element
    function createCard(value, index) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.dataset.index = index;

        const front = document.createElement('div');
        front.classList.add('front');
        front.textContent = '?';

        const back = document.createElement('div');
        back.classList.add('back');
        back.textContent = value;

        card.appendChild(front);
        card.appendChild(back);
        card.addEventListener('click', () => handleCardClick(card));

        return card;
    }

    // Handles card click event
    function handleCardClick(card) {
        if (flippedCards.length === 2 || card.classList.contains('flipped') || matchedCards.includes(card)) {
            return;
        }

        card.classList.add('flipped');
        flippedCards.push(card);

        // If two cards are flipped, increment move count and check match
        if (flippedCards.length === 2) {
            moveCount++;  // Increment move count
            updateMoveCounterDisplay(); // Update display for move count
            checkMatch();
        }
    }

    // Check if the two flipped cards match
    function checkMatch() {
        const [card1, card2] = flippedCards;

        if (card1.dataset.value === card2.dataset.value) {
            matchedCards.push(card1, card2);
            flippedCards = [];
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                rotateBoard();
            }, 1000);
        }
    }

    // Rotate the board and cards
    function rotateBoard() {
        rotationCount++;
        gameBoard.style.transform = `rotate(${rotationCount * 90}deg)`;

        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.transform = `rotate(-${rotationCount * 90}deg)`;
        });
    }

    // Update the displayed move counter
    function updateMoveCounterDisplay() {
        moveCounterDisplay.textContent = `Moves: ${moveCount}`;
    }

    // Initialize the game
    function initializeGame() {
        gameBoard.innerHTML = '';
        flippedCards = [];
        matchedCards = [];
        rotationCount = 0; // Reset rotation count
        moveCount = 0; // Reset move count
        gameBoard.style.transform = 'rotate(0deg)';  // Reset the board's rotation

        // Update the move counter display
        updateMoveCounterDisplay();

        const shuffledValues = shuffleCards();
        shuffledValues.forEach((value, index) => {
            const card = createCard(value, index);
            gameBoard.appendChild(card);
        });

        // Reset all cards to their initial unflipped state
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => {
            card.classList.remove('flipped');  // Remove flipped state
            card.style.transform = 'rotate(0deg)';  // Ensure cards are not rotated
        });
    }

    // Attach event listener for reset button
    function attachResetListener() {
        resetButton.addEventListener('click', initializeGame);
    }

    // Expose public methods
    return {
        initializeGame,
        attachResetListener
    };
})();

// Initialize the game when the page loads
MemoryGame.initializeGame();
MemoryGame.attachResetListener();
