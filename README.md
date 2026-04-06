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
    pacman: {row: targetRow, col: targetCol}
}
```

Also supported:

```javascript
gym.step({ pacman: 'left' })
gym.step({ pacman: 3 })
```

Ghosts are not manually controlled. They now follow the same challenge logic as `PacAsm`:
- Ghost 0: deterministic A* pursuit
- Ghost 1: 80% A* pursuit, 20% legal non-A* diversion
- Pacman and ghosts move simultaneously
- Wall collisions, same-tile collisions, and swap collisions follow the challenge rules

## Scoring

Scoring is fixed to match the current `challenge`:

```javascript
{
    eatDot: 10,
    moveStep: 0,
    caughtByGhost: 0,
    completeLevel: 200
}
```

## Example

```javascript
gym.reset()

while (!gym.isGameOver() && !gym.isWon()) {
    const pacPos = gym.getPacmanPosition()
    
    const moves = {
        pacman: computePacmanMove(pacPos)
    }
    
    gym.step(moves)
}

console.log('Final score:', gym.getScore())
```
