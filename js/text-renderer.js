class TextRenderer {
    constructor(element) {
        this.element = element;
    }
    
    render() {
        const map = gym.getMap();
        if (!map) return;
        
        this.element.textContent = map.map(row => row.join('')).join('\n');
    }
}