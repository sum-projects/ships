class PlacementController {
    constructor(uiController, players) {
        this.uiController = uiController;
        this.players = players;
        this.board = new Board(this.uiController.elements.placementBoard);

        this.currentPlayer = 0;

        this.placement = {
            shipSize: 4,
            direction: CONSTANTS.DIRECTION_HORIZONTAL,
            remainingShips: {
                2: CONSTANTS.SHIPS[2].count,
                3: CONSTANTS.SHIPS[3].count,
                4: CONSTANTS.SHIPS[4].count
            }
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Rotate button
        this.uiController.elements.rotateBtn.addEventListener('click', () => this.rotateShip());

        // Confirm placement button
        this.uiController.elements.confirmPlacementBtn.addEventListener('click', () => this.confirmPlacement());
    }

    start() {
        // Create board
        this.board.create();

        // Setup board event listeners
        this.setupBoardListeners();

        // Update UI
        this.uiController.setPlacementInfo(`${this.players[0].name}, ustaw swoje statki`);
        this.uiController.updateShipCounters(this.placement.remainingShips);
        this.uiController.setConfirmPlacementEnabled(false);

        // Show placement screen
        this.uiController.showScreen(CONSTANTS.SCREEN.PLACEMENT);
    }

    setupBoardListeners() {
        const cells = this.uiController.elements.placementBoard.querySelectorAll('.cell');

        cells.forEach(cell => {
            // Mouse enter - show placement preview
            cell.addEventListener('mouseenter', e => {
                const x = parseInt(cell.dataset.x);
                const y = parseInt(cell.dataset.y);
                this.board.showPlacementPreview(
                    x, y,
                    this.placement.shipSize,
                    this.placement.direction,
                    this.players[this.currentPlayer].board
                );
            });

            // Mouse leave - clear preview
            cell.addEventListener('mouseleave', () => {
                this.board.clearPlacementPreview();
            });

            // Click - place ship
            cell.addEventListener('click', e => {
                const x = parseInt(cell.dataset.x);
                const y = parseInt(cell.dataset.y);
                this.placeShip(x, y);
            });
        });
    }

    placeShip(x, y) {
        if (!this.placement.shipSize) return;

        const ship = new Ship(
            this.placement.shipSize,
            this.placement.direction,
            x, y
        );

        // Check if placement is valid
        if (!ship.isValid() || ship.hasCollision(this.players[this.currentPlayer].board)) {
            return;
        }

        // Add ship to player
        this.players[this.currentPlayer].addShip(ship.cells);

        // Mark ship on board
        this.board.markShip(ship.cells);

        // Decrease remaining ships counter
        this.placement.remainingShips[this.placement.shipSize]--;

        // Update next ship size
        if (this.placement.remainingShips[this.placement.shipSize] === 0) {
            if (this.placement.shipSize === 4) this.placement.shipSize = 3;
            else if (this.placement.shipSize === 3) this.placement.shipSize = 2;
            else if (this.placement.shipSize === 2) this.placement.shipSize = null;
        }

        // Update UI
        this.uiController.updateShipCounters(this.placement.remainingShips);
        this.uiController.setConfirmPlacementEnabled(this.canConfirmPlacement());
    }

    rotateShip() {
        this.placement.direction =
            this.placement.direction === CONSTANTS.DIRECTION_HORIZONTAL ?
                CONSTANTS.DIRECTION_VERTICAL :
                CONSTANTS.DIRECTION_HORIZONTAL;
    }

    canConfirmPlacement() {
        return this.placement.remainingShips[2] === 0 &&
            this.placement.remainingShips[3] === 0 &&
            this.placement.remainingShips[4] === 0;
    }

    confirmPlacement() {
        if (!this.canConfirmPlacement()) return;

        if (this.currentPlayer === 0) {
            // Switch to player 2
            this.currentPlayer = 1;

            // Reset board and placement
            this.board.create();
            this.placement.remainingShips = {
                2: CONSTANTS.SHIPS[2].count,
                3: CONSTANTS.SHIPS[3].count,
                4: CONSTANTS.SHIPS[4].count
            };
            this.placement.shipSize = 4;
            this.placement.direction = CONSTANTS.DIRECTION_HORIZONTAL;

            // Update UI
            this.uiController.setPlacementInfo(`${this.players[1].name}, ustaw swoje statki`);
            this.uiController.updateShipCounters(this.placement.remainingShips);
            this.uiController.setConfirmPlacementEnabled(false);

            // Setup board listeners
            this.setupBoardListeners();
        } else {
            // All ships placed, start the game
            const event = new CustomEvent('placementComplete');
            document.dispatchEvent(event);
        }
    }

    reset() {
        this.currentPlayer = 0;
        this.placement = {
            shipSize: 4,
            direction: CONSTANTS.DIRECTION_HORIZONTAL,
            remainingShips: {
                2: CONSTANTS.SHIPS[2].count,
                3: CONSTANTS.SHIPS[3].count,
                4: CONSTANTS.SHIPS[4].count
            }
        };
    }
}