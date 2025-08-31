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
    console.log('=== Starting Game with API Testing ===');
    
    console.log('\n1. Testing gym.reset()');
    const resetResult = gym.reset();
    console.log('   Reset result:', resetResult);
    
    let steps = 0;
    const maxSteps = 500;
    
    while (steps < maxSteps) {
        console.log(`\n--- Step ${steps + 1} ---`);
        
        console.log('Current map:');
        console.log(gym.getMap());
        
        console.log('\n2. Testing GET APIs:');
        
        const pacPos = gym.getPacmanPosition();
        console.log('   gym.getPacmanPosition():', pacPos);
        
        const ghost0Pos = gym.getGhostPosition(0);
        console.log('   gym.getGhostPosition(0):', ghost0Pos);
        
        const ghost1Pos = gym.getGhostPosition(1);
        console.log('   gym.getGhostPosition(1):', ghost1Pos);
        
        const score = gym.getScore();
        console.log('   gym.getScore():', score);
        
        const gameOver = gym.isGameOver();
        console.log('   gym.isGameOver():', gameOver);
        
        const won = gym.isWon();
        console.log('   gym.isWon():', won);
        
        const invalidGhost = gym.getGhostPosition(5);
        console.log('   gym.getGhostPosition(5) [invalid]:', invalidGhost);
        
        const moves = {
            pacman: randomAI(pacPos),
            ghost0: randomAI(ghost0Pos),
            ghost1: randomAI(ghost1Pos)
        };
        console.log('3. Executing moves:', moves);
        
        const stepResult = gym.step(moves);
        console.log('   gym.step() result:', stepResult);
        
        if (gym.isGameOver()) {
            console.log('\n=== GAME OVER ===');
            console.log('Final score:', gym.getScore());
            console.log('Testing step after game over:');
            const afterGameStep = gym.step(moves);
            console.log('   gym.step() after game over:', afterGameStep);
            break;
        }
        
        if (gym.isWon()) {
            console.log('\n=== VICTORY ===');
            console.log('Final score:', gym.getScore());
            break;
        }
        
        steps++;
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    if (steps >= maxSteps) {
        console.log(`\n=== Max steps (${maxSteps}) reached ===`);
        console.log('Final score:', gym.getScore());
    }
    
    console.log('\n4. Testing reset after game:');
    gym.reset();
    console.log('   Score after reset:', gym.getScore());
    console.log('   Game over after reset:', gym.isGameOver());
    console.log('   Pacman position after reset:', gym.getPacmanPosition());
}

window.runGame = runGame;
console.log('Type: runGame() to test all APIs');