import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Inbox, 
  CheckSquare, 
  Users, 
  Settings,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inbox", href: "/inbox", icon: Inbox },
  { name: "My Issues", href: "/my-issues", icon: CheckSquare },
  { name: "Team", href: "/team", icon: Users },
];

export const Sidebar = () => {
  return (
    <aside className="w-60 border-r border-border bg-sidebar-background flex flex-col">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">P</span>
          </div>
          <span className="font-semibold text-sm">ProjectFlow</span>
        </div>
      </div>

      {/* Workspace selector */}
      <div className="px-2 py-3 border-b border-border">
        <button className="w-full px-2 py-1.5 rounded-md surface flex items-center justify-between text-sm hover:bg-surface-hover transition-colors duration-150">
          <span className="font-medium">My Workspace</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-2 py-1.5 rounded-md text-sm transition-colors duration-150",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Settings */}
      <div className="p-2 border-t border-border">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-2 py-1.5 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors duration-150"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};
