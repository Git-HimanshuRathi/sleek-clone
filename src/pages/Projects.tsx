import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Link2, 
  LayoutGrid, 
  Filter, 
  SlidersHorizontal,
  Box,
  Plus,
  User,
  Calendar,
  MoreHorizontal,
  Check,
  AlertCircle,
  BarChart3,
  BarChart2,
  BarChart,
  CheckSquare,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { NewProjectModal } from "@/components/NewProjectModal";
import { cn } from "@/lib/utils";
import { useProjects } from "@/hooks/useJiraProjects";

// Custom Filter icon matching Linear design - funnel shape with decreasing widths, left-aligned
const FilterIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
    <line x1="2" y1="5" x2="12" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2" y1="8" x2="9" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2" y1="11" x2="7" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Dashed circle icon component
const DashedCircle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="7"
      cy="7"
      r="6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="2 2"
      fill="none"
    />
  </svg>
);

// Orange circle icon component (hollow - just border with gap)
const OrangeCircle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="7"
      cy="7"
      r="6"
      stroke="#F59E0B"
      strokeWidth="1.5"
      fill="none"
      strokeDasharray="8 3"
      strokeDashoffset="2"
    />
  </svg>
);

interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  health?: string;
  priority?: string;
  status?: string;
  lead?: string;
  targetDate?: string;
  startDate?: string;
  members?: string[];
  labels?: string[];
  milestones?: any[];
}

const defaultPriorityOptions = [
  { value: "No priority", icon: "0", color: "text-muted-foreground", number: 0 },
  { value: "Urgent", icon: AlertCircle, color: "text-red-500", number: 1 },
  { value: "High", icon: BarChart3, color: "text-orange-500", number: 2 },
  { value: "Medium", icon: BarChart2, color: "text-yellow-500", number: 3 },
  { value: "Low", icon: BarChart, color: "text-blue-500", number: 4 },
];

const defaultStatusOptions = [
  { value: "Backlog", icon: OrangeCircle, color: "text-orange-500" },
  { value: "Planned", icon: CheckSquare, color: "text-muted-foreground" },
  { value: "In Progress", icon: PlayCircle, color: "text-yellow-500" },
  { value: "Completed", icon: CheckCircle2, color: "text-primary" },
  { value: "Cancelled", icon: XCircle, color: "text-red-500" },
];

const Projects = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"all" | "new-view">("all");
  const [openPriorityDropdown, setOpenPriorityDropdown] = useState<string | null>(null);
  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(null);
  const [openDatePicker, setOpenDatePicker] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<Record<string, Date | undefined>>({});
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // Get project key from localStorage or use default
  const useApiData = localStorage.getItem("useJiraApi") !== "false"; // Default to true

  // Fetch projects from JIRA API
  const { data: projectsData = [], isLoading, isError, error, refetch } = useProjects({
    enabled: useApiData,
  });

  // Ensure all projects have required fields with defaults
  const projects = projectsData.map((project: any) => {
    // Convert numeric priority to string if needed
    let priority = project.priority;
    if (typeof priority === "number") {
      const priorityMap: Record<number, string> = {
        0: "No priority",
        1: "Urgent",
        2: "High",
        3: "Medium",
        4: "Low",
      };
      priority = priorityMap[priority] || "No priority";
    }

    return {
      ...project,
      priority: priority || "No priority",
      color: project.color || "#5E6AD2",
      icon: project.icon || "📁",
      health: project.health || "No updates",
    };
  });

  const loadProjects = () => {
    refetch();
  };

  // Note: Projects are now automatically stored in localStorage by the useProjects hook

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  const updateProjectPriority = (projectId: string, priority: string) => {
    // Update in localStorage to persist user edits
    const stored = localStorage.getItem("projects");
    if (stored) {
      const parsedProjects = JSON.parse(stored);
      const updatedProjects = parsedProjects.map((project: Project) => 
        project.id === projectId ? { ...project, priority } : project
      );
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
      // Trigger refetch to update UI
      refetch();
    }
    setOpenPriorityDropdown(null);
  };

  const updateProjectStatus = (projectId: string, status: string) => {
    // Update in localStorage to persist user edits
    const stored = localStorage.getItem("projects");
    if (stored) {
      const parsedProjects = JSON.parse(stored);
      const updatedProjects = parsedProjects.map((project: Project) => 
        project.id === projectId ? { ...project, status } : project
      );
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
      // Trigger refetch to update UI
      refetch();
    }
    setOpenStatusDropdown(null);
  };

  const updateProjectDate = (projectId: string, date: Date | undefined) => {
    setSelectedDates(prev => ({ ...prev, [projectId]: date }));
    if (date) {
      const stored = localStorage.getItem("projects");
      if (stored) {
        const parsedProjects = JSON.parse(stored);
        const updatedProjects = parsedProjects.map((project: Project) => 
          project.id === projectId ? { ...project, targetDate: date.toISOString().split('T')[0] } : project
        );
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
        // Trigger refetch to update UI
        refetch();
      }
    }
    setOpenDatePicker(null);
  };

  const getPriorityDisplay = (priority?: string) => {
    if (!priority || priority === "No priority") return "";
    return priority;
  };

  const getAllPriorities = () => {
    const customPriorities = JSON.parse(localStorage.getItem("customPriorities") || "[]");
    return [...defaultPriorityOptions, ...customPriorities];
  };

  const getAllStatuses = () => {
    const customStatuses = JSON.parse(localStorage.getItem("customStatuses") || "[]");
    return [...defaultStatusOptions, ...customStatuses];
  };

  return (
    <div className="h-full flex flex-col bg-background" style={{ marginTop: "-20px" }}>
      {/* Top Navigation Bar with Tabs */}
      <div className="border-b border-border px-5" style={{ paddingTop: "8px", paddingBottom: "8px" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-1">
              {/* Projects - Just text, not clickable, more prominent */}
              <span className="text-sm font-semibold text-foreground">Projects</span>
              
              {/* All projects - Button, no navigation */}
              <button
                onClick={() => setActiveView("all")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors",
                  activeView === "all"
                    ? "text-foreground"
                    : "text-[#E4E5E8] hover:text-foreground"
                )}
                style={{
                  borderRadius: "10px",
                  backgroundColor: activeView === "all" ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.04)",
                }}
                onMouseEnter={(e) => {
                  if (activeView !== "all") {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeView !== "all") {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
                  }
                }}
              >
                <Box className="w-3.5 h-3.5" />
                All projects
              </button>
              
              {/* New view - Button */}
              <button
                onClick={() => setActiveView("new-view")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors",
                  activeView === "new-view"
                    ? "bg-surface text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface/30"
                )}
              >
                <Plus className="w-3.5 h-3.5" />
                New view
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
              <Link2 className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              className="h-7 px-2.5 text-xs text-foreground hover:text-foreground hover:bg-surface/30"
              onClick={() => setIsNewProjectModalOpen(true)}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add project
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filter and Display Bar */}
      <div className="border-b flex items-center justify-between px-5 py-2" style={{ borderColor: "#1A1C1E" }}>
        <button
          className="flex items-center gap-1.5 h-7 px-2 rounded-md transition-colors"
          style={{
            background: "transparent",
            color: "#EDEDED",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1A1C1E";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <FilterIcon className="w-3.5 h-3.5" />
          <span className="text-xs">Filter</span>
        </button>
        <button
          className="flex items-center gap-1.5 h-7 px-2.5 rounded-md transition-colors"
          style={{
            background: "#232527",
            color: "#EDEDED",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2B2D2F";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#232527";
          }}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="text-xs">Display</span>
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading projects from Apache JIRA...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 max-w-md text-center">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Failed to load projects</p>
              <p className="text-xs text-muted-foreground">{error?.message || "Unknown error occurred"}</p>
            </div>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Project Table */}
      {!isLoading && !isError && (
        <div className="flex-1 overflow-y-auto">
          {projects.length > 0 ? (
          <div className="px-5 py-3">
            <table className="w-full border-collapse table-fixed">
              <colgroup>
                <col style={{ width: "auto" }} />
                <col style={{ width: "150px" }} />
                <col style={{ width: "95px" }} />
                <col style={{ width: "125px" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "100px" }} />
              </colgroup>
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2.5 px-4 text-xs font-medium text-foreground">Name</th>
                  <th className="text-right py-2.5 px-0 text-xs font-medium text-foreground whitespace-nowrap">Health</th>
                  <th className="text-right py-2.5 px-0 text-xs font-medium text-foreground whitespace-nowrap">Priority</th>
                  <th className="text-right py-2.5 px-0 text-xs font-medium text-foreground whitespace-nowrap">Lead</th>
                  <th className="text-right py-2.5 px-0 text-xs font-medium text-foreground whitespace-nowrap">Target date</th>
                  <th className="text-right py-2.5 pl-0 pr-1 text-xs font-medium text-foreground whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => {
                  const targetDateFormatted = formatDate(project.targetDate);
                  const selectedDate = selectedDates[project.id] || (project.targetDate ? new Date(project.targetDate) : undefined);
                  
                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-surface/50 transition-colors"
                    >
                      {/* Name - Takes most space, no icon */}
                      <td className="py-2.5 px-4">
                        <button
                          onClick={() => navigate(`/projects/${project.id}`)}
                          className="text-xs text-foreground hover:text-foreground hover:underline cursor-pointer text-left"
                        >
                          {project.name}
                        </button>
                      </td>
                      
                      {/* Health - Compact */}
                      <td className="py-2.5 px-0">
                        <div className="flex items-center justify-end gap-0.5">
                          <DashedCircle className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                            {project.health || "No updates"}
                          </span>
                        </div>
                      </td>
                      
                      {/* Priority - Compact with dropdown */}
                      <td className="py-2.5 px-0">
                        <div className="flex justify-end">
                          <DropdownMenu 
                            open={openPriorityDropdown === project.id} 
                            onOpenChange={(open) => setOpenPriorityDropdown(open ? project.id : null)}
                          >
                            <DropdownMenuTrigger asChild>
                              <button className="flex items-center text-[11px] text-muted-foreground hover:text-foreground border-0 bg-transparent p-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                                {project.priority && project.priority !== "No priority" ? (
                                  (() => {
                                    const selectedPriority = getAllPriorities().find(p => p.value === project.priority);
                                    if (selectedPriority && typeof selectedPriority.icon !== "string") {
                                      const PriorityIcon = selectedPriority.icon;
                                      return (
                                        <PriorityIcon className={cn("h-3 w-3 flex-shrink-0", selectedPriority.color)} />
                                      );
                                    }
                                    return <MoreHorizontal className="h-3 w-3" />;
                                  })()
                                ) : (
                                  <MoreHorizontal className="h-3 w-3" />
                                )}
                              </button>
                            </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-[280px]">
                            <div className="px-2 py-1.5 text-xs text-muted-foreground border-b border-border">
                              Change priority...
                              <span className="ml-2 text-[10px]">then P</span>
                            </div>
                            {getAllPriorities().map((option) => {
                              const IconComponent = typeof option.icon === "string" ? null : option.icon;
                              const isSelected = project.priority === option.value;
                              
                              return (
                                <DropdownMenuItem
                                  key={option.value}
                                  onClick={() => updateProjectPriority(project.id, option.value)}
                                  className={cn(
                                    "gap-3 px-3 py-2 cursor-pointer",
                                    isSelected && "bg-accent text-accent-foreground"
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
                                  {isSelected && (
                                    <Check className="h-4 w-4 text-primary" />
                                  )}
                                  <span className="text-xs text-muted-foreground ml-2">{option.number}</span>
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                      
                      {/* Lead - Compact */}
                      <td className="py-2.5 px-0">
                        <div className="flex items-center justify-end gap-0.5">
                          {project.lead && typeof project.lead === "string" ? (
                            <>
                              <div className="w-3.5 h-3.5 rounded bg-primary flex items-center justify-center text-[9px] font-medium text-primary-foreground flex-shrink-0">
                                {project.lead.split(" ").map(n => n[0]).join("").slice(0, 2)}
                              </div>
                              <span className="text-[11px] text-foreground whitespace-nowrap">{project.lead}</span>
                            </>
                          ) : (
                            <>
                              <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <span className="text-[11px] text-muted-foreground whitespace-nowrap">No lead</span>
                            </>
                          )}
                        </div>
                      </td>
                      
                      {/* Target date - Compact with date picker */}
                      <td className="py-2.5 px-0">
                        <div className="flex justify-end">
                          <Popover 
                            open={openDatePicker === project.id} 
                            onOpenChange={(open) => setOpenDatePicker(open ? project.id : null)}
                          >
                            <PopoverTrigger asChild>
                              <button className="flex items-center text-[11px] text-muted-foreground hover:text-foreground border-0 bg-transparent p-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                                {targetDateFormatted ? (
                                  <span>{targetDateFormatted}</span>
                                ) : (
                                  <Calendar className="h-3 w-3" />
                                )}
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => updateProjectDate(project.id, date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </td>
                      
                      {/* Status - Compact with dropdown */}
                      <td className="py-2.5 pl-0 pr-1">
                        <div className="flex justify-end">
                          <DropdownMenu 
                            open={openStatusDropdown === project.id} 
                            onOpenChange={(open) => setOpenStatusDropdown(open ? project.id : null)}
                          >
                            <DropdownMenuTrigger asChild>
                              <button className="flex items-center gap-0.5 text-[11px] text-muted-foreground hover:text-foreground border-0 bg-transparent p-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                              {project.status ? (
                                (() => {
                                  const selectedStatus = getAllStatuses().find(s => s.value === project.status);
                                  const StatusIcon = selectedStatus?.icon || DashedCircle;
                                  return (
                                    <StatusIcon className={cn("h-3 w-3 flex-shrink-0", selectedStatus?.color)} />
                                  );
                                })()
                              ) : (
                                <>
                                  <DashedCircle className="h-3 w-3 flex-shrink-0" />
                                  <span className="whitespace-nowrap text-[11px]">0%</span>
                                </>
                              )}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-[280px]">
                            <div className="px-2 py-1.5 text-xs text-muted-foreground border-b border-border">
                              Change status...
                              <span className="ml-2 text-[10px]">then S</span>
                            </div>
                            {getAllStatuses().map((option) => {
                              const IconComponent = option.icon;
                              const isSelected = project.status === option.value;
                              
                              return (
                                <DropdownMenuItem
                                  key={option.value}
                                  onClick={() => updateProjectStatus(project.id, option.value)}
                                  className={cn(
                                    "gap-3 px-3 py-2 cursor-pointer flex items-center",
                                    isSelected && "bg-accent text-accent-foreground"
                                  )}
                                >
                                  <IconComponent className={cn("h-4 w-4", option.color)} />
                                  {!isSelected && <span className="flex-1">{option.value}</span>}
                                  {isSelected && (
                                    <Check className="h-4 w-4 text-primary ml-auto" />
                                  )}
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 max-w-md text-center">
              <Box className="w-16 h-16 text-muted-foreground/40" />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">No projects yet</h2>
                <p className="text-muted-foreground text-sm">
                  Projects help you organize and track related issues. Create your first project to get started.
                </p>
              </div>
              <Button 
                className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => setIsNewProjectModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create project
              </Button>
            </div>
          </div>
        )}
        </div>
      )}

      <NewProjectModal
        open={isNewProjectModalOpen}
        onOpenChange={setIsNewProjectModalOpen}
        onProjectCreated={loadProjects}
      />
    </div>
  );
};

export default Projects;
