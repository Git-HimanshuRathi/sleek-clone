import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  ChevronRight,
  Star,
  MoreHorizontal,
  Bell,
  Link2,
  SquareDot,
  User,
  Plus,
  Paperclip,
  Send,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  BarChart3,
  BarChart2,
  BarChart,
  CheckSquare,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Tag,
  Box,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Issue } from "@/components/NewIssueModal";
import { Avatar } from "@/components/Avatar";
import { CommentsSection, Comment } from "@/components/CommentsSection";
import { db } from "@/db/database";

// Dashed circle icon component (hollow - just border with gap)
const DashedCircle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="7"
      cy="7"
      r="6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="2 2"
      fill="none"
    />
  </svg>
);

// Orange circle icon component (hollow - just border with gap)
const OrangeCircle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="7"
      cy="7"
      r="6"
      stroke="#F59E0B"
      strokeWidth="1.5"
      fill="none"
      strokeDasharray="8 3"
      strokeDashoffset="2"
    />
  </svg>
);

const defaultPriorityOptions = [
  { value: "No priority", icon: "0", color: "text-muted-foreground", number: 0 },
  { value: "Urgent", icon: AlertCircle, color: "text-red-500", number: 1 },
  { value: "High", icon: BarChart3, color: "text-orange-500", number: 2 },
  { value: "Medium", icon: BarChart2, color: "text-yellow-500", number: 3 },
  { value: "Low", icon: BarChart, color: "text-blue-500", number: 4 },
];

const defaultStatusOptions = [
  { value: "Backlog", icon: OrangeCircle, color: "text-orange-500" },
  { value: "Todo", icon: DashedCircle, color: "text-muted-foreground" },
  { value: "In Progress", icon: PlayCircle, color: "text-yellow-500" },
  { value: "Done", icon: CheckCircle2, color: "text-primary" },
  { value: "Cancelled", icon: XCircle, color: "text-red-500" },
];

const defaultLabelsWithColors = [
  { name: "Bug", color: "bg-red-500" },
  { name: "Feature", color: "bg-purple-500" },
  { name: "Improvement", color: "bg-blue-500" },
  { name: "Documentation", color: "bg-gray-500" },
  { name: "Enhancement", color: "bg-green-500" },
];

const IssueDetail = () => {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [description, setDescription] = useState("");
  const [activityExpanded, setActivityExpanded] = useState(true);
  const [propertiesExpanded, setPropertiesExpanded] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const currentUser = "LB Lakshya Bagani";

  const [statusSearchOpen, setStatusSearchOpen] = useState(false);
  const [statusSearchValue, setStatusSearchValue] = useState("");
  const [prioritySearchOpen, setPrioritySearchOpen] = useState(false);
  const [prioritySearchValue, setPrioritySearchValue] = useState("");
  const [labelSearchOpen, setLabelSearchOpen] = useState(false);
  const [labelSearchValue, setLabelSearchValue] = useState("");
  const [assigneeSearchOpen, setAssigneeSearchOpen] = useState(false);
  const [assigneeSearchValue, setAssigneeSearchValue] = useState("");

  useEffect(() => {
    if (issueId) {
      loadIssue();
    }
  }, [issueId]);

  // Set dynamic page title with issue number
  usePageTitle(issue?.issueNumber ? `${issue.issueNumber} - ${issue.title}` : 'Issue');

  const loadIssue = () => {
    if (!issueId) return;

    try {
      // Try to load from SQLite first
      const allIssues = db.getIssues();
      const foundIssue = allIssues.find((i: any) => i.id === issueId);
      
      if (foundIssue) {
        const normalizedIssue = {
          ...foundIssue,
          createdBy: foundIssue.createdBy || foundIssue.assignee || "Unknown",
          labels: foundIssue.labels || [],
          links: foundIssue.links || [],
          subIssues: foundIssue.subIssues || [],
          createdAt: foundIssue.createdAt || new Date().toISOString(),
        };
        setIssue(normalizedIssue as Issue);
        setDescription(normalizedIssue.description || "");
        // Load comments
        const issueComments = foundIssue.comments || [];
        setComments(Array.isArray(issueComments) ? issueComments : []);
      }
    } catch (error) {
      console.error('Error loading issue from database:', error);
      // Fallback to localStorage
      const storedIssues = JSON.parse(localStorage.getItem("issues") || "[]");
      const foundIssue = storedIssues.find((i: Issue) => i.id === issueId);
      if (foundIssue) {
        setIssue(foundIssue);
        setDescription(foundIssue.description || "");
      }
    }
  };

  const updateIssue = (updates: Partial<Issue>) => {
    if (!issue) return;
    
    // Track activity
    const activityEntry = {
      type: 'update',
      field: Object.keys(updates)[0],
      oldValue: issue[Object.keys(updates)[0] as keyof Issue],
      newValue: updates[Object.keys(updates)[0] as keyof Issue],
      user: currentUser,
      timestamp: new Date().toISOString(),
    };
    
    try {
      // Update in SQLite
      db.updateIssue(issue.id, updates);
      setIssue({ ...issue, ...updates });
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('issuesUpdated'));
    } catch (error) {
      console.error('Error updating issue in database:', error);
      // Fallback to localStorage
      const storedIssues = JSON.parse(localStorage.getItem("issues") || "[]");
      const updatedIssues = storedIssues.map((i: Issue) =>
        i.id === issue.id ? { ...i, ...updates } : i
      );
      localStorage.setItem("issues", JSON.stringify(updatedIssues));
      setIssue({ ...issue, ...updates });
      window.dispatchEvent(new Event('issuesUpdated'));
    }
  };

  const handleAddComment = (content: string, mentions?: string[]) => {
    if (!issue) return;
    
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: currentUser,
      content,
      timestamp: new Date().toISOString(),
      mentions,
    };
    
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    
    // Save to database
    try {
      db.updateIssue(issue.id, { comments: updatedComments } as any);
      window.dispatchEvent(new Event('issuesUpdated'));
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  };

  const handleReply = (parentId: string, content: string, mentions?: string[]) => {
    if (!issue) return;
    
    const reply: Comment = {
      id: `comment-${Date.now()}`,
      author: currentUser,
      content,
      timestamp: new Date().toISOString(),
      parentId,
      mentions,
    };
    
    const updatedComments = [...comments, reply];
    setComments(updatedComments);
    
    try {
      db.updateIssue(issue.id, { comments: updatedComments } as any);
      window.dispatchEvent(new Event('issuesUpdated'));
    } catch (error) {
      console.error('Error saving reply:', error);
    }
  };

  const handleAddReaction = (commentId: string, emoji: string) => {
    if (!issue) return;
    
    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        const reactions = c.reactions || [];
        const existingReaction = reactions.find(r => r.emoji === emoji);
        
        if (existingReaction) {
          // Add user to existing reaction
          if (!existingReaction.users.includes(currentUser)) {
            return {
              ...c,
              reactions: reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, users: [...r.users, currentUser] }
                  : r
              ),
            };
          }
        } else {
          // Create new reaction
          return {
            ...c,
            reactions: [...reactions, { emoji, users: [currentUser] }],
          };
        }
      }
      return c;
    });
    
    setComments(updatedComments);
    
    try {
      db.updateIssue(issue.id, { comments: updatedComments } as any);
      window.dispatchEvent(new Event('issuesUpdated'));
    } catch (error) {
      console.error('Error saving reaction:', error);
    }
  };

  const handleRemoveReaction = (commentId: string, emoji: string) => {
    if (!issue) return;
    
    const updatedComments = comments.map(c => {
      if (c.id === commentId && c.reactions) {
        const updatedReactions = c.reactions.map(r => {
          if (r.emoji === emoji) {
            const filteredUsers = r.users.filter(u => u !== currentUser);
            return filteredUsers.length > 0 ? { ...r, users: filteredUsers } : null;
          }
          return r;
        }).filter((r): r is { emoji: string; users: string[] } => r !== null);
        
        return {
          ...c,
          reactions: updatedReactions,
        };
      }
      return c;
    });
    
    setComments(updatedComments);
    
    try {
      db.updateIssue(issue.id, { comments: updatedComments } as any);
      window.dispatchEvent(new Event('issuesUpdated'));
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  const getAllStatuses = () => {
    const customStatuses = JSON.parse(localStorage.getItem("customStatuses") || "[]");
    return [...defaultStatusOptions, ...customStatuses];
  };

  const getAllPriorities = () => {
    const customPriorities = JSON.parse(localStorage.getItem("customPriorities") || "[]");
    return [...defaultPriorityOptions, ...customPriorities];
  };

  const getAllLabels = () => {
    const customLabels = JSON.parse(localStorage.getItem("customLabels") || "[]");
    return [...defaultLabelsWithColors.map(l => l.name), ...customLabels];
  };

  const getLabelColor = (label: string) => {
    const labelInfo = defaultLabelsWithColors.find(l => l.name === label);
    return labelInfo?.color || "bg-gray-500";
  };

  const getAllMembers = () => {
    return [
      "LB Lakshya Bagani",
      "SC Sarah Chen",
      "MJ Mike Johnson",
      "ED Emily Davis",
      "DL David Lee",
    ];
  };

  if (!issue) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Issue not found</p>
          <Button onClick={() => navigate("/my-issues")} className="mt-4">
            Back to My Issues
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <div className="border-b border-border py-2">
        <div className="flex items-center">
          {/* Left: Breadcrumb */}
          <div className="flex-1 flex items-center gap-2 text-xs px-5">
            <button
              onClick={() => navigate("/my-issues")}
              className="text-muted-foreground hover:text-foreground"
            >
              My issues
            </button>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-foreground font-medium">{issue.issueNumber}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 hover:bg-surface-hover hover:text-foreground focus-visible:ring-0">
              <Star className="h-3.5 w-3.5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-surface-hover hover:text-foreground focus-visible:ring-0">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Edit issue</DropdownMenuItem>
                <DropdownMenuItem>Delete issue</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right: Properties - aligned with right panel */}
          <div className="w-64 flex items-center gap-2 text-xs px-4 border-l border-border">
            <span className="text-foreground font-medium">Properties</span>
            <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-surface-hover hover:text-foreground focus-visible:ring-0">
              <Link2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-surface-hover hover:text-foreground focus-visible:ring-0">
              <User className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-surface-hover hover:text-foreground focus-visible:ring-0">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="max-w-3xl mx-auto px-12 pt-6 space-y-6">
            {/* Issue Title */}
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">{issue.title}</h1>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="text-lg text-muted-foreground">
                {description || "No description"}
              </div>
              {!description && (
                <button className="text-base text-muted-foreground hover:text-foreground">
                  + Add description
                </button>
              )}
            </div>

            {/* Add sub-issues */}
            <div>
              <button className="flex items-center gap-2 text-base text-muted-foreground hover:text-foreground">
                <Plus className="h-4 w-4" />
                Add sub-issues
              </button>
            </div>

            {/* Activity Section */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-foreground">Activity</h3>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <Bell className="h-3.5 w-3.5" />
                  Unsubscribe
                </button>
              </div>
              
              <div className="space-y-3">
                {/* Creation Activity */}
                {issue.createdAt && (
                  <div className="flex items-start gap-2 text-base animate-in fade-in slide-in-from-bottom-2">
                    <Box className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-foreground">{issue.createdBy || "Lakshya Bagani"}</span>{" "}
                      <span className="text-muted-foreground">created the issue</span>
                      <span className="text-muted-foreground"> · {formatDate(issue.createdAt)}</span>
                    </div>
                  </div>
                )}
                
                {/* Status changes */}
                {issue.updatedAt && issue.updatedAt !== issue.createdAt && (
                  <div className="flex items-start gap-2 text-base animate-in fade-in slide-in-from-bottom-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-foreground">{issue.assignee || currentUser}</span>{" "}
                      <span className="text-muted-foreground">updated the issue</span>
                      <span className="text-muted-foreground"> · {formatDate(issue.updatedAt)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Comments Section */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-foreground">Comments ({comments.length})</h3>
              <CommentsSection
                comments={comments}
                currentUser={currentUser}
                onAddComment={handleAddComment}
                onReply={handleReply}
                onAddReaction={handleAddReaction}
                onRemoveReaction={handleRemoveReaction}
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-64 border-l border-border px-4 py-4 overflow-y-auto">
          <div className="space-y-4">
            {propertiesExpanded && (
              <div className="flex flex-col gap-8">
                {/* Status */}
                <Popover open={statusSearchOpen} onOpenChange={setStatusSearchOpen}>
                  <PopoverTrigger asChild>
                    <button className="text-sm text-foreground hover:text-foreground flex items-center gap-2 w-full justify-start">
                      {(() => {
                        const statusOption = getAllStatuses().find(s => s.value === issue.status);
                        const StatusIcon = statusOption?.icon || OrangeCircle;
                        return <StatusIcon className={cn("h-3.5 w-3.5", statusOption?.color || "text-orange-500")} />;
                      })()}
                      {issue.status || "Backlog"}
                    </button>
                  </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-0" align="end">
                      <Command>
                        <CommandInput
                          placeholder="Search or create status..."
                          value={statusSearchValue}
                          onValueChange={setStatusSearchValue}
                        />
                        <CommandList>
                          <CommandGroup>
                            {getAllStatuses()
                              .filter((option) =>
                                option.value.toLowerCase().includes(statusSearchValue.toLowerCase())
                              )
                              .map((option) => {
                                const IconComponent = option.icon;
                                return (
                                  <CommandItem
                                    key={option.value}
                                    onSelect={() => {
                                      updateIssue({ status: option.value });
                                      setStatusSearchValue("");
                                      setStatusSearchOpen(false);
                                    }}
                                    className={cn(
                                      "cursor-pointer gap-3 px-3 py-2 hover:bg-surface-hover hover:text-foreground",
                                      issue.status === option.value && "bg-surface text-foreground"
                                    )}
                                  >
                                    <IconComponent className={cn("h-4 w-4", option.color)} />
                                    <span className="flex-1">{option.value}</span>
                                    {issue.status === option.value && (
                                      <Check className="h-4 w-4 text-foreground" />
                                    )}
                                  </CommandItem>
                                );
                              })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                </Popover>

                {/* Priority */}
                <Popover open={prioritySearchOpen} onOpenChange={setPrioritySearchOpen}>
                  <PopoverTrigger asChild>
                    <button className="text-sm text-foreground hover:text-foreground flex items-center gap-2 w-full justify-start">
                      {(() => {
                        const priorityOption = getAllPriorities().find(p => p.value === issue.priority);
                        if (priorityOption && priorityOption.value !== "No priority") {
                          if (typeof priorityOption.icon === "string") {
                            return <span className={cn("text-xs", priorityOption.color)}>{priorityOption.icon}</span>;
                          }
                          const PriorityIcon = priorityOption.icon;
                          return <PriorityIcon className={cn("h-3.5 w-3.5", priorityOption.color)} />;
                        }
                        return <MoreHorizontal className="h-3.5 w-3.5" />;
                      })()}
                      {issue.priority || "No priority"}
                    </button>
                  </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-0" align="end">
                      <Command>
                        <CommandInput
                          placeholder="Search or create priority..."
                          value={prioritySearchValue}
                          onValueChange={setPrioritySearchValue}
                        />
                        <CommandList>
                          <CommandGroup>
                            {getAllPriorities()
                              .filter((option) =>
                                option.value.toLowerCase().includes(prioritySearchValue.toLowerCase())
                              )
                              .map((option) => {
                                const IconComponent = typeof option.icon === "string" ? null : option.icon;
                                return (
                                  <CommandItem
                                    key={option.value}
                                    onSelect={() => {
                                      updateIssue({ priority: option.value });
                                      setPrioritySearchValue("");
                                      setPrioritySearchOpen(false);
                                    }}
                                    className={cn(
                                      "cursor-pointer gap-3 px-3 py-2 hover:bg-surface-hover hover:text-foreground",
                                      issue.priority === option.value && "bg-surface text-foreground"
                                    )}
                                  >
                                    {typeof option.icon === "string" ? (
                                      <span className={cn("text-xs w-5 text-center", option.color)}>
                                        {option.icon}
                                      </span>
                                    ) : IconComponent ? (
                                      <IconComponent className={cn("h-4 w-4", option.color)} />
                                    ) : null}
                                    <span className="flex-1">{option.value}</span>
                                    {issue.priority === option.value && (
                                      <Check className="h-4 w-4 text-foreground" />
                                    )}
                                  </CommandItem>
                                );
                              })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                </Popover>

                {/* Assignment */}
                <Popover open={assigneeSearchOpen} onOpenChange={setAssigneeSearchOpen}>
                  <PopoverTrigger asChild>
                    <button className="text-sm text-foreground hover:text-foreground flex items-center gap-2 w-full justify-start">
                      <User className="h-3.5 w-3.5" />
                      {issue.assignee ? (
                        <span className="max-w-[100px] truncate">{issue.assignee}</span>
                      ) : (
                        "Assign"
                      )}
                    </button>
                  </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="end">
                      <Command>
                        <CommandInput
                          placeholder="Search members..."
                          value={assigneeSearchValue}
                          onValueChange={setAssigneeSearchValue}
                        />
                        <CommandList>
                          <CommandGroup>
                            {getAllMembers()
                              .filter((member) =>
                                member.toLowerCase().includes(assigneeSearchValue.toLowerCase())
                              )
                              .map((member) => (
                                <CommandItem
                                  key={member}
                                  onSelect={() => {
                                    updateIssue({ assignee: issue.assignee === member ? "" : member });
                                    setAssigneeSearchValue("");
                                    setAssigneeSearchOpen(false);
                                  }}
                                  className="cursor-pointer hover:bg-surface-hover hover:text-foreground"
                                >
                                  <User className="h-4 w-4 mr-2" />
                                  <span className="flex-1">{member}</span>
                                  {issue.assignee === member && (
                                    <Check className="h-4 w-4 text-foreground" />
                                  )}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                </Popover>

                {/* Labels */}
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Labels</div>
                  <Popover open={labelSearchOpen} onOpenChange={setLabelSearchOpen}>
                    <PopoverTrigger asChild>
                      <button className="text-sm text-foreground hover:text-foreground flex items-center gap-2 w-full justify-start">
                        <Tag className="h-3.5 w-3.5" />
                        {issue.labels && issue.labels.length > 0 ? (
                          `${issue.labels.length} label${issue.labels.length > 1 ? "s" : ""}`
                        ) : (
                          "Add label"
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-0" align="end">
                      <Command>
                        <CommandInput
                          placeholder="Search or create label..."
                          value={labelSearchValue}
                          onValueChange={setLabelSearchValue}
                        />
                        <CommandList>
                          {labelSearchValue.trim() &&
                           !getAllLabels().some(l => l.toLowerCase() === labelSearchValue.trim().toLowerCase()) && (
                            <CommandGroup>
                              <CommandItem
                                onSelect={() => {
                                  const newLabel = labelSearchValue.trim();
                                  if (newLabel) {
                                    const currentLabels = issue.labels || [];
                                    if (!currentLabels.includes(newLabel)) {
                                      updateIssue({ labels: [...currentLabels, newLabel] });
                                      const storedLabels = JSON.parse(localStorage.getItem("customLabels") || "[]");
                                      if (!storedLabels.includes(newLabel)) {
                                        storedLabels.push(newLabel);
                                        localStorage.setItem("customLabels", JSON.stringify(storedLabels));
                                      }
                                    }
                                    setLabelSearchValue("");
                                    setLabelSearchOpen(false);
                                  }
                                }}
                                className="cursor-pointer font-medium hover:bg-surface-hover hover:text-foreground"
                              >
                                <Plus className="mr-2 h-4 w-4 text-foreground" />
                                Create "{labelSearchValue.trim()}"
                              </CommandItem>
                            </CommandGroup>
                          )}
                          {issue.labels && issue.labels.length > 0 && (
                            <CommandGroup>
                              {issue.labels.map((label) => (
                                <CommandItem
                                  key={label}
                                  onSelect={() => {
                                    const currentLabels = issue.labels || [];
                                    updateIssue({ labels: currentLabels.filter(l => l !== label) });
                                  }}
                                  className="cursor-pointer hover:bg-surface-hover hover:text-foreground"
                                >
                                  <div className={cn("w-2 h-2 rounded-full mr-2", getLabelColor(label))}></div>
                                  <span className="flex-1">{label}</span>
                                  <span className="text-xs text-muted-foreground">Remove</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                          {getAllLabels()
                            .filter((label) =>
                              label.toLowerCase().includes(labelSearchValue.toLowerCase()) &&
                              !(issue.labels || []).includes(label)
                            )
                            .length > 0 && (
                            <CommandGroup>
                              {getAllLabels()
                                .filter((label) =>
                                  label.toLowerCase().includes(labelSearchValue.toLowerCase()) &&
                                  !(issue.labels || []).includes(label)
                                )
                                .map((label) => {
                                  const labelInfo = defaultLabelsWithColors.find(l => l.name === label);
                                  return (
                                    <CommandItem
                                      key={label}
                                      onSelect={() => {
                                        const currentLabels = issue.labels || [];
                                        if (!currentLabels.includes(label)) {
                                          updateIssue({ labels: [...currentLabels, label] });
                                        }
                                        setLabelSearchValue("");
                                        setLabelSearchOpen(false);
                                      }}
                                      className="cursor-pointer hover:bg-surface-hover hover:text-foreground"
                                    >
                                      <div className={cn("w-2 h-2 rounded-full mr-2", labelInfo?.color || "bg-gray-500")}></div>
                                      {label}
                                    </CommandItem>
                                  );
                                })}
                            </CommandGroup>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Project */}
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Project</div>
                  <button className="text-sm text-foreground hover:text-foreground flex items-center gap-2 w-full justify-start">
                    <Box className="h-3.5 w-3.5" />
                    Add to project
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;

