<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

require_once 'classes/Room.php';
require_once 'classes/RoomManager.php';

$playerName = $_POST['playerName'] ?? '';
$roomId = $_POST['roomId'] ?? '';

// Walidacja
if (empty($playerName) || empty($roomId) || !preg_match('/^\d{4}$/', $roomId)) {
    header('Location: index.php?error=invalid_input');
    exit;
}

$_SESSION['playerName'] = $playerName;

// Dołączanie do pokoju
$roomManager = RoomManager::getInstance();
$room = $roomManager->getRoomById($roomId);

if (!$room) {
    header('Location: index.php?error=room_not_found');
    exit;
}

if (count($room->getPlayers()) >= $room->getMaxPlayers()) {
    header('Location: index.php?error=room_full');
    exit;
}

if ($room->isStarted()) {
    header('Location: index.php?error=game_already_started');
    exit;
}

$room->addPlayer($playerName);
$roomManager->saveRooms();

// Przekierowanie do poczekalni
header("Location: waitingRoom.php?id=$roomId");
exit;