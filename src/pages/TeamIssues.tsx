import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Filter, SlidersHorizontal, Plus, Circle, CircleDot, Loader2, AlertCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NewIssueModal, Issue } from "@/components/NewIssueModal";
import { Avatar } from "@/components/Avatar";
import { useIssues } from "@/hooks/useJiraIssues";
import { db } from "@/db/database";
import { useDatabase } from "@/hooks/useDatabase";

// Custom Filter icon matching Linear design - funnel shape with decreasing widths, left-aligned
const FilterIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
    <line x1="2" y1="5" x2="12" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2" y1="8" x2="9" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2" y1="11" x2="7" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

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

// Two stacked rotated squares (diamonds) with plus sign - matching the provided icon
const StackedDiamondsPlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
    {/* Bottom diamond (base layer) */}
    <rect
      x="4"
      y="4"
      width="8"
      height="8"
      transform="rotate(45 8 8)"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Top diamond (with plus sign) */}
    <rect
      x="3"
      y="3"
      width="8"
      height="8"
      transform="rotate(45 7 7)"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Plus sign in the top diamond */}
    <line x1="7" y1="5" x2="7" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="5" y1="7" x2="9" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const tabs = [
  { name: "All issues", href: "/team/issues", icon: Copy },
  { name: "Active", href: "/team/issues/active", icon: HalfCircleIcon },
  { name: "Backlog", href: "/team/issues/backlog", icon: DottedCircleIcon },
];

const TeamIssues = () => {
  const location = useLocation();
  const { isReady } = useDatabase();
  const [isNewIssueModalOpen, setIsNewIssueModalOpen] = useState(false);

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

  // Fetch issues from JIRA API
  const { data: issues = [], isLoading, isError, error, refetch } = useIssues({
    projectKey: useApiData ? projectKey : undefined,
    enabled: useApiData,
    maxResults: 50,
  });

  // Determine active tab from URL
  const activeTab = (() => {
    const path = location.pathname;
    if (path.includes("/active")) return "active";
    if (path.includes("/backlog")) return "backlog";
    return "all";
  })();

  useEffect(() => {
    // Also load local issues for backward compatibility if API is disabled
    if (!useApiData) {
      const storedIssues = JSON.parse(localStorage.getItem("issues") || "[]");
      // Issues are already merged in the hook, but we can handle local-only mode here
    }
  }, [useApiData]);

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
    <div className="h-full flex flex-col bg-[#0D0F10]" style={{ marginTop: "8px" }}>
      {/* Top Navigation Tabs */}
      <div className="border-b px-3 md:px-5" style={{ borderColor: "#1A1C1E", paddingTop: "8px", paddingBottom: "8px" }}>
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
                    "flex items-center gap-2.5 h-8 rounded-lg transition-all duration-150 ease",
                    isActive
                      ? "" // Active styles via inline
                      : "" // Inactive styles via inline
                  )}
                  style={{
                    padding: "0 10px",
                    fontSize: "13px",
                    fontWeight: 500,
                    height: "32px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.35)",
                    ...(isActive
                      ? {
                          background: "#232527",
                          color: "#EDEDED",
                          border: "1px solid #404245",
                        }
                      : {
                          background: "transparent",
                          color: "#A0A0A0",
                          border: "1px solid transparent",
                        }),
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "#1A1C1E";
                      e.currentTarget.style.borderColor = "#2B2D2F";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                    }
                  }}
                >
                  <IconComponent className="w-4 h-4" style={{ color: isActive ? "#EDEDED" : "#A0A0A0" }} />
                  <span>{tab.name}</span>
                </NavLink>
              );
            })}
            
            {/* New Issue Button - positioned beside Backlog */}
            <button
              onClick={() => setIsNewIssueModalOpen(true)}
              className={cn(
                "flex items-center justify-center h-8 rounded-lg transition-all duration-150 ease"
              )}
              style={{
                padding: "0 8px",
                height: "32px",
                width: "32px",
                borderRadius: "8px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.35)",
                background: "transparent",
                color: "#A0A0A0",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1A1C1E";
                e.currentTarget.style.borderColor = "#2B2D2F";
                e.currentTarget.style.color = "#EDEDED";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.color = "#A0A0A0";
              }}
            >
              <StackedDiamondsPlusIcon className="w-4 h-4" />
            </button>
          </nav>

          {/* Right side icon - Stacked squares with plus */}
          <button className="transition-colors p-1" style={{ color: "#A0A0A0" }} onMouseEnter={(e) => e.currentTarget.style.color = "#EDEDED"} onMouseLeave={(e) => e.currentTarget.style.color = "#A0A0A0"}>
            <StackedSquaresPlusIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Display controls */}
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
      {!isLoading && !isError && filteredIssues.length > 0 ? (
        <div className="flex-1 overflow-y-auto px-3 md:px-5 py-3">
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
                    <span className="text-sm font-medium" style={{ color: "#EDEDED" }}>{status}</span>
                    <span className="text-xs" style={{ color: "#6F6F6F" }}>{statusIssues.length}</span>
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
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {statusIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="flex items-center gap-2.5 px-1 py-1.5 rounded-md hover:bg-surface/70 transition-colors group"
                    >
                      {/* Priority indicator */}
                      {getPriorityIcon(issue.priority)}
                      
                      {/* Issue ID */}
                      <span className="text-sm font-mono min-w-[50px]" style={{ color: "#6F6F6F" }}>
                        {issue.issueNumber}
                      </span>
                      
                      {/* Title */}
                      <span className="text-sm flex-1" style={{ color: "#EDEDED" }}>{issue.title}</span>
                      
                      {/* Assignee */}
                      <div className="flex items-center gap-2">
                        {getAssigneeDisplay(issue.assignee, currentUser)}
                        <span className="text-xs" style={{ color: "#6F6F6F" }}>
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
      
      {/* New Issue Modal */}
      <NewIssueModal
        open={isNewIssueModalOpen}
        onOpenChange={setIsNewIssueModalOpen}
        onIssueCreated={() => {
          // Issues will refresh automatically via the useIssues hook
          window.dispatchEvent(new Event('issuesUpdated'));
        }}
      />
    </div>
  );
};

export default TeamIssues;

