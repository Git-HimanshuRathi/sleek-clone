import { Issue } from "@/components/NewIssueModal";
import { Task } from "@/components/Kanban/KanbanBoard";

// Realistic team members matching Linear style
export const teamMembers = [
  { id: "LB", name: "LB Lakshya Bagani", initials: "LB", avatar: "" },
  { id: "SC", name: "SC Sarah Chen", initials: "SC", avatar: "" },
  { id: "MJ", name: "MJ Mike Johnson", initials: "MJ", avatar: "" },
  { id: "ED", name: "ED Emily Davis", initials: "ED", avatar: "" },
  { id: "DL", name: "DL David Lee", initials: "DL", avatar: "" },
  { id: "AS", name: "AS Alex Smith", initials: "AS", avatar: "" },
  { id: "RM", name: "RM Rachel Martinez", initials: "RM", avatar: "" },
];

// Generate realistic Linear-style issue numbers (ENG-123, DES-45, etc.)
const generateIssueNumber = (prefix: string, num: number) => `${prefix}-${num}`;

// Realistic Linear-style issues
export const initialIssues: Issue[] = [
  {
    id: "1",
    title: "Refactor authentication flow to support OAuth2",
    description: "The current authentication system needs to be updated to support OAuth2 providers. This will allow users to sign in with Google, GitHub, and other providers.",
    status: "In Progress",
    priority: "High",
    assignee: "MJ Mike Johnson",
    createdBy: "LB Lakshya Bagani",
    labels: ["backend", "authentication", "security"],
    links: [
      { id: "1", url: "https://github.com/example/oauth-docs", title: "OAuth2 Implementation Guide" }
    ],
    subIssues: [],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    issueNumber: generateIssueNumber("ENG", 142),
  },
  {
    id: "2",
    title: "Design new onboarding flow for first-time users",
    description: "Create a seamless onboarding experience that guides new users through the key features of the product. Include tooltips and interactive tutorials.",
    status: "Todo",
    priority: "High",
    assignee: "SC Sarah Chen",
    createdBy: "ED Emily Davis",
    labels: ["design", "ux", "onboarding"],
    links: [],
    subIssues: [],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    issueNumber: generateIssueNumber("DES", 89),
  },
  {
    id: "3",
    title: "Fix mobile viewport issues on iOS Safari",
    description: "The viewport height calculation is incorrect on iOS Safari, causing content to be cut off or scroll incorrectly. Need to implement proper viewport meta tag and CSS fixes.",
    status: "Todo",
    priority: "Urgent",
    assignee: "DL David Lee",
    createdBy: "LB Lakshya Bagani",
    labels: ["frontend", "mobile", "bug", "iOS"],
    links: [],
    subIssues: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    issueNumber: generateIssueNumber("ENG", 138),
  },
  {
    id: "4",
    title: "Implement dark mode theme toggle",
    description: "Add a theme switcher in the settings that allows users to toggle between light and dark modes. Ensure all components support both themes.",
    status: "Done",
    priority: "Medium",
    assignee: "SC Sarah Chen",
    createdBy: "AS Alex Smith",
    labels: ["frontend", "ui", "feature"],
    links: [],
    subIssues: [],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    issueNumber: generateIssueNumber("ENG", 125),
  },
  {
    id: "5",
    title: "Add search functionality to issue list",
    description: "Users should be able to search through issues by title, description, assignee, and labels. Include filter options for status and priority.",
    status: "In Progress",
    priority: "Medium",
    assignee: "MJ Mike Johnson",
    createdBy: "RM Rachel Martinez",
    labels: ["backend", "search", "feature"],
    links: [],
    subIssues: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    issueNumber: generateIssueNumber("ENG", 145),
  },
  {
    id: "6",
    title: "Create API documentation for public endpoints",
    description: "Document all public REST API endpoints with request/response examples, error codes, and authentication requirements. Use OpenAPI specification.",
    status: "Done",
    priority: "Low",
    assignee: "ED Emily Davis",
    createdBy: "LB Lakshya Bagani",
    labels: ["documentation", "api"],
    links: [
      { id: "2", url: "https://swagger.io/docs/", title: "OpenAPI Specification Guide" }
    ],
    subIssues: [],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    issueNumber: generateIssueNumber("DOC", 34),
  },
  {
    id: "7",
    title: "Optimize database queries for dashboard",
    description: "The dashboard is loading slowly due to inefficient database queries. Need to add proper indexes and optimize the query structure.",
    status: "Backlog",
    priority: "High",
    assignee: "MJ Mike Johnson",
    createdBy: "DL David Lee",
    labels: ["backend", "performance", "database"],
    links: [],
    subIssues: [],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    issueNumber: generateIssueNumber("ENG", 149),
  },
  {
    id: "8",
    title: "Add keyboard shortcuts for common actions",
    description: "Implement keyboard shortcuts for creating issues (c), searching (⌘K), and navigating between views. Show available shortcuts in a help modal.",
    status: "Todo",
    priority: "Medium",
    assignee: "SC Sarah Chen",
    createdBy: "ED Emily Davis",
    labels: ["frontend", "ux", "accessibility"],
    links: [],
    subIssues: [],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    issueNumber: generateIssueNumber("UX", 12),
  },
  {
    id: "9",
    title: "Fix memory leak in real-time notification system",
    description: "The WebSocket connection for real-time notifications is causing a memory leak after extended use. Event listeners are not being properly cleaned up.",
    status: "Backlog",
    priority: "Urgent",
    assignee: "MJ Mike Johnson",
    createdBy: "AS Alex Smith",
    labels: ["backend", "bug", "performance", "websocket"],
    links: [],
    subIssues: [],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    issueNumber: generateIssueNumber("ENG", 133),
  },
  {
    id: "10",
    title: "Redesign project cards on dashboard",
    description: "The current project cards are too cluttered. Redesign with a cleaner layout, better typography, and improved visual hierarchy.",
    status: "Done",
    priority: "Low",
    assignee: "SC Sarah Chen",
    createdBy: "RM Rachel Martinez",
    labels: ["design", "ui", "dashboard"],
    links: [],
    subIssues: [],
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    issueNumber: generateIssueNumber("DES", 76),
  },
  {
    id: "11",
    title: "Add unit tests for authentication module",
    description: "Coverage for the authentication module is below 70%. Add comprehensive unit tests for all authentication flows and edge cases.",
    status: "In Progress",
    priority: "Medium",
    assignee: "ED Emily Davis",
    createdBy: "LB Lakshya Bagani",
    labels: ["testing", "backend", "security"],
    links: [],
    subIssues: [],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    issueNumber: generateIssueNumber("ENG", 147),
  },
  {
    id: "12",
    title: "Implement rate limiting for API endpoints",
    description: "Add rate limiting to prevent abuse of API endpoints. Use token bucket algorithm with configurable limits per user tier.",
    status: "Backlog",
    priority: "High",
    assignee: "MJ Mike Johnson",
    createdBy: "AS Alex Smith",
    labels: ["backend", "security", "api"],
    links: [],
    subIssues: [],
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    issueNumber: generateIssueNumber("ENG", 134),
  },
];

// Realistic Kanban tasks
export const initialKanbanTasks: Task[] = [
  {
    id: "k1",
    title: "Set up CI/CD pipeline for staging environment",
    description: "Configure GitHub Actions to automatically deploy to staging on every push to develop branch. Include automated testing and health checks.",
    status: "todo",
    priority: "high",
    assignee: "MJ Mike Johnson",
    labels: ["devops", "ci/cd"],
    comments: [
      {
        id: "c1",
        author: "MJ Mike Johnson",
        content: "Starting with GitHub Actions setup. Will configure test runners first.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "k2",
    title: "Create user onboarding email sequence",
    description: "Design and implement a 5-email sequence that welcomes new users and introduces key features over the first week.",
    status: "in-progress",
    priority: "medium",
    assignee: "ED Emily Davis",
    labels: ["marketing", "email"],
    comments: [
      {
        id: "c2",
        author: "ED Emily Davis",
        content: "Email templates are ready. Waiting for copy review from marketing team.",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        id: "c3",
        author: "RM Rachel Martinez",
        content: "Copy reviewed and approved. Ready to implement.",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "k3",
    title: "Migrate legacy database schema to new structure",
    description: "Create migration scripts to transform the old database schema to the new normalized structure without downtime.",
    status: "done",
    priority: "urgent",
    assignee: "MJ Mike Johnson",
    labels: ["backend", "database", "migration"],
    comments: [
      {
        id: "c4",
        author: "MJ Mike Johnson",
        content: "Migration completed successfully. All data verified and tests passing.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "k4",
    title: "Build notification system for team updates",
    description: "Implement a real-time notification system that alerts team members of important updates on issues and projects they're following.",
    status: "todo",
    priority: "high",
    assignee: "DL David Lee",
    labels: ["frontend", "backend", "feature"],
    comments: [],
  },
  {
    id: "k5",
    title: "Conduct user research for feature prioritization",
    description: "Interview 10 users to understand which features are most valuable. Create a prioritized roadmap based on findings.",
    status: "in-progress",
    priority: "medium",
    assignee: "RM Rachel Martinez",
    labels: ["research", "product"],
    comments: [
      {
        id: "c5",
        author: "RM Rachel Martinez",
        content: "Completed 7 interviews so far. Common themes emerging around search and filtering capabilities.",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "k6",
    title: "Update design system documentation",
    description: "Refresh the design system documentation with new components, updated color tokens, and usage guidelines.",
    status: "done",
    priority: "low",
    assignee: "SC Sarah Chen",
    labels: ["design", "documentation"],
    comments: [],
  },
];

// Inbox notifications
export interface InboxNotification {
  id: string;
  type: "mention" | "assign" | "comment" | "status_change" | "project_update";
  title: string;
  description: string;
  issueId?: string;
  issueNumber?: string;
  projectId?: string;
  author: string;
  timestamp: string;
  read: boolean;
}

export const initialInboxNotifications: InboxNotification[] = [
  {
    id: "in1",
    type: "assign",
    title: "ENG-142 Refactor authentication flow",
    description: "nan assigned you",
    issueId: "1",
    issueNumber: "ENG-142",
    author: "nan",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "in2",
    type: "project_update",
    title: "LLM Chatbot",
    description: "New project update by raissa",
    projectId: "p1",
    author: "raissa",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "in3",
    type: "status_change",
    title: "Error uploading images via API",
    description: "Status changed to In Progress",
    issueId: "3",
    issueNumber: "ENG-138",
    author: "system",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "in4",
    type: "comment",
    title: "ENG-145 Add search functionality",
    description: "MJ Mike Johnson commented: 'Search index is working, need to add UI'",
    issueId: "5",
    issueNumber: "ENG-145",
    author: "MJ Mike Johnson",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "in5",
    type: "mention",
    title: "DES-89 Design new onboarding flow",
    description: "SC Sarah Chen mentioned you in a comment",
    issueId: "2",
    issueNumber: "DES-89",
    author: "SC Sarah Chen",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
];

// Projects
export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  issueCount: number;
  completedIssueCount: number;
  status: "active" | "archived" | "completed";
}

export const initialProjects: Project[] = [
  {
    id: "p1",
    name: "LLM Chatbot",
    description: "AI-powered chatbot integration for customer support",
    color: "#5E6AD2",
    icon: "🤖",
    issueCount: 24,
    completedIssueCount: 18,
    status: "active",
  },
  {
    id: "p2",
    name: "Mobile App Redesign",
    description: "Complete redesign of mobile application with new UI/UX",
    color: "#0BC5EA",
    icon: "📱",
    issueCount: 42,
    completedIssueCount: 35,
    status: "active",
  },
  {
    id: "p3",
    name: "API V2 Migration",
    description: "Migrate all endpoints to new API version with backward compatibility",
    color: "#F59E0B",
    icon: "🔧",
    issueCount: 31,
    completedIssueCount: 28,
    status: "active",
  },
  {
    id: "p4",
    name: "Performance Optimization",
    description: "Improve application performance and reduce load times",
    color: "#10B981",
    icon: "⚡",
    issueCount: 15,
    completedIssueCount: 12,
    status: "active",
  },
];

// Initialize data in localStorage
export const initializeMockData = () => {
  // Only initialize if data doesn't exist
  if (!localStorage.getItem("issues") || JSON.parse(localStorage.getItem("issues") || "[]").length === 0) {
    localStorage.setItem("issues", JSON.stringify(initialIssues));
  }
  
  if (!localStorage.getItem("kanbanTasks") || JSON.parse(localStorage.getItem("kanbanTasks") || "[]").length === 0) {
    localStorage.setItem("kanbanTasks", JSON.stringify(initialKanbanTasks));
  }
  
  if (!localStorage.getItem("inboxNotifications")) {
    localStorage.setItem("inboxNotifications", JSON.stringify(initialInboxNotifications));
  }
  
  if (!localStorage.getItem("projects")) {
    localStorage.setItem("projects", JSON.stringify(initialProjects));
  }
  
  if (!localStorage.getItem("teamMembers")) {
    localStorage.setItem("teamMembers", JSON.stringify(teamMembers));
  }
};

