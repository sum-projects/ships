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
            name: 'Gracz 1'
        },
        {
            name: 'Gracz 2'
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
        // console.log(`Cell clicked at (${cell.dataset.x}, ${cell.dataset.y})`);
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

function isValidPlacement(x, y, shipSize, isHorizontal) {
    if (isHorizontal) {
        if (x + shipSize > 10) return false;
    } else {
        if (y + shipSize > 10) return false;
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