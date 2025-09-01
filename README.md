## API

```javascript
gym.reset()

gym.getMap()
gym.getPacmanPosition()
gym.getGhostPosition(i)
gym.getScore()
gym.isGameOver()
gym.isWon()

gym.step(moves)

gym.setScoring(rules)
```

## Map
- `%` = Wall
- `.` = Dot
- ` ` = Empty space
- `P` = Pacman
- `G` = Ghost

## Movement

```javascript
moves = {
    pacman: {row: targetRow, col: targetCol},
    ghost0: {row: targetRow, col: targetCol},
    ghost1: {row: targetRow, col: targetCol}
}
```

## Scoring

```javascript
gym.setScoring({
    eatDot: 10,
    moveStep: -1,
    caughtByGhost: -200,
    completeLevel: 200
})
```

## Example

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