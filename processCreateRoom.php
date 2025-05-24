<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

require_once 'classes/Room.php';
require_once 'classes/RoomManager.php';

$playerName = $_SESSION['playerName'] ?? '';
$maxPlayers = $_POST['maxPlayers'] ?? 0;
$rounds = $_POST['rounds'] ?? 0;
$topics = $_POST['topics'] ?? [];

// Walidacja
if (empty($playerName) || $maxPlayers < 2 || $maxPlayers > 10 ||
    $rounds < 5 || $rounds > 20 ||
    count($topics) < 5 || count($topics) > 15) {
    header('Location: createRoom.php');
    exit;
}

// Filtracja tematów
$filteredTopics = [];
foreach ($topics as $topic) {
    $topic = trim($topic);
    if (!empty($topic)) {
        $filteredTopics[] = $topic;
    }
}

if (count($filteredTopics) < 5) {
    header('Location: createRoom.php');
    exit;
}

// Tworzenie pokoju
$roomManager = RoomManager::getInstance();
$roomId = $roomManager->createRoom($maxPlayers, $filteredTopics, $rounds);
$room = $roomManager->getRoomById($roomId);
$room->addPlayer($playerName);
$roomManager->saveRooms();

// Przekierowanie do poczekalni
header("Location: waitingRoom.php?id=$roomId");
exit;