const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");
const aiToggleButton = document.getElementById("ai-toggle");
const difficultySelect = document.getElementById("difficulty");
const scoreX = document.getElementById("score-x");
const scoreO = document.getElementById("score-o");
const clickSound = document.getElementById("click-sound");
const winSound = document.getElementById("win-sound");
const tieSound = document.getElementById("tie-wav");

let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let scores = { X: 0, O: 0 };
let aiMode = false;
let difficulty = "hard"; // Default difficulty

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    playSound(clickSound);
    updateGameState(clickedCellIndex, currentPlayer);
    checkForWinner();

    if (aiMode && gameActive && currentPlayer === "O") {
        setTimeout(() => {
            const bestMove = findBestMove();
            animateAIMove(bestMove, () => {
                updateGameState(bestMove, currentPlayer);
                checkForWinner();
            });
        }, 500); // Simulate AI "thinking"
    }
}

function updateGameState(index, player) {
    gameState[index] = player;
    cells[index].textContent = player;
}

function checkForWinner() {
    let roundWon = false;
    let winningCondition = null;

    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (
            gameState[a] === "" ||
            gameState[b] === "" ||
            gameState[c] === ""
        ) {
            continue;
        }
        if (
            gameState[a] === gameState[b] &&
            gameState[b] === gameState[c]
        ) {
            roundWon = true;
            winningCondition = condition;
            break;
        }
    }

    if (roundWon) {
        playSound(winSound);
        highlightWinningCells(winningCondition);
        if (aiMode && currentPlayer === "O") {
            statusText.textContent = "AI wins!";
        } else {
            statusText.textContent = `Player ${currentPlayer} wins!`;
        }
        scores[currentPlayer]++;
        updateScore();
        gameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        playSound(tieSound);
        statusText.textContent = "It's a tie!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function highlightWinningCells(winningCondition) {
    winningCondition.forEach(index => {
        cells[index].classList.add("winning-cell");
    });
}

function resetGame() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.style.transform = "scale(1)"; // Reset animations
        cell.classList.remove("winning-cell"); // Remove the winning-cell class
    });
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetButton.addEventListener("click", resetGame);
aiToggleButton.addEventListener("click", toggleAI);
difficultySelect.addEventListener("change", setDifficulty);

function findBestMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < 9; i++) {
        if (gameState[i] === "") {
            gameState[i] = "O"; // AI is "O"
            let score = minimax(gameState, 0, false, getMaxDepth());
            gameState[i] = ""; // Undo the move
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
}

function minimax(board, depth, isMaximizing, maxDepth) {
    const scores = {
        X: -1,
        O: 1,
        tie: 0
    };

    const result = checkWinner(board);
    if (result !== null) {
        return scores[result];
    }

    if (depth >= maxDepth) {
        return 0; // Return neutral score if max depth is reached
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false, maxDepth);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true, maxDepth);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(board) {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {
            return board[a];
        }
    }

    if (!board.includes("")) {
        return "tie";
    }

    return null;
}

function getMaxDepth() {
    switch (difficulty) {
        case "easy":
            return 2; // Shallow search for easy difficulty
        case "medium":
            return 4; // Medium search depth
        case "hard":
            return 9; // Full search depth (unbeatable)
        default:
            return 9;
    }
}

function animateAIMove(index, callback) {
    const cell = cells[index];
    cell.style.transform = "scale(0)";
    cell.style.transition = "transform 0.3s ease";

    setTimeout(() => {
        cell.style.transform = "scale(1)";
        callback();
    }, 300);
}

function updateScore() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
}

function resetGame() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.style.transform = "scale(1)"; // Reset animations
    });
}

function toggleAI() {
    aiMode = !aiMode;
    aiToggleButton.textContent = `Play Against AI: ${aiMode ? "On" : "Off"}`;
    resetGame();
}

function setDifficulty() {
    difficulty = difficultySelect.value;
    resetGame();
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetButton.addEventListener("click", resetGame);
aiToggleButton.addEventListener("click", toggleAI);
difficultySelect.addEventListener("change", setDifficulty);