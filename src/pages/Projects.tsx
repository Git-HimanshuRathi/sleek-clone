import { useState, useEffect } from "react";
import { FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initialProjects, Project } from "@/data/mockData";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("projects");
    if (stored) {
      setProjects(JSON.parse(stored));
    } else {
      setProjects(initialProjects);
    }
  }, []);

  const getProgressPercentage = (project: Project) => {
    if (project.issueCount === 0) return 0;
    return Math.round((project.completedIssueCount / project.issueCount) * 100);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold">Projects</h1>
      </div>

      {projects.length > 0 ? (
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => {
              const progress = getProgressPercentage(project);
              return (
                <div
                  key={project.id}
                  className="border border-border rounded-lg p-4 bg-surface hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${project.color}20`, color: project.color }}
                    >
                      {project.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{project.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {project.completedIssueCount} / {project.issueCount} issues
                      </span>
                      <span className="font-medium text-foreground">{progress}%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: project.color,
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: `${project.color}20`,
                        color: project.color,
                      }}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 max-w-md text-center">
            <FolderKanban className="w-16 h-16 text-muted-foreground/40" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">No projects yet</h2>
              <p className="text-muted-foreground text-sm">
                Projects help you organize and track related issues. Create your first project to get started.
              </p>
            </div>
            <Button className="mt-4">Create project</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;

