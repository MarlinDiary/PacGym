const DEFAULT_MAP = {
    width: 20,
    height: 11,
    layout: [
        '%%%%%%%%%%%%%%%%%%%%',
        '%........%%........%',
        '%.%%.%%%.%%.%%%.%%.%',
        '%..................%',
        '%.%%.%.%%%%%%.%.%%.%',
        '%....%...%%...%....%',
        '%.%%.%%%.%%.%%%.%%.%',
        '%........P.........%',
        '%.%%.%%%.%%.%%%.%%.%',
        '%..................%',
        '%%%%%%%%%%%%%%%%%%%%'
    ],
    pacmanStart: { row: 7, col: 9 },
    ghostStarts: [
        { row: 5, col: 8 },
        { row: 5, col: 11 }
    ]
};

function layoutToTiles(layout) {
    const tiles = [];
    for (let row = 0; row < layout.length; row++) {
        const tileRow = [];
        for (let col = 0; col < layout[row].length; col++) {
            const char = layout[row][col];
            if (char === 'P') {
                tileRow.push(' ');
            } else if (char === 'G') {
                tileRow.push(' ');
            } else {
                tileRow.push(char);
            }
        }
        tiles.push(tileRow);
    }
    return tiles;
}

function getInitialMap() {
    const map = {
        ...DEFAULT_MAP,
        tiles: layoutToTiles(DEFAULT_MAP.layout),
        playerPosition: { ...DEFAULT_MAP.pacmanStart },
        ghostPositions: DEFAULT_MAP.ghostStarts.map(pos => ({ ...pos }))
    };
    delete map.layout;
    delete map.pacmanStart;
    delete map.ghostStarts;
    return map;
}

function countDots(tiles) {
    let count = 0;
    for (let row = 0; row < tiles.length; row++) {
        for (let col = 0; col < tiles[row].length; col++) {
            if (tiles[row][col] === '.') {
                count++;
            }
        }
    }
    return count;
}

function isValidPosition(tiles, row, col) {
    if (row < 0 || row >= tiles.length || col < 0 || col >= tiles[0].length) {
        return false;
    }
    return tiles[row][col] !== '%';
}