import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { User, ChevronDown } from "lucide-react";

interface CreateTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateTeamModal = ({ open, onOpenChange }: CreateTeamModalProps) => {
  const [teamName, setTeamName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [copyFromTeam, setCopyFromTeam] = useState("dont-copy");
  const [timezone, setTimezone] = useState("GMT+5:30 - India Standard Time - Kolkata");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleCreate = () => {
    // Handle team creation logic here
    console.log({
      teamName,
      identifier,
      copyFromTeam,
      timezone,
      isPrivate,
    });
    onOpenChange(false);
    // Reset form
    setTeamName("");
    setIdentifier("");
    setCopyFromTeam("dont-copy");
    setTimezone("GMT+5:30 - India Standard Time - Kolkata");
    setIsPrivate(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            Create a new team
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Create a new team to manage separate cycles, workflows and notifications
          </p>
        </DialogHeader>

        <div className="space-y-8 mt-6">
          {/* Team Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
              <Label htmlFor="team-icon" className="text-sm text-foreground">
                Team icon
              </Label>
              <div className="relative">
                <Input
                  id="team-icon"
                  className="bg-[#17181B] border-[#2d3036] text-foreground pr-10"
                  placeholder="Upload icon"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 border border-border rounded flex items-center justify-center">
                    <User className="w-3 h-3 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
              <Label htmlFor="team-name" className="text-sm text-foreground">
                Team name
              </Label>
              <Input
                id="team-name"
                className="bg-[#17181B] border-[#2d3036] text-foreground"
                placeholder="e.g. Engineering"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
              <div>
                <Label htmlFor="identifier" className="text-sm text-foreground">
                  Identifier
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Used to identify issues from this team (e.g. ENG-123)
                </p>
              </div>
              <Input
                id="identifier"
                className="bg-[#17181B] border-[#2d3036] text-foreground"
                placeholder="e.g. ENG"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
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
            <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
              <Label htmlFor="parent-team" className="text-sm text-foreground">
                Parent team
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="parent-team"
                  className="bg-[#17181B] border-[#2d3036] text-foreground flex-1"
                  placeholder="Select parent team"
                />
                <span className="text-xs text-muted-foreground bg-[#17181B] border border-[#2d3036] px-2 py-1.5 rounded">
                  Available on Business
                </span>
              </div>
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
            <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
              <Label htmlFor="copy-from-team" className="text-sm text-foreground">
                Copy from team
              </Label>
              <Select value={copyFromTeam} onValueChange={setCopyFromTeam}>
                <SelectTrigger
                  id="copy-from-team"
                  className="bg-[#17181B] border-[#2d3036] text-foreground"
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

          {/* Timezone */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-foreground mb-1">Timezone</h3>
              <p className="text-xs text-muted-foreground">
                The timezone should be set as the location where most of your team members reside. All other times referenced by the team will be relative to this timezone setting. For example, if the team uses cycles, each cycle will start at midnight in the specified timezone.
              </p>
            </div>
            <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
              <Label htmlFor="timezone" className="text-sm text-foreground">
                Timezone
              </Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger
                  id="timezone"
                  className="bg-[#17181B] border-[#2d3036] text-foreground"
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
            <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
              <Label htmlFor="private-team" className="text-sm text-foreground">
                Private team
              </Label>
              <div className="flex items-center gap-2">
                <Switch
                  id="private-team"
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                  className="data-[state=checked]:bg-[#5E6AD2] data-[state=unchecked]:bg-[#707173]"
                />
                <span className="text-xs text-muted-foreground bg-[#17181B] border border-[#2d3036] px-2 py-1.5 rounded">
                  Available on Business
                </span>
              </div>
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
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeamModal;

