import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Cycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  goal?: string;
  teamId?: string;
  issues: number;
  completedIssues: number;
}

interface CyclesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId?: string;
}

export const CyclesModal = ({ open, onOpenChange, teamId }: CyclesModalProps) => {
  const [cycles, setCycles] = useState<Cycle[]>(() => {
    const stored = localStorage.getItem("cycles");
    return stored ? JSON.parse(stored) : [];
  });
  const [isCreating, setIsCreating] = useState(false);
  const [cycleName, setCycleName] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [goal, setGoal] = useState("");

  const handleCreateCycle = () => {
    if (!cycleName.trim() || !startDate || !endDate) return;

    const newCycle: Cycle = {
      id: `cycle-${Date.now()}`,
      name: cycleName.trim(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      goal: goal.trim() || undefined,
      teamId,
      issues: 0,
      completedIssues: 0,
    };

    const updatedCycles = [...cycles, newCycle];
    setCycles(updatedCycles);
    localStorage.setItem("cycles", JSON.stringify(updatedCycles));

    // Reset form
    setCycleName("");
    setStartDate(undefined);
    setEndDate(undefined);
    setGoal("");
    setIsCreating(false);
  };

  const handleDeleteCycle = (cycleId: string) => {
    if (confirm("Are you sure you want to delete this cycle?")) {
      const updatedCycles = cycles.filter((c) => c.id !== cycleId);
      setCycles(updatedCycles);
      localStorage.setItem("cycles", JSON.stringify(updatedCycles));
    }
  };

  const calculateProgress = (cycle: Cycle) => {
    if (cycle.issues === 0) return 0;
    return Math.round((cycle.completedIssues / cycle.issues) * 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#17181B] border-[#2d3036]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            Cycles
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Create time-boxed iterations to focus your team's work
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {!isCreating ? (
            <Button
              onClick={() => setIsCreating(true)}
              className="w-full bg-[#5E6AD2] hover:bg-[#6B77E0] text-white"
            >
              Create cycle
            </Button>
          ) : (
            <div className="space-y-4 p-4 border border-[#2d3036] rounded-lg">
              <div>
                <Label htmlFor="cycle-name" className="text-sm text-foreground">
                  Cycle name
                </Label>
                <Input
                  id="cycle-name"
                  value={cycleName}
                  onChange={(e) => setCycleName(e.target.value)}
                  placeholder="e.g. Sprint 1"
                  className="mt-1 bg-[#0B0B0D] border-[#2d3036] text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-foreground">Start date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1 bg-[#0B0B0D] border-[#2d3036] text-foreground",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-sm text-foreground">End date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1 bg-[#0B0B0D] border-[#2d3036] text-foreground",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label htmlFor="cycle-goal" className="text-sm text-foreground">
                  Goal (optional)
                </Label>
                <Input
                  id="cycle-goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="What does the team want to achieve?"
                  className="mt-1 bg-[#0B0B0D] border-[#2d3036] text-foreground"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreateCycle}
                  disabled={!cycleName.trim() || !startDate || !endDate}
                  className="flex-1 bg-[#5E6AD2] hover:bg-[#6B77E0] text-white"
                >
                  Create
                </Button>
                <Button
                  onClick={() => {
                    setIsCreating(false);
                    setCycleName("");
                    setStartDate(undefined);
                    setEndDate(undefined);
                    setGoal("");
                  }}
                  variant="outline"
                  className="bg-[#0B0B0D] border-[#2d3036] text-foreground"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Cycles List */}
          <div className="space-y-2">
            {cycles.filter((c) => !teamId || c.teamId === teamId).map((cycle) => {
              const progress = calculateProgress(cycle);
              const isActive = new Date() >= new Date(cycle.startDate) && new Date() <= new Date(cycle.endDate);

              return (
                <div
                  key={cycle.id}
                  className={cn(
                    "p-4 border rounded-lg",
                    isActive ? "border-[#5E6AD2] bg-[#5E6AD2]/10" : "border-[#2d3036] bg-[#17181B]"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-foreground">{cycle.name}</h3>
                        {isActive && (
                          <span className="text-xs px-2 py-0.5 rounded bg-[#5E6AD2] text-white">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(cycle.startDate), "MMM d")} - {format(new Date(cycle.endDate), "MMM d, yyyy")}
                      </p>
                      {cycle.goal && (
                        <p className="text-sm text-muted-foreground mt-2">{cycle.goal}</p>
                      )}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>{cycle.completedIssues} / {cycle.issues} issues completed</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-[#0B0B0D] rounded-full h-2">
                          <div
                            className="bg-[#5E6AD2] h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCycle(cycle.id)}
                      className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              );
            })}

            {cycles.filter((c) => !teamId || c.teamId === teamId).length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No cycles created yet
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

