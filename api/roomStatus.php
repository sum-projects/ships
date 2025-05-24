<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

require_once '../classes/Room.php';
require_once '../classes/RoomManager.php';

header('Content-Type: application/json');

$roomId = $_GET['id'] ?? '';
$playerName = $_SESSION['playerName'] ?? '';

if (empty($roomId) || empty($playerName)) {
    echo json_encode(['error' => 'Missing roomId or playerName']);
    exit;
}

$roomManager = RoomManager::getInstance();
$room = $roomManager->getRoomById($roomId);

if (!$room) {
    echo json_encode(['error' => 'Room not found']);
    exit;
}

$players = $room->getPlayers();
$isPlayerInRoom = in_array($playerName, $players);

if (!$isPlayerInRoom) {
    echo json_encode(['error' => 'Player not in room']);
    exit;
}

// Return room status
$response = [
    'roomId' => $roomId,
    'players' => $players,
    'maxPlayers' => $room->getMaxPlayers(),
    'isReady' => $room->isReady(),
    'isStarted' => $room->isStarted(),
    'isHost' => ($players[0] === $playerName)
];

echo json_encode($response);
exit;