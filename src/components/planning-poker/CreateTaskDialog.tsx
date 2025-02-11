import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TaskList, Task } from "./TaskList";
import { Menu } from "lucide-react";

interface CreateTaskDialogProps {
  tasks: Task[];
  onCreateTask: (title: string, description: string) => void;
  onSelectTask: (task: Task) => void;
  currentTaskId?: string;
}

export const CreateTaskDialog = ({
  tasks,
  onCreateTask,
  onSelectTask,
  currentTaskId,
}: CreateTaskDialogProps) => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateTask(title, description);
      setTitle("");
      setDescription("");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="h-10 w-10">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Tasks</SheetTitle>
          <SheetDescription>
            Create and manage your planning poker tasks.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Create Task
            </Button>
          </form>
        </div>

        <div className="mt-6">
          <h4 className="mb-4 text-sm font-medium">Task List</h4>
          <TaskList
            tasks={tasks}
            onSelectTask={onSelectTask}
            currentTaskId={currentTaskId}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
