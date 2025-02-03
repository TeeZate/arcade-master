// Improved Tower of Hanoi JavaScript
let selectedTower = null;
let disks = [];
let moves = 0;
let timerInterval;
let startTime;

const towers = document.querySelectorAll('.tower');
const difficultySelector = document.getElementById('difficulty');
const startGameButton = document.getElementById('start-game');
const timerDisplay = document.getElementById('time');
const messageDisplay = document.getElementById('message');

document.body.style.cursor = 'pointer'; // Set pointer cursor globally

towers.forEach(tower => {
    tower.style.cursor = 'pointer'; // Ensure towers also use pointer cursor
});

function initGame() {
    const difficulty = parseInt(difficultySelector.value);
    disks = Array.from({ length: difficulty }, (_, i) => difficulty - i); // Start with largest at bottom
    selectedTower = null;
    moves = 0;
    messageDisplay.textContent = '';
    clearInterval(timerInterval);
    timerDisplay.textContent = '00:00';

    towers.forEach(tower => tower.innerHTML = '');
    const tower1 = document.getElementById('tower-1');

    disks.forEach(diskSize => {
        const disk = document.createElement('div');
        disk.className = 'disk';
        disk.style.width = `${diskSize * 20}px`;
        disk.style.transition = 'transform 0.5s ease-in-out, box-shadow 0.3s ease-in-out';
        disk.dataset.size = diskSize;
        disk.style.cursor = 'pointer'; // Set pointer cursor for disks
        tower1.appendChild(disk);
    });

    towers.forEach(tower => {
        tower.addEventListener('click', () => handleTowerClick(tower));
    });
}

function handleTowerClick(tower) {
    if (!selectedTower) {
        if (tower.children.length > 0) {
            selectedTower = tower;
            tower.classList.add('selected');
        }
    } else {
        const disk = selectedTower.lastElementChild;
        const targetTower = tower;

        if (isValidMove(disk, targetTower)) {
            disk.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                targetTower.appendChild(disk);
                disk.style.transform = 'translateY(0)';
            }, 300);
            
            moves++;

            if (checkWin()) {
                clearInterval(timerInterval);
                messageDisplay.textContent = `You won in ${moves} moves!`;
                document.body.classList.add('game-won');
            }
        }
        selectedTower.classList.remove('selected');
        selectedTower = null;
    }
}

function isValidMove(disk, targetTower) {
    const topDisk = targetTower.lastElementChild;
    return !topDisk || parseInt(disk.dataset.size) < parseInt(topDisk.dataset.size);
}

function checkWin() {
    const tower3 = document.getElementById('tower-3');
    return tower3.children.length === disks.length;
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
        const seconds = (elapsedTime % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${minutes}:${seconds}`;
    }, 1000);
}

startGameButton.addEventListener('click', () => {
    document.body.classList.remove('game-won');
    initGame();
    startTimer();
});

// Add these adjustments to your existing JavaScript

function handleTowerClick(tower) {
  if (!selectedTower) {
      if (tower.children.length > 0) {
          selectedTower = tower;
          tower.classList.add('selected');
          const disk = tower.lastElementChild;
          disk.classList.add('selected'); // Highlight the selected disk
      }
  } else {
      const disk = selectedTower.lastElementChild;
      const targetTower = tower;

      if (isValidMove(disk, targetTower)) {
          disk.style.transform = 'translateY(-20px)';
          setTimeout(() => {
              targetTower.appendChild(disk);
              disk.style.transform = 'translateY(0)';
              disk.classList.remove('selected'); // Remove highlight after move
          }, 300);
          
          moves++;

          if (checkWin()) {
              clearInterval(timerInterval);
              messageDisplay.textContent = `You won in ${moves} moves!`;
              document.body.classList.add('game-won'); // Add win confirmation class
          }
      }
      selectedTower.classList.remove('selected');
      selectedTower = null;
  }
}

function checkWin() {
  const tower3 = document.getElementById('tower-3');
  return tower3.children.length === disks.length;
}
