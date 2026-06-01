// Game state management
const gameState = {
    currentScreen: 'lobby', // 'lobby', 'game-{gameId}', 'game-mode-{gameId}'
    currentGame: null,
    playerName: localStorage.getItem('playerName') || 'Player' + Math.floor(Math.random() * 1000),
    isHost: false,
    roomCode: null,
    opponentName: null,
    socket: null
};

// Game registry
const games = {
    gridlock: {
        id: 'gridlock',
        title: 'GRIDLOCK',
        description: 'A strategic grid-based game where two players race to reach the opponent\'s baseline while placing barriers to block their path.',
        hasMultiplayer: true
    },
    codewords: {
        id: 'codewords',
        title: 'CODEWORDS',
        description: 'Competitive Wordle! Choose a secret word and take turns guessing. First to crack the code wins!',
        hasMultiplayer: true
    }
};

// Simple WebSocket-like connection using fetch polling
const serverAPI = {
    async createRoom(gameId, playerName) {
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const room = {
            roomCode,
            gameId,
            host: playerName,
            guest: null,
            hostData: null,
            guestData: null,
            createdAt: Date.now()
        };
        localStorage.setItem(`room_${roomCode}`, JSON.stringify(room));
        return roomCode;
    },

    async joinRoom(roomCode, playerName) {
        const roomData = localStorage.getItem(`room_${roomCode}`);
        if (!roomData) return null;
        const room = JSON.parse(roomData);
        room.guest = playerName;
        localStorage.setItem(`room_${roomCode}`, JSON.stringify(room));
        return room;
    },

    async getRoomData(roomCode) {
        const roomData = localStorage.getItem(`room_${roomCode}`);
        return roomData ? JSON.parse(roomData) : null;
    },

    async updateRoomData(roomCode, updates) {
        const room = await this.getRoomData(roomCode);
        if (room) {
            const updated = { ...room, ...updates };
            localStorage.setItem(`room_${roomCode}`, JSON.stringify(updated));
            return updated;
        }
    }
};

function renderLobby() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="lobby-container">
            <div class="lobby-header">
                <h1 class="lobby-title">Trigonometry Practice</h1>
                <div class="player-name-section">
                    <span>Playing as: <strong>${gameState.playerName}</strong></span>
                    <button class="small-button" onclick="changePlayerName()">Change</button>
                </div>
            </div>
            <p class="lobby-subtitle">Select a game to play</p>
            <div class="games-grid">
                ${Object.values(games).map(game => `
                    <button class="game-card" onclick="selectGameMode('${game.id}')">
                        <div class="game-card-title">${game.title}</div>
                        <div class="game-card-description">${game.description}</div>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function changePlayerName() {
    const newName = prompt('Enter your player name:', gameState.playerName);
    if (newName && newName.trim()) {
        gameState.playerName = newName.trim();
        localStorage.setItem('playerName', gameState.playerName);
        renderLobby();
    }
}

function selectGameMode(gameId) {
    gameState.currentGame = gameId;
    gameState.currentScreen = `game-mode-${gameId}`;
    renderGameModeSelection();
}

function renderGameModeSelection() {
    const app = document.getElementById('app');
    const game = games[gameState.currentGame];
    
    app.innerHTML = `
        <div class="game-container">
            <div class="game-header">
                <h1 class="game-title">${game.title}</h1>
                <button class="back-button" onclick="backToLobby()">← Back to Lobby</button>
            </div>
            <div class="game-mode-selection">
                <button class="mode-card" onclick="startSingleplayer('${gameState.currentGame}')">
                    <div class="mode-title">Single Player</div>
                    <div class="mode-description">Play against the computer</div>
                </button>
                <button class="mode-card" onclick="showMultiplayerOptions('${gameState.currentGame}')">
                    <div class="mode-title">Multiplayer</div>
                    <div class="mode-description">Play with another person online</div>
                </button>
            </div>
        </div>
    `;
}

function startSingleplayer(gameId) {
    gameState.currentScreen = `game-${gameId}`;
    gameState.opponentName = 'Computer';
    
    if (gameId === 'gridlock') {
        initGridlock();
    } else if (gameId === 'codewords') {
        initCodewords();
    }
}

function showMultiplayerOptions(gameId) {
    const app = document.getElementById('app');
    const game = games[gameId];
    
    app.innerHTML = `
        <div class="game-container">
            <div class="game-header">
                <h1 class="game-title">${game.title} - Multiplayer</h1>
                <button class="back-button" onclick="backToLobby()">← Back to Lobby</button>
            </div>
            <div class="multiplayer-section">
                <button class="multiplayer-button" onclick="createGameRoom('${gameId}')">
                    <div class="button-icon">🔗</div>
                    <div class="button-text">Create Room</div>
                    <div class="button-subtext">Get a join code to share</div>
                </button>
                <button class="multiplayer-button" onclick="showJoinRoomPrompt('${gameId}')">
                    <div class="button-icon">🚪</div>
                    <div class="button-text">Join Room</div>
                    <div class="button-subtext">Enter a join code</div>
                </button>
            </div>
        </div>
    `;
}

async function createGameRoom(gameId) {
    const roomCode = await serverAPI.createRoom(gameId, gameState.playerName);
    gameState.roomCode = roomCode;
    gameState.isHost = true;
    showWaitingForOpponent(gameId, roomCode);
}

function showJoinRoomPrompt(gameId) {
    const roomCode = prompt('Enter the room code:').toUpperCase();
    if (roomCode && roomCode.length === 6) {
        joinGameRoom(gameId, roomCode);
    } else {
        alert('Invalid room code');
    }
}

async function joinGameRoom(gameId, roomCode) {
    const room = await serverAPI.joinRoom(roomCode, gameState.playerName);
    if (!room) {
        alert('Room not found or already full');
        return;
    }
    
    gameState.roomCode = roomCode;
    gameState.isHost = false;
    gameState.opponentName = room.host;
    startMultiplayerGame(gameId);
}

function showWaitingForOpponent(gameId, roomCode) {
    const app = document.getElementById('app');
    let checkCount = 0;
    
    const checkForOpponent = async () => {
        const room = await serverAPI.getRoomData(roomCode);
        if (room && room.guest) {
            gameState.opponentName = room.guest;
            startMultiplayerGame(gameId);
        } else {
            checkCount++;
            if (checkCount < 120) { // Check for 2 minutes
                setTimeout(checkForOpponent, 1000);
            }
        }
    };
    
    app.innerHTML = `
        <div class="game-container">
            <div class="game-header">
                <h1 class="game-title">Waiting for Opponent...</h1>
                <button class="back-button" onclick="backToLobby()">← Cancel</button>
            </div>
            <div class="waiting-section">
                <div class="waiting-spinner"></div>
                <p>Share this code with a friend:</p>
                <div class="room-code-display">${roomCode}</div>
                <button class="control-button" onclick="copyToClipboard('${roomCode}')">📋 Copy Code</button>
                <p class="waiting-text">Waiting for opponent to join...</p>
            </div>
        </div>
    `;
    
    checkForOpponent();
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert('Room code copied to clipboard!');
}

function startMultiplayerGame(gameId) {
    gameState.currentScreen = `game-${gameId}`;
    
    if (gameId === 'gridlock') {
        initGridlock();
    } else if (gameId === 'codewords') {
        initCodewords();
    }
}

function backToLobby() {
    gameState.currentScreen = 'lobby';
    gameState.currentGame = null;
    gameState.roomCode = null;
    gameState.isHost = false;
    gameState.opponentName = null;
    renderLobby();
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    renderLobby();
});