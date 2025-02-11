import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SaveScoreButtonProps {
  score: number | null;
  onSave: () => void;
  disabled?: boolean;
}

export function SaveScoreButton({
  score,
  onSave,
  disabled = false,
}: SaveScoreButtonProps) {
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [saved]);

  const handleSave = () => {
    onSave();
    setSaved(true);
    toast({
      title: "Score saved",
      description: `Team average of ${score?.toFixed(1)} has been saved.`,
    });
  };

  return (
    <AnimatePresence>
      {score !== null && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-50"
        >
          <Button
            onClick={handleSave}
            disabled={disabled || saved}
            className="shadow-lg flex items-center gap-2 px-6 py-6 text-lg"
            size="lg"
          >
            {saved ? (
              <>
                <Check className="h-5 w-5" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Score
              </>
            )}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
