// script.js
document.addEventListener('DOMContentLoaded', () => {
    const holes = document.querySelectorAll('.hole');
    const resetButton = document.getElementById('reset-button');
    const turnIndicator = document.getElementById('turn-indicator');

    let board = [
        [2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2]
    ];
    let currentPlayer = 1;

    function updateBoard() {
        holes.forEach((hole, index) => {
            const row = Math.floor(index / 7);
            const col = index % 7;
            hole.textContent = board[row][col];
        });
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
    }

    function distributeSeeds(row, col) {
        let seeds = board[row][col];
        board[row][col] = 0;
        let currentRow = row;
        let currentCol = col;

        while (seeds > 0) {
            currentCol++;
            if (currentCol >= 7) {
                currentCol = 0;
                currentRow = (currentRow + 1) % 4;
            }

            if (currentRow === row && currentCol === col) {
                currentCol++;
                if (currentCol >= 7) {
                    currentCol = 0;
                    currentRow = (currentRow + 1) % 4;
                }
            }

            board[currentRow][currentCol]++;
            seeds--;
        }

        // Check for capture rules here
        // Implement the logic for capturing seeds based on the rules

        updateBoard();
        switchPlayer();
    }

    holes.forEach(hole => {
        hole.addEventListener('click', () => {
            const row = parseInt(hole.getAttribute('data-row'));
            const col = parseInt(hole.getAttribute('data-col'));

            if ((currentPlayer === 1 && (row === 2 || row === 3)) || (currentPlayer === 2 && (row === 0 || row === 1))) {
                distributeSeeds(row, col);
            }
        });
    });

    resetButton.addEventListener('click', () => {
        board = [
            [2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2]
        ];
        currentPlayer = 1;
        updateBoard();
        turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
    });

    updateBoard();
});