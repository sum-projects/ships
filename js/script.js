
const state = {
    placement: {
        shipSize: 4,
        direction:  CONSTANTS.DIRECTION_HORIZONTAL,
        remainingShips: {
            2: CONSTANTS.SHIPS[2].count,
            3: CONSTANTS.SHIPS[3].count,
            4: CONSTANTS.SHIPS[4].count
        },
    },
    currentPlayer: 0,
};


class BattleshipGame {
    init() {
        elements.startSetupBtn.addEventListener('click', () => startPlacement());
        elements.confirmPlacementBtn.addEventListener('click', () => confirmPlacement());
        elements.rotateBtn.addEventListener('click', () => rotateShip());
        elements.restartBtn.addEventListener('click', () => restart());

        showScreen(CONSTANTS.SCREEN.SETUP);
    }
}

const Battleship = new BattleshipGame();
Battleship.init();