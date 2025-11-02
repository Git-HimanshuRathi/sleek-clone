import { db } from './database';

// Migrate data from localStorage to SQLite
export const migrateFromLocalStorage = async () => {
  try {
    // Migrate issues
    const issues = localStorage.getItem('issues');
    if (issues) {
      try {
        const parsedIssues = JSON.parse(issues);
        if (Array.isArray(parsedIssues)) {
          parsedIssues.forEach((issue: any) => {
            db.insertIssue(issue);
          });
          // Mark as migrated (optional - keep backup)
          console.log(`Migrated ${parsedIssues.length} issues to SQLite`);
        }
      } catch (error) {
        console.error('Error migrating issues:', error);
      }
    }

    // Migrate projects
    const projects = localStorage.getItem('projects');
    if (projects) {
      try {
        const parsedProjects = JSON.parse(projects);
        if (Array.isArray(parsedProjects)) {
          parsedProjects.forEach((project: any) => {
            db.insertProject(project);
          });
          console.log(`Migrated ${parsedProjects.length} projects to SQLite`);
        }
      } catch (error) {
        console.error('Error migrating projects:', error);
      }
    }

    // Migrate team members
    const teamMembers = localStorage.getItem('teamMembers');
    if (teamMembers) {
      try {
        const parsedMembers = JSON.parse(teamMembers);
        if (Array.isArray(parsedMembers)) {
          parsedMembers.forEach((member: any) => {
            db.insertTeamMember(member);
          });
          console.log(`Migrated ${parsedMembers.length} team members to SQLite`);
        }
      } catch (error) {
        console.error('Error migrating team members:', error);
      }
    }

    // Migrate kanban tasks
    const kanbanTasks = localStorage.getItem('kanbanTasks');
    if (kanbanTasks) {
      try {
        const parsedTasks = JSON.parse(kanbanTasks);
        if (Array.isArray(parsedTasks)) {
          parsedTasks.forEach((task: any) => {
            db.insertKanbanTask(task);
          });
          console.log(`Migrated ${parsedTasks.length} kanban tasks to SQLite`);
        }
      } catch (error) {
        console.error('Error migrating kanban tasks:', error);
      }
    }

    // Migrate settings
    const settings = [
      'jiraProjectKey',
      'useJiraApi',
      'jiraProxyUrl',
      'jiraFetchStats',
      'sidebar-collapsed',
      'linear-onboarding-completed',
      'linear-onboarding-step',
      'theme',
    ];

    settings.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value) {
        db.setSetting(key, value);
      }
    });

    console.log('Migration from localStorage to SQLite completed');
  } catch (error) {
    console.error('Error during migration:', error);
  }
};

