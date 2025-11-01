import { Task } from "./KanbanBoard";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onDragStart: () => void;
  onClick: () => void;
}

const priorityColors = {
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  urgent: "bg-red-500/10 text-red-500 border-red-500/20",
};

export const TaskCard = ({ task, onDragStart, onClick }: TaskCardProps) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className="group p-3 rounded-lg border border-border bg-card hover:border-border/80 cursor-pointer transition-all duration-150 hover:shadow-md"
    >
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-150">
          {task.title}
        </h4>

        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5">
            <Badge
              variant="outline"
              className={cn("text-[10px] px-1.5 py-0", priorityColors[task.priority])}
            >
              {task.priority}
            </Badge>
            {task.labels.slice(0, 2).map((label) => (
              <Badge
                key={label}
                variant="outline"
                className="text-[10px] px-1.5 py-0 bg-muted/50"
              >
                {label}
              </Badge>
            ))}
          </div>

          <Avatar name={task.assignee} size="sm" />
        </div>
      </div>
    </div>
  );
};
