import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CardDeckProps {
  onSelectCard?: (value: string | number) => void;
  selectedValue?: string | number;
  disabled?: boolean;
}

const CardDeck = ({
  onSelectCard = () => {},
  selectedValue = null,
  disabled = false,
}: CardDeckProps) => {
  const cardValues = [
    "0",
    "1",
    "2",
    "3",
    "5",
    "8",
    "13",
    "21",
    "34",
    "55",
    "89",
    "?",
    "∞",
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-4 px-4">
          <TooltipProvider>
            {cardValues.map((value) => (
              <Tooltip key={value}>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ y: -8 }} whileTap={{ scale: 0.95 }}>
                    <Card
                      className={`w-20 h-32 flex items-center justify-center cursor-pointer
                        ${
                          selectedValue === value
                            ? "border-blue-500 border-2 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }
                        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => !disabled && onSelectCard(value)}
                    >
                      <span
                        className={`text-2xl font-bold
                        ${selectedValue === value ? "text-blue-500" : "text-gray-700"}`}
                      >
                        {value}
                      </span>
                    </Card>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select {value}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default CardDeck;
