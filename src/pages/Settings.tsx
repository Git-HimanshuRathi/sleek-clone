import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Link2,
  Tag,
  FileText,
  Calendar,
  FolderKanban,
  CheckSquare,
  Sparkles,
  FileQuestion,
  Heart,
  Brain,
  Bot,
  HelpCircle,
  Smile,
  Plug,
  Building,
  Users,
  ShieldAlert,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import CustomizeSidebarModal from "@/components/CustomizeSidebarModal";

type SettingsSection = 
  | "preferences"
  | "profile"
  | "notifications"
  | "security-access"
  | "connected-accounts"
  | "issues-labels"
  | "issues-templates"
  | "issues-slas"
  | "projects-labels"
  | "projects-templates"
  | "projects-statuses"
  | "projects-updates"
  | "features-initiatives"
  | "features-documents"
  | "features-customer-requests"
  | "features-pulse"
  | "features-ai"
  | "features-agents"
  | "features-asks"
  | "features-emojis"
  | "features-integrations"
  | "admin-workspace"
  | "admin-teams"
  | "admin-members"
  | "admin-security";

interface SettingsItem {
  id: SettingsSection;
  name: string;
  icon: React.ElementType;
  section?: string;
}

const settingsItems: SettingsItem[] = [
  { id: "preferences", name: "Preferences", icon: SettingsIcon },
  { id: "profile", name: "Profile", icon: User },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "security-access", name: "Security & access", icon: Shield },
  { id: "connected-accounts", name: "Connected accounts", icon: Link2 },
  { id: "issues-labels", name: "Labels", icon: Tag, section: "Issues" },
  { id: "issues-templates", name: "Templates", icon: FileText, section: "Issues" },
  { id: "issues-slas", name: "SLAs", icon: Calendar, section: "Issues" },
  { id: "projects-labels", name: "Labels", icon: Tag, section: "Projects" },
  { id: "projects-templates", name: "Templates", icon: FileText, section: "Projects" },
  { id: "projects-statuses", name: "Statuses", icon: FolderKanban, section: "Projects" },
  { id: "projects-updates", name: "Updates", icon: FileText, section: "Projects" },
  { id: "features-initiatives", name: "Initiatives", icon: Sparkles, section: "Features" },
  { id: "features-documents", name: "Documents", icon: FileText, section: "Features" },
  { id: "features-customer-requests", name: "Customer requests", icon: FileQuestion, section: "Features" },
  { id: "features-pulse", name: "Pulse", icon: Heart, section: "Features" },
  { id: "features-ai", name: "AI", icon: Brain, section: "Features" },
  { id: "features-agents", name: "Agents", icon: Bot, section: "Features" },
  { id: "features-asks", name: "Asks", icon: HelpCircle, section: "Features" },
  { id: "features-emojis", name: "Emojis", icon: Smile, section: "Features" },
  { id: "features-integrations", name: "Integrations", icon: Plug, section: "Features" },
  { id: "admin-workspace", name: "Workspace", icon: Building, section: "Administration" },
  { id: "admin-teams", name: "Teams", icon: Users, section: "Administration" },
  { id: "admin-members", name: "Members", icon: Users, section: "Administration" },
  { id: "admin-security", name: "Security", icon: ShieldAlert, section: "Administration" },
];

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<SettingsSection>("preferences");
  const [isCustomizeSidebarModalOpen, setIsCustomizeSidebarModalOpen] = useState(false);
  
  // Parse section from URL if present
  useEffect(() => {
    const section = location.pathname.split("/settings/")[1];
    if (section && settingsItems.some(item => item.id === section)) {
      setActiveSection(section as SettingsSection);
    }
  }, [location.pathname]);

  const groupedItems = settingsItems.reduce((acc, item) => {
    if (item.section) {
      if (!acc[item.section]) {
        acc[item.section] = [];
      }
      acc[item.section].push(item);
    } else {
      if (!acc["Top"]) {
        acc["Top"] = [];
      }
      acc["Top"].push(item);
    }
    return acc;
  }, {} as Record<string, SettingsItem[]>);

  const renderPreferencesContent = () => (
    <div className="space-y-8">
      {/* General Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">General</h2>
        
        {/* Default home view */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Default home view</label>
              <p className="text-sm text-muted-foreground mt-1">
                Which view is opened when you open up Linear
              </p>
            </div>
            <Select defaultValue="active-issues">
              <SelectTrigger className="w-[180px] bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active-issues">Active issues</SelectItem>
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="all-issues">All issues</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Display full names */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Display full names</label>
              <p className="text-sm text-muted-foreground mt-1">
                Show full names of users instead of shorter usernames
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        {/* First day of the week */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">First day of the week</label>
              <p className="text-sm text-muted-foreground mt-1">
                Used for date pickers
              </p>
            </div>
            <Select defaultValue="sunday">
              <SelectTrigger className="w-[180px] bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sunday">Sunday</SelectItem>
                <SelectItem value="monday">Monday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Convert text emoticons */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Convert text emoticons into emojis</label>
              <p className="text-sm text-muted-foreground mt-1">
                Strings like :) will be converted to 😊
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* Interface and theme Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Interface and theme</h2>
        
        {/* App sidebar */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">App sidebar</label>
              <p className="text-sm text-muted-foreground mt-1">
                Customize sidebar item visibility, ordering, and badge style
              </p>
            </div>
            <Button
              variant="secondary"
              className="bg-background hover:bg-background/80 border-border"
              onClick={() => setIsCustomizeSidebarModalOpen(true)}
            >
              Customize
            </Button>
          </div>
        </div>

        {/* Font size */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Font size</label>
              <p className="text-sm text-muted-foreground mt-1">
                Adjust the size of text across the app
              </p>
            </div>
            <Select defaultValue="default">
              <SelectTrigger className="w-[180px] bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Use pointer cursors */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Use pointer cursors</label>
              <p className="text-sm text-muted-foreground mt-1">
                Change the cursor to a pointer when hovering over any interactive elements
              </p>
            </div>
            <Switch />
          </div>
        </div>

        {/* Interface theme */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Interface theme</label>
              <p className="text-sm text-muted-foreground mt-1">
                Select or customize your interface color scheme
              </p>
            </div>
            <Select defaultValue="system">
              <SelectTrigger className="w-[180px] bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">• Aa System preference</SelectItem>
                <SelectItem value="light">• Aa Light</SelectItem>
                <SelectItem value="dark">• Aa Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Light theme */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Light</label>
              <p className="text-sm text-muted-foreground mt-1">
                Theme to use for light system appearance
              </p>
            </div>
            <Select defaultValue="light">
              <SelectTrigger className="w-[180px] bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">• Aa Light</SelectItem>
                <SelectItem value="light-alt">• Aa Light Alt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dark theme */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Dark</label>
              <p className="text-sm text-muted-foreground mt-1">
                Theme to use for dark system appearance
              </p>
            </div>
            <Select defaultValue="dark">
              <SelectTrigger className="w-[180px] bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">• Aa Dark</SelectItem>
                <SelectItem value="dark-alt">• Aa Dark Alt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Desktop application Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Desktop application</h2>
        
        {/* Open in desktop app */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Open in desktop app</label>
              <p className="text-sm text-muted-foreground mt-1">
                Automatically open links in desktop app when possible
              </p>
            </div>
            <Switch />
          </div>
        </div>

        {/* App notification badge */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">App notification badge</label>
              <p className="text-sm text-muted-foreground mt-1">
                Show a badge on Linear's icon to indicate unread notifications
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        {/* Check spelling */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Check spelling</label>
              <p className="text-sm text-muted-foreground mt-1">
                Check for spelling errors while typing
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* Automations and workflows Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Automations and workflows</h2>
        
        {/* Auto-assign to self */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Auto-assign to self</label>
              <p className="text-sm text-muted-foreground mt-1">
                When creating new issues, always assign them to yourself by default
              </p>
            </div>
            <Switch />
          </div>
        </div>

        {/* Git attachment format */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Git attachment format</label>
              <p className="text-sm text-muted-foreground mt-1">
                The format of GitHub/GitLab attachments on issues
              </p>
            </div>
            <Select defaultValue="title">
              <SelectTrigger className="w-[180px] bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* On git branch copy, move issue to started status */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">On git branch copy, move issue to started status</label>
              <p className="text-sm text-muted-foreground mt-1">
                After copying the git branch name, issue status is moved to the team's first started workflow status. Hold Alt to disable.
              </p>
            </div>
            <Switch />
          </div>
        </div>

        {/* On move to started status, assign to yourself */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">On move to started status, assign to yourself</label>
              <p className="text-sm text-muted-foreground mt-1">
                When you move an unassigned issue to started, it will be automatically assigned to you.
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex bg-background">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar-background p-4 overflow-y-auto">
        {/* Back to app */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>&lt; Back to app</span>
        </button>

        {/* Settings Navigation */}
        <nav className="space-y-6">
          {Object.entries(groupedItems).map(([section, items]) => (
            <div key={section}>
              {section !== "Top" && (
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
                  {section}
                </h3>
              )}
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-surface"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="flex-1 text-left">{item.name}</span>
                      {item.id === "admin-security" && (
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto" style={{ backgroundColor: '#101012' }}>
        <div className="max-w-7xl mx-auto p-8">
          {activeSection === "preferences" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8">
                Preferences
              </h1>
              {renderPreferencesContent()}
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-foreground mb-8">
                {settingsItems.find(item => item.id === activeSection)?.name}
              </h1>
              <div className="text-foreground">
                {settingsItems.find(item => item.id === activeSection)?.name} content
              </div>
            </>
          )}
        </div>
      </main>

      <CustomizeSidebarModal
        open={isCustomizeSidebarModalOpen}
        onOpenChange={setIsCustomizeSidebarModalOpen}
      />
    </div>
  );
};

export default Settings;

