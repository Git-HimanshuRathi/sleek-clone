import { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import {
  ChevronRight,
  Star,
  MoreHorizontal,
  Bell,
  Link2,
  SquareDot,
  Box,
  User,
  Users,
  Calendar,
  Target,
  Tag,
  Plus,
  Pencil,
  ChevronDown,
  ChevronUp,
  Settings,
  AlertCircle,
  BarChart3,
  BarChart2,
  BarChart,
  Inbox,
  X,
  CheckSquare,
  PlayCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project } from "@/components/NewProjectModal";
import { Link } from "@/components/NewIssueModal";

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

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "updates" | "issues">("overview");
  const [propertiesExpanded, setPropertiesExpanded] = useState(true);
  const [milestonesExpanded, setMilestonesExpanded] = useState(true);
  const [activityExpanded, setActivityExpanded] = useState(true);
  const [projectUpdate, setProjectUpdate] = useState("");
  const [showProjectUpdateInput, setShowProjectUpdateInput] = useState(false);
  const [description, setDescription] = useState("");
  const [newMilestoneName, setNewMilestoneName] = useState("");
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [links, setLinks] = useState<Link[]>([]);

  const [statusSearchOpen, setStatusSearchOpen] = useState(false);
  const [statusSearchValue, setStatusSearchValue] = useState("");
  const [prioritySearchOpen, setPrioritySearchOpen] = useState(false);
  const [prioritySearchValue, setPrioritySearchValue] = useState("");
  const [labelSearchOpen, setLabelSearchOpen] = useState(false);
  const [labelSearchValue, setLabelSearchValue] = useState("");
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [targetDatePickerOpen, setTargetDatePickerOpen] = useState(false);
  const [sidebarStartDatePickerOpen, setSidebarStartDatePickerOpen] = useState(false);
  const [sidebarTargetDatePickerOpen, setSidebarTargetDatePickerOpen] = useState(false);
  const [sidebarStatusSearchOpen, setSidebarStatusSearchOpen] = useState(false);
  const [sidebarPrioritySearchOpen, setSidebarPrioritySearchOpen] = useState(false);
  const [sidebarLabelSearchOpen, setSidebarLabelSearchOpen] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = () => {
    const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const foundProject = storedProjects.find((p: Project) => p.id === projectId);
    if (foundProject) {
      setProject(foundProject);
      setDescription(foundProject.description || "");
      // Load links if they exist
      if (foundProject.links) {
        setLinks(foundProject.links);
      }
    }
  };

  const updateProject = (updates: Partial<Project>) => {
    if (!project) return;
    const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const updatedProjects = storedProjects.map((p: Project) =>
      p.id === project.id ? { ...p, ...updates } : p
    );
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    setProject({ ...project, ...updates });
  };

  const handleAddLink = () => {
    if (!linkUrl.trim()) return;
    
    let title = linkTitle.trim();
    if (!title) {
      try {
        const urlObj = new URL(linkUrl);
        title = urlObj.hostname.replace("www.", "");
      } catch {
        title = linkUrl;
      }
    }

    const newLink: Link = {
      id: Date.now().toString(),
      url: linkUrl.trim(),
      title,
    };

    const updatedLinks = [...links, newLink];
    setLinks(updatedLinks);
    updateProject({ links: updatedLinks });
    
    // Reset form
    setLinkUrl("");
    setLinkTitle("");
    setShowAddLinkForm(false);
  };

  const handleRemoveLink = (linkId: string) => {
    const updatedLinks = links.filter(l => l.id !== linkId);
    setLinks(updatedLinks);
    updateProject({ links: updatedLinks });
  };

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

  // Fetch teams from localStorage
  const getAllTeams = () => {
    const storedTeams = JSON.parse(localStorage.getItem("teams") || "[]");
    return storedTeams.length > 0 ? storedTeams : ["Sst.scaler"]; // Default team
  };

  // Fetch members from localStorage
  const getAllMembers = () => {
    const storedMembers = JSON.parse(localStorage.getItem("members") || "[]");
    return storedMembers.length > 0 ? storedMembers : ["LB Lakshya Bagani"]; // Default member
  };

  // Get project's team (stored in project.teams or default)
  const getProjectTeam = () => {
    if (project?.teams && project.teams.length > 0) {
      return project.teams[0];
    }
    const teams = getAllTeams();
    return teams[0] || "Sst.scaler";
  };

  // Get project's members (stored in project.members or empty array)
  const getProjectMembers = () => {
    return project?.members || [];
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Project not found</p>
          <Button onClick={() => navigate("/projects")} className="mt-4">
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", name: "Overview" },
    { id: "updates", name: "Updates" },
    { id: "issues", name: "Issues" },
  ];

  return (
    <div className="h-full flex flex-col bg-background" style={{ marginTop: "8px" }}>
      {/* Top Navigation Bar */}
      <div className="border-b border-border px-3 md:px-5" style={{ paddingTop: "8px", paddingBottom: "8px" }}>
        <div className="flex items-center justify-between">
          {/* Left: Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate("/projects")}
              className="text-muted-foreground hover:text-foreground"
            >
              Projects
            </button>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{project.name}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 hover:bg-surface/70 hover:text-foreground focus-visible:ring-0">
              <Star className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-surface/70 hover:text-foreground focus-visible:ring-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Edit project</DropdownMenuItem>
                <DropdownMenuItem>Delete project</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Center: Tabs */}
          <nav className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  activeTab === tab.id
                    ? "bg-surface text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface/30"
                )}
              >
                {tab.name}
              </button>
            ))}
          </nav>

          {/* Right: Icons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-surface/70 hover:text-foreground focus-visible:ring-0">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-surface/70 hover:text-foreground focus-visible:ring-0">
              <Link2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-surface/70 hover:text-foreground focus-visible:ring-0">
              <SquareDot className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="flex-1 overflow-y-auto pl-20 pr-6 py-8 space-y-8">
          {/* Project Header */}
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <Box className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
              {project.shortSummary && (
                <p className="text-muted-foreground mt-1">{project.shortSummary}</p>
              )}
            </div>
          </div>

          {/* Properties Row */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-base font-medium text-foreground">Properties</h2>
              <div className="flex items-center gap-2 flex-wrap">
              {/* Status */}
              <Popover open={statusSearchOpen} onOpenChange={setStatusSearchOpen}>
                <PopoverTrigger asChild>
                  <button className="text-sm text-foreground hover:text-foreground flex items-center gap-1.5">
                    {(() => {
                      const statusOption = getAllStatuses().find(s => s.value === project.status);
                      const StatusIcon = statusOption?.icon || Inbox;
                      return <StatusIcon className={cn("h-3.5 w-3.5", statusOption?.color || "text-orange-500")} />;
                    })()}
                    {project.status || "Backlog"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search or create status..."
                      value={statusSearchValue}
                      onValueChange={setStatusSearchValue}
                    />
                    <CommandList>
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
                                  updateProject({ status: option.value });
                                  setStatusSearchValue("");
                                  setStatusSearchOpen(false);
                                }}
                                className={cn(
                                  "cursor-pointer gap-3 px-3 py-2 hover:bg-surface/70 hover:text-foreground",
                                  project.status === option.value && "bg-surface text-foreground"
                                )}
                              >
                                <IconComponent className={cn("h-4 w-4", option.color)} />
                                <span className="flex-1">{option.value}</span>
                                {project.status === option.value && (
                                  <Check className="h-4 w-4 text-foreground" />
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
                  <button className="text-sm text-foreground hover:text-foreground flex items-center gap-1.5">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                    {project.priority || "No priority"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search or create priority..."
                      value={prioritySearchValue}
                      onValueChange={setPrioritySearchValue}
                    />
                    <CommandList>
                      {getAllPriorities().filter((option) =>
                        option.value.toLowerCase().includes(prioritySearchValue.toLowerCase())
                      ).length > 0 && (
                        <CommandGroup>
                          {getAllPriorities().filter((option) =>
                            option.value.toLowerCase().includes(prioritySearchValue.toLowerCase())
                          ).map((option) => {
                            const IconComponent = typeof option.icon === "string" ? null : option.icon;
                            return (
                              <CommandItem
                                key={option.value}
                                onSelect={() => {
                                  updateProject({ priority: option.value });
                                  setPrioritySearchValue("");
                                  setPrioritySearchOpen(false);
                                }}
                                className={cn(
                                  "cursor-pointer gap-3 px-3 py-2 hover:bg-surface/70 hover:text-foreground",
                                  project.priority === option.value && "bg-surface text-foreground"
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
                                {project.priority === option.value && (
                                  <Check className="h-4 w-4 text-foreground" />
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

              {/* Lead */}
              {project.lead ? (
                <button 
                  className="text-sm text-foreground hover:text-foreground flex items-center gap-1.5"
                  onClick={() => updateProject({ lead: undefined })}
                >
                  <User className="h-3.5 w-3.5" />
                  {project.lead}
                </button>
              ) : (
                <button
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5"
                  onClick={() => updateProject({ lead: "LB Lakshya Bagani" })}
                >
                  <User className="h-3.5 w-3.5" />
                  Add lead
                </button>
              )}

              {/* Target Date */}
              <Popover open={targetDatePickerOpen} onOpenChange={setTargetDatePickerOpen}>
                <PopoverTrigger asChild>
                  <button className="text-sm text-foreground hover:text-foreground flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5" />
                    {project.targetDate ? formatDate(project.targetDate) : "Target date"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={project.targetDate ? new Date(project.targetDate) : undefined}
                    onSelect={(date) => {
                      updateProject({ targetDate: date?.toISOString() });
                      setTargetDatePickerOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Teams */}
              <button className="text-sm text-foreground hover:text-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {getProjectTeam()}
              </button>

              {/* More Options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-sm text-foreground hover:text-foreground">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>Edit project</DropdownMenuItem>
                  <DropdownMenuItem>Archive project</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Resources Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-6">
              <h2 className="text-base font-medium text-foreground">Resources</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-sm text-muted-foreground/70 hover:text-muted-foreground flex items-center gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    Add document or link
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>
                    <Plus className="h-4 w-4 mr-2" />
                    Create document
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowAddLinkForm(true)}>
                    <Link2 className="h-4 w-4 mr-2" />
                    Add link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Add Link Form */}
            {showAddLinkForm && (
              <div className="space-y-2 border border-border rounded-md p-3">
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="Link URL"
                  className="text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddLink();
                    }
                  }}
                />
                <Input
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="Link title (optional)"
                  className="text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddLink();
                    }
                  }}
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleAddLink}
                    className="text-xs"
                    disabled={!linkUrl.trim()}
                  >
                    Add
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowAddLinkForm(false);
                      setLinkUrl("");
                      setLinkTitle("");
                    }}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Display Links */}
            {links.length > 0 && (
              <div className="space-y-2">
                {links.map((link) => (
                  <div key={link.id} className="flex items-center justify-between group">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-foreground hover:text-foreground"
                    >
                      <Link2 className="h-4 w-4 text-muted-foreground" />
                      <span>{link.title}</span>
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      onClick={() => handleRemoveLink(link.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project Update Section */}
          <div className="space-y-3">
            {!showProjectUpdateInput ? (
              <button
                onClick={() => setShowProjectUpdateInput(true)}
                className="text-sm text-muted-foreground/70 hover:text-muted-foreground flex items-center gap-1.5"
              >
                <Pencil className="h-3.5 w-3.5" />
                Write a project update
              </button>
            ) : (
              <div className="border border-border rounded-md p-3 hover:border-border transition-colors">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Pencil className="h-4 w-4" />
                  <Input
                    value={projectUpdate}
                    onChange={(e) => setProjectUpdate(e.target.value)}
                    placeholder="Write a project update..."
                    className="border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setShowProjectUpdateInput(false);
                        setProjectUpdate("");
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-foreground">Description</h2>
            <Textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                updateProject({ description: e.target.value });
              }}
              placeholder="Add description..."
              className="min-h-[100px] resize-none border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
            />
          </div>

          {/* Milestone Button */}
          <div>
            <Button variant="outline" className="gap-2 hover:bg-surface/70 hover:text-foreground focus-visible:ring-0">
              <Plus className="h-4 w-4" />
              Milestone
            </Button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 border-l border-border overflow-y-auto px-6 py-8 space-y-8">
          {/* Properties Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Properties</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-surface/70 hover:text-foreground focus-visible:ring-0">
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-surface/70 hover:text-foreground focus-visible:ring-0"
                  onClick={() => setPropertiesExpanded(!propertiesExpanded)}
                >
                  {propertiesExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
            {propertiesExpanded && (
              <div className="space-y-2 text-sm">
                {/* Status */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Status</span>
                  <Popover open={sidebarStatusSearchOpen} onOpenChange={setSidebarStatusSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 text-xs text-foreground hover:text-foreground focus-visible:ring-0 gap-1.5">
                        {(() => {
                          const statusOption = getAllStatuses().find(s => s.value === project.status);
                          const StatusIcon = statusOption?.icon || Inbox;
                          return (
                            <>
                              <StatusIcon className={cn("h-3.5 w-3.5", statusOption?.color || "text-muted-foreground")} />
                              {project.status || "Backlog"}
                            </>
                          );
                        })()}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-0" align="end">
                      <Command>
                        <CommandInput
                          placeholder="Search or create status..."
                          value={statusSearchValue}
                          onValueChange={setStatusSearchValue}
                        />
                        <CommandList>
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
                                      updateProject({ status: option.value });
                                      setStatusSearchValue("");
                                      setSidebarStatusSearchOpen(false);
                                    }}
                                    className={cn(
                                      "cursor-pointer gap-3 px-3 py-2 hover:bg-surface/70 hover:text-foreground",
                                      project.status === option.value && "bg-surface text-foreground"
                                    )}
                                  >
                                    <IconComponent className={cn("h-4 w-4", option.color)} />
                                    <span className="flex-1">{option.value}</span>
                                    {project.status === option.value && (
                                      <Check className="h-4 w-4 text-foreground" />
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
                </div>

                {/* Priority */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Priority</span>
                  <Popover open={sidebarPrioritySearchOpen} onOpenChange={setSidebarPrioritySearchOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 text-xs text-foreground hover:text-foreground focus-visible:ring-0 gap-1.5">
                        {(() => {
                          const priorityOption = getAllPriorities().find(p => p.value === project.priority);
                          if (priorityOption && typeof priorityOption.icon !== "string" && priorityOption.icon) {
                            const PriorityIcon = priorityOption.icon;
                            return (
                              <>
                                <PriorityIcon className={cn("h-3.5 w-3.5", priorityOption.color)} />
                                {project.priority || "No priority"}
                              </>
                            );
                          } else if (priorityOption && typeof priorityOption.icon === "string") {
                            return (
                              <>
                                <span className={cn("text-xs", priorityOption.color)}>{priorityOption.icon}</span>
                                {project.priority || "No priority"}
                              </>
                            );
                          }
                          return (
                            <>
                              <MoreHorizontal className="h-3.5 w-3.5" />
                              {project.priority || "No priority"}
                            </>
                          );
                        })()}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-0" align="end">
                      <Command>
                        <CommandInput
                          placeholder="Search or create priority..."
                          value={prioritySearchValue}
                          onValueChange={setPrioritySearchValue}
                        />
                        <CommandList>
                          {getAllPriorities().filter((option) =>
                            option.value.toLowerCase().includes(prioritySearchValue.toLowerCase())
                          ).length > 0 && (
                            <CommandGroup>
                              {getAllPriorities().filter((option) =>
                                option.value.toLowerCase().includes(prioritySearchValue.toLowerCase())
                              ).map((option) => {
                                const IconComponent = typeof option.icon === "string" ? null : option.icon;
                                return (
                                  <CommandItem
                                    key={option.value}
                                    onSelect={() => {
                                      updateProject({ priority: option.value });
                                      setPrioritySearchValue("");
                                      setSidebarPrioritySearchOpen(false);
                                    }}
                                    className={cn(
                                      "cursor-pointer gap-3 px-3 py-2 hover:bg-surface/70 hover:text-foreground",
                                      project.priority === option.value && "bg-surface text-foreground"
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
                                    {project.priority === option.value && (
                                      <Check className="h-4 w-4 text-foreground" />
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
                </div>

                {/* Lead */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Lead</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs text-foreground hover:text-foreground focus-visible:ring-0 gap-1.5"
                    onClick={() => updateProject({ lead: project.lead ? undefined : "LB Lakshya Bagani" })}
                  >
                    {project.lead ? (
                      <>
                        <User className="h-3.5 w-3.5" />
                        {project.lead}
                      </>
                    ) : (
                      "Add lead"
                    )}
                  </Button>
                </div>

                {/* Members */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Members</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs text-foreground hover:text-foreground focus-visible:ring-0 gap-1.5"
                    onClick={() => {
                      const currentMembers = getProjectMembers();
                      const availableMembers = getAllMembers();
                      // Toggle members - if empty, add first available member, otherwise clear
                      updateProject({ 
                        members: currentMembers.length > 0 ? [] : availableMembers.slice(0, 1)
                      });
                    }}
                  >
                    {(() => {
                      const currentMembers = getProjectMembers();
                      return currentMembers.length > 0 ? (
                        <>
                          <Users className="h-3.5 w-3.5" />
                          {`${currentMembers.length} member${currentMembers.length > 1 ? "s" : ""}`}
                        </>
                      ) : (
                        "Add members"
                      );
                    })()}
                  </Button>
                </div>

                {/* Start date */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Start date</span>
                  <Popover open={sidebarStartDatePickerOpen} onOpenChange={setSidebarStartDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 text-xs text-foreground hover:text-foreground focus-visible:ring-0 gap-1.5">
                        {project.startDate ? (
                          <>
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(project.startDate)}
                          </>
                        ) : (
                          "Add date"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <CalendarComponent
                        mode="single"
                        selected={project.startDate ? new Date(project.startDate) : undefined}
                        onSelect={(date) => {
                          updateProject({ startDate: date?.toISOString() });
                          setSidebarStartDatePickerOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Target date */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Target date</span>
                  <Popover open={sidebarTargetDatePickerOpen} onOpenChange={setSidebarTargetDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 text-xs text-foreground hover:text-foreground focus-visible:ring-0 gap-1.5">
                        {project.targetDate ? (
                          <>
                            <Target className="h-3.5 w-3.5" />
                            {formatDate(project.targetDate)}
                          </>
                        ) : (
                          "Add date"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <CalendarComponent
                        mode="single"
                        selected={project.targetDate ? new Date(project.targetDate) : undefined}
                        onSelect={(date) => {
                          updateProject({ targetDate: date?.toISOString() });
                          setSidebarTargetDatePickerOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Teams */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Teams</span>
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-foreground" />
                    <span className="text-foreground">{getProjectTeam()}</span>
                  </div>
                </div>

                {/* Labels */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Labels</span>
                  <Popover open={sidebarLabelSearchOpen} onOpenChange={setSidebarLabelSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 text-xs text-foreground hover:text-foreground focus-visible:ring-0 gap-1.5">
                        {project.labels && project.labels.length > 0 ? (
                          <>
                            <Tag className="h-3.5 w-3.5" />
                            {`${project.labels.length} label${project.labels.length > 1 ? "s" : ""}`}
                          </>
                        ) : (
                          "Add label"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-0" align="end">
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
                                  if (newLabel) {
                                    const currentLabels = project.labels || [];
                                    if (!currentLabels.includes(newLabel)) {
                                      updateProject({ labels: [...currentLabels, newLabel] });
                                      const storedLabels = JSON.parse(localStorage.getItem("customLabels") || "[]");
                                      if (!storedLabels.includes(newLabel)) {
                                        storedLabels.push(newLabel);
                                        localStorage.setItem("customLabels", JSON.stringify(storedLabels));
                                      }
                                    }
                                    setLabelSearchValue("");
                                    setSidebarLabelSearchOpen(false);
                                  }
                                }}
                                className="cursor-pointer font-medium hover:bg-surface/70 hover:text-foreground"
                              >
                                <Plus className="mr-2 h-4 w-4 text-foreground" />
                                Create "{labelSearchValue.trim()}"
                              </CommandItem>
                            </CommandGroup>
                          )}
                          {project.labels && project.labels.length > 0 && (
                            <CommandGroup>
                              {project.labels.map((label) => (
                                <CommandItem
                                  key={label}
                                  onSelect={() => {
                                    const currentLabels = project.labels || [];
                                    updateProject({ labels: currentLabels.filter(l => l !== label) });
                                  }}
                                  className="cursor-pointer hover:bg-surface/70 hover:text-foreground"
                                >
                                  <div className={cn("w-2 h-2 rounded-full mr-2", getLabelColor(label))}></div>
                                  <span className="flex-1">{label}</span>
                                  <span className="text-xs text-muted-foreground">Remove</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                          {getAllLabels().filter((label) =>
                            label.toLowerCase().includes(labelSearchValue.toLowerCase()) &&
                            !(project.labels || []).includes(label)
                          ).length > 0 && (
                            <CommandGroup>
                              {getAllLabels().filter((label) =>
                                label.toLowerCase().includes(labelSearchValue.toLowerCase()) &&
                                !(project.labels || []).includes(label)
                              ).map((label) => {
                                const labelInfo = defaultLabelsWithColors.find(l => l.name === label);
                                return (
                                  <CommandItem
                                    key={label}
                                    onSelect={() => {
                                      const currentLabels = project.labels || [];
                                      if (!currentLabels.includes(label)) {
                                        updateProject({ labels: [...currentLabels, label] });
                                      }
                                      setLabelSearchValue("");
                                      setSidebarLabelSearchOpen(false);
                                    }}
                                    className="cursor-pointer hover:bg-surface/70 hover:text-foreground"
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
                </div>
              </div>
            )}
          </div>

          {/* Milestones Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Milestones</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-surface/70 hover:text-foreground focus-visible:ring-0">
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-surface/70 hover:text-foreground focus-visible:ring-0"
                  onClick={() => setMilestonesExpanded(!milestonesExpanded)}
                >
                  {milestonesExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
            {milestonesExpanded && (
              <p className="text-xs text-muted-foreground">
                Add milestones to organize work within your project and break it into more granular stages. Learn more
              </p>
            )}
          </div>

          {/* Activity Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Activity</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-6 text-xs hover:bg-surface/70 hover:text-foreground focus-visible:ring-0">
                  See all
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-surface/70 hover:text-foreground focus-visible:ring-0"
                  onClick={() => setActivityExpanded(!activityExpanded)}
                >
                  {activityExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
            {activityExpanded && project.createdAt && (
              <div className="flex items-start gap-3 text-sm">
                <Box className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="whitespace-nowrap">
                  <span className="text-foreground">Lakshya Bagani</span>{" "}
                  <span className="text-muted-foreground">created the project</span>
                  <span className="text-muted-foreground"> · {formatDate(project.createdAt)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

