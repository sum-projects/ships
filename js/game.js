class Game {
    constructor(roomId, playerName) {
        this.roomId = roomId;
        this.playerName = playerName;
        this.gameState = null;

        // Game elements
        this.currentRoundElement = document.getElementById('currentRound');
        this.totalRoundsElement = document.getElementById('totalRounds');
        this.currentLetterElement = document.getElementById('currentLetter');
        this.timerValueElement = document.getElementById('timerValue');
        this.topicsContainer = document.getElementById('topicsContainer');

        // Game phases
        this.inputPhase = document.getElementById('inputPhase');
        this.waitingPhase = document.getElementById('waitingPhase');
        this.votingPhase = document.getElementById('votingPhase');
        this.resultsPhase = document.getElementById('resultsPhase');

        // Forms and buttons
        this.answersForm = document.getElementById('answersForm');
        this.submitAnswersBtn = document.getElementById('submitAnswers');
        this.votingContainer = document.getElementById('votingContainer');
        this.submitVotesBtn = document.getElementById('submitVotes');
        this.playersSubmittedList = document.getElementById('playersSubmittedList');
        this.scoresTableBody = document.getElementById('scoresTableBody');
        this.nextRoundContainer = document.getElementById('nextRoundContainer');
        this.nextRoundBtn = document.getElementById('nextRoundBtn');

        // Game state
        this.timerInterval = null;
        this.timerStartTime = null;
        this.timerDuration = 120; // 2 minutes
        this.pollInterval = null;

        this.initListeners();
        this.startPolling();
    }

    initListeners() {
        // Submit answers form
        this.answersForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitAnswers();
        });

        // Submit votes button
        this.submitVotesBtn.addEventListener('click', () => {
            this.submitVotes();
        });

        // Next round button
        if (this.nextRoundBtn) {
            this.nextRoundBtn.addEventListener('click', () => {
                this.nextRound();
            });
        }
    }

    startPolling() {
        // Immediately check game status
        this.checkGameStatus();

        // Set up polling interval
        this.pollInterval = setInterval(() => {
            this.checkGameStatus();
        }, 2000);
    }

    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }

    async checkGameStatus() {
        try {
            const response = await fetch(`api/gameStatus.php?id=${this.roomId}`);
            const data = await response.json();

            if (data.error) {
                console.error('Error:', data.error);
                return;
            }

            // Update game state
            this.gameState = data;

            // Update game UI
            this.updateGameUI();

            // Check if game is complete
            if (this.gameState.gameComplete) {
                this.stopPolling();
                window.location.href = `results.php?id=${this.roomId}`;
                return;
            }
        } catch (error) {
            console.error('Error checking game status:', error);
        }
    }

    updateGameUI() {
        // Update round info
        this.currentRoundElement.textContent = this.gameState.currentRound;
        this.totalRoundsElement.textContent = this.gameState.rounds;
        this.currentLetterElement.textContent = this.gameState.currentLetter;

        // Determine current phase
        if (!this.gameState.hasSubmittedAnswers) {
            // Input phase
            this.showPhase('input');
            this.updateInputPhase();
        } else if (!this.gameState.roundComplete) {
            // Waiting phase
            this.showPhase('waiting');
            this.updateWaitingPhase();
        } else if (!this.gameState.hasVoted) {
            // Voting phase
            this.showPhase('voting');
            this.updateVotingPhase();
        } else {
            // Results phase
            this.showPhase('results');
            this.updateResultsPhase();
        }
    }

    showPhase(phase) {
        this.inputPhase.classList.add('hidden');
        this.waitingPhase.classList.add('hidden');
        this.votingPhase.classList.add('hidden');
        this.resultsPhase.classList.add('hidden');

        switch (phase) {
            case 'input':
                this.inputPhase.classList.remove('hidden');
                this.startTimer();
                break;
            case 'waiting':
                this.waitingPhase.classList.remove('hidden');
                this.stopTimer();
                break;
            case 'voting':
                this.votingPhase.classList.remove('hidden');
                this.stopTimer();
                break;
            case 'results':
                this.resultsPhase.classList.remove('hidden');
                this.stopTimer();
                break;
        }
    }

    updateInputPhase() {
        if (this.topicsContainer.children.length === 0) {
            // Only create the form once
            this.topicsContainer.innerHTML = '';

            this.gameState.topics.forEach((topic, index) => {
                const topicGroup = document.createElement('div');
                topicGroup.className = 'topic-group';

                const label = document.createElement('label');
                label.textContent = topic + ':';
                label.htmlFor = `answer-${index}`;

                const input = document.createElement('input');
                input.type = 'text';
                input.id = `answer-${index}`;
                input.name = `answer-${index}`;
                input.required = true;
                input.placeholder = `${topic} na literę ${this.gameState.currentLetter}`;
                input.pattern = `^[${this.gameState.currentLetter}${this.gameState.currentLetter.toLowerCase()}].*`;
                input.title = `Odpowiedź musi zaczynać się na literę ${this.gameState.currentLetter}`;

                topicGroup.appendChild(label);
                topicGroup.appendChild(input);
                this.topicsContainer.appendChild(topicGroup);
            });
        }
    }

    updateWaitingPhase() {
        this.playersSubmittedList.innerHTML = '';

        Object.entries(this.gameState.playersSubmitted).forEach(([player, hasSubmitted]) => {
            const li = document.createElement('li');
            li.textContent = player;

            if (hasSubmitted) {
                li.classList.add('submitted');
                li.textContent += ' ✓';
            } else {
                li.classList.add('not-submitted');
                li.textContent += ' ...';
            }

            this.playersSubmittedList.appendChild(li);
        });
    }

    updateVotingPhase() {
        this.votingContainer.innerHTML = '';

        const allAnswers = this.gameState.allAnswers;
        const currentLetter = this.gameState.currentLetter;

        this.gameState.topics.forEach((topic, topicIndex) => {
            const topicDiv = document.createElement('div');
            topicDiv.className = 'voting-topic';

            const topicHeader = document.createElement('h4');
            topicHeader.textContent = topic;
            topicDiv.appendChild(topicHeader);

            const answersList = document.createElement('ul');
            answersList.className = 'answers-list';

            Object.entries(allAnswers).forEach(([player, answers]) => {
                if (player === this.playerName) return; // Skip own answers

                const answer = answers[topicIndex];
                if (!answer) return; // Skip empty answers

                // Check if answer starts with correct letter
                const startsWithCorrectLetter = answer.toUpperCase().startsWith(currentLetter);

                const li = document.createElement('li');
                li.className = 'answer-item';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `vote-${topicIndex}-${player}`;
                checkbox.name = `vote-${topicIndex}-${player}`;
                checkbox.value = 'valid';
                checkbox.checked = startsWithCorrectLetter; // Pre-check if starts with correct letter

                const label = document.createElement('label');
                label.htmlFor = `vote-${topicIndex}-${player}`;
                label.textContent = `${player}: ${answer}`;

                if (!startsWithCorrectLetter) {
                    li.classList.add('invalid-answer');
                }

                li.appendChild(checkbox);
                li.appendChild(label);
                answersList.appendChild(li);
            });

            topicDiv.appendChild(answersList);
            this.votingContainer.appendChild(topicDiv);
        });

        // If no answers to vote on, show message
        if (this.votingContainer.children.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'Brak odpowiedzi do głosowania';
            this.votingContainer.appendChild(message);
            this.submitVotesBtn.disabled = true;
        } else {
            this.submitVotesBtn.disabled = false;
        }
    }

    updateResultsPhase() {
        // Update scores table
        this.scoresTableBody.innerHTML = '';

        const scores = this.gameState.scores;
        const sortedPlayers = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);

        sortedPlayers.forEach(player => {
            const tr = document.createElement('tr');

            if (player === this.playerName) {
                tr.classList.add('highlight-player');
            }

            const nameCell = document.createElement('td');
            nameCell.textContent = player;

            const scoreCell = document.createElement('td');
            scoreCell.textContent = scores[player];

            tr.appendChild(nameCell);
            tr.appendChild(scoreCell);
            this.scoresTableBody.appendChild(tr);
        });

        // Show next round button for host
        this.nextRoundContainer.classList.add('hidden');
        if (this.gameState.isHost) {
            this.nextRoundContainer.classList.remove('hidden');
        }
    }

    startTimer() {
        this.stopTimer();

        this.timerStartTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.timerStartTime) / 1000);
            const remaining = Math.max(0, this.timerDuration - elapsed);

            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;

            this.timerValueElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (remaining === 0) {
                this.stopTimer();
                this.submitAnswers(true); // Auto-submit on timeout
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    async submitAnswers(timeout = false) {
        if (!this.gameState) return;

        // Collect answers
        const answers = [];

        this.gameState.topics.forEach((topic, index) => {
            const input = document.getElementById(`answer-${index}`);
            answers[index] = timeout ? '' : input.value.trim();
        });

        // Submit answers
        try {
            const formData = new FormData();
            formData.append('id', this.roomId);
            formData.append('answers', JSON.stringify(answers));

            const response = await fetch('api/submitAnswers.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                this.showPhase('waiting');
                this.checkGameStatus(); // Immediately check for updates
            } else {
                console.error('Error submitting answers:', data.error);
                alert('Nie udało się przesłać odpowiedzi: ' + data.error);
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
            alert('Wystąpił błąd podczas przesyłania odpowiedzi');
        }
    }

    async submitVotes() {
        if (!this.gameState) return;

        // Collect votes
        const votes = {};

        this.gameState.topics.forEach((topic, topicIndex) => {
            votes[topicIndex] = {};

            Object.keys(this.gameState.allAnswers).forEach(player => {
                if (player === this.playerName) return; // Skip own answers

                const checkbox = document.getElementById(`vote-${topicIndex}-${player}`);
                if (checkbox) {
                    votes[topicIndex][player] = checkbox.checked;
                }
            });
        });

        // Submit votes
        try {
            const formData = new FormData();
            formData.append('id', this.roomId);
            formData.append('votes', JSON.stringify(votes));

            const response = await fetch('api/submitVotes.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                this.showPhase('results');
                this.checkGameStatus(); // Immediately check for updates
            } else {
                console.error('Error submitting votes:', data.error);
                alert('Nie udało się przesłać głosów: ' + data.error);
            }
        } catch (error) {
            console.error('Error submitting votes:', error);
            alert('Wystąpił błąd podczas przesyłania głosów');
        }
    }

    async nextRound() {
        if (!this.gameState || !this.gameState.isHost) return;

        try {
            const formData = new FormData();
            formData.append('id', this.roomId);

            const response = await fetch('api/nextRound.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                this.checkGameStatus(); // Immediately check for updates
            } else {
                console.error('Error advancing to next round:', data.error);
                alert('Nie udało się przejść do następnej rundy: ' + data.error);
            }
        } catch (error) {
            console.error('Error advancing to next round:', error);
            alert('Wystąpił błąd podczas przechodzenia do następnej rundy');
        }
    }
}

function initGame(roomId, playerName) {
    document.addEventListener('DOMContentLoaded', () => {
        new Game(roomId, playerName);
    });
}