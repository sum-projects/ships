const elements = {
    // Screens
    setupScreen: document.querySelector('#setup-screen'),
    placementScreen: document.querySelector('#placement-screen'),
    gameScreen: document.querySelector('#game-screen'),
    gameOverScreen: document.querySelector('#game-over-screen'),

    // Buttons
    startSetupBtn: document.querySelector('#start-setup-btn'),
    confirmPlacementBtn: document.querySelector('#confirm-placement-btn'),
    rotateBtn: document.querySelector('#rotate-btn'),
    restartBtn: document.querySelector('#restart-btn'),

    // Inputs
    player1NameInput: document.querySelector('#player1-name'),
    player2NameInput: document.querySelector('#player2-name'),

    // Boards
    placementBoard: document.querySelector('#placement-board'),
    player1Board: document.querySelector('#player1-board'),
    player2Board: document.querySelector('#player2-board'),

    // Game Elements
    placementInfo: document.querySelector('#placement-info'),
    shipCounters: {
        2: document.querySelector('#ship-2'),
        3: document.querySelector('#ship-3'),
        4: document.querySelector('#ship-4')
    },
    currentPlayerSpan: document.querySelector('#current-player'),
    player1Header: document.querySelector('#player1-header'),
    player2Header: document.querySelector('#player2-header'),
    player1Ships: document.querySelector('#player1-ships'),
    player2Ships: document.querySelector('#player2-ships'),
    winnerName: document.querySelector('#winner-name'),
};

const state = {
    players: [
        {
            name: 'Gracz 1',
            ships: [],
            shipsCount: 9,
            boards: Array.from({length: CONSTANTS.BOARD_SIZE}, () => Array.from({length: CONSTANTS.BOARD_SIZE}, () => 0)),
        },
        {
            name: 'Gracz 2',
            ships: [],
            shipsCount: 9,
            boards: Array.from({length: CONSTANTS.BOARD_SIZE}, () => Array.from({length: CONSTANTS.BOARD_SIZE}, () => 0)),
        }
    ],
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
    currentScreen: CONSTANTS.SCREEN.SETUP,
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