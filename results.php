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

if (!$room->isGameComplete()) {
    header("Location: game.php?id=$roomId");
    exit;
}

$scores = $room->getScores();
arsort($scores);
$winner = array_key_first($scores);
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wyniki - Państwa i Miasta</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="container">
    <h1>Koniec gry - Wyniki</h1>

    <div class="winner-announcement">
        <h2>Zwycięzca: <?php echo htmlspecialchars($winner); ?></h2>
        <div class="crown-icon">👑</div>
    </div>

    <div class="final-scores">
        <h3>Tabela wyników</h3>
        <table class="scores-table">
            <thead>
            <tr>
                <th>Miejsce</th>
                <th>Gracz</th>
                <th>Punkty</th>
            </tr>
            </thead>
            <tbody>
            <?php
            $place = 1;
            $lastScore = -1;
            $realPlace = 1;

            foreach ($scores as $player => $score):
                if ($lastScore != $score) {
                    $realPlace = $place;
                }
                $lastScore = $score;
                ?>
                <tr<?php if ($player === $playerName) echo ' class="highlight-player"'; ?>>
                    <td><?php echo $realPlace; ?></td>
                    <td><?php echo htmlspecialchars($player); ?></td>
                    <td><?php echo $score; ?></td>
                </tr>
                <?php
                $place++;
            endforeach;
            ?>
            </tbody>
        </table>
    </div>

    <div class="game-controls">
        <a href="index.php" class="btn">Wróć do strony głównej</a>
    </div>
</div>
</body>
</html>