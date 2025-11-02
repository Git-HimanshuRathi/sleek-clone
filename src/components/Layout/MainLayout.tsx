import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CommandPalette } from "../CommandPalette";

export const MainLayout = () => {
  const [commandOpen, setCommandOpen] = useState(false);

  // Keyboard shortcut for command palette
  useState(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#090909] text-foreground">
      <Sidebar onCommandClick={() => setCommandOpen(true)} />
      
      <div className="flex flex-1 flex-col overflow-hidden px-4 pt-2 pb-4 bg-[#090909]">
        <div className="flex flex-1 flex-col overflow-hidden bg-muted/30 rounded-lg border border-border/50 shadow-sm">
          <TopBar onCommandClick={() => setCommandOpen(true)} />
          
          <main className="flex-1 overflow-y-auto pt-1">
            <Outlet />
          </main>
        </div>
      </div>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
};
