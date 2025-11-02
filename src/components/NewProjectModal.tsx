import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  X,
  Maximize2,
  Settings,
  MoreHorizontal,
  User,
  Users,
  Calendar,
  Target,
  Plus,
  Check,
  AlertCircle,
  BarChart3,
  BarChart2,
  BarChart,
  Tag,
  Link2,
  RefreshCw,
  Inbox,
  CheckSquare,
  PlayCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Milestone {
  id: string;
  name: string;
  targetDate?: string;
}

export interface Project {
  id: string;
  name: string;
  shortSummary?: string;
  description?: string;
  status?: string;
  priority?: string;
  lead?: string;
  members?: string[];
  startDate?: string;
  targetDate?: string;
  labels?: string[];
  dependencies?: string[];
  links?: Array<{ id: string; url: string; title: string }>;
  milestones?: Milestone[];
  health?: string;
  color?: string;
  icon?: string;
  createdAt: string;
}

interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated?: () => void;
}

const defaultPriorityOptions = [
  { value: "No priority", icon: "0", color: "text-muted-foreground", number: 0 },
  { value: "Urgent", icon: AlertCircle, color: "text-red-500", number: 1 },
  { value: "High", icon: BarChart3, color: "text-orange-500", number: 2 },
  { value: "Medium", icon: BarChart2, color: "text-yellow-500", number: 3 },
  { value: "Low", icon: BarChart, color: "text-blue-500", number: 4 },
];

const defaultStatusOptions = [
  { value: "Backlog", icon: Inbox, color: "text-orange-500" },
  { value: "Planned", icon: CheckSquare, color: "text-muted-foreground" },
  { value: "In Progress", icon: PlayCircle, color: "text-yellow-500" },
  { value: "Completed", icon: CheckCircle2, color: "text-primary" },
  { value: "Cancelled", icon: XCircle, color: "text-red-500" },
];

const defaultLabelsWithColors = [
  { name: "Bug", color: "bg-red-500" },
  { name: "Feature", color: "bg-purple-500" },
  { name: "Improvement", color: "bg-blue-500" },
  { name: "Documentation", color: "bg-gray-500" },
  { name: "Enhancement", color: "bg-green-500" },
];

export const NewProjectModal = ({ open, onOpenChange, onProjectCreated }: NewProjectModalProps) => {
  const [projectName, setProjectName] = useState("");
  const [shortSummary, setShortSummary] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Backlog");
  const [priority, setPriority] = useState("No priority");
  const [lead, setLead] = useState<string | undefined>(undefined);
  const [members, setMembers] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [labels, setLabels] = useState<string[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestoneName, setNewMilestoneName] = useState("");
  
  const [statusSearchOpen, setStatusSearchOpen] = useState(false);
  const [statusSearchValue, setStatusSearchValue] = useState("");
  const [prioritySearchOpen, setPrioritySearchOpen] = useState(false);
  const [prioritySearchValue, setPrioritySearchValue] = useState("");
  const [labelSearchOpen, setLabelSearchOpen] = useState(false);
  const [labelSearchValue, setLabelSearchValue] = useState("");
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [targetDatePickerOpen, setTargetDatePickerOpen] = useState(false);

  const getAllPriorities = () => {
    const customPriorities = JSON.parse(localStorage.getItem("customPriorities") || "[]");
    return [...defaultPriorityOptions, ...customPriorities];
  };

  const getAllStatuses = () => {
    const customStatuses = JSON.parse(localStorage.getItem("customStatuses") || "[]");
    return [...defaultStatusOptions, ...customStatuses];
  };

  const getAllLabels = () => {
    const defaultLabels = defaultLabelsWithColors.map(l => l.name);
    const storedLabels = JSON.parse(localStorage.getItem("customLabels") || "[]");
    return [...defaultLabels, ...storedLabels];
  };

  const getLabelColor = (labelName: string) => {
    const found = defaultLabelsWithColors.find(l => l.name === labelName);
    return found ? found.color : "bg-gray-500";
  };

  const handleAddMilestone = () => {
    if (!newMilestoneName.trim()) return;
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      name: newMilestoneName.trim(),
    };
    setMilestones([...milestones, newMilestone]);
    setNewMilestoneName("");
  };

  const handleRemoveMilestone = (milestoneId: string) => {
    setMilestones(milestones.filter(m => m.id !== milestoneId));
  };

  const handleCreateProject = () => {
    if (!projectName.trim()) return;

    const newProject: Project = {
      id: Date.now().toString(),
      name: projectName.trim(),
      shortSummary,
      description,
      status,
      priority,
      lead,
      members,
      startDate: startDate?.toISOString(),
      targetDate: targetDate?.toISOString(),
      labels,
      milestones,
      health: "No updates",
      color: "#5E6AD2",
      icon: "📁",
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    storedProjects.push(newProject);
    localStorage.setItem("projects", JSON.stringify(storedProjects));

    // Reset form
    setProjectName("");
    setShortSummary("");
    setDescription("");
    setStatus("Backlog");
    setPriority("No priority");
    setLead(undefined);
    setMembers([]);
    setStartDate(undefined);
    setTargetDate(undefined);
    setLabels([]);
    setMilestones([]);

    // Callback to refresh projects list
    if (onProjectCreated) {
      onProjectCreated();
    }

    // Close modal
    onOpenChange(false);
  };

  const formatDate = (date?: Date) => {
    if (!date) return null;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full p-0 gap-0 bg-surface border-border rounded-lg [&>button]:hidden">
        <DialogTitle className="sr-only">New project</DialogTitle>
        <DialogDescription className="sr-only">Create a new project</DialogDescription>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>SST</span>
            <span className="text-muted-foreground/50">{" > "}</span>
            <span className="text-foreground">New project</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-surface-hover"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-3">
          {/* Project Name */}
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project name"
            className="text-base border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
            autoFocus
          />

          {/* Short Summary */}
          <Input
            value={shortSummary}
            onChange={(e) => setShortSummary(e.target.value)}
            placeholder="Add a short summary..."
            className="text-base border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
          />

          {/* Action/Tag Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status */}
            <Popover open={statusSearchOpen} onOpenChange={setStatusSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs border border-border hover:bg-surface-hover rounded-md px-2"
                >
                  {(() => {
                    const statusOption = getAllStatuses().find(s => s.value === status);
                    const StatusIcon = statusOption?.icon || Settings;
                    return <StatusIcon className={cn("h-3.5 w-3.5", statusOption?.color)} />;
                  })()}
                  {status}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search or create status..."
                    value={statusSearchValue}
                    onValueChange={setStatusSearchValue}
                  />
                  <CommandList>
                    {statusSearchValue.trim() && 
                     !getAllStatuses().some(s => s.value.toLowerCase() === statusSearchValue.trim().toLowerCase()) && (
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => {
                            const newStatus = statusSearchValue.trim();
                            if (newStatus) {
                              const customStatus = {
                                value: newStatus,
                                icon: Settings,
                                color: "text-muted-foreground",
                              };
                              const storedStatuses = JSON.parse(localStorage.getItem("customStatuses") || "[]");
                              if (!storedStatuses.some((s: any) => s.value === newStatus)) {
                                storedStatuses.push(customStatus);
                                localStorage.setItem("customStatuses", JSON.stringify(storedStatuses));
                              }
                              setStatus(newStatus);
                              setStatusSearchValue("");
                              setStatusSearchOpen(false);
                            }
                          }}
                          className="cursor-pointer font-medium"
                        >
                          <Plus className="mr-2 h-4 w-4 text-primary" />
                          Create "{statusSearchValue.trim()}"
                        </CommandItem>
                      </CommandGroup>
                    )}
                    {getAllStatuses().filter((option) =>
                      option.value.toLowerCase().includes(statusSearchValue.toLowerCase())
                    ).length > 0 && (
                      <CommandGroup>
                        {getAllStatuses().filter((option) =>
                          option.value.toLowerCase().includes(statusSearchValue.toLowerCase())
                        ).map((option) => {
                          const IconComponent = option.icon;
                          return (
                            <CommandItem
                              key={option.value}
                              onSelect={() => {
                                setStatus(option.value);
                                setStatusSearchValue("");
                                setStatusSearchOpen(false);
                              }}
                              className={cn(
                                "cursor-pointer gap-3 px-3 py-2",
                                status === option.value && "bg-accent text-accent-foreground"
                              )}
                            >
                              <IconComponent className={cn("h-4 w-4", option.color)} />
                              <span className="flex-1">{option.value}</span>
                              {status === option.value && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Priority */}
            <Popover open={prioritySearchOpen} onOpenChange={setPrioritySearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs border border-border hover:bg-surface-hover rounded-md px-2"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                  {priority === "No priority" ? "Priority" : priority}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search or create priority..."
                    value={prioritySearchValue}
                    onValueChange={setPrioritySearchValue}
                  />
                  <CommandList>
                    {prioritySearchValue.trim() && 
                     !getAllPriorities().some(p => p.value.toLowerCase() === prioritySearchValue.trim().toLowerCase()) && (
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => {
                            const newPriority = prioritySearchValue.trim();
                            if (newPriority) {
                              const customPriority = {
                                value: newPriority,
                                icon: MoreHorizontal,
                                color: "text-muted-foreground",
                              };
                              const storedPriorities = JSON.parse(localStorage.getItem("customPriorities") || "[]");
                              if (!storedPriorities.some((p: any) => p.value === newPriority)) {
                                storedPriorities.push(customPriority);
                                localStorage.setItem("customPriorities", JSON.stringify(storedPriorities));
                              }
                              setPriority(newPriority);
                              setPrioritySearchValue("");
                              setPrioritySearchOpen(false);
                            }
                          }}
                          className="cursor-pointer font-medium"
                        >
                          <Plus className="mr-2 h-4 w-4 text-primary" />
                          Create "{prioritySearchValue.trim()}"
                        </CommandItem>
                      </CommandGroup>
                    )}
                    {getAllPriorities().filter((option) =>
                      option.value.toLowerCase().includes(prioritySearchValue.toLowerCase())
                    ).length > 0 && (
                      <CommandGroup>
                        {getAllPriorities().filter((option) =>
                          option.value.toLowerCase().includes(prioritySearchValue.toLowerCase())
                        ).map((option, index) => {
                          const IconComponent = typeof option.icon === "string" ? null : option.icon;
                          return (
                            <CommandItem
                              key={option.value}
                              onSelect={() => {
                                setPriority(option.value);
                                setPrioritySearchValue("");
                                setPrioritySearchOpen(false);
                              }}
                              className={cn(
                                "cursor-pointer gap-3 px-3 py-2",
                                priority === option.value && "bg-accent text-accent-foreground"
                              )}
                            >
                              {typeof option.icon === "string" ? (
                                <span className={cn("text-xs w-5 text-center", option.color)}>
                                  {option.icon}
                                </span>
                              ) : IconComponent ? (
                                <IconComponent className={cn("h-4 w-4", option.color)} />
                              ) : null}
                              <span className="flex-1">{option.value}</span>
                              {priority === option.value && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                              <span className="text-xs text-muted-foreground ml-2">{option.number}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Lead */}
            {lead ? (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-border bg-surface text-xs h-8">
                <div className="w-4 h-4 rounded bg-primary flex items-center justify-center text-[10px] font-medium text-primary-foreground">
                  {lead.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <span>{lead}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-3 w-3 p-0 ml-1 hover:bg-transparent"
                  onClick={() => setLead(undefined)}
                >
                  <X className="h-2.5 w-2.5" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-xs border border-border hover:bg-surface-hover rounded-md px-2"
                onClick={() => setLead("LB Lakshya Bagani")}
              >
                <User className="h-3.5 w-3.5" />
                Lead
              </Button>
            )}

            {/* Members */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs border border-border hover:bg-surface-hover rounded-md px-2"
            >
              <Users className="h-3.5 w-3.5" />
              Members
            </Button>

            {/* Start Date */}
            <Popover open={startDatePickerOpen} onOpenChange={setStartDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs border border-border hover:bg-surface-hover rounded-md px-2"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  {startDate ? formatDate(startDate) : "Start"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date);
                    setStartDatePickerOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Target Date */}
            <Popover open={targetDatePickerOpen} onOpenChange={setTargetDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs border border-border hover:bg-surface-hover rounded-md px-2"
                >
                  <Target className="h-3.5 w-3.5" />
                  {targetDate ? formatDate(targetDate) : "Target"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={targetDate}
                  onSelect={(date) => {
                    setTargetDate(date);
                    setTargetDatePickerOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Labels */}
            {labels.map((label, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-border bg-surface text-xs h-8"
              >
                <div className={cn("w-2 h-2 rounded-full", getLabelColor(label))}></div>
                <span>{label}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-3 w-3 p-0 ml-1 hover:bg-transparent"
                  onClick={() => setLabels(labels.filter((_, i) => i !== index))}
                >
                  <X className="h-2.5 w-2.5" />
                </Button>
              </div>
            ))}
            
            {/* Add Label */}
            <Popover open={labelSearchOpen} onOpenChange={setLabelSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground border border-border hover:bg-surface-hover rounded-md px-2"
                >
                  <Tag className="h-3 w-3" />
                  Labels
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search or create label..."
                    value={labelSearchValue}
                    onValueChange={setLabelSearchValue}
                  />
                  <CommandList>
                    {labelSearchValue.trim() && 
                     !getAllLabels().some(l => l.toLowerCase() === labelSearchValue.trim().toLowerCase()) && (
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => {
                            const newLabel = labelSearchValue.trim();
                            if (newLabel && !labels.includes(newLabel)) {
                              setLabels([...labels, newLabel]);
                              const storedLabels = JSON.parse(localStorage.getItem("customLabels") || "[]");
                              if (!storedLabels.includes(newLabel)) {
                                storedLabels.push(newLabel);
                                localStorage.setItem("customLabels", JSON.stringify(storedLabels));
                              }
                              setLabelSearchValue("");
                              setLabelSearchOpen(false);
                            }
                          }}
                          className="cursor-pointer font-medium"
                        >
                          <Plus className="mr-2 h-4 w-4 text-primary" />
                          Create "{labelSearchValue.trim()}"
                        </CommandItem>
                      </CommandGroup>
                    )}
                    {getAllLabels().filter((label) =>
                      label.toLowerCase().includes(labelSearchValue.toLowerCase()) &&
                      !labels.includes(label)
                    ).length > 0 && (
                      <CommandGroup>
                        {getAllLabels().filter((label) =>
                          label.toLowerCase().includes(labelSearchValue.toLowerCase()) &&
                          !labels.includes(label)
                        ).map((label) => {
                          const labelInfo = defaultLabelsWithColors.find(l => l.name === label);
                          return (
                            <CommandItem
                              key={label}
                              onSelect={() => {
                                if (!labels.includes(label)) {
                                  setLabels([...labels, label]);
                                }
                                setLabelSearchValue("");
                                setLabelSearchOpen(false);
                              }}
                              className="cursor-pointer"
                            >
                              <div className={cn("w-2 h-2 rounded-full mr-2", labelInfo?.color || "bg-gray-500")}></div>
                              {label}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Dependencies */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs border border-border hover:bg-surface-hover rounded-md px-2"
            >
              <Link2 className="h-3.5 w-3.5" />
              Dependencies
            </Button>
          </div>

          {/* Description */}
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a description, a project brief, or collect ideas..."
            className="min-h-[120px] resize-none border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
          />

          {/* Milestones Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Milestones</span>
            </div>
            {milestones.length > 0 && (
              <div className="space-y-1">
                {milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between px-2 py-1.5 rounded-md border border-border bg-surface"
                  >
                    <span className="text-sm text-foreground">{milestone.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRemoveMilestone(milestone.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Input
                value={newMilestoneName}
                onChange={(e) => setNewMilestoneName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddMilestone();
                  }
                }}
                placeholder="Add milestone..."
                className="text-sm border border-border bg-transparent"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 border border-border hover:bg-surface-hover"
                onClick={handleAddMilestone}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-4"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateProject}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4"
            disabled={!projectName.trim()}
          >
            Create project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

