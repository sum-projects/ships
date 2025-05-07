class BattleshipGame {

    constructor() {
        // Create UI controller
        this.uiController = new UIController();

        // Create players
        this.players = [
            new Player('Gracz 1'),
            new Player('Gracz 2')
        ];

        // Create game controllers
        this.placementController = new PlacementController(this.uiController, this.players);
        this.gameController = new GameController(this.uiController, this.players);
    }

    setupEventListeners() {
        // Start setup button
        this.uiController.elements.startSetupBtn.addEventListener('click', () => this.startPlacement());

        // Placement complete event
        document.addEventListener('placementComplete', () => this.startGame());

        // Restart game event
        document.addEventListener('restartGame', () => this.restart());
    }

    init() {
        this.setupEventListeners()
        this.uiController.showScreen(CONSTANTS.SCREEN.SETUP);
    }

    startPlacement() {
        // Get player names
        const names = this.uiController.getPlayerNames();
        this.players[0].name = names.player1;
        this.players[1].name = names.player2;

        // Start placement
        this.placementController.start();
    }

    startGame() {
        this.gameController.start();
    }

    restart() {
        // Reset players
        this.players.forEach(player => player.reset());

        // Reset controllers
        this.placementController.reset();
        this.gameController.reset();

        // Go back to setup screen
        this.init();
    }
}

// Start the game when the page loads
const game = new BattleshipGame();
game.init();
