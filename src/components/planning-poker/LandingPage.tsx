import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { RoomList, Room } from "./RoomList";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LandingPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      name: "Frontend Team Sprint Planning",
      createdBy: "user1",
      playerCount: 5,
    },
    {
      id: "2",
      name: "Backend Team Estimation",
      createdBy: "user2",
      playerCount: 3,
    },
  ]);

  const handleCreateRoom = (roomName: string) => {
    const newRoom: Room = {
      id: Math.random().toString(36).substr(2, 9),
      name: roomName,
      createdBy: user?.id || "",
      playerCount: 1,
    };
    setRooms([...rooms, newRoom]);
    navigate(`/room/${newRoom.id}`);
  };

  const handleJoinRoom = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Planning Poker</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8">
        <RoomList
          rooms={rooms}
          onJoinRoom={handleJoinRoom}
          onCreateRoom={handleCreateRoom}
        />
      </main>
    </div>
  );
}
