// GRIDLOCK Game Implementation
const BOARD_SIZE = 15;
const EMPTY = 0;
const PLAYER1 = 1;
const PLAYER2 = 2;
const BARRIER = 3;

let gridlockState = {
    board: [],
    player1Pos: { row: 0, col: 7 }, // row 1, col 8 (0-indexed: 0, 7)
    player2Pos: { row: 14, col: 7 }, // row 15, col 8 (0-indexed: 14, 7)
    currentPlayer: PLAYER1,
    gameOver: false,
    winner: null,
    selectedAction: null, // 'move' or 'barrier'
    validMoves: [],
    lastPathTiles: new Set() // Track tiles that are part of the last path
};

// Initialize the game
function initGridlock() {
    resetGridlock();
    renderGridlock();
}

function resetGridlock() {
    gridlockState.board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY));
    gridlockState.player1Pos = { row: 0, col: 7 };
    gridlockState.player2Pos = { row: 14, col: 7 };
    gridlockState.currentPlayer = PLAYER1;
    gridlockState.gameOver = false;
    gridlockState.winner = null;
    gridlockState.selectedAction = null;
    gridlockState.validMoves = [];
    gridlockState.lastPathTiles = new Set();
}

// BFS to find if a path exists from start to goal
function canReachGoal(startPos, goalRow, board) {
    const visited = new Set();
    const queue = [startPos];
    visited.add(`${startPos.row},${startPos.col}`);

    while (queue.length > 0) {
        const pos = queue.shift();

        // Check if reached goal
        if (pos.row === goalRow) {
            return true;
        }

        // Explore neighbors (8 directions)
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;

                const newRow = pos.row + dr;
                const newCol = pos.col + dc;
                const key = `${newRow},${newCol}`;

                // Check bounds and visited
                if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) continue;
                if (visited.has(key)) continue;

                // Check for obstacles
                const cell = board[newRow][newCol];
                if (cell === BARRIER) continue;
                if ((newRow === gridlockState.player1Pos.row && newCol === gridlockState.player1Pos.col) ||
                    (newRow === gridlockState.player2Pos.row && newCol === gridlockState.player2Pos.col)) {
                    continue;
                }

                visited.add(key);
                queue.push({ row: newRow, col: newCol });
            }
        }
    }

    return false;
}

// BFS to find all tiles that are part of a path to the goal (for visualization)
function findPathTiles(startPos, goalRow, board) {
    const visited = new Set();
    const pathTiles = new Set();
    const queue = [startPos];
    const parent = new Map();
    visited.add(`${startPos.row},${startPos.col}`);
    parent.set(`${startPos.row},${startPos.col}`, null);

    let reachedGoal = null;

    while (queue.length > 0) {
        const pos = queue.shift();

        if (pos.row === goalRow) {
            reachedGoal = pos;
            break;
        }

        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;

                const newRow = pos.row + dr;
                const newCol = pos.col + dc;
                const key = `${newRow},${newCol}`;

                if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) continue;
                if (visited.has(key)) continue;

                const cell = board[newRow][newCol];
                if (cell === BARRIER) continue;
                if ((newRow === gridlockState.player1Pos.row && newCol === gridlockState.player1Pos.col) ||
                    (newRow === gridlockState.player2Pos.row && newCol === gridlockState.player2Pos.col)) {
                    continue;
                }

                visited.add(key);
                parent.set(key, pos);
                queue.push({ row: newRow, col: newCol });
            }
        }
    }

    if (reachedGoal) {
        let current = reachedGoal;
        while (current) {
            pathTiles.add(`${current.row},${current.col}`);
            current = parent.get(`${current.row},${current.col}`);
        }
    }

    return pathTiles;
}

// Check if placing a barrier would block the last path
function wouldBlockLastPath(row, col) {
    const testBoard = gridlockState.board.map(r => [...r]);
    testBoard[row][col] = BARRIER;

    const player1CanReach = canReachGoal(gridlockState.player1Pos, BOARD_SIZE - 1, testBoard);
    const player2CanReach = canReachGoal(gridlockState.player2Pos, 0, testBoard);

    return !player1CanReach || !player2CanReach;
}

// Get valid moves for current player
function getValidMoves() {
    const pos = gridlockState.currentPlayer === PLAYER1 ? gridlockState.player1Pos : gridlockState.player2Pos;
    const moves = [];

    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;

            const newRow = pos.row + dr;
            const newCol = pos.col + dc;

            if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) continue;

            const cell = gridlockState.board[newRow][newCol];
            if (cell === BARRIER) continue;
            if ((newRow === gridlockState.player1Pos.row && newCol === gridlockState.player1Pos.col) ||
                (newRow === gridlockState.player2Pos.row && newCol === gridlockState.player2Pos.col)) {
                continue;
            }

            moves.push({ row: newRow, col: newCol });
        }
    }

    return moves;
}

// Get valid barrier placements for current player
function getValidBarriers() {
    const validBarriers = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (gridlockState.board[row][col] === EMPTY) {
                if (!wouldBlockLastPath(row, col)) {
                    validBarriers.push({ row, col });
                }
            }
        }
    }

    return validBarriers;
}

// Select action (move or barrier)
function selectAction(action) {
    gridlockState.selectedAction = action;

    if (action === 'move') {
        gridlockState.validMoves = getValidMoves();
    }

    renderGridlock();
}

// Move the current player
function makeMove(row, col) {
    if (gridlockState.selectedAction !== 'move') return;

    const validMove = gridlockState.validMoves.some(m => m.row === row && m.col === col);
    if (!validMove) return;

    // Update player position
    if (gridlockState.currentPlayer === PLAYER1) {
        gridlockState.player1Pos = { row, col };
    } else {
        gridlockState.player2Pos = { row, col };
    }

    // Check win condition
    if (gridlockState.currentPlayer === PLAYER1 && row === BOARD_SIZE - 1) {
        gridlockState.gameOver = true;
        gridlockState.winner = 1;
    } else if (gridlockState.currentPlayer === PLAYER2 && row === 0) {
        gridlockState.gameOver = true;
        gridlockState.winner = 2;
    }

    // Reset and switch player
    gridlockState.selectedAction = null;
    gridlockState.validMoves = [];
    if (!gridlockState.gameOver) {
        gridlockState.currentPlayer = gridlockState.currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1;
    }

    renderGridlock();
}

// Place a barrier
function placeBarrier(row, col) {
    if (gridlockState.selectedAction !== 'barrier') return;
    if (gridlockState.board[row][col] !== EMPTY) return;
    if (wouldBlockLastPath(row, col)) return;

    gridlockState.board[row][col] = BARRIER;

    // Reset and switch player
    gridlockState.selectedAction = null;
    gridlockState.validMoves = [];
    gridlockState.currentPlayer = gridlockState.currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1;

    renderGridlock();
}

// Handle tile click
function onTileClick(row, col) {
    if (gridlockState.gameOver) return;

    if (gridlockState.selectedAction === 'move') {
        makeMove(row, col);
    } else if (gridlockState.selectedAction === 'barrier') {
        placeBarrier(row, col);
    }
}

// Render the game
function renderGridlock() {
    const app = document.getElementById('app');

    let boardHTML = '<div class="board">';
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            let classes = 'tile';
            let content = '';

            // Goal lines
            if (row === 0) classes += ' goal-line-2';
            if (row === BOARD_SIZE - 1) classes += ' goal-line-1';

            // Cell content
            if (gridlockState.board[row][col] === BARRIER) {
                classes += ' barrier';
                content = '■';
            } else if (gridlockState.player1Pos.row === row && gridlockState.player1Pos.col === col) {
                classes += ' player1';
                content = 'P1';
            } else if (gridlockState.player2Pos.row === row && gridlockState.player2Pos.col === col) {
                classes += ' player2';
                content = 'P2';
            } else if (gridlockState.validMoves.some(m => m.row === row && m.col === col)) {
                classes += ' valid-move';
                content = '✓';
            }

            boardHTML += `<div class="${classes}" onclick="onTileClick(${row}, ${col})">${content}</div>`;
        }
    }
    boardHTML += '</div>';

    const moveButtonClass = gridlockState.selectedAction === 'move' ? 'control-button active' : 'control-button';
    const barrierButtonClass = gridlockState.selectedAction === 'barrier' ? 'control-button active' : 'control-button';

    let statusHTML = '';
    if (gridlockState.gameOver) {
        statusHTML = `<div class="game-status winner">🎉 Player ${gridlockState.winner} wins! 🎉</div>`;
    } else {
        statusHTML = `<div class="game-status">
            <span class="player-indicator ${gridlockState.currentPlayer === PLAYER1 ? 'p1' : 'p2'}"></span>
            Player ${gridlockState.currentPlayer}'s turn - Choose an action
        </div>`;
    }

    app.innerHTML = `
        <div class="game-container">
            <div class="game-header">
                <h1 class="game-title">GRIDLOCK</h1>
                <button class="back-button" onclick="backToLobby()">← Back to Lobby</button>
            </div>
            <div class="game-info">
                <strong>Objective:</strong> Player 1 must reach Row 15. Player 2 must reach Row 1. You can move one tile or place a barrier (without blocking paths).
            </div>
            <div class="gridlock-container">
                <div class="board-wrapper">
                    ${boardHTML}
                </div>
                ${statusHTML}
                <div class="player-status">
                    <div class="player-info ${gridlockState.currentPlayer === PLAYER1 ? 'active' : ''}">
                        <span class="player-indicator p1"></span>Player 1 (Blue) - Goal: Row 15
                    </div>
                    <div class="player-info ${gridlockState.currentPlayer === PLAYER2 ? 'active' : ''}">
                        <span class="player-indicator p2"></span>Player 2 (Purple) - Goal: Row 1
                    </div>
                </div>
                <div class="controls">
                    <button class="${moveButtonClass}" onclick="selectAction('move')" ${gridlockState.gameOver ? 'disabled' : ''}>
                        ↔️ Move Token
                    </button>
                    <button class="${barrierButtonClass}" onclick="selectAction('barrier')" ${gridlockState.gameOver ? 'disabled' : ''}>
                        🧱 Place Barrier
                    </button>
                    <button class="control-button" onclick="resetGridlock(); renderGridlock()">🔄 New Game</button>
                </div>
            </div>
        </div>
    `;
}