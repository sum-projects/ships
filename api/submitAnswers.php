<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

require_once '../classes/Room.php';
require_once '../classes/RoomManager.php';

header('Content-Type: application/json');

$roomId = $_POST['id'] ?? '';
$playerName = $_SESSION['playerName'] ?? '';
$answers = $_POST['answers'] ?? [];

if (empty($roomId) || empty($playerName) || empty($answers)) {
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
$isPlayerInRoom = in_array($playerName, $players);

if (!$isPlayerInRoom) {
    echo json_encode(['success' => false, 'error' => 'Player not in room']);
    exit;
}

if (!$room->isStarted()) {
    echo json_encode(['success' => false, 'error' => 'Game not started']);
    exit;
}

// Validate answers format
$topics = $room->getTopics();
$validatedAnswers = [];

foreach ($topics as $index => $topic) {
    $validatedAnswers[$index] = $answers[$index] ?? '';
}

// Submit answers
if ($room->submitAnswers($playerName, $validatedAnswers)) {
    $roomManager->saveRooms();
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to submit answers']);
}
exit;