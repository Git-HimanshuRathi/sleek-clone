import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { SlidersHorizontal, Plus, Save, BookOpen, Layers2, Star, MoreHorizontal, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { NewViewModal } from "@/components/NewViewModal";
import { useIssues } from "@/hooks/useJiraIssues";
import { useDatabase } from "@/hooks/useDatabase";
import { db } from "@/db/database";
import { Issue } from "@/components/NewIssueModal";

// Custom stack icon with thin lines (matching Linear design)
const StackedCardsIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    width="56" 
    height="56" 
    viewBox="0 0 56 56" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Bottom card */}
    <rect x="6" y="20" width="36" height="28" rx="1.5" stroke="currentColor" strokeWidth="1" fill="none" />
    <line x1="10" y1="28" x2="38" y2="28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
    <line x1="10" y1="36" x2="38" y2="36" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
    
    {/* Middle card */}
    <rect x="10" y="14" width="36" height="28" rx="1.5" stroke="currentColor" strokeWidth="1" fill="none" />
    <line x1="14" y1="22" x2="42" y2="22" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
    <line x1="14" y1="30" x2="42" y2="30" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
    
    {/* Top card */}
    <rect x="14" y="8" width="36" height="28" rx="1.5" stroke="currentColor" strokeWidth="1" fill="none" />
    <line x1="18" y1="16" x2="46" y2="16" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
    <line x1="18" y1="24" x2="46" y2="24" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
  </svg>
);

interface View {
  id: string;
  name: string;
  description?: string;
  filters: {
    status?: string[];
    priority?: string[];
    assignee?: string;
    label?: string[];
    project?: string;
  };
  sortBy?: string;
  groupBy?: string;
  isFavorite?: boolean;
  createdAt: string;
}

const Views = () => {
  const navigate = useNavigate();
  const [displayMenuOpen, setDisplayMenuOpen] = useState(false);
  const [isNewViewModalOpen, setIsNewViewModalOpen] = useState(false);
  const [views, setViews] = useState<View[]>([]);
  const [selectedView, setSelectedView] = useState<View | null>(null);
  const [viewIssues, setViewIssues] = useState<Issue[]>([]);
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

  useEffect(() => {
    const loadViews = () => {
      const storedViews = localStorage.getItem("views");
      if (storedViews) {
        setViews(JSON.parse(storedViews));
      }
    };

    loadViews();

    // Listen for view updates
    const handleViewsUpdated = () => {
      loadViews();
    };

    window.addEventListener("viewsUpdated", handleViewsUpdated);
    return () => {
      window.removeEventListener("viewsUpdated", handleViewsUpdated);
    };
  }, []);

  // Build JQL query from view filters
  const buildJqlFromView = (view: View): string | undefined => {
    if (!useApiData || !projectKey) return undefined;
    
    const conditions: string[] = [`project=${projectKey}`];
    
    // Status filter
    if (view.filters.status && view.filters.status.length > 0) {
      const statusMap: Record<string, string> = {
        "Backlog": "Backlog",
        "Todo": "To Do",
        "In Progress": "In Progress",
        "Done": "Done",
        "Cancelled": "Cancelled",
      };
      const jiraStatuses = view.filters.status
        .map(s => statusMap[s] || s)
        .map(s => `"${s}"`);
      if (jiraStatuses.length > 0) {
        conditions.push(`status IN (${jiraStatuses.join(", ")})`);
      }
    }
    
    // Priority filter
    if (view.filters.priority && view.filters.priority.length > 0) {
      const priorityMap: Record<string, string> = {
        "Urgent": "Highest",
        "High": "High",
        "Medium": "Medium",
        "Low": "Low",
        "No priority": "Lowest",
      };
      const jiraPriorities = view.filters.priority
        .map(p => priorityMap[p] || p)
        .map(p => `"${p}"`);
      if (jiraPriorities.length > 0) {
        conditions.push(`priority IN (${jiraPriorities.join(", ")})`);
      }
    }
    
    // Assignee filter
    if (view.filters.assignee && view.filters.assignee.trim()) {
      conditions.push(`assignee IN ("${view.filters.assignee}")`);
    }
    
    // Label filter
    if (view.filters.label && view.filters.label.length > 0) {
      const labels = view.filters.label.map(l => `"${l}"`).join(", ");
      conditions.push(`labels IN (${labels})`);
    }
    
    // Project filter (already handled by projectKey)
    
    // Ordering
    let orderBy = "ORDER BY created DESC";
    if (view.sortBy === "updated") {
      orderBy = "ORDER BY updated DESC";
    } else if (view.sortBy === "priority") {
      orderBy = "ORDER BY priority DESC, created DESC";
    }
    
    return `${conditions.join(" AND ")} ${orderBy}`;
  };

  // Fetch issues when a view is selected
  const { data: fetchedIssues = [], isLoading, isError, error } = useIssues({
    projectKey: selectedView && useApiData ? projectKey : undefined,
    jql: selectedView ? buildJqlFromView(selectedView) : undefined,
    enabled: !!selectedView && useApiData,
    maxResults: 200,
  });

  useEffect(() => {
    if (selectedView && fetchedIssues.length > 0) {
      setViewIssues(fetchedIssues);
    } else if (selectedView && !useApiData) {
      // Fallback to client-side filtering when API is disabled
      try {
        const allIssues = db.getIssues();
        const filtered = allIssues.filter((issue: any) => {
          if (selectedView.filters.status && selectedView.filters.status.length > 0) {
            if (!selectedView.filters.status.includes(issue.status)) return false;
          }
          if (selectedView.filters.priority && selectedView.filters.priority.length > 0) {
            if (!selectedView.filters.priority.includes(issue.priority)) return false;
          }
          if (selectedView.filters.assignee && selectedView.filters.assignee.trim()) {
            if (issue.assignee !== selectedView.filters.assignee) return false;
          }
          if (selectedView.filters.label && selectedView.filters.label.length > 0) {
            const issueLabels = issue.labels || [];
            if (!selectedView.filters.label.some(label => issueLabels.includes(label))) return false;
          }
          return true;
        });
        setViewIssues(filtered);
      } catch (error) {
        console.error('Error filtering issues:', error);
        setViewIssues([]);
      }
    } else {
      setViewIssues([]);
    }
  }, [selectedView, fetchedIssues, useApiData]);

  const handleViewClick = (view: View) => {
    setSelectedView(view);
  };

  const handleBackToViews = () => {
    setSelectedView(null);
    setViewIssues([]);
  };

  const handleCreateNewView = () => {
    setIsNewViewModalOpen(true);
  };

  const handleViewCreated = () => {
    // Views will be reloaded via event listener
    setIsNewViewModalOpen(false);
  };

  const handleDeleteView = (viewId: string) => {
    if (confirm("Are you sure you want to delete this view?")) {
      const updatedViews = views.filter((v) => v.id !== viewId);
      setViews(updatedViews);
      localStorage.setItem("views", JSON.stringify(updatedViews));
      window.dispatchEvent(new Event("viewsUpdated"));
    }
  };

  const toggleFavorite = (viewId: string) => {
    const updatedViews = views.map((v) =>
      v.id === viewId ? { ...v, isFavorite: !v.isFavorite } : v
    );
    setViews(updatedViews);
    localStorage.setItem("views", JSON.stringify(updatedViews));
    window.dispatchEvent(new Event("viewsUpdated"));
  };

  const handleDocumentation = () => {
    // Open documentation in new tab
    window.open("https://linear.app/docs/views", "_blank");
  };

  const sortedViews = [...views].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Debug logging
  useEffect(() => {
    console.log("🔍 Views page debug:", {
      viewsCount: views.length,
      views: views,
      selectedView: selectedView?.name || null,
      viewIssuesCount: viewIssues.length,
      isReady,
      useApiData,
      projectKey,
      localStorageViews: localStorage.getItem("views"),
    });
  }, [views, selectedView, viewIssues, isReady, useApiData, projectKey]);

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: "linear-gradient(to bottom, #0d0d0e, #111113)", marginTop: "8px" }}>
      {/* Top Navigation Bar */}
      <div 
        className="flex items-center justify-between px-3 md:px-5 border-b"
        style={{ 
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          paddingTop: "8px",
          paddingBottom: "8px"
        }}
      >
        {/* Left Tabs */}
        <nav className="flex items-center gap-1.5 h-full">
          <NavLink
            to="/views"
            end
            className={({ isActive }) =>
              cn(
                "px-3 py-1.5 text-sm font-medium transition-colors rounded-md h-7 flex items-center",
                isActive
                  ? "text-white"
                  : "text-[#9B9CA0] hover:text-white"
              )
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#232527" : "transparent",
            } as CSSProperties)}
          >
            Views
          </NavLink>
          <NavLink
            to="/my-issues"
            className={({ isActive }) =>
              cn(
                "px-3 py-1.5 text-sm font-medium transition-colors rounded-md h-7 flex items-center",
                isActive
                  ? "text-white"
                  : "text-[#9B9CA0] hover:text-white"
              )
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#232527" : "transparent",
            } as CSSProperties)}
          >
            Issues
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              cn(
                "px-3 py-1.5 text-sm font-medium transition-colors rounded-md h-7 flex items-center",
                isActive
                  ? "text-white"
                  : "text-[#9B9CA0] hover:text-white"
              )
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#232527" : "transparent",
            } as CSSProperties)}
          >
            Projects
          </NavLink>
        </nav>

        {/* Right Buttons */}
        <div className="flex items-center gap-2 h-full">
          <DropdownMenu open={displayMenuOpen} onOpenChange={setDisplayMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-white border-transparent transition-all"
                style={{
                  backgroundColor: "#1A1C1E",
                  paddingLeft: "12px",
                  paddingRight: "12px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#232527";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#1A1C1E";
                }}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Display
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>Group by: Status</DropdownMenuItem>
              <DropdownMenuItem>Sort by: Created</DropdownMenuItem>
              <DropdownMenuItem>Show: All issues</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            onClick={handleCreateNewView}
            size="sm"
            className="h-7 text-white border-transparent transition-all"
            style={{
              backgroundColor: "#1A1C1E",
              paddingLeft: "12px",
              paddingRight: "12px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#232527";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#1A1C1E";
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New view
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {selectedView ? (
        /* View Detail - Show Issues */
        <div className="flex-1 overflow-y-auto px-3 md:px-5 py-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToViews}
                className="h-7 w-7"
              >
                ←
              </Button>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{selectedView.name}</h2>
                {selectedView.description && (
                  <p className="text-sm text-muted-foreground mt-1">{selectedView.description}</p>
                )}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : `${viewIssues.length} issues`}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading issues from JIRA...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {isError && !isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4 max-w-md text-center">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Failed to load issues</p>
                  <p className="text-xs text-muted-foreground">{error?.message || "Unknown error occurred"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Issues List */}
          {!isLoading && !isError && (
            <div className="space-y-2">
              {viewIssues.length > 0 ? (
                viewIssues.map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => navigate(`/my-issues/issue/${issue.id}`)}
                    className="p-3 rounded-md border border-border bg-transparent hover:bg-surface/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-xs text-muted-foreground font-mono">{issue.issueNumber}</span>
                        <span className="text-sm text-foreground truncate">{issue.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {issue.status && (
                          <span className="text-xs px-2 py-0.5 rounded bg-surface text-muted-foreground">
                            {issue.status}
                          </span>
                        )}
                        {issue.priority && issue.priority !== "No priority" && (
                          <span className="text-xs px-2 py-0.5 rounded bg-surface text-muted-foreground">
                            {issue.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-12 text-center">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">No issues found</p>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting your view filters or create a new view.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : views.length === 0 ? (
        /* Empty State */
        <div 
          className="flex-1 flex items-center justify-center overflow-y-auto"
          style={{ 
            paddingTop: "40px",
            paddingBottom: "40px",
          }}
        >
          <div 
            className="flex flex-col items-center text-center"
            style={{ maxWidth: "480px", padding: "0 24px" }}
          >
            {/* Icon */}
            <div style={{ marginBottom: "24px" }}>
              <StackedCardsIcon className="text-foreground" />
            </div>

            {/* Title */}
            <h1 
              className="text-foreground"
              style={{ 
                fontWeight: 600, 
                fontSize: "20px", 
                letterSpacing: "-0.01em",
                lineHeight: "1.2",
                marginBottom: "16px"
              }}
            >
              Views
            </h1>

            {/* Description */}
            <div 
              style={{ 
                color: "#9b9b9e",
                lineHeight: "1.45",
                fontSize: "14px",
                marginBottom: "28px"
              }}
            >
              <p style={{ marginBottom: "16px" }}>
                Create custom views using filters to show only the issues you want to see. You can save, share, and favorite these views for easy access and faster team collaboration.
              </p>
              <p>
                You can also save any existing view by clicking the{" "}
                <span className="inline-flex items-center justify-center w-4 h-4 mx-0.5 rounded border border-border bg-surface" style={{ verticalAlign: "middle" }}>
                  <Save className="w-2.5 h-2.5" />
                </span>{" "}
                icon or by pressing{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-xs font-mono" style={{ verticalAlign: "middle" }}>
                  ⌘V
                </kbd>
                .
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center" style={{ gap: "12px" }}>
              <Button
                onClick={handleCreateNewView}
                className="text-white transition-all"
                style={{
                  backgroundColor: "#7164ff",
                  border: "none",
                  padding: "8px 16px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#7f72ff";
                  e.currentTarget.style.boxShadow = "0 0 16px rgba(113, 100, 255, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#7164ff";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Create new view
              </Button>
              <Button
                onClick={handleDocumentation}
                variant="outline"
                className="text-foreground transition-all"
                style={{
                  backgroundColor: "#1d1d1f",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  padding: "8px 16px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#242426";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#1d1d1f";
                }}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Documentation
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Views List */
        <div className="flex-1 overflow-y-auto px-3 md:px-5 py-3">
          <div className="max-w-4xl mx-auto space-y-3">
            {sortedViews.map((view) => (
              <div
                key={view.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface hover:bg-surface/70 transition-colors group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleFavorite(view.id)}
                    className={cn(
                      "p-1 rounded hover:bg-surface/70 transition-colors",
                      view.isFavorite && "text-yellow-500"
                    )}
                  >
                    <Star
                      className={cn(
                        "w-4 h-4",
                        view.isFavorite ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                      )}
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground">{view.name}</h3>
                    {view.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{view.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      {view.filters.status && view.filters.status.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          Status: {view.filters.status.join(", ")}
                        </span>
                      )}
                      {view.filters.assignee && (
                        <span className="text-xs text-muted-foreground">
                          Assignee: {view.filters.assignee}
                        </span>
                      )}
                      {view.groupBy && (
                        <span className="text-xs text-muted-foreground">
                          Group by: {view.groupBy}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewClick(view)}
                    className="h-8 w-8"
                  >
                    <Layers2 className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewClick(view)}>
                        Open view
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleFavorite(view.id)}>
                        {view.isFavorite ? "Remove from favorites" : "Add to favorites"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteView(view.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete view
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <NewViewModal
        open={isNewViewModalOpen}
        onOpenChange={setIsNewViewModalOpen}
        onViewCreated={handleViewCreated}
      />
    </div>
  );
};

export default Views;
