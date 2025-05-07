
class Player {
    markAroundSunkShip(player, ship) {
        for (const [shipX, shipY] of ship) {
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    // Pomijamy samą komórkę statku
                    if (dx === 0 && dy === 0) continue;

                    const nx = shipX + dx;
                    const ny = shipY + dy;

                    if (nx >= 0 && nx < CONSTANTS.BOARD_SIZE && ny >= 0 && ny < CONSTANTS.BOARD_SIZE) {
                        if (state.players[player].boards[ny][nx] === CONSTANTS.CELL_EMPTY || state.players[player].boards[ny][nx] === CONSTANTS.CELL_SHIP) {
                            state.players[player].boards[ny][nx] = CONSTANTS.CELL_MISS;

                            const boardElement = player === 0 ?
                                elements.player1Board : elements.player2Board;
                            const index = ny * CONSTANTS.BOARD_SIZE + nx;
                            const cell = boardElement.querySelectorAll('.cell')[index];

                            cell.classList.add('miss');
                        }
                    }
                }
            }
        }
    }

    findSunkShip(player, hitX, hitY) {
        // Znajdź statek, który został trafiony
        let hitShip = null;
        for (const ship of state.players[player].ships) {
            for (const [x, y] of ship) {
                if (x === hitX && y === hitY) {
                    hitShip = ship;
                    break;
                }
            }
            if (hitShip) break;
        }

        // Sprawdź, czy wszystkie komórki statku zostały trafione
        if (hitShip) {
            for (const [x, y] of hitShip) {
                if (state.players[player].boards[y][x] !== 2) {
                    return null; // Nie wszystkie komórki statku zostały trafione
                }
            }
            return hitShip; // Wszystkie komórki statku zostały trafione - zwróć statek
        }

        return null; // Nie znaleziono statku
    }
}