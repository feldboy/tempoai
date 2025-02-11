import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Check, Copy } from "lucide-react";

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: string;
}

export function InviteDialog({
  open,
  onOpenChange,
  roomId,
}: InviteDialogProps) {
  const [copied, setCopied] = useState(false);
  const inviteLink = `${window.location.origin}/room/${roomId}`;

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite players</DialogTitle>
          <DialogDescription>
            Share this link with others to invite them to your planning poker
            session.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Input value={inviteLink} readOnly className="flex-1" />
          <Button onClick={copyToClipboard} className="flex items-center gap-2">
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
