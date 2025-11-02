import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft } from "lucide-react";

// Default team icon - person silhouette
const TeamIcon = ({ color = "#6F7074" }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" fill={color} />
    <path d="M6 21c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

const colorOptions = [
  { name: "Grey", value: "#6F7074" },
  { name: "Green", value: "#22C55E" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Purple", value: "#A855F7" },
  { name: "Orange", value: "#F97316" },
  { name: "Red", value: "#EF4444" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Pink", value: "#EC4899" },
];

const CreateTeam = () => {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [copyFromTeam, setCopyFromTeam] = useState("dont-copy");
  const [timezone, setTimezone] = useState("GMT+5:30 - India Standard Time - Kolkata");
  const [iconColor, setIconColor] = useState("#6F7074");
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const handleCreate = () => {
    if (!teamName.trim()) {
      alert("Please enter a team name");
      return;
    }

    // Get existing teams from localStorage
    const existingTeams = JSON.parse(localStorage.getItem("teams") || "[]");
    
    // Create new team object
    const newTeam = {
      id: `team-${Date.now()}`,
      name: teamName.trim(),
      identifier: identifier.trim().toUpperCase() || teamName.slice(0, 3).toUpperCase(),
      iconColor: iconColor,
      timezone: timezone,
      visibility: "Workspace", // Default to public/workspace
      members: 1, // Creator is first member
      issues: 0,
      createdAt: new Date().toISOString(),
      createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };

    // Add new team to the list
    const updatedTeams = [...existingTeams, newTeam];
    
    // Save to localStorage
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("teamsUpdated"));
    
    // Navigate back to settings with teams section
    navigate("/settings?section=admin-teams");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#0F0F0F] border-r border-[#1A1C1E] p-4 overflow-y-auto">
        <button
          onClick={() => navigate("/settings")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to app
        </button>

        <div className="space-y-6">
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Projects</div>
            <div className="space-y-1">
              <a href="#" className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground">Labels</a>
              <a href="#" className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground">Templates</a>
              <a href="#" className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground">Statuses</a>
              <a href="#" className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground">Updates</a>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Features</div>
            <div className="space-y-1">
              <a href="#" className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground">Initiatives</a>
              <a href="#" className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground">Documents</a>
              <a href="#" className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground">Customer requests</a>
              <a href="#" className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground">Pulse</a>
              <a href="#" className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground">AI</a>
              <a href="#" className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground">Agents</a>
              <a href="#" className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground">Asks</a>
              <a href="#" className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground">Emojis</a>
              <a href="#" className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground">Integrations</a>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Administration</div>
            <div className="space-y-1">
              <a href="#" className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground">Workspace</a>
              <a href="#" className="block px-2 py-1 text-sm bg-muted/30 text-foreground rounded">Teams</a>
              <a href="#" className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground">Members</a>
              <a href="#" className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground">Security</a>
              <a href="#" className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground">API</a>
              <a href="#" className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground">Applications</a>
              <a href="#" className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground">Billing</a>
              <a href="#" className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground">Import / Export</a>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Your teams</div>
            <div className="space-y-1">
              <a href="#" className="flex items-center gap-2 px-2 py-1 text-sm text-muted-foreground hover:text-foreground">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">L</span>
                </div>
                Lakshya
              </a>
              <a href="#" className="block px-2 py-1 text-sm text-foreground font-medium">+ Create a team</a>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <button className="p-2 text-muted-foreground hover:text-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-3xl mx-auto p-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Create a new team
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Create a new team to manage separate cycles, workflows and notifications
          </p>

          <div className="space-y-8">
            {/* Team Details */}
            <div className="bg-[#17181B] border border-[#2d3036] rounded p-4 space-y-4">
              <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
                <Label htmlFor="team-icon" className="text-sm text-foreground">
                  Team icon
                </Label>
                <div className="flex justify-end">
                  <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-10 h-10 bg-background border border-[#2d3036] rounded flex items-center justify-center hover:bg-[#1a1b1e] transition-colors"
                      >
                        <TeamIcon color={iconColor} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2 bg-[#17181B] border-[#2d3036]">
                      <div className="grid grid-cols-4 gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => {
                              setIconColor(color.value);
                              setColorPickerOpen(false);
                            }}
                            className={`w-8 h-8 rounded border-2 transition-all ${
                              iconColor === color.value
                                ? "border-foreground scale-110"
                                : "border-[#2d3036] hover:border-[#3d4046]"
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="border-t border-[#2d3036]"></div>

              <div className="grid grid-cols-[200px_1fr] gap-6 items-center">
                <Label htmlFor="team-name" className="text-sm text-foreground">
                  Team name
                </Label>
                <div className="flex justify-end">
                  <Input
                    id="team-name"
                    className="bg-background border-[#2d3036] text-foreground w-[300px]"
                    placeholder="e.g. Engineering"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>
              </div>

              <div className="border-t border-[#2d3036]"></div>

              <div className="grid grid-cols-[200px_1fr] gap-6 items-start">
                <div>
                  <Label htmlFor="identifier" className="text-sm text-foreground">
                    Identifier
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Used to identify issues from this team (e.g. ENG-123)
                  </p>
                </div>
                <div className="flex justify-end">
                  <Input
                    id="identifier"
                    className="bg-background border-[#2d3036] text-foreground w-[300px]"
                    placeholder="e.g. ENG"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Team hierarchy */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-1">Team hierarchy</h3>
                <p className="text-xs text-muted-foreground">
                  Teams can be nested to reflect your team structure and to share workflows and settings.
                </p>
              </div>
              <div className="bg-[#17181B] border border-[#2d3036] rounded p-4 flex items-center justify-between">
                <Label className="text-sm text-foreground">
                  Parent team
                </Label>
                <span 
                  className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => navigate("/settings?section=admin-billing")}
                >
                  Available on Business
                </span>
              </div>
            </div>

            {/* Copy settings from existing team */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-1">
                  Copy settings from existing team
                </h3>
                <p className="text-xs text-muted-foreground">
                  You can choose to copy the settings of an existing team for your newly created team. All settings including workflow and cycle settings are copied, but Slack notification settings and team members won't be copied.
                </p>
              </div>
              <div className="bg-[#17181B] border border-[#2d3036] rounded p-4">
                <div className="grid grid-cols-[200px_1fr] gap-6 items-center">
                  <Label htmlFor="copy-from-team" className="text-sm text-foreground">
                    Copy from team
                  </Label>
                  <div className="flex justify-end">
                    <Select value={copyFromTeam} onValueChange={setCopyFromTeam}>
                      <SelectTrigger
                        id="copy-from-team"
                        className="bg-background border-[#2d3036] text-foreground w-auto px-3 py-2 h-auto"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dont-copy">Don't copy</SelectItem>
                        <SelectItem value="lakshya">Lakshya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Timezone */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-1">Timezone</h3>
                <p className="text-xs text-muted-foreground">
                  The timezone should be set as the location where most of your team members reside. All other times referenced by the team will be relative to this timezone setting. For example, if the team uses cycles, each cycle will start at midnight in the specified timezone.
                </p>
              </div>
              <div className="bg-[#17181B] border border-[#2d3036] rounded p-4">
                <div className="grid grid-cols-[200px_1fr] gap-6 items-center">
                  <Label htmlFor="timezone" className="text-sm text-foreground">
                    Timezone
                  </Label>
                  <div className="flex justify-end">
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger
                        id="timezone"
                        className="bg-background border-[#2d3036] text-foreground w-auto px-3 py-2 h-auto"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GMT+5:30 - India Standard Time - Kolkata">
                          GMT+5:30 - India Standard Time - Kolkata
                        </SelectItem>
                        <SelectItem value="GMT+0:00 - Greenwich Mean Time - London">
                          GMT+0:00 - Greenwich Mean Time - London
                        </SelectItem>
                        <SelectItem value="GMT-5:00 - Eastern Standard Time - New York">
                          GMT-5:00 - Eastern Standard Time - New York
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Make team private */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-1">
                  Make team private
                </h3>
                <p className="text-xs text-muted-foreground">
                  Private teams and their issues are only visible to members of the team and admins. Only admins and team owners can add new users to a private team. Public teams and their issues are visible to anyone in the workspace.
                </p>
              </div>
              <div className="bg-[#17181B] border border-[#2d3036] rounded p-4 flex items-center justify-between">
                <Label className="text-sm text-foreground">
                  Private team
                </Label>
                <span 
                  className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => navigate("/settings?section=admin-billing")}
                >
                  Available on Business
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end pt-4 border-t border-border">
              <Button
                onClick={handleCreate}
                className="bg-[#5E6AD2] hover:bg-[#6B77E0] text-white"
              >
                Create team
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;

