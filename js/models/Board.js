class Board {
    constructor(element) {
        this.element = element;
        this.cells = [];
    }

    create() {
        this.element.innerHTML = '';
        this.cells = [];

        for (let y = 0; y < CONSTANTS.BOARD_SIZE; y++) {
            for (let x = 0; x < CONSTANTS.BOARD_SIZE; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.x = x;
                cell.dataset.y = y;
                this.element.appendChild(cell);
                this.cells.push(cell);
            }
        }
    }

    getCell(x, y) {
        const index = y * CONSTANTS.BOARD_SIZE + x;
        return this.cells[index];
    }

    showPlacementPreview(x, y, size, direction, playerBoard) {
        if (!size) return;
        const ship = new Ship(size, direction, x, y);
        const isValid = ship.isValid() && !ship.hasCollision(playerBoard);

        ship.cells.forEach(([cellX, cellY]) => {
            if (cellX >= 0 && cellX < CONSTANTS.BOARD_SIZE && cellY >= 0 && cellY < CONSTANTS.BOARD_SIZE) {
                const cell = this.getCell(cellX, cellY);
                cell.classList.add(isValid ? 'placement-hover' : 'placement-invalid');
            }
        })
    }

    clearPlacementPreview() {
        this.cells.forEach(cell => {
            cell.classList.remove('placement-hover', 'placement-invalid');
        });
    }

    markShip(ship) {
        ship.forEach(([x, y]) => {
            const cell = this.getCell(x, y);
            cell.classList.add('ship');
        });
    }

    update(playerBoard, hideShips = false) {
        for (let y = 0; y < CONSTANTS.BOARD_SIZE; y++) {
            for (let x = 0; x < CONSTANTS.BOARD_SIZE; x++) {
                const cell = this.getCell(x, y);
                const cellState = playerBoard[y][x];

                cell.classList.remove('ship', 'hit', 'miss');

                switch (cellState) {
                    case CONSTANTS.CELL_SHIP:
                        if (!hideShips) {
                            cell.classList.add('ship');
                        }
                        break;
                    case CONSTANTS.CELL_HIT:
                        cell.classList.add('hit');
                        break;
                    case CONSTANTS.CELL_MISS:
                        cell.classList.add('miss');
                        break;
                }
            }
        }
    }
}