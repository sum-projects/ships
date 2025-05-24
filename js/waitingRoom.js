class WaitingRoom {
    constructor(roomId, playerName, isRoomOwner) {
        this.roomId = roomId;
        this.playerName = playerName;
        this.isRoomOwner = isRoomOwner;
        this.playersList = document.getElementById('playersList');
        this.playerCount = document.getElementById('playerCount');
        this.maxPlayers = document.getElementById('maxPlayers');
        this.waitingMessage = document.getElementById('waitingMessage');
        this.startGameBtn = document.getElementById('startGameBtn');

        this.pollInterval = null;

        this.initListeners();
        this.startPolling();
    }

    initListeners() {
        if (this.startGameBtn) {
            this.startGameBtn.addEventListener('click', () => this.startGame());
        }
    }

    startPolling() {
        // Immediately check room status
        this.checkRoomStatus();

        // Set up polling interval
        this.pollInterval = setInterval(() => {
            this.checkRoomStatus();
        }, 2000);
    }

    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }

    async checkRoomStatus() {
        try {
            const response = await fetch(`api/roomStatus.php?id=${this.roomId}`);
            const data = await response.json();

            if (data.error) {
                console.error('Error:', data.error);
                return;
            }

            // Update player list
            this.updatePlayersList(data.players);

            // Update player count
            this.playerCount.textContent = data.players.length;
            this.maxPlayers.textContent = data.maxPlayers;

            // Check if game has started
            if (data.isStarted) {
                this.stopPolling();
                window.location.href = `game.php?id=${this.roomId}`;
                return;
            }

            // Update waiting message based on readiness
            if (data.isReady) {
                this.waitingMessage.textContent = 'Gotowi do rozpoczęcia gry!';

                // Show start button if host and game is ready
                if (this.isRoomOwner && this.startGameBtn) {
                    this.startGameBtn.classList.remove('hidden');
                }
            } else {
                this.waitingMessage.textContent = 'Oczekiwanie na graczy...';

                // Hide start button if not ready
                if (this.startGameBtn) {
                    this.startGameBtn.classList.add('hidden');
                }
            }
        } catch (error) {
            console.error('Error checking room status:', error);
        }
    }

    updatePlayersList(players) {
        this.playersList.innerHTML = '';

        players.forEach((player, index) => {
            const li = document.createElement('li');
            li.textContent = player;

            if (index === 0) {
                li.textContent += ' (gospodarz)';
            }

            if (player === this.playerName) {
                li.classList.add('current-player');
            }

            this.playersList.appendChild(li);
        });
    }

    async startGame() {
        if (!this.isRoomOwner) return;

        try {
            const formData = new FormData();
            formData.append('id', this.roomId);

            const response = await fetch('api/startGame.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                this.stopPolling();
                window.location.href = `game.php?id=${this.roomId}`;
            } else {
                console.error('Error starting game:', data.error);
                alert('Nie udało się rozpocząć gry: ' + data.error);
            }
        } catch (error) {
            console.error('Error starting game:', error);
            alert('Wystąpił błąd podczas rozpoczynania gry');
        }
    }
}

function initWaitingRoom(roomId, playerName, isRoomOwner) {
    document.addEventListener('DOMContentLoaded', () => {
        new WaitingRoom(roomId, playerName, isRoomOwner);
    });
}