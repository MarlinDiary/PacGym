# PacGym

## API Reference

### Core Methods

```javascript
gym.reset()

gym.getMap()
gym.getPacmanPosition()
gym.getGhostPosition(i)
gym.getScore()
gym.isGameOver()
gym.isWon()

gym.step(moves)
```

### Map Representation
- `%` = Wall
- `.` = Dot
- ` ` = Empty space
- `P` = Pacman
- `G` = Ghost

### Movement Format
```javascript
moves = {
    pacman: {row: targetRow, col: targetCol},
    ghost0: {row: targetRow, col: targetCol},
    ghost1: {row: targetRow, col: targetCol}
}
```

### Scoring System
- Eat dot: +10 points
- Each move: -1 point
- Caught by ghost: -200 points
- Complete level: +200 points

## Example Usage

```javascript
gym.reset()

while (!gym.isGameOver() && !gym.isWon()) {
    const pacPos = gym.getPacmanPosition()
    const ghost0Pos = gym.getGhostPosition(0)
    const ghost1Pos = gym.getGhostPosition(1)
    
    const moves = {
        pacman: computePacmanMove(pacPos),
        ghost0: computeGhostMove(ghost0Pos),
        ghost1: computeGhostMove(ghost1Pos)
    }
    
    gym.step(moves)
}

console.log('Final score:', gym.getScore())
```