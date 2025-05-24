<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Państwa i Miasta - Gra Online</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="container">
    <h1>Państwa i Miasta</h1>
    <div class="forms-container">
        <div class="form-box">
            <h2>Stwórz nowy pokój</h2>
            <form action="createRoom.php" method="post">
                <div class="form-group">
                    <label for="create-name">Twoja nazwa:</label>
                    <input type="text" id="create-name" name="playerName" required minlength="3" maxlength="15">
                </div>
                <button type="submit" class="btn">Dalej</button>
            </form>
        </div>

        <div class="form-box">
            <h2>Dołącz do pokoju</h2>
            <form action="joinRoom.php" method="post">
                <div class="form-group">
                    <label for="join-name">Twoja nazwa:</label>
                    <input type="text" id="join-name" name="playerName" required minlength="3" maxlength="15">
                </div>
                <div class="form-group">
                    <label for="room-id">ID pokoju (4 cyfry):</label>
                    <input type="text" id="room-id" name="roomId" required pattern="[0-9]{4}" maxlength="4">
                </div>
                <button type="submit" class="btn">Dołącz</button>
            </form>
        </div>
    </div>
</div>
</body>
</html>