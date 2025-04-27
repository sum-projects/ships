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
    ]
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
        console.log(`Mouse entered cell at (${cell.dataset.x}, ${cell.dataset.y})`);
    });

    cell.addEventListener('mouseleave', e => {
        console.log(`Mouse left cell at (${cell.dataset.x}, ${cell.dataset.y})`);
    });

    cell.addEventListener('click', e => {
        console.log(`Cell clicked at (${cell.dataset.x}, ${cell.dataset.y})`);
    });
});

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