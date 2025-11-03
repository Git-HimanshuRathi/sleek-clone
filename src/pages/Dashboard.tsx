import { KanbanBoard } from "@/components/Kanban/KanbanBoard";

const Dashboard = () => {
  return (
    <div className="h-full flex flex-col bg-background" style={{ marginTop: "8px" }}>
      <div className="border-b border-border px-5" style={{ paddingTop: "8px", paddingBottom: "8px" }}>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your projects and track progress
        </p>
      </div>

      <div className="flex-1 p-6">
        <KanbanBoard />
      </div>
    </div>
  );
};

export default Dashboard;
