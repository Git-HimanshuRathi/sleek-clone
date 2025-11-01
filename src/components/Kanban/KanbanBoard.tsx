import { useState } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { TaskModal } from "./TaskModal";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  labels: string[];
  comments: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: Date;
  }>;
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design new landing page",
    description: "Create a modern and responsive landing page for the product launch",
    status: "todo",
    priority: "high",
    assignee: "Sarah Chen",
    labels: ["design", "frontend"],
    comments: [],
  },
  {
    id: "2",
    title: "Implement user authentication",
    description: "Set up OAuth and JWT token management",
    status: "in-progress",
    priority: "urgent",
    assignee: "Mike Johnson",
    labels: ["backend", "security"],
    comments: [
      {
        id: "c1",
        author: "Mike Johnson",
        content: "Started working on the OAuth integration",
        timestamp: new Date(),
      },
    ],
  },
  {
    id: "3",
    title: "Write API documentation",
    description: "Document all REST API endpoints with examples",
    status: "done",
    priority: "medium",
    assignee: "Emily Davis",
    labels: ["documentation"],
    comments: [],
  },
  {
    id: "4",
    title: "Fix mobile responsiveness",
    description: "Address layout issues on tablet and mobile devices",
    status: "todo",
    priority: "high",
    assignee: "David Lee",
    labels: ["frontend", "bug"],
    comments: [],
  },
];

export const KanbanBoard = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const columns: Array<{ id: Task["status"]; title: string }> = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: Task["status"]) => {
    if (!draggedTask) return;

    setTasks(
      tasks.map((task) =>
        task.id === draggedTask.id ? { ...task, status } : task
      )
    );
    setDraggedTask(null);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    setSelectedTask(null);
  };

  return (
    <>
      <div className="flex gap-4 h-full">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasks.filter((task) => task.status === column.id)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onTaskClick={setSelectedTask}
          />
        ))}
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
          onSave={updateTask}
        />
      )}
    </>
  );
};
