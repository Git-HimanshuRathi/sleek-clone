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
  Inbox,
  CheckSquare,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowUpDown,
  Sun,
  GripVertical,
  ChevronDown as ChevronDownIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

// List icon - three horizontal lines
const ListIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="3" y1="5" x2="13" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="3" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="3" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Board icon - 2x2 grid of squares
const BoardIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.5" fill="none" rx="0.5" />
    <rect x="9" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.5" fill="none" rx="0.5" />
    <rect x="2" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.5" fill="none" rx="0.5" />
    <rect x="9" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.5" fill="none" rx="0.5" />
  </svg>
);

// Timeline icon - two vertical lines with horizontal line and dots
const TimelineIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="4" y1="3" x2="4" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="3" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="4" cy="8" r="1.5" fill="currentColor" />
    <circle cx="12" cy="8" r="1.5" fill="currentColor" />
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
  const [displayPopoverOpen, setDisplayPopoverOpen] = useState(false);
  const [selectedView, setSelectedView] = useState<"list" | "board" | "timeline">("list");
  const [grouping, setGrouping] = useState("No grouping");
  const [ordering, setOrdering] = useState("Manual");
  const [showClosedProjects, setShowClosedProjects] = useState("All");
  const [displayProperties, setDisplayProperties] = useState<Set<string>>(new Set([
    "Milestones",
    "Priority",
    "Status",
    "Health",
    "Lead",
    "Target date"
  ]));
  const [timelineYear, setTimelineYear] = useState("2026");

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

  // Group projects by status for board view
  const getProjectsByStatus = () => {
    const statusMap: Record<string, Project[]> = {
      "Backlog": [],
      "Planned": [],
      "In Progress": [],
      "Completed": [],
      "Cancelled": [],
    };
    
    projects.forEach((project) => {
      const status = project.status || "Backlog";
      if (statusMap[status]) {
        statusMap[status].push(project);
      } else {
        statusMap["Backlog"].push(project);
      }
    });
    
    return statusMap;
  };

  // Render Board View
  const renderBoardView = () => {
    const projectsByStatus = getProjectsByStatus();
    const boardColumns = [
      { key: "Backlog", icon: Sun, color: "#F59E0B" },
      { key: "Planned", icon: CheckSquare, color: "#9B9CA0" },
      { key: "In Progress", icon: PlayCircle, color: "#60A5FA" },
      { key: "Completed", icon: CheckCircle2, color: "#5E6AD2" },
    ];

    return (
      <div className="flex-1 overflow-x-auto px-5 py-4">
        <div className="flex gap-4 h-full">
          {boardColumns.map((column) => {
            const columnProjects = projectsByStatus[column.key] || [];
            const ColumnIcon = column.icon;
            
            return (
              <div 
                key={column.key} 
                className="flex-shrink-0 w-72 flex flex-col"
                style={{ backgroundColor: "#0B0B0D" }}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between py-2 px-3 mb-2">
                  <div className="flex items-center gap-2">
                    <ColumnIcon className="w-4 h-4" style={{ color: column.color }} />
                    <span className="text-xs font-medium text-[#FFFFFF]">{column.key}</span>
                    <span className="text-xs text-[#9B9CA0]">{columnProjects.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-[#1A1C1E] rounded">
                      <MoreHorizontal className="w-4 h-4 text-[#9B9CA0]" />
                    </button>
                    <button className="p-1 hover:bg-[#1A1C1E] rounded">
                      <Plus className="w-4 h-4 text-[#9B9CA0]" />
                    </button>
                  </div>
                </div>

                {/* Project Cards */}
                <div className="flex-1 overflow-y-auto space-y-2">
                  {columnProjects.map((project) => {
                    const priorityIcon = project.priority && project.priority !== "No priority" 
                      ? getAllPriorities().find(p => p.value === project.priority)?.icon 
                      : null;
                    const PriorityIconComponent = typeof priorityIcon === "function" ? priorityIcon : null;
                    const milestoneDate = project.targetDate ? formatDate(project.targetDate) : null;
                    
                    return (
                      <div
                        key={project.id}
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="p-3 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ 
                          backgroundColor: "#1A1C1E",
                          border: "1px solid #2A2A2A"
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-medium text-[#FFFFFF] flex-1">
                            {project.name}
                          </h4>
                          <div className="flex items-center gap-1 ml-2">
                            {/* Health indicator - green wavy line */}
                            <svg className="w-4 h-4" viewBox="0 0 16 4" fill="none">
                              <path d="M0 3C2 1 4 3 6 1C8 3 10 1 12 3C14 1 16 3 16 3" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            {/* Priority - yellow circle */}
                            {PriorityIconComponent && (
                              <PriorityIconComponent className="w-3.5 h-3.5 text-yellow-500" />
                            )}
                            {/* Bar chart */}
                            <BarChart2 className="w-3.5 h-3.5 text-[#9B9CA0]" />
                            {/* Lead avatar */}
                            {project.lead && (
                              <div className="w-3.5 h-3.5 rounded-full bg-orange-500 flex items-center justify-center text-[9px] text-white">
                                {project.lead.split(" ").map(n => n[0]).join("").slice(0, 1)}
                              </div>
                            )}
                          </div>
                        </div>
                        {milestoneDate && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                              <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="#9B9CA0"/>
                            </svg>
                            <span className="text-xs text-[#9B9CA0]">Basic UI Creation {milestoneDate}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Timeline View
  const renderTimelineView = () => {
    // Define the exact timeline structure - each date gets its own column
    const timelineDates = [
      { month: "DEC", year: 2024, date: 25 },
      { month: "DEC", year: 2024, date: 9 },
      { month: "DEC", year: 2024, date: 23 },
      { month: "JAN", year: 2025, date: 6, showYear: true },
      { month: "JAN", year: 2025, date: 20 },
      { month: "FEB", year: 2025, date: 3 },
      { month: "FEB", year: 2025, date: 17 },
      { month: "MAR", year: 2025, date: 3 },
      { month: "MAR", year: 2025, date: 17 },
      { month: "MAR", year: 2025, date: 31 },
      { month: "APR", year: 2025, date: 14 },
      { month: "APR", year: 2025, date: 28 },
      { month: "MAY", year: 2025, date: 12 },
      { month: "MAY", year: 2025, date: 26 },
      { month: "JUN", year: 2025, date: 9 },
      { month: "JUN", year: 2025, date: 23 },
      { month: "JUL", year: 2025, date: 7 },
      { month: "JUL", year: 2025, date: 21 },
      { month: "AUG", year: 2025, date: 4 },
      { month: "AUG", year: 2025, date: 18 },
      { month: "SEP", year: 2025, date: 1 },
      { month: "SEP", year: 2025, date: 15 },
      { month: "SEP", year: 2025, date: 29 },
      { month: "OCT", year: 2025, date: 13 },
      { month: "NOV", year: 2025, date: 3, isCurrent: true }, // Current date - NOV 3
      { month: "NOV", year: 2025, date: 24 },
      { month: "DEC", year: 2025, date: 8 },
      { month: "DEC", year: 2025, date: 22 },
      { month: "JAN", year: 2026, date: 5, showYear: true },
      { month: "JAN", year: 2026, date: 19 },
      { month: "FEB", year: 2026, date: 2 },
      { month: "FEB", year: 2026, date: 16 },
      { month: "MAR", year: 2026, date: 2 },
      { month: "MAR", year: 2026, date: 16 },
      { month: "MAR", year: 2026, date: 30 },
      { month: "APR", year: 2026, date: 13 },
      { month: "APR", year: 2026, date: 27 },
      { month: "MAY", year: 2026, date: 11 },
      { month: "MAY", year: 2026, date: 25 },
      { month: "JUN", year: 2026, date: 8 },
      { month: "JUN", year: 2026, date: 25 },
    ];

    // Find the index of the current date (NOV 3)
    const currentDateIndex = timelineDates.findIndex(d => d.isCurrent);

    return (
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: "#0B0B0D" }}>
        {/* Main Content Area - Full Height */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Project List */}
          <div className="w-64 flex-shrink-0 border-r flex flex-col" style={{ borderColor: "#1A1C1E" }}>
            {/* Project Items */}
            <div className="flex-1 p-2 overflow-y-auto">
              {/* Main Project */}
              <div className="flex items-center gap-2 px-2 py-1 mb-1">
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                    <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="#9B9CA0"/>
                  </svg>
                  <svg className="w-3 h-3" viewBox="0 0 16 4" fill="none">
                    <path d="M0 3C2 1 4 3 6 1C8 3 10 1 12 3C14 1 16 3 16 3" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <BarChart2 className="w-3 h-3 text-[#9B9CA0]" />
                </div>
                <span className="text-xs text-[#FFFFFF]">Create Linear Clo...</span>
              </div>
              {/* Sub-item with indentation */}
              <div className="flex items-center gap-2 px-2 py-1 mb-1 ml-4">
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                  <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="#EF4444"/>
                </svg>
                <span className="text-xs text-[#FFFFFF]">Basic UI Creation</span>
              </div>
            </div>
          </div>

          {/* Right Side - Timeline Columns (Full Height) */}
          <div className="flex-1 overflow-x-auto relative" style={{ height: "100%" }}>
            {/* Timeline Columns Container - Full Height */}
            <div className="flex h-full" style={{ minWidth: "max-content" }}>
              {timelineDates.map((dateItem, idx) => {
                const isCurrent = dateItem.isCurrent || false;
                const columnWidth = 60; // Width of each date column
                
                return (
                  <div
                    key={idx}
                    className="flex-shrink-0 border-r relative h-full flex flex-col"
                    style={{
                      width: `${columnWidth}px`,
                      borderColor: "#1A1C1E",
                      backgroundColor: isCurrent ? "rgba(94, 106, 210, 0.05)" : "transparent",
                    }}
                  >
                    {/* Blue line marker for current date - extends full height */}
                    {isCurrent && (
                      <div
                        className="absolute top-0 bottom-0 left-0 pointer-events-none z-20"
                        style={{
                          borderLeft: "2px solid #5E6AD2",
                          height: "100%",
                        }}
                      />
                    )}

                    {/* Grid line - vertical dashed line on the right - extends full height */}
                    <div
                      className="absolute top-0 bottom-0 right-0 pointer-events-none"
                      style={{
                        borderRight: "1px dashed #1A1C1E",
                        opacity: 0.4,
                        height: "100%",
                      }}
                    />

                    {/* Date Header - Sticky at Top */}
                    <div className="sticky top-0 z-10 border-b px-2 py-1" style={{ backgroundColor: "#0B0B0D", borderColor: "#1A1C1E" }}>
                      <div className="text-center">
                        {dateItem.showYear ? (
                          <div className="text-xs font-medium text-[#FFFFFF]">{dateItem.month} {dateItem.year}</div>
                        ) : (
                          <div className="text-xs font-medium text-[#FFFFFF]">{dateItem.month}</div>
                        )}
                        <div
                          className={cn(
                            "text-[10px] mt-0.5 py-0.5 rounded",
                            isCurrent
                              ? "bg-[#5E6AD2] text-white px-1"
                              : "text-[#9B9CA0]"
                          )}
                        >
                          {isCurrent ? `${dateItem.month} ${dateItem.date}` : dateItem.date}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Project Bars - positioned over the timeline columns */}
            <div className="absolute inset-0 pointer-events-none" style={{ paddingBottom: "50px" }}>
              {/* Main project bar - Create Linear Clone-Hackathon */}
              {/* Starts around mid-October (OCT 13) and extends to mid-November (around NOV 3) */}
              <div
                className="absolute pointer-events-auto"
                style={{
                  top: "10px",
                  left: `${23 * 60 + 30}px`, // Start at OCT 13 (index 23) + offset
                  width: `${1.5 * 60}px`, // Extends ~1.5 columns
                  height: "24px",
                  backgroundColor: "#2A2A2A",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/projects/${projects[0]?.id || ""}`)}
              >
                <svg className="w-3 h-3 mr-1 flex-shrink-0" viewBox="0 0 12 12" fill="none">
                  <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="#9B9CA0"/>
                </svg>
                <span className="text-[10px] text-[#FFFFFF] whitespace-nowrap overflow-hidden">
                  Create Linear Clone-Hackathon
                </span>
              </div>

              {/* Sub-item bar - Basic UI Creation */}
              {/* Starts around early November (NOV 3) and extends a bit past it */}
              <div
                className="absolute pointer-events-auto"
                style={{
                  top: "40px",
                  left: `${24 * 60 + 10}px`, // Start at NOV 3 (index 24, current date)
                  width: `${0.8 * 60}px`, // Extends about 0.8 columns
                  height: "24px",
                  backgroundColor: "#2A2A2A",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/projects/${projects[0]?.id || ""}`)}
              >
                <svg className="w-3 h-3 mr-1 flex-shrink-0" viewBox="0 0 12 12" fill="none">
                  <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="#9B9CA0"/>
                </svg>
                <span className="text-[10px] text-[#FFFFFF] whitespace-nowrap overflow-hidden">
                  Basic UI Creation
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top Navigation Bar with Tabs */}
      <div className="border-b border-border px-5 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-1">
              {/* Projects - Just text, not clickable, more prominent */}
              <span className="text-sm font-semibold text-foreground">Projects</span>
              
              {/* All projects - Button, no navigation */}
              <button
                onClick={() => setActiveView("all")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors",
                  activeView === "all"
                    ? "bg-surface text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface/30"
                )}
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
            {selectedView === "timeline" && (
              <>
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
                <div className="h-4 w-px bg-border mx-1" />
                <Button 
                  variant="ghost" 
                  className="h-7 px-2.5 text-xs text-foreground hover:text-foreground hover:bg-surface/30"
                >
                  Today
                </Button>
                <Select value={timelineYear} onValueChange={setTimelineYear}>
                  <SelectTrigger 
                    className="h-7 px-2.5 text-xs border-none bg-transparent hover:bg-surface/30"
                  >
                    <SelectValue />
                    <ChevronDownIcon className="h-3.5 w-3.5 ml-1" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2027">2027</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
            {selectedView !== "timeline" && (
              <>
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
              </>
            )}
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
        <Popover open={displayPopoverOpen} onOpenChange={setDisplayPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              className="flex items-center gap-1.5 h-7 px-2.5 rounded-md transition-colors"
              style={{
                background: displayPopoverOpen ? "#2B2D2F" : "#232527",
                color: "#EDEDED",
              }}
              onMouseEnter={(e) => {
                if (!displayPopoverOpen) {
                  e.currentTarget.style.background = "#2B2D2F";
                }
              }}
              onMouseLeave={(e) => {
                if (!displayPopoverOpen) {
                  e.currentTarget.style.background = "#232527";
                }
              }}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="text-xs">Display</span>
            </button>
          </PopoverTrigger>
          <PopoverContent 
            align="end" 
            className="w-80 p-0 rounded-lg border shadow-lg"
            style={{ 
              backgroundColor: "#1F1F1F",
              borderColor: "#2A2A2A",
            }}
            sideOffset={8}
          >
            <div className="p-4">
              {/* View Selector Tabs */}
              <div className="flex gap-1 mb-4" style={{ backgroundColor: "#2A2A2A", padding: "2px", borderRadius: "6px" }}>
                <button
                  onClick={() => setSelectedView("list")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-colors",
                    selectedView === "list" 
                      ? "" 
                      : ""
                  )}
                  style={{
                    backgroundColor: selectedView === "list" ? "#3A3A3A" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedView !== "list") {
                      e.currentTarget.style.backgroundColor = "#333333";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedView !== "list") {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <ListIcon 
                    className="w-3.5 h-3.5" 
                    style={{ color: selectedView === "list" ? "#FFFFFF" : "#9B9CA0" }}
                  />
                  <span 
                    className="text-xs font-medium"
                    style={{ color: selectedView === "list" ? "#FFFFFF" : "#9B9CA0" }}
                  >
                    List
                  </span>
                </button>
                <button
                  onClick={() => setSelectedView("board")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-colors"
                  )}
                  style={{
                    backgroundColor: selectedView === "board" ? "#3A3A3A" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedView !== "board") {
                      e.currentTarget.style.backgroundColor = "#333333";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedView !== "board") {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <BoardIcon 
                    className="w-3.5 h-3.5" 
                    style={{ color: selectedView === "board" ? "#FFFFFF" : "#9B9CA0" }}
                  />
                  <span 
                    className="text-xs font-medium"
                    style={{ color: selectedView === "board" ? "#FFFFFF" : "#9B9CA0" }}
                  >
                    Board
                  </span>
                </button>
                <button
                  onClick={() => setSelectedView("timeline")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-colors"
                  )}
                  style={{
                    backgroundColor: selectedView === "timeline" ? "#3A3A3A" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedView !== "timeline") {
                      e.currentTarget.style.backgroundColor = "#333333";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedView !== "timeline") {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <TimelineIcon 
                    className="w-3.5 h-3.5" 
                    style={{ color: selectedView === "timeline" ? "#FFFFFF" : "#9B9CA0" }}
                  />
                  <span 
                    className="text-xs font-medium"
                    style={{ color: selectedView === "timeline" ? "#FFFFFF" : "#9B9CA0" }}
                  >
                    Timeline
                  </span>
                </button>
              </div>

              {/* Grouping */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ListIcon className="w-3.5 h-3.5" style={{ color: "#9B9CA0" }} />
                  <span className="text-xs" style={{ color: "#9B9CA0" }}>Grouping</span>
                </div>
                <Select value={grouping} onValueChange={setGrouping}>
                  <SelectTrigger 
                    className="w-32 h-7 border text-xs px-2"
                    style={{ 
                      backgroundColor: "#2A2A2A", 
                      color: "#FFFFFF",
                      borderColor: "#333333"
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent 
                    className="border"
                    style={{ 
                      backgroundColor: "#2A2A2A",
                      borderColor: "#333333"
                    }}
                  >
                    <SelectItem 
                      value="No grouping"
                      style={{ color: "#FFFFFF" }}
                      className="hover:bg-[#333333] focus:bg-[#333333]"
                    >
                      No grouping
                    </SelectItem>
                    <SelectItem 
                      value="Status"
                      style={{ color: "#FFFFFF" }}
                      className="hover:bg-[#333333] focus:bg-[#333333]"
                    >
                      Status
                    </SelectItem>
                    <SelectItem 
                      value="Priority"
                      style={{ color: "#FFFFFF" }}
                      className="hover:bg-[#333333] focus:bg-[#333333]"
                    >
                      Priority
                    </SelectItem>
                    <SelectItem 
                      value="Lead"
                      style={{ color: "#FFFFFF" }}
                      className="hover:bg-[#333333] focus:bg-[#333333]"
                    >
                      Lead
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ordering */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5" style={{ color: "#9B9CA0" }} />
                  <span className="text-xs" style={{ color: "#9B9CA0" }}>Ordering</span>
                </div>
                <Select value={ordering} onValueChange={setOrdering}>
                  <SelectTrigger 
                    className="w-32 h-7 border text-xs px-2"
                    style={{ 
                      backgroundColor: "#2A2A2A", 
                      color: "#FFFFFF",
                      borderColor: "#333333"
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent 
                    className="border"
                    style={{ 
                      backgroundColor: "#2A2A2A",
                      borderColor: "#333333"
                    }}
                  >
                    <SelectItem 
                      value="Manual"
                      style={{ color: "#FFFFFF" }}
                      className="hover:bg-[#333333] focus:bg-[#333333]"
                    >
                      Manual
                    </SelectItem>
                    <SelectItem 
                      value="Name"
                      style={{ color: "#FFFFFF" }}
                      className="hover:bg-[#333333] focus:bg-[#333333]"
                    >
                      Name
                    </SelectItem>
                    <SelectItem 
                      value="Priority"
                      style={{ color: "#FFFFFF" }}
                      className="hover:bg-[#333333] focus:bg-[#333333]"
                    >
                      Priority
                    </SelectItem>
                    <SelectItem 
                      value="Status"
                      style={{ color: "#FFFFFF" }}
                      className="hover:bg-[#333333] focus:bg-[#333333]"
                    >
                      Status
                    </SelectItem>
                    <SelectItem 
                      value="Updated"
                      style={{ color: "#FFFFFF" }}
                      className="hover:bg-[#333333] focus:bg-[#333333]"
                    >
                      Updated
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Show Closed Projects */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs" style={{ color: "#9B9CA0" }}>Show closed projects</span>
                <Select value={showClosedProjects} onValueChange={setShowClosedProjects}>
                  <SelectTrigger 
                    className="w-32 h-7 border text-xs px-2"
                    style={{ 
                      backgroundColor: "#2A2A2A", 
                      color: "#FFFFFF",
                      borderColor: "#333333"
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent 
                    className="border"
                    style={{ 
                      backgroundColor: "#2A2A2A",
                      borderColor: "#333333"
                    }}
                  >
                    <SelectItem 
                      value="All"
                      style={{ color: "#FFFFFF" }}
                      className="hover:bg-[#333333] focus:bg-[#333333]"
                    >
                      All
                    </SelectItem>
                    <SelectItem 
                      value="Active only"
                      style={{ color: "#FFFFFF" }}
                      className="hover:bg-[#333333] focus:bg-[#333333]"
                    >
                      Active only
                    </SelectItem>
                    <SelectItem 
                      value="Closed only"
                      style={{ color: "#FFFFFF" }}
                      className="hover:bg-[#333333] focus:bg-[#333333]"
                    >
                      Closed only
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* List Options */}
              <div className="mb-3">
                <h3 className="text-xs font-medium mb-1" style={{ color: "#FFFFFF" }}>List options</h3>
                <p className="text-xs mb-3" style={{ color: "#9B9CA0" }}>Display properties</p>
                
                {/* Display Properties Grid */}
                <div className="flex flex-wrap gap-2">
                  {[
                    "Milestones",
                    "Priority",
                    "Status",
                    "Health",
                    "Lead",
                    "Target date",
                    "Teams",
                    "Members",
                    "Dependencies",
                    "Start date",
                    "Created",
                    "Updated",
                    "Completed",
                    "Labels"
                  ].map((property) => {
                    const isSelected = displayProperties.has(property);
                    return (
                      <button
                        key={property}
                        onClick={() => {
                          const newSet = new Set(displayProperties);
                          if (isSelected) {
                            newSet.delete(property);
                          } else {
                            newSet.add(property);
                          }
                          setDisplayProperties(newSet);
                        }}
                        className={cn(
                          "px-2 py-1 rounded text-xs font-medium transition-colors",
                          isSelected 
                            ? "text-[#FFFFFF]" 
                            : "text-[#9B9CA0]"
                        )}
                        style={{
                          backgroundColor: isSelected ? "#3A3A3A" : "#2A2A2A"
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = "#333333";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = "#2A2A2A";
                          }
                        }}
                      >
                        {property}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add Label Group Button */}
              <button
                className="w-full mt-2 py-1.5 rounded text-xs font-medium transition-colors border"
                style={{ 
                  backgroundColor: "transparent",
                  borderColor: "#9B9CA0",
                  color: "#9B9CA0"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#2A2A2A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Add label group...
              </button>
            </div>
          </PopoverContent>
        </Popover>
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

      {/* Project Views */}
      {!isLoading && !isError && (
        <>
          {selectedView === "board" && renderBoardView()}
          {selectedView === "timeline" && renderTimelineView()}
          {selectedView === "list" && (
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
        </>
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
