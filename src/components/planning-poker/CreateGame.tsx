import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spade } from "lucide-react";

interface CreateGameProps {
  onCreateGame: (name: string, votingSystem: string) => void;
}

const votingSystems = [
  {
    id: "fibonacci",
    name: "Fibonacci",
    description: "0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?, ☕",
  },
  {
    id: "tshirt",
    name: "T-Shirt Sizes",
    description: "XS, S, M, L, XL, XXL",
  },
  {
    id: "power",
    name: "Power of 2",
    description: "1, 2, 4, 8, 16, 32",
  },
];

export function CreateGame({ onCreateGame }: CreateGameProps) {
  const [gameName, setGameName] = useState("");
  const [votingSystem, setVotingSystem] = useState("fibonacci");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameName.trim()) {
      onCreateGame(gameName, votingSystem);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Spade className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">
                Create game
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="game-name"
              className="block text-sm font-medium text-gray-700"
            >
              Game's name
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <Input
                type="text"
                id="game-name"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="Enter game name..."
                className="block w-full pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => console.log("Open emoji picker")}
              >
                😊
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="voting-system"
              className="block text-sm font-medium text-gray-700"
            >
              Voting system
            </label>
            <Select value={votingSystem} onValueChange={setVotingSystem}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select a voting system" />
              </SelectTrigger>
              <SelectContent>
                {votingSystems.map((system) => (
                  <SelectItem key={system.id} value={system.id}>
                    {system.name} ({system.description})
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom Deck...</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Show advanced settings...
          </button>

          {showAdvanced && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-md">
              {/* Placeholder for advanced settings */}
              <p className="text-sm text-gray-500">
                Advanced settings coming soon...
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create game
          </Button>
        </form>
      </main>
    </div>
  );
}
