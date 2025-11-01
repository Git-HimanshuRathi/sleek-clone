import { KanbanBoard } from "@/components/Kanban/KanbanBoard";

const Dashboard = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
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
