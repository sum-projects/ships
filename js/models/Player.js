class Player {
    constructor(name = 'Gracz') {
        this.name = name;
        this.ships = [];
        this.shipsCount = 0;
        this.board = Array.from({length: CONSTANTS.BOARD_SIZE}, () => Array.from({length: CONSTANTS.BOARD_SIZE}, () => 0));
    }

    getShipsCount() {
        return this.ships.length;
    }

    addShip(shipCells) {
        this.ships.push(shipCells);

        shipCells.forEach(([x, y]) => {
            this.board[y][x] = CONSTANTS.CELL_SHIP;
        })

        this.shipsCount = this.ships.length
    }

    receiveShot(x, y) {
        const isHit = this.board[y][x] === CONSTANTS.CELL_SHIP;

        if (isHit) {
            this.board[y][x] = CONSTANTS.CELL_HIT;
        } else {
            this.board[y][x] = CONSTANTS.CELL_MISS;
        }

        return isHit;
    }

    markAroundSunkShip(ship) {
        for (const [shipX, shipY] of ship) {
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (dx === 0 && dy === 0) continue;

                    const nx = shipX + dx;
                    const ny = shipY + dy;

                    if (nx >= 0 && nx < CONSTANTS.BOARD_SIZE && ny >= 0 && ny < CONSTANTS.BOARD_SIZE) {
                        if (this.board[ny][nx] === CONSTANTS.CELL_EMPTY || this.board[ny][nx] === CONSTANTS.CELL_SHIP) {
                            this.board[ny][nx] = CONSTANTS.CELL_MISS;
                        }
                    }
                }
            }
        }
    }

    findSunkShip(x, y) {
        let hitShip = null;
        for (const ship of this.ships) {
            for (const [shipX, shipY] of ship) {
                if (shipX === x && shipY === y) {
                    hitShip = ship;
                    break;
                }
            }
            if (hitShip) break;
        }

        if (hitShip) {
            for (const [shipX, shipY] of hitShip) {
                if (this.board[shipX][shipY] !== CONSTANTS.CELL_HIT) {
                    return null;
                }
            }
            return hitShip;
        }

        return null;
    }

    areAllShipsSunk() {
        let sunkShips = 0;

        for (const ship of this.ships) {
            let isSunk = true;

            for (const [x, y] of ship) {
                if (this.board[y][x] !== CONSTANTS.CELL_HIT) {
                    isSunk = false;
                    break;
                }
            }

            if (isSunk) {
                sunkShips++;
            }
        }

        return sunkShips === this.ships.length;
    }

    reset() {
        this.ships = [];
        this.shipsCount = 0;
        this.board = Array.from({length: CONSTANTS.BOARD_SIZE}, () => Array.from({length: CONSTANTS.BOARD_SIZE}, () => 0));
    }
}