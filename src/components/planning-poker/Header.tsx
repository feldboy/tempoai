import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Timer, Settings, Users, Copy, Clock } from "lucide-react";
import { CreateTaskDialog } from "./CreateTaskDialog";

import { Task } from "./TaskList";

interface HeaderProps {
  storyTitle?: string;
  sessionId?: string;
  onInvite?: () => void;
  onTimer?: () => void;
  onSettings?: () => void;
  tasks?: Task[];
  onCreateTask?: (title: string, description: string) => void;
  onSelectTask?: (task: Task) => void;
  currentTaskId?: string;
}

const Header = ({
  storyTitle = "Story #1234: Implement user authentication",
  sessionId = "ABC123",
  onInvite = () => {},
  onTimer = () => {},
  onSettings = () => {},
  tasks = [],
  onCreateTask = () => {},
  onSelectTask = () => {},
  currentTaskId,
}: HeaderProps) => {
  return (
    <div className="w-full h-16 px-4 bg-white border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <CreateTaskDialog
          tasks={tasks}
          onCreateTask={onCreateTask}
          onSelectTask={onSelectTask}
          currentTaskId={currentTaskId}
        />
        <h1 className="text-lg font-semibold text-gray-900 truncate max-w-[600px]">
          {storyTitle}
        </h1>
      </div>

      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-md">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Session ID: {sessionId}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => navigator.clipboard.writeText(sessionId)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy session ID</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={onInvite}
              >
                <Users className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Invite players</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={onTimer}
              >
                <Timer className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Set timer</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={onSettings}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Header;
