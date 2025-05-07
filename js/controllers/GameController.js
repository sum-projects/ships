class GameController {
    start() {
        createBoard(elements.player1Board);
        createBoard(elements.player2Board);

        state.currentPlayer = 0;
        elements.currentPlayerSpan.textContent = state.players[state.currentPlayer].name;
        elements.player1Header.textContent = state.players[0].name;
        elements.player2Header.textContent = state.players[1].name;

        elements.player1Ships.textContent = state.players[0].shipsCount;
        elements.player2Ships.textContent = state.players[1].shipsCount;

        setupGameBoardListeners();

        showScreen(CONSTANTS.SCREEN.GAME);
    }

    setupEventListeners() {

    }

    setupBoardListeners() {
        const player1Cells = elements.player1Board.querySelectorAll('.cell');
        const player2Cells = elements.player2Board.querySelectorAll('.cell');

        player1Cells.forEach(cell => {
            cell.addEventListener('click', (e) => {
                if (state.currentPlayer === 1) {
                    const x = parseInt(e.target.dataset.x);
                    const y = parseInt(e.target.dataset.y);
                    makeMove(0, x, y); // Gracz 2 strzela w planszę gracza 1
                }
            });
        });

        player2Cells.forEach(cell => {
            cell.addEventListener('click', (e) => {
                if (state.currentPlayer === 0) {
                    const x = parseInt(e.target.dataset.x);
                    const y = parseInt(e.target.dataset.y);
                    makeMove(1, x, y); // Gracz 1 strzela w planszę gracza 2
                }

            });
        });
    }

    makeMove(targetPlayer, x, y) {
        if (state.players[targetPlayer].boards[y][x] === CONSTANTS.CELL_HIT ||
            state.players[targetPlayer].boards[y][x] === CONSTANTS.CELL_MISS) {
            return;
        }

        const isHit = state.players[targetPlayer].boards[y][x] === 1;

        state.players[targetPlayer].boards[y][x] = isHit ? CONSTANTS.CELL_HIT : CONSTANTS.CELL_MISS;

        const boardElements = targetPlayer === 0 ? elements.player1Board : elements.player2Board;
        const index = y * CONSTANTS.BOARD_SIZE + x;
        const cell = boardElements.querySelectorAll('.cell')[index];

        if (isHit) {
            cell.classList.add('hit');

            const sunkShip = findSunkShip(targetPlayer, x, y);

            if (sunkShip) {
                markAroundSunkShip(targetPlayer, sunkShip);

                state.players[targetPlayer].shipsCount--;

                // Aktualizacja licznika statków
                if (targetPlayer === 0) {
                    elements.player1Ships.textContent = state.players[0].shipsCount;
                } else {
                    elements.player2Ships.textContent = state.players[1].shipsCount;
                }

                if (state.players[targetPlayer].shipsCount === 0) {
                    endGame();
                    return;
                }
            }
        } else {
            cell.classList.add('miss');
            state.currentPlayer = state.currentPlayer === 0 ? 1 : 0;
            elements.currentPlayerSpan.textContent = state.players[state.currentPlayer].name;
        }
    }

    endGame() {
        // Określenie zwycięzcy
        const winner = state.currentPlayer;
        elements.winnerName.textContent = state.players[winner].name;

        // Pokazanie ekranu końcowego
        showScreen(CONSTANTS.SCREEN.GAME_OVER);
    }

    restart() {

    }
}