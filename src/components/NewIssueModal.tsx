import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar } from "@/components/Avatar";
import {
  X,
  Maximize2,
  Settings,
  MoreHorizontal,
  FolderKanban,
  Paperclip,
  Plus,
  ChevronRight,
  ChevronDown,
  Calendar,
  Repeat,
  Link2,
  GitBranch,
  Check,
  AlertCircle,
  BarChart3,
  BarChart2,
  BarChart,
  Circle,
  Search,
  Inbox,
  CheckSquare,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Link {
  id: string;
  url: string;
  title: string;
}

export interface SubIssue {
  id: string;
  title: string;
  description: string;
  links: Link[];
  saved: boolean;
  status?: string;
  priority?: string;
  assignee?: string;
  project?: string;
  labels?: string[];
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  createdBy: string;
  labels: string[];
  links: Link[];
  subIssues: SubIssue[];
  createdAt: string;
  issueNumber: string;
}

interface NewIssueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIssueCreated?: () => void;
}

export const NewIssueModal = ({ open, onOpenChange, onIssueCreated }: NewIssueModalProps) => {
  const [issueTitle, setIssueTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Backlog");
  const [priority, setPriority] = useState("No priority");
  const [createMore, setCreateMore] = useState(false);
  const [labels, setLabels] = useState<string[]>([]);
  const [labelSearchOpen, setLabelSearchOpen] = useState(false);
  const [labelSearchValue, setLabelSearchValue] = useState("");
  const [statusSearchOpen, setStatusSearchOpen] = useState(false);
  const [statusSearchValue, setStatusSearchValue] = useState("");
  const [prioritySearchOpen, setPrioritySearchOpen] = useState(false);
  const [prioritySearchValue, setPrioritySearchValue] = useState("");
  const [links, setLinks] = useState<Link[]>([]);
  const [subIssues, setSubIssues] = useState<SubIssue[]>([]);
  const [addLinkDialogOpen, setAddLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [addingLinkForSubIssue, setAddingLinkForSubIssue] = useState<string | null>(null);
  const [subIssuesExpanded, setSubIssuesExpanded] = useState(true);
  const [editingSubIssueId, setEditingSubIssueId] = useState<string | null>(null);
  const [subIssueStatus, setSubIssueStatus] = useState("Backlog");
  const [subIssuePriority, setSubIssuePriority] = useState("No priority");
  const [subIssueLabels, setSubIssueLabels] = useState<string[]>([]);
  const [subIssueStatusSearchOpen, setSubIssueStatusSearchOpen] = useState(false);
  const [subIssueStatusSearchValue, setSubIssueStatusSearchValue] = useState("");
  const [subIssuePrioritySearchOpen, setSubIssuePrioritySearchOpen] = useState(false);
  const [subIssuePrioritySearchValue, setSubIssuePrioritySearchValue] = useState("");
  const [subIssueLabelSearchOpen, setSubIssueLabelSearchOpen] = useState(false);
  const [subIssueLabelSearchValue, setSubIssueLabelSearchValue] = useState("");

  const defaultStatusOptions = [
    { value: "Backlog", icon: Inbox, number: "1", color: "text-muted-foreground" },
    { value: "Todo", icon: CheckSquare, number: "2", color: "text-muted-foreground" },
    { value: "In Progress", icon: PlayCircle, number: "3", color: "text-yellow-500" },
    { value: "Done", icon: CheckCircle2, number: "4", color: "text-primary" },
    { value: "Cancelled", icon: XCircle, number: "5", color: "text-red-500" },
    { value: "Duplicate", icon: Copy, number: "6", color: "text-red-500" },
  ];

  // Get all statuses (default + custom from localStorage)
  const getAllStatuses = () => {
    const customStatuses = JSON.parse(localStorage.getItem("customStatuses") || "[]");
    return [...defaultStatusOptions, ...customStatuses];
  };

  const getStatusOptions = () => getAllStatuses();

  const filteredStatuses = getStatusOptions().filter((option) =>
    option.value.toLowerCase().includes(statusSearchValue.toLowerCase())
  );

  const defaultPriorityOptions = [
    { value: "No priority", icon: "0", color: "text-muted-foreground" },
    { value: "Urgent", icon: AlertCircle, color: "text-red-500" },
    { value: "High", icon: BarChart3, color: "text-orange-500" },
    { value: "Medium", icon: BarChart2, color: "text-yellow-500" },
    { value: "Low", icon: BarChart, color: "text-blue-500" },
  ];

  // Get all priorities (default + custom from localStorage)
  const getAllPriorities = () => {
    const customPriorities = JSON.parse(localStorage.getItem("customPriorities") || "[]");
    return [...defaultPriorityOptions, ...customPriorities];
  };

  const filteredPriorities = getAllPriorities().filter((option) =>
    option.value.toLowerCase().includes(prioritySearchValue.toLowerCase())
  );

  // Default labels with colors
  const defaultLabelsWithColors = [
    { name: "Bug", color: "bg-red-500" },
    { name: "Feature", color: "bg-purple-500" },
    { name: "Improvement", color: "bg-blue-500" },
    { name: "Documentation", color: "bg-gray-500" },
    { name: "Enhancement", color: "bg-green-500" },
  ];
  
  // Get all available labels (default + user created from localStorage)
  const getAllLabels = () => {
    const defaultLabels = defaultLabelsWithColors.map(l => l.name);
    const storedLabels = JSON.parse(localStorage.getItem("customLabels") || "[]");
    return [...defaultLabels, ...storedLabels];
  };

  const getLabelColor = (labelName: string) => {
    const found = defaultLabelsWithColors.find(l => l.name === labelName);
    return found ? found.color : "bg-gray-500";
  };

  const filteredLabels = getAllLabels().filter((label) =>
    label.toLowerCase().includes(labelSearchValue.toLowerCase()) &&
    !labels.includes(label)
  );

  const generateIssueNumber = () => {
    const existingIssues = JSON.parse(localStorage.getItem("issues") || "[]");
    const nextNumber = existingIssues.length + 1;
    return `SST-${nextNumber}`;
  };

  const handleAddLink = () => {
    if (!linkUrl.trim()) return;
    
    let linkTitleValue = linkTitle.trim();
    if (!linkTitleValue) {
      try {
        const url = new URL(linkUrl.trim());
        linkTitleValue = url.hostname.replace("www.", "") || "Link";
      } catch {
        linkTitleValue = "Link";
      }
    }
    
    const newLink: Link = {
      id: Date.now().toString(),
      url: linkUrl.trim(),
      title: linkTitleValue,
    };

    if (addingLinkForSubIssue) {
      setSubIssues(subIssues.map(subIssue => 
        subIssue.id === addingLinkForSubIssue
          ? { ...subIssue, links: [...subIssue.links, newLink] }
          : subIssue
      ));
      setAddingLinkForSubIssue(null);
    } else {
      setLinks([...links, newLink]);
    }
    
    setLinkUrl("");
    setLinkTitle("");
    setAddLinkDialogOpen(false);
  };

  const handleRemoveLink = (linkId: string, subIssueId?: string) => {
    if (subIssueId) {
      setSubIssues(subIssues.map(subIssue =>
        subIssue.id === subIssueId
          ? { ...subIssue, links: subIssue.links.filter(l => l.id !== linkId) }
          : subIssue
      ));
    } else {
      setLinks(links.filter(l => l.id !== linkId));
    }
  };

  const handleAddSubIssue = () => {
    const newSubIssue: SubIssue = {
      id: Date.now().toString(),
      title: "",
      description: "",
      links: [],
      saved: false,
    };
    setSubIssues([...subIssues, newSubIssue]);
    setEditingSubIssueId(newSubIssue.id);
    setSubIssueStatus("Backlog");
    setSubIssuePriority("No priority");
    setSubIssueLabels([]);
  };

  const handleSaveSubIssue = () => {
    if (!editingSubIssueId) return;
    const subIssue = subIssues.find(s => s.id === editingSubIssueId);
    if (!subIssue || !subIssue.title.trim()) return;

    // Only save fields that were actually selected/changed (not default values)
    const savedFields: any = {
      saved: true,
    };
    
    if (subIssueStatus && subIssueStatus !== "Backlog") {
      savedFields.status = subIssueStatus;
    }
    if (subIssuePriority && subIssuePriority !== "No priority") {
      savedFields.priority = subIssuePriority;
    }
    if (subIssueLabels.length > 0) {
      savedFields.labels = subIssueLabels;
    }
    if (subIssue.assignee) {
      savedFields.assignee = subIssue.assignee;
    }
    if (subIssue.project) {
      savedFields.project = subIssue.project;
    }
    if (subIssue.links.length > 0) {
      savedFields.links = subIssue.links;
    }

    setSubIssues(subIssues.map(s => 
      s.id === editingSubIssueId
        ? { ...s, ...savedFields }
        : s
    ));
    setEditingSubIssueId(null);
  };

  const handleEditSubIssue = (subIssueId: string) => {
    const subIssue = subIssues.find(s => s.id === subIssueId);
    if (subIssue) {
      setEditingSubIssueId(subIssueId);
      setSubIssueStatus(subIssue.status || "Backlog");
      setSubIssuePriority(subIssue.priority || "No priority");
      setSubIssueLabels(subIssue.labels || []);
      setSubIssueStatusSearchValue("");
      setSubIssuePrioritySearchValue("");
      setSubIssueLabelSearchValue("");
    }
  };

  const handleRemoveSubIssue = (subIssueId: string) => {
    setSubIssues(subIssues.filter(s => s.id !== subIssueId));
  };

  const handleUpdateSubIssue = (subIssueId: string, field: "title" | "description", value: string) => {
    setSubIssues(subIssues.map(subIssue =>
      subIssue.id === subIssueId
        ? { ...subIssue, [field]: value }
        : subIssue
    ));
  };

  const handleCreateIssue = () => {
    if (!issueTitle.trim()) return;

    const newIssue: Issue = {
      id: Date.now().toString(),
      title: issueTitle.trim(),
      description,
      status,
      priority,
      assignee: "LB Lakshya Bagani",
      createdBy: "LB Lakshya Bagani",
      labels,
      links,
      subIssues: subIssues.filter(s => s.saved),
      createdAt: new Date().toISOString(),
      issueNumber: generateIssueNumber(),
    };

    // Save to localStorage
    const existingIssues = JSON.parse(localStorage.getItem("issues") || "[]");
    existingIssues.push(newIssue);
    localStorage.setItem("issues", JSON.stringify(existingIssues));

    // Notify parent component
    if (onIssueCreated) {
      onIssueCreated();
    }
    
    if (!createMore) {
      onOpenChange(false);
      // Reset form
      setIssueTitle("");
      setDescription("");
      setStatus("Backlog");
      setPriority("No priority");
      setLabels([]);
      setLinks([]);
      setSubIssues([]);
      setLabelSearchValue("");
      setStatusSearchValue("");
      setPrioritySearchValue("");
    } else {
      // Reset form but keep modal open
      setIssueTitle("");
      setDescription("");
      setStatus("Backlog");
      setPriority("No priority");
      setLabels([]);
      setLinks([]);
      setSubIssues([]);
      setLabelSearchValue("");
      setStatusSearchValue("");
      setPrioritySearchValue("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full p-0 gap-0 bg-surface border-border rounded-lg [&>button]:hidden">
        <DialogTitle className="sr-only">New issue</DialogTitle>
        <DialogDescription className="sr-only">Create a new issue</DialogDescription>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>SST</span>
            <span className="text-muted-foreground/50">{" > "}</span>
            <span className="text-foreground">New issue</span>
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
          {/* Issue Title */}
          <Input
            value={issueTitle}
            onChange={(e) => setIssueTitle(e.target.value)}
            placeholder="Issue title"
            className="text-base border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
          />

          {/* Description */}
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description..."
            className="min-h-[80px] resize-none border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
          />

          {/* Action/Tag Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status - Searchable Popover */}
            <Popover open={statusSearchOpen} onOpenChange={setStatusSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs border border-border hover:bg-surface-hover rounded-md px-2"
                >
                  <Settings className="h-3.5 w-3.5" />
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
                                number: String(getAllStatuses().length + 1),
                                color: "text-muted-foreground",
                              };
                              // Save to localStorage
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
                    {filteredStatuses.length > 0 && (
                      <CommandGroup>
                        {filteredStatuses.map((option) => {
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
                              <span className={cn("text-xs ml-2", option.color)}>
                                {option.number}
                              </span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    )}
                    {filteredStatuses.length === 0 && !statusSearchValue.trim() && (
                      <CommandEmpty>No statuses found. Type to create a new status.</CommandEmpty>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Priority - Searchable Popover */}
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
                              // Save to localStorage
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
                    {filteredPriorities.length > 0 && (
                      <CommandGroup>
                        {filteredPriorities.map((option, index) => {
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
                              <span className="text-xs text-muted-foreground ml-2">{index}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    )}
                    {filteredPriorities.length === 0 && !prioritySearchValue.trim() && (
                      <CommandEmpty>No priorities found. Type to create a new priority.</CommandEmpty>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Assignee */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs border border-border hover:bg-surface-hover rounded-md px-2"
            >
              <div className="w-4 h-4 rounded bg-primary flex items-center justify-center text-[10px] font-medium text-primary-foreground">
                LB
              </div>
              <span>LB Lakshya Bagani</span>
            </Button>

            {/* Project */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs border border-border hover:bg-surface-hover rounded-md px-2"
            >
              <FolderKanban className="h-3.5 w-3.5" />
              Project
            </Button>

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
            
            {/* Add Label - Searchable Popover */}
            <Popover open={labelSearchOpen} onOpenChange={setLabelSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground border border-border hover:bg-surface-hover rounded-md px-2"
                >
                  <Plus className="h-3 w-3" />
                  Add label
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
                              // Save to localStorage
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
                    {filteredLabels.length > 0 && (
                      <CommandGroup>
                        {filteredLabels.map((label) => {
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
                    {filteredLabels.length === 0 && !labelSearchValue.trim() && (
                      <CommandEmpty>No labels found. Type to create a new label.</CommandEmpty>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Attachment */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 border border-border hover:bg-surface-hover rounded-md text-muted-foreground hover:text-foreground"
              onClick={() => {
                setAddingLinkForSubIssue(null);
                setAddLinkDialogOpen(true);
              }}
            >
              <Link2 className="h-4 w-4" />
            </Button>

            {/* More Options - Last */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 border border-border hover:bg-surface-hover rounded-md"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover min-w-[200px]">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Set due date</span>
                    <span className="ml-auto text-xs text-muted-foreground">D</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-popover">
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">
                      Try: 24h, 7 days, Feb 9
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Custom...</DropdownMenuItem>
                    <DropdownMenuItem>Tomorrow Mon, 3 Nov</DropdownMenuItem>
                    <DropdownMenuItem>End of this week Fri, 7 Nov</DropdownMenuItem>
                    <DropdownMenuItem>In one week Sun, 9 Nov</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem className="gap-2">
                  <Repeat className="h-4 w-4" />
                  <span>Make recurring...</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="gap-2"
                  onClick={() => {
                    setAddingLinkForSubIssue(null);
                    setAddLinkDialogOpen(true);
                  }}
                >
                  <Link2 className="h-4 w-4" />
                  <span>Add link...</span>
                  <span className="ml-auto text-xs text-muted-foreground">Ctrl Alt L</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="gap-2"
                  onClick={handleAddSubIssue}
                >
                  <GitBranch className="h-4 w-4" />
                  <span>Add sub-issue</span>
                  <span className="ml-auto text-xs text-muted-foreground">Ctrl ⇧ O</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Links Display - Below action bar */}
          {links.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center gap-2 px-2 py-1 rounded-md border border-border bg-surface text-xs h-8"
                >
                  <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-foreground">{link.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleRemoveLink(link.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Edit Sub-issue Section - Show when editing, appears above saved sub-issues */}
          {editingSubIssueId && (
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="text-sm font-medium text-foreground">Edit sub-issue</div>
              {(() => {
                const editingSubIssue = subIssues.find(s => s.id === editingSubIssueId);
                if (!editingSubIssue) return null;
                
                return (
                  <div className="space-y-3 ml-6">
                    <div className="flex items-center gap-2">
                      <Circle className="h-3 w-3 text-muted-foreground" />
                      <Input
                        value={editingSubIssue.title}
                        onChange={(e) => handleUpdateSubIssue(editingSubIssueId, "title", e.target.value)}
                        placeholder="Sub-issue title"
                        className="text-sm border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground flex-1"
                      />
                    </div>

                    <Textarea
                      value={editingSubIssue.description}
                      onChange={(e) => handleUpdateSubIssue(editingSubIssueId, "description", e.target.value)}
                      placeholder="Add description..."
                      className="min-h-[60px] resize-none border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground text-sm"
                    />

                    {/* Sub-issue Action Bar - Show all fields like main issue */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Status - Searchable Popover */}
                      <Popover open={subIssueStatusSearchOpen} onOpenChange={setSubIssueStatusSearchOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5 text-xs border border-border hover:bg-surface-hover rounded-md px-2"
                          >
                            <Settings className="h-3.5 w-3.5" />
                            {subIssueStatus}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[280px] p-0" align="start">
                          <Command>
                            <CommandInput
                              placeholder="Search or create status..."
                              value={subIssueStatusSearchValue}
                              onValueChange={setSubIssueStatusSearchValue}
                            />
                            <CommandList>
                              {subIssueStatusSearchValue.trim() && 
                               !getAllStatuses().some(s => s.value.toLowerCase() === subIssueStatusSearchValue.trim().toLowerCase()) && (
                                <CommandGroup>
                                  <CommandItem
                                    onSelect={() => {
                                      const newStatus = subIssueStatusSearchValue.trim();
                                      if (newStatus) {
                                        const customStatus = {
                                          value: newStatus,
                                          icon: Settings,
                                          number: String(getAllStatuses().length + 1),
                                          color: "text-muted-foreground",
                                        };
                                        const storedStatuses = JSON.parse(localStorage.getItem("customStatuses") || "[]");
                                        if (!storedStatuses.some((s: any) => s.value === newStatus)) {
                                          storedStatuses.push(customStatus);
                                          localStorage.setItem("customStatuses", JSON.stringify(storedStatuses));
                                        }
                                        setSubIssueStatus(newStatus);
                                        setSubIssueStatusSearchValue("");
                                        setSubIssueStatusSearchOpen(false);
                                      }
                                    }}
                                    className="cursor-pointer font-medium"
                                  >
                                    <Plus className="mr-2 h-4 w-4 text-primary" />
                                    Create "{subIssueStatusSearchValue.trim()}"
                                  </CommandItem>
                                </CommandGroup>
                              )}
                              {getAllStatuses().filter((option) =>
                                option.value.toLowerCase().includes(subIssueStatusSearchValue.toLowerCase())
                              ).length > 0 && (
                                <CommandGroup>
                                  {getAllStatuses().filter((option) =>
                                    option.value.toLowerCase().includes(subIssueStatusSearchValue.toLowerCase())
                                  ).map((option) => {
                                    const IconComponent = option.icon;
                                    return (
                                      <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                          setSubIssueStatus(option.value);
                                          setSubIssueStatusSearchValue("");
                                          setSubIssueStatusSearchOpen(false);
                                        }}
                                        className={cn(
                                          "cursor-pointer gap-3 px-3 py-2",
                                          subIssueStatus === option.value && "bg-accent text-accent-foreground"
                                        )}
                                      >
                                        <IconComponent className={cn("h-4 w-4", option.color)} />
                                        <span className="flex-1">{option.value}</span>
                                        {subIssueStatus === option.value && (
                                          <Check className="h-4 w-4 text-primary" />
                                        )}
                                        <span className={cn("text-xs ml-2", option.color)}>
                                          {option.number}
                                        </span>
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      {/* Priority - Searchable Popover */}
                      <Popover open={subIssuePrioritySearchOpen} onOpenChange={setSubIssuePrioritySearchOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5 text-xs border border-border hover:bg-surface-hover rounded-md px-2"
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                            {subIssuePriority === "No priority" ? "Priority" : subIssuePriority}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[280px] p-0" align="start">
                          <Command>
                            <CommandInput
                              placeholder="Search or create priority..."
                              value={subIssuePrioritySearchValue}
                              onValueChange={setSubIssuePrioritySearchValue}
                            />
                            <CommandList>
                              {subIssuePrioritySearchValue.trim() && 
                               !getAllPriorities().some(p => p.value.toLowerCase() === subIssuePrioritySearchValue.trim().toLowerCase()) && (
                                <CommandGroup>
                                  <CommandItem
                                    onSelect={() => {
                                      const newPriority = subIssuePrioritySearchValue.trim();
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
                                        setSubIssuePriority(newPriority);
                                        setSubIssuePrioritySearchValue("");
                                        setSubIssuePrioritySearchOpen(false);
                                      }
                                    }}
                                    className="cursor-pointer font-medium"
                                  >
                                    <Plus className="mr-2 h-4 w-4 text-primary" />
                                    Create "{subIssuePrioritySearchValue.trim()}"
                                  </CommandItem>
                                </CommandGroup>
                              )}
                              {getAllPriorities().filter((option) =>
                                option.value.toLowerCase().includes(subIssuePrioritySearchValue.toLowerCase())
                              ).length > 0 && (
                                <CommandGroup>
                                  {getAllPriorities().filter((option) =>
                                    option.value.toLowerCase().includes(subIssuePrioritySearchValue.toLowerCase())
                                  ).map((option, index) => {
                                    const IconComponent = typeof option.icon === "string" ? null : option.icon;
                                    return (
                                      <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                          setSubIssuePriority(option.value);
                                          setSubIssuePrioritySearchValue("");
                                          setSubIssuePrioritySearchOpen(false);
                                        }}
                                        className={cn(
                                          "cursor-pointer gap-3 px-3 py-2",
                                          subIssuePriority === option.value && "bg-accent text-accent-foreground"
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
                                        {subIssuePriority === option.value && (
                                          <Check className="h-4 w-4 text-primary" />
                                        )}
                                        <span className="text-xs text-muted-foreground ml-2">{index}</span>
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      {/* Assignee */}
                      {editingSubIssue.assignee ? (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-border bg-surface text-xs h-8">
                          <div className="w-4 h-4 rounded bg-primary flex items-center justify-center text-[10px] font-medium text-primary-foreground">
                            LB
                          </div>
                          <span>{editingSubIssue.assignee}</span>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1.5 text-xs border border-border hover:bg-surface-hover rounded-md px-2"
                          onClick={() => {
                            // Set assignee when clicked
                            const updated = subIssues.map(s => 
                              s.id === editingSubIssueId
                                ? { ...s, assignee: "LB Lakshya Bagani" }
                                : s
                            );
                            setSubIssues(updated);
                          }}
                        >
                          <div className="w-4 h-4 rounded bg-primary flex items-center justify-center text-[10px] font-medium text-primary-foreground">
                            LB
                          </div>
                          <span>LB Lakshya Bagani</span>
                        </Button>
                      )}

                      {/* Project */}
                      {editingSubIssue.project ? (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-border bg-surface text-xs h-8">
                          <div className="w-3 h-3 rounded bg-green-500"></div>
                          <span>{editingSubIssue.project}</span>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1.5 text-xs border border-border hover:bg-surface-hover rounded-md px-2"
                          onClick={() => {
                            // Set project when clicked
                            const updated = subIssues.map(s => 
                              s.id === editingSubIssueId
                                ? { ...s, project: "Sst.scaler" }
                                : s
                            );
                            setSubIssues(updated);
                          }}
                        >
                          <FolderKanban className="h-3.5 w-3.5" />
                          Project
                        </Button>
                      )}

                      {/* Labels */}
                      {subIssueLabels.map((label, index) => (
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
                            onClick={() => setSubIssueLabels(subIssueLabels.filter((_, i) => i !== index))}
                          >
                            <X className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      ))}
                      
                      {/* Add Label - Searchable Popover */}
                      <Popover open={subIssueLabelSearchOpen} onOpenChange={setSubIssueLabelSearchOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground border border-border hover:bg-surface-hover rounded-md px-2"
                          >
                            <Plus className="h-3 w-3" />
                            Add label
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-0" align="start">
                          <Command>
                            <CommandInput
                              placeholder="Search or create label..."
                              value={subIssueLabelSearchValue}
                              onValueChange={setSubIssueLabelSearchValue}
                            />
                            <CommandList>
                              {subIssueLabelSearchValue.trim() && 
                               !getAllLabels().some(l => l.toLowerCase() === subIssueLabelSearchValue.trim().toLowerCase()) && (
                                <CommandGroup>
                                  <CommandItem
                                    onSelect={() => {
                                      const newLabel = subIssueLabelSearchValue.trim();
                                      if (newLabel && !subIssueLabels.includes(newLabel)) {
                                        setSubIssueLabels([...subIssueLabels, newLabel]);
                                        const storedLabels = JSON.parse(localStorage.getItem("customLabels") || "[]");
                                        if (!storedLabels.includes(newLabel)) {
                                          storedLabels.push(newLabel);
                                          localStorage.setItem("customLabels", JSON.stringify(storedLabels));
                                        }
                                        setSubIssueLabelSearchValue("");
                                        setSubIssueLabelSearchOpen(false);
                                      }
                                    }}
                                    className="cursor-pointer font-medium"
                                  >
                                    <Plus className="mr-2 h-4 w-4 text-primary" />
                                    Create "{subIssueLabelSearchValue.trim()}"
                                  </CommandItem>
                                </CommandGroup>
                              )}
                              {getAllLabels().filter((label) =>
                                label.toLowerCase().includes(subIssueLabelSearchValue.toLowerCase()) &&
                                !subIssueLabels.includes(label)
                              ).length > 0 && (
                                <CommandGroup>
                                  {getAllLabels().filter((label) =>
                                    label.toLowerCase().includes(subIssueLabelSearchValue.toLowerCase()) &&
                                    !subIssueLabels.includes(label)
                                  ).map((label) => {
                                    const labelInfo = defaultLabelsWithColors.find(l => l.name === label);
                                    return (
                                      <CommandItem
                                        key={label}
                                        onSelect={() => {
                                          if (!subIssueLabels.includes(label)) {
                                            setSubIssueLabels([...subIssueLabels, label]);
                                          }
                                          setSubIssueLabelSearchValue("");
                                          setSubIssueLabelSearchOpen(false);
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

                      {/* Attachment */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 border border-border hover:bg-surface-hover rounded-md text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setAddingLinkForSubIssue(editingSubIssueId);
                          setAddLinkDialogOpen(true);
                        }}
                      >
                        <Link2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Sub-issue Links */}
                    {editingSubIssue.links.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {editingSubIssue.links.map((link) => (
                          <div
                            key={link.id}
                            className="flex items-center gap-2 px-2 py-1 rounded-md border border-border bg-surface text-xs h-8"
                          >
                            <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-foreground">{link.title}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => handleRemoveLink(link.id, editingSubIssueId)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Saved Sub-issues Section - Hide when editing new sub-issue */}
          {subIssues.filter(s => s.saved).length > 0 && !editingSubIssueId && (
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSubIssuesExpanded(!subIssuesExpanded)}
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  {subIssuesExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <span>Sub-issues {subIssues.filter(s => s.saved).length}</span>
                </button>
              </div>

              {subIssuesExpanded && (
                <div className="space-y-4 ml-6">
                  {subIssues.filter(s => s.saved).map((subIssue) => (
                    <div key={subIssue.id} className="border-l-2 border-border pl-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <Circle className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-foreground">{subIssue.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Saved sub-issue properties - Right side, same level as title - Only show selected fields */}
                          {subIssue.status && subIssue.status !== "Backlog" && (
                            <div className="px-2 py-0.5 rounded-md border border-border bg-surface text-xs h-7">
                              {subIssue.status}
                            </div>
                          )}
                          {subIssue.priority && subIssue.priority !== "No priority" && (
                            <div className="px-2 py-0.5 rounded-md border border-border bg-surface text-xs h-7">
                              {subIssue.priority}
                            </div>
                          )}
                          {subIssue.assignee && (
                            <div className="px-2 py-0.5 rounded-md border border-border bg-surface text-xs h-7">
                              {subIssue.assignee}
                            </div>
                          )}
                          {subIssue.project && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-border bg-surface text-xs h-7">
                              <div className="w-2.5 h-2.5 rounded bg-green-500"></div>
                              {subIssue.project}
                            </div>
                          )}
                          {subIssue.labels && subIssue.labels.length > 0 && subIssue.labels.map((label, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-border bg-surface text-xs h-7"
                            >
                              <div className={cn("w-2 h-2 rounded-full", getLabelColor(label))}></div>
                              <span>{label}</span>
                            </div>
                          ))}
                          {subIssue.links.length > 0 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 border border-border hover:bg-surface-hover rounded-md"
                            >
                              <Link2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleEditSubIssue(subIssue.id)}
                          >
                            <Settings className="h-3.5 w-3.5" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                              >
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleRemoveSubIssue(subIssue.id)}>
                                Remove sub-issue
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add another sub-issue button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    onClick={handleAddSubIssue}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add sub-issue
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add Link Dialog */}
        <Dialog open={addLinkDialogOpen} onOpenChange={setAddLinkDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {addingLinkForSubIssue 
                  ? "Add link to sub-issue"
                  : `Add link to ${issueTitle || "issue"}`}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link-title">Title (optional)</Label>
                <Input
                  id="link-title"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="Link title"
                  className="w-full"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setAddLinkDialogOpen(false);
                  setLinkUrl("");
                  setLinkTitle("");
                  setAddingLinkForSubIssue(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddLink}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={!linkUrl.trim()}
              >
                Add link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Switch
              id="create-more"
              checked={createMore}
              onCheckedChange={setCreateMore}
            />
            <Label
              htmlFor="create-more"
              className="text-sm text-muted-foreground cursor-pointer select-none"
            >
              Create more
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (editingSubIssueId) {
                  setEditingSubIssueId(null);
                } else {
                  onOpenChange(false);
                }
              }}
              className="px-4"
            >
              Cancel
            </Button>
            {editingSubIssueId ? (
              <Button
                onClick={handleSaveSubIssue}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4"
                disabled={!subIssues.find(s => s.id === editingSubIssueId)?.title.trim()}
              >
                Save sub-issue
              </Button>
            ) : (
              <Button
                onClick={handleCreateIssue}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4"
                disabled={!issueTitle.trim()}
              >
                Create Issue
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

