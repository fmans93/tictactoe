document.addEventListener('DOMContentLoaded', () => {
    // Game sounds
    const sounds = {
        move: new Audio('sounds/move.mp3'),
        win: new Audio('sounds/win.mp3'),
        draw: new Audio('sounds/draw.mp3'),
        button: new Audio('sounds/button.mp3')
    };

    // Game state
    let gameState = {
        currentPlayer: '🌮',
        scores: {
            '🌮': 0,
            '🌶️': 0
        },
        gameActive: true,
        darkMode: false,
        soundEnabled: true,
        boardState: ['', '', '', '', '', '', '', '', ''],
        boardSize: 3
    };

    const playerNames = {
        '🌮': 'Taco',
        '🌶️': 'Jalapeño'
    };

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    // DOM elements
    const statusDisplay = document.querySelector('.game-status');
    const cells = document.querySelectorAll('[data-cell]');
    const restartButton = document.getElementById('restartButton');
    const scoreDisplay = document.querySelector('.score-display');
    const soundToggle = document.getElementById('soundToggle');
    const themeToggle = document.getElementById('themeToggle');

    // Initialize the game
    function initializeGame() {
        gameState.currentPlayer = '🌮';
        gameState.gameActive = true;
        gameState.boardState = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('cell-win');
            cell.classList.remove('pop-in');
            cell.addEventListener('click', handleCellClick, { once: true });
        });
        updateStatusDisplay();
        updateScoreDisplay();
    }

    function updateStatusDisplay() {
        statusDisplay.textContent = `${playerNames[gameState.currentPlayer]}'s Turn`;
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = `🌮 ${gameState.scores['🌮']} - ${gameState.scores['🌶️']} 🌶️`;
    }

    function handleCellClick(event) {
        const cell = event.target;
        const index = Array.from(cells).indexOf(cell);

        if (!gameState.gameActive || gameState.boardState[index] !== '') return;

        // Play move sound
        if (gameState.soundEnabled) {
            sounds.move.play();
        }

        // Update cell and game state
        gameState.boardState[index] = gameState.currentPlayer;
        cell.textContent = gameState.currentPlayer;
        cell.classList.add('pop-in');
        
        if (checkWin()) {
            handleWin();
        } else if (checkDraw()) {
            handleDraw();
        } else {
            switchPlayer();
        }
    }

    function checkWin() {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return gameState.boardState[index] === gameState.currentPlayer;
            });
        });
    }

    function checkDraw() {
        return gameState.boardState.every(cell => cell !== '');
    }

    function handleWin() {
        gameState.gameActive = false;
        gameState.scores[gameState.currentPlayer]++;
        
        if (gameState.soundEnabled) {
            sounds.win.play();
        }
        
        // Show victory animation
        showVictoryAnimation();
        
        statusDisplay.textContent = `${playerNames[gameState.currentPlayer]} Wins! 🎉`;
        updateScoreDisplay();
    }

    function handleDraw() {
        gameState.gameActive = false;
        
        if (gameState.soundEnabled) {
            sounds.draw.play();
        }
        
        statusDisplay.textContent = '¡Empate! (Draw!)';
    }

    function switchPlayer() {
        gameState.currentPlayer = gameState.currentPlayer === '🌮' ? '🌶️' : '🌮';
        updateStatusDisplay();
    }

    function showVictoryAnimation() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    // Event Listeners
    restartButton.addEventListener('click', () => {
        if (gameState.soundEnabled) {
            sounds.button.play();
        }
        initializeGame();
    });

    soundToggle.addEventListener('click', () => {
        gameState.soundEnabled = !gameState.soundEnabled;
        soundToggle.textContent = gameState.soundEnabled ? '🔊' : '🔇';
    });

    themeToggle.addEventListener('click', () => {
        gameState.darkMode = !gameState.darkMode;
        document.body.classList.toggle('dark-mode');
        themeToggle.textContent = gameState.darkMode ? '☀️' : '🌙';
    });

    // Initialize game on load
    initializeGame();

    // Preload sounds
    function loadSounds() {
        Object.values(sounds).forEach(sound => {
            sound.load();
        });
    }
    loadSounds();
});
