// Initialize variables
let grid = [];
let score = 0;
let isGameOver = false;

const gridSize = 4;
const scoreElement = document.getElementById('score');
const gridContainer = document.getElementById('grid-container');
const gameOverElement = document.getElementById('game-over');

// Create the initial grid
function createGrid() {
    grid = [];
    for (let i = 0; i < gridSize; i++) {
        const row = [];
        for (let j = 0; j < gridSize; j++) {
            row.push(0); // Empty cells are represented by 0
        }
        grid.push(row);
    }
    renderGrid();
    spawnTile();
    spawnTile();
}

// Render the grid to the screen
function renderGrid() {
    gridContainer.innerHTML = '';
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cellValue = grid[i][j];
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            if (cellValue !== 0) {
                cell.setAttribute('data-value', cellValue);
                cell.textContent = cellValue;
            }
            gridContainer.appendChild(cell);
        }
    }
    scoreElement.textContent = score;
}

// Spawn a new tile (either 2 or 4) in a random empty cell
function spawnTile() {
    const emptyCells = [];
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === 0) emptyCells.push({ i, j });
        }
    }
    if (emptyCells.length === 0) return;
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[randomCell.i][randomCell.j] = Math.random() < 0.9 ? 2 : 4;
    renderGrid();
}

// Handle keypress events for moving tiles
function handleKeyPress(event) {
    if (isGameOver) return;
    switch (event.key) {
        case 'ArrowUp':
            moveUp();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
    }
    checkGameOver();
}

// Move tiles up
function moveUp() {
    for (let col = 0; col < gridSize; col++) {
        const column = [];
        for (let row = 0; row < gridSize; row++) {
            if (grid[row][col] !== 0) column.push(grid[row][col]);
        }

        const mergedColumn = mergeTiles(column);
        for (let row = 0; row < gridSize; row++) {
            grid[row][col] = mergedColumn[row] || 0;
        }
    }
    spawnTile();
    renderGrid();
}

// Move tiles down
function moveDown() {
    for (let col = 0; col < gridSize; col++) {
        const column = [];
        for (let row = gridSize - 1; row >= 0; row--) {
            if (grid[row][col] !== 0) column.push(grid[row][col]);
        }

        const mergedColumn = mergeTiles(column.reverse());
        for (let row = gridSize - 1; row >= 0; row--) {
            grid[row][col] = mergedColumn[gridSize - 1 - row] || 0;
        }
    }
    spawnTile();
    renderGrid();
}

// Move tiles left
function moveLeft() {
    for (let row = 0; row < gridSize; row++) {
        const rowTiles = grid[row].filter(cell => cell !== 0);
        const mergedRow = mergeTiles(rowTiles);
        grid[row] = [...mergedRow, ...Array(gridSize - mergedRow.length).fill(0)];
    }
    spawnTile();
    renderGrid();
}

// Move tiles right
function moveRight() {
    for (let row = 0; row < gridSize; row++) {
        const rowTiles = grid[row].filter(cell => cell !== 0);
        const mergedRow = mergeTiles(rowTiles.reverse());
        grid[row] = [...Array(gridSize - mergedRow.length).fill(0), ...mergedRow.reverse()];
    }
    spawnTile();
    renderGrid();
}

// Merge tiles in a row or column
function mergeTiles(tiles) {
    let merged = [];
    let i = 0;
    while (i < tiles.length) {
        if (i + 1 < tiles.length && tiles[i] === tiles[i + 1]) {
            merged.push(tiles[i] * 2);
            score += tiles[i] * 2;
            i += 2;
        } else {
            merged.push(tiles[i]);
            i++;
        }
    }
    return merged;
}

// Check if the game is over
function checkGameOver() {
    if (grid.some(row => row.includes(2048))) {
        alert('You win!');
        isGameOver = true;
    }
    if (grid.every(row => row.every(cell => cell !== 0))) {
        alert('Game Over!');
        isGameOver = true;
    }
}

// Restart the game
function restartGame() {
    isGameOver = false;
    score = 0;
    createGrid();
    gameOverElement.classList.add('hidden');
}

// Initialize the game
createGrid();
document.addEventListener('keydown', handleKeyPress);
