import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Character {
  id: string;
  name: string;
  avatarUrl: string;
}

interface CharacterSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectCharacter: (character: Character) => void;
}

const characters: Character[] = [
  {
    id: "warrior",
    name: "Warrior",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=warrior",
  },
  {
    id: "mage",
    name: "Mage",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=mage",
  },
  {
    id: "rogue",
    name: "Rogue",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=rogue",
  },
  {
    id: "healer",
    name: "Healer",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=healer",
  },
  {
    id: "ranger",
    name: "Ranger",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ranger",
  },
  {
    id: "paladin",
    name: "Paladin",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=paladin",
  },
  {
    id: "druid",
    name: "Druid",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=druid",
  },
  {
    id: "bard",
    name: "Bard",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bard",
  },
];

export function CharacterSelectDialog({
  open,
  onOpenChange,
  onSelectCharacter,
}: CharacterSelectDialogProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );

  const handleSelect = (character: Character) => {
    setSelectedCharacter(character);
    onSelectCharacter(character);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Choose Your Character</DialogTitle>
          <DialogDescription>
            Select a character to represent you in the planning poker session.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {characters.map((character) => (
              <Button
                key={character.id}
                variant="outline"
                className={`h-auto p-4 flex flex-col items-center gap-2 ${selectedCharacter?.id === character.id ? "border-primary" : ""}`}
                onClick={() => handleSelect(character)}
              >
                <Avatar className="w-16 h-16">
                  <img
                    src={character.avatarUrl}
                    alt={character.name}
                    className="w-full h-full"
                  />
                </Avatar>
                <span className="text-sm font-medium">{character.name}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
