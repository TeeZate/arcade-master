
        

            document.addEventListener('DOMContentLoaded', () => {
                const grid = document.getElementById('grid');
                const startButton = document.getElementById('start-button');
                const resetButton = document.getElementById('reset-button');
                const timeDisplay = document.getElementById('time');
                const leaderboardList = document.getElementById('leaderboard-list');
            
                const images = [
                    'images/cars.jpg', 'images/cars.jpg',
                    'images/bnny.jpg', 'images/bnny.jpg',
                    'images/lion.jpg', 'images/lion.jpg',
                    'images/astronaut.jpg', 'images/astronaut.jpg',
                    'images/basketball.webp', 'images/basketball.webp',
                    'images/monkey.jpg', 'images/monkey.jpg',
                    'images/sun.jpg', 'images/sun.jpg',
                    'images/elephant.jpg', 'images/elephant.jpg'
                ];
            
            
                let flippedTiles = [];
                let matchedTiles = [];
                let time = 0;
                let timerInterval;
                let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
                let gameStarted = false;
            
                // Initialize the game
                function initGame() {
                    grid.innerHTML = '';
                    flippedTiles = [];
                    matchedTiles = [];
                    time = 0;
                    timeDisplay.textContent = time;
                    clearInterval(timerInterval);
                    gameStarted = false;
            
                    // Shuffle images and create tiles
                    images.sort(() => Math.random() - 0.5);
                    images.forEach((image, index) => {
                        const tile = document.createElement('div');
                        tile.classList.add('tile', 'disabled');
                        tile.dataset.index = index;
                        tile.innerHTML = `<img src="${image}" alt="Memory Image">`;
                        tile.addEventListener('click', flipTile);
                        grid.appendChild(tile);
                    });
            
                    // Enable the Start Game button
                    startButton.disabled = false;
                    startButton.textContent = 'Start Game';
                }
            
                // Start the game
                function startGame() {
                    gameStarted = true;
                    startButton.disabled = true;
                    startButton.textContent = 'Game Started';
            
                    // Enable tiles
                    const tiles = document.querySelectorAll('.tile');
                    tiles.forEach(tile => tile.classList.remove('disabled'));
            
                    // Start the timer
                    timerInterval = setInterval(() => {
                        time++;
                        timeDisplay.textContent = time;
                    }, 1000);
                }
            
                // Flip a tile
                function flipTile() {
                    if (flippedTiles.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
                        this.classList.add('flipped');
                        flippedTiles.push(this);
            
                        if (flippedTiles.length === 2) {
                            setTimeout(checkMatch, 1000);
                        }
                    }
                }
            
                // Check if flipped tiles match
                function checkMatch() {
                    const [tile1, tile2] = flippedTiles;
                    const img1 = tile1.querySelector('img').src;
                    const img2 = tile2.querySelector('img').src;
            
                    if (img1 === img2) {
                        tile1.classList.add('matched');
                        tile2.classList.add('matched');
                        matchedTiles.push(tile1, tile2);
            
                        if (matchedTiles.length === images.length) {
                            clearInterval(timerInterval);
                            triggerConfetti();
                            const name = prompt('Congratulations! You won! Enter your name for the leaderboard:');
                            if (name) {
                                updateLeaderboard(name, time);
                            }
                        }
                    } else {
                        tile1.classList.remove('flipped');
                        tile2.classList.remove('flipped');
                    }
            
                    flippedTiles = [];
                }
            
                // Trigger confetti
                function triggerConfetti() {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }
            
                // Update the leaderboard with the user's name
                function updateLeaderboard(name, time) {
                    leaderboard.push({ name, time });
                    leaderboard.sort((a, b) => a.time - b.time); // Sort by fastest time
                    if (leaderboard.length > 5) leaderboard = leaderboard.slice(0, 5); // Keep top 5
                    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
                    renderLeaderboard();
                }
            
                // Render the leaderboard
                function renderLeaderboard() {
                    leaderboardList.innerHTML = leaderboard
                        .map((entry, index) => `<li>${index + 1}. ${entry.name} - ${entry.time}s</li>`)
                        .join('');
                }
            
                // Event listeners
                startButton.addEventListener('click', startGame);
                resetButton.addEventListener('click', initGame);
            
                // Initialize the game on page load
                initGame();
                renderLeaderboard();
            });