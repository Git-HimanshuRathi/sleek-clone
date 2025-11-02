import { useEffect, useState, useMemo } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  CheckSquare,
  Users,
  Settings,
  Plus,
  Search,
  Hash,
  User,
  Tag,
  Filter,
} from "lucide-react";
import { db } from "@/db/database";
import { useDatabase } from "@/hooks/useDatabase";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const commands = [
  { icon: LayoutDashboard, label: "Go to Dashboard", action: "/", keywords: ["dashboard", "home"] },
  { icon: Inbox, label: "Go to Inbox", action: "/inbox", keywords: ["inbox", "notifications"] },
  { icon: CheckSquare, label: "Go to My Issues", action: "/my-issues", keywords: ["issues", "my issues", "tasks"] },
  { icon: Users, label: "Go to Team", action: "/team", keywords: ["team", "teams"] },
  { icon: Settings, label: "Go to Settings", action: "/settings", keywords: ["settings", "preferences"] },
  { icon: Plus, label: "Create New Issue", action: "new-issue", keywords: ["create", "new", "add"] },
];

export const CommandPalette = ({ open, onOpenChange }: CommandPaletteProps) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { isReady } = useDatabase();
  const [issues, setIssues] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (open && isReady) {
      try {
        setIssues(db.getIssues());
        setProjects(db.getProjects());
      } catch (error) {
        console.error('Error loading data for search:', error);
      }
    }
  }, [open, isReady]);

  // Parse search filters
  const parseFilters = (query: string) => {
    const filters: { assignee?: string; status?: string; label?: string; priority?: string } = {};
    const parts = query.split(/\s+/);
    const remainingParts: string[] = [];

    parts.forEach(part => {
      if (part.includes(':')) {
        const [key, value] = part.split(':');
        if (key === 'assignee') filters.assignee = value.toLowerCase();
        else if (key === 'status') filters.status = value.toLowerCase();
        else if (key === 'label') filters.label = value.toLowerCase();
        else if (key === 'priority') filters.priority = value.toLowerCase();
        else remainingParts.push(part);
      } else {
        remainingParts.push(part);
      }
    });

    return { filters, query: remainingParts.join(' ') };
  };

  // Filter issues based on search and filters
  const filteredIssues = useMemo(() => {
    if (!search.trim()) return [];
    
    const { filters, query } = parseFilters(search.toLowerCase());
    
    return issues.filter(issue => {
      // Text search
      const matchesText = !query || 
        issue.title?.toLowerCase().includes(query) ||
        issue.description?.toLowerCase().includes(query) ||
        issue.issueNumber?.toLowerCase().includes(query);
      
      // Filter search
      const matchesAssignee = !filters.assignee || 
        issue.assignee?.toLowerCase().includes(filters.assignee);
      const matchesStatus = !filters.status || 
        issue.status?.toLowerCase().includes(filters.status);
      const matchesLabel = !filters.label || 
        (Array.isArray(issue.labels) && issue.labels.some((l: string) => 
          l.toLowerCase().includes(filters.label!)
        ));
      const matchesPriority = !filters.priority || 
        issue.priority?.toLowerCase().includes(filters.priority);
      
      return matchesText && matchesAssignee && matchesStatus && matchesLabel && matchesPriority;
    }).slice(0, 10); // Limit to 10 results
  }, [issues, search]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (!search.trim()) return [];
    const { query } = parseFilters(search.toLowerCase());
    if (!query) return [];
    
    return projects.filter(project =>
      project.name?.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [projects, search]);

  // Filter commands
  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands;
    const query = search.toLowerCase();
    
    return commands.filter(cmd =>
      cmd.label.toLowerCase().includes(query) ||
      cmd.keywords.some(kw => kw.includes(query))
    );
  }, [search]);

  const handleSelectIssue = (issueId: string) => {
    navigate(`/my-issues/issue/${issueId}`);
    onOpenChange(false);
    setSearch("");
  };

  const handleSelectProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
    onOpenChange(false);
    setSearch("");
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command shouldFilter={false}>
        <CommandInput 
          placeholder="Type a command or search... (Try: assignee:name, status:todo, label:bug)" 
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {/* Issues */}
          {filteredIssues.length > 0 && (
            <>
              <CommandGroup heading="Issues">
                {filteredIssues.map((issue) => (
                  <CommandItem
                    key={issue.id}
                    onSelect={() => handleSelectIssue(issue.id)}
                    className="flex items-center gap-2"
                  >
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{issue.issueNumber} - {issue.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        {issue.status && <span>{issue.status}</span>}
                        {issue.assignee && <span>• {issue.assignee}</span>}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <>
              <CommandGroup heading="Projects">
                {filteredProjects.map((project) => (
                  <CommandItem
                    key={project.id}
                    onSelect={() => handleSelectProject(project.id)}
                    className="flex items-center gap-2"
                  >
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: project.color || "#5E6AD2" }}
                    />
                    <span>{project.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Commands */}
          {filteredCommands.length > 0 && (
            <CommandGroup heading="Actions">
              {filteredCommands.map((command) => (
                <CommandItem
                  key={command.label}
                  onSelect={() => {
                    if (command.action.startsWith("/")) {
                      navigate(command.action);
                    } else if (command.action === "new-issue") {
                      // Trigger new issue modal - you can dispatch an event or use context
                      window.dispatchEvent(new CustomEvent("openNewIssueModal"));
                    }
                    onOpenChange(false);
                    setSearch("");
                  }}
                >
                  <command.icon className="mr-2 h-4 w-4" />
                  <span>{command.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Search Tips */}
          {search && filteredIssues.length === 0 && filteredProjects.length === 0 && filteredCommands.length === 0 && (
            <CommandGroup heading="Search Tips">
              <div className="px-2 py-1.5 text-xs text-muted-foreground space-y-1">
                <div>Use filters: <code className="px-1 py-0.5 rounded bg-surface">assignee:name</code></div>
                <div>Filter by status: <code className="px-1 py-0.5 rounded bg-surface">status:todo</code></div>
                <div>Filter by label: <code className="px-1 py-0.5 rounded bg-surface">label:bug</code></div>
                <div>Filter by priority: <code className="px-1 py-0.5 rounded bg-surface">priority:high</code></div>
              </div>
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
};
