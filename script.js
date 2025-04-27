const setupScreen = document.querySelector('#setup-screen');
const placementScreen = document.querySelector('#placement-screen');
const gameScreen = document.querySelector('#game-screen');

const startSetupBtn = document.querySelector('#start-setup-btn');
const confirmPlacementBtn = document.querySelector('#confirm-placement-btn');

startSetupBtn.addEventListener('click', () => {
    setupScreen.classList.add('hidden');
    placementScreen.classList.remove('hidden');
});

confirmPlacementBtn.addEventListener('click', () => {
    placementScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
});