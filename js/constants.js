const CONSTANTS = {
    // Board dimensions
    BOARD_SIZE: 10,

    // Cell states
    CELL_EMPTY: 0,
    CELL_SHIP: 1,
    CELL_HIT: 2,
    CELL_MISS: 3,

    // Ship direction
    DIRECTION_HORIZONTAL: 'horizontal',
    DIRECTION_VERTICAL: 'vertical',

    // Ship sizes and counts
    SHIPS: {
        2: { size: 2, count: 4, name: 'statki (2-masztowe)' },
        3: { size: 3, count: 3, name: 'statki (3-masztowe)' },
        4: { size: 4, count: 2, name: 'statki (4-masztowe)' }
    },

    // Screen names
    SCREEN: {
        SETUP: 'setup',
        PLACEMENT: 'placement',
        GAME: 'game',
        GAME_OVER: 'gameOver'
    }
};