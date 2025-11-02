import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  Inbox, 
  CheckSquare, 
  FolderKanban,
  LayoutGrid,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Users,
  HelpCircle,
  CreditCard,
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

// Dashed square icon for "My issues"
const DashedSquare = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="2"
      width="12"
      height="12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="2 2"
      fill="none"
    />
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
  { name: "My issues", href: "/my-issues", icon: DashedSquare },
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
}

export const Sidebar = ({ onCommandClick }: SidebarProps) => {
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

  const handleLogout = () => {
    // Clear localStorage immediately to prevent any redirects
    localStorage.removeItem("linear-onboarding-completed");
    localStorage.removeItem("linear-onboarding-step");
    
    // Use window.location for immediate hard navigation
    // This bypasses React Router completely and prevents ProtectedRoute from intercepting
    window.location.href = "/";
  };

  return (
    <>
      <aside className="w-60 border-r border-border bg-[#090909] flex flex-col text-[13px]">
        {/* User/Workspace selector */}
        <div className="p-2.5 pb-1.5">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex-1 flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-surface transition-colors">
                  <Avatar name="Hacakthon-L" size="xs" />
                  <span className="text-sm font-medium text-sidebar-foreground flex-1 text-left truncate">Hacakthon-L...</span>
                  <SolidChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={() => navigate("/settings")}>
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
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-surface"
                onClick={onCommandClick}
              >
                <Search className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-surface"
              onClick={() => setIsNewIssueModalOpen(true)}
            >
              <PenSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-2 pt-0.5 overflow-y-auto">
        <div className="space-y-0.5 mb-2.5">
          {mainNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 py-1.5 rounded-md transition-colors pl-[10px]",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-surface"
                )
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Workspace */}
        <div className="mb-3">
          <button
            onClick={() => setWorkspaceExpanded(!workspaceExpanded)}
            className="w-full px-2 py-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground tracking-wider hover:text-foreground transition-colors mb-1"
          >
            <span>Workspace</span>
            {workspaceExpanded ? (
              <SolidChevronDown className="w-3 h-3" />
            ) : (
              <SolidChevronRight className="w-3 h-3" />
            )}
          </button>
          {workspaceExpanded && (
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
                  }}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 py-1.5 rounded-md transition-colors pl-[10px]",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-surface"
                    )
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            {/* More dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center gap-2 py-1.5 rounded-md transition-colors text-sidebar-foreground hover:bg-surface pl-[10px]"
                  )}
                >
                  <MoreHorizontal className="w-4 h-4" />
                  <span>More</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44 !bg-[#1c1d1f] !border-[#383b42] p-0.5">
                {tempVisibleItem !== "members" && (
                  <DropdownMenuItem
                    onClick={() => {
                      setTempVisibleItem("members");
                      navigate("/members");
                    }}
                    className="py-1 hover:!bg-[#292b30] focus:!bg-[#292b30]"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    <span>Members</span>
                  </DropdownMenuItem>
                )}
                {tempVisibleItem !== "teams" && (
                  <DropdownMenuItem
                    onClick={() => {
                      setTempVisibleItem("teams");
                      navigate("/teams");
                    }}
                    className="py-1 hover:!bg-[#292b30] focus:!bg-[#292b30]"
                  >
                    <UserSquare className="w-4 h-4 mr-2" />
                    <span>Teams</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsCustomizeSidebarModalOpen(true)} className="py-1 hover:!bg-[#292b30] focus:!bg-[#292b30]">
                  <Pencil className="w-4 h-4 mr-2" />
                  <span>Customize sidebar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          )}
        </div>

        {/* Your teams */}
        <div className="mb-3">
          <button
            onClick={() => setTeamsExpanded(!teamsExpanded)}
            className="w-full px-2 py-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground tracking-wider hover:text-foreground transition-colors mb-1"
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
                className="w-full flex items-center gap-2 py-1.5 rounded-md text-sidebar-foreground hover:bg-surface transition-colors pl-[10px]"
              >
                <Avatar name="Sst.scaler" size="xs" />
                <span className="flex-1 text-left">Sst.scaler</span>
                {teamExpanded ? (
                  <SolidChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <SolidChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>
              {teamExpanded && (
                <div className="ml-6 space-y-0">
                  <NavLink
                    to="/team/issues"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 py-1.5 rounded-md transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-surface"
                      )
                    }
                  >
                    <Copy className="w-4 h-4" />
                    <span>Issues</span>
                  </NavLink>
                  <NavLink
                    to="/team/projects"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 py-1.5 rounded-md transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-surface"
                      )
                    }
                  >
                    <Box className="w-4 h-4" />
                    <span>Projects</span>
                  </NavLink>
                  <NavLink
                    to="/team/views"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 py-1.5 rounded-md transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-surface"
                      )
                    }
                  >
                    <Layers2 className="w-4 h-4" />
                    <span>Views</span>
                  </NavLink>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Try */}
        <div className="mb-3">
          <button
            onClick={() => setTryExpanded(!tryExpanded)}
            className="w-full px-2 py-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground tracking-wider hover:text-foreground transition-colors mb-1"
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
                      "w-full flex items-center gap-2 py-1.5 rounded-md transition-colors text-sidebar-foreground hover:bg-surface pl-[10px]"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                );
              }
              
              // Regular NavLink for other items
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 py-1.5 rounded-md transition-colors pl-[10px]",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-surface"
                    )
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
          )}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="p-2 border-t border-border flex items-center gap-2">
        <button className="p-1.5 rounded-md hover:bg-surface transition-colors">
          <HelpCircle className="w-4 h-4 text-muted-foreground" />
        </button>
        <button className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-surface transition-colors flex-1">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground text-xs">Free plan</span>
        </button>
      </div>
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
