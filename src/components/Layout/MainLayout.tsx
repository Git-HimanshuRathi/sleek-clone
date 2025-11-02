import { useState, useEffect, useRef, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CommandPalette } from "../CommandPalette";
import { usePageTitle } from "@/hooks/usePageTitle";

export const MainLayout = () => {
  const [commandOpen, setCommandOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const toggleSidebarRef = useRef<(() => void) | null>(null);

  // Set dynamic page title based on current route
  usePageTitle();

  const handleToggleRef = useCallback((fn: () => void) => {
    toggleSidebarRef.current = fn;
  }, []);

  // Keyboard shortcut for command palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: "#0B0B0D" }}>
      <Sidebar 
        onCommandClick={() => setCommandOpen(true)} 
        onWidthChange={setSidebarWidth}
        onToggleRef={handleToggleRef}
      />
      
      {/* Clickable divider between sidebar and main content */}
      <div
        onClick={() => toggleSidebarRef.current?.()}
        className="fixed left-0 top-0 h-full z-20 cursor-col-resize transition-all duration-200 ease-in-out hover:bg-[#1A1C1E]/30"
        style={{ 
          width: "4px",
          left: `${sidebarWidth + 8}px`, // Account for 8px gap
          cursor: "col-resize"
        }}
        title="Click to toggle sidebar"
      />

      <div 
        className="flex flex-1 flex-col overflow-hidden transition-all duration-200 ease-in-out"
        style={{ 
          marginLeft: `${sidebarWidth + 8}px`, // 8px gap from sidebar
          paddingRight: "8px",
          paddingTop: "8px",
          paddingBottom: "8px",
        }}
      >
        <div 
          className="flex flex-1 flex-col overflow-hidden"
          style={{ 
            borderRadius: "12px",
            backgroundColor: "#111113",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.24), 0 0 0 1px rgba(0, 0, 0, 0.12)",
          }}
        >
          <TopBar onCommandClick={() => setCommandOpen(true)} />
          
          <main className="flex-1 overflow-y-auto pt-5" style={{ paddingTop: "20px", color: "#FFFFFF" }}>
            <Outlet />
          </main>
        </div>
      </div>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
};
