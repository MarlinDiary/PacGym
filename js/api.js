window.gym = {
    game: null,
    renderer: null,
    
    init: function() {
        this.game = new GameEngine();
        const mapDisplay = document.getElementById('map-display');
        if (mapDisplay) {
            this.renderer = new TextRenderer(mapDisplay);
        }
        return true;
    },
    
    reset: function() {
        if (!this.game) this.init();
        this.game.reset();
        if (this.renderer) {
            this.renderer.render();
            const scoreDisplay = document.getElementById('score');
            if (scoreDisplay) {
                scoreDisplay.textContent = this.game.score;
            }
        }
        return true;
    },
    
    getMap: function() {
        if (!this.game) return null;
        
        const state = this.game.getState();
        const map = state.map.tiles.map(row => [...row]);
        
        state.ghosts.forEach((ghost) => {
            map[ghost.row][ghost.col] = 'G';
        });
        
        if (!state.gameOver) {
            map[state.pacman.row][state.pacman.col] = 'P';
        }
        
        return map;
    },
    
    getPacmanPosition: function() {
        if (!this.game) return null;
        const state = this.game.getState();
        return {
            row: state.pacman.row,
            col: state.pacman.col
        };
    },
    
    getGhostPosition: function(index) {
        if (!this.game) return null;
        const state = this.game.getState();
        if (index < 0 || index >= state.ghosts.length) return null;
        return {
            row: state.ghosts[index].row,
            col: state.ghosts[index].col
        };
    },
    
    getScore: function() {
        if (!this.game) return 0;
        return this.game.score;
    },
    
    isGameOver: function() {
        if (!this.game) return false;
        return this.game.gameOver;
    },
    
    isWon: function() {
        if (!this.game) return false;
        return this.game.won;
    },
    
    step: function(moves) {
        if (!this.game) return false;
        if (this.game.gameOver || this.game.won) return false;
        
        if (!moves) {
            moves = {};
        }
        
        const oldPacmanPos = {
            row: this.game.map.playerPosition.row,
            col: this.game.map.playerPosition.col
        };
        const oldGhostPositions = this.game.map.ghostPositions.map(g => ({...g}));
        
        if (moves.pacman) {
            const currentPos = this.game.map.playerPosition;
            const targetPos = moves.pacman;
            
            const dRow = targetPos.row - currentPos.row;
            const dCol = targetPos.col - currentPos.col;
            
            let direction = null;
            if (dRow === -1 && dCol === 0) direction = 'up';
            else if (dRow === 1 && dCol === 0) direction = 'down';
            else if (dRow === 0 && dCol === -1) direction = 'left';
            else if (dRow === 0 && dCol === 1) direction = 'right';
            
            if (direction) {
                this.game.movePacMan(direction);
            }
        }
        
        const ghostMoves = [];
        if (moves.ghost0) ghostMoves[0] = moves.ghost0;
        if (moves.ghost1) ghostMoves[1] = moves.ghost1;
        
        if (moves.ghost0 || moves.ghost1) {
            this.game.moveGhosts(ghostMoves);
        }
        
        const newPacmanPos = {
            row: this.game.map.playerPosition.row,
            col: this.game.map.playerPosition.col
        };
        const newGhostPositions = this.game.map.ghostPositions.map(g => ({...g}));
        
        this.game.checkCollisions(oldPacmanPos, newPacmanPos, oldGhostPositions, newGhostPositions);
        
        if (this.renderer) {
            this.renderer.render();
            const scoreDisplay = document.getElementById('score');
            if (scoreDisplay) {
                scoreDisplay.textContent = this.game.score;
            }
        }
        
        return true;
    }
};