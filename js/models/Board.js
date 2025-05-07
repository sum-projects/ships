class Board {
    create(board) {
        // Wyczyszczenie planszy
        board.innerHTML = '';

        for (let y = 0; y < CONSTANTS.BOARD_SIZE; y++) {
            for (let x = 0; x < CONSTANTS.BOARD_SIZE; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.x = x;
                cell.dataset.y = y;
                board.appendChild(cell);
            }
        }
    }

    showPlacementPreview(x, y) {
        if (!state.placement.shipSize) return;

        const cells = elements.placementBoard.querySelectorAll('.cell');

        const isHorizontal = state.placement.direction === 'horizontal';

        const isValid = isValidPlacement(x, y, state.placement.shipSize, isHorizontal);

        for (let i = 0; i < state.placement.shipSize; i++) {
            const cellX = isHorizontal ? x + i : x;
            const cellY = isHorizontal ? y : y + i;

            // Sprawdź, czy komórka jest w granicach planszy
            if (cellX >= 0 && cellX < CONSTANTS.BOARD_SIZE && cellY >= 0 && cellY < CONSTANTS.BOARD_SIZE) {
                const index = cellY * CONSTANTS.BOARD_SIZE + cellX;
                cells[index].classList.add(isValid ? 'placement-hover' : 'placement-invalid');
            }
        }
    }

    clearPlacementPreview() {
        const cells = elements.placementBoard.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('placement-hover', 'placement-invalid');
        });
    }
}