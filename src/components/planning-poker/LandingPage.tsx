import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { RoomList, Room } from "./RoomList";
import { Button } from "@/components/ui/button";
import { LogOut, Spade } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getAppUrl } from "@/utils/url";

export default function LandingPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    loadRooms();

    const subscription = supabase
      .channel("rooms_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setRooms((prev) => [...prev, payload.new as Room]);
          } else if (payload.eventType === "DELETE") {
            setRooms((prev) =>
              prev.filter((room) => room.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadRooms = async () => {
    const { data, error } = await supabase.from("rooms").select(`
        *,
        room_players:room_players(count)
      `);

    if (error) {
      console.error("Error loading rooms:", error);
      return;
    }

    setRooms(
      data.map((room) => ({
        id: room.id,
        name: room.name,
        createdBy: room.created_by,
        playerCount: room.room_players?.[0]?.count || 0,
      })),
    );
  };

  const handleCreateRoom = async (roomName: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("rooms")
      .insert([
        {
          name: roomName,
          created_by: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating room:", error);
      return;
    }

    const baseUrl = getAppUrl();
    navigate(`/room/${data.id}`);
  };

  const handleJoinRoom = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Spade className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold">Planning Poker</h1>
          </div>
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
