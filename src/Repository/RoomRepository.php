<?php

class RoomRepository {
    private static ?RoomManager $instance = null;
    private array $rooms = [];
    private string $storagePath = 'data/rooms.json';

    private function __construct() {
        $this->loadRooms();
    }

    public static function getInstance(): RoomManager {
        if (self::$instance === null) {
            self::$instance = new RoomManager();
        }
        return self::$instance;
    }

    public function createRoom(int $maxPlayers, array $topics, int $rounds): string {
        // Generate unique 4-digit room ID
        do {
            $roomId = sprintf('%04d', mt_rand(1000, 9999));
        } while (isset($this->rooms[$roomId]));

        $room = new Room($roomId, $maxPlayers, $topics, $rounds);
        $this->rooms[$roomId] = $room;
        $this->saveRooms();

        return $roomId;
    }

    public function getRoomById(string $roomId): ?Room {
        return $this->rooms[$roomId] ?? null;
    }

    public function loadRooms(): void {
        // Create data directory if it doesn't exist
        if (!file_exists(dirname($this->storagePath))) {
            mkdir(dirname($this->storagePath), 0777, true);
        }

        if (file_exists($this->storagePath)) {
            $data = file_get_contents($this->storagePath);
            $roomsData = json_decode($data, true);

            if ($roomsData) {
                foreach ($roomsData as $roomData) {
                    $room = new Room(
                        $roomData['id'],
                        $roomData['maxPlayers'],
                        $roomData['topics'],
                        $roomData['rounds']
                    );

                    // Restore room state
                    $reflection = new ReflectionClass($room);

                    foreach ($roomData as $property => $value) {
                        if ($reflection->hasProperty($property)) {
                            $reflectionProperty = $reflection->getProperty($property);
                            $reflectionProperty->setAccessible(true);
                            $reflectionProperty->setValue($room, $value);
                        }
                    }

                    $this->rooms[$roomData['id']] = $room;
                }
            }
        }
    }

    public function saveRooms(): void {
        // Create data directory if it doesn't exist
        if (!file_exists(dirname($this->storagePath))) {
            mkdir(dirname($this->storagePath), 0777, true);
        }

        $roomsData = [];
        foreach ($this->rooms as $room) {
            $reflection = new ReflectionClass($room);
            $roomData = [];

            foreach ($reflection->getProperties() as $property) {
                $property->setAccessible(true);
                $roomData[$property->getName()] = $property->getValue($room);
            }

            $roomsData[] = $roomData;
        }

        file_put_contents($this->storagePath, json_encode($roomsData, JSON_PRETTY_PRINT));
    }
}