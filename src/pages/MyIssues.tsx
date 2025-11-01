import { useState, useEffect } from "react";
import { NavLink, useParams, useLocation } from "react-router-dom";
import { Filter, SlidersHorizontal, CircleDot, ChevronDown, LayoutGrid, Loader2, Minus, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { NewIssueModal, Issue } from "@/components/NewIssueModal";
import { Avatar } from "@/components/Avatar";

const tabs = [
  { name: "My issues", href: "/my-issues" },
  { name: "Assigned", href: "/my-issues/assigned" },
  { name: "Created", href: "/my-issues/created" },
  { name: "Subscribed", href: "/my-issues/subscribed" },
  { name: "Activity", href: "/my-issues/activity" },
];

const MyIssues = () => {
  const { tab } = useParams<{ tab?: string }>();
  const location = useLocation();
  const [isNewIssueModalOpen, setIsNewIssueModalOpen] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Backlog: true,
    Todo: true,
    "In Progress": true,
    Done: true,
    Cancelled: true,
    Duplicate: true,
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
    loadIssues();
  }, []);

  const loadIssues = () => {
    const storedIssues = JSON.parse(localStorage.getItem("issues") || "[]");
    // Migrate old issues to include createdBy field if missing
    const migratedIssues = storedIssues.map((issue: Issue) => {
      if (!issue.createdBy) {
        // Default to assignee if createdBy is missing (for backward compatibility)
        issue.createdBy = issue.assignee || "LB Lakshya Bagani";
      }
      return issue;
    });
    // Save migrated issues back if there were changes
    if (migratedIssues.length > 0 && storedIssues.some((issue: Issue) => !issue.createdBy)) {
      localStorage.setItem("issues", JSON.stringify(migratedIssues));
    }
    setIssues(migratedIssues);
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

  const statusOrder = ["Backlog", "Todo", "In Progress", "Done", "Cancelled", "Duplicate"];
  const filteredIssues = getFilteredIssues();
  const hasIssues = filteredIssues.length > 0;

  const currentUser = "LB Lakshya Bagani";

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Tabs */}
      <div className="border-b border-border px-6 py-0">
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-1">
            {tabs.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.href}
                end
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-surface text-foreground"
                      : tab.name === "My issues"
                      ? "text-foreground hover:bg-surface/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface/30"
                  )
                }
              >
                {tab.name}
              </NavLink>
            ))}
          </nav>

          {/* Right side view icon */}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <LayoutGrid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filter and Display buttons */}
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
      {hasIssues ? (
        <div className="flex-1 overflow-y-auto px-6 py-3">
          {statusOrder.map((status) => {
            const statusIssues = getIssuesByStatus(status);
            if (statusIssues.length === 0) return null;

            const isExpanded = expandedSections[status];

            return (
              <div key={status} className="mb-3">
                <button
                  onClick={() => toggleSection(status)}
                  className="flex items-center gap-1.5 w-full py-1.5 text-sm text-foreground transition-colors hover:bg-surface/30 rounded-md px-1"
                >
                  <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", !isExpanded && "rotate-[-90deg]")} />
                  <Loader2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-medium">{status}</span>
                  <span className="text-xs text-muted-foreground">{statusIssues.length}</span>
                </button>

                {isExpanded && (
                  <div className="ml-5 mt-1">
                    {statusIssues.map((issue) => (
                      <div
                        key={issue.id}
                        className="flex items-center gap-2.5 px-1 py-1.5 rounded-md hover:bg-surface transition-colors group"
                      >
                        {/* Checkbox on far left */}
                        <Checkbox className="h-3.5 w-3.5" />
                        
                        {/* Dashed line icon */}
                        <Minus className="w-4 h-4 text-foreground" strokeDasharray="2 2" />
                        
                        {/* Issue ID */}
                        <span className="text-sm font-mono text-muted-foreground min-w-[50px]">{issue.issueNumber}</span>
                        
                        {/* Light gray circular icon */}
                        <Circle className="w-3 h-3 text-muted-foreground" fill="currentColor" />
                        
                        {/* Issue title */}
                        <span className="text-sm text-foreground flex-1">{issue.title}</span>
                        
                        {/* Assignee avatar and date */}
                        <div className="flex items-center gap-2">
                          <Avatar name={issue.assignee} size="xs" />
                          <span className="text-xs text-muted-foreground">{formatDate(issue.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
