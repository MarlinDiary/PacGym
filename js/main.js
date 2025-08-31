(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const mapDisplay = document.getElementById('map-display');
        const scoreDisplay = document.getElementById('score');
        
        if (!mapDisplay || !scoreDisplay) {
            console.error('Display elements not found');
            return;
        }
        
        const game = new GameEngine();
        const renderer = new TextRenderer(mapDisplay);
        
        gym.game = game;
        gym.renderer = renderer;
        
        game.addListener(function(state) {
            scoreDisplay.textContent = state.score;
            
            renderer.render();
        });
        
        const initialState = game.getState();
        renderer.render();
        scoreDisplay.textContent = initialState.score;
    });
})();