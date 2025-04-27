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

startSetupBtn.addEventListener('click', () => {
    state.players[0].name = player1NameInput.value;
    state.players[1].name = player2NameInput.value;

    placementInfo.textContent = `${state.players[0].name}, ustaw swoje statki`;

    setupScreen.classList.add('hidden');
    placementScreen.classList.remove('hidden');
});

confirmPlacementBtn.addEventListener('click', () => {
    placementScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
});