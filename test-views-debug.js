// Quick test to check localStorage
const views = localStorage.getItem("views");
console.log("Views in localStorage:", views);
if (views) {
  console.log("Parsed views:", JSON.parse(views));
} else {
  console.log("No views found. Creating a test view...");
  const testView = [{
    id: "test-view-1",
    name: "High Priority Issues",
    description: "View all high priority issues",
    filters: {
      status: ["Todo", "In Progress"],
      priority: ["High", "Urgent"]
    },
    sortBy: "priority",
    groupBy: "status",
    isFavorite: false,
    createdAt: "2025-01-01T00:00:00.000Z"
  }];
  localStorage.setItem("views", JSON.stringify(testView));
  console.log("Test view created!");
}
