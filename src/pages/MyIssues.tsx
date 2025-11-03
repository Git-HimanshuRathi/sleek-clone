import { useState, useEffect, useRef } from "react";
import { NavLink, useParams, useLocation, useNavigate } from "react-router-dom";
import { Filter, SlidersHorizontal, CircleDot, ChevronDown, LayoutGrid, Loader2, Minus, Circle, AlertCircle, MoreHorizontal, BarChart3, BarChart2, BarChart, CheckSquare, PlayCircle, CheckCircle2, XCircle, Check, List, Columns, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { NewIssueModal, Issue } from "@/components/NewIssueModal";
import { Avatar } from "@/components/Avatar";
import { useIssues } from "@/hooks/useJiraIssues";
import { db } from "@/db/database";
import { useDatabase } from "@/hooks/useDatabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const tabs = [
  { name: "My issues", href: "/my-issues" },
  { name: "Assigned", href: "/my-issues/assigned" },
  { name: "Created", href: "/my-issues/created" },
  { name: "Subscribed", href: "/my-issues/subscribed" },
  { name: "Activity", href: "/my-issues/activity" },
];

// Custom Filter icon matching Linear design - funnel shape with decreasing widths, left-aligned
const FilterIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
    <line x1="2" y1="5" x2="12" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2" y1="8" x2="9" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2" y1="11" x2="7" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Dashed circle icon component (hollow - just border with gap)
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

const defaultPriorityOptions = [
  { value: "No priority", icon: "0", color: "text-muted-foreground", number: 0 },
  { value: "Urgent", icon: AlertCircle, color: "text-red-500", number: 1 },
  { value: "High", icon: BarChart3, color: "text-orange-500", number: 2 },
  { value: "Medium", icon: BarChart2, color: "text-yellow-500", number: 3 },
  { value: "Low", icon: BarChart, color: "text-blue-500", number: 4 },
];

const defaultStatusOptions = [
  { value: "Backlog", icon: OrangeCircle, color: "text-orange-500" },
  { value: "Todo", icon: DashedCircle, color: "text-muted-foreground" },
  { value: "In Progress", icon: PlayCircle, color: "text-yellow-500" },
  { value: "Done", icon: CheckCircle2, color: "text-muted-foreground" },
  { value: "Cancelled", icon: XCircle, color: "text-red-500" },
];

const MyIssues = () => {
  const { tab } = useParams<{ tab?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [isNewIssueModalOpen, setIsNewIssueModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Backlog: true,
    Todo: true,
    "In Progress": true,
    Done: true,
    Cancelled: true,
    Duplicate: true,
  });
  const [openPriorityDropdown, setOpenPriorityDropdown] = useState<string | null>(null);
  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(null);
  const [issuePriorities, setIssuePriorities] = useState<Record<string, string>>({});
  const [issueStatuses, setIssueStatuses] = useState<Record<string, string>>({});
  const [checkedIssues, setCheckedIssues] = useState<Record<string, boolean>>({});
  const issuesContainerRef = useRef<HTMLDivElement>(null);
  const [viewType, setViewType] = useState<"list" | "board">("list");
  const [displayMenuOpen, setDisplayMenuOpen] = useState(false);
  const [columns, setColumns] = useState("Status");
  const [grouping, setGrouping] = useState("No grouping");
  const [ordering, setOrdering] = useState("Created");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [completedIssues, setCompletedIssues] = useState("All");
  const [showSubIssues, setShowSubIssues] = useState(true);
  const [showEmptyColumns, setShowEmptyColumns] = useState(false);
  const [displayProperties, setDisplayProperties] = useState({
    id: true,
    status: true,
    assignee: true,
    priority: true,
    dueDate: false,
    project: false,
    milestone: false,
    cycle: false,
    labels: false,
    links: false,
  });

  const { isReady } = useDatabase();
  
  // Get project key from database or use default
  const [projectKey, setProjectKey] = useState("FLINK");
  const [useApiData, setUseApiData] = useState(true);
  
  useEffect(() => {
    if (isReady) {
      try {
        const savedProjectKey = db.getSetting("jiraProjectKey");
        if (savedProjectKey) setProjectKey(savedProjectKey);
        const savedUseApi = db.getSetting("useJiraApi");
        setUseApiData(savedUseApi !== "false"); // Default to true
      } catch (error) {
        // Fallback to localStorage
        setProjectKey(localStorage.getItem("jiraProjectKey") || "FLINK");
        setUseApiData(localStorage.getItem("useJiraApi") !== "false");
      }
    }
  }, [isReady]);

  // Determine active tab from URL
  const activeTab = (() => {
    if (tab) return tab;
    const path = location.pathname;
    if (path === "/my-issues") return "my-issues";
    const lastSegment = path.split("/").pop();
    return lastSegment || "my-issues";
  })();

  // Build JQL query based on active tab
  const getJqlQuery = () => {
    const currentUser = "LB Lakshya Bagani";
    if (!useApiData || !projectKey) return undefined;
    
    switch (activeTab) {
      case "assigned":
        // Issues assigned to current user (match by initials or display name)
        // JIRA format: assignee in ("LB Lakshya Bagani", "Lakshya Bagani", etc.)
        return `project=${projectKey} AND assignee IN ("LB Lakshya Bagani", "Lakshya Bagani") ORDER BY created DESC`;
      case "created":
        // Issues created by current user
        return `project=${projectKey} AND creator IN ("LB Lakshya Bagani", "Lakshya Bagani") ORDER BY created DESC`;
      case "subscribed":
        // For subscribed, we'll use watchers if available, otherwise fallback to assigned
        // JIRA doesn't have direct "subscribed" - we'll use watched issues
        return `project=${projectKey} AND watcher = currentUser() ORDER BY created DESC`;
      case "activity":
        // Recent activity - issues updated recently where user is involved
        return `project=${projectKey} AND (assignee IN ("LB Lakshya Bagani", "Lakshya Bagani") OR creator IN ("LB Lakshya Bagani", "Lakshya Bagani")) ORDER BY updated DESC`;
      case "my-issues":
      default:
        // Default: issues assigned to user
        return `project=${projectKey} AND assignee IN ("LB Lakshya Bagani", "Lakshya Bagani") ORDER BY created DESC`;
    }
  };

  // Fetch issues from JIRA API with JQL query based on active tab
  const { data: issues = [], isLoading, isError, error, refetch } = useIssues({
    projectKey: useApiData ? projectKey : undefined,
    jql: getJqlQuery(),
    enabled: useApiData,
    maxResults: 100, // Increased for better coverage
  });

  useEffect(() => {
    // Also load local issues for backward compatibility
    if (!useApiData) {
      const storedIssues = JSON.parse(localStorage.getItem("issues") || "[]");
      const migratedIssues = storedIssues.map((issue: Issue) => {
        if (!issue.createdBy) {
          issue.createdBy = issue.assignee || "LB Lakshya Bagani";
        }
        return issue;
      });
      if (migratedIssues.length > 0 && storedIssues.some((issue: Issue) => !issue.createdBy)) {
        localStorage.setItem("issues", JSON.stringify(migratedIssues));
      }
    }
  }, [useApiData]);

  // Uncheck all issues when clicking outside the issues container or on blank space
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Don't uncheck if clicking on dropdown menus
      if (target.closest('[role="menu"]') || target.closest('[data-radix-popper-content-wrapper]')) {
        return;
      }

      // Uncheck if clicking outside the issues container
      if (issuesContainerRef.current && !issuesContainerRef.current.contains(target)) {
        setCheckedIssues({});
        return;
      }

      // Uncheck if clicking on blank space inside the container (not on an issue row)
      if (issuesContainerRef.current && issuesContainerRef.current.contains(target)) {
        const issueRow = target.closest('[data-issue-row]');
        // If click is on the container but not on an issue row, uncheck all
        if (!issueRow) {
          setCheckedIssues({});
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadIssues = () => {
    refetch();
  };

  const toggleSection = (status: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  // Filter issues based on active tab (client-side filtering as fallback/additional filtering)
  const getFilteredIssues = () => {
    // If using API with JQL, most filtering is done server-side, but we can do additional client-side filtering
    // For subscribed and activity, we may need additional client-side filtering
    let filtered = [...issues];
    
    // Additional client-side filtering if needed (JQL already handles most of it)
    switch (activeTab) {
      case "subscribed":
        // If JQL for subscribed doesn't work perfectly, keep all returned issues
        // In a real app, this would track actual subscriptions
        return filtered;
      case "activity":
        // Already sorted by updated DESC from JQL, just return all
        return filtered;
      case "assigned":
      case "created":
      case "my-issues":
      default:
        // JQL already filtered these, just return all
        return filtered;
    }
  };

  const getIssuesByStatus = (status: string) => {
    const filteredIssues = getFilteredIssues();
    return filteredIssues.filter((issue) => issue.status === status);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  const updateIssuePriority = (issueId: string, priority: string) => {
    setIssuePriorities((prev) => ({ ...prev, [issueId]: priority }));
    setOpenPriorityDropdown(null);
  };

  const updateIssueStatus = (issueId: string, status: string) => {
    setIssueStatuses((prev) => ({ ...prev, [issueId]: status }));
    setOpenStatusDropdown(null);
  };

  const getPriorityForIssue = (issue: any) => {
    return issuePriorities[issue.id] || issue.priority || "No priority";
  };

  const getStatusForIssue = (issue: any) => {
    return issueStatuses[issue.id] || issue.status || "Todo";
  };

  const toggleIssueChecked = (issueId: string, checked: boolean) => {
    setCheckedIssues((prev) => ({ ...prev, [issueId]: checked }));
  };

  const handleRowClick = (e: React.MouseEvent, issueId: string) => {
    // Don't uncheck if clicking on dropdown, checkbox, or buttons
    const target = e.target as HTMLElement;
    if (
      target.closest('[role="menu"]') ||
      target.closest('[data-radix-popper-content-wrapper]') ||
      target.closest('button') ||
      target.closest('[type="checkbox"]') ||
      target.closest('[role="checkbox"]') ||
      target.closest('a') ||
      target.closest('input')
    ) {
      return;
    }
    // Uncheck when clicking on the row (if it's checked)
    if (checkedIssues[issueId]) {
      setCheckedIssues((prev) => ({ ...prev, [issueId]: false }));
    }
  };

  const statusOrder = ["Backlog", "Todo", "In Progress", "Done", "Cancelled", "Duplicate"];
  const filteredIssues = getFilteredIssues();
  const hasIssues = filteredIssues.length > 0;

  // Group issues by status for board view
  const groupIssuesByStatus = () => {
    const grouped: Record<string, Issue[]> = {};
    filteredIssues.forEach((issue) => {
      const status = getStatusForIssue(issue);
      if (!grouped[status]) {
        grouped[status] = [];
      }
      grouped[status].push(issue);
    });
    return grouped;
  };

  const issuesByStatus = groupIssuesByStatus();

  const currentUser = "LB Lakshya Bagani";

  return (
    <div className="h-full flex flex-col bg-background" style={{ marginTop: "8px" }}>
      {/* Tabs */}
      <div className="border-b border-border px-3 md:px-5" style={{ paddingTop: "8px", paddingBottom: "8px" }}>
        <div className="flex items-center justify-between gap-2">
          <nav className="flex items-center gap-1 overflow-x-auto flex-shrink-0">
            {tabs.map((tab) => {
              if (tab.name === "My issues") {
                return (
                  <span
                    key={tab.name}
                    className="text-sm font-semibold text-foreground mr-2"
                  >
                    {tab.name}
                  </span>
                );
              }
              return (
              <NavLink
                key={tab.name}
                to={tab.href}
                end
                className={({ isActive }) =>
                  cn(
                      "px-2.5 py-1.5 text-xs font-medium transition-colors rounded-md border outline-none focus:outline-none focus:ring-0",
                    isActive
                        ? "bg-surface text-foreground border-border"
                        : "text-foreground bg-transparent border-border hover:bg-surface/70"
                  )
                }
              >
                {tab.name}
              </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Filter and Display buttons */}
      <div className="border-b flex items-center justify-between px-3 md:px-5 py-2" style={{ borderColor: "#1A1C1E" }}>
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
        <DropdownMenu open={displayMenuOpen} onOpenChange={setDisplayMenuOpen}>
          <DropdownMenuTrigger asChild>
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
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-0">
            <div className="px-3 py-2 border-b border-border">
              <div className="text-xs font-medium text-muted-foreground mb-2">View Type</div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex-1 h-7 text-xs",
                    viewType === "list" ? "bg-muted/50 border-muted" : ""
                  )}
                  onClick={() => setViewType("list")}
                  onMouseEnter={(e) => {
                    if (viewType !== "list") {
                      e.currentTarget.style.background = "#1A1C1E";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (viewType !== "list") {
                      e.currentTarget.style.background = "";
                    }
                  }}
                >
                  <List className="w-3.5 h-3.5 mr-1.5" />
                  List
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex-1 h-7 text-xs",
                    viewType === "board" ? "bg-muted/50 border-muted" : ""
                  )}
                  onClick={() => setViewType("board")}
                  onMouseEnter={(e) => {
                    if (viewType !== "board") {
                      e.currentTarget.style.background = "#1A1C1E";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (viewType !== "board") {
                      e.currentTarget.style.background = "";
                    }
                  }}
                >
                  <Columns className="w-3.5 h-3.5 mr-1.5" />
                  Board
                </Button>
              </div>
            </div>

            {viewType === "board" ? (
              <>
                {/* Board Configuration */}
                <div className="px-3 py-2 border-b border-border space-y-3">
                  <div className="flex items-center gap-1">
                    <label className="text-xs font-medium text-muted-foreground w-[120px] flex-shrink-0">Columns</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs gap-1.5 px-2 border-border hover:bg-surface/70 w-[133px] justify-center"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#1A1C1E";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "";
                          }}
                        >
                          {columns}
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setColumns("Status")}>Status</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setColumns("Assignee")}>Assignee</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setColumns("Project")}>Project</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setColumns("Team")}>Team</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setColumns("Priority")}>Priority</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setColumns("Cycle")}>Cycle</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setColumns("Label")}>Label</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setColumns("Parent issue")}>Parent issue</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-1">
                    <label className="text-xs font-medium text-muted-foreground w-[120px] flex-shrink-0">Rows</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs gap-1.5 px-2 border-border hover:bg-surface/70 w-[133px] justify-center"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#1A1C1E";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "";
                          }}
                        >
                          {grouping}
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setGrouping("No grouping")}>No grouping</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setGrouping("Status")}>Status</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setGrouping("Assignee")}>Assignee</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setGrouping("Project")}>Project</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setGrouping("Priority")}>Priority</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setGrouping("Cycle")}>Cycle</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setGrouping("Label")}>Label</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setGrouping("Parent issue")}>Parent issue</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setGrouping("Team")}>Team</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-1">
                    <label className="text-xs font-medium text-muted-foreground w-[120px] flex-shrink-0">Ordering</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs gap-1.5 px-2 border-border hover:bg-surface/70 w-[133px] justify-center"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#1A1C1E";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "";
                          }}
                        >
                          {ordering}
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setOrdering("Created")}>Created</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOrdering("Manual")}>Manual</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOrdering("Title")}>Title</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOrdering("Status")}>Status</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOrdering("Priority")}>Priority</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOrdering("Assignee")}>Assignee</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOrdering("Estimate")}>Estimate</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOrdering("Updated estimate")}>Updated estimate</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOrdering("Due date")}>Due date</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOrdering("Updated")}>Updated</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOrdering("Link count")}>Link count</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="order-completed" className="text-xs font-medium text-foreground">Order completed by recency</Label>
                    <Switch id="order-completed" />
                  </div>

                  <div className="flex items-center gap-1">
                    <label className="text-xs font-medium text-muted-foreground w-[120px] flex-shrink-0">Completed issues</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs gap-1.5 px-2 border-border hover:bg-surface/70 w-[133px] justify-center"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#1A1C1E";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "";
                          }}
                        >
                          {completedIssues}
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <div className="grid grid-cols-2 gap-1 px-2 py-1.5">
                          <DropdownMenuItem 
                            onClick={() => setCompletedIssues("All")}
                            className={cn("text-xs justify-center", completedIssues === "All" && "!bg-muted/50")}
                          >
                            All
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setCompletedIssues("Past day")}
                            className={cn("text-xs justify-center", completedIssues === "Past day" && "!bg-muted/50")}
                          >
                            Past day
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setCompletedIssues("Past week")}
                            className={cn("text-xs justify-center", completedIssues === "Past week" && "!bg-muted/50")}
                          >
                            Past week
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setCompletedIssues("Past month")}
                            className={cn("text-xs justify-center", completedIssues === "Past month" && "!bg-muted/50")}
                          >
                            Past month
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setCompletedIssues("Current cycle")}
                            className={cn("text-xs justify-center", completedIssues === "Current cycle" && "!bg-muted/50")}
                          >
                            Current cycle
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setCompletedIssues("None")}
                            className={cn("text-xs justify-center", completedIssues === "None" && "!bg-muted/50")}
                          >
                            None
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setCompletedIssues("ID")}
                            className={cn("text-xs justify-center", completedIssues === "ID" && "!bg-muted/50")}
                          >
                            ID
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setCompletedIssues("Status")}
                            className={cn("text-xs justify-center", completedIssues === "Status" && "!bg-muted/50")}
                          >
                            Status
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setCompletedIssues("Assignee")}
                            className={cn("text-xs justify-center", completedIssues === "Assignee" && "!bg-muted/50")}
                          >
                            Assignee
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setCompletedIssues("Priority")}
                            className={cn("text-xs justify-center", completedIssues === "Priority" && "!bg-muted/50")}
                          >
                            Priority
                          </DropdownMenuItem>
                        </div>
                        <DropdownMenuSeparator />
                        <div className="grid grid-cols-3 gap-1 px-2 py-1.5">
                          <DropdownMenuItem 
                            onClick={() => setCompletedIssues("Due date")}
                            className={cn("text-xs justify-center", completedIssues === "Due date" && "!bg-muted/50")}
                          >
                            Due date
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setCompletedIssues("Project")}
                            className={cn("text-xs justify-center", completedIssues === "Project" && "!bg-muted/50")}
                          >
                            Project
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setCompletedIssues("Milestone")}
                            className={cn("text-xs justify-center", completedIssues === "Milestone" && "!bg-muted/50")}
                          >
                            Milestone
                          </DropdownMenuItem>
                        </div>
                        <DropdownMenuSeparator />
                        <div className="grid grid-cols-3 gap-1 px-2 py-1.5">
                          <DropdownMenuItem 
                            onClick={() => setCompletedIssues("Cycle")}
                            className={cn("text-xs justify-center", completedIssues === "Cycle" && "!bg-muted/50")}
                          >
                            Cycle
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setCompletedIssues("Label")}
                            className={cn("text-xs justify-center", completedIssues === "Label" && "!bg-muted/50")}
                          >
                            Label
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setCompletedIssues("Link")}
                            className={cn("text-xs justify-center", completedIssues === "Link" && "!bg-muted/50")}
                          >
                            Link
                          </DropdownMenuItem>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    <Label htmlFor="show-sub-issues" className="text-xs font-medium text-foreground">Show sub-issues</Label>
                    <Switch id="show-sub-issues" checked={showSubIssues} onCheckedChange={setShowSubIssues} />
                  </div>
                </div>

                {/* Board Options */}
                <div className="px-3 py-2 border-b border-border">
                  <div className="text-xs font-medium text-muted-foreground mb-2">Board options</div>
                  <div className="flex items-center justify-between gap-1">
                    <Label htmlFor="show-empty-columns" className="text-xs font-medium text-foreground">Show empty columns</Label>
                    <Switch id="show-empty-columns" checked={showEmptyColumns} onCheckedChange={setShowEmptyColumns} />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* List Configuration */}
                <div className="px-3 py-2 border-b border-border space-y-3">
                  <div className="flex items-center gap-1">
                    <label className="text-xs font-medium text-muted-foreground w-[120px] flex-shrink-0">Grouping</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs gap-1.5 px-2 border-border hover:bg-surface/70 w-[133px] justify-center"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#1A1C1E";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "";
                          }}
                        >
                          {grouping}
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setGrouping("No grouping")}>No grouping</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setGrouping("Assignee")}>Assignee</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setGrouping("Priority")}>Priority</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setGrouping("Status")}>Status</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-1">
                    <label className="text-xs font-medium text-muted-foreground w-[120px] flex-shrink-0">Ordering</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs gap-1.5 px-2 border-border hover:bg-surface/70 w-[133px] justify-center"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#1A1C1E";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "";
                          }}
                        >
                          {ordering}
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setOrdering("Created")}>Created</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOrdering("Updated")}>Updated</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOrdering("Priority")}>Priority</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-1">
                    <label className="text-xs font-medium text-muted-foreground w-[120px] flex-shrink-0">Completed issues</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs gap-1.5 px-2 border-border hover:bg-surface/70 w-[133px] justify-center"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#1A1C1E";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "";
                          }}
                        >
                          {completedIssues}
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setCompletedIssues("All")}>All</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCompletedIssues("Completed")}>Completed</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCompletedIssues("Not completed")}>Not completed</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    <Label htmlFor="show-sub-issues-list" className="text-xs font-medium text-foreground">Show sub-issues</Label>
                    <Switch id="show-sub-issues-list" checked={showSubIssues} onCheckedChange={setShowSubIssues} />
                  </div>
                </div>

                {/* List Options */}
                <div className="px-3 py-2 border-b border-border">
                  <div className="text-xs font-medium text-muted-foreground mb-2">List options</div>
                </div>
              </>
            )}

            {/* Display Properties */}
            <div className="px-3 py-2">
              <div className="text-xs font-medium text-muted-foreground mb-2">Display properties</div>
              {/* First line: ID, Status, Assignee, Priority */}
              <div className="flex gap-1.5 mb-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-6 text-xs flex-1 justify-center",
                    displayProperties.id ? "!bg-muted/50 border-border" : ""
                  )}
                  onClick={() => setDisplayProperties(prev => ({ ...prev, id: !prev.id }))}
                  onMouseEnter={(e) => {
                    if (!displayProperties.id) {
                      e.currentTarget.style.background = "#1A1C1E";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!displayProperties.id) {
                      e.currentTarget.style.background = "";
                    }
                  }}
                >
                  ID
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-6 text-xs flex-1 justify-center",
                    displayProperties.status ? "!bg-muted/50 border-border" : ""
                  )}
                  onClick={() => setDisplayProperties(prev => ({ ...prev, status: !prev.status }))}
                  onMouseEnter={(e) => {
                    if (!displayProperties.status) {
                      e.currentTarget.style.background = "#1A1C1E";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!displayProperties.status) {
                      e.currentTarget.style.background = "";
                    }
                  }}
                >
                  Status
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-6 text-xs flex-1 justify-center",
                    displayProperties.assignee ? "!bg-muted/50 border-border" : ""
                  )}
                  onClick={() => setDisplayProperties(prev => ({ ...prev, assignee: !prev.assignee }))}
                  onMouseEnter={(e) => {
                    if (!displayProperties.assignee) {
                      e.currentTarget.style.background = "#1A1C1E";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!displayProperties.assignee) {
                      e.currentTarget.style.background = "";
                    }
                  }}
                >
                  Assignee
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-6 text-xs flex-1 justify-center",
                    displayProperties.priority ? "!bg-muted/50 border-border" : ""
                  )}
                  onClick={() => setDisplayProperties(prev => ({ ...prev, priority: !prev.priority }))}
                  onMouseEnter={(e) => {
                    if (!displayProperties.priority) {
                      e.currentTarget.style.background = "#1A1C1E";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!displayProperties.priority) {
                      e.currentTarget.style.background = "";
                    }
                  }}
                >
                  Priority
                </Button>
              </div>
              {/* Second line: Due date, Project, Milestone */}
              <div className="flex gap-1.5 mb-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-6 text-xs flex-1 justify-center",
                    displayProperties.dueDate ? "!bg-muted/50 border-border" : ""
                  )}
                  onClick={() => setDisplayProperties(prev => ({ ...prev, dueDate: !prev.dueDate }))}
                  onMouseEnter={(e) => {
                    if (!displayProperties.dueDate) {
                      e.currentTarget.style.background = "#1A1C1E";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!displayProperties.dueDate) {
                      e.currentTarget.style.background = "";
                    }
                  }}
                >
                  Due date
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-6 text-xs flex-1 justify-center",
                    displayProperties.project ? "!bg-muted/50 border-border" : ""
                  )}
                  onClick={() => setDisplayProperties(prev => ({ ...prev, project: !prev.project }))}
                  onMouseEnter={(e) => {
                    if (!displayProperties.project) {
                      e.currentTarget.style.background = "#1A1C1E";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!displayProperties.project) {
                      e.currentTarget.style.background = "";
                    }
                  }}
                >
                  Project
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-6 text-xs flex-1 justify-center",
                    displayProperties.milestone ? "!bg-muted/50 border-border" : ""
                  )}
                  onClick={() => setDisplayProperties(prev => ({ ...prev, milestone: !prev.milestone }))}
                  onMouseEnter={(e) => {
                    if (!displayProperties.milestone) {
                      e.currentTarget.style.background = "#1A1C1E";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!displayProperties.milestone) {
                      e.currentTarget.style.background = "";
                    }
                  }}
                >
                  Milestone
                </Button>
              </div>
              {/* Third line: Cycle, Label, Link */}
              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-6 text-xs flex-1 justify-center",
                    displayProperties.cycle ? "!bg-muted/50 border-border" : ""
                  )}
                  onClick={() => setDisplayProperties(prev => ({ ...prev, cycle: !prev.cycle }))}
                  onMouseEnter={(e) => {
                    if (!displayProperties.cycle) {
                      e.currentTarget.style.background = "#1A1C1E";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!displayProperties.cycle) {
                      e.currentTarget.style.background = "";
                    }
                  }}
                >
                  Cycle
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-6 text-xs flex-1 justify-center",
                    displayProperties.labels ? "!bg-muted/50 border-border" : ""
                  )}
                  onClick={() => setDisplayProperties(prev => ({ ...prev, labels: !prev.labels }))}
                  onMouseEnter={(e) => {
                    if (!displayProperties.labels) {
                      e.currentTarget.style.background = "#1A1C1E";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!displayProperties.labels) {
                      e.currentTarget.style.background = "";
                    }
                  }}
                >
                  Label
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-6 text-xs flex-1 justify-center",
                    displayProperties.links ? "!bg-muted/50 border-border" : ""
                  )}
                  onClick={() => setDisplayProperties(prev => ({ ...prev, links: !prev.links }))}
                  onMouseEnter={(e) => {
                    if (!displayProperties.links) {
                      e.currentTarget.style.background = "#1A1C1E";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!displayProperties.links) {
                      e.currentTarget.style.background = "";
                    }
                  }}
                >
                  Link
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading issues from Apache JIRA...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 max-w-md text-center">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Failed to load issues</p>
              <p className="text-xs text-muted-foreground">{error?.message || "Unknown error occurred"}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1A1C1E";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "";
              }}
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      {!isLoading && !isError && hasIssues ? (
        viewType === "board" ? (
          /* Board View - Grouped by Status */
          <div ref={issuesContainerRef} className="flex-1 overflow-x-auto overflow-y-hidden px-3 md:px-5 py-3">
            <div className="flex gap-2 md:gap-4 h-full min-w-0">
          {statusOrder.map((status) => {
                const statusIssues = issuesByStatus[status] || [];
                // Only show columns that have issues (unless showEmptyColumns is enabled)
                if (statusIssues.length === 0 && !showEmptyColumns) return null;
                
                const statusOption = defaultStatusOptions.find(s => s.value === status);
                const StatusIcon = statusOption?.icon || DashedCircle;

                return (
                  <div key={status} className="flex-shrink-0 w-80 flex flex-col">
                    {/* Status Header */}
                    <div className="flex items-center gap-2 mb-3 px-2 py-1.5">
                      <StatusIcon className={cn("h-3.5 w-3.5 flex-shrink-0", statusOption?.color || "text-muted-foreground")} />
                      <span className="text-xs font-medium text-foreground">{status}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{statusIssues.length}</span>
                    </div>
                    {/* Issues Column */}
                    <div className="flex-1 overflow-y-auto space-y-2">
                      {statusIssues.map((issue) => {
                        const currentPriority = getPriorityForIssue(issue);
                        const priorityOption = defaultPriorityOptions.find(p => p.value === currentPriority);
                        const isChecked = checkedIssues[issue.id] || false;

                        return (
                          <div
                            key={issue.id}
                            data-issue-row
                            onClick={(e) => handleRowClick(e, issue.id)}
                            className={cn(
                              "p-2 rounded-md border border-border bg-transparent cursor-pointer transition-colors group relative",
                              isChecked
                                ? "bg-surface/70 border-border"
                                : "hover:bg-surface/70"
                            )}
                          >
                            {/* Avatar - top right corner */}
                            <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
                              <Avatar name={issue.assignee} size="xs" />
                            </div>

                            {/* Checkbox and Issue ID in same row */}
                            <div className="flex items-center gap-2">
                              <div className={cn("transition-opacity", isChecked ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                                <Checkbox 
                                  checked={isChecked}
                                  onCheckedChange={(checked) => toggleIssueChecked(issue.id, checked === true)}
                                  className="h-3.5 w-3.5 !border-border data-[state=checked]:!bg-muted data-[state=checked]:!border-border"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              <span className="text-xs font-mono text-muted-foreground">{issue.issueNumber}</span>
                            </div>
                            
                            {/* Issue Title - directly below issue ID, aligned with issue ID text */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/my-issues/issue/${issue.id}`);
                              }}
                              className="text-sm font-medium text-foreground mb-0 text-left hover:underline line-clamp-2 ml-[calc(0.875rem+0.5rem)]"
                            >
                              {issue.title}
                            </button>
                            
                            {/* Priority, Status icons */}
                            <div className="flex items-center gap-2 ml-[calc(0.875rem+0.5rem)] mt-1.5">
                              <div className="flex items-center gap-2.5">
                                {/* Priority dropdown */}
                                <DropdownMenu
                                  open={openPriorityDropdown === issue.id}
                                  onOpenChange={(open) =>
                                    setOpenPriorityDropdown(open ? issue.id : null)
                                  }
                                >
                                  <DropdownMenuTrigger asChild>
                                    <button 
                                      onClick={(e) => e.stopPropagation()}
                                      className="flex items-center border-0 bg-transparent p-0 rounded focus:outline-none"
                                    >
                                      {priorityOption && priorityOption.value !== "No priority" ? (
                                        typeof priorityOption.icon === "string" ? (
                                          <span className={cn("text-xs", priorityOption.color)}>{priorityOption.icon}</span>
                                        ) : (
                                          <priorityOption.icon className={cn("h-3 w-3", priorityOption.color)} />
                                        )
                                      ) : (
                                        <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
                                      )}
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start" className="w-[200px]">
                                    {defaultPriorityOptions.map((option) => {
                                      const IconComponent = typeof option.icon === "string" ? null : option.icon;
                                      const isSelected = currentPriority === option.value;
                                      return (
                                        <DropdownMenuItem
                                          key={option.value}
                                          onClick={() => updateIssuePriority(issue.id, option.value)}
                                          className={cn(
                                            "gap-2 px-2 py-1.5 text-xs cursor-pointer",
                                            isSelected ? "!bg-muted/50" : ""
                                          )}
                                        >
                                          {typeof option.icon === "string" ? (
                                            <span className={cn("text-xs", option.color)}>{option.icon}</span>
                                          ) : IconComponent ? (
                                            <IconComponent className={cn("h-3 w-3", option.color)} />
                                          ) : null}
                                          <span className="flex-1">{option.value}</span>
                                          {isSelected && <Check className="h-3 w-3" />}
                                        </DropdownMenuItem>
                                      );
                                    })}
                                  </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Status dropdown */}
                                <DropdownMenu
                                  open={openStatusDropdown === issue.id}
                                  onOpenChange={(open) =>
                                    setOpenStatusDropdown(open ? issue.id : null)
                                  }
                                >
                                  <DropdownMenuTrigger asChild>
                                    <button 
                                      onClick={(e) => e.stopPropagation()}
                                      className="flex items-center border-0 bg-transparent p-0 rounded focus:outline-none"
                                    >
                                      {(() => {
                                        const currentStatus = getStatusForIssue(issue);
                                        const statusOpt = defaultStatusOptions.find(s => s.value === currentStatus);
                                        const StatusIconComponent = statusOpt?.icon || DashedCircle;
                                        return <StatusIconComponent className={cn("h-3 w-3", statusOpt?.color || "text-muted-foreground")} />;
                                      })()}
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start" className="w-[200px]">
                                    {defaultStatusOptions.map((option) => {
                                      const IconComponent = option.icon;
                                      const currentStatus = getStatusForIssue(issue);
                                      const isSelected = currentStatus === option.value;
                                      return (
                                        <DropdownMenuItem
                                          key={option.value}
                                          onClick={() => updateIssueStatus(issue.id, option.value)}
                                          className={cn(
                                            "gap-2 px-2 py-1.5 text-xs cursor-pointer",
                                            isSelected ? "!bg-muted/50" : ""
                                          )}
                                        >
                                          <IconComponent className={cn("h-3 w-3", option.color)} />
                                          <span className="flex-1">{option.value}</span>
                                          {isSelected && <Check className="h-3 w-3" />}
                                        </DropdownMenuItem>
                                      );
                                    })}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* List View */
          <div ref={issuesContainerRef} className="flex-1 overflow-y-auto px-5 py-3">
            {filteredIssues.map((issue) => {
            const currentPriority = getPriorityForIssue(issue);
            const currentStatus = getStatusForIssue(issue);
            const priorityOption = defaultPriorityOptions.find(p => p.value === currentPriority);
            const statusOption = defaultStatusOptions.find(s => s.value === currentStatus);

            const isChecked = checkedIssues[issue.id] || false;

            return (
              <div
                key={issue.id}
                data-issue-row
                onClick={(e) => handleRowClick(e, issue.id)}
                className={cn(
                  "flex items-center gap-2.5 px-1 py-1.5 rounded-md transition-colors group cursor-pointer",
                  isChecked
                    ? "bg-surface/70 hover:bg-surface/70"
                    : "hover:bg-surface/70"
                )}
              >
                {/* Checkbox on far left - visible when checked or on hover */}
                <div className={cn("transition-opacity", isChecked ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                  <Checkbox 
                    checked={isChecked}
                    onCheckedChange={(checked) => toggleIssueChecked(issue.id, checked === true)}
                    className="h-3.5 w-3.5 !border-border data-[state=checked]:!bg-muted data-[state=checked]:!border-border data-[state=checked]:!text-foreground"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                {/* Priority dropdown - three dots */}
                <DropdownMenu
                  open={openPriorityDropdown === issue.id}
                  onOpenChange={(open) =>
                    setOpenPriorityDropdown(open ? issue.id : null)
                  }
                >
                  <DropdownMenuTrigger asChild>
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center text-muted-foreground hover:text-foreground border-0 bg-transparent p-0.5 rounded-[4px] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors duration-150"
                    >
                      {priorityOption && priorityOption.value !== "No priority" ? (
                        typeof priorityOption.icon === "string" ? (
                          <span className={cn("text-xs w-4 text-center font-medium", priorityOption.color)}>
                            {priorityOption.icon}
                          </span>
                        ) : (
                          <priorityOption.icon
                            className={cn(
                              "h-3.5 w-3.5 flex-shrink-0",
                              priorityOption.color
                            )}
                          />
                        )
                      ) : (
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      )}
                </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[280px] bg-popover border-border/50 rounded-[8px] shadow-lg"
                  >
                    <div className="px-3 py-2 text-[12px] font-medium text-muted-foreground border-b border-border/50">
                      Change priority...
                    </div>
                    {defaultPriorityOptions.map((option) => {
                      const IconComponent =
                        typeof option.icon === "string" ? null : option.icon;
                      const isSelected = currentPriority === option.value;

                      return (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => updateIssuePriority(issue.id, option.value)}
                          className={cn(
                            "gap-3 px-3 py-2 cursor-pointer text-[13px] font-medium transition-colors duration-150",
                            isSelected
                              ? "!bg-muted/50 !text-foreground focus:!bg-muted/50 focus:!text-foreground"
                              : "hover:!bg-muted/50 focus:!bg-muted/50"
                          )}
                        >
                          {typeof option.icon === "string" ? (
                            <span
                              className={cn(
                                "text-[13px] w-5 text-center font-medium",
                                option.color
                              )}
                            >
                              {option.icon}
                            </span>
                          ) : IconComponent ? (
                            <IconComponent
                              className={cn(
                                "h-[14px] w-[14px]",
                                option.color
                              )}
                            />
                          ) : null}
                          <span className="flex-1 leading-[18px] tracking-[-0.01em]">
                            {option.value}
                          </span>
                          {isSelected && (
                            <Check className="h-[14px] w-[14px] text-foreground" />
                          )}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
                        
                        {/* Issue ID */}
                        <span className="text-sm font-mono text-muted-foreground min-w-[50px]">{issue.issueNumber}</span>
                        
                {/* Status dropdown - hollow circle */}
                <DropdownMenu
                  open={openStatusDropdown === issue.id}
                  onOpenChange={(open) =>
                    setOpenStatusDropdown(open ? issue.id : null)
                  }
                >
                  <DropdownMenuTrigger asChild>
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center text-muted-foreground hover:text-foreground border-0 bg-transparent p-0.5 rounded-[4px] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors duration-150"
                    >
                      {statusOption && currentStatus ? (
                        <statusOption.icon
                          className={cn(
                            "h-3.5 w-3.5 flex-shrink-0",
                            statusOption.color
                          )}
                        />
                      ) : (
                        <DashedCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[280px] bg-popover border-border/50 rounded-[8px] shadow-lg"
                  >
                    <div className="px-3 py-2 text-[12px] font-medium text-muted-foreground border-b border-border/50">
                      Change status...
                    </div>
                    {defaultStatusOptions.map((option) => {
                      const IconComponent = option.icon;
                      const isSelected = currentStatus === option.value;

                      return (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => updateIssueStatus(issue.id, option.value)}
                          className={cn(
                            "gap-3 px-3 py-2 cursor-pointer flex items-center text-[13px] font-medium transition-colors duration-150",
                            isSelected
                              ? "!bg-muted/50 !text-foreground focus:!bg-muted/50 focus:!text-foreground"
                              : "hover:!bg-muted/50 focus:!bg-muted/50"
                          )}
                        >
                          <IconComponent
                            className={cn(
                              "h-[14px] w-[14px]",
                              option.color
                            )}
                          />
                          <span className="flex-1 leading-[18px] tracking-[-0.01em]">
                            {option.value}
                          </span>
                          {isSelected && (
                            <Check className="h-[14px] w-[14px] text-foreground ml-auto" />
                          )}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
                        
                        {/* Issue title */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/my-issues/issue/${issue.id}`);
                  }}
                  className="text-sm text-foreground flex-1 text-left hover:text-foreground hover:underline cursor-pointer"
                >
                  {issue.title}
                </button>
                        
                        {/* Assignee avatar and date */}
                        <div className="flex items-center gap-2">
                          <Avatar name={issue.assignee} size="xs" />
                          <span className="text-xs text-muted-foreground">{formatDate(issue.createdAt)}</span>
                        </div>
              </div>
            );
          })}
        </div>
        )
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 max-w-md text-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center">
                <CircleDot className="w-12 h-12 text-muted-foreground/40" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center bg-background">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/20"></div>
              </div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full border-2 border-muted-foreground/20 bg-background"></div>
              <div className="absolute top-1/2 -right-8 w-10 h-1 bg-muted-foreground/20 rounded-full"></div>
              <div className="absolute top-1/4 -left-10 w-8 h-1 bg-muted-foreground/20 rounded-full"></div>
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                {activeTab === "created" 
                  ? "No issues created by you"
                  : activeTab === "assigned" || activeTab === "my-issues"
                  ? "No issues assigned to you"
                  : activeTab === "subscribed"
                  ? "No subscribed issues"
                  : activeTab === "activity"
                  ? "No activity"
                  : "No issues"}
              </p>
            </div>

            <Button 
              className="bg-muted hover:bg-muted/80 text-foreground"
              onClick={() => setIsNewIssueModalOpen(true)}
            >
              Create new issue
            </Button>
          </div>
        </div>
      )}

      <NewIssueModal 
        open={isNewIssueModalOpen} 
        onOpenChange={setIsNewIssueModalOpen}
        onIssueCreated={loadIssues}
      />
    </div>
  );
};

export default MyIssues;
