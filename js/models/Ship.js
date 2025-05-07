class Ship {
    constructor(size, direction, x, y) {
        this.size = size;
        this.direction = direction;
        this.x = x;
        this.y = y;
        this.cells = this.calculateCells();
    }

    calculateCells() {
        const cells = [];
        const isHorizontal = this.direction === CONSTANTS.DIRECTION_HORIZONTAL;

        for (let i = 0; i < this.size; i++) {
            const cellX = isHorizontal ? this.x + i : this.x;
            const cellY = isHorizontal ? this.y : this.y + i;
            cells.push([cellX, cellY]);
        }

        return cells;
    }

    isValid() {
        const isHorizontal = this.direction === CONSTANTS.DIRECTION_HORIZONTAL;

        if (isHorizontal) {
            if (this.x + this.size > CONSTANTS.BOARD_SIZE) return false;
        } else {
            if (this.y + this.size > CONSTANTS.BOARD_SIZE) return false;
        }


        return true;
    }

    hasCollision(board) {
        for (const [x, y] of this.cells) {
            if (board[y][x] === CONSTANTS.CELL_SHIP) {
                return true;
            }

            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (nx >= 0 && nx < CONSTANTS.BOARD_SIZE && ny >= 0 && ny < CONSTANTS.BOARD_SIZE) {
                        if (board[ny][nx] === CONSTANTS.CELL_SHIP) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }
}