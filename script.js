const elements = {
    // Screens
    setupScreen: document.querySelector('#setup-screen'),
    placementScreen: document.querySelector('#placement-screen'),
    gameScreen: document.querySelector('#game-screen'),

    // Buttons
    startSetupBtn: document.querySelector('#start-setup-btn'),
    confirmPlacementBtn: document.querySelector('#confirm-placement-btn'),
    rotateBtn: document.querySelector('#rotate-btn'),

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

};

const state = {
    players: [
        {
            name: 'Gracz 1',
            ships: [],
            shipsCount: 9,
            boards: Array.from({length: 10}, () => Array.from({length: 10}, () => 0)),
        },
        {
            name: 'Gracz 2',
            ships: [],
            shipsCount: 9,
            boards: Array.from({length: 10}, () => Array.from({length: 10}, () => 0)),
        }
    ],
    placement: {
        shipSize: 4,
        direction: 'horizontal',
        remainingShips: {
            2: 4,
            3: 3,
            4: 2,
        },
    },
    currentPlayer: 0,
    currentScreen: 'setup',
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
        if (cellX >= 0 && cellX < 10 && cellY >= 0 && cellY < 10) {
            const index = cellY * 10 + cellX;
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

function placeShip(x, y) {
    if (!state.placement.shipSize) return;

    const isHorizontal = state.placement.direction === 'horizontal';
    const shipSize = state.placement.shipSize;
    const currentPlayer = state.currentPlayer;

    if (!isValidPlacement(x, y, shipSize, isHorizontal)) {
        return;
    }

    const shipCells = [];
    for (let i = 0; i < shipSize; i++) {
        const cellX = isHorizontal ? x + i : x;
        const cellY = isHorizontal ? y : y + i;

        // Zaznacz komórkę jako zajętą
        state.players[currentPlayer].boards[cellY][cellX] = 1;

        // Dodaj statek
        shipCells.push([cellX, cellY]);

        // Zaznacz komórkę na planszy
        const index = cellY * 10 + cellX;
        const cells = elements.placementBoard.querySelectorAll('.cell');
        cells[index].classList.add('ship');
    }

    // Dodanie statku do listy statków
    state.players[currentPlayer].ships.push(shipCells);

    // Zmniejsz liczbę pozostałych statków
    state.placement.remainingShips[shipSize]--;

    console.log(state.placement.remainingShips);
    if (state.placement.remainingShips[shipSize] === 0) {
        if (shipSize === 4) state.placement.shipSize = 3;
        else if (shipSize === 3) state.placement.shipSize = 2;
        else if (shipSize === 2) state.placement.shipSize = null;
    }

    updateShipCounters();


    // Aktualizacja przycisku potwierdzenia
    elements.confirmPlacementBtn.disabled = !canConfirmPlacement();
}

function canConfirmPlacement() {
    return state.placement.remainingShips[2] === 0 &&
        state.placement.remainingShips[3] === 0 &&
        state.placement.remainingShips[4] === 0;
}

function isValidPlacement(x, y, shipSize, isHorizontal) {
    if (isHorizontal) {
        if (x + shipSize > 10) return false;
    } else {
        if (y + shipSize > 10) return false;
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

                if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
                    if (state.players[state.currentPlayer].boards[ny][nx] === 1) {
                        return false;
                    }
                }
            }
        }
    }

    return true;
}

function updateShipCounters() {
    for (let size = 2; size <= 4; size++) {
        elements.shipCounters[size].textContent = `${state.placement.remainingShips[size]} ${getShipName(size)}`;
    }
}

function getShipName(size) {
    switch (size) {
        case 2:
            return 'statki (2-masztowe)';
        case 3:
            return 'statki (3-masztowe)';
        case 4:
            return 'statki (4-masztowe)';
        default:
            return 'statki';
    }
}

function createBoard(board) {
    // Wyczyszczenie planszy
    board.innerHTML = '';

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;
            board.appendChild(cell);
        }
    }
}

function setupPlacementBoardListeners() {
    const cells = elements.placementBoard.querySelectorAll('.cell');
    cells.forEach(cell => {

        cell.addEventListener('mouseenter', e => {
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            showPlacementPreview(x, y);
        });

        cell.addEventListener('mouseleave', e => {
            clearPlacementPreview();
        });

        cell.addEventListener('click', e => {
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            placeShip(x, y);
        });
    });
}

function setupGameBoardListeners() {
    const player1Cells = elements.player1Board.querySelectorAll('.cell');
    const player2Cells = elements.player2Board.querySelectorAll('.cell');

    player1Cells.forEach(cell => {
        cell.addEventListener('click', (e) => {
            if (state.currentPlayer === 1) {
                const x = parseInt(e.target.dataset.x);
                const y = parseInt(e.target.dataset.y);
                makeMove(0, x, y); // Gracz 2 strzela w planszę gracza 1
            }
        });
    });

    player2Cells.forEach(cell => {
        cell.addEventListener('click', (e) => {
            if (state.currentPlayer === 0) {
                const x = parseInt(e.target.dataset.x);
                const y = parseInt(e.target.dataset.y);
                makeMove(1, x, y); // Gracz 1 strzela w planszę gracza 2
            }

        });
    });
}

function makeMove(targetPlayer, x, y) {
    if (state.players[targetPlayer].boards[targetPlayer][y][x] === 2 ||
        state.players[targetPlayer].boards[targetPlayer][y][x] === 3) {
        return;
    }

    const isHit = state.players[targetPlayer].boards[y][x] === 1;

    state.players[targetPlayer].boards[y][x] = isHit ? 2 : 3; // 2 - trafiony, 3 - pudło

    const boardElements = targetPlayer === 0 ? elements.player1Board : elements.player2Board;
    const index = y * 10 + x;
    const cell = boardElements.querySelectorAll('.cell')[index];

    if (isHit) {
        cell.classList.add('hit');

        if (checkShipSunk(targetPlayer, x, y)) {
            state.players[targetPlayer].shipsCount--;

            // Aktualizacja licznika statków
            if (targetPlayer === 0) {
                elements.player1Ships.textContent = state.players[0].shipsCount;
            } else {
                elements.player2Ships.textContent = state.players[1].shipsCount;
            }

            if (state.players[targetPlayer].shipsCount === 0) {
                endGame();
                return;
            }
        }
    } else {
        cell.classList.add('miss');
        // Zmiana gracza
        state.currentPlayer = state.currentPlayer === 0 ? 1 : 0;
        elements.currentPlayerSpan.textContent = state.players[state.currentPlayer].name;
    }
}

function checkShipSunk(player, hitX, hitY) {

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
                return false; // Nie wszystkie komórki statku zostały trafione
            }
        }
        return true; // Statek został zatopiony
    }

    return false; // Nie znaleziono statku
}

function startPlacement() {
    state.players[0].name = elements.player1NameInput.value || 'Gracz 1';
    state.players[1].name = elements.player2NameInput.value || 'Gracz 2';

    elements.placementInfo.textContent = `${state.players[0].name}, ustaw swoje statki`;

    createBoard(elements.placementBoard);
    showScreen('placement');
    setupPlacementBoardListeners();
}

function confirmPlacement() {
    if (!canConfirmPlacement()) return;

    if (state.currentPlayer === 0) {
        state.currentPlayer = 1;
        createBoard(elements.placementBoard);

        state.placement.remainingShips = {2: 4, 3: 3, 4: 2};
        state.placement.shipSize = 4;

        updateShipCounters();

        elements.placementInfo.textContent = `${state.players[1].name}, ustaw swoje statki`;

        setupPlacementBoardListeners();

        elements.confirmPlacementBtn.disabled = true;
    } else {
        startGame();
    }
}

function rotateShip() {
    state.placement.direction = state.placement.direction === 'horizontal' ? 'vertical' : 'horizontal';
}

function showScreen(screen) {
    state.currentScreen = screen;

    elements.setupScreen.classList.add('hidden');
    elements.placementScreen.classList.add('hidden');
    elements.gameScreen.classList.add('hidden');

    switch (screen) {
        case 'setup':
            elements.setupScreen.classList.remove('hidden');
            break;
        case 'placement':
            elements.placementScreen.classList.remove('hidden');
            break;
        case 'game':
            elements.gameScreen.classList.remove('hidden');
            break;
    }
}

function startGame() {
    createBoard(elements.player1Board);
    createBoard(elements.player2Board);

    state.currentPlayer = 0;
    elements.currentPlayerSpan.textContent = state.players[state.currentPlayer].name;
    elements.player1Header.textContent = state.players[0].name;
    elements.player2Header.textContent = state.players[1].name;

    elements.player1Ships.textContent = state.players[0].shipsCount;
    elements.player2Ships.textContent = state.players[1].shipsCount;

    setupGameBoardListeners();

    showScreen('game');
}

function endGame()
{
}

function init() {
    elements.startSetupBtn.addEventListener('click', () => startPlacement());
    elements.confirmPlacementBtn.addEventListener('click', () => confirmPlacement());
    elements.rotateBtn.addEventListener('click', () => rotateShip());

    showScreen('setup');
}

init();