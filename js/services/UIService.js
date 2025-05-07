class UIService {
    constructor() {
        this.elements = {
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
        }

        this.currentScreen = CONSTANTS.SCREEN.SETUP;
    }

    showScreen(screen) {
        this.currentScreen = screen;

        this.elements.setupScreen.classList.add('hidden');
        this.elements.placementScreen.classList.add('hidden');
        this.elements.gameScreen.classList.add('hidden');
        this.elements.gameOverScreen.classList.add('hidden');

        switch (screen) {
            case CONSTANTS.SCREEN.SETUP:
                this.elements.setupScreen.classList.remove('hidden');
                break;
            case CONSTANTS.SCREEN.PLACEMENT:
                this.elements.placementScreen.classList.remove('hidden');
                break;
            case CONSTANTS.SCREEN.GAME:
                this.elements.gameScreen.classList.remove('hidden');
                break;
            case CONSTANTS.SCREEN.GAME_OVER:
                this.elements.gameOverScreen.classList.remove('hidden');
                break;
        }
    }

    updateShipCounters(remainingShips) {
        for (let size = 2; size <= 4; size++) {
            this.elements.shipCounters[size].textContent = `${remainingShips[size]} ${CONSTANTS.SHIPS[size].name}`;
        }
    }

    setConfirmPlacementEnabled(enabled) {
        this.elements.confirmPlacementBtn.disabled = !enabled;
    }

    setPlacementInfo(text) {
        this.elements.placementInfo.textContent = text;
    }

    setCurrentPlayer(playerName) {
        this.elements.currentPlayerSpan.textContent = playerName;
    }

    setPlayerHeaders(player1Name, player2Name) {
        this.elements.player1Header.textContent = player1Name;
        this.elements.player2Header.textContent = player2Name;
    }

    updateShipsCount(player1Ships, player2Ships) {
        this.elements.player1Ships.textContent = player1Ships;
        this.elements.player2Ships.textContent = player2Ships;
    }

    setWinner(winnerName) {
        this.elements.winnerName.textContent = winnerName;
    }

    getPlayerNames() {
        return {
            player1: this.elements.player1NameInput.value || 'Gracz 1',
            player2: this.elements.player2NameInput.value || 'Gracz 2'
        };
    }
}