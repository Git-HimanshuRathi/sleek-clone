import { useState, useEffect, useRef } from "react";
import { NavLink, useParams, useLocation, useNavigate } from "react-router-dom";
import { Filter, SlidersHorizontal, CircleDot, ChevronDown, LayoutGrid, Loader2, Minus, Circle, AlertCircle, MoreHorizontal, BarChart3, BarChart2, BarChart, CheckSquare, PlayCircle, CheckCircle2, XCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { NewIssueModal, Issue } from "@/components/NewIssueModal";
import { Avatar } from "@/components/Avatar";
import { useIssues } from "@/hooks/useJiraIssues";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const tabs = [
  { name: "My issues", href: "/my-issues" },
  { name: "Assigned", href: "/my-issues/assigned" },
  { name: "Created", href: "/my-issues/created" },
  { name: "Subscribed", href: "/my-issues/subscribed" },
  { name: "Activity", href: "/my-issues/activity" },
];

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
  { value: "Done", icon: CheckCircle2, color: "text-primary" },
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

  // Get project key from localStorage or use default
  const projectKey = localStorage.getItem("jiraProjectKey") || "FLINK";
  const useApiData = localStorage.getItem("useJiraApi") !== "false"; // Default to true

  // Fetch issues from JIRA API
  const { data: issues = [], isLoading, isError, error, refetch } = useIssues({
    projectKey: useApiData ? projectKey : undefined,
    enabled: useApiData,
    maxResults: 50,
  });

  // Determine active tab from URL
  const activeTab = (() => {
    if (tab) return tab;
    const path = location.pathname;
    if (path === "/my-issues") return "my-issues";
    const lastSegment = path.split("/").pop();
    return lastSegment || "my-issues";
  })();

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

  // Filter issues based on active tab
  const getFilteredIssues = () => {
    const currentUser = "LB Lakshya Bagani";
    
    switch (activeTab) {
      case "assigned":
        // Show issues assigned to the user
        return issues.filter((issue) => issue.assignee === currentUser);
      case "created":
        // Show issues created by the user
        return issues.filter((issue) => issue.createdBy === currentUser);
      case "subscribed":
        // For now, show empty (can be implemented later with subscription tracking)
        return [];
      case "activity":
        // For now, show empty (can be implemented later with activity tracking)
        return [];
      case "my-issues":
      default:
        // Show all issues assigned to the user (same as assigned for now)
        return issues.filter((issue) => issue.assignee === currentUser);
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

  const currentUser = "LB Lakshya Bagani";

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Tabs */}
      <div className="border-b border-border px-5 pt-1 pb-3">
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-1">
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
                        : "text-foreground bg-transparent border-border hover:bg-surface/30"
                    )
                  }
                >
                  {tab.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Right side view icon */}
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
            <LayoutGrid className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Filter and Display buttons */}
      <div className="border-b border-border flex items-center justify-between px-5 py-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 h-7 text-muted-foreground hover:text-foreground px-2"
        >
          <Filter className="w-3.5 h-3.5" />
          <span className="text-xs">Filter</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 h-7 bg-surface hover:bg-surface-hover text-foreground rounded-md px-2.5"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="text-xs">Display</span>
        </Button>
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
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      {!isLoading && !isError && hasIssues ? (
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
                    ? "bg-primary/20 hover:bg-primary/20"
                    : "hover:bg-muted/50"
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
                            <Check className="h-[14px] w-[14px] text-primary" />
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
                            <Check className="h-[14px] w-[14px] text-primary ml-auto" />
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
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
