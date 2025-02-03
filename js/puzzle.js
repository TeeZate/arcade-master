const puzzleBoard = document.getElementById('puzzle-board');
const piecesContainer = document.getElementById('pieces-container');
const completedMessage = document.getElementById('completed-message');
const levelSelect = document.getElementById('level-select');
const startButton = document.getElementById('start-button');
const thumbnails = document.querySelectorAll('.thumbnail');
const timerDisplay = document.getElementById('time');
const leaderboardEntries = document.getElementById('leaderboard-entries');
const nameModal = document.getElementById('name-modal');
const playerNameInput = document.getElementById('player-name');
const submitNameButton = document.getElementById('submit-name');
const completionTimeDisplay = document.getElementById('completion-time');

let gridSize = 4; // Default grid size (Level 1: 4x4)
const pieceSize = 100; // Size of each piece
let imagePath = 'image1.jpg'; // Default image path
let timerInterval;
let startTime;
let completionTime;

// Leaderboard data structure
let leaderboard = {};

// Load leaderboard from localStorage
function loadLeaderboard() {
  const storedLeaderboard = localStorage.getItem('leaderboard');
  if (storedLeaderboard) {
    leaderboard = JSON.parse(storedLeaderboard);
  }
}

// Save leaderboard to localStorage
function saveLeaderboard() {
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

// Display leaderboard for the current image and level
function updateLeaderboard() {
  leaderboardEntries.innerHTML = '';
  const key = `${imagePath}-${gridSize}`; // Unique key for image + level
  if (leaderboard[key]) {
    leaderboard[key].forEach((entry, index) => {
      const entryDiv = document.createElement('div');
      entryDiv.classList.add('leaderboard-entry');
      entryDiv.innerHTML = `<span>${index + 1}. ${entry.name}</span><span>${entry.time}</span>`;
      leaderboardEntries.appendChild(entryDiv);
    });
  }
}

// Function to initialize the puzzle
function initializePuzzle() {
  puzzleBoard.innerHTML = '';
  piecesContainer.innerHTML = '';
  completedMessage.classList.remove('show');

  const pieces = [];
  const dropZones = [];

  // Calculate the total size of the puzzle grid
  const totalGridSize = gridSize * pieceSize;

  // Create drop zones
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const dropZone = document.createElement('div');
      dropZone.classList.add('drop-zone');
      dropZone.dataset.row = row;
      dropZone.dataset.col = col;

      dropZone.style.width = `${pieceSize}px`;
      dropZone.style.height = `${pieceSize}px`;

      dropZone.addEventListener('dragover', (e) => e.preventDefault());
      dropZone.addEventListener('drop', handleDrop);
      dropZone.addEventListener('dragenter', () => dropZone.classList.add('hovered'));
      dropZone.addEventListener('dragleave', () => dropZone.classList.remove('hovered'));

      puzzleBoard.appendChild(dropZone);
      dropZones.push(dropZone);
    }
  }

  // Create puzzle pieces
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const piece = document.createElement('div');
      piece.classList.add('puzzle-piece');
      piece.dataset.row = row;
      piece.dataset.col = col;

      piece.style.width = `${pieceSize}px`;
      piece.style.height = `${pieceSize}px`;

      // Set the background image and size dynamically
      piece.style.backgroundImage = `url(${imagePath})`;
      piece.style.backgroundSize = `${totalGridSize}px ${totalGridSize}px`;
      piece.style.backgroundPosition = `-${col * pieceSize}px -${row * pieceSize}px`;

      piece.draggable = true;
      piece.addEventListener('dragstart', handleDragStart);
      piece.addEventListener('dragend', handleDragEnd);

      pieces.push(piece);
    }
  }

  // Add shuffled pieces to the pieces grid
  pieces.sort(() => Math.random() - 0.5).forEach((piece) => piecesContainer.appendChild(piece));

  // Make the pieces grid a drop target
  piecesContainer.addEventListener('dragover', (e) => e.preventDefault());
  piecesContainer.addEventListener('drop', handleDrop);
}

function handleDragStart(event) {
  event.dataTransfer.setData('text/plain', `${event.target.dataset.row},${event.target.dataset.col}`);
  event.target.classList.add('dragging');
}

function handleDragEnd(event) {
  event.target.classList.remove('dragging');
}

function handleDrop(event) {
  event.preventDefault();
  const [draggedRow, draggedCol] = event.dataTransfer.getData('text/plain').split(',');
  const draggedPiece = document.querySelector(
    `.puzzle-piece[data-row="${draggedRow}"][data-col="${draggedCol}"]`
  );

  if (!draggedPiece) return;

  // Check if the drop target is the pieces grid
  if (event.target.classList.contains('pieces-grid')) {
    piecesContainer.appendChild(draggedPiece);
  }
  // Check if the drop target is a drop zone
  else if (event.target.classList.contains('drop-zone') && !event.target.hasChildNodes()) {
    event.target.appendChild(draggedPiece);
    event.target.classList.remove('hovered');
  }

  // Check if the puzzle is completed after moving the piece
  checkCompletion();
}

function checkCompletion() {
  const dropZones = document.querySelectorAll('.drop-zone');
  let isComplete = true;

  // Check if all drop zones are filled and pieces are in the correct position
  dropZones.forEach((zone) => {
    const piece = zone.querySelector('.puzzle-piece');
    if (!piece || zone.dataset.row !== piece.dataset.row || zone.dataset.col !== piece.dataset.col) {
      isComplete = false;
    }
  });

  // If all pieces are correctly placed, show the completion message and stop the timer
  if (isComplete) {
    stopTimer();
    completionTime = timerDisplay.textContent;
    completionTimeDisplay.textContent = completionTime;
    nameModal.style.display = 'flex';
  }
}

// Timer functions
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  stopTimer();
  timerDisplay.textContent = '00:00';
}

function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
  const seconds = (elapsedTime % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

// Confetti function
function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

// Event listener for the "Start Puzzle" button
startButton.addEventListener('click', () => {
  gridSize = parseInt(levelSelect.value); // Update grid size based on selected level
  puzzleBoard.style.gridTemplateColumns = `repeat(${gridSize}, ${pieceSize}px)`;
  puzzleBoard.style.gridTemplateRows = `repeat(${gridSize}, ${pieceSize}px)`;
  piecesContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${pieceSize}px)`;
  piecesContainer.style.gridTemplateRows = `repeat(${gridSize}, ${pieceSize}px)`;

  // Reset the timer and start it
  resetTimer();
  startTimer();

  // Reinitialize the puzzle with the new grid size
  initializePuzzle();
  // Update the leaderboard for the selected image and level
  updateLeaderboard();
});

// Event listeners for image selection
thumbnails.forEach((thumbnail) => {
  thumbnail.addEventListener('click', () => {
    // Remove the 'selected' class from all thumbnails
    thumbnails.forEach((t) => t.classList.remove('selected'));
    // Add the 'selected' class to the clicked thumbnail
    thumbnail.classList.add('selected');
    // Update the image path
    imagePath = thumbnail.getAttribute('data-image');
    // Reinitialize the puzzle with the new image
    initializePuzzle();
    // Update the leaderboard for the selected image and level
    updateLeaderboard();
  });
});

// Event listener for submitting the player's name
submitNameButton.addEventListener('click', () => {
  const playerName = playerNameInput.value.trim();
  if (playerName) {
    const key = `${imagePath}-${gridSize}`; // Unique key for image + level
    // Add the player's name and time to the leaderboard
    if (!leaderboard[key]) {
      leaderboard[key] = [];
    }
    leaderboard[key].push({ name: playerName, time: completionTime });
    // Sort the leaderboard by time (ascending)
    leaderboard[key].sort((a, b) => {
      const timeA = a.time.split(':').join('');
      const timeB = b.time.split(':').join('');
      return timeA - timeB;
    });
    // Keep only the top 5 entries
    leaderboard[key] = leaderboard[key].slice(0, 5);
    // Save the updated leaderboard to localStorage
    saveLeaderboard();
    // Update the displayed leaderboard
    updateLeaderboard();
    // Hide the modal
    nameModal.style.display = 'none';
    // Show the completed message
    completedMessage.classList.add('show');
    // Trigger confetti
    triggerConfetti();
  }
});

// Initialize the puzzle with the default level (Level 1: 4x4) and default image when the page loads
window.addEventListener('load', () => {
  puzzleBoard.style.gridTemplateColumns = `repeat(${gridSize}, ${pieceSize}px)`;
  puzzleBoard.style.gridTemplateRows = `repeat(${gridSize}, ${pieceSize}px)`;
  piecesContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${pieceSize}px)`;
  piecesContainer.style.gridTemplateRows = `repeat(${gridSize}, ${pieceSize}px)`;
  initializePuzzle();
  // Load the leaderboard from localStorage
  loadLeaderboard();
  // Update the leaderboard for the default image and level
  updateLeaderboard();
});