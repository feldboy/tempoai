import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Header from "./planning-poker/Header";
import GameArea from "./planning-poker/GameArea";
import CardDeck from "./planning-poker/CardDeck";

import { Task } from "./planning-poker/TaskList";

import { useParams } from "react-router-dom";
import { InviteDialog } from "./planning-poker/InviteDialog";
import { CharacterSelectDialog } from "./planning-poker/CharacterSelectDialog";
import { SaveScoreButton } from "./planning-poker/SaveScoreButton";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/lib/auth";

interface HomeProps {
  sessionId?: string;
  storyTitle?: string;
  players?: Array<{
    id: string;
    name: string;
    value?: string | number;
    hasVoted: boolean;
    avatarUrl?: string;
  }>;
}

const Home = ({
  sessionId = "ABC123",
  storyTitle = "Story #1234: Implement user authentication",
  players = [
    { id: "1", name: "Player 1", hasVoted: true, value: "5" },
    { id: "2", name: "Player 2", hasVoted: false },
    { id: "3", name: "Player 3", hasVoted: true, value: "8" },
    { id: "4", name: "Player 4", hasVoted: true, value: "13" },
  ],
}: HomeProps) => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | number | null>(
    null,
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [localPlayers, setLocalPlayers] = useState(players);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showCharacterSelect, setShowCharacterSelect] = useState(true);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  // Get current user ID from auth
  const currentUserId = user?.id || "dev-user";

  const handleReveal = () => {
    setIsRevealed(true);

    // Calculate average rating
    const votes = localPlayers
      .map((p) => p.value)
      .filter((v): v is string | number => v !== undefined)
      .filter((v) => !isNaN(Number(v)));

    if (votes.length > 0) {
      const avg = votes.reduce((sum, v) => sum + Number(v), 0) / votes.length;
      setAverageRating(avg);

      // Update current task with the average
      if (currentTask) {
        const updatedTask = { ...currentTask, estimate: avg.toFixed(1) };
        setTasks(tasks.map((t) => (t.id === currentTask.id ? updatedTask : t)));
        setCurrentTask(updatedTask);
      }
    }
  };

  const handleNewRound = () => {
    setIsRevealed(false);
    setSelectedValue(null);
    // Reset all players' votes
    setLocalPlayers(
      localPlayers.map((player) => ({
        ...player,
        hasVoted: false,
        value: undefined,
      })),
    );
  };

  const handleCardSelect = (value: string | number) => {
    setSelectedValue(value);
    // Update the current player's vote
    setLocalPlayers(
      localPlayers.map((player) =>
        player.id === currentUserId
          ? { ...player, hasVoted: true, value: value }
          : player,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header
        sessionId={sessionId}
        storyTitle={currentTask?.title || storyTitle}
        onInvite={() => setShowInviteDialog(true)}
        onTimer={() => console.log("Timer clicked")}
        onSettings={() => console.log("Settings clicked")}
        tasks={tasks}
        onCreateTask={(title, description) => {
          const newTask: Task = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            description,
            status: "pending",
          };
          setTasks([...tasks, newTask]);
        }}
        onSelectTask={(task) => {
          setCurrentTask(task);
          handleNewRound();
        }}
        currentTaskId={currentTask?.id}
      />

      <main className="flex-1 container mx-auto px-4 py-8 mb-32">
        <GameArea
          players={localPlayers}
          isRevealed={isRevealed}
          averageRating={averageRating}
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
            const updatedTask = {
              ...currentTask,
              estimate: averageRating.toFixed(1),
            };
            setTasks(
              tasks.map((t) => (t.id === currentTask.id ? updatedTask : t)),
            );
            setCurrentTask(updatedTask);
          }
        }}
        disabled={!isRevealed || averageRating === null}
      />
      <Toaster />

      <CharacterSelectDialog
        open={showCharacterSelect}
        onOpenChange={setShowCharacterSelect}
        onSelectCharacter={(character) => {
          setLocalPlayers(
            localPlayers.map((player) =>
              player.id === currentUserId
                ? {
                    ...player,
                    avatarUrl: character.avatarUrl,
                    name: character.name,
                  }
                : player,
            ),
          );
        }}
      />

      <InviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        roomId={roomId || ""}
      />
    </div>
  );
};

export default Home;
