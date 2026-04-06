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
        
        if (state.pacman) {
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
        if (!this.game) this.init();
        const didStep = this.game.step(moves);
        
        if (this.renderer) {
            this.renderer.render();
            const scoreDisplay = document.getElementById('score');
            if (scoreDisplay) {
                scoreDisplay.textContent = this.game.score;
            }
        }
        
        return didStep;
    },
    
    setScoring: function(rules) {
        if (!this.game) this.init();
        return this.game.setScoring(rules);
    }
};
