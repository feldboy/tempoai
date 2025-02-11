import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "completed";
  estimate?: string | number;
}

interface TaskListProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  currentTaskId?: string;
}

export const TaskList = ({
  tasks = [],
  onSelectTask,
  currentTaskId,
}: TaskListProps) => {
  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {tasks.map((task) => (
          <Button
            key={task.id}
            variant="ghost"
            className={`w-full justify-start ${currentTaskId === task.id ? "bg-blue-50" : ""}`}
            onClick={() => onSelectTask(task)}
          >
            <div className="flex flex-col items-start w-full">
              <div className="flex justify-between w-full items-center">
                <span className="font-medium">{task.title}</span>
                {task.estimate && (
                  <span className="text-sm text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">
                    {task.estimate}
                  </span>
                )}
              </div>
              {task.description && (
                <span className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {task.description}
                </span>
              )}
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};
