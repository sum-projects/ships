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
    echo json_encode(['success' => false, 'error' => 'Missing required data']);
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
    echo json_encode(['success' => false, 'error' => 'Only host can advance to next round']);
    exit;
}

if (!$room->isStarted() || !$room->isRoundComplete()) {
    echo json_encode(['success' => false, 'error' => 'Cannot advance to next round yet']);
    exit;
}

if ($room->nextRound()) {
    $roomManager->saveRooms();
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to advance to next round']);
}
exit;