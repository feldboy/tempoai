import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Header from "./planning-poker/Header";
import GameArea from "./planning-poker/GameArea";
import CardDeck from "./planning-poker/CardDeck";
import { Task } from "./planning-poker/TaskList";
import { useParams, useNavigate } from "react-router-dom";
import { getAppUrl } from "@/utils/url";
import { InviteDialog } from "./planning-poker/InviteDialog";
import { CharacterSelectDialog } from "./planning-poker/CharacterSelectDialog";
import { SaveScoreButton } from "./planning-poker/SaveScoreButton";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

interface Player {
  id: string;
  name: string;
  value?: string | number;
  hasVoted: boolean;
  avatarUrl?: string;
}

interface Room {
  id: string;
  name: string;
  created_by: string;
}

const Home = () => {
  const { roomId } = useParams();
  const baseUrl = getAppUrl();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | number | null>(
    null,
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showCharacterSelect, setShowCharacterSelect] = useState(true);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [room, setRoom] = useState<Room | null>(null);

  // Get current user ID from auth
  const currentUserId = user?.id;

  // Load room and join as player
  useEffect(() => {
    if (roomId && user && currentUserId) {
      loadRoom();
      joinRoom();
    }
  }, [roomId, user, currentUserId]);

  // Load tasks and subscribe to changes
  useEffect(() => {
    if (roomId) {
      loadTasks();
      const taskSubscription = supabase
        .channel(`tasks:${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "tasks",
            filter: `room_id=eq.${roomId}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setTasks((prev) => [...prev, payload.new as Task]);
            } else if (payload.eventType === "UPDATE") {
              setTasks((prev) =>
                prev.map((task) =>
                  task.id === payload.new.id ? (payload.new as Task) : task,
                ),
              );
              if (currentTask?.id === payload.new.id) {
                setCurrentTask(payload.new as Task);
              }
            }
          },
        )
        .subscribe();

      // Subscribe to player changes
      const playerSubscription = supabase
        .channel(`room_players:${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "room_players",
            filter: `room_id=eq.${roomId}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setPlayers((prev) => [
                ...prev,
                {
                  id: payload.new.user_id,
                  name: payload.new.name,
                  hasVoted: payload.new.has_voted,
                  value: payload.new.current_vote,
                  avatarUrl: payload.new.avatar_url,
                },
              ]);
            } else if (payload.eventType === "UPDATE") {
              setPlayers((prev) =>
                prev.map((player) =>
                  player.id === payload.new.user_id
                    ? {
                        ...player,
                        hasVoted: payload.new.has_voted,
                        value: payload.new.current_vote,
                        name: payload.new.name,
                        avatarUrl: payload.new.avatar_url,
                      }
                    : player,
                ),
              );
            } else if (payload.eventType === "DELETE") {
              setPlayers((prev) =>
                prev.filter((player) => player.id !== payload.old.user_id),
              );
            }
          },
        )
        .subscribe();

      return () => {
        taskSubscription.unsubscribe();
        playerSubscription.unsubscribe();
        leaveRoom();
      };
    }
  }, [roomId]);

  const loadRoom = async () => {
    if (!roomId) return;

    const { data: roomData, error: roomError } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (roomError) {
      console.error("Error loading room:", roomError);
      navigate("/");
      return;
    }

    setRoom(roomData);

    // Load existing players
    const { data: playersData, error: playersError } = await supabase
      .from("room_players")
      .select("*")
      .eq("room_id", roomId);

    if (playersError) {
      console.error("Error loading players:", playersError);
      return;
    }

    setPlayers(
      playersData.map((p) => ({
        id: p.user_id,
        name: p.name,
        hasVoted: p.has_voted,
        value: p.current_vote,
        avatarUrl: p.avatar_url,
      })),
    );
  };

  const joinRoom = async () => {
    if (!roomId || !user || !currentUserId) return;

    const { error } = await supabase.from("room_players").upsert({
      room_id: roomId,
      user_id: currentUserId,
      name: user.name,
      avatar_url: user.avatarUrl,
      has_voted: false,
      current_vote: null,
    });

    if (error) {
      console.error("Error joining room:", error);
    }
  };

  const leaveRoom = async () => {
    if (!roomId || !user || !currentUserId) return;

    const { error } = await supabase
      .from("room_players")
      .delete()
      .eq("room_id", roomId)
      .eq("user_id", currentUserId);

    if (error) {
      console.error("Error leaving room:", error);
    }
  };

  const updatePlayerVote = async (value: string | number) => {
    if (!roomId || !user || !currentUserId) return;

    const { error } = await supabase
      .from("room_players")
      .update({
        has_voted: true,
        current_vote: value.toString(),
      })
      .eq("room_id", roomId)
      .eq("user_id", currentUserId);

    if (error) {
      console.error("Error updating vote:", error);
    }
  };

  const resetPlayerVotes = async () => {
    if (!roomId) return;

    const { error } = await supabase
      .from("room_players")
      .update({
        has_voted: false,
        current_vote: null,
      })
      .eq("room_id", roomId);

    if (error) {
      console.error("Error resetting votes:", error);
    }
  };

  const loadTasks = async () => {
    if (!roomId) return;

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading tasks:", error);
      return;
    }

    setTasks(
      (data || []).map((task) => ({
        ...task,
        status: task.status as "pending" | "completed",
      })),
    );
  };

  const createTask = async (title: string, description: string) => {
    if (!roomId) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title,
          description,
          room_id: roomId,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating task:", error);
      return;
    }

    const newTask = data as Task;
    setCurrentTask(newTask);
    handleNewRound();
  };

  const updateTaskEstimate = async (taskId: string, estimate: number) => {
    const { error } = await supabase
      .from("tasks")
      .update({ estimate: estimate.toFixed(1) })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task estimate:", error);
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);

    // Calculate average rating
    const votes = players
      .map((p) => p.value)
      .filter((v): v is string | number => v !== undefined)
      .map((v) => Number(v))
      .filter((v) => !isNaN(v));

    if (votes.length > 0) {
      const avg = votes.reduce((sum, v) => sum + v, 0) / votes.length;
      setAverageRating(avg);

      // Update current task with the average
      if (currentTask) {
        updateTaskEstimate(currentTask.id, avg);
      }
    }
  };

  const handleNewRound = async () => {
    setIsRevealed(false);
    setSelectedValue(null);
    setAverageRating(null);
    await resetPlayerVotes();
  };

  const handleCardSelect = async (value: string | number) => {
    setSelectedValue(value);
    await updatePlayerVote(value);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header
        sessionId={roomId || ""}
        storyTitle={currentTask?.title || room?.name || "Planning Poker"}
        onInvite={() => setShowInviteDialog(true)}
        onTimer={() => console.log("Timer clicked")}
        onSettings={() => console.log("Settings clicked")}
        tasks={tasks}
        onCreateTask={createTask}
        onSelectTask={(task) => {
          setCurrentTask(task);
          handleNewRound();
        }}
        currentTaskId={currentTask?.id}
      />
      <main className="flex-1 container mx-auto px-4 py-8 mb-32">
        <GameArea
          players={players}
          isRevealed={isRevealed}
          averageRating={averageRating}
          tasks={tasks}
          currentTask={currentTask}
          onSelectTask={(task) => {
            setCurrentTask(task);
            handleNewRound();
          }}
          onCreateTask={createTask}
        />

        <div className="fixed bottom-24 left-0 right-0 flex justify-center gap-4 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {!isRevealed ? (
              <Button
                size="lg"
                onClick={handleReveal}
                disabled={!players.every((p) => p.hasVoted)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Reveal Cards
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleNewRound}
                className="bg-blue-500 hover:bg-blue-600"
              >
                New Round
              </Button>
            )}
          </motion.div>
        </div>

        <CardDeck
          selectedValue={selectedValue}
          onSelectCard={handleCardSelect}
          disabled={isRevealed}
        />
      </main>
      <SaveScoreButton
        score={averageRating}
        onSave={() => {
          if (currentTask && averageRating !== null) {
            updateTaskEstimate(currentTask.id, averageRating);
          }
        }}
        disabled={!isRevealed || averageRating === null}
      />
      <Toaster />
      <CharacterSelectDialog
        open={showCharacterSelect}
        onOpenChange={setShowCharacterSelect}
        onSelectCharacter={(character) => {
          if (!roomId || !user || !currentUserId) return;

          supabase
            .from("room_players")
            .update({
              name: character.name,
              avatar_url: character.avatarUrl,
            })
            .eq("room_id", roomId)
            .eq("user_id", currentUserId)
            .then(({ error }) => {
              if (error) {
                console.error("Error updating player:", error);
              }
            });
        }}
      />
      <InviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        roomId={roomId || ""}
      />
      <div className="w-[2px] h-[2px]"></div>
    </div>
  );
};

export default Home;
