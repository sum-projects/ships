const elements = {
    // Screens
    setupScreen: document.querySelector('#setup-screen'),
    placementScreen: document.querySelector('#placement-screen'),
    gameScreen: document.querySelector('#game-screen'),
    gameOverScreen: document.querySelector('#game-over-screen'),

    // Buttons
    startSetupBtn: document.querySelector('#start-setup-btn'),
    confirmPlacementBtn: document.querySelector('#confirm-placement-btn'),
    rotateBtn: document.querySelector('#rotate-btn'),
    restartBtn: document.querySelector('#restart-btn'),

    // Inputs
    player1NameInput: document.querySelector('#player1-name'),
    player2NameInput: document.querySelector('#player2-name'),

    // Boards
    placementBoard: document.querySelector('#placement-board'),
    player1Board: document.querySelector('#player1-board'),
    player2Board: document.querySelector('#player2-board'),

    // Game Elements
    placementInfo: document.querySelector('#placement-info'),
    shipCounters: {
        2: document.querySelector('#ship-2'),
        3: document.querySelector('#ship-3'),
        4: document.querySelector('#ship-4')
    },
    currentPlayerSpan: document.querySelector('#current-player'),
    player1Header: document.querySelector('#player1-header'),
    player2Header: document.querySelector('#player2-header'),
    player1Ships: document.querySelector('#player1-ships'),
    player2Ships: document.querySelector('#player2-ships'),
    winnerName: document.querySelector('#winner-name'),
};

const state = {
    players: [
        {
            name: 'Gracz 1',
            ships: [],
            shipsCount: 9,
            boards: Array.from({length: CONSTANTS.BOARD_SIZE}, () => Array.from({length: CONSTANTS.BOARD_SIZE}, () => 0)),
        },
        {
            name: 'Gracz 2',
            ships: [],
            shipsCount: 9,
            boards: Array.from({length: CONSTANTS.BOARD_SIZE}, () => Array.from({length: CONSTANTS.BOARD_SIZE}, () => 0)),
        }
    ],
    placement: {
        shipSize: 4,
        direction:  CONSTANTS.DIRECTION_HORIZONTAL,
        remainingShips: {
            2: CONSTANTS.SHIPS[2].count,
            3: CONSTANTS.SHIPS[3].count,
            4: CONSTANTS.SHIPS[4].count
        },
    },
    currentPlayer: 0,
    currentScreen: CONSTANTS.SCREEN.SETUP,
};

// Game Functions
function showPlacementPreview(x, y) {
    if (!state.placement.shipSize) return;

    const cells = elements.placementBoard.querySelectorAll('.cell');

    const isHorizontal = state.placement.direction === 'horizontal';

    const isValid = isValidPlacement(x, y, state.placement.shipSize, isHorizontal);

    for (let i = 0; i < state.placement.shipSize; i++) {
        const cellX = isHorizontal ? x + i : x;
        const cellY = isHorizontal ? y : y + i;

        // Sprawdź, czy komórka jest w granicach planszy
        if (cellX >= 0 && cellX < CONSTANTS.BOARD_SIZE && cellY >= 0 && cellY < CONSTANTS.BOARD_SIZE) {
            const index = cellY * CONSTANTS.BOARD_SIZE + cellX;
            cells[index].classList.add(isValid ? 'placement-hover' : 'placement-invalid');
        }
    }
}

function clearPlacementPreview() {
    const cells = elements.placementBoard.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('placement-hover', 'placement-invalid');
    });
}


function isValidPlacement(x, y, shipSize, isHorizontal) {
    if (isHorizontal) {
        if (x + shipSize > CONSTANTS.BOARD_SIZE) return false;
    } else {
        if (y + shipSize > CONSTANTS.BOARD_SIZE) return false;
    }

    // Sprawdź, czy statek nie koliduje z innymi statkami
    for (let i = 0; i < state.placement.shipSize; i++) {
        const cellX = isHorizontal ? x + i : x;
        const cellY = isHorizontal ? y : y + i;

        // Sprawdzenie, czy pole jest już zajęte
        if (state.players[state.currentPlayer].boards[cellY][cellX] === 1) {
            return false;
        }

        // Sprawdzenie sąsiednich pól (statki nie mogą się stykać)
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const nx = cellX + dx;
                const ny = cellY + dy;

                if (nx >= 0 && nx < CONSTANTS.BOARD_SIZE && ny >= 0 && ny < CONSTANTS.BOARD_SIZE) {
                    if (state.players[state.currentPlayer].boards[ny][nx] === 1) {
                        return false;
                    }
                }
            }
        }
    }

    return true;
}

function getShipName(size) {
    switch (size) {
        case 2:
            return CONSTANTS.SHIPS[2].name;
        case 3:
            return CONSTANTS.SHIPS[3].name;
        case 4:
            return CONSTANTS.SHIPS[4].name;
        default:
            return 'statki';
    }
}

function createBoard(board) {
    // Wyczyszczenie planszy
    board.innerHTML = '';

    for (let y = 0; y < CONSTANTS.BOARD_SIZE; y++) {
        for (let x = 0; x < CONSTANTS.BOARD_SIZE; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;
            board.appendChild(cell);
        }
    }
}







function findSunkShip(player, hitX, hitY) {
    // Znajdź statek, który został trafiony
    let hitShip = null;
    for (const ship of state.players[player].ships) {
        for (const [x, y] of ship) {
            if (x === hitX && y === hitY) {
                hitShip = ship;
                break;
            }
        }
        if (hitShip) break;
    }

    // Sprawdź, czy wszystkie komórki statku zostały trafione
    if (hitShip) {
        for (const [x, y] of hitShip) {
            if (state.players[player].boards[y][x] !== 2) {
                return null; // Nie wszystkie komórki statku zostały trafione
            }
        }
        return hitShip; // Wszystkie komórki statku zostały trafione - zwróć statek
    }

    return null; // Nie znaleziono statku
}

function markAroundSunkShip(player, ship) {
    for (const [shipX, shipY] of ship) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                // Pomijamy samą komórkę statku
                if (dx === 0 && dy === 0) continue;

                const nx = shipX + dx;
                const ny = shipY + dy;

                if (nx >= 0 && nx < CONSTANTS.BOARD_SIZE && ny >= 0 && ny < CONSTANTS.BOARD_SIZE) {
                    if (state.players[player].boards[ny][nx] === CONSTANTS.CELL_EMPTY || state.players[player].boards[ny][nx] === CONSTANTS.CELL_SHIP) {
                        state.players[player].boards[ny][nx] = CONSTANTS.CELL_MISS;

                        const boardElement = player === 0 ?
                            elements.player1Board : elements.player2Board;
                        const index = ny * CONSTANTS.BOARD_SIZE + nx;
                        const cell = boardElement.querySelectorAll('.cell')[index];

                        cell.classList.add('miss');
                    }
                }
            }
        }
    }
}


function rotateShip() {
    state.placement.direction = state.placement.direction === CONSTANTS.DIRECTION_HORIZONTAL ? CONSTANTS.DIRECTION_VERTICAL : CONSTANTS.DIRECTION_HORIZONTAL;
}





function restart() {
    // Reset stanu gry
    state.currentPlayer = 1;
    state.players[0].boards = Array.from({length: CONSTANTS.BOARD_SIZE}, () => Array.from({length: CONSTANTS.BOARD_SIZE}, () => 0));
    state.players[0].ships = [];
    state.players[0].shipsCount = 9;

    state.players[1].boards = Array.from({length: CONSTANTS.BOARD_SIZE}, () => Array.from({length: CONSTANTS.BOARD_SIZE}, () => 0));
    state.players[1].ships = [];
    state.players[1].shipsCount = 9;

    state.placement.remainingShips = {2: 4, 3: 3, 4: 2};
    state.placement.shipSize = 4;
    state.placement.direction = CONSTANTS.DIRECTION_HORIZONTAL;

    // Aktualizacja UI
    elements.player1Ships.textContent = 9;
    elements.player2Ships.textContent = 9;

    // Powrót do ekranu ustawiania nazw
    showScreen(CONSTANTS.SCREEN.SETUP);
}

function init() {
    elements.startSetupBtn.addEventListener('click', () => startPlacement());
    elements.confirmPlacementBtn.addEventListener('click', () => confirmPlacement());
    elements.rotateBtn.addEventListener('click', () => rotateShip());
    elements.restartBtn.addEventListener('click', () => restart());

    showScreen(CONSTANTS.SCREEN.SETUP);
}

init();