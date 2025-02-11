import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

interface PlayerCardProps {
  playerName?: string;
  isRevealed?: boolean;
  value?: string | number;
  hasVoted?: boolean;
  avatarUrl?: string;
}

const PlayerCard = ({
  playerName = "Player 1",
  isRevealed = false,
  value = "?",
  hasVoted = false,
  avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${playerName}`,
}: PlayerCardProps) => {
  return (
    <div className="flex flex-col items-center gap-2 w-40 bg-white p-4">
      <Avatar className="w-12 h-12 justify-start">
        <img
          src={avatarUrl}
          alt={playerName}
          className="w-full h-full object-cover"
        />
      </Avatar>
      <span className="text-sm font-medium text-gray-700">{playerName}</span>
      <motion.div
        className="w-full"
        animate={{ rotateY: isRevealed ? 0 : 180 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <Card
          className={`w-full aspect-[2/3] flex items-center justify-center
            ${hasVoted ? "border-blue-500 border-2" : "border-gray-200"}
            ${isRevealed ? "bg-white" : "bg-blue-500"}`}
        >
          {isRevealed ? (
            <span className="text-3xl font-bold text-blue-500">{value}</span>
          ) : (
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
              {hasVoted ? (
                <span className="text-blue-500 text-xl">✓</span>
              ) : (
                <span className="text-gray-400 text-xl">?</span>
              )}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default PlayerCard;
