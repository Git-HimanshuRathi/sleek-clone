import { Search, Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/Avatar";

interface TopBarProps {
  onCommandClick: () => void;
}

export const TopBar = ({ onCommandClick }: TopBarProps) => {
  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4">
      {/* Search trigger */}
      <button
        onClick={onCommandClick}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-surface hover:bg-surface-hover text-sm text-muted-foreground transition-colors duration-150 min-w-[240px]"
      >
        <Search className="w-4 h-4" />
        <span>Search or type a command...</span>
        <kbd className="ml-auto hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="sm"
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Issue</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-muted-foreground hover:text-foreground"
        >
          <Bell className="w-4 h-4" />
        </Button>

        <Avatar name="John Doe" size="sm" />
      </div>
    </header>
  );
};
