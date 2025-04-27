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

    // Game Elements
    placementInfo: document.querySelector('#placement-info'),
    shipCounters: {
        2: document.getElementById('ship-2'),
        3: document.getElementById('ship-3'),
        4: document.getElementById('ship-4')
    }
};

const state = {
    players: [
        {
            name: 'Gracz 1',
            ships: [],
            boards: Array.from({length: 10}, () => Array.from({length: 10}, () => 0)),
        },
        {
            name: 'Gracz 2',
            ships: [],
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

        state.placement.remainingShips = { 2: 4, 3: 3, 4: 2 };
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
    this.showScreen('game');
}

function init() {
    elements.startSetupBtn.addEventListener('click', () => startPlacement());
    elements.confirmPlacementBtn.addEventListener('click', () => confirmPlacement());
    elements.rotateBtn.addEventListener('click', () => rotateShip());

    showScreen('setup');
}

init();