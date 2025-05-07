class Ship {
    isValidPlacement(x, y, shipSize, isHorizontal) {
        if (isHorizontal) {
            if (x + shipSize > CONSTANTS.BOARD_SIZE) return false;
        } else {
            if (y + shipSize > CONSTANTS.BOARD_SIZE) return false;
        }

        // Sprawdź, czy statek nie koliduje z innymi statkami
        for (let i = 0; i < state.placement.shipSize; i++) {
            const cellX = isHorizontal ? x + i : x;
            const cellY = isHorizontal ? y : y + i;

            // Sprawdzenie, czy pole jest już zajęte
            if (state.players[state.currentPlayer].boards[cellY][cellX] === 1) {
                return false;
            }

            // Sprawdzenie sąsiednich pól (statki nie mogą się stykać)
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const nx = cellX + dx;
                    const ny = cellY + dy;

                    if (nx >= 0 && nx < CONSTANTS.BOARD_SIZE && ny >= 0 && ny < CONSTANTS.BOARD_SIZE) {
                        if (state.players[state.currentPlayer].boards[ny][nx] === 1) {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }
}