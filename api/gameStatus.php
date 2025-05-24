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

if (!$room->isStarted()) {
    echo json_encode(['error' => 'Game not started']);
    exit;
}

// Get game state
$gameState = $room->getGameState();

// Add player-specific information
$gameState['playerName'] = $playerName;
$gameState['hasSubmittedAnswers'] = isset($room->getRoundAnswers()[$playerName]);
$gameState['hasVoted'] = isset($room->getVotes()[$playerName]);
$gameState['isHost'] = ($players[0] === $playerName);

// For voting phase, include all answers
if ($room->isRoundComplete() && !$gameState['hasVoted']) {
    $gameState['allAnswers'] = $room->getRoundAnswers();
} else {
    // Otherwise, only include whether other players have submitted
    $playersSubmitted = [];
    foreach ($players as $player) {
        $playersSubmitted[$player] = isset($room->getRoundAnswers()[$player]);
    }
    $gameState['playersSubmitted'] = $playersSubmitted;
}

echo json_encode($gameState);
exit;