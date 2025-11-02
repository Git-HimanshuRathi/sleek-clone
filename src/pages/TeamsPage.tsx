import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal, CheckCircle2, Circle, Plus, User, ArrowUpDown, Lock, Calendar, ChevronRight, Search, ChevronDown, ArrowDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar } from "@/components/Avatar";

// Custom Filter icon matching Linear design - funnel shape with decreasing widths, left-aligned
const FilterIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
    <line x1="2" y1="5" x2="12" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2" y1="8" x2="9" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2" y1="11" x2="7" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

interface Team {
  id: string;
  name: string;
  membership: "Joined" | "Invited";
  members: number;
  cycle: string;
  activeProjects: number;
  iconColor?: string;
  identifier?: string;
}

const TeamsPage = () => {
  const navigate = useNavigate();
  const [displayMenuOpen, setDisplayMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [orderingMenuOpen, setOrderingMenuOpen] = useState(false);
  const [filterInputMenuOpen, setFilterInputMenuOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [ordering, setOrdering] = useState("Name");
  const [displayProperties, setDisplayProperties] = useState({
    membership: true,
    projects: true,
    cycle: true,
    members: true,
    owners: false,
    created: false,
    updated: false,
  });

  // Load teams from localStorage
  useEffect(() => {
    const loadTeams = () => {
      try {
        const stored = localStorage.getItem("teams");
        if (!stored) {
          setTeams([]);
          return;
        }
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Map localStorage teams to display format
          const mappedTeams: Team[] = parsed.map((team: any) => ({
            id: team.id,
            name: team.name,
            membership: "Joined" as const, // Default to Joined for created teams
            members: team.members || 1,
            cycle: "-", // Not stored in localStorage, show "-"
            activeProjects: 0, // Not stored in localStorage, show 0
            iconColor: team.iconColor,
            identifier: team.identifier,
          }));
          setTeams(mappedTeams);
        } else {
          setTeams([]);
        }
      } catch {
        setTeams([]);
      }
    };

    loadTeams();
    
    // Listen for storage changes to update when teams are created elsewhere
    const handleStorageChange = () => {
      loadTeams();
    };
    
    window.addEventListener("storage", handleStorageChange);
    // Also listen for custom event if teams are updated in same tab
    window.addEventListener("teamsUpdated", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("teamsUpdated", handleStorageChange);
    };
  }, []);

  const teamsCount = teams.length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Header with Teams count and Action buttons */}
      <div className="px-5 pb-2 border-b flex items-center justify-between" style={{ borderColor: "#1A1C1E" }}>
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-medium text-foreground">Teams {teamsCount > 0 ? teamsCount : ""}</h1>
          {/* Display icon button next to Teams title */}
          <DropdownMenu open={displayMenuOpen} onOpenChange={setDisplayMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 p-0">
              {/* Ordering Section */}
              <div className="px-3 py-2 border-b border-border">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">Ordering</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs gap-1 border-border hover:bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          {ordering}
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => setOrdering("Name")} className="text-xs focus:bg-muted/50">
                          Name
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOrdering("Created")} className="text-xs focus:bg-muted/50">
                          Created
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOrdering("Updated")} className="text-xs focus:bg-muted/50">
                          Updated
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                          >
                            <ArrowDown className="w-3.5 h-3.5 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Sort direction</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
              
              {/* Display Properties Section */}
              <div className="px-3 py-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">Display properties</div>
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-6 px-2 text-xs border-border focus-visible:ring-0 focus-visible:ring-offset-0 ${
                      displayProperties.membership ? 'bg-muted/50 text-foreground' : 'bg-transparent text-muted-foreground hover:bg-muted/30'
                    }`}
                    onClick={() => setDisplayProperties({ ...displayProperties, membership: !displayProperties.membership })}
                  >
                    Membership
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-6 px-2 text-xs border-border focus-visible:ring-0 focus-visible:ring-offset-0 ${
                      displayProperties.projects ? 'bg-muted/50 text-foreground' : 'bg-transparent text-muted-foreground hover:bg-muted/30'
                    }`}
                    onClick={() => setDisplayProperties({ ...displayProperties, projects: !displayProperties.projects })}
                  >
                    Projects
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-6 px-2 text-xs border-border focus-visible:ring-0 focus-visible:ring-offset-0 ${
                      displayProperties.cycle ? 'bg-muted/50 text-foreground' : 'bg-transparent text-muted-foreground hover:bg-muted/30'
                    }`}
                    onClick={() => setDisplayProperties({ ...displayProperties, cycle: !displayProperties.cycle })}
                  >
                    Cycle
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-6 px-2 text-xs border-border focus-visible:ring-0 focus-visible:ring-offset-0 ${
                      displayProperties.members ? 'bg-muted/50 text-foreground' : 'bg-transparent text-muted-foreground hover:bg-muted/30'
                    }`}
                    onClick={() => setDisplayProperties({ ...displayProperties, members: !displayProperties.members })}
                  >
                    Members
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-6 px-2 text-xs border-border focus-visible:ring-0 focus-visible:ring-offset-0 ${
                      displayProperties.owners ? 'bg-muted/50 text-foreground' : 'bg-transparent text-muted-foreground hover:bg-muted/30'
                    }`}
                    onClick={() => setDisplayProperties({ ...displayProperties, owners: !displayProperties.owners })}
                  >
                    Owners
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-6 px-2 text-xs border-border focus-visible:ring-0 focus-visible:ring-offset-0 ${
                      displayProperties.created ? 'bg-muted/50 text-foreground' : 'bg-transparent text-muted-foreground hover:bg-muted/30'
                    }`}
                    onClick={() => setDisplayProperties({ ...displayProperties, created: !displayProperties.created })}
                  >
                    Created
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-6 px-2 text-xs border-border focus-visible:ring-0 focus-visible:ring-offset-0 ${
                      displayProperties.updated ? 'bg-muted/50 text-foreground' : 'bg-transparent text-muted-foreground hover:bg-muted/30'
                    }`}
                    onClick={() => setDisplayProperties({ ...displayProperties, updated: !displayProperties.updated })}
                  >
                    Updated
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
        {/* Filter button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                  </Button>
                </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-0">
              <div className="px-3 py-2 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Filter..."
                    className="pl-8 h-8 text-xs bg-[#17181B] border-[#2d3036] text-foreground"
                  />
                </div>
              </div>
            <div className="py-1">
              <DropdownMenuItem 
                className="flex items-center justify-between px-3 py-2 focus:bg-muted/50 focus:text-foreground"
                onFocus={(e) => e.currentTarget.style.outline = 'none'}
              >
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs">Members</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center justify-between px-3 py-2 focus:bg-muted/50 focus:text-foreground"
                onFocus={(e) => e.currentTarget.style.outline = 'none'}
              >
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs">Owners</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center justify-between px-3 py-2 focus:bg-muted/50 focus:text-foreground"
                onFocus={(e) => e.currentTarget.style.outline = 'none'}
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs">Private</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center justify-between px-3 py-2 focus:bg-muted/50 focus:text-foreground"
                onFocus={(e) => e.currentTarget.style.outline = 'none'}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs">Created date</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </DropdownMenuItem>
            </div>
            </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Filter</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Ordering button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu open={orderingMenuOpen} onOpenChange={setOrderingMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setOrdering("Name")} className="text-xs">
                Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOrdering("Created")} className="text-xs">
                Created
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOrdering("Updated")} className="text-xs">
                Updated
              </DropdownMenuItem>
            </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Ordering</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* New Team button */}
          <button
            className="flex items-center gap-1.5 h-7 px-2.5 rounded-md transition-colors text-xs"
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
            onClick={() => navigate("/settings?section=admin-teams")}
          >
            <Plus className="w-3.5 h-3.5" />
            New team
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="border-b flex items-center justify-between px-5 py-1.5" style={{ borderColor: "#1A1C1E" }}>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 gap-1.5 text-xs"
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
            <span>Filter</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {/* Display button with border */}
          <DropdownMenu open={displayMenuOpen} onOpenChange={setDisplayMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 gap-1.5 text-xs border-border hover:bg-muted/50"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Display
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-0">
              {/* Ordering Section */}
              <div className="px-3 py-2 border-b border-border">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">Ordering</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs gap-1 border-border hover:bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          {ordering}
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => setOrdering("Name")} className="text-xs focus:bg-muted/50">
                          Name
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOrdering("Created")} className="text-xs focus:bg-muted/50">
                          Created
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOrdering("Updated")} className="text-xs focus:bg-muted/50">
                          Updated
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                          >
                            <ArrowDown className="w-3.5 h-3.5 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Sort direction</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
              
              {/* Display Properties Section */}
              <div className="px-3 py-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">Display properties</div>
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-6 px-2 text-xs border-border focus-visible:ring-0 focus-visible:ring-offset-0 ${
                      displayProperties.membership ? 'bg-muted/50 text-foreground' : 'bg-transparent text-muted-foreground hover:bg-muted/30'
                    }`}
                    onClick={() => setDisplayProperties({ ...displayProperties, membership: !displayProperties.membership })}
                  >
                    Membership
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-6 px-2 text-xs border-border focus-visible:ring-0 focus-visible:ring-offset-0 ${
                      displayProperties.projects ? 'bg-muted/50 text-foreground' : 'bg-transparent text-muted-foreground hover:bg-muted/30'
                    }`}
                    onClick={() => setDisplayProperties({ ...displayProperties, projects: !displayProperties.projects })}
                  >
                    Projects
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-6 px-2 text-xs border-border focus-visible:ring-0 focus-visible:ring-offset-0 ${
                      displayProperties.cycle ? 'bg-muted/50 text-foreground' : 'bg-transparent text-muted-foreground hover:bg-muted/30'
                    }`}
                    onClick={() => setDisplayProperties({ ...displayProperties, cycle: !displayProperties.cycle })}
                  >
                    Cycle
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-6 px-2 text-xs border-border focus-visible:ring-0 focus-visible:ring-offset-0 ${
                      displayProperties.members ? 'bg-muted/50 text-foreground' : 'bg-transparent text-muted-foreground hover:bg-muted/30'
                    }`}
                    onClick={() => setDisplayProperties({ ...displayProperties, members: !displayProperties.members })}
                  >
                    Members
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-6 px-2 text-xs border-border focus-visible:ring-0 focus-visible:ring-offset-0 ${
                      displayProperties.owners ? 'bg-muted/50 text-foreground' : 'bg-transparent text-muted-foreground hover:bg-muted/30'
                    }`}
                    onClick={() => setDisplayProperties({ ...displayProperties, owners: !displayProperties.owners })}
                  >
                    Owners
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-6 px-2 text-xs border-border focus-visible:ring-0 focus-visible:ring-offset-0 ${
                      displayProperties.created ? 'bg-muted/50 text-foreground' : 'bg-transparent text-muted-foreground hover:bg-muted/30'
                    }`}
                    onClick={() => setDisplayProperties({ ...displayProperties, created: !displayProperties.created })}
                  >
                    Created
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-6 px-2 text-xs border-border focus-visible:ring-0 focus-visible:ring-offset-0 ${
                      displayProperties.updated ? 'bg-muted/50 text-foreground' : 'bg-transparent text-muted-foreground hover:bg-muted/30'
                    }`}
                    onClick={() => setDisplayProperties({ ...displayProperties, updated: !displayProperties.updated })}
                  >
                    Updated
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-5">
          {/* Table Header */}
          <div className="flex items-center py-2 border-b border-border">
            <div className="flex-1 text-xs font-medium text-muted-foreground">Name</div>
            <div className="flex items-center flex-shrink-0" style={{ width: '420px' }}>
              <div className="text-xs font-medium text-muted-foreground" style={{ width: '120px' }}>Membership</div>
              <div className="text-xs font-medium text-muted-foreground" style={{ width: '100px' }}>Members</div>
              <div className="text-xs font-medium text-muted-foreground" style={{ width: '100px' }}>Active projects</div>
              <div className="text-xs font-medium text-muted-foreground" style={{ width: '100px' }}>Cycle</div>
            </div>
          </div>

          {/* Table Rows */}
          {teams.length > 0 ? (
            teams.map((team) => (
              <div
                key={team.id}
                className="flex items-center py-2 border-b border-border hover:bg-muted/30 transition-colors"
              >
                {/* Name */}
                <div className="flex items-center gap-2 flex-1">
                  {team.iconColor ? (
                    <div 
                      className="w-6 h-6 rounded bg-[#17181B] border border-[#2d3036] flex items-center justify-center flex-shrink-0"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="4" fill={team.iconColor || "#6F7074"} />
                        <path d="M6 21c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke={team.iconColor || "#6F7074"} strokeWidth="2" strokeLinecap="round" fill="none" />
                      </svg>
                    </div>
                  ) : (
                    <Avatar name={team.name} size="sm" className="bg-green-500/20 text-green-500" />
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-foreground">{team.name}</span>
                    {team.identifier && (
                      <span className="text-xs font-mono text-muted-foreground">{team.identifier}</span>
                    )}
                  </div>
                </div>

                {/* Right side columns */}
                <div className="flex items-center flex-shrink-0" style={{ width: '420px' }}>
                  {/* Membership */}
                  <div className="flex items-center gap-1.5" style={{ width: '120px' }}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-sm text-foreground">{team.membership}</span>
                  </div>

                  {/* Members */}
                  <div className="flex items-center gap-1.5" style={{ width: '100px' }}>
                    <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <User className="w-3 h-3 text-orange-500" />
                    </div>
                    <span className="text-sm text-foreground">{team.members}</span>
                  </div>

                  {/* Active projects */}
                  <div className="text-sm text-foreground" style={{ width: '100px' }}>{team.activeProjects}</div>

                  {/* Cycle */}
                  <div className="flex items-center gap-1.5" style={{ width: '100px' }}>
                    <Circle className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm text-foreground">{team.cycle}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <div className="text-sm text-muted-foreground">No teams found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
