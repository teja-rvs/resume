    // Module to encapsulate the game logic
    const MemoryGame = (() => {
        const cardValues = ['A', 'A', 'W', 'W', 'T', 'T', 'Y', 'Y', 'U', 'U', 'I', 'I', 'O', 'O', 'H', 'H'];
        let flippedCards = [];
        let matchedCards = [];
        let rotationCount = 0;

        const gameBoard = document.getElementById('game-board');
        const resetButton = document.getElementById('reset-button');

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

            // If two cards are flipped
            if (flippedCards.length === 2) {
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

        // Initialize the game
        function initializeGame() {
            gameBoard.innerHTML = '';
            flippedCards = [];
            matchedCards = [];
            rotationCount = 0; // Reset rotation count
            const shuffledValues = shuffleCards();
            shuffledValues.forEach((value, index) => {
                const card = createCard(value, index);
                gameBoard.appendChild(card);
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