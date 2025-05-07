class GameController {
    constructor(uiController, players) {
        this.uiController = uiController;
        this.players = players;
        this.currentPlayer = 0;

        this.player1Board = new Board(this.uiController.elements.player1Board);
        this.player2Board = new Board(this.uiController.elements.player2Board);

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Restart button
        this.uiController.elements.restartBtn.addEventListener('click', () => {
            const event = new CustomEvent('restartGame');
            document.dispatchEvent(event);
        });
    }

    start() {
        // Create boards
        this.player1Board.create();
        this.player2Board.create();

        // Set current player
        this.currentPlayer = 0;

        // Update UI
        this.uiController.setCurrentPlayer(this.players[this.currentPlayer].name);
        this.uiController.setPlayerHeaders(this.players[0].name, this.players[1].name);
        this.uiController.updateShipsCount(
            this.players[0].ships.length,
            this.players[1].ships.length
        );

        // Update board displays
        this.player1Board.update(this.players[0].board, true);
        this.player2Board.update(this.players[1].board, true);

        // Setup board event listeners
        this.setupBoardListeners();

        // Show game screen
        this.uiController.showScreen(CONSTANTS.SCREEN.GAME);
    }

    setupBoardListeners() {
        const player1Cells = this.uiController.elements.player1Board.querySelectorAll('.cell');
        const player2Cells = this.uiController.elements.player2Board.querySelectorAll('.cell');

        // Player 1 board - only clickable by player 2
        player1Cells.forEach(cell => {
            cell.addEventListener('click', (e) => {
                if (this.currentPlayer === 1) {
                    const x = parseInt(e.target.dataset.x);
                    const y = parseInt(e.target.dataset.y);
                    this.makeMove(0, x, y); // Player 2 shoots at player 1's board
                }
            });
        });

        // Player 2 board - only clickable by player 1
        player2Cells.forEach(cell => {
            cell.addEventListener('click', (e) => {
                if (this.currentPlayer === 0) {
                    const x = parseInt(e.target.dataset.x);
                    const y = parseInt(e.target.dataset.y);
                    this.makeMove(1, x, y); // Player 1 shoots at player 2's board
                }
            });
        });
    }

    makeMove(targetPlayer, x, y) {
        const board = targetPlayer === 0 ? this.players[0].board : this.players[1].board;

        // Check if cell was already shot
        if (board[y][x] === CONSTANTS.CELL_HIT || board[y][x] === CONSTANTS.CELL_MISS) {
            return;
        }

        // Process shot
        const isHit = this.players[targetPlayer].receiveShot(x, y);

        // Update board display
        if (targetPlayer === 0) {
            this.player1Board.update(this.players[0].board, true);
        } else {
            this.player2Board.update(this.players[1].board, true);
        }

        if (isHit) {
            // Check if a ship was sunk
            const sunkShip = this.players[targetPlayer].findSunkShip(x, y);

            if (sunkShip) {
                // Mark cells around sunk ship as missed
                this.players[targetPlayer].markAroundSunkShip(sunkShip);

                // Update board display
                if (targetPlayer === 0) {
                    this.player1Board.update(this.players[0].board, true);
                } else {
                    this.player2Board.update(this.players[1].board, true);
                }

                // Check if all ships are sunk
                if (this.players[targetPlayer].areAllShipsSunk()) {
                    this.endGame();
                    return;
                }
            }
        } else {
            // Miss - switch player
            this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
            this.uiController.setCurrentPlayer(this.players[this.currentPlayer].name);
        }
    }

    endGame() {
        // Determine winner
        const winner = this.currentPlayer;

        // Update UI
        this.uiController.setWinner(this.players[winner].name);

        // Show game over screen
        this.uiController.showScreen(CONSTANTS.SCREEN.GAME_OVER);
    }

    reset() {
        this.currentPlayer = 0;
    }
}