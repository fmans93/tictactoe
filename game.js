document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('[data-cell]');
    const status = document.getElementById('status');
    const restartButton = document.getElementById('restartButton');
    let currentPlayer = 'X';
    let gameActive = true;
    let gameState = ['', '', '', '', '', '', '', '', ''];

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    function handleCellClick(e) {
        const cell = e.target;
        const index = Array.from(cells).indexOf(cell);

        if (gameState[index] !== '' || !gameActive) return;

        gameState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());

        if (checkWin()) {
            gameActive = false;
            status.textContent = `${currentPlayer} Wins!`;
            status.style.color = currentPlayer === 'X' ? '#ff6b6b' : '#6e8efb';
            return;
        }

        if (checkDraw()) {
            gameActive = false;
            status.textContent = "It's a Draw!";
            status.style.color = '#666';
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `${currentPlayer}'s Turn`;
    }

    function checkWin() {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return gameState[index] === currentPlayer;
            });
        });
    }

    function checkDraw() {
        return gameState.every(cell => cell !== '');
    }

    function restartGame() {
        currentPlayer = 'X';
        gameActive = true;
        gameState = ['', '', '', '', '', '', '', '', ''];
        status.textContent = "X's Turn";
        status.style.color = '#666';
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
    }

    // Add touch feedback for mobile devices
    function addTouchFeedback(element) {
        element.addEventListener('touchstart', () => {
            element.style.opacity = '0.8';
        });
        element.addEventListener('touchend', () => {
            element.style.opacity = '1';
        });
    }

    // Event Listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
        addTouchFeedback(cell);
    });

    restartButton.addEventListener('click', restartGame);
    addTouchFeedback(restartButton);

    // Initialize the game
    restartGame();
});
