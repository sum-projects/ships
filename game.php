<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

require_once 'classes/Room.php';
require_once 'classes/RoomManager.php';

$roomId = $_GET['id'] ?? '';
$playerName = $_SESSION['playerName'] ?? '';

if (empty($roomId) || empty($playerName)) {
    header('Location: index.php');
    exit;
}

$roomManager = RoomManager::getInstance();
$room = $roomManager->getRoomById($roomId);

if (!$room) {
    header('Location: index.php?error=room_not_found');
    exit;
}

$players = $room->getPlayers();
$isPlayerInRoom = in_array($playerName, $players);

if (!$isPlayerInRoom) {
    header('Location: index.php?error=not_in_room');
    exit;
}

if (!$room->isStarted()) {
    header("Location: waitingRoom.php?id=$roomId");
    exit;
}

if ($room->isGameComplete()) {
    header("Location: results.php?id=$roomId");
    exit;
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gra - Państwa i Miasta</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="container">
    <div class="game-header">
        <h1>Państwa i Miasta - Runda <span id="currentRound"></span>/<span id="totalRounds"></span></h1>
        <div class="letter-display">Litera: <span id="currentLetter" class="current-letter"></span></div>
        <div class="timer-container">
            <div id="timer">Czas: <span id="timerValue">00:00</span></div>
        </div>
    </div>

    <div class="game-container">
        <!-- Input Phase -->
        <div id="inputPhase" class="game-phase">
            <form id="answersForm">
                <div id="topicsContainer"></div>
                <button type="submit" id="submitAnswers" class="btn">Zatwierdź odpowiedzi</button>
            </form>
        </div>

        <!-- Waiting Phase -->
        <div id="waitingPhase" class="game-phase hidden">
            <h3>Czekanie na innych graczy...</h3>
            <div class="players-submitted">
                <ul id="playersSubmittedList"></ul>
            </div>
        </div>

        <!-- Voting Phase -->
        <div id="votingPhase" class="game-phase hidden">
            <h3>Głosowanie na odpowiedzi</h3>
            <div id="votingContainer"></div>
            <button id="submitVotes" class="btn">Zatwierdź głosy</button>
        </div>

        <!-- Results Phase -->
        <div id="resultsPhase" class="game-phase hidden">
            <h3>Wyniki rundy</h3>
            <div class="round-results">
                <table class="scores-table">
                    <thead>
                    <tr>
                        <th>Gracz</th>
                        <th>Punkty</th>
                    </tr>
                    </thead>
                    <tbody id="scoresTableBody">
                    </tbody>
                </table>
            </div>
            <div id="nextRoundContainer" class="hidden">
                <button id="nextRoundBtn" class="btn">Następna runda</button>
            </div>
        </div>
    </div>
</div>

<script src="js/game.js"></script>
<script>
    const roomId = '<?php echo $roomId; ?>';
    const playerName = '<?php echo $playerName; ?>';

    initGame(roomId, playerName);
</script>
</body>
</html>