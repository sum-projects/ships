class UIController {
    showScreen(screen) {
        state.currentScreen = screen;

        elements.setupScreen.classList.add('hidden');
        elements.placementScreen.classList.add('hidden');
        elements.gameScreen.classList.add('hidden');
        elements.gameOverScreen.classList.add('hidden');

        switch (screen) {
            case CONSTANTS.SCREEN.SETUP:
                elements.setupScreen.classList.remove('hidden');
                break;
            case CONSTANTS.SCREEN.PLACEMENT:
                elements.placementScreen.classList.remove('hidden');
                break;
            case CONSTANTS.SCREEN.GAME:
                elements.gameScreen.classList.remove('hidden');
                break;
            case CONSTANTS.SCREEN.GAME_OVER:
                elements.gameOverScreen.classList.remove('hidden');
                break;
        }
    }

    updateShipCounters() {
        for (let size = 2; size <= 4; size++) {
            elements.shipCounters[size].textContent = `${state.placement.remainingShips[size]} ${getShipName(size)}`;
        }
    }
}