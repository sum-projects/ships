const setupScreen = document.querySelector('#setup-screen');
const placementScreen = document.querySelector('#placement-screen');

const startSetupBtn = document.querySelector('#start-setup-btn');

startSetupBtn.addEventListener('click', () => {
    setupScreen.classList.add('hidden');
    placementScreen.classList.remove('hidden');
});