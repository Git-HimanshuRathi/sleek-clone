# Sleek Clone - Linear Issue Tracker Clone

A modern, full-featured issue tracking application inspired by Linear, built with React, TypeScript, and SQLite. This clone replicates Linear's core functionality including issue management, projects, views, teams, and JIRA integration.

![Linear Clone](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-18.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-purple)

## 🌟 Features

### Core Functionality

- **Issue Management**
  - Create, update, and delete issues
  - Status tracking (Backlog, Todo, In Progress, Done, Cancelled)
  - Priority levels (No priority, Urgent, High, Medium, Low)
  - Assignees and labels
  - Due dates and project associations
  - Sub-issues and linked issues
  - Rich descriptions and comments
  - Threaded comments with reactions and mentions

- **Projects**
  - Create and manage projects
  - Project health tracking
  - Project leads and members
  - Target dates and milestones
  - Project status (Backlog, Planned, In Progress, Completed, Cancelled)

- **Views**
  - Create custom views with filters
  - Filter by status, priority, assignee, labels, and projects
  - Group and sort issues
  - Save and favorite views
  - Real-time JIRA data integration

- **Team Management**
  - Multiple teams support
  - Team members management
  - Team-specific issues and projects

- **My Issues**
  - Personal issue dashboard
  - Filter by assigned, created, subscribed, or activity
  - Kanban and list views
  - Customizable display options

### Technical Features

- **SQLite Database** - Browser-based SQLite using sql.js for persistent local storage
- **JIRA Integration** - Fetch real issues from Apache JIRA (configurable)
- **Real-time Updates** - Custom event system for cross-component updates
- **Responsive Design** - Modern, dark-themed UI matching Linear's aesthetic
- **Keyboard Shortcuts** - Command palette (⌘K / Ctrl+K)
- **Drag & Drop** - Sidebar resizing
- **CORS Proxy** - Built-in proxy support for JIRA API calls

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Database**: sql.js (SQLite in the browser)
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React
- **API Integration**: JIRA REST API

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sleek-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:8080`
   - The app will automatically open in your default browser

### Build for Production

```bash
npm run build
# or
yarn build
```

The production build will be in the `dist` folder.

### Docker Deployment

#### Using Docker Compose (Recommended)

**Production build:**
```bash
docker-compose up app
```
Access at `http://localhost:3000`

**Development mode:**
```bash
docker-compose --profile dev up app-dev
```
Access at `http://localhost:8080`

#### Using Docker directly

**Build the Docker image:**
```bash
# Production build
docker build --target production -t sleek-clone:latest .

# Development build (optional)
docker build --target development -t sleek-clone:dev .
```

**Run the container:**
```bash
# Production (nginx on port 3000)
docker run -p 3000:80 sleek-clone:latest

# Development (Vite dev server on port 8080)
docker run -p 8080:8080 -v $(pwd):/app sleek-clone:dev
```

**Access the application:**
- Production: `http://localhost:3000`
- Development: `http://localhost:8080`

**Stop the container:**
```bash
# If using docker-compose
docker-compose down

# If using docker directly
docker stop <container-id>
```

## 📁 Project Structure

```
sleek-clone/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout/         # Main layout components (Sidebar, TopBar)
│   │   ├── ui/             # Shadcn UI components
│   │   ├── Kanban/         # Kanban board component
│   │   └── ...             # Other components
│   ├── pages/              # Page components
│   │   ├── MyIssues.tsx   # My issues page
│   │   ├── Projects.tsx    # Projects page
│   │   ├── Views.tsx      # Views page
│   │   ├── TeamIssues.tsx # Team issues page
│   │   └── ...            # Other pages
│   ├── hooks/              # Custom React hooks
│   │   ├── useJiraIssues.ts    # JIRA issues hook
│   │   ├── useJiraProjects.ts  # JIRA projects hook
│   │   └── useDatabase.ts      # Database initialization hook
│   ├── db/                 # Database layer
│   │   └── database.ts     # SQLite database operations
│   ├── services/           # API services
│   │   └── jiraApi.ts      # JIRA API client
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                  # Static assets
├── index.html              # HTML template
├── vite.config.ts           # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## ⚙️ Configuration

### JIRA Integration

The app can fetch real issues from Apache JIRA. Configure this in **Settings → JIRA Integration Settings**:

1. **Enable JIRA API Integration**: Toggle to enable/disable
2. **Default JIRA Project Key**: Set the project key (e.g., "FLINK", "KAFKA", "SPARK")
3. **Custom CORS Proxy URL** (optional): If you experience CORS issues, provide a custom proxy

**Default Configuration:**
- Project Key: `FLINK`
- API Endpoint: `https://issues.apache.org/jira/rest/api/2`
- CORS Proxy: Uses Vite dev server proxy in development, public proxies in production

### Database

The app uses SQLite in the browser (via sql.js) for local storage. All data is stored in:
- **localStorage**: `sqlite_db` key contains the SQLite database
- Tables: `issues`, `projects`, `team_members`, `kanban_tasks`, `settings`

## 🎯 Usage Guide

### Creating Issues

1. Click **"New issue"** button (or use ⌘K / Ctrl+K command palette)
2. Fill in the issue details:
   - Title (required)
   - Description (optional)
   - Status, Priority, Assignee
   - Labels, Links, Sub-issues
3. Click **"Create issue"**

### Managing Projects

1. Navigate to **Projects** page
2. Click **"Add project"** to create a new project
3. Set project details: name, description, lead, target date
4. View project issues from the project detail page

### Creating Views

1. Navigate to **Views** page
2. Click **"New view"**
3. Configure filters:
   - Status, Priority, Assignee, Labels, Project
   - Sort by: Created, Updated, Priority
   - Group by: Status, Priority, Assignee
4. Save the view

### Using Views

1. Click on a view in the Views page
2. The app fetches filtered issues from JIRA (if API is enabled)
3. View issues in a list format
4. Click any issue to see details

### Keyboard Shortcuts

- **⌘K / Ctrl+K**: Open command palette
- **⌘V / Ctrl+V**: Save current view (when in a view)

## 🔌 API Integration

### JIRA API

The app integrates with Apache JIRA to fetch real issues. Features:

- **Project Issues**: Fetch issues by project key
- **JQL Queries**: Advanced filtering using JIRA Query Language
- **CORS Handling**: Automatic proxy fallback for CORS issues
- **Error Handling**: Retry logic and error messages

**Example JQL Queries Used:**
- `project=FLINK AND assignee IN ("User Name") ORDER BY created DESC`
- `project=FLINK AND status IN ("To Do", "In Progress") ORDER BY updated DESC`

### API Endpoints

The app uses Vite's proxy in development to bypass CORS:
- Development: `/api/jira/*` → Proxied to `https://issues.apache.org/jira/rest/api/*`
- Production: Uses public CORS proxies (configurable)

## 🗄️ Database Schema

### Issues Table
- `id`, `title`, `description`, `status`, `priority`, `assignee`, `createdBy`
- `projectId`, `createdAt`, `updatedAt`, `dueDate`
- `labels` (JSON), `links` (JSON), `subIssues` (JSON), `comments` (JSON)
- `issueNumber`

### Projects Table
- `id`, `name`, `key`, `description`, `icon`, `color`
- `createdAt`, `updatedAt`

### Settings Table
- `key`, `value`

## 🎨 UI/UX Features

- **Dark Theme**: Modern dark interface matching Linear's design
- **Responsive Layout**: Adapts to different screen sizes
- **Smooth Animations**: Transitions and hover effects
- **Card-based Design**: Rounded cards with shadows
- **Sidebar**: Collapsible sidebar with navigation
- **Top Bar**: Command palette access and notifications

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type checking
npm run type-check
```

### Adding New Features

1. **New Page**: Create in `src/pages/`
2. **New Component**: Create in `src/components/`
3. **New Hook**: Create in `src/hooks/`
4. **New Route**: Add to `src/App.tsx` routes

### Database Operations

All database operations go through `src/db/database.ts`:
- `db.getIssues()` - Get all issues
- `db.insertIssue(issue)` - Create issue
- `db.updateIssue(id, updates)` - Update issue
- `db.deleteIssue(id)` - Delete issue
- Similar methods for projects, settings, etc.

## 🐛 Troubleshooting

### Issues Not Persisting

- Check browser console for errors
- Verify SQLite database is initialized (`useDatabase` hook)
- Check localStorage for `sqlite_db` key

### JIRA API Not Working

- Check CORS proxy settings in Settings
- Verify project key is correct
- Check network tab for API errors
- Try using a custom CORS proxy URL

### Views Not Showing

- Check localStorage for `views` key
- Create a test view using browser console:
  ```javascript
  localStorage.setItem("views", JSON.stringify([{
    id: "test-1",
    name: "Test View",
    filters: {},
    createdAt: new Date().toISOString()
  }]));
  location.reload();
  ```

### Database Errors

- Clear localStorage: `localStorage.clear()`
- Check browser console for SQL errors
- Verify sql.js is loaded (check Network tab)

## 📝 License

This project is a clone/learning project inspired by Linear. It is not affiliated with Linear.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- **Linear** - For the inspiring design and UX
- **Apache JIRA** - For the public API access
- **sql.js** - For bringing SQLite to the browser
- **Shadcn UI** - For excellent UI components
- **Vite** - For the amazing development experience

## 📞 Support

For issues, questions, or contributions, please open an issue in the repository.

---

**Built with ❤️ using React, TypeScript, and Vite**
