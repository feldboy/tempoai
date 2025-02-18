import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PlayerCard from "./PlayerCard";
import { TaskList, Task } from "./TaskList";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { supabase } from "@/lib/supabase";
import { useParams } from "react-router-dom";

interface Player {
  id: string;
  name: string;
  value?: string | number;
  hasVoted: boolean;
  avatarUrl?: string;
}

interface GameAreaProps {
  players?: Player[];
  isRevealed?: boolean;
  averageRating?: number | null;
  tasks?: Task[];
  currentTask?: Task | null;
  onSelectTask?: (task: Task) => void;
  onCreateTask?: (title: string, description: string) => void;
}

const GameArea = ({
  players = [
    { id: "1", name: "Player 1", hasVoted: true, value: "5" },
    { id: "2", name: "Player 2", hasVoted: false },
    { id: "3", name: "Player 3", hasVoted: true, value: "8" },
    { id: "4", name: "Player 4", hasVoted: true, value: "13" },
  ],
  isRevealed = false,
  averageRating = null,
  tasks: initialTasks = [],
  currentTask: initialCurrentTask = null,
  onSelectTask = (task: Task) => {},
  onCreateTask: parentOnCreateTask = (title: string, description: string) => {},
}: GameAreaProps) => {
  const { roomId } = useParams();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [currentTask, setCurrentTask] = useState<Task | null>(
    initialCurrentTask,
  );

  useEffect(() => {
    if (roomId) {
      // Load initial tasks
      loadTasks();

      // Subscribe to task changes
      const subscription = supabase
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
            }
          },
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [roomId]);

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
      (data as any[])?.map((task) => ({
        ...task,
        status: task.status as "pending" | "completed",
      })) || [],
    );
  };

  const handleCreateTask = async (title: string, description: string) => {
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

    // Call parent handler
    parentOnCreateTask(title, description);

    // Set as current task
    const newTask = data as Task;
    setCurrentTask(newTask);
    onSelectTask(newTask);
  };

  const handleSelectTask = (task: Task) => {
    setCurrentTask(task);
    onSelectTask(task);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full min-h-[600px]">
      {/* Task List Section */}
      <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Tasks</h2>
          <CreateTaskDialog
            tasks={tasks}
            onCreateTask={handleCreateTask}
            onSelectTask={handleSelectTask}
            currentTaskId={currentTask?.id}
          />
        </div>
        <TaskList
          tasks={tasks}
          onSelectTask={handleSelectTask}
          currentTaskId={currentTask?.id}
        />
      </div>

      {/* Game Area Section */}
      <div className="md:col-span-3 bg-gray-50 p-8 rounded-lg flex flex-col items-center justify-center gap-8">
        {currentTask ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full text-center mb-4"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {currentTask.title}
              </h3>
              {currentTask.description && (
                <p className="text-gray-600 mt-2">{currentTask.description}</p>
              )}
            </motion.div>

            {isRevealed && averageRating !== null && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold text-blue-600">
                  Team Average
                </h3>
                <p className="text-4xl font-bold text-blue-800">
                  {averageRating.toFixed(1)}
                </p>
              </motion.div>
            )}

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  playerName={player.name}
                  isRevealed={isRevealed}
                  value={player.value}
                  hasVoted={player.hasVoted}
                  avatarUrl={player.avatarUrl}
                />
              ))}
            </motion.div>
          </>
        ) : (
          <div className="text-center text-gray-500">
            <p className="text-lg">Select a task to start voting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameArea;
