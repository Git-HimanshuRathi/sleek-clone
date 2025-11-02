import { useState, useEffect } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { TaskModal } from "./TaskModal";
import { db } from "@/db/database";

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
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Load tasks from SQLite database
    try {
      const storedTasks = db.getKanbanTasks();
      if (storedTasks && storedTasks.length > 0) {
        const parsedTasks = storedTasks.map((task: Task) => ({
          ...task,
          comments: task.comments.map((c: any) => ({
            ...c,
            timestamp: new Date(c.timestamp),
          })),
        }));
        setTasks(parsedTasks);
      } else {
        setTasks([]); // Start with empty kanban board
      }
    } catch (error) {
      console.error('Error loading kanban tasks from database:', error);
      // Fallback to localStorage
      const storedTasks = localStorage.getItem("kanbanTasks");
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks).map((task: Task) => ({
          ...task,
          comments: task.comments.map((c: any) => ({
            ...c,
            timestamp: new Date(c.timestamp),
          })),
        }));
        setTasks(parsedTasks);
      } else {
        setTasks([]);
      }
    }
  }, []);
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

    const updatedTasks = tasks.map((task) =>
      task.id === draggedTask.id ? { ...task, status } : task
    );
    setTasks(updatedTasks);
    
    // Save to SQLite database
    try {
      const updatedTask = updatedTasks.find((t) => t.id === draggedTask.id);
      if (updatedTask) {
        db.insertKanbanTask(updatedTask);
      }
    } catch (error) {
      console.error('Error saving kanban task to database:', error);
      // Fallback to localStorage
      localStorage.setItem("kanbanTasks", JSON.stringify(updatedTasks));
    }
    setDraggedTask(null);
  };

  const updateTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
    setTasks(updatedTasks);
    
    // Save to SQLite database
    try {
      db.insertKanbanTask(updatedTask);
    } catch (error) {
      console.error('Error updating kanban task in database:', error);
      // Fallback to localStorage
      localStorage.setItem("kanbanTasks", JSON.stringify(updatedTasks));
    }
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
