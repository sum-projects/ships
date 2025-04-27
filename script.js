// Screens
const setupScreen = document.querySelector('#setup-screen');
const placementScreen = document.querySelector('#placement-screen');
const gameScreen = document.querySelector('#game-screen');

// Buttons
const startSetupBtn = document.querySelector('#start-setup-btn');
const confirmPlacementBtn = document.querySelector('#confirm-placement-btn');

// Inputs
const player1NameInput = document.querySelector('#player1-name');
const player2NameInput = document.querySelector('#player2-name');

// Boards
const placementBoard = document.querySelector('#placement-board');

// Game Elements
const placementInfo = document.querySelector('#placement-info');

// State
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
        placementBoard.appendChild(cell);
    }
}

const cells = placementBoard.querySelectorAll('.cell');
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
    const cells = placementBoard.querySelectorAll('.cell');

    const isValid = isValidPlacement(x, y, state.placement.shipSize);

    for (let i = 0; i < state.placement.shipSize; i++) {
        const cellX = x + i;
        const cellY = y;

        // Sprawdź, czy komórka jest w granicach planszy
        if (cellX >= 0 && cellX < 10 && cellY >= 0 && cellY < 10) {
            const index = cellY * 10 + cellX;
            console.log(`Previewing cell at (${cellX}, ${cellY})`);
            cells[index].classList.add(isValid ? 'placement-hover' : 'placement-invalid');
        }
    }
}

function clearPlacementPreview() {
    const cells = placementBoard.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('placement-hover', 'placement-invalid');
    });
}

function isValidPlacement(x, y, shipSize) {
    if (x + shipSize > 10) return false;

    return true;
}

// Game Listeners
startSetupBtn.addEventListener('click', () => {
    state.players[0].name = player1NameInput.value || 'Gracz 1';
    state.players[1].name = player2NameInput.value || 'Gracz 2';

    placementInfo.textContent = `${state.players[0].name}, ustaw swoje statki`;

    setupScreen.classList.add('hidden');
    placementScreen.classList.remove('hidden');
});

confirmPlacementBtn.addEventListener('click', () => {
    placementScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
});