function randomAI(position) {
    const moves = [
        {row: position.row - 1, col: position.col},
        {row: position.row + 1, col: position.col},
        {row: position.row, col: position.col - 1},
        {row: position.row, col: position.col + 1}
    ];
    return moves[Math.floor(Math.random() * moves.length)];
}

async function runGame() {
    console.log('Starting game...');
    
    gym.setScoring({
        eatDot: 50,
        moveStep: -5,
        caughtByGhost: -1000,
        completeLevel: 500
    });
    
    gym.reset();
    
    let steps = 0;
    const maxSteps = 500;
    
    while (steps < maxSteps) {
        console.log(`\nStep ${steps + 1}`);
        console.log(gym.getMap());
        
        const pacPos = gym.getPacmanPosition();
        const ghost0Pos = gym.getGhostPosition(0);
        const ghost1Pos = gym.getGhostPosition(1);
        
        console.log('Pacman:', pacPos);
        console.log('Ghost0:', ghost0Pos);
        console.log('Ghost1:', ghost1Pos);
        console.log('Score:', gym.getScore());
        console.log('Game over:', gym.isGameOver());
        console.log('Won:', gym.isWon());
        
        const moves = {
            pacman: randomAI(pacPos),
            ghost0: randomAI(ghost0Pos),
            ghost1: randomAI(ghost1Pos)
        };
        console.log('Moves:', moves);
        gym.step(moves);
        
        if (gym.isGameOver()) {
            console.log('\nGAME OVER!');
            console.log('Final score:', gym.getScore());
            break;
        }
        
        if (gym.isWon()) {
            console.log('\nYOU WIN!');
            console.log('Final score:', gym.getScore());
            break;
        }
        
        steps++;
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    if (steps >= maxSteps) {
        console.log(`\nMax steps reached`);
        console.log('Final score:', gym.getScore());
    }
    
    console.log('\nResetting...');
    gym.reset();
    console.log('Score:', gym.getScore());
    console.log('Pacman:', gym.getPacmanPosition());
}

window.runGame = runGame;
console.log('Type runGame() to start');