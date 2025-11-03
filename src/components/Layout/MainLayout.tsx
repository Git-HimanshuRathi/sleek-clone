import { useState, useEffect, useRef, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CommandPalette } from "../CommandPalette";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useIsMobile } from "@/hooks/use-mobile";

export const MainLayout = () => {
  const [commandOpen, setCommandOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebarRef = useRef<(() => void) | null>(null);
  const isMobile = useIsMobile();

  // Set dynamic page title based on current route
  usePageTitle();

  const handleToggleRef = useCallback((fn: () => void) => {
    toggleSidebarRef.current = fn;
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [isMobile]); // Only run when mobile state changes

  // Keyboard shortcut for command palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
      // Toggle sidebar with 'b' key on mobile
      if (isMobile && e.key === "b" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSidebarOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isMobile]);

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: "#0B0B0D" }}>
      <Sidebar 
        onCommandClick={() => {
          setCommandOpen(true);
          if (isMobile) setSidebarOpen(false);
        }}
        onWidthChange={setSidebarWidth}
        onToggleRef={handleToggleRef}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      {/* Clickable divider between sidebar and main content - hidden on mobile */}
      {!isMobile && (
        <div
          onClick={() => toggleSidebarRef.current?.()}
          className="fixed left-0 top-0 h-full z-20 cursor-col-resize transition-all duration-200 ease-in-out hover:bg-[#1A1C1E]/30 hidden md:block"
          style={{ 
            width: "4px",
            left: `${sidebarWidth + 8}px`, // Account for 8px gap
            cursor: "col-resize"
          }}
          title="Click to toggle sidebar"
        />
      )}

      <div 
        className="flex flex-1 flex-col overflow-hidden transition-all duration-200 ease-in-out"
        style={{ 
          marginLeft: isMobile ? "0" : `${sidebarWidth + 8}px`, // 8px gap from sidebar
          paddingRight: isMobile ? "0" : "8px",
          paddingTop: isMobile ? "0" : "8px",
          paddingBottom: isMobile ? "0" : "8px",
        }}
      >
        <div 
          className="flex flex-1 flex-col overflow-hidden md:rounded-xl"
          style={{ 
            borderRadius: isMobile ? "0" : "12px",
            backgroundColor: "#111113",
            border: isMobile ? "none" : "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: isMobile ? "none" : "0 8px 16px rgba(0, 0, 0, 0.24), 0 0 0 1px rgba(0, 0, 0, 0.12)",
          }}
        >
          <TopBar 
            onCommandClick={() => setCommandOpen(true)} 
            onMenuClick={() => setSidebarOpen(true)}
            isMobile={isMobile}
          />
          
          <main className="flex-1 overflow-y-auto" style={{ paddingTop: "0px", color: "#FFFFFF" }}>
            <Outlet />
          </main>
        </div>
      </div>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
};
