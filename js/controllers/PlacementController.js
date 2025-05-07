class PlacementController {

    constructor() {

    }


    start() {
        state.players[0].name = elements.player1NameInput.value || 'Gracz 1';
        state.players[1].name = elements.player2NameInput.value || 'Gracz 2';

        elements.placementInfo.textContent = `${state.players[0].name}, ustaw swoje statki`;

        createBoard(elements.placementBoard);
        showScreen(CONSTANTS.SCREEN.PLACEMENT);
        setupPlacementBoardListeners();
    }

    setupEventListeners() {

    }

    setupBoardListeners() {
        const cells = elements.placementBoard.querySelectorAll('.cell');
        cells.forEach(cell => {

            cell.addEventListener('mouseenter', e => {
                const x = parseInt(cell.dataset.x);
                const y = parseInt(cell.dataset.y);
                showPlacementPreview(x, y);
            });

            cell.addEventListener('mouseleave', e => {
                clearPlacementPreview();
            });

            cell.addEventListener('click', e => {
                const x = parseInt(cell.dataset.x);
                const y = parseInt(cell.dataset.y);
                placeShip(x, y);
            });
        });
    }

    placeShip(x, y) {
        if (!state.placement.shipSize) return;

        const isHorizontal = state.placement.direction === 'horizontal';
        const shipSize = state.placement.shipSize;
        const currentPlayer = state.currentPlayer;

        if (!isValidPlacement(x, y, shipSize, isHorizontal)) {
            return;
        }

        const shipCells = [];
        for (let i = 0; i < shipSize; i++) {
            const cellX = isHorizontal ? x + i : x;
            const cellY = isHorizontal ? y : y + i;

            // Zaznacz komórkę jako zajętą
            state.players[currentPlayer].boards[cellY][cellX] = 1;

            // Dodaj statek
            shipCells.push([cellX, cellY]);

            // Zaznacz komórkę na planszy
            const index = cellY * CONSTANTS.BOARD_SIZE + cellX;
            const cells = elements.placementBoard.querySelectorAll('.cell');
            cells[index].classList.add('ship');
        }

        // Dodanie statku do listy statków
        state.players[currentPlayer].ships.push(shipCells);

        // Zmniejsz liczbę pozostałych statków
        state.placement.remainingShips[shipSize]--;

        console.log(state.placement.remainingShips);
        if (state.placement.remainingShips[shipSize] === 0) {
            if (shipSize === 4) state.placement.shipSize = 3;
            else if (shipSize === 3) state.placement.shipSize = 2;
            else if (shipSize === 2) state.placement.shipSize = null;
        }

        updateShipCounters();


        // Aktualizacja przycisku potwierdzenia
        elements.confirmPlacementBtn.disabled = !canConfirmPlacement();
    }

    rotateShip() {
        state.placement.direction = state.placement.direction === CONSTANTS.DIRECTION_HORIZONTAL ? CONSTANTS.DIRECTION_VERTICAL : CONSTANTS.DIRECTION_HORIZONTAL;
    }

    canConfirmPlacement() {
        return state.placement.remainingShips[2] === 0 &&
            state.placement.remainingShips[3] === 0 &&
            state.placement.remainingShips[4] === 0;
    }

    confirmPlacement() {
        if (!canConfirmPlacement()) return;

        if (state.currentPlayer === 0) {
            state.currentPlayer = 1;
            createBoard(elements.placementBoard);

            state.placement.remainingShips = {2: 4, 3: 3, 4: 2};
            state.placement.shipSize = 4;

            updateShipCounters();

            elements.placementInfo.textContent = `${state.players[1].name}, ustaw swoje statki`;

            setupPlacementBoardListeners();

            elements.confirmPlacementBtn.disabled = true;
        } else {
            startGame();
        }
    }

    restart() {

    }
}