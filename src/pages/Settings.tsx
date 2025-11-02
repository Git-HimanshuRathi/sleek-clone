import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Settings as SettingsIcon,
  User,
  Cpu,
  Tag,
  FileText,
  FileStack,
  Flame,
  Hexagon,
  TrendingUp,
  Zap,
  Asterisk,
  MousePointer,
  HelpCircle,
  Smile,
  Building,
  UserSquare,
  Users,
  ArrowLeft,
  ChevronRight,
  Code,
  CreditCard,
  ArrowLeftRight,
  LayoutGrid,
  Plus,
  Pencil,
  Monitor,
  Smartphone,
  Mail,
  Trash2,
  Chrome,
  Key,
  Github,
  Calendar,
  ExternalLink,
  Search,
  Filter,
  Circle,
  Square,
  CheckCircle,
  XCircle,
  Plus as PlusIcon,
  Info,
  Upload,
  Target,
  Reply,
  UserSquare2,
  Sparkles,
  Image as ImageIcon,
  Globe,
  Download,
  Shield,
  AlertTriangle,
  Settings as SettingsIcon2,
  RefreshCw,
  Bot,
  Clock,
  Link as LinkIcon,
  Copy,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomizeSidebarModal from "@/components/CustomizeSidebarModal";
import { Avatar } from "@/components/Avatar";

// Custom icons for settings
const NotificationRefreshIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="2" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path
      d="M5 6h6M5 8.5h4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M10.5 3.5L12.5 5.5L10.5 7.5M12.5 5.5H9.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SecurityAccessIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="4" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M1 10c0-1.5 1.5-3 3-3s3 1.5 3 3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="11" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M8 10c0-1.5 1.5-3 3-3s3 1.5 3 3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="7.5" cy="6.5" r="0.8" fill="currentColor" />
    <rect x="7" y="7" width="1" height="2.5" rx="0.5" fill="currentColor" />
  </svg>
);

const IntegrationsIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="1" y="1" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <rect x="9" y="1" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <rect x="1" y="9" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <rect x="9" y="9" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path
      d="M12.5 12.5h1.5M13.25 11.75v1.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const ApiIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 4L2 6L4 8M12 4L14 6L12 8M8 3L8 13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SecurityShieldIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 2L3 4V7C3 10.5 5.5 13 8 14C10.5 13 13 10.5 13 7V4L8 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M8 7L7 8L8 9L9 8L8 7Z"
      fill="currentColor"
    />
  </svg>
);

const TeamsIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="6" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M3 12c0-1.5 1.5-3 3-3s3 1.5 3 3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="11" cy="4.5" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M8.5 11.5c0-1 0.75-2 1.5-2s1.5 1 1.5 2" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

const MembersIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="5" cy="4.5" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M2 11.5c0-1.5 1.5-3 3-3s3 1.5 3 3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="10" cy="4" r="1.2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M7.5 11c0-1 0.75-2 1.5-2s1.5 1 1.5 2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="11.5" cy="4" r="1.2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M9 11c0-1 0.75-2 1.5-2s1.5 1 1.5 2" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

const InitiativesIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 2L8 8L13 10L8 12L8 14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path
      d="M3 8L6 6L6 10L3 8Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CustomerRequestsIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="3" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M5 7h6M5 9h4M5 11h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M11 5C11 5 12 5.5 12 6.5C12 7.5 11 8 11 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="11.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);

const TeamIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="2" width="12" height="12" rx="2" fill="#22c55e" />
    <circle cx="8" cy="7" r="2" fill="white" />
    <path
      d="M5 12C5 10.5 6.5 9 8 9C9.5 9 11 10.5 11 12"
      fill="white"
    />
  </svg>
);

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
  | "admin-security"
  | "admin-api"
  | "admin-applications"
  | "admin-billing"
  | "admin-import-export";

interface SettingsItem {
  id: SettingsSection;
  name: string;
  icon: React.ElementType;
  section?: string;
}

const settingsItems: SettingsItem[] = [
  { id: "preferences", name: "Preferences", icon: SettingsIcon },
  { id: "profile", name: "Profile", icon: User },
  { id: "notifications", name: "Notifications", icon: NotificationRefreshIcon },
  { id: "security-access", name: "Security & access", icon: SecurityAccessIcon },
  { id: "connected-accounts", name: "Connected accounts", icon: Cpu },
  { id: "issues-labels", name: "Labels", icon: Tag, section: "Issues" },
  { id: "issues-templates", name: "Templates", icon: FileStack, section: "Issues" },
  { id: "issues-slas", name: "SLAs", icon: Flame, section: "Issues" },
  { id: "projects-labels", name: "Labels", icon: Tag, section: "Projects" },
  { id: "projects-templates", name: "Templates", icon: FileStack, section: "Projects" },
  { id: "projects-statuses", name: "Statuses", icon: Hexagon, section: "Projects" },
  { id: "projects-updates", name: "Updates", icon: TrendingUp, section: "Projects" },
  { id: "features-initiatives", name: "Initiatives", icon: InitiativesIcon, section: "Features" },
  { id: "features-documents", name: "Documents", icon: FileText, section: "Features" },
  { id: "features-customer-requests", name: "Customer requests", icon: CustomerRequestsIcon, section: "Features" },
  { id: "features-pulse", name: "Pulse", icon: Zap, section: "Features" },
  { id: "features-ai", name: "AI", icon: Asterisk, section: "Features" },
  { id: "features-agents", name: "Agents", icon: MousePointer, section: "Features" },
  { id: "features-asks", name: "Asks", icon: HelpCircle, section: "Features" },
  { id: "features-emojis", name: "Emojis", icon: Smile, section: "Features" },
  { id: "features-integrations", name: "Integrations", icon: IntegrationsIcon, section: "Features" },
  { id: "admin-workspace", name: "Workspace", icon: Building, section: "Administration" },
  { id: "admin-teams", name: "Teams", icon: TeamsIcon, section: "Administration" },
  { id: "admin-members", name: "Members", icon: MembersIcon, section: "Administration" },
  { id: "admin-security", name: "Security", icon: SecurityShieldIcon, section: "Administration" },
  { id: "admin-api", name: "API", icon: ApiIcon, section: "Administration" },
  { id: "admin-applications", name: "Applications", icon: LayoutGrid, section: "Administration" },
  { id: "admin-billing", name: "Billing", icon: CreditCard, section: "Administration" },
  { id: "admin-import-export", name: "Import / Export", icon: ArrowLeftRight, section: "Administration" },
];

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<SettingsSection>("preferences");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [isCustomizeSidebarModalOpen, setIsCustomizeSidebarModalOpen] = useState(false);
  
  // JIRA API settings
  const [jiraProjectKey, setJiraProjectKey] = useState(() => 
    localStorage.getItem("jiraProjectKey") || "FLINK"
  );
  const [useJiraApi, setUseJiraApi] = useState(() => 
    localStorage.getItem("useJiraApi") !== "false"
  );
  const [jiraProxyUrl, setJiraProxyUrl] = useState(() => 
    localStorage.getItem("jiraProxyUrl") || ""
  );
  const [fetchStats, setFetchStats] = useState(() => 
    localStorage.getItem("jiraFetchStats") !== "false" // Default to true
  );

  useEffect(() => {
    localStorage.setItem("jiraProjectKey", jiraProjectKey);
  }, [jiraProjectKey]);

  useEffect(() => {
    localStorage.setItem("useJiraApi", String(useJiraApi));
  }, [useJiraApi]);

  useEffect(() => {
    if (jiraProxyUrl) {
      localStorage.setItem("jiraProxyUrl", jiraProxyUrl);
    } else {
      localStorage.removeItem("jiraProxyUrl");
    }
  }, [jiraProxyUrl]);

  useEffect(() => {
    localStorage.setItem("jiraFetchStats", String(fetchStats));
  }, [fetchStats]);
  
  // Parse section from URL if present
  useEffect(() => {
    const sectionFromPath = location.pathname.split("/settings/")[1];
    const sectionFromQuery = new URLSearchParams(location.search).get("section");
    const section = sectionFromPath || sectionFromQuery;
    if (section && settingsItems.some(item => item.id === section)) {
      setActiveSection(section as SettingsSection);
    }
  }, [location.pathname, location.search]);

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
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
        {/* Default home view */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Default home view</label>
              <p className="text-sm text-muted-foreground mt-1">
                Which view is opened when you open up Linear
              </p>
            </div>
            <Select defaultValue="active-issues">
              <SelectTrigger className="w-[180px] bg-[#25272E] border-[#33363D] text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active-issues">Active issues</SelectItem>
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="all-issues">All issues</SelectItem>
              </SelectContent>
            </Select>
        </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

        {/* Display full names */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Display full names</label>
              <p className="text-sm text-muted-foreground mt-1">
                Show full names of users instead of shorter usernames
              </p>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-[#5E6AD2] data-[state=unchecked]:bg-[#707173] [&>*]:data-[state=checked]:bg-[#fffeff]" />
        </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

        {/* First day of the week */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">First day of the week</label>
              <p className="text-sm text-muted-foreground mt-1">
                Used for date pickers
              </p>
            </div>
            <Select defaultValue="sunday">
              <SelectTrigger className="w-[180px] bg-[#25272E] border-[#33363D] text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sunday">Sunday</SelectItem>
                <SelectItem value="monday">Monday</SelectItem>
              </SelectContent>
            </Select>
        </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

        {/* Convert text emoticons */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Convert text emoticons into emojis</label>
              <p className="text-sm text-muted-foreground mt-1">
                Strings like :) will be converted to 😊
              </p>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-[#5E6AD2] data-[state=unchecked]:bg-[#707173] [&>*]:data-[state=checked]:bg-[#fffeff]" />
          </div>
        </div>
      </div>

      {/* Interface and theme Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Interface and theme</h2>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
        {/* App sidebar */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">App sidebar</label>
              <p className="text-sm text-muted-foreground mt-1">
                Customize sidebar item visibility, ordering, and badge style
              </p>
            </div>
            <Button
              variant="ghost"
              className="text-foreground hover:bg-transparent hover:text-foreground p-0 h-auto"
              onClick={() => setIsCustomizeSidebarModalOpen(true)}
            >
              Customize
            </Button>
        </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

        {/* Font size */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Font size</label>
              <p className="text-sm text-muted-foreground mt-1">
                Adjust the size of text across the app
              </p>
            </div>
            <Select defaultValue="default">
              <SelectTrigger className="w-[180px] bg-[#25272E] border-[#33363D] text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
        </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

        {/* Use pointer cursors */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Use pointer cursors</label>
              <p className="text-sm text-muted-foreground mt-1">
                Change the cursor to a pointer when hovering over any interactive elements
              </p>
            </div>
            <Switch className="data-[state=checked]:bg-[#5E6AD2] data-[state=unchecked]:bg-[#707173]" />
        </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

        {/* Interface theme */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Interface theme</label>
              <p className="text-sm text-muted-foreground mt-1">
                Select or customize your interface color scheme
              </p>
            </div>
            <Select defaultValue="system">
              <SelectTrigger className="w-[180px] bg-[#25272E] border-[#33363D] text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">• Aa System preference</SelectItem>
                <SelectItem value="light">• Aa Light</SelectItem>
                <SelectItem value="dark">• Aa Dark</SelectItem>
              </SelectContent>
            </Select>
        </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

        {/* Light theme */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Light</label>
              <p className="text-sm text-muted-foreground mt-1">
                Theme to use for light system appearance
              </p>
            </div>
            <Select defaultValue="light">
              <SelectTrigger className="w-[180px] bg-[#25272E] border-[#33363D] text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">• Aa Light</SelectItem>
                <SelectItem value="light-alt">• Aa Light Alt</SelectItem>
              </SelectContent>
            </Select>
        </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

        {/* Dark theme */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Dark</label>
              <p className="text-sm text-muted-foreground mt-1">
                Theme to use for dark system appearance
              </p>
            </div>
            <Select defaultValue="dark">
              <SelectTrigger className="w-[180px] bg-[#25272E] border-[#33363D] text-foreground">
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
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
        {/* Open in desktop app */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Open in desktop app</label>
              <p className="text-sm text-muted-foreground mt-1">
                Automatically open links in desktop app when possible
              </p>
            </div>
            <Switch className="data-[state=checked]:bg-[#5E6AD2] data-[state=unchecked]:bg-[#707173]" />
        </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

        {/* App notification badge */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">App notification badge</label>
              <p className="text-sm text-muted-foreground mt-1">
                Show a badge on Linear's icon to indicate unread notifications
              </p>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-[#5E6AD2] data-[state=unchecked]:bg-[#707173] [&>*]:data-[state=checked]:bg-[#fffeff]" />
        </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

        {/* Check spelling */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Check spelling</label>
              <p className="text-sm text-muted-foreground mt-1">
                Check for spelling errors while typing
              </p>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-[#5E6AD2] data-[state=unchecked]:bg-[#707173] [&>*]:data-[state=checked]:bg-[#fffeff]" />
          </div>
        </div>
      </div>

      {/* Automations and workflows Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Automations and workflows</h2>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
        {/* Auto-assign to self */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Auto-assign to self</label>
              <p className="text-sm text-muted-foreground mt-1">
                When creating new issues, always assign them to yourself by default
              </p>
            </div>
            <Switch className="data-[state=checked]:bg-[#5E6AD2] data-[state=unchecked]:bg-[#707173]" />
        </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

        {/* Git attachment format */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Git attachment format</label>
              <p className="text-sm text-muted-foreground mt-1">
                The format of GitHub/GitLab attachments on issues
              </p>
            </div>
            <Select defaultValue="title">
              <SelectTrigger className="w-[180px] bg-[#25272E] border-[#33363D] text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
        </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

        {/* On git branch copy, move issue to started status */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">On git branch copy, move issue to started status</label>
              <p className="text-sm text-muted-foreground mt-1">
                After copying the git branch name, issue status is moved to the team's first started workflow status. Hold Alt to disable.
              </p>
            </div>
            <Switch className="data-[state=checked]:bg-[#5E6AD2] data-[state=unchecked]:bg-[#707173]" />
        </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

        {/* On move to started status, assign to yourself */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">On move to started status, assign to yourself</label>
              <p className="text-sm text-muted-foreground mt-1">
                When you move an unassigned issue to started, it will be automatically assigned to you.
              </p>
            </div>
            <Switch className="data-[state=checked]:bg-[#5E6AD2] data-[state=unchecked]:bg-[#707173]" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileContent = () => (
    <div className="space-y-8">
      {/* Profile Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Profile</h2>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          {/* Profile picture */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#25272E] border-2 border-[#FF9500] flex items-center justify-center">
                <span className="text-lg font-semibold text-[#FF9500]">AD</span>
              </div>
              <label className="text-sm font-medium text-foreground">Profile picture</label>
            </div>
          </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

          {/* Email */}
          <div className="flex items-center justify-between px-5 py-4">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground">aaditdhariwal@gmail.com</span>
              <Pencil className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

          {/* Full name */}
          <div className="flex items-center justify-between px-5 py-4">
            <label className="text-sm font-medium text-foreground">Full name</label>
            <Input
              value="Aadit Dhariwal"
              readOnly
              className="w-[280px] bg-[#25272E] border-[#33363D] text-foreground"
            />
          </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

          {/* Username */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="text-sm font-medium text-foreground">Username</label>
                <p className="text-xs text-muted-foreground mt-1">
                  Nickname or first name, however you want to be called in Linear.
                </p>
              </div>
            </div>
            <Input
              value="aaditdhariwal"
              readOnly
              className="w-full bg-[#25272E] border-[#33363D] text-foreground mt-2"
            />
          </div>
        </div>
      </div>

      {/* Workspace access Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Workspace access</h2>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          {/* Delete workspace */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-foreground">Delete workspace</label>
                <p className="text-xs text-muted-foreground mt-1">
                  Schedule workspace to be permanently deleted.
                </p>
              </div>
              <Button
                variant="destructive"
                className="bg-[#B00020] hover:bg-[#C00020] text-white"
              >
                Delete...
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsContent = () => (
    <div className="space-y-8">
      {/* Notification channels Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Notification channels</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Choose how to be notified for workspace activity. Notifications will always go to your Linear inbox.
        </p>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          {/* Desktop */}
          <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1a1b1e] transition-colors">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Desktop</div>
                <div className="text-xs text-muted-foreground mt-0.5">• Disabled</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

          {/* Mobile */}
          <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1a1b1e] transition-colors">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Mobile</div>
                <div className="text-xs text-green-500 mt-0.5">• Enabled for all notifications</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

          {/* Email */}
          <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1a1b1e] transition-colors">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Email</div>
                <div className="text-xs text-green-500 mt-0.5">• Enabled for all notifications</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

          {/* Slack */}
          <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1a1b1e] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 5.042a2.528 2.528 0 0 1-2.52-2.52A2.528 2.528 0 0 1 18.956 0a2.528 2.528 0 0 1 2.523 2.522v2.52h-2.523zM18.956 6.313a2.528 2.528 0 0 1 2.523 2.521 2.528 2.528 0 0 1-2.523 2.521h-6.313A2.528 2.528 0 0 1 10.121 8.834a2.528 2.528 0 0 1 2.522-2.521h6.313zM15.165 18.956a2.528 2.528 0 0 1 2.521-2.523 2.528 2.528 0 0 1 2.521 2.523 2.528 2.528 0 0 1-2.521 2.522h-2.521v-2.522zM13.895 18.956a2.528 2.528 0 0 1-2.523 2.522 2.528 2.528 0 0 1-2.52-2.522v-6.313a2.528 2.528 0 0 1 2.52-2.521 2.528 2.528 0 0 1 2.523 2.521v6.313z"/>
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Slack</div>
                <div className="text-xs text-muted-foreground mt-0.5">• Disabled</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Updates from Linear Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Updates from Linear</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Subscribe to product announcements and important changes from the Linear team
        </p>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          {/* Changelog - Show updates in sidebar */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Changelog</div>
                <div className="text-sm font-medium text-foreground">Show updates in sidebar</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Highlight new features and improvements in the app sidebar
                </p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-[#5E6AD2] data-[state=unchecked]:bg-[#707173]" />
            </div>
          </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

          {/* Changelog newsletter */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-foreground">Changelog newsletter</div>
              <p className="text-xs text-muted-foreground mt-1">
                Twice a month email highlighting new features and improvements
              </p>
            </div>
            <Switch className="data-[state=checked]:bg-[#5E6AD2] data-[state=unchecked]:bg-[#707173]" />
          </div>
        </div>
      </div>

      {/* Marketing Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Marketing</h2>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          {/* Marketing and onboarding */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-foreground">Marketing and onboarding</div>
              <p className="text-xs text-muted-foreground mt-1">
                Occasional emails to help you get the most out of Linear
              </p>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-[#5E6AD2] data-[state=unchecked]:bg-[#707173] [&>*]:data-[state=checked]:bg-[#fffeff]" />
          </div>
        </div>
      </div>

      {/* Other updates Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Other updates</h2>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          {/* Invite accepted */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-foreground">Invite accepted</div>
              <p className="text-xs text-muted-foreground mt-1">
                Email when invitees accept an invite
              </p>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-[#5E6AD2] data-[state=unchecked]:bg-[#707173] [&>*]:data-[state=checked]:bg-[#fffeff]" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityAccessContent = () => (
    <div className="space-y-8">
      {/* Sessions Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Sessions</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Devices logged into your account
        </p>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#4285F4" />
                <path d="M12 2L20.5 8L16 12L12 2Z" fill="#EA4335" />
                <path d="M12 2L3.5 8L8 12L12 2Z" fill="#FBBC04" />
                <path d="M3.5 8L8 12L12 22L3.5 8Z" fill="#34A853" />
                <path d="M20.5 8L16 12L12 22L20.5 8Z" fill="#EA4335" />
                <circle cx="12" cy="12" r="3" fill="#4285F4" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Chrome on Windows</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-green-500">• Current session</span>
                <span className="text-xs text-muted-foreground">Anekal, IN</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Passkeys Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Passkeys</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Passkeys are a secure way to sign in to your Linear account
        </p>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-muted-foreground">No passkeys registered</span>
            <Button className="bg-[#25272E] hover:bg-[#2a2c32] border border-[#33363D] text-foreground">
              New passkey
            </Button>
          </div>
        </div>
      </div>

      {/* Personal API keys Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Personal API keys</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Use Linear's GraphQL API to build your own integrations
        </p>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-muted-foreground">No API keys created</span>
            <Button className="bg-[#25272E] hover:bg-[#2a2c32] border border-[#33363D] text-foreground">
              New API key
            </Button>
          </div>
        </div>
      </div>

      {/* Authorized applications Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Authorized applications</h2>
        <p className="text-sm text-muted-foreground mb-4">
          OAuth applications you've approved
        </p>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          <div className="px-5 py-4 text-center">
            <span className="text-sm text-muted-foreground">
              No applications have been authorized to connect with your account.
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConnectedAccountsContent = () => (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground mb-8">
        You can connect your Linear account with other apps and services
      </p>

      {/* Slack Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Slack</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Connect Slack with Linear for real-time updates, issue creation, and seamless progress sharing
        </p>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1a1b1e] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 5.042a2.528 2.528 0 0 1-2.52-2.52A2.528 2.528 0 0 1 18.956 0a2.528 2.528 0 0 1 2.523 2.522v2.52h-2.523zM18.956 6.313a2.528 2.528 0 0 1 2.523 2.521 2.528 2.528 0 0 1-2.523 2.521h-6.313A2.528 2.528 0 0 1 10.121 8.834a2.528 2.528 0 0 1 2.522-2.521h6.313zM15.165 18.956a2.528 2.528 0 0 1 2.521-2.523 2.528 2.528 0 0 1 2.521 2.523 2.528 2.528 0 0 1-2.521 2.522h-2.521v-2.522zM13.895 18.956a2.528 2.528 0 0 1-2.523 2.522 2.528 2.528 0 0 1-2.52-2.522v-6.313a2.528 2.528 0 0 1 2.52-2.521 2.528 2.528 0 0 1 2.523 2.521v6.313z"/>
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Slack account</div>
                <div className="text-xs text-muted-foreground mt-0.5">Link your Slack account and receive personal notifications</div>
              </div>
            </div>
            <Button className="bg-[#25272E] hover:bg-[#2a2c32] border border-[#33363D] text-foreground flex items-center gap-1">
              Connect
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* GitHub Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">GitHub</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Connect GitHub to Linear to link issues with commits, PRs, and branches for a smoother workflow
        </p>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-foreground">Workspace not connected to GitHub</span>
            <div className="flex items-center gap-1 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              <span>Workspace settings</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Google Calendar Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Google Calendar</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Sync Linear with Google Calendar to automate your out of office status
        </p>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1a1b1e] transition-colors">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-sm font-medium text-foreground">Google Calendar</div>
                <div className="text-xs text-muted-foreground mt-0.5">Display your out of office status in Linear</div>
              </div>
            </div>
            <Button className="bg-[#25272E] hover:bg-[#2a2c32] border border-[#33363D] text-foreground flex items-center gap-1">
              Connect
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Notion Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Notion</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Connect to preview Linear issues, views and projects in Notion
        </p>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1a1b1e] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Connect personal account</div>
                <div className="text-xs text-muted-foreground mt-0.5">Connect your Notion account to use the integration</div>
              </div>
            </div>
            <Button className="bg-[#25272E] hover:bg-[#2a2c32] border border-[#33363D] text-foreground flex items-center gap-1">
              Connect
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIssuesLabelsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Filter by name..."
              className="w-full bg-[#17181B] border-[#2d3036] text-foreground pl-9"
            />
          </div>
          <Select defaultValue="workspace">
            <SelectTrigger className="w-[140px] bg-[#17181B] border-[#2d3036] text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="workspace">Workspace</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-[#17181B] border-[#2d3036] text-foreground hover:bg-[#1a1b1e]">
            New group
          </Button>
          <Button className="bg-[#5E6AD2] hover:bg-[#6B77E0] text-white">
            New label
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
        {/* Table Header */}
        <div className="flex items-center px-5 py-3 border-b border-[#2d3036]">
          <div className="w-[200px] text-xs font-medium text-muted-foreground">Name ↓</div>
          <div className="flex-1 text-xs font-medium text-muted-foreground">Description</div>
          <div className="w-[100px] text-xs font-medium text-muted-foreground">Issues</div>
          <div className="w-[140px] text-xs font-medium text-muted-foreground">Last applied</div>
          <div className="w-[100px] text-xs font-medium text-muted-foreground">Created</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-[#25272E]">
          <div className="flex items-center px-5 py-3 hover:bg-[#1a1b1e] transition-colors cursor-pointer">
            <div className="w-[200px] flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-foreground">Bug</span>
            </div>
            <div className="flex-1 text-sm text-muted-foreground"></div>
            <div className="w-[100px] text-sm text-muted-foreground"></div>
            <div className="w-[140px] text-sm text-muted-foreground"></div>
            <div className="w-[100px] text-sm text-muted-foreground">Nov 1</div>
          </div>
          <div className="flex items-center px-5 py-3 hover:bg-[#1a1b1e] transition-colors cursor-pointer">
            <div className="w-[200px] flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm text-foreground">Feature</span>
            </div>
            <div className="flex-1 text-sm text-muted-foreground"></div>
            <div className="w-[100px] text-sm text-muted-foreground"></div>
            <div className="w-[140px] text-sm text-muted-foreground"></div>
            <div className="w-[100px] text-sm text-muted-foreground">Nov 1</div>
          </div>
          <div className="flex items-center px-5 py-3 hover:bg-[#1a1b1e] transition-colors cursor-pointer">
            <div className="w-[200px] flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-foreground">Improvement</span>
            </div>
            <div className="flex-1 text-sm text-muted-foreground"></div>
            <div className="w-[100px] text-sm text-muted-foreground"></div>
            <div className="w-[140px] text-sm text-muted-foreground"></div>
            <div className="w-[100px] text-sm text-muted-foreground">Nov 1</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIssuesTemplatesContent = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          These templates are available when creating issues for any team in the workspace. To create templates that only apply to specific teams, add them as team templates.{" "}
          <a href="#" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            Docs
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>
        
        <div className="bg-[#17181B] rounded-lg border border-[#2d3036] px-5 py-4 flex items-center justify-between">
          <span className="text-sm text-foreground">No issue templates</span>
          <Button className="bg-[#25272E] hover:bg-[#2a2c32] border border-[#33363D] text-foreground flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            New template
          </Button>
        </div>
      </div>
    </div>
  );

  const renderIssuesSLAsContent = () => (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        Service-level agreements (SLAs) automatically apply deadlines to issues when they match predefined parameters. While often used to define response times to customer issues, they can also be used to define internal standards for bug and time-sensitive issue resolution.{" "}
        <a href="#" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          Docs
          <ExternalLink className="w-3 h-3" />
        </a>
      </p>

      {/* Enable SLAs Section */}
      <div className="space-y-3">
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-foreground">Enable SLAs</div>
              <p className="text-xs text-muted-foreground mt-1">
                Workspace-wide access to issue SLA automations and notifications
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-[#25272E] hover:bg-[#2a2c32] border border-[#33363D] text-foreground text-xs px-3 py-1 h-auto flex items-center gap-1">
                <PlusIcon className="w-3 h-3" />
                Upgrade
              </Button>
              <Switch className="data-[state=checked]:bg-[#5E6AD2] data-[state=unchecked]:bg-[#707173]" />
            </div>
          </div>
        </div>
      </div>

      {/* Automation rules Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Automation rules</h2>
            <p className="text-sm text-muted-foreground">
              Use automation rules to automatically add or remove SLAs based on filters.
            </p>
          </div>
          <Button className="bg-[#25272E] hover:bg-[#2a2c32] border border-[#33363D] text-foreground">
            Add rule
          </Button>
        </div>
      </div>
    </div>
  );

  const renderProjectsLabelsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Filter by name..."
            className="w-[280px] bg-[#17181B] border-[#2d3036] text-foreground"
          />
          <Select defaultValue="workspace">
            <SelectTrigger className="w-[140px] bg-[#17181B] border-[#2d3036] text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="workspace">Workspace</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-[#17181B] border-[#2d3036] text-foreground hover:bg-[#1a1b1e]">
            New group
          </Button>
          <Button className="bg-[#5E6AD2] hover:bg-[#6B77E0] text-white">
            New label
          </Button>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-[#17181B] rounded-lg border border-[#2d3036] py-16 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-foreground flex items-center justify-center mb-4 relative">
          <div className="absolute top-1 left-1 w-6 h-6 rounded-full border border-foreground"></div>
          <div className="absolute top-1 right-1 w-6 h-6 rounded-full border border-foreground"></div>
          <div className="absolute bottom-1 left-1 w-6 h-6 rounded-full border border-foreground"></div>
          <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full border border-foreground"></div>
        </div>
        <span className="text-sm text-muted-foreground">No labels found</span>
      </div>
    </div>
  );

  const renderProjectsTemplatesContent = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          These templates are available when creating projects for any team in the workspace. To create templates that only apply to specific teams, add them as team templates.{" "}
          <a href="#" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            Docs
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>
        
        <div className="bg-[#17181B] rounded-lg border border-[#2d3036] px-5 py-4 flex items-center justify-between">
          <span className="text-sm text-foreground">No project templates</span>
          <Button className="bg-[#25272E] hover:bg-[#2a2c32] border border-[#33363D] text-foreground flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            New template
          </Button>
        </div>
      </div>
    </div>
  );

  const renderProjectsStatusesContent = () => (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground mb-8">
        Project statuses define the workflow that projects go through from start to completion.
      </p>

      <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
        {/* Backlog */}
        <div className="px-5 py-3 border-b border-[#25272E]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Backlog</span>
            <PlusIcon className="w-4 h-4 text-muted-foreground cursor-pointer" />
          </div>
          <div className="flex items-center gap-2 mt-3 ml-6">
            <div className="w-5 h-5 rounded-full border-2 border-[#FF9500] bg-[#FF9500]/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
            <span className="text-sm text-foreground">Backlog</span>
          </div>
        </div>

        {/* Planned */}
        <div className="px-5 py-3 border-b border-[#25272E]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Planned</span>
            <PlusIcon className="w-4 h-4 text-muted-foreground cursor-pointer" />
          </div>
          <div className="flex items-center gap-2 mt-3 ml-6">
            <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
            <span className="text-sm text-foreground">Planned</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="px-5 py-3 border-b border-[#25272E]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">In Progress</span>
            <PlusIcon className="w-4 h-4 text-muted-foreground cursor-pointer" />
          </div>
          <div className="flex items-center gap-2 mt-3 ml-6">
            <div className="w-5 h-5 rounded-full border-2 border-yellow-500 bg-yellow-500/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
            <div>
              <span className="text-sm text-foreground">In Progress</span>
              <p className="text-xs text-muted-foreground mt-0.5">1 project</p>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="px-5 py-3 border-b border-[#25272E]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Completed</span>
            <PlusIcon className="w-4 h-4 text-muted-foreground cursor-pointer" />
          </div>
          <div className="flex items-center gap-2 mt-3 ml-6">
            <div className="w-5 h-5 rounded-lg bg-blue-500 flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-foreground">Completed</span>
          </div>
        </div>

        {/* Canceled */}
        <div className="px-5 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Canceled</span>
            <PlusIcon className="w-4 h-4 text-muted-foreground cursor-pointer" />
          </div>
          <div className="flex items-center gap-2 mt-3 ml-6">
            <div className="w-5 h-5 rounded-lg bg-[#33363D] flex items-center justify-center">
              <XCircle className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-foreground">Canceled</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjectsUpdatesContent = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Short status reports about the progress and health of your projects. Project members regularly post updates, and subscribers automatically receive them in their inbox.{" "}
          <a href="#" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            Docs
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </div>

      {/* Update schedule Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-2">Update schedule</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Configure how often updates are expected on projects. Project leads will receive reminders to post updates.
        </p>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-[#17181B] border-[#2d3036] text-foreground hover:bg-[#1a1b1e]">
            No expectation for updates
          </Button>
          <Button variant="outline" className="bg-[#17181B] border-[#2d3036] text-foreground hover:bg-[#1a1b1e]">
            Edit
          </Button>
        </div>
      </div>

      {/* Slack notifications Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-2">Slack notifications</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Updates are only posted to Slack when associated with at least one non-private team.
        </p>
        
        <div className="bg-[#17181B] rounded-lg border border-[#2d3036] px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#25272E] flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 5.042a2.528 2.528 0 0 1-2.52-2.52A2.528 2.528 0 0 1 18.956 0a2.528 2.528 0 0 1 2.523 2.522v2.52h-2.523zM18.956 6.313a2.528 2.528 0 0 1 2.523 2.521 2.528 2.528 0 0 1-2.523 2.521h-6.313A2.528 2.528 0 0 1 10.121 8.834a2.528 2.528 0 0 1 2.522-2.521h6.313zM15.165 18.956a2.528 2.528 0 0 1 2.521-2.523 2.528 2.528 0 0 1 2.521 2.523 2.528 2.528 0 0 1-2.521 2.522h-2.521v-2.522zM13.895 18.956a2.528 2.528 0 0 1-2.523 2.522 2.528 2.528 0 0 1-2.52-2.522v-6.313a2.528 2.528 0 0 1 2.52-2.521 2.528 2.528 0 0 1 2.523 2.521v6.313z"/>
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Send project updates to a Slack channel</div>
                <p className="text-xs text-muted-foreground mt-0.5">Connect a channel to send all project updates to</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              <a href="#" className="text-sm text-foreground hover:text-muted-foreground inline-flex items-center gap-1">
                Connect
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInitiativesContent = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Initiatives group multiple projects that contribute toward the same strategic effort. Use initiatives to plan and coordinate larger streams of work and monitor their progress at scale.{" "}
          <a href="#" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            Docs
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </div>

      {/* Enable Initiatives Section */}
      <div className="space-y-3">
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-foreground">Enable Initiatives</div>
              <p className="text-xs text-muted-foreground mt-1">
                Visible to all non-guest workspace members.
              </p>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-[#5E6AD2] data-[state=unchecked]:bg-[#707173]" />
          </div>
        </div>
      </div>

      {/* Initiative updates Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-2">Initiative updates</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Short status reports about the progress and health of your initiative. Updates are ideally written regularly by the owner of the initiative. Subscribers receive these updates directly in their inbox. You can also configure a Slack channel where all initiative updates are posted.
        </p>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">Update schedule</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Configure how often updates are expected on initiatives. Initiative owners will receive reminders to post updates.
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="bg-[#17181B] border-[#2d3036] text-foreground hover:bg-[#1a1b1e]">
                No expectation for updates
              </Button>
              <Button variant="outline" className="bg-[#17181B] border-[#2d3036] text-foreground hover:bg-[#1a1b1e]">
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Slack notifications Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-2">Slack notifications</h2>
        
        <div className="bg-[#17181B] rounded-lg border border-[#2d3036] px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#25272E] flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 5.042a2.528 2.528 0 0 1-2.52-2.52A2.528 2.528 0 0 1 18.956 0a2.528 2.528 0 0 1 2.523 2.522v2.52h-2.523zM18.956 6.313a2.528 2.528 0 0 1 2.523 2.521 2.528 2.528 0 0 1-2.523 2.521h-6.313A2.528 2.528 0 0 1 10.121 8.834a2.528 2.528 0 0 1 2.522-2.521h6.313zM15.165 18.956a2.528 2.528 0 0 1 2.521-2.523 2.528 2.528 0 0 1 2.521 2.523 2.528 2.528 0 0 1-2.521 2.522h-2.521v-2.522zM13.895 18.956a2.528 2.528 0 0 1-2.523 2.522 2.528 2.528 0 0 1-2.52-2.522v-6.313a2.528 2.528 0 0 1 2.52-2.521 2.528 2.528 0 0 1 2.523 2.521v6.313z"/>
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Send initiative updates to a Slack channel</div>
                <p className="text-xs text-muted-foreground mt-0.5">Connect a channel to send all initiative updates to</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              <a href="#" className="text-sm text-foreground hover:text-muted-foreground inline-flex items-center gap-1">
                Connect
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocumentsContent = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground mb-2">Templates</h2>
        <p className="text-sm text-muted-foreground">
          These templates are available when creating documents for any team in the workspace. To create templates that only apply to specific teams, add them as team templates.{" "}
          <a href="#" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            Docs
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>
        
        <div className="bg-[#17181B] rounded-lg border border-[#2d3036] px-5 py-4 flex items-center justify-between">
          <span className="text-sm text-foreground">No document templates</span>
          <Button className="bg-[#25272E] hover:bg-[#2a2c32] border border-[#33363D] text-foreground flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            New template
          </Button>
        </div>
      </div>
    </div>
  );

  const renderCustomerRequestsContent = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Associate customers with projects and issues to align development efforts with real user needs. Manage and track customer requests across your entire organization.{" "}
          <a href="#" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            Docs
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </div>

      {/* Enable Customer requests Section */}
      <div className="space-y-3">
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-foreground">Enable Customer requests</div>
              <p className="text-xs text-muted-foreground mt-1">
                Workspace-wide access to create and view customer requests.
              </p>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-[#5E6AD2] data-[state=unchecked]:bg-[#707173]" />
          </div>
        </div>
      </div>

      {/* Manage customers Section */}
      <div className="space-y-3">
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1a1b1e] transition-colors">
            <div className="flex items-center gap-3">
              <UserSquare2 className="w-5 h-5 text-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Manage customers</div>
                <p className="text-xs text-muted-foreground mt-0.5">Manage your list of customers and their requests.</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>No customers</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Issue routing Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-2">Issue routing</h2>
        <p className="text-sm text-muted-foreground mb-4">
          When a new issue is created from a customer page, it will be routed to the default team's triage or backlog. This centralizes customer requests for ease of management and prioritization.
        </p>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          <div className="flex items-center justify-between px-5 py-4">
            <label className="text-sm font-medium text-foreground">Default team for customer requests</label>
            <Select>
              <SelectTrigger className="w-[200px] bg-[#25272E] border-[#33363D] text-foreground">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="team1">Select a team</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Customer statuses Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-2">Customer statuses</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Define statuses for segmenting customers.
        </p>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#25272E]">
            <span className="text-sm text-foreground">4 customer statuses</span>
            <PlusIcon className="w-4 h-4 text-muted-foreground cursor-pointer" />
          </div>
          
          <div className="divide-y divide-[#25272E]">
            {["Active", "Prospect", "Churned", "Lost"].map((status, idx) => (
              <div key={idx} className="flex items-center gap-3 px-5 py-3 hover:bg-[#1a1b1e] transition-colors cursor-pointer">
                <div className="w-4 h-4 bg-[#25272E] rounded"></div>
                <span className="text-sm text-foreground">{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPulseContent = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Pulse centralizes all your project updates into a single feed. Members can choose to receive summary notifications daily or weekly.
        </p>
      </div>

      {/* Enable Pulse Section */}
      <div className="space-y-3">
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-foreground">Enable Pulse</div>
              <p className="text-xs text-muted-foreground mt-1">
                Workspace-wide feed of updates with optional summary notifications
              </p>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-[#5E6AD2] data-[state=unchecked]:bg-[#707173]" />
          </div>
        </div>
      </div>

      {/* Summary notifications Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-2">Summary notifications</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Pulse summary notifications can be delivered in the mornings based on a set schedule
        </p>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          {/* Default workspace schedule */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#25272E]">
            <div>
              <div className="text-sm font-medium text-foreground">Default workspace schedule</div>
              <p className="text-xs text-muted-foreground mt-1">
                Applies to all members who haven't set their own preference
              </p>
            </div>
            <Select defaultValue="daily">
              <SelectTrigger className="w-[120px] bg-[#25272E] border-[#33363D] text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

          {/* Your personal schedule */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-foreground">Your personal schedule</div>
              <p className="text-xs text-muted-foreground mt-1">
                Only applies to you, overriding the workspace default
              </p>
            </div>
            <Select defaultValue="never">
              <SelectTrigger className="w-[120px] bg-[#25272E] border-[#33363D] text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIContent = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Automate your product development processes and operations with AI.{" "}
          <a href="#" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            Docs
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </div>

      {/* Business plan feature box */}
      <div className="bg-[#17181B] rounded-lg border border-[#2d3036] px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-foreground mb-1">Available on Business and Enterprise plans</div>
            <p className="text-xs text-muted-foreground">
              Access AI-automation, Linear Agent, and all other Business features
            </p>
          </div>
          <Button className="bg-[#25272E] hover:bg-[#2a2c32] border border-[#33363D] text-foreground">
            Start free trial
          </Button>
        </div>
      </div>

      {/* Automation Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-2">Automation</h2>
        <p className="text-sm text-muted-foreground mb-4">
          AI automation to handle routine, manual tasks for your team
        </p>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          {/* Triage Intelligence */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#25272E]">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Triage Intelligence</div>
                <p className="text-xs text-muted-foreground mt-0.5">Find related issues and infer properties like team, project, labels, and assignee</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Available on Business</span>
          </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

          {/* Discussion summaries */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <Reply className="w-5 h-5 text-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Discussion summaries</div>
                <p className="text-xs text-muted-foreground mt-0.5">Control AI-generated summaries across Linear</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Available on Business</span>
          </div>
        </div>
      </div>

      {/* Linear Agent Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-2">Linear Agent</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Create issues and answer questions about your workspace with the Linear Agent
        </p>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          <div className="px-5 py-4">
            <div className="text-sm font-medium text-foreground mb-2">Available integrations</div>
            <p className="text-xs text-muted-foreground mb-3">
              Linear Agent is available on Slack. Add integration to your workspace to use.
            </p>
            <div className="flex items-center justify-end">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAgentsContent = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          AI agents can work alongside you as teammates. Tackle complex tasks together or delegate entire issues end-to-end.{" "}
          <a href="#" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            Docs
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>
        
        <div className="bg-[#17181B] rounded-lg border border-[#2d3036] px-5 py-4 text-center">
          <p className="text-sm text-foreground">
            Browse{" "}
            <a href="#" className="text-foreground underline hover:text-muted-foreground">
              integrations
            </a>
            {" "}to enable new agents
          </p>
        </div>
      </div>
    </div>
  );

  const renderAsksContent = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Let anyone create bug reports, ideas, and other workplace requests using uniform templates via your Slack workspace or a custom email address.{" "}
          <a href="#" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            Docs
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>
        
        <div className="bg-[#17181B] rounded-lg border border-[#2d3036] px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-foreground mb-1">Upgrade to unlock Asks</div>
              <p className="text-xs text-muted-foreground">
                Available on the Business plan. Access Asks, and all other Business features, for 30 days with a free trial. For questions,{" "}
                <a href="#" className="text-foreground underline hover:text-muted-foreground">
                  contact our sales team
                </a>
                .
              </p>
            </div>
            <Button className="bg-[#25272E] hover:bg-[#2a2c32] border border-[#33363D] text-foreground">
              Start free trial
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmojisContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Filter by name..."
            className="w-full bg-[#17181B] border-[#2d3036] text-foreground pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-[#17181B] border-[#2d3036] text-foreground hover:bg-[#1a1b1e]">
            Upload
          </Button>
          <Button className="bg-[#5E6AD2] hover:bg-[#6B77E0] text-white flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 5.042a2.528 2.528 0 0 1-2.52-2.52A2.528 2.528 0 0 1 18.956 0a2.528 2.528 0 0 1 2.523 2.522v2.52h-2.523zM18.956 6.313a2.528 2.528 0 0 1 2.523 2.521 2.528 2.528 0 0 1-2.523 2.521h-6.313A2.528 2.528 0 0 1 10.121 8.834a2.528 2.528 0 0 1 2.522-2.521h6.313zM15.165 18.956a2.528 2.528 0 0 1 2.521-2.523 2.528 2.528 0 0 1 2.521 2.523 2.528 2.528 0 0 1-2.521 2.522h-2.521v-2.522zM13.895 18.956a2.528 2.528 0 0 1-2.523 2.522 2.528 2.528 0 0 1-2.52-2.522v-6.313a2.528 2.528 0 0 1 2.52-2.521 2.528 2.528 0 0 1 2.523 2.521v6.313z"/>
            </svg>
            Slack import
          </Button>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-[#17181B] rounded-lg border border-[#2d3036] py-16 flex flex-col items-center justify-center">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-full border-2 border-foreground flex items-center justify-center relative">
            <div className="absolute -top-1 -left-1 w-12 h-12 rounded-full border-2 border-foreground"></div>
            <div className="absolute -top-1 -right-1 w-12 h-12 rounded-full border-2 border-foreground"></div>
            <div className="absolute -bottom-1 -left-1 w-12 h-12 rounded-full border-2 border-foreground"></div>
            <div className="absolute -bottom-1 -right-1 w-12 h-12 rounded-full border-2 border-foreground"></div>
            <div className="w-8 h-8 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 16 16" fill="none">
                <rect x="4" y="5" width="2" height="2" fill="white" />
                <rect x="10" y="5" width="2" height="2" fill="white" />
                <path d="M4 11C4 9 6 9 8 9C10 9 12 9 12 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
        <span className="text-sm text-muted-foreground">No emojis</span>
      </div>
    </div>
  );

  const renderIntegrationsContent = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enhance your Linear experience with a wide variety of add-ons and integrations
        </p>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search integrations"
            className="w-full bg-[#17181B] border-[#2d3036] text-foreground pl-9"
          />
        </div>
      </div>
    </div>
  );

  const renderWorkspaceContent = () => (
    <div className="space-y-8">
      {/* Workspace Details Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Workspace</h2>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          {/* Logo */}
          <div className="px-5 py-4">
            <label className="text-sm font-medium text-foreground mb-2 block">Logo</label>
            <p className="text-xs text-muted-foreground mb-3">Recommended size is 256x256px</p>
            <div className="flex justify-end">
              <div className="w-12 h-12 rounded bg-[#FF9500] flex items-center justify-center">
                <span className="text-lg font-semibold text-white">HA</span>
              </div>
            </div>
          </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

          {/* Name */}
          <div className="px-5 py-4">
            <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
            <Input
              value="Hacakthon-LinearClone"
              readOnly
              className="w-full bg-[#25272E] border-[#33363D] text-foreground"
            />
          </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

          {/* URL */}
          <div className="px-5 py-4">
            <label className="text-sm font-medium text-foreground mb-2 block">URL</label>
            <Input
              value="linear.app/hacakthon-linearclone"
              readOnly
              className="w-full bg-[#25272E] border-[#33363D] text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Time & Region Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Time & region</h2>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          {/* First month of fiscal year */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <label className="text-sm font-medium text-foreground">First month of the fiscal year</label>
              <p className="text-xs text-muted-foreground mt-1">
                Used when grouping projects and issues quarterly, half-yearly, and yearly
              </p>
            </div>
            <Select defaultValue="january">
              <SelectTrigger className="w-[140px] bg-[#25272E] border-[#33363D] text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="january">January</SelectItem>
                <SelectItem value="february">February</SelectItem>
                <SelectItem value="march">March</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

          {/* Region */}
          <div className="px-5 py-4">
            <label className="text-sm font-medium text-foreground mb-2 block">Region</label>
            <p className="text-xs text-muted-foreground mb-3">
              Set when a workspace is created and cannot be changed.{" "}
              <a href="#" className="text-foreground underline hover:text-muted-foreground">
                Read more
              </a>
            </p>
            <Input
              value="United States"
              readOnly
              className="w-full bg-[#25272E] border-[#33363D] text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Danger Zone Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Danger zone</h2>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          <div className="px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-foreground">Delete workspace</label>
                <p className="text-xs text-muted-foreground mt-1">
                  Schedule workspace to be permanently deleted.
                </p>
              </div>
              <Button
                variant="destructive"
                className="bg-[#B00020] hover:bg-[#C00020] text-white"
              >
                Delete workspace
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeamsContent = () => {
    // Get teams from localStorage
    const getTeams = () => {
      try {
        const stored = localStorage.getItem("teams");
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };

    const teams = getTeams();
    const activeTeamsCount = teams.length;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Filter by name..."
                className="w-full bg-[#17181B] border-[#2d3036] text-foreground pl-9"
              />
            </div>
            <Select defaultValue="active">
              <SelectTrigger className="w-[140px] bg-[#17181B] border-[#2d3036] text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            className="bg-[#5E6AD2] hover:bg-[#6B77E0] text-white"
            onClick={() => navigate("/create-team")}
          >
            Create team
          </Button>
        </div>

        {/* Table */}
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          {/* Table Header */}
          <div className="flex items-center justify-between py-3 border-b border-[#2d3036]" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
            <div className="text-xs font-medium text-muted-foreground">Name ↓</div>
            <div className="flex items-center gap-8">
              <div className="text-xs font-medium text-muted-foreground w-[100px] text-right">Visibility</div>
              <div className="text-xs font-medium text-muted-foreground w-[80px] text-right">Members</div>
              <div className="text-xs font-medium text-muted-foreground w-[80px] text-right">Issues</div>
              <div className="text-xs font-medium text-muted-foreground w-[80px] text-right">Created</div>
            </div>
          </div>

          {/* Table Content */}
          <div className="divide-y divide-[#25272E]">
            {activeTeamsCount > 0 && (
              <div style={{ paddingLeft: '16px', paddingRight: '16px' }} className="py-2">
                <div className="text-xs text-muted-foreground mb-2">Active {activeTeamsCount}</div>
              </div>
            )}
            {teams.length > 0 ? (
              teams.map((team: any) => (
                <div 
                  key={team.id}
                  className="flex items-center justify-between py-3 hover:bg-[#1a1b1e] transition-colors cursor-pointer"
                  style={{ paddingLeft: '16px', paddingRight: '16px' }}
                  onClick={() => setSelectedTeam(team.id)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div 
                      className="w-6 h-6 rounded bg-[#17181B] border border-[#2d3036] flex items-center justify-center flex-shrink-0"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="4" fill={team.iconColor || "#6F7074"} />
                        <path d="M6 21c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke={team.iconColor || "#6F7074"} strokeWidth="2" strokeLinecap="round" fill="none" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm text-foreground">{team.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">{team.identifier}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 flex-shrink-0">
                    <div className="text-sm text-muted-foreground w-[100px] text-right">{team.visibility || "Workspace"}</div>
                    <div className="text-sm text-muted-foreground w-[80px] text-right">{team.members || 1}</div>
                    <div className="text-sm text-muted-foreground w-[80px] text-right">{team.issues || "-"}</div>
                    <div className="text-sm text-muted-foreground w-[80px] text-right">{team.createdDate || new Date(team.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ paddingLeft: '16px', paddingRight: '16px' }} className="py-8 text-center">
                <div className="text-sm text-muted-foreground">No teams found</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderMembersContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by name or email"
              className="w-full bg-[#17181B] border-[#2d3036] text-foreground pl-9"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[120px] bg-[#17181B] border-[#2d3036] text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-[#17181B] border-[#2d3036] text-foreground hover:bg-[#1a1b1e]">
            Export CSV
          </Button>
          <Button className="bg-[#5E6AD2] hover:bg-[#6B77E0] text-white">
            Invite
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
        {/* Table Header */}
        <div className="flex items-center px-5 py-3 border-b border-[#2d3036]">
          <div className="w-[200px] text-xs font-medium text-muted-foreground">Name ↓</div>
          <div className="flex-1 text-xs font-medium text-muted-foreground">Email</div>
          <div className="w-[120px] text-xs font-medium text-muted-foreground">Status</div>
          <div className="w-[100px] text-xs font-medium text-muted-foreground">Joined</div>
          <div className="w-[120px] text-xs font-medium text-muted-foreground">Last seen</div>
        </div>

        {/* Table Content */}
        <div className="divide-y divide-[#25272E]">
          <div className="px-5 py-2">
            <div className="text-xs text-muted-foreground mb-2">Active 1</div>
          </div>
          <div className="flex items-center px-5 py-3 hover:bg-[#1a1b1e] transition-colors cursor-pointer">
            <div className="w-[200px] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#25272E] border-2 border-[#FF9500] flex items-center justify-center">
                <span className="text-xs font-semibold text-[#FF9500]">AD</span>
              </div>
              <div>
                <div className="text-sm text-foreground">Aadit Dhariwal</div>
                <div className="text-xs text-muted-foreground">aaditdhariwal</div>
              </div>
            </div>
            <div className="flex-1 text-sm text-foreground">aaditdhariwal@gmail.com</div>
            <div className="w-[120px] text-sm text-foreground">Admin</div>
            <div className="w-[100px] text-sm text-foreground">Nov 1</div>
            <div className="w-[120px] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-foreground">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityContent = () => (
    <div className="space-y-8">
      {/* Workspace access Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Workspace access</h2>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          {/* Invite links */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-foreground">Enable invite links</div>
              <p className="text-xs text-muted-foreground mt-1">
                A uniquely generated invite link allows anyone with the link to join your workspace
              </p>
            </div>
            <Switch className="data-[state=checked]:bg-[#5E6AD2] data-[state=unchecked]:bg-[#707173]" />
          </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

          {/* Approved email domains */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-medium text-foreground">Approved email domains</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Anyone with an email address at these domains is allowed to sign up for this workspace.{" "}
                  <a href="#" className="text-foreground underline hover:text-muted-foreground inline-flex items-center gap-1">
                    Docs
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
              <Button className="bg-[#25272E] hover:bg-[#2a2c32] border border-[#33363D] text-foreground flex items-center gap-2">
                <PlusIcon className="w-4 h-4" />
                Add domain
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">No approved email domains</span>
          </div>
        </div>
      </div>

      {/* Workspace restrictions Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Workspace restrictions</h2>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          {/* New user invitations */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#25272E]">
            <div>
              <div className="text-sm font-medium text-foreground">New user invitations</div>
              <p className="text-xs text-muted-foreground mt-1">
                Who can invite new members to the workspace
              </p>
            </div>
            <span className="text-xs text-muted-foreground">Available on Basic</span>
          </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

          {/* New team creation */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#25272E]">
            <div>
              <div className="text-sm font-medium text-foreground">New team creation</div>
              <p className="text-xs text-muted-foreground mt-1">
                Who can create new teams
              </p>
            </div>
            <span className="text-xs text-muted-foreground">Available on Business</span>
          </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

          {/* Manage workspace labels */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#25272E]">
            <div>
              <div className="text-sm font-medium text-foreground">Manage workspace labels</div>
              <p className="text-xs text-muted-foreground mt-1">
                Who can create, update, and delete workspace labels
              </p>
            </div>
            <span className="text-xs text-muted-foreground">Available on Business</span>
          </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

          {/* API key creation */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#25272E]">
            <div>
              <div className="text-sm font-medium text-foreground">API key creation</div>
              <p className="text-xs text-muted-foreground mt-1">
                Who can create API keys to interact with the Linear API on their behalf
              </p>
            </div>
            <Select defaultValue="all-members">
              <SelectTrigger className="w-[140px] bg-[#25272E] border-[#33363D] text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-members">All members</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

          {/* Restrict file uploads */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-foreground">Restrict file uploads</div>
              <p className="text-xs text-muted-foreground mt-1">
                Only allow specific file types to be uploaded
              </p>
            </div>
            <span className="text-xs text-muted-foreground">Available on Enterprise</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAPIContent = () => (
    <div className="space-y-8">
      {/* API Section */}
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Linear's GraphQL API provides a programmable interface to your data. Use our API to build public or private apps, workflows, and integrations for Linear.{" "}
          <a href="#" className="text-foreground underline hover:text-muted-foreground">
            Join our Slack
          </a>
          {" "}for help and questions, or{" "}
          <a href="#" className="text-foreground underline hover:text-muted-foreground inline-flex items-center gap-1">
            API Docs
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </div>

      {/* OAuth Applications Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">OAuth Applications</h2>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            Docs
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Manage your organization's OAuth applications.</p>
        
        <div className="bg-[#17181B] rounded-lg border border-[#2d3036] px-5 py-4 flex items-center justify-between">
          <span className="text-sm text-foreground">No OAuth applications</span>
          <Button className="bg-[#25272E] hover:bg-[#2a2c32] border border-[#33363D] text-foreground flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            New OAuth application
          </Button>
        </div>
      </div>

      {/* Webhooks Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Webhooks</h2>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            Docs
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Webhooks allow you to receive HTTP requests when an entity is created, updated, or deleted.
        </p>
        
        <div className="bg-[#17181B] rounded-lg border border-[#2d3036] px-5 py-4 flex items-center justify-between">
          <span className="text-sm text-foreground">No webhooks</span>
          <Button className="bg-[#25272E] hover:bg-[#2a2c32] border border-[#33363D] text-foreground flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            New webhook
          </Button>
        </div>
      </div>

      {/* Member API keys Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-2">Member API keys</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Members of your workspace can create API keys to interact with the Linear API on their behalf. View your personal API keys from your{" "}
          <a href="#" className="text-foreground underline hover:text-muted-foreground">
            security & access settings
          </a>
          .
        </p>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-foreground">API key creation</div>
              <p className="text-xs text-muted-foreground mt-1">
                Who can create API keys to interact with the Linear API on their behalf
              </p>
            </div>
            <Select defaultValue="all-members">
              <SelectTrigger className="w-[140px] bg-[#25272E] border-[#33363D] text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-members">All members</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="h-px bg-[#25272E] mx-5"></div>

          <div className="px-5 py-4">
            <span className="text-sm text-muted-foreground">No API keys have been created yet</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApplicationsContent = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Manage which third-party applications have access to your workspace.{" "}
          <a href="#" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            Docs
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>
        
        <div className="bg-[#17181B] rounded-lg border border-[#2d3036] px-5 py-4 text-center">
          <span className="text-sm text-foreground">
            Your workspace has not yet authorized any external applications to connect with your Linear account
          </span>
        </div>
      </div>
    </div>
  );

  const renderBillingContent = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          For questions about billing,{" "}
          <a href="#" className="text-foreground underline hover:text-muted-foreground">
            contact us
          </a>
        </p>
        <a href="#" className="text-sm text-foreground hover:text-muted-foreground inline-flex items-center gap-1">
          All plans
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      {/* Plans Section */}
      <div className="space-y-4">
        {/* Free Plan */}
        <div className="bg-[#17181B] rounded-lg border border-[#2d3036] px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-sm font-medium text-foreground mb-1">Free</div>
                <div className="text-xs text-muted-foreground">Free for all users.</div>
              </div>
              <div className="px-2 py-0.5 rounded border border-blue-500 text-xs text-white">
                Current plan
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">Users</div>
              <div className="text-sm font-medium text-foreground">1</div>
            </div>
          </div>
        </div>

        {/* Basic Plan */}
        <div className="bg-[#17181B] rounded-lg border border-[#2d3036] px-5 py-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-foreground mb-1">Basic</div>
              <div className="text-xs text-muted-foreground mb-4">$12 per user/mo.</div>
              <Button className="bg-[#25272E] hover:bg-[#2a2c32] border border-[#33363D] text-foreground">
                Upgrade plan
              </Button>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-2">Includes:</div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-foreground justify-end">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>5 teams</span>
                </div>
                <div className="flex items-center gap-2 text-foreground justify-end">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Unlimited issues</span>
                </div>
                <div className="flex items-center gap-2 text-foreground justify-end">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Restrict new user invitations</span>
                </div>
                <div className="flex items-center gap-2 text-foreground justify-end">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Unlimited file upload size</span>
                </div>
                <div className="flex items-center gap-2 text-foreground justify-end">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Admin roles</span>
                </div>
                <div className="flex items-center gap-2 text-foreground justify-end">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Restrict agent invocation to...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent invoices Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent invoices</h2>
        
        <div className="bg-[#17181B] rounded-lg border border-[#2d3036] px-5 py-4">
          <span className="text-sm text-muted-foreground">No invoices yet</span>
        </div>
      </div>
    </div>
  );

  const renderImportExportContent = () => (
    <div className="space-y-8">
      {/* Import assistant Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-2">Import assistant</h2>
        <p className="text-sm text-muted-foreground mb-4">
          If you use another service to track issues, this tool will create a copy of them in Linear.{" "}
          <a href="#" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            Docs
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Button variant="outline" className="bg-[#17181B] border-[#2d3036] text-foreground hover:bg-[#1a1b1e] justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-gray-600 flex items-center justify-center text-white text-xs">A</span>
              <span>Asana</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="bg-[#17181B] border-[#2d3036] text-foreground hover:bg-[#1a1b1e] justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-purple-600 flex items-center justify-center text-white text-xs font-bold">S</span>
              <span>Shortcut</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="bg-[#17181B] border-[#2d3036] text-foreground hover:bg-[#1a1b1e] justify-between">
            <div className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="bg-[#17181B] border-[#2d3036] text-foreground hover:bg-[#1a1b1e] justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
                </svg>
              </span>
              <span>Jira</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <Button variant="outline" className="w-full bg-[#17181B] border-[#2d3036] text-foreground hover:bg-[#1a1b1e] justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5" />
            <span>Linear to Linear import</span>
          </div>
          <ChevronRight className="w-4 h-4" />
        </Button>
        <p className="text-xs text-muted-foreground">Import data from an existing Linear workspace</p>
      </div>

      {/* CLI importer Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-2">CLI importer</h2>
        <p className="text-sm text-muted-foreground mb-4">
          If you prefer using the command line or want to make custom modifications, use our open source importer which imports issues into Linear from CSV files. It supports Asana (CSV), Jira (CSV), GitHub (API), Pivotal Tracker (CSV), Shortcut (CSV), Trello (JSON).
        </p>
        <a href="#" className="text-sm text-foreground hover:text-muted-foreground inline-flex items-center gap-1">
          Go to Linear CLI Importer
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      {/* Export Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-2">Export</h2>
        <p className="text-sm text-muted-foreground mb-4">
          You can export your issue data in CSV format. Once the export is available, we'll email you the download link.
        </p>
        <Button className="bg-[#5E6AD2] hover:bg-[#6B77E0] text-white flex items-center gap-2">
          Export CSV
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const renderTeamDetailContent = () => (
    <div className="space-y-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setSelectedTeam(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Teams</span>
        </button>
      </div>

      {/* Team name and identifier */}
      <div className="space-y-3">
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          <div className="px-5 py-4 border-b border-[#25272E]">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-green-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <Input
                value="Hacakthon-LinearClone"
                className="flex-1 bg-[#25272E] border-[#33363D] text-foreground"
              />
            </div>
          </div>
          <div className="px-5 py-4">
            <label className="text-sm font-medium text-foreground mb-2 block">Identifier - Used in issue IDs</label>
            <Input
              value="HAC"
              className="w-full bg-[#25272E] border-[#33363D] text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Team Settings List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Hacakthon-LinearClone</h2>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          {/* General */}
          <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1a1b1e] transition-colors border-b border-[#25272E]">
            <div className="flex items-center gap-3">
              <SettingsIcon2 className="w-5 h-5 text-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">General</div>
                <p className="text-xs text-muted-foreground mt-0.5">Timezone, estimates, and broader settings</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          
          {/* Members */}
          <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1a1b1e] transition-colors border-b border-[#25272E]">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Members</div>
                <p className="text-xs text-muted-foreground mt-0.5">Manage team members</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">1 member</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          
          {/* Issue labels */}
          <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1a1b1e] transition-colors border-b border-[#25272E]">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Issue labels</div>
                <p className="text-xs text-muted-foreground mt-0.5">Labels available to this team's issues</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">None</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          
          {/* Templates */}
          <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1a1b1e] transition-colors border-b border-[#25272E]">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Templates</div>
                <p className="text-xs text-muted-foreground mt-0.5">Pre-filled templates for issues, documents, and projects</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">None</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          
          {/* Recurring issues */}
          <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1a1b1e] transition-colors border-b border-[#25272E]">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Recurring issues</div>
                <p className="text-xs text-muted-foreground mt-0.5">Automatically create issues on a schedule</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">None</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          
          {/* Slack notifications */}
          <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1a1b1e] transition-colors border-b border-[#25272E]">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 5.042a2.528 2.528 0 0 1-2.52-2.52A2.528 2.528 0 0 1 18.956 0a2.528 2.528 0 0 1 2.523 2.522v2.52h-2.523zM18.956 6.313a2.528 2.528 0 0 1 2.523 2.521 2.528 2.528 0 0 1-2.523 2.521h-6.313A2.528 2.528 0 0 1 10.121 8.834a2.528 2.528 0 0 1 2.522-2.521h6.313zM15.165 18.956a2.528 2.528 0 0 1 2.521-2.523 2.528 2.528 0 0 1 2.521 2.523 2.528 2.528 0 0 1-2.521 2.522h-2.521v-2.522zM13.895 18.956a2.528 2.528 0 0 1-2.523 2.522 2.528 2.528 0 0 1-2.52-2.522v-6.313a2.528 2.528 0 0 1 2.52-2.521 2.528 2.528 0 0 1 2.523 2.521v6.313z"/>
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Slack notifications</div>
                <p className="text-xs text-muted-foreground mt-0.5">Broadcast notifications to Slack</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Off</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          
          {/* Agents */}
          <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1a1b1e] transition-colors">
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 text-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Agents</div>
                <p className="text-xs text-muted-foreground mt-0.5">Add guidance for how agents should operate within this team</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Workflow Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Workflow</h2>
        
        <div className="bg-[#17181B] rounded-lg overflow-hidden border border-[#2d3036]">
          {/* Issue statuses & automations */}
          <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1a1b1e] transition-colors border-b border-[#25272E]">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Issue statuses & automations</div>
                <p className="text-xs text-muted-foreground mt-0.5">Customize issue statuses and git automations</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">6 statuses</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          
          {/* Triage */}
          <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1a1b1e] transition-colors border-b border-[#25272E]">
            <div className="flex items-center gap-3">
              <PlusIcon className="w-5 h-5 text-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Triage</div>
                <p className="text-xs text-muted-foreground mt-0.5">Streamline how you handle requests from outside your team</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Off</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          
          {/* Cycles */}
          <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1a1b1e] transition-colors">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Cycles</div>
                <p className="text-xs text-muted-foreground mt-0.5">Focus your team over short, time-boxed windows</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Off</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex bg-background">
      {/* Left Sidebar */}
      <aside className="w-60 border-r border-border bg-[#090909] flex flex-col relative">
        {/* Back to app - Fixed at top */}
        <div className="sticky top-0 bg-[#090909] z-10 p-4 pb-0">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
            <span>Back to app</span>
        </button>
        </div>

        {/* Settings Navigation - Scrollable */}
        <div className="p-4 pt-0 flex-1 overflow-y-auto">
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
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
            
            {/* Your teams section */}
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
                Your teams
              </h3>
              <div className="space-y-1">
                 <button
                   onClick={() => setSelectedTeam("hacakthon-linearclone")}
                   className={cn(
                     "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors text-sidebar-foreground hover:bg-surface",
                     selectedTeam === "hacakthon-linearclone" && "bg-sidebar-accent text-sidebar-accent-foreground"
                   )}
                 >
                   <TeamIcon className="w-4 h-4" />
                   <span className="flex-1 text-left font-medium">Hacakthon-LinearClone</span>
                 </button>
                <button
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors text-sidebar-foreground hover:bg-surface"
                  )}
                >
                  <Plus className="w-4 h-4" />
                  <span className="flex-1 text-left">Create a team</span>
                </button>
              </div>
            </div>
        </nav>
        </div>
        
        {/* Question mark icon - Fixed at bottom left */}
        <div className="absolute bottom-4 left-4">
          <button className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-surface transition-colors bg-[#090909]">
            <HelpCircle className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto" style={{ backgroundColor: '#101012' }}>
        <div className="max-w-7xl mx-auto p-8">
          {selectedTeam ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                {selectedTeam === "hacakthon-linearclone" ? "Hacakthon-LinearClone" : selectedTeam}
              </h1>
              {renderTeamDetailContent()}
            </div>
          ) : activeSection === "preferences" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Preferences
              </h1>
              {renderPreferencesContent()}
            </div>
          ) : activeSection === "profile" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Profile
              </h1>
              {renderProfileContent()}
            </div>
          ) : activeSection === "notifications" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Notifications
              </h1>
              {renderNotificationsContent()}
            </div>
          ) : activeSection === "security-access" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Security & access
              </h1>
              {renderSecurityAccessContent()}
            </div>
          ) : activeSection === "connected-accounts" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Connected accounts
              </h1>
              {renderConnectedAccountsContent()}
            </div>
          ) : activeSection === "issues-labels" ? (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Issue labels
              </h1>
              {renderIssuesLabelsContent()}
            </div>
          ) : activeSection === "issues-templates" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Issue templates
              </h1>
              {renderIssuesTemplatesContent()}
            </div>
          ) : activeSection === "issues-slas" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                SLAs
              </h1>
              {renderIssuesSLAsContent()}
            </div>
          ) : activeSection === "projects-labels" ? (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Project labels
              </h1>
              {renderProjectsLabelsContent()}
            </div>
          ) : activeSection === "projects-templates" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Project templates
              </h1>
              {renderProjectsTemplatesContent()}
            </div>
          ) : activeSection === "projects-statuses" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Project statuses
              </h1>
              {renderProjectsStatusesContent()}
            </div>
          ) : activeSection === "projects-updates" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Project updates
              </h1>
              {renderProjectsUpdatesContent()}
            </div>
          ) : activeSection === "features-initiatives" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Initiatives
              </h1>
              {renderInitiativesContent()}
            </div>
          ) : activeSection === "features-documents" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Documents
              </h1>
              {renderDocumentsContent()}
            </div>
          ) : activeSection === "features-customer-requests" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Customer requests
              </h1>
              {renderCustomerRequestsContent()}
            </div>
          ) : activeSection === "features-pulse" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Pulse
              </h1>
              {renderPulseContent()}
            </div>
          ) : activeSection === "features-ai" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                AI
              </h1>
              {renderAIContent()}
            </div>
          ) : activeSection === "features-agents" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Agents
              </h1>
              {renderAgentsContent()}
            </div>
          ) : activeSection === "features-asks" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Asks
              </h1>
              {renderAsksContent()}
            </div>
          ) : activeSection === "features-emojis" ? (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Emojis
              </h1>
              {renderEmojisContent()}
            </div>
          ) : activeSection === "features-integrations" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Integrations
              </h1>
              {renderIntegrationsContent()}
            </div>
          ) : activeSection === "admin-workspace" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Workspace
              </h1>
              {renderWorkspaceContent()}
            </div>
          ) : activeSection === "admin-teams" ? (
            <div className="max-w-full mx-auto px-4">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Teams
              </h1>
              {renderTeamsContent()}
            </div>
          ) : activeSection === "admin-members" ? (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Members
              </h1>
              {renderMembersContent()}
            </div>
          ) : activeSection === "admin-security" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Security
              </h1>
              {renderSecurityContent()}
            </div>
          ) : activeSection === "admin-api" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                API
              </h1>
              {renderAPIContent()}
            </div>
          ) : activeSection === "admin-applications" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Applications
              </h1>
              {renderApplicationsContent()}
            </div>
          ) : activeSection === "admin-billing" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Billing
              </h1>
              {renderBillingContent()}
            </div>
          ) : activeSection === "admin-import-export" ? (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
                Import / Export
              </h1>
              {renderImportExportContent()}
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-foreground mb-8 pt-16">
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

