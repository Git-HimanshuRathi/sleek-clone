import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initDatabase } from "./db/database";
import { migrateFromLocalStorage } from "./db/migration";

// Initialize SQLite database and migrate data
(async () => {
  try {
    await initDatabase();
    
    // Migrate data from localStorage if this is first time
    const migrationDone = localStorage.getItem('sqlite_migration_done');
    if (!migrationDone) {
      await migrateFromLocalStorage();
      localStorage.setItem('sqlite_migration_done', 'true');
    }

    // Load theme from localStorage on app start
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }

    // Render app after database is ready
    createRoot(document.getElementById("root")!).render(<App />);
  } catch (error) {
    console.error('Error initializing database:', error);
    // Still render app even if database fails
    createRoot(document.getElementById("root")!).render(<App />);
  }
})();
