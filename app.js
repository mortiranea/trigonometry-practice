// Game state management
const gameState = {
    currentScreen: 'lobby', // 'lobby' or 'game-{gameId}'
    currentGame: null
};

// Game registry
const games = {
    gridlock: {
        id: 'gridlock',
        title: 'GRIDLOCK',
        description: 'A strategic grid-based game where two players race to reach the opponent\'s baseline while placing barriers to block their path.'
    }
};

function renderLobby() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="lobby-container">
            <h1 class="lobby-title">Trigonometry Practice</h1>
            <p class="lobby-subtitle">Select a game to play</p>
            <div class="games-grid">
                ${Object.values(games).map(game => `
                    <button class="game-card" onclick="startGame('${game.id}')">
                        <div class="game-card-title">${game.title}</div>
                        <div class="game-card-description">${game.description}</div>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function startGame(gameId) {
    gameState.currentScreen = `game-${gameId}`;
    gameState.currentGame = gameId;
    
    if (gameId === 'gridlock') {
        initGridlock();
    }
}

function backToLobby() {
    gameState.currentScreen = 'lobby';
    gameState.currentGame = null;
    renderLobby();
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    renderLobby();
});