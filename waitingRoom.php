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

if ($room->isStarted()) {
    header("Location: game.php?id=$roomId");
    exit;
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Poczekalna - Państwa i Miasta</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="container">
    <h1>Poczekalna</h1>
    <div class="room-info">
        <h2>Pokój #<?php echo $roomId; ?></h2>
        <p>Liczba graczy: <span id="playerCount"><?php echo count($players); ?></span>/<span id="maxPlayers"><?php echo $room->getMaxPlayers(); ?></span></p>
    </div>

    <div class="players-list">
        <h3>Gracze:</h3>
        <ul id="playersList">
            <?php foreach ($players as $player): ?>
                <li><?php echo htmlspecialchars($player); ?><?php if ($player === $players[0]): ?> (gospodarz)<?php endif; ?></li>
            <?php endforeach; ?>
        </ul>
    </div>

    <div class="waiting-status">
        <p id="waitingMessage">Oczekiwanie na graczy...</p>
        <?php if ($room->isReady() && $players[0] === $playerName): ?>
            <button id="startGameBtn" class="btn">Rozpocznij grę</button>
        <?php endif; ?>
    </div>
</div>

<script src="js/waitingRoom.js"></script>
<script>
    const roomId = '<?php echo $roomId; ?>';
    const playerName = '<?php echo $playerName; ?>';
    const isRoomOwner = <?php echo ($players[0] === $playerName) ? 'true' : 'false'; ?>;

    initWaitingRoom(roomId, playerName, isRoomOwner);
</script>
</body>
</html>