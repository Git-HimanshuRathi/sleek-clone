import { useState } from "react";
import { Task } from "./KanbanBoard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, X } from "lucide-react";

interface TaskModalProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Task) => void;
}

export const TaskModal = ({ task, open, onOpenChange, onSave }: TaskModalProps) => {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [newComment, setNewComment] = useState("");

  const handleSave = () => {
    onSave(editedTask);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    setEditedTask({
      ...editedTask,
      comments: [
        ...editedTask.comments,
        {
          id: Date.now().toString(),
          author: "Current User",
          content: newComment,
          timestamp: new Date(),
        },
      ],
    });
    setNewComment("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto glass">
        <DialogHeader>
          <DialogTitle className="sr-only">Edit Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <Input
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({ ...editedTask, title: e.target.value })
              }
              className="text-2xl font-semibold border-0 px-0 focus-visible:ring-0 bg-transparent"
              placeholder="Task title"
            />
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select
                value={editedTask.status}
                onValueChange={(value: Task["status"]) =>
                  setEditedTask({ ...editedTask, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Priority</Label>
              <Select
                value={editedTask.priority}
                onValueChange={(value: Task["priority"]) =>
                  setEditedTask({ ...editedTask, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Assignee</Label>
            <div className="flex items-center gap-2">
              <Avatar name={editedTask.assignee} size="sm" />
              <span className="text-sm">{editedTask.assignee}</span>
            </div>
          </div>

          {/* Labels */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Labels</Label>
            <div className="flex flex-wrap gap-2">
              {editedTask.labels.map((label) => (
                <Badge key={label} variant="outline" className="text-xs">
                  {label}
                  <button
                    onClick={() =>
                      setEditedTask({
                        ...editedTask,
                        labels: editedTask.labels.filter((l) => l !== label),
                      })
                    }
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask({ ...editedTask, description: e.target.value })
              }
              placeholder="Add a description..."
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Activity/Comments */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <Label className="text-xs text-muted-foreground">
                Activity ({editedTask.comments.length})
              </Label>
            </div>

            <div className="space-y-3">
              {editedTask.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar name={comment.author} size="sm" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.content}</p>
                  </div>
                </div>
              ))}

              <div className="flex gap-3">
                <Avatar name="Current User" size="sm" />
                <div className="flex-1 space-y-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="min-h-[60px] resize-none text-sm"
                  />
                  <Button
                    onClick={handleAddComment}
                    size="sm"
                    disabled={!newComment.trim()}
                  >
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
