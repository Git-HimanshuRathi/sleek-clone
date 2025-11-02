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
  Pencil
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

const mainNav = [
  { name: "Inbox", href: "/inbox", icon: Inbox },
  { name: "My issues", href: "/my-issues", icon: CheckSquare },
];

const allWorkspaceItems = [
  { id: "projects", name: "Projects", href: "/projects", icon: FolderKanban },
  { id: "views", name: "Views", href: "/views", icon: LayoutGrid },
  { id: "teams", name: "Teams", href: "/teams", icon: UserSquare },
  { id: "members", name: "Members", href: "/members", icon: Users },
];

const tryNav = [
  { name: "Import issues", href: "/import", icon: FileUp },
  { name: "Invite people", href: "/invite", icon: UserPlus },
  { name: "Link GitHub", href: "/github", icon: Github },
];

interface SidebarProps {
  onCommandClick?: () => void;
}

export const Sidebar = ({ onCommandClick }: SidebarProps) => {
  const [teamsExpanded, setTeamsExpanded] = useState(true);
  const [teamExpanded, setTeamExpanded] = useState(true);
  const [isNewIssueModalOpen, setIsNewIssueModalOpen] = useState(false);
  const [isInvitePeopleModalOpen, setIsInvitePeopleModalOpen] = useState(false);
  const [isCustomizeSidebarModalOpen, setIsCustomizeSidebarModalOpen] = useState(false);
  const [tempVisibleItem, setTempVisibleItem] = useState<"teams" | "members" | null>(null);
  const navigate = useNavigate();
  const { resetOnboarding } = useOnboarding();

  const handleLogout = () => {
    resetOnboarding();
    navigate("/");
  };

  return (
    <>
      <aside className="w-60 border-r border-border bg-sidebar-background flex flex-col text-sm">
        {/* User/Workspace selector */}
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex-1 flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-surface transition-colors">
                  <Avatar name="Hacakthon-L" size="xs" />
                  <span className="font-medium text-sidebar-foreground flex-1 text-left truncate">Hacakthon-L...</span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
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
      <nav className="flex-1 px-2 py-2 overflow-y-auto">
        <div className="space-y-0.5 mb-4">
          {mainNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors",
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
        <div className="mb-4">
          <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            Workspace
          </div>
          <div className="space-y-0.5">
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
                      "flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors",
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
                    "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors text-sidebar-foreground hover:bg-surface"
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
        </div>

        {/* Your teams */}
        <div className="mb-4">
          <button
            onClick={() => setTeamsExpanded(!teamsExpanded)}
            className="w-full px-2 py-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors mb-1"
          >
            {teamsExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
            Your teams
          </button>
          {teamsExpanded && (
            <div className="space-y-0.5">
              <button
                onClick={() => setTeamExpanded(!teamExpanded)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sidebar-foreground hover:bg-surface transition-colors"
              >
                <Avatar name="Sst.scaler" size="xs" />
                <span className="flex-1 text-left">Sst.scaler</span>
                {teamExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>
              {teamExpanded && (
                <div className="ml-6 space-y-0.5">
                  <NavLink
                    to="/team/issues"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-surface"
                      )
                    }
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>Issues</span>
                  </NavLink>
                  <NavLink
                    to="/team/projects"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-surface"
                      )
                    }
                  >
                    <FolderKanban className="w-4 h-4" />
                    <span>Projects</span>
                  </NavLink>
                  <NavLink
                    to="/team/views"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-surface"
                      )
                    }
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span>Views</span>
                  </NavLink>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Try */}
        <div className="mb-4">
          <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            Try
          </div>
          <div className="space-y-0.5">
            {tryNav.map((item) => {
              // Special handling for "Invite people" - use button instead of NavLink
              if (item.name === "Invite people") {
                return (
                  <button
                    key={item.name}
                    onClick={() => setIsInvitePeopleModalOpen(true)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors text-sidebar-foreground hover:bg-surface"
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
                      "flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors",
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
