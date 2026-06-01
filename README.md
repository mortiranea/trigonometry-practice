# Trigonometry Practice

A collection of interactive games and puzzles. Currently featuring **GRIDLOCK** - a strategic grid-based game for two players.

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
- Responsive design works on desktop and mobile
- Easy return to lobby to play other games

## How to Play

1. Navigate to the website
2. Click on "GRIDLOCK" in the lobby
3. Choose to either Move your token or Place a barrier on your turn
4. First player to reach the opponent's baseline wins!

## Installation

This is a static website with no backend dependencies. Simply open `index.html` in a web browser or deploy to any static hosting service (GitHub Pages, Netlify, Vercel, etc.).

### To Deploy on GitHub Pages:

1. Go to your repository settings
2. Under "Pages", set the source to the main branch
3. Your site will be available at `https://yourusername.github.io/trigonometry-practice`

## File Structure

```
.
├── index.html           # Main HTML entry point
├── app.js              # Game lobby and state management
├── styles.css          # All styling
└── games/
    └── gridlock/
        └── gridlock.js # Gridlock game implementation
```

## Future Games

This template is ready to add more games! Follow the pattern:
1. Add the game metadata to the `games` object in `app.js`
2. Create the game file in `games/{gameName}/{gameName}.js`
3. Implement an `init{GameName}()` function that initializes the game
4. Use the existing CSS classes or add new ones to `styles.css`

## License

This project is open source and available under the MIT License.