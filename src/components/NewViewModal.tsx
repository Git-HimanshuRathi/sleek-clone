import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface View {
  id: string;
  name: string;
  description?: string;
  filters: {
    status?: string[];
    priority?: string[];
    assignee?: string;
    label?: string[];
    project?: string;
  };
  sortBy?: string;
  groupBy?: string;
  isFavorite?: boolean;
  createdAt: string;
}

interface NewViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewCreated?: () => void;
}

const defaultStatusOptions = ["Backlog", "Todo", "In Progress", "Done", "Cancelled"];
const defaultPriorityOptions = ["No priority", "Urgent", "High", "Medium", "Low"];

export const NewViewModal = ({ open, onOpenChange, onViewCreated }: NewViewModalProps) => {
  const [viewName, setViewName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [assignee, setAssignee] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [project, setProject] = useState("");
  const [sortBy, setSortBy] = useState("created");
  const [groupBy, setGroupBy] = useState("status");

  const handleCreateView = () => {
    if (!viewName.trim()) return;

    const newView: View = {
      id: `view-${Date.now()}`,
      name: viewName.trim(),
      description: description.trim() || undefined,
      filters: {
        status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
        priority: selectedPriorities.length > 0 ? selectedPriorities : undefined,
        assignee: assignee || undefined,
        label: selectedLabels.length > 0 ? selectedLabels : undefined,
        project: project || undefined,
      },
      sortBy,
      groupBy,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const storedViews = JSON.parse(localStorage.getItem("views") || "[]");
    storedViews.push(newView);
    localStorage.setItem("views", JSON.stringify(storedViews));

    // Dispatch event to notify other components
    window.dispatchEvent(new Event("viewsUpdated"));

    // Reset form
    setViewName("");
    setDescription("");
    setSelectedStatuses([]);
    setSelectedPriorities([]);
    setAssignee("");
    setSelectedLabels([]);
    setProject("");
    setSortBy("created");
    setGroupBy("status");

    // Callback
    if (onViewCreated) {
      onViewCreated();
    }

    // Close modal
    onOpenChange(false);
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const togglePriority = (priority: string) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#17181B] border-[#2d3036]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            Create new view
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Create a custom view with filters to organize your issues
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* View Name */}
          <div>
            <Label htmlFor="view-name" className="text-sm text-foreground">
              View name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="view-name"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              placeholder="e.g. My Active Issues"
              className="mt-1 bg-[#0B0B0D] border-[#2d3036] text-foreground"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="view-description" className="text-sm text-foreground">
              Description (optional)
            </Label>
            <Input
              id="view-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              className="mt-1 bg-[#0B0B0D] border-[#2d3036] text-foreground"
            />
          </div>

          {/* Filters Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Filters</h3>

            {/* Status Filter */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Status</Label>
              <div className="flex flex-wrap gap-2">
                {defaultStatusOptions.map((status) => (
                  <div
                    key={status}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`status-${status}`}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() => toggleStatus(status)}
                    />
                    <Label
                      htmlFor={`status-${status}`}
                      className="text-xs text-foreground cursor-pointer"
                    >
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Priority</Label>
              <div className="flex flex-wrap gap-2">
                {defaultPriorityOptions.map((priority) => (
                  <div
                    key={priority}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`priority-${priority}`}
                      checked={selectedPriorities.includes(priority)}
                      onCheckedChange={() => togglePriority(priority)}
                    />
                    <Label
                      htmlFor={`priority-${priority}`}
                      className="text-xs text-foreground cursor-pointer"
                    >
                      {priority}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignee Filter */}
            <div>
              <Label htmlFor="assignee" className="text-xs text-muted-foreground mb-2 block">
                Assignee
              </Label>
              <Input
                id="assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Filter by assignee..."
                className="bg-[#0B0B0D] border-[#2d3036] text-foreground"
              />
            </div>

            {/* Label Filter */}
            <div>
              <Label htmlFor="label" className="text-xs text-muted-foreground mb-2 block">
                Label
              </Label>
              <Input
                id="label"
                value={selectedLabels.join(", ")}
                onChange={(e) => {
                  const labels = e.target.value.split(",").map((l) => l.trim()).filter(Boolean);
                  setSelectedLabels(labels);
                }}
                placeholder="Enter labels separated by commas..."
                className="bg-[#0B0B0D] border-[#2d3036] text-foreground"
              />
            </div>

            {/* Project Filter */}
            <div>
              <Label htmlFor="project" className="text-xs text-muted-foreground mb-2 block">
                Project
              </Label>
              <Input
                id="project"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="Filter by project..."
                className="bg-[#0B0B0D] border-[#2d3036] text-foreground"
              />
            </div>
          </div>

          {/* Sort and Group */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sort-by" className="text-sm text-foreground">
                Sort by
              </Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger
                  id="sort-by"
                  className="mt-1 bg-[#0B0B0D] border-[#2d3036] text-foreground"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="updated">Updated</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="group-by" className="text-sm text-foreground">
                Group by
              </Label>
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger
                  id="group-by"
                  className="mt-1 bg-[#0B0B0D] border-[#2d3036] text-foreground"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="assignee">Assignee</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="none">No grouping</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#2d3036]">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-[#0B0B0D] border-[#2d3036] text-foreground hover:bg-[#1a1b1e]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateView}
              disabled={!viewName.trim()}
              className="bg-[#5E6AD2] hover:bg-[#6B77E0] text-white"
            >
              Create view
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

