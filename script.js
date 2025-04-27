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

startSetupBtn.addEventListener('click', () => {
    state.players[0].name = player1NameInput.value;
    state.players[1].name = player2NameInput.value;

    setupScreen.classList.add('hidden');
    placementScreen.classList.remove('hidden');
});

confirmPlacementBtn.addEventListener('click', () => {
    placementScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
});