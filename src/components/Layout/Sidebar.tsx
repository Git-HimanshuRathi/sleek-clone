import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { 
  Inbox, 
  CheckSquare, 
  FolderKanban,
  LayoutGrid,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Users,
  FileUp,
  UserPlus,
  Github,
  Search,
  PenSquare,
  UserSquare,
  Pencil,
  Box,
  Layers,
  Layers2,
  Square,
  Plus,
  Copy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { NewIssueModal } from "@/components/NewIssueModal";
import { InvitePeopleModal } from "@/components/InvitePeopleModal";
import CustomizeSidebarModal from "@/components/CustomizeSidebarModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOnboarding } from "@/contexts/OnboardingContext";

// Focus/Target icon for "My issues" - central dot with four L-shaped brackets
const FocusIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Central dot */}
    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    {/* Top-left L bracket */}
    <line x1="3" y1="3" x2="3" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="3" y1="3" x2="6" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Top-right L bracket */}
    <line x1="13" y1="3" x2="13" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="13" y1="3" x2="10" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Bottom-left L bracket */}
    <line x1="3" y1="13" x2="3" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="3" y1="13" x2="6" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Bottom-right L bracket */}
    <line x1="13" y1="13" x2="13" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="13" y1="13" x2="10" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Solid chevron icons
const SolidChevronDown = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 9L2 5h8l-4 4z" fill="currentColor" />
  </svg>
);

const SolidChevronRight = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 2l4 4-4 4V2z" fill="currentColor" />
  </svg>
);

const mainNav = [
  { name: "Inbox", href: "/inbox", icon: Inbox },
  { name: "My issues", href: "/my-issues", icon: FocusIcon },
];

const allWorkspaceItems = [
  { id: "projects", name: "Projects", href: "/projects", icon: Box },
  { id: "views", name: "Views", href: "/views", icon: Layers2 },
  { id: "teams", name: "Teams", href: "/teams", icon: UserSquare },
  { id: "members", name: "Members", href: "/members", icon: Users },
];

const tryNav = [
  { name: "Import issues", href: "/import", icon: Copy },
  { name: "Invite people", href: "/invite", icon: Plus },
  { name: "Link GitHub", href: "/github", icon: Github },
];

interface SidebarProps {
  onCommandClick?: () => void;
  onWidthChange?: (width: number) => void;
  onToggleRef?: (toggleFn: () => void) => void;
  isMobile?: boolean;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export const Sidebar = ({ onCommandClick, onWidthChange, onToggleRef, isMobile = false, sidebarOpen = false, setSidebarOpen }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved === "true";
  });
  const [workspaceExpanded, setWorkspaceExpanded] = useState(true);
  const [teamsExpanded, setTeamsExpanded] = useState(true);
  const [teamExpanded, setTeamExpanded] = useState(true);
  const [tryExpanded, setTryExpanded] = useState(true);
  const [isNewIssueModalOpen, setIsNewIssueModalOpen] = useState(false);
  const [isInvitePeopleModalOpen, setIsInvitePeopleModalOpen] = useState(false);
  const [isCustomizeSidebarModalOpen, setIsCustomizeSidebarModalOpen] = useState(false);
  const [tempVisibleItem, setTempVisibleItem] = useState<"teams" | "members" | null>(null);
  const navigate = useNavigate();
  const { resetOnboarding } = useOnboarding();

  const sidebarWidth = isCollapsed ? 64 : 200;

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => {
      const newCollapsed = !prev;
      localStorage.setItem("sidebar-collapsed", String(newCollapsed));
      if (onWidthChange) {
        onWidthChange(newCollapsed ? 64 : 200);
      }
      return newCollapsed;
    });
  }, [onWidthChange]);

  // Notify parent of width change on initial mount and when collapsed state changes
  useEffect(() => {
    if (onWidthChange) {
      onWidthChange(sidebarWidth);
    }
  }, [sidebarWidth, onWidthChange]);

  // Expose toggle function to parent
  useEffect(() => {
    if (onToggleRef) {
      onToggleRef(toggleSidebar);
    }
  }, [onToggleRef, toggleSidebar]);

  const handleLogout = () => {
    // Clear localStorage immediately to prevent any redirects
    localStorage.removeItem("linear-onboarding-completed");
    localStorage.removeItem("linear-onboarding-step");
    
    // Use window.location for immediate hard navigation
    // This bypasses React Router completely and prevents ProtectedRoute from intercepting
    window.location.href = "/";
  };

  // Sidebar content component (reused for desktop and mobile)
  const SidebarContent = () => (
    <div className="bg-[#0B0B0D] flex flex-col h-full overflow-y-auto w-full">
        {/* User/Workspace selector */}
        <div className="p-2.5 pb-1.5">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn("flex items-center gap-2 px-2 h-8 rounded-md hover:bg-[#1A1C1E]", isCollapsed ? "w-full justify-center" : "flex-1")} style={{ transition: "opacity 120ms ease-in-out" }}>
                  <Avatar name="Hacakthon-L" size="xs" />
                  {!isCollapsed && (
                    <>
                      <span className="text-sm font-medium flex-1 text-left truncate" style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF" }}>Hacakthon-L...</span>
                      <div style={{ color: "#B4B5B8" }}>
                        <SolidChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={() => {
                  navigate("/settings");
                  if (isMobile && setSidebarOpen) {
                    setSidebarOpen(false);
                  }
                }}>
                  <span>Settings</span>
                  <DropdownMenuShortcut>G then S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsInvitePeopleModalOpen(true)}>
                  <span>Invite and manage members</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>Download desktop app</span>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Switch workspace</span>
                    <DropdownMenuShortcut>O then W</DropdownMenuShortcut>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>
                      <Avatar name="Hacakthon-L" size="xs" className="mr-2" />
                      <span>Hacakthon-L...</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <span>Log out</span>
                  <DropdownMenuShortcut>Alt ↑ Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {onCommandClick && (
              <button
                className="h-7 w-7 rounded-md hover:bg-[#1A1C1E] flex items-center justify-center"
                style={{ transition: "opacity 120ms ease-in-out" }}
                onClick={onCommandClick}
                title="Search"
              >
                <Search className="h-4 w-4" style={{ color: "#B4B5B8" }} />
              </button>
            )}
            <button
              className="h-7 w-7 rounded-md hover:bg-[#1A1C1E] flex items-center justify-center"
              style={{ transition: "opacity 120ms ease-in-out" }}
              onClick={() => setIsNewIssueModalOpen(true)}
              title="New issue"
            >
              <PenSquare className="h-4 w-4" style={{ color: "#B4B5B8" }} />
            </button>
          </div>
        </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-2 pt-0.5 overflow-y-auto">
        <div className="space-y-0.5 mb-2.5">
            {mainNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => {
                // Close sidebar on mobile when navigating
                if (isMobile && setSidebarOpen) {
                  setSidebarOpen(false);
                }
              }}
              className={({ isActive }) =>
                cn(
                  "flex items-center h-8 rounded-md",
                      isActive
                        ? "bg-[#232527] text-[#FFFFFF]"
                        : "text-[#E4E5E8] hover:bg-[#1A1C1E]",
                  isCollapsed ? "justify-center pl-0" : "gap-2 pl-2"
                )
              }
              style={{ transition: "opacity 120ms ease-in-out" }}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="w-4 h-4" style={{ color: "#B4B5B8" }} />
              {!isCollapsed && (
                <span className="text-sm font-medium" style={{ fontSize: "14px", fontWeight: 500 }}>{item.name}</span>
              )}
            </NavLink>
          ))}
        </div>

          {/* Workspace */}
          <div className="mb-2">
            {!isCollapsed && (
              <button
                onClick={() => setWorkspaceExpanded(!workspaceExpanded)}
                className="w-full px-2 py-1 flex items-center gap-1.5 mb-0.5"
                style={{ 
                  transition: "opacity 120ms ease-in-out",
                  fontSize: "11px", 
                  fontWeight: 500, 
                  textTransform: "none", 
                  letterSpacing: "0.5px",
                  color: "#B4B5B8"
                }}
              >
                <span>Workspace</span>
                {workspaceExpanded ? (
                  <SolidChevronDown className="w-3 h-3" />
                ) : (
                  <SolidChevronRight className="w-3 h-3" />
                )}
              </button>
            )}
          {(workspaceExpanded || isCollapsed) && (
          <div className="space-y-0">
            {allWorkspaceItems
              .filter((item) => {
                // Always show projects and views
                if (item.id === "projects" || item.id === "views") return true;
                // Show teams or members only if it's the temp visible item
                if (item.id === "teams" || item.id === "members") {
                  return tempVisibleItem === item.id;
                }
                return false;
              })
              .map((item) => (
                <NavLink
                  key={item.id}
                  to={item.href}
                  onClick={(e) => {
                    // Clear temp item when clicking projects or views
                    if (item.id === "projects" || item.id === "views") {
                      setTempVisibleItem(null);
                    }
                    // Close sidebar on mobile when navigating
                    if (isMobile && setSidebarOpen) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center h-7 rounded-md",
                      isActive
                        ? "bg-[#232527] text-[#FFFFFF]"
                        : "text-[#E4E5E8] hover:bg-[#1A1C1E]",
                      isCollapsed ? "justify-center pl-0" : "gap-1.5 pl-1.5"
                    )
                  }
                  style={{ transition: "opacity 120ms ease-in-out" }}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className="w-3.5 h-3.5" style={{ color: "#B4B5B8" }} />
                  {!isCollapsed && (
                    <span className="text-sm font-medium" style={{ fontSize: "13px", fontWeight: 500 }}>{item.name}</span>
                  )}
                </NavLink>
              ))}
            {/* More dropdown */}
            {!isCollapsed && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                      "w-full flex items-center gap-1.5 h-7 rounded-md text-[#E4E5E8] hover:bg-[#1A1C1E] pl-1.5"
                    )}
                    style={{ transition: "opacity 120ms ease-in-out" }}
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" style={{ color: "#B4B5B8" }} />
                    <span className="text-sm font-medium" style={{ fontSize: "13px", fontWeight: 500 }}>More</span>
                  </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="min-w-[180px] rounded-lg shadow-lg"
                style={{
                  backgroundColor: "#242424",
                  border: "none",
                  padding: "4px",
                }}
              >
                {tempVisibleItem !== "teams" && (
                  <DropdownMenuItem
                    onClick={() => {
                      setTempVisibleItem("teams");
                      navigate("/teams");
                      if (isMobile && setSidebarOpen) {
                        setSidebarOpen(false);
                      }
                    }}
                    className="rounded-md px-3 py-2 cursor-pointer"
                    style={{
                      color: "#FFFFFF",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2A2A2A";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <UserSquare className="w-4 h-4 mr-3" style={{ color: "#B4B5B8" }} />
                    <span style={{ fontSize: "14px" }}>Teams</span>
                  </DropdownMenuItem>
                )}
                {tempVisibleItem !== "members" && (
                  <DropdownMenuItem
                    onClick={() => {
                      setTempVisibleItem("members");
                      navigate("/members");
                      if (isMobile && setSidebarOpen) {
                        setSidebarOpen(false);
                      }
                    }}
                    className="rounded-md px-3 py-2 cursor-pointer"
                    style={{
                      color: "#FFFFFF",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2A2A2A";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <Users className="w-4 h-4 mr-3" style={{ color: "#B4B5B8" }} />
                    <span style={{ fontSize: "14px" }}>Members</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => setIsCustomizeSidebarModalOpen(true)} 
                  className="rounded-md px-3 py-2 cursor-pointer"
                  style={{
                    color: "#FFFFFF",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#2A2A2A";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <Pencil className="w-4 h-4 mr-3" style={{ color: "#B4B5B8" }} />
                  <span style={{ fontSize: "14px" }}>Customize sidebar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            )}
          </div>
          )}
        </div>

        {/* Your teams */}
        {!isCollapsed && (
          <div className="mb-2">
            <button
              onClick={() => setTeamsExpanded(!teamsExpanded)}
              className="w-full px-2 py-1 flex items-center gap-1.5 mb-0.5"
              style={{ 
                transition: "opacity 120ms ease-in-out",
                fontSize: "11px", 
                fontWeight: 500, 
                textTransform: "none", 
                letterSpacing: "0.5px",
                color: "#B4B5B8"
              }}
            >
              <span>Your teams</span>
              {teamsExpanded ? (
                <SolidChevronDown className="w-3 h-3" />
              ) : (
                <SolidChevronRight className="w-3 h-3" />
              )}
            </button>
            {teamsExpanded && (
              <div className="space-y-0">
                <button
                  onClick={() => setTeamExpanded(!teamExpanded)}
                  className={cn("w-full flex items-center h-7 rounded-md text-[#E4E5E8] hover:bg-[#1A1C1E]", isCollapsed ? "justify-center pl-0" : "gap-1.5 pl-1.5")}
                  style={{ transition: "opacity 120ms ease-in-out" }}
                >
                  <Avatar name="Sst.scaler" size="xs" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left text-sm font-medium" style={{ fontSize: "13px", fontWeight: 500 }}>Sst.scaler</span>
                      <div style={{ color: "#B4B5B8" }}>
                        {teamExpanded ? (
                          <SolidChevronDown className="w-3 h-3" />
                        ) : (
                          <SolidChevronRight className="w-3 h-3" />
                        )}
                      </div>
                    </>
                  )}
                </button>
                {teamExpanded && !isCollapsed && (
                  <div className="ml-5 space-y-0">
                    <NavLink
                      to="/team/issues"
                      onClick={() => {
                        if (isMobile && setSidebarOpen) {
                          setSidebarOpen(false);
                        }
                      }}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-1.5 h-7 rounded-md pl-1.5",
                      isActive
                        ? "bg-[#232527] text-[#FFFFFF]"
                        : "text-[#E4E5E8] hover:bg-[#1A1C1E]"
                        )
                      }
                      style={{ transition: "opacity 120ms ease-in-out" }}
                    >
                      <Copy className="w-3.5 h-3.5" style={{ color: "#B4B5B8" }} />
                      <span className="text-sm font-medium" style={{ fontSize: "13px", fontWeight: 500 }}>Issues</span>
                    </NavLink>
                    <NavLink
                      to="/team/projects"
                      onClick={() => {
                        if (isMobile && setSidebarOpen) {
                          setSidebarOpen(false);
                        }
                      }}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-1.5 h-7 rounded-md pl-1.5",
                      isActive
                        ? "bg-[#232527] text-[#FFFFFF]"
                        : "text-[#E4E5E8] hover:bg-[#1A1C1E]"
                        )
                      }
                      style={{ transition: "opacity 120ms ease-in-out" }}
                    >
                      <Box className="w-3.5 h-3.5" style={{ color: "#B4B5B8" }} />
                      <span className="text-sm font-medium" style={{ fontSize: "13px", fontWeight: 500 }}>Projects</span>
                    </NavLink>
                    <NavLink
                      to="/team/views"
                      onClick={() => {
                        if (isMobile && setSidebarOpen) {
                          setSidebarOpen(false);
                        }
                      }}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-1.5 h-7 rounded-md pl-1.5",
                      isActive
                        ? "bg-[#232527] text-[#FFFFFF]"
                        : "text-[#E4E5E8] hover:bg-[#1A1C1E]"
                        )
                      }
                      style={{ transition: "opacity 120ms ease-in-out" }}
                    >
                      <Layers2 className="w-3.5 h-3.5" style={{ color: "#B4B5B8" }} />
                      <span className="text-sm font-medium" style={{ fontSize: "13px", fontWeight: 500 }}>Views</span>
                    </NavLink>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Try */}
        {!isCollapsed && (
          <div className="mb-2">
            <button
              onClick={() => setTryExpanded(!tryExpanded)}
              className="w-full px-2 py-1 flex items-center gap-1.5 mb-0.5"
              style={{ 
                transition: "opacity 120ms ease-in-out",
                fontSize: "11px", 
                fontWeight: 500, 
                textTransform: "none", 
                letterSpacing: "0.5px",
                color: "#B4B5B8"
              }}
            >
              <span>Try</span>
              {tryExpanded ? (
                <SolidChevronDown className="w-3 h-3" />
              ) : (
                <SolidChevronRight className="w-3 h-3" />
              )}
            </button>
            {tryExpanded && (
            <div className="space-y-0">
              {tryNav.map((item) => {
                // Special handling for "Invite people" - use button instead of NavLink
                if (item.name === "Invite people") {
                  return (
                    <button
                      key={item.name}
                      onClick={() => setIsInvitePeopleModalOpen(true)}
                      className={cn(
                        "w-full flex items-center gap-1.5 h-7 rounded-md text-[#E4E5E8] hover:bg-[#1A1C1E] pl-1.5"
                      )}
                      style={{ transition: "opacity 120ms ease-in-out" }}
                    >
                      <item.icon className="w-3.5 h-3.5" style={{ color: "#B4B5B8" }} />
                      <span className="text-sm font-medium" style={{ fontSize: "13px", fontWeight: 500 }}>{item.name}</span>
                    </button>
                  );
                }
                
                // Regular NavLink for other items
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => {
                      if (isMobile && setSidebarOpen) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-1.5 h-7 rounded-md pl-1.5",
                      isActive
                        ? "bg-[#232527] text-[#FFFFFF]"
                        : "text-[#E4E5E8] hover:bg-[#1A1C1E]"
                      )
                    }
                    style={{ transition: "opacity 120ms ease-in-out" }}
                  >
                    <item.icon 
                      className="w-3.5 h-3.5" 
                      style={{ 
                        color: "#B4B5B8",
                        transform: item.name === "Import issues" ? "rotate(180deg)" : "none"
                      }} 
                    />
                    <span className="text-sm font-medium" style={{ fontSize: "13px", fontWeight: 500 }}>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );

  // On mobile, wrap in Sheet; on desktop, use fixed sidebar
  if (isMobile) {
    return (
      <>
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-[280px] p-0 bg-[#0B0B0D] border-r border-border">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <NewIssueModal
          open={isNewIssueModalOpen}
          onOpenChange={setIsNewIssueModalOpen}
        />
        <InvitePeopleModal
          open={isInvitePeopleModalOpen}
          onOpenChange={setIsInvitePeopleModalOpen}
        />
        <CustomizeSidebarModal
          open={isCustomizeSidebarModalOpen}
          onOpenChange={setIsCustomizeSidebarModalOpen}
        />
      </>
    );
  }

  return (
    <>
      <aside 
        className="bg-[#0B0B0D] hidden md:flex flex-col h-full fixed left-0 top-0 overflow-y-auto transition-all duration-200 ease-in-out z-30"
        style={{ width: `${sidebarWidth}px` }}
      >
        <SidebarContent />
      </aside>

      <NewIssueModal
      open={isNewIssueModalOpen}
      onOpenChange={setIsNewIssueModalOpen}
    />
    <InvitePeopleModal
      open={isInvitePeopleModalOpen}
      onOpenChange={setIsInvitePeopleModalOpen}
    />
    <CustomizeSidebarModal
      open={isCustomizeSidebarModalOpen}
      onOpenChange={setIsCustomizeSidebarModalOpen}
    />
    </>
  );
};
