import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { CreateRoomDialog } from "./CreateRoomDialog";

export interface Room {
  id: string;
  name: string;
  createdBy: string;
  playerCount: number;
}

interface RoomListProps {
  rooms: Room[];
  onJoinRoom: (roomId: string) => void;
  onCreateRoom: (roomName: string) => void;
}

export function RoomList({ rooms, onJoinRoom, onCreateRoom }: RoomListProps) {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Planning Poker Rooms</h2>
        <CreateRoomDialog onCreateRoom={onCreateRoom} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <Card key={room.id} className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{room.name}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-1" />
                {room.playerCount} players
              </div>
            </div>
            <Button
              onClick={() => onJoinRoom(room.id)}
              className="w-full"
              variant="outline"
            >
              Join Room
            </Button>
          </Card>
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No rooms available. Create one to get started!
        </div>
      )}
    </div>
  );
}
