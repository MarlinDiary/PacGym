class GameEngine {
    constructor() {
        this.listeners = [];
        this.reset();
    }
    
    reset() {
        this.map = getInitialMap();
        this.score = 0;
        this.gameOver = false;
        this.won = false;
        this.dotsEaten = 0;
        this.totalDots = countDots(this.map.tiles);
        this.notifyListeners();
    }
    
    movePacMan(direction) {
        if (this.gameOver || this.won) {
            return false;
        }
        
        const pos = this.map.playerPosition;
        let newRow = pos.row;
        let newCol = pos.col;
        
        switch(direction) {
            case 'up':
                newRow = pos.row - 1;
                break;
            case 'down':
                newRow = pos.row + 1;
                break;
            case 'left':
                newCol = pos.col - 1;
                break;
            case 'right':
                newCol = pos.col + 1;
                break;
            default:
                return false;
        }
        
        if (!isValidPosition(this.map.tiles, newRow, newCol)) {
            return false;
        }
        
        pos.row = newRow;
        pos.col = newCol;
        
        const tile = this.map.tiles[newRow][newCol];
        if (tile === '.') {
            this.map.tiles[newRow][newCol] = ' ';
            this.score += 10;
            this.dotsEaten++;
        }
        
        this.score -= 1;
        
        if (this.dotsEaten === this.totalDots) {
            this.won = true;
            this.score += 200;
        }
        
        this.notifyListeners();
        return true;
    }
    
    moveGhost(ghostIndex, position) {
        if (ghostIndex < 0 || ghostIndex >= this.map.ghostPositions.length) {
            return false;
        }
        
        if (!isValidPosition(this.map.tiles, position.row, position.col)) {
            return false;
        }
        
        this.map.ghostPositions[ghostIndex] = {
            row: position.row,
            col: position.col
        };
        
        this.notifyListeners();
        return true;
    }
    
    moveGhosts(ghostMoves) {
        for (let i = 0; i < this.map.ghostPositions.length && i < ghostMoves.length; i++) {
            if (ghostMoves[i]) {
                this.moveGhost(i, ghostMoves[i]);
            }
        }
    }
    
    checkCollisions(oldPacmanPos, newPacmanPos, oldGhostPositions, newGhostPositions) {
        if (!oldPacmanPos || !newPacmanPos) {
            const pacman = this.map.playerPosition;
            for (const ghost of this.map.ghostPositions) {
                if (ghost.row === pacman.row && ghost.col === pacman.col) {
                    this.score -= 200;
                    this.gameOver = true;
                    return true;
                }
            }
            return false;
        }
        
        for (const ghost of newGhostPositions) {
            if (newPacmanPos.row === ghost.row && newPacmanPos.col === ghost.col) {
                this.score -= 200;
                this.gameOver = true;
                return true;
            }
        }
        
        for (let i = 0; i < oldGhostPositions.length; i++) {
            const oldGhost = oldGhostPositions[i];
            const newGhost = newGhostPositions[i];
            
            if (oldPacmanPos.row === newGhost.row && 
                oldPacmanPos.col === newGhost.col &&
                newPacmanPos.row === oldGhost.row && 
                newPacmanPos.col === oldGhost.col) {
                this.score -= 200;
                this.gameOver = true;
                return true;
            }
        }
        
        return false;
    }
    
    getState() {
        return {
            map: {
                tiles: this.map.tiles.map(row => [...row]),
                width: this.map.width,
                height: this.map.height
            },
            pacman: { ...this.map.playerPosition },
            ghosts: this.map.ghostPositions.map(g => ({ ...g })),
            score: this.score,
            dotsLeft: this.totalDots - this.dotsEaten,
            gameOver: this.gameOver,
            won: this.won
        };
    }
    
    addListener(callback) {
        this.listeners.push(callback);
    }
    
    notifyListeners() {
        const state = this.getState();
        this.listeners.forEach(callback => callback(state));
    }
}