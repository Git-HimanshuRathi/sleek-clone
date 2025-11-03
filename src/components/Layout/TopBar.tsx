import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  onCommandClick: () => void;
  onMenuClick?: () => void;
  isMobile?: boolean;
}

export const TopBar = ({ onCommandClick, onMenuClick, isMobile }: TopBarProps) => {
  if (!isMobile) {
    return null;
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-[#111113]">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="h-8 w-8"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onCommandClick}
        className="h-8 w-8"
      >
        <Search className="h-5 w-5 text-foreground" />
      </Button>
    </div>
  );
};
