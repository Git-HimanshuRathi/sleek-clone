import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  CheckSquare,
  Users,
  Settings,
  Plus,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const commands = [
  { icon: LayoutDashboard, label: "Go to Dashboard", action: "/" },
  { icon: Inbox, label: "Go to Inbox", action: "/inbox" },
  { icon: CheckSquare, label: "Go to My Issues", action: "/my-issues" },
  { icon: Users, label: "Go to Team", action: "/team" },
  { icon: Settings, label: "Go to Settings", action: "/settings" },
  { icon: Plus, label: "Create New Issue", action: "new-issue" },
];

export const CommandPalette = ({ open, onOpenChange }: CommandPaletteProps) => {
  const navigate = useNavigate();

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          {commands.map((command) => (
            <CommandItem
              key={command.label}
              onSelect={() => {
                if (command.action.startsWith("/")) {
                  navigate(command.action);
                } else {
                  // Handle other actions
                  console.log("Action:", command.action);
                }
                onOpenChange(false);
              }}
            >
              <command.icon className="mr-2 h-4 w-4" />
              <span>{command.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
