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
};

const state = {
    players: [
        {
            name: 'Gracz 1',
            ships: [],
            boards: Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 0)),
        },
        {
            name: 'Gracz 2',
            ships: [],
            boards: Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 0)),
        }
    ],
    placement: {
        shipSize: 4,
        direction: 'horizontal',
    },
    currentPlayer: 0,
};

// Game initialization
for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.x = x;
        cell.dataset.y = y;
        elements.placementBoard.appendChild(cell);
    }
}

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

// Game Functions
function showPlacementPreview(x, y) {
    const cells = elements.placementBoard.querySelectorAll('.cell');

    const isHorizontal = state.placement.direction === 'horizontal';

    const isValid = isValidPlacement(x, y, state.placement.shipSize, isHorizontal);

    for (let i = 0; i < state.placement.shipSize; i++) {
        const cellX = isHorizontal ? x + i : x;
        const cellY = isHorizontal ? y : y + i;

        // Sprawdź, czy komórka jest w granicach planszy
        if (cellX >= 0 && cellX < 10 && cellY >= 0 && cellY < 10) {
            const index = cellY * 10 + cellX;
            console.log(`Previewing cell at (${cellX}, ${cellY})`);
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
    const isHorizontal = state.placement.direction === 'horizontal';

    if (!isValidPlacement(x, y, state.placement.shipSize, isHorizontal)) {
        return;
    }

    for (let i = 0; i < state.placement.shipSize; i++) {
        const cellX = isHorizontal ? x + i : x;
        const cellY = isHorizontal ? y : y + i;

        // Zaznacz komórkę jako zajętą
        state.players[state.currentPlayer].boards[cellY][cellX] = 1;

        // Dodaj statek
        state.players[state.currentPlayer].ships.push([cellX, cellY]);

        // Zaznacz komórkę na planszy
        const index = cellY * 10 + cellX;
        const cells = elements.placementBoard.querySelectorAll('.cell');
        cells[index].classList.add('ship');
    }
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

// Game Listeners
elements.startSetupBtn.addEventListener('click', () => {
    state.players[0].name = elements.player1NameInput.value || 'Gracz 1';
    state.players[1].name = elements.player2NameInput.value || 'Gracz 2';

    elements.placementInfo.textContent = `${state.players[0].name}, ustaw swoje statki`;

    elements.setupScreen.classList.add('hidden');
    elements.placementScreen.classList.remove('hidden');
});

elements.confirmPlacementBtn.addEventListener('click', () => {
    elements.placementScreen.classList.add('hidden');
    elements.gameScreen.classList.remove('hidden');
});

elements.rotateBtn.addEventListener('click', () => {
    state.placement.direction = state.placement.direction === 'horizontal' ? 'vertical' : 'horizontal';
});