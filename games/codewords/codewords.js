// CODEWORDS (Competitive Wordle) Game Implementation

let codewordsState = {
    player1Word: '',
    player2Word: '',
    player1Guesses: [],
    player2Guesses: [],
    currentPlayer: 1,
    gamePhase: 'setup', // 'setup', 'guessing', 'gameOver'
    winner: null,
    isMultiplayer: false,
    currentGuess: '',
    maxGuesses: 6
};

function initCodewords() {
    codewordsState.isMultiplayer = gameState.opponentName && gameState.opponentName !== 'Computer';
    resetCodewords();
    renderCodewords();
}

function resetCodewords() {
    codewordsState.player1Word = '';
    codewordsState.player2Word = '';
    codewordsState.player1Guesses = [];
    codewordsState.player2Guesses = [];
    codewordsState.currentPlayer = 1;
    codewordsState.gamePhase = 'setup';
    codewordsState.winner = null;
    codewordsState.currentGuess = '';
}

function setPlayerWord(player, word) {
    const cleanWord = word.toUpperCase().trim();
    if (cleanWord.length < 4 || cleanWord.length > 6) {
        alert('Word must be 4-6 letters');
        return;
    }
    if (!/^[A-Z]+$/.test(cleanWord)) {
        alert('Word must contain only letters');
        return;
    }

    if (player === 1) {
        codewordsState.player1Word = cleanWord;
    } else {
        codewordsState.player2Word = cleanWord;
    }

    if (codewordsState.player1Word && codewordsState.player2Word) {
        codewordsState.gamePhase = 'guessing';
        codewordsState.currentPlayer = 1;
    }

    renderCodewords();
}

function checkGuess(playerNumber) {
    const guess = codewordsState.currentGuess.toUpperCase().trim();
    
    if (guess.length === 0) {
        alert('Enter a guess');
        return;
    }

    if (!/^[A-Z]+$/.test(guess)) {
        alert('Guess must contain only letters');
        return;
    }

    const targetWord = playerNumber === 1 ? codewordsState.player2Word : codewordsState.player1Word;
    const guesses = playerNumber === 1 ? codewordsState.player1Guesses : codewordsState.player2Guesses;
    const result = evaluateGuess(guess, targetWord);

    guesses.push({ word: guess, result });
    codewordsState.currentGuess = '';

    // Check for win
    if (guess === targetWord) {
        codewordsState.gamePhase = 'gameOver';
        codewordsState.winner = playerNumber;
    }

    // Switch players or check for loss
    if (codewordsState.gamePhase !== 'gameOver') {
        if (guesses.length >= codewordsState.maxGuesses) {
            // Current player lost
            codewordsState.gamePhase = 'gameOver';
            codewordsState.winner = playerNumber === 1 ? 2 : 1;
        } else {
            codewordsState.currentPlayer = codewordsState.currentPlayer === 1 ? 2 : 1;
        }
    }

    renderCodewords();
}

function evaluateGuess(guess, target) {
    const result = [];
    const targetLetters = target.split('');
    const guessLetters = guess.split('');
    const marked = new Array(targetLetters.length).fill(false);

    // First pass: mark greens
    for (let i = 0; i < guessLetters.length; i++) {
        if (guessLetters[i] === targetLetters[i]) {
            result[i] = 'green';
            marked[i] = true;
        }
    }

    // Second pass: mark yellows and grays
    for (let i = 0; i < guessLetters.length; i++) {
        if (result[i]) continue; // Already marked as green

        let found = false;
        for (let j = 0; j < targetLetters.length; j++) {
            if (!marked[j] && guessLetters[i] === targetLetters[j]) {
                result[i] = 'yellow';
                marked[j] = true;
                found = true;
                break;
            }
        }

        if (!found) {
            result[i] = 'gray';
        }
    }

    return result;
}

function getDisplayWord(word) {
    return word.split('').join(' ');
}

function renderCodewords() {
    const app = document.getElementById('app');

    if (codewordsState.gamePhase === 'setup') {
        let setupHTML = `
            <div class="game-container">
                <div class="game-header">
                    <h1 class="game-title">CODEWORDS</h1>
                    <button class="back-button" onclick="backToLobby()">← Back to Lobby</button>
                </div>
                <div class="game-info">
                    <strong>Setup:</strong> Each player chooses a secret word (4-6 letters). Then you'll take turns guessing!
                </div>
                <div class="codewords-container">
                    <div class="codewords-setup">
                        <div class="setup-title">${gameState.playerName}, choose your secret word:</div>
                        <input class="word-input" id="player1Input" type="text" placeholder="Your word" maxlength="6">
                        <button class="control-button" onclick="setPlayerWord(1, document.getElementById('player1Input').value)">Set Word</button>
                    </div>
        `;

        if (!codewordsState.isMultiplayer) {
            setupHTML += `
                    <div class="codewords-setup">
                        <div class="setup-title">Computer chooses its word...</div>
                        <div style="padding: 20px; color: #999;">Word set ✓</div>
                    </div>
            `;
        } else {
            const player2Name = gameState.opponentName;
            setupHTML += `
                    <div class="codewords-setup">
                        <div class="setup-title">${player2Name}, choose your secret word:</div>
                        <input class="word-input" id="player2Input" type="text" placeholder="Your word" maxlength="6">
                        <button class="control-button" onclick="setPlayerWord(2, document.getElementById('player2Input').value)">Set Word</button>
                    </div>
            `;
        }

        setupHTML += `
                </div>
            </div>
        `;

        if (!codewordsState.isMultiplayer && !codewordsState.player2Word) {
            // Auto-set computer's word
            const computerWords = ['PIXEL', 'BRAIN', 'GHOST', 'CLOUD', 'CROWN', 'DREAM', 'FLASH', 'GLASS', 'HEART', 'LIGHT', 'MUSIC', 'PIANO', 'QUEST', 'RIVER', 'SMILE', 'STORM', 'THINK', 'TOWER', 'WATCH', 'WORLD'];
            const computerWord = computerWords[Math.floor(Math.random() * computerWords.length)];
            codewordsState.player2Word = computerWord;
        }

        app.innerHTML = setupHTML;
    } else if (codewordsState.gamePhase === 'guessing') {
        const player1Guesses = codewordsState.player1Guesses;
        const player2Guesses = codewordsState.player2Guesses;

        let guessesHTML1 = '';
        if (player1Guesses.length > 0) {
            guessesHTML1 = `<div class="guesses-list">
                ${player1Guesses.map(g => `
                    <div class="guess-item">
                        ${g.result.map((color, i) => `<div class="letter ${color}">${g.word[i]}</div>`).join('')}
                    </div>
                `).join('')}
            </div>`;
        }

        let guessesHTML2 = '';
        if (player2Guesses.length > 0) {
            guessesHTML2 = `<div class="guesses-list">
                ${player2Guesses.map(g => `
                    <div class="guess-item">
                        ${g.result.map((color, i) => `<div class="letter ${color}">${g.word[i]}</div>`).join('')}
                    </div>
                `).join('')}
            </div>`;
        }

        const isPlayer1Turn = codewordsState.currentPlayer === 1;

        app.innerHTML = `
            <div class="game-container">
                <div class="game-header">
                    <h1 class="game-title">CODEWORDS</h1>
                    <button class="back-button" onclick="backToLobby()">← Back to Lobby</button>
                </div>
                <div class="codewords-container">
                    <div class="guessing-section">
                        <div class="player-section ${isPlayer1Turn ? 'active-player' : ''}">
                            <div class="player-section-title">${gameState.playerName}'s Turn</div>
                            <div class="guess-input-section">
                                <input class="guess-input" id="guessInput" type="text" placeholder="Your guess" maxlength="${codewordsState.player2Word.length}" onkeypress="if(event.key === 'Enter') checkGuess(1)">
                                <button class="guess-button" onclick="checkGuess(1)">Guess</button>
                            </div>
                            <div class="player-section-title">Attempts: ${codewordsState.player1Guesses.length}/${codewordsState.maxGuesses}</div>
                            ${guessesHTML1}
                        </div>
                        <div class="player-section ${!isPlayer1Turn ? 'active-player' : ''}">
                            <div class="player-section-title">${gameState.opponentName}'s Turn</div>
                            <div class="word-display">????</div>
                            <div class="player-section-title">Attempts: ${codewordsState.player2Guesses.length}/${codewordsState.maxGuesses}</div>
                            ${guessesHTML2}
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (isPlayer1Turn) {
            setTimeout(() => document.getElementById('guessInput').focus(), 100);
        }
    } else if (codewordsState.gamePhase === 'gameOver') {
        const winnerName = codewordsState.winner === 1 ? gameState.playerName : gameState.opponentName;
        const loserWord = codewordsState.winner === 1 ? codewordsState.player2Word : codewordsState.player1Word;

        app.innerHTML = `
            <div class="game-container">
                <div class="game-header">
                    <h1 class="game-title">CODEWORDS</h1>
                    <button class="back-button" onclick="backToLobby()">← Back to Lobby</button>
                </div>
                <div class="game-status winner">🎉 ${winnerName} wins! 🎉</div>
                <div style="text-align: center; padding: 30px; font-size: 1.1em;">
                    <p>The secret word was: <strong>${loserWord}</strong></p>
                </div>
                <div class="controls">
                    <button class="control-button" onclick="initCodewords()">🔄 New Game</button>
                    <button class="control-button" onclick="backToLobby()">← Back to Lobby</button>
                </div>
            </div>
        `;
    }
}