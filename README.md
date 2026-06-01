# Trigonometry Practice

A collection of interactive multiplayer games and puzzles. Currently featuring **GRIDLOCK** and **CODEWORDS**.

## Games

### GRIDLOCK

A strategic 15×15 grid game where two players compete to reach each other's baseline while placing barriers to block their opponent's path.

**Rules:**
- **Players:** Two players, each with one token
- **Starting Positions:** Player 1 at (row 1, col 8), Player 2 at (row 15, col 8)
- **Win Condition:** Player 1 wins by reaching any tile on Row 15. Player 2 wins by reaching any tile on Row 1.
- **Actions (choose one per turn):**
  - **Move:** Move your token one tile in any direction (orthogonal or diagonal)
  - **Place Barrier:** Place a permanent barrier on any empty tile anywhere on the board
- **The Golden Rule:** You cannot place a barrier if it completely blocks the last remaining path for either player to reach their goal line

**Features:**
- Real-time BFS pathfinding to enforce the "can't block last path" rule
- Visual highlighting of valid moves and goal lines
- Cross-computer multiplayer with join codes

### CODEWORDS

A competitive Wordle-style game where each player chooses a secret word and takes turns guessing.

**Rules:**
- **Setup Phase:** Both players choose a 4-6 letter secret word
- **Guessing Phase:** Players take turns guessing the opponent's word
- **Feedback:**
  - 🟩 **Green:** Correct letter in correct position
  - 🟨 **Yellow:** Correct letter in wrong position
  - ⬜ **Gray:** Letter not in the word
- **Win Condition:** First player to guess the opponent's word wins. If you run out of guesses (6 max), you lose.

**Features:**
- Classic Wordle-style feedback system
- Cross-computer multiplayer with join codes
- Single player mode against the computer

## How to Play

### Starting a Game
1. Enter your player name (or use the default)
2. Select a game from the lobby
3. Choose **Single Player** or **Multiplayer**

### Multiplayer Modes

**Create Room:**
- Get a unique 6-character join code
- Share it with a friend
- Game starts automatically when opponent joins

**Join Room:**
- Enter a join code from a friend
- Game starts automatically when you join

## Installation

This is a static website with no backend dependencies. Simply open `index.html` in a web browser or deploy to any static hosting service.

### To Deploy on GitHub Pages:

1. Go to your repository settings
2. Under "Pages", set the source to the main branch
3. Your site will be available at `https://yourusername.github.io/trigonometry-practice`

## File Structure

```
.
├── index.html           # Main HTML entry point
├── app.js              # Game lobby, multiplayer, and state management
├── styles.css          # All styling
└── games/
    ├── gridlock/
    │   └── gridlock.js # Gridlock game implementation
    └── codewords/
        └── codewords.js # CODEWORDS game implementation
```

## Adding New Games

To add a new game:
1. Add the game metadata to the `games` object in `app.js`
2. Create the game file in `games/{gameName}/{gameName}.js`
3. Implement an `init{GameName}()` function that initializes the game
4. Add CSS classes to `styles.css` as needed
5. Both single-player and multiplayer will work automatically with the existing framework

## Technical Details

### Multiplayer Architecture
- Uses localStorage for cross-tab communication
- Room codes are 6-character alphanumeric strings
- Data is stored locally; works across different computers on the same network or with code sharing
- Easy to upgrade to WebSockets or a backend server in the future

## License

This project is open source and available under the MIT License.