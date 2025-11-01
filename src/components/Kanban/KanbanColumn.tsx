import { Task } from "./KanbanBoard";
import { TaskCard } from "./TaskCard";

interface KanbanColumnProps {
  column: { id: Task["status"]; title: string };
  tasks: Task[];
  onDragStart: (task: Task) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (status: Task["status"]) => void;
  onTaskClick: (task: Task) => void;
}

export const KanbanColumn = ({
  column,
  tasks,
  onDragStart,
  onDragOver,
  onDrop,
  onTaskClick,
}: KanbanColumnProps) => {
  return (
    <div className="flex-1 flex flex-col min-w-[280px] max-w-[360px]">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {tasks.length}
          </span>
        </div>
      </div>

      <div
        onDragOver={onDragOver}
        onDrop={() => onDrop(column.id)}
        className="flex-1 space-y-2 p-1 rounded-lg transition-colors duration-150"
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={() => onDragStart(task)}
            onClick={() => onTaskClick(task)}
          />
        ))}
      </div>
    </div>
  );
};
