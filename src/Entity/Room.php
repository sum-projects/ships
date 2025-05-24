<?php
class Room {
    private string $id;
    private int $maxPlayers;
    private array $topics;
    private int $rounds;
    private array $players = [];
    private bool $started = false;
    private int $currentRound = 0;
    private ?string $currentLetter = null;
    private array $roundAnswers = [];
    private array $votes = [];
    private array $scores = [];
    private bool $roundComplete = false;

    public function __construct(string $id, int $maxPlayers, array $topics, int $rounds) {
        $this->id = $id;
        $this->maxPlayers = $maxPlayers;
        $this->topics = $topics;
        $this->rounds = $rounds;
    }

    public function getId(): string {
        return $this->id;
    }

    public function getMaxPlayers(): int {
        return $this->maxPlayers;
    }

    public function getTopics(): array {
        return $this->topics;
    }

    public function getRounds(): int {
        return $this->rounds;
    }

    public function getPlayers(): array {
        return $this->players;
    }

    public function isStarted(): bool {
        return $this->started;
    }

    public function getCurrentRound(): int {
        return $this->currentRound;
    }

    public function getCurrentLetter(): ?string {
        return $this->currentLetter;
    }

    public function getRoundAnswers(): array {
        return $this->roundAnswers;
    }

    public function getVotes(): array {
        return $this->votes;
    }

    public function getScores(): array {
        return $this->scores;
    }

    public function isRoundComplete(): bool {
        return $this->roundComplete;
    }

    public function addPlayer(string $playerName): bool {
        if (count($this->players) < $this->maxPlayers && !in_array($playerName, $this->players)) {
            $this->players[] = $playerName;
            $this->scores[$playerName] = 0;
            return true;
        }
        return false;
    }

    public function isReady(): bool {
        return count($this->players) >= 2;
    }

    public function startGame(): bool {
        if (!$this->isReady() || $this->started) {
            return false;
        }

        $this->started = true;
        $this->currentRound = 1;
        $this->generateRandomLetter();
        return true;
    }

    public function generateRandomLetter(): void {
        $letters = range('A', 'Z');
        // Removing difficult letters like Q, X, Y, Z for simplicity
        $excludeLetters = ['Q', 'V', 'X', 'Y'];
        $letters = array_diff($letters, $excludeLetters);
        $this->currentLetter = $letters[array_rand($letters)];
    }

    public function submitAnswers(string $playerName, array $answers): bool {
        if (!$this->started || $this->roundComplete || $this->currentRound > $this->rounds) {
            return false;
        }

        $this->roundAnswers[$playerName] = $answers;

        // Check if all players have submitted answers
        if (count($this->roundAnswers) >= count($this->players)) {
            $this->roundComplete = true;
        }

        return true;
    }

    public function voteAnswers(string $playerName, array $votes): bool {
        if (!$this->started || !$this->roundComplete) {
            return false;
        }

        $this->votes[$playerName] = $votes;

        // Check if all players have voted
        if (count($this->votes) >= count($this->players)) {
            $this->calculateScores();
            return true;
        }

        return false;
    }

    public function calculateScores(): void {
        // For each topic
        foreach ($this->topics as $topicIndex => $topic) {
            $answers = [];

            // Collect all answers for this topic
            foreach ($this->roundAnswers as $player => $playerAnswers) {
                if (isset($playerAnswers[$topicIndex]) && !empty($playerAnswers[$topicIndex])) {
                    $answer = strtolower(trim($playerAnswers[$topicIndex]));
                    if (!empty($answer)) {
                        $answers[$player] = $answer;
                    }
                }
            }

            // Count how many times each answer appears
            $answerCounts = array_count_values($answers);

            // Process votes and add points
            foreach ($this->votes as $voter => $votedAnswers) {
                if (isset($votedAnswers[$topicIndex])) {
                    foreach ($votedAnswers[$topicIndex] as $player => $isValid) {
                        if ($isValid && isset($answers[$player])) {
                            // If answer is valid according to votes
                            $answerCount = $answerCounts[$answers[$player]];

                            if ($answerCount == 1) {
                                // Unique answer: 20 points
                                $this->scores[$player] += 20;
                            } elseif ($answerCount > 1) {
                                // Duplicated answer: 5 points
                                $this->scores[$player] += 5;
                            }
                        }
                    }
                }
            }
        }
    }

    public function nextRound(): bool {
        if (!$this->started || !$this->roundComplete || $this->currentRound >= $this->rounds) {
            return false;
        }

        $this->currentRound++;
        $this->roundAnswers = [];
        $this->votes = [];
        $this->roundComplete = false;
        $this->generateRandomLetter();

        return true;
    }

    public function isGameComplete(): bool {
        return $this->started && $this->currentRound > $this->rounds;
    }

    public function getWinner(): ?string {
        if (!$this->isGameComplete()) {
            return null;
        }

        arsort($this->scores);
        return array_key_first($this->scores);
    }

    public function getGameState(): array {
        return [
            'id' => $this->id,
            'maxPlayers' => $this->maxPlayers,
            'topics' => $this->topics,
            'rounds' => $this->rounds,
            'players' => $this->players,
            'started' => $this->started,
            'currentRound' => $this->currentRound,
            'currentLetter' => $this->currentLetter,
            'roundComplete' => $this->roundComplete,
            'scores' => $this->scores,
            'gameComplete' => $this->isGameComplete()
        ];
    }
}