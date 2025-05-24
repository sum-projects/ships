<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

require_once '../classes/Room.php';
require_once '../classes/RoomManager.php';

header('Content-Type: application/json');

$roomId = $_POST['id'] ?? '';
$playerName = $_SESSION['playerName'] ?? '';

if (empty($roomId) || empty($playerName)) {
    echo json_encode(['success' => false, 'error' => 'Missing roomId or playerName']);
    exit;
}

$roomManager = RoomManager::getInstance();
$room = $roomManager->getRoomById($roomId);

if (!$room) {
    echo json_encode(['success' => false, 'error' => 'Room not found']);
    exit;
}

$players = $room->getPlayers();
$isHost = ($players[0] === $playerName);

if (!$isHost) {
    echo json_encode(['success' => false, 'error' => 'Only host can start the game']);
    exit;
}

if (!$room->isReady()) {
    echo json_encode(['success' => false, 'error' => 'Not enough players']);
    exit;
}

if ($room->startGame()) {
    $roomManager->saveRooms();
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to start game']);
}
exit;