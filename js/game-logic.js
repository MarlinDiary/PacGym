const CHALLENGE_SCORING = Object.freeze({
    eatDot: 10,
    moveStep: 0,
    caughtByGhost: 0,
    completeLevel: 200
});

const MOVEMENT_DIRECTIONS = {
    1: 'up',
    2: 'down',
    3: 'left',
    4: 'right'
};

const DIRECTION_COMMANDS = {
    up: 1,
    down: 2,
    left: 3,
    right: 4
};

const CARDINAL_MOVES = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 }
];

function cloneMapState(map) {
    return {
        ...map,
        tiles: map.tiles.map(row => [...row]),
        playerPosition: map.playerPosition ? { ...map.playerPosition } : null,
        ghostPositions: map.ghostPositions.map(position => ({ ...position })),
        ghostPreviousPositions: map.ghostPreviousPositions
            ? map.ghostPreviousPositions.map(position => ({ ...position }))
            : undefined
    };
}

function getValidGhostMoves(map, position) {
    const moves = [];
    for (const delta of CARDINAL_MOVES) {
        const row = position.row + delta.row;
        const col = position.col + delta.col;
        if (isValidPosition(map.tiles, row, col)) {
            moves.push({ row, col });
        }
    }
    return moves;
}

function aStarNextMove(map, start, target) {
    const startKey = `${start.row},${start.col}`;
    const targetKey = `${target.row},${target.col}`;
    if (startKey === targetKey) {
        return { ...start };
    }

    const heuristic = (left, right) => (
        Math.abs(left.row - right.row) + Math.abs(left.col - right.col)
    );

    const gScore = new Map([[startKey, 0]]);
    const fScore = new Map([[startKey, heuristic(start, target)]]);
    const cameFrom = new Map();
    const openSet = new Set([startKey]);
    const closedSet = new Set();
    const keyToPosition = new Map([[startKey, start]]);

    while (openSet.size > 0) {
        let currentKey = null;
        let lowestF = Infinity;
        for (const key of openSet) {
            const score = fScore.get(key) ?? Infinity;
            if (score < lowestF) {
                lowestF = score;
                currentKey = key;
            }
        }

        if (currentKey == null) {
            break;
        }

        const current = keyToPosition.get(currentKey);
        if (!current) {
            break;
        }

        if (currentKey === targetKey) {
            const path = [];
            let pathKey = currentKey;
            while (cameFrom.has(pathKey)) {
                path.unshift(keyToPosition.get(pathKey));
                const previous = cameFrom.get(pathKey);
                pathKey = `${previous.row},${previous.col}`;
            }
            return path.length > 0 ? path[0] : null;
        }

        openSet.delete(currentKey);
        closedSet.add(currentKey);

        for (const neighbor of getValidGhostMoves(map, current)) {
            const neighborKey = `${neighbor.row},${neighbor.col}`;
            if (closedSet.has(neighborKey)) {
                continue;
            }

            const tentativeG = (gScore.get(currentKey) ?? Infinity) + 1;
            if (tentativeG >= (gScore.get(neighborKey) ?? Infinity)) {
                continue;
            }

            cameFrom.set(neighborKey, current);
            gScore.set(neighborKey, tentativeG);
            fScore.set(neighborKey, tentativeG + heuristic(neighbor, target));
            keyToPosition.set(neighborKey, neighbor);
            openSet.add(neighborKey);
        }
    }

    return null;
}

function smartPatrolGhostMove(map, ghostPosition, pacmanPosition) {
    const validMoves = getValidGhostMoves(map, ghostPosition);
    if (validMoves.length === 0) {
        return { ...ghostPosition };
    }

    return aStarNextMove(map, ghostPosition, pacmanPosition) ?? validMoves[0];
}

function mixedPursuitGhostMove(map, ghostPosition, pacmanPosition) {
    const validMoves = getValidGhostMoves(map, ghostPosition);
    if (validMoves.length === 0) {
        return { ...ghostPosition };
    }

    const nextMove = aStarNextMove(map, ghostPosition, pacmanPosition);
    if (Math.random() < 0.2) {
        const alternatives = validMoves.filter(move => (
            !nextMove ||
            move.row !== nextMove.row ||
            move.col !== nextMove.col
        ));
        if (alternatives.length > 0) {
            return alternatives[Math.floor(Math.random() * alternatives.length)];
        }
    }

    return nextMove ?? validMoves[0];
}

function checkVictoryCondition(map) {
    return countDots(map.tiles) === 0;
}

function checkCollision(currentPlayerPos, newPlayerPos, currentGhostPositions, nextGhostPositions) {
    for (const ghost of nextGhostPositions) {
        if (newPlayerPos.row === ghost.row && newPlayerPos.col === ghost.col) {
            return { hasCollision: true, collisionType: 'same-position' };
        }
    }

    for (let index = 0; index < currentGhostPositions.length; index++) {
        const currentGhost = currentGhostPositions[index];
        const nextGhost = nextGhostPositions[index];
        if (
            currentPlayerPos.row === nextGhost.row &&
            currentPlayerPos.col === nextGhost.col &&
            newPlayerPos.row === currentGhost.row &&
            newPlayerPos.col === currentGhost.col
        ) {
            return { hasCollision: true, collisionType: 'position-swap' };
        }
    }

    return { hasCollision: false, collisionType: null };
}

function updateGhostsOnly(currentMap) {
    const nextGhostPositions = currentMap.ghostPositions.map((ghost, index) => {
        if (index === 0) {
            return smartPatrolGhostMove(currentMap, ghost, currentMap.playerPosition);
        }
        return mixedPursuitGhostMove(currentMap, ghost, currentMap.playerPosition);
    });

    return {
        ...cloneMapState(currentMap),
        ghostPositions: nextGhostPositions,
        ghostPreviousPositions: currentMap.ghostPositions.map(position => ({ ...position })),
        gameOver: false
    };
}

function updateMapWithMovementAndGhosts(currentMap, command) {
    const nextGhostPositions = currentMap.ghostPositions.map((ghost, index) => {
        if (index === 0) {
            return smartPatrolGhostMove(currentMap, ghost, currentMap.playerPosition);
        }
        return mixedPursuitGhostMove(currentMap, ghost, currentMap.playerPosition);
    });

    const playerPosition = currentMap.playerPosition;
    let newRow = playerPosition.row;
    let newCol = playerPosition.col;
    let newDirection = playerPosition.direction;

    switch (command) {
        case 1:
            newRow = Math.max(0, playerPosition.row - 1);
            newDirection = 'up';
            break;
        case 2:
            newRow = Math.min(currentMap.height - 1, playerPosition.row + 1);
            newDirection = 'down';
            break;
        case 3:
            newCol = Math.max(0, playerPosition.col - 1);
            newDirection = 'left';
            break;
        case 4:
            newCol = Math.min(currentMap.width - 1, playerPosition.col + 1);
            newDirection = 'right';
            break;
        default:
            return updateGhostsOnly(currentMap);
    }

    const proposedPlayerPosition = { row: newRow, col: newCol };

    if (!isValidPosition(currentMap.tiles, newRow, newCol)) {
        const wallCollision = checkCollision(
            playerPosition,
            playerPosition,
            currentMap.ghostPositions,
            nextGhostPositions
        );

        return {
            ...cloneMapState(currentMap),
            ghostPositions: nextGhostPositions,
            ghostPreviousPositions: currentMap.ghostPositions.map(position => ({ ...position })),
            gameOver: wallCollision.hasCollision
        };
    }

    const collision = checkCollision(
        playerPosition,
        proposedPlayerPosition,
        currentMap.ghostPositions,
        nextGhostPositions
    );

    if (collision.hasCollision) {
        const playerAfterCollision = collision.collisionType === 'same-position'
            ? { row: newRow, col: newCol, direction: newDirection }
            : { row: playerPosition.row, col: playerPosition.col, direction: newDirection };

        return {
            ...cloneMapState(currentMap),
            playerPosition: playerAfterCollision,
            ghostPositions: nextGhostPositions,
            ghostPreviousPositions: currentMap.ghostPositions.map(position => ({ ...position })),
            gameOver: true
        };
    }

    const updatedTiles = currentMap.tiles.map(row => [...row]);
    if (updatedTiles[newRow][newCol] === '.') {
        updatedTiles[newRow][newCol] = ' ';
    }

    return {
        ...cloneMapState(currentMap),
        tiles: updatedTiles,
        playerPosition: {
            row: newRow,
            col: newCol,
            direction: newDirection
        },
        ghostPositions: nextGhostPositions,
        ghostPreviousPositions: currentMap.ghostPositions.map(position => ({ ...position })),
        gameOver: false
    };
}

function resolvePacmanCommand(currentPosition, move) {
    if (typeof move === 'number' && move >= 1 && move <= 4) {
        return move;
    }

    if (typeof move === 'string') {
        return DIRECTION_COMMANDS[move] ?? 0;
    }

    if (!move || typeof move.row !== 'number' || typeof move.col !== 'number') {
        return 0;
    }

    const dRow = move.row - currentPosition.row;
    const dCol = move.col - currentPosition.col;

    if (dRow === -1 && dCol === 0) return 1;
    if (dRow === 1 && dCol === 0) return 2;
    if (dRow === 0 && dCol === -1) return 3;
    if (dRow === 0 && dCol === 1) return 4;
    return 0;
}

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
        this.notifyListeners();
    }

    step(moves = {}) {
        if (this.gameOver || this.won) {
            return false;
        }

        const dotsBefore = countDots(this.map.tiles);
        const command = resolvePacmanCommand(this.map.playerPosition, moves.pacman);
        this.map = command >= 1 && command <= 4
            ? updateMapWithMovementAndGhosts(this.map, command)
            : updateGhostsOnly(this.map);

        const dotsAfter = countDots(this.map.tiles);
        this.score += Math.max(0, dotsBefore - dotsAfter) * CHALLENGE_SCORING.eatDot;
        this.gameOver = Boolean(this.map.gameOver);
        this.won = checkVictoryCondition(this.map);

        if (this.won) {
            this.score += CHALLENGE_SCORING.completeLevel;
        }

        this.notifyListeners();
        return true;
    }

    movePacMan(direction) {
        return this.step({ pacman: direction });
    }

    moveGhost() {
        console.warn('PacGym ghosts now follow challenge logic automatically; manual ghost moves are ignored.');
        return false;
    }

    moveGhosts() {
        console.warn('PacGym ghosts now follow challenge logic automatically; manual ghost moves are ignored.');
        return false;
    }

    getScoringRules() {
        return { ...CHALLENGE_SCORING };
    }

    setScoring() {
        console.warn('PacGym scoring is fixed to match the current challenge rules.');
        return this.getScoringRules();
    }

    getState() {
        return {
            map: {
                id: this.map.id,
                name: this.map.name,
                tiles: this.map.tiles.map(row => [...row]),
                width: this.map.width,
                height: this.map.height
            },
            pacman: { ...this.map.playerPosition },
            ghosts: this.map.ghostPositions.map(ghost => ({ ...ghost })),
            score: this.score,
            dotsLeft: countDots(this.map.tiles),
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
