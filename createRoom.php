<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

require_once 'classes/Room.php';
require_once 'classes/RoomManager.php';

$playerName = $_POST['playerName'] ?? '';

if (empty($playerName)) {
    header('Location: index.php');
    exit;
}

$_SESSION['playerName'] = $playerName;
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tworzenie pokoju - Państwa i Miasta</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="container">
    <h1>Tworzenie pokoju</h1>
    <form action="processCreateRoom.php" method="post">
        <div class="form-group">
            <label for="max-players">Liczba graczy:</label>
            <input type="number" id="max-players" name="maxPlayers" min="2" max="10" value="4" required>
        </div>

        <div class="form-group">
            <label for="rounds">Liczba rund:</label>
            <input type="number" id="rounds" name="rounds" min="5" max="20" value="10" required>
        </div>

        <div class="form-group">
            <label>Tematy (min 5, max 15):</label>
            <div id="topics-container">
                <div class="topic-item">
                    <input type="text" name="topics[]" placeholder="Temat 1" value="Państwo" required>
                </div>
                <div class="topic-item">
                    <input type="text" name="topics[]" placeholder="Temat 2" value="Miasto" required>
                </div>
                <div class="topic-item">
                    <input type="text" name="topics[]" placeholder="Temat 3" value="Rzeka" required>
                </div>
                <div class="topic-item">
                    <input type="text" name="topics[]" placeholder="Temat 4" value="Góra" required>
                </div>
                <div class="topic-item">
                    <input type="text" name="topics[]" placeholder="Temat 5" value="Zwierzę" required>
                </div>
            </div>
            <div class="topics-buttons">
                <button type="button" id="add-topic" class="btn-small">Dodaj temat</button>
                <button type="button" id="remove-topic" class="btn-small">Usuń temat</button>
            </div>
        </div>

        <button type="submit" class="btn">Stwórz pokój</button>
    </form>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const topicsContainer = document.getElementById('topics-container');
        const addTopicBtn = document.getElementById('add-topic');
        const removeTopicBtn = document.getElementById('remove-topic');

        addTopicBtn.addEventListener('click', function() {
            const topicItems = topicsContainer.querySelectorAll('.topic-item');
            if (topicItems.length < 15) {
                const newItem = document.createElement('div');
                newItem.className = 'topic-item';
                newItem.innerHTML = `<input type="text" name="topics[]" placeholder="Temat ${topicItems.length + 1}" required>`;
                topicsContainer.appendChild(newItem);

                if (topicItems.length + 1 >= 15) {
                    addTopicBtn.disabled = true;
                }
                removeTopicBtn.disabled = false;
            }
        });

        removeTopicBtn.addEventListener('click', function() {
            const topicItems = topicsContainer.querySelectorAll('.topic-item');
            if (topicItems.length > 5) {
                topicsContainer.removeChild(topicItems[topicItems.length - 1]);

                if (topicItems.length - 1 <= 5) {
                    removeTopicBtn.disabled = true;
                }
                addTopicBtn.disabled = false;
            }
        });
    });
</script>
</body>
</html>