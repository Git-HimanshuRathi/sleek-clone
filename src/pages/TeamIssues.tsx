import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Filter, SlidersHorizontal, Plus, Circle, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Issue } from "@/components/NewIssueModal";
import { Avatar } from "@/components/Avatar";

// Custom icons matching Linear design
const StackedSquaresIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
    {/* Back square */}
    <rect x="2" y="4" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    {/* Front square */}
    <rect x="4" y="2" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

const StackedSquaresPlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
    {/* Back square */}
    <rect x="2" y="4" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    {/* Front square */}
    <rect x="4" y="2" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    {/* Plus sign */}
    <line x1="9" y1="7" x2="9" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="8" x2="10" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const HalfCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M 8 2 A 6 6 0 0 0 8 14" fill="currentColor" />
  </svg>
);

const DottedCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
  </svg>
);

const tabs = [
  { name: "All issues", href: "/team/issues", icon: StackedSquaresIcon },
  { name: "Active", href: "/team/issues/active", icon: HalfCircleIcon },
  { name: "Backlog", href: "/team/issues/backlog", icon: DottedCircleIcon },
];

const TeamIssues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const location = useLocation();

  // Determine active tab from URL
  const activeTab = (() => {
    const path = location.pathname;
    if (path.includes("/active")) return "active";
    if (path.includes("/backlog")) return "backlog";
    return "all";
  })();

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = () => {
    const storedIssues = JSON.parse(localStorage.getItem("issues") || "[]");
    setIssues(storedIssues);
  };

  // Filter issues based on active tab
  const getFilteredIssues = () => {
    switch (activeTab) {
      case "active":
        // Active = In Progress, Todo
        return issues.filter((issue) => 
          issue.status === "In Progress" || issue.status === "Todo"
        );
      case "backlog":
        // Backlog = Backlog status
        return issues.filter((issue) => issue.status === "Backlog");
      case "all":
      default:
        return issues;
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

  const getPriorityIcon = (priority: string) => {
    if (priority === "Urgent" || priority === "High") {
      return (
        <div className="w-4 h-4 rounded bg-orange-500 flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">!</span>
        </div>
      );
    }
    // Dashed square for other priorities or no priority
    return (
      <div className="w-4 h-4 rounded border border-border border-dashed"></div>
    );
  };

  const getAssigneeDisplay = (assignee: string, currentUser: string) => {
    // Check if assignee matches current user (handle different formats)
    const assigneeNormalized = assignee.toLowerCase().trim();
    const currentUserNormalized = currentUser.toLowerCase().trim();
    const isMe = assigneeNormalized === currentUserNormalized || 
                 assignee.includes(currentUser.split(" ")[1]) || // Match by last name
                 assignee.startsWith(currentUser.split(" ").map(n => n[0]).join("")); // Match by initials
    
    return (
      <div className="flex items-center gap-1.5">
        {isMe && <span className="text-xs text-muted-foreground">me</span>}
        <Avatar name={assignee} size="xs" />
      </div>
    );
  };

  const currentUser = "LB Lakshya Bagani";
  const filteredIssues = getFilteredIssues();
  
  // Status order for display
  const statusOrder = activeTab === "backlog" 
    ? ["Backlog"]
    : ["Backlog", "Todo", "In Progress", "Done", "Cancelled"];

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top Navigation Tabs */}
      <div className="border-b border-border px-6 py-0">
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = 
                (tab.name === "All issues" && activeTab === "all") ||
                (tab.name === "Active" && activeTab === "active") ||
                (tab.name === "Backlog" && activeTab === "backlog");
              
              const IconComponent = tab.icon;
              
              return (
                <NavLink
                  key={tab.name}
                  to={tab.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-md transition-colors",
                    isActive
                      ? "text-foreground bg-surface"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface/30"
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Right side icon - Stacked squares with plus */}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <StackedSquaresPlusIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filter and Display controls */}
      <div className="border-b border-border flex items-center justify-between px-6 py-2.5">
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

      {/* Content */}
      {filteredIssues.length > 0 ? (
        <div className="flex-1 overflow-y-auto px-6 py-3">
          {statusOrder.map((status) => {
            const statusIssues = getIssuesByStatus(status);
            if (statusIssues.length === 0) return null;

            return (
              <div key={status} className="mb-3">
                {/* Status header */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-1.5">
                    {status === "Backlog" ? (
                      <CircleDot className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium text-foreground">{status}</span>
                    <span className="text-xs text-muted-foreground">{statusIssues.length}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Issues list */}
                <div className="space-y-0.5">
                  {statusIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="flex items-center gap-2.5 px-1 py-1.5 rounded-md hover:bg-surface transition-colors group"
                    >
                      {/* Priority indicator */}
                      {getPriorityIcon(issue.priority)}
                      
                      {/* Issue ID */}
                      <span className="text-sm font-mono text-muted-foreground min-w-[50px]">
                        {issue.issueNumber}
                      </span>
                      
                      {/* Title */}
                      <span className="text-sm text-foreground flex-1">{issue.title}</span>
                      
                      {/* Assignee */}
                      <div className="flex items-center gap-2">
                        {getAssigneeDisplay(issue.assignee, currentUser)}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(issue.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 max-w-md text-center">
            <CircleDot className="w-16 h-16 text-muted-foreground/40" />
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                {activeTab === "backlog" 
                  ? "No backlog issues"
                  : activeTab === "active"
                  ? "No active issues"
                  : "No issues"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamIssues;

