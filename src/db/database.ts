import type { Database } from 'sql.js';

let dbInstance: Database | null = null;
let SQL: any = null;

// Initialize SQLite database
export const initDatabase = async (): Promise<Database> => {
  if (dbInstance) {
    return dbInstance;
  }

  // Initialize sql.js - use dynamic import to handle ESM properly
  if (!SQL) {
    try {
      // sql.js is loaded via script tag in index.html, making it available globally
      // Wait for it to be available on window object
      let initSqlJs: any = null;
      let attempts = 0;
      const maxAttempts = 50;
      
      // Wait for sql.js to load from script tag
      while (!initSqlJs && attempts < maxAttempts) {
        if (typeof window !== 'undefined') {
          // sql.js makes initSqlJs available globally when loaded via script tag
          initSqlJs = (window as any).initSqlJs;
          
          // If not found, try importing dynamically as fallback
          if (!initSqlJs) {
            try {
              const sqlModule: any = await import('sql.js');
              if (sqlModule?.default && typeof sqlModule.default === 'function') {
                initSqlJs = sqlModule.default;
                break;
              }
            } catch (e) {
              // Continue waiting
            }
          }
        }
        
        if (!initSqlJs) {
          // Wait 100ms before trying again
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
      }
      
      if (!initSqlJs || typeof initSqlJs !== 'function') {
        console.error('sql.js not loaded. Make sure the script tag is in index.html');
        throw new Error('sql.js initSqlJs function not available. Ensure sql.js is loaded via script tag.');
      }
      
      // Call initSqlJs to initialize the SQL.js library
      SQL = await initSqlJs({
        locateFile: (file: string) => {
          // Load sql-wasm.wasm from CDN
          if (file.endsWith('.wasm')) {
            return `https://sql.js.org/dist/sql-wasm.wasm`;
          }
          return file;
        }
      });
    } catch (error) {
      console.error('Error initializing sql.js:', error);
      throw error;
    }
  }

  // Try to load existing database from localStorage
  const savedDb = localStorage.getItem('sqlite_db');
  if (savedDb) {
    try {
      const uint8Array = new Uint8Array(JSON.parse(savedDb));
      dbInstance = new SQL.Database(uint8Array);
    } catch (error) {
      console.error('Error loading database:', error);
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
  }

  // Create tables if they don't exist
  createTables(dbInstance);

  return dbInstance;
};

// Create database tables
const createTables = (db: Database) => {
  // Issues table
  db.run(`
    CREATE TABLE IF NOT EXISTS issues (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT,
      priority TEXT,
      assignee TEXT,
      createdBy TEXT,
      projectId TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      dueDate TEXT,
      labels TEXT,
      links TEXT,
      subIssues TEXT,
      comments TEXT,
      issueNumber TEXT
    )
  `);

  // Projects table
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      key TEXT UNIQUE,
      description TEXT,
      icon TEXT,
      color TEXT,
      createdAt TEXT,
      updatedAt TEXT
    )
  `);

  // Team members table
  db.run(`
    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      avatar TEXT,
      role TEXT
    )
  `);

  // Kanban tasks table
  db.run(`
    CREATE TABLE IF NOT EXISTS kanban_tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT,
      priority TEXT,
      assignee TEXT,
      labels TEXT,
      comments TEXT,
      createdAt TEXT,
      updatedAt TEXT
    )
  `);

  // Settings table
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);
};

// Save database to localStorage
export const saveDatabase = () => {
  if (!dbInstance) return;

  try {
    const data = dbInstance.export();
    const uint8Array = Array.from(data);
    localStorage.setItem('sqlite_db', JSON.stringify(uint8Array));
  } catch (error) {
    console.error('Error saving database:', error);
  }
};

// Get database instance (throws if not initialized)
export const getDatabase = (): Database => {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return dbInstance;
};

// Close database
export const closeDatabase = () => {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
};

// Export database utilities
export const db = {
  // Issues
  getIssues: (): any[] => {
    const db = getDatabase();
    const result = db.exec('SELECT * FROM issues ORDER BY createdAt DESC');
    if (result.length === 0) return [];
    return result[0].values.map((row: any[]) => ({
      id: row[0],
      title: row[1],
      description: row[2],
      status: row[3],
      priority: row[4],
      assignee: row[5],
      createdBy: row[6],
      projectId: row[7],
      createdAt: row[8],
      updatedAt: row[9],
      dueDate: row[10],
      labels: row[11] ? JSON.parse(row[11]) : [],
      links: row[12] ? JSON.parse(row[12]) : [],
      subIssues: row[13] ? JSON.parse(row[13]) : [],
      comments: row[14] ? JSON.parse(row[14]) : [],
      issueNumber: row[15] || '',
    }));
  },

  insertIssue: (issue: any) => {
    const db = getDatabase();
    db.run(
      `INSERT OR REPLACE INTO issues 
       (id, title, description, status, priority, assignee, createdBy, projectId, createdAt, updatedAt, dueDate, labels, links, subIssues, comments, issueNumber)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        issue.id,
        issue.title,
        issue.description || '',
        issue.status || 'Todo',
        issue.priority || 'No priority',
        issue.assignee || '',
        issue.createdBy || '',
        issue.projectId || '',
        issue.createdAt || new Date().toISOString(),
        issue.updatedAt || new Date().toISOString(),
        issue.dueDate || '',
        JSON.stringify(issue.labels || []),
        JSON.stringify(issue.links || []),
        JSON.stringify(issue.subIssues || []),
        JSON.stringify(issue.comments || []),
        issue.issueNumber || '',
      ]
    );
    saveDatabase();
  },

  updateIssue: (id: string, updates: Partial<any>) => {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'labels' || key === 'comments' || key === 'links' || key === 'subIssues') {
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(value));
      } else {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length > 0) {
      fields.push('updatedAt = ?');
      values.push(new Date().toISOString());
      values.push(id);

      db.run(`UPDATE issues SET ${fields.join(', ')} WHERE id = ?`, values);
      saveDatabase();
    }
  },

  deleteIssue: (id: string) => {
    const db = getDatabase();
    db.run('DELETE FROM issues WHERE id = ?', [id]);
    saveDatabase();
  },

  // Projects
  getProjects: (): any[] => {
    const db = getDatabase();
    const result = db.exec('SELECT * FROM projects ORDER BY name');
    if (result.length === 0) return [];
    return result[0].values.map((row: any[]) => ({
      id: row[0],
      name: row[1],
      key: row[2],
      description: row[3],
      icon: row[4],
      color: row[5],
      createdAt: row[6],
      updatedAt: row[7],
    }));
  },

  insertProject: (project: any) => {
    const db = getDatabase();
    db.run(
      `INSERT OR REPLACE INTO projects 
       (id, name, key, description, icon, color, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project.id,
        project.name,
        project.key || '',
        project.description || '',
        project.icon || '',
        project.color || '',
        project.createdAt || new Date().toISOString(),
        project.updatedAt || new Date().toISOString(),
      ]
    );
    saveDatabase();
  },

  // Team members
  getTeamMembers: (): any[] => {
    const db = getDatabase();
    const result = db.exec('SELECT * FROM team_members ORDER BY name');
    if (result.length === 0) return [];
    return result[0].values.map((row: any[]) => ({
      id: row[0],
      name: row[1],
      email: row[2],
      avatar: row[3],
      role: row[4],
    }));
  },

  insertTeamMember: (member: any) => {
    const db = getDatabase();
    db.run(
      `INSERT OR REPLACE INTO team_members (id, name, email, avatar, role)
       VALUES (?, ?, ?, ?, ?)`,
      [member.id, member.name, member.email || '', member.avatar || '', member.role || '']
    );
    saveDatabase();
  },

  // Kanban tasks
  getKanbanTasks: (): any[] => {
    const db = getDatabase();
    const result = db.exec('SELECT * FROM kanban_tasks ORDER BY createdAt DESC');
    if (result.length === 0) return [];
    return result[0].values.map((row: any[]) => ({
      id: row[0],
      title: row[1],
      description: row[2],
      status: row[3],
      priority: row[4],
      assignee: row[5],
      labels: row[6] ? JSON.parse(row[6]) : [],
      comments: row[7] ? JSON.parse(row[7]) : [],
      createdAt: row[8],
      updatedAt: row[9],
    }));
  },

  insertKanbanTask: (task: any) => {
    const db = getDatabase();
    db.run(
      `INSERT OR REPLACE INTO kanban_tasks 
       (id, title, description, status, priority, assignee, labels, comments, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.id,
        task.title,
        task.description || '',
        task.status || 'todo',
        task.priority || 'medium',
        task.assignee || '',
        JSON.stringify(task.labels || []),
        JSON.stringify(task.comments || []),
        task.createdAt || new Date().toISOString(),
        task.updatedAt || new Date().toISOString(),
      ]
    );
    saveDatabase();
  },

  // Settings
  getSetting: (key: string): string | null => {
    const db = getDatabase();
    const result = db.exec('SELECT value FROM settings WHERE key = ?', [key]);
    if (result.length === 0 || result[0].values.length === 0) return null;
    return result[0].values[0][0] as string;
  },

  setSetting: (key: string, value: string) => {
    const db = getDatabase();
    db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, value]);
    saveDatabase();
  },
};

