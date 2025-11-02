import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, Smile, MoreHorizontal, Reply } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  reactions?: { emoji: string; users: string[] }[]; // Array of reactions
  parentId?: string; // For threading
  mentions?: string[]; // Array of mentioned user names
}

interface CommentsSectionProps {
  comments: Comment[];
  currentUser: string;
  onAddComment: (content: string, mentions?: string[]) => void;
  onReply?: (parentId: string, content: string, mentions?: string[]) => void;
  onAddReaction?: (commentId: string, emoji: string) => void;
  onRemoveReaction?: (commentId: string, emoji: string) => void;
}

const REACTION_EMOJIS = ["👍", "❤️", "😄", "🎉", "👀", "🔥"];

export const CommentsSection = ({
  comments,
  currentUser,
  onAddComment,
  onReply,
  onAddReaction,
  onRemoveReaction,
}: CommentsSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);

  // Extract mentions from text (format: @username)
  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map(m => m.substring(1)) : [];
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    const mentions = extractMentions(newComment);
    onAddComment(newComment.trim(), mentions);
    setNewComment("");
  };

  const handleSendReply = (parentId: string) => {
    if (!replyContent.trim()) return;
    const mentions = extractMentions(replyContent);
    if (onReply) {
      onReply(parentId, replyContent.trim(), mentions);
    }
    setReplyContent("");
    setReplyingTo(null);
  };

  const handleReaction = (commentId: string, emoji: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;

    const reactions = comment.reactions || [];
    const existingReaction = reactions.find(r => r.emoji === emoji);
    const hasReaction = existingReaction?.users.includes(currentUser);

    if (hasReaction) {
      if (onRemoveReaction) {
        onRemoveReaction(commentId, emoji);
      }
    } else {
      if (onAddReaction) {
        onAddReaction(commentId, emoji);
      }
    }
    setShowReactionPicker(null);
  };

  const topLevelComments = comments.filter(c => !c.parentId);
  const repliesMap = comments
    .filter(c => c.parentId)
    .reduce((acc, reply) => {
      if (!acc[reply.parentId!]) acc[reply.parentId!] = [];
      acc[reply.parentId!].push(reply);
      return acc;
    }, {} as Record<string, Comment[]>);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const highlightMentions = (content: string, mentions?: string[]) => {
    if (!mentions || mentions.length === 0) return content;
    let highlighted = content;
    mentions.forEach(mention => {
      const regex = new RegExp(`@${mention}`, 'g');
      highlighted = highlighted.replace(regex, `<span class="text-[#5E6AD2] font-medium">@${mention}</span>`);
    });
    return highlighted;
  };

  return (
    <div className="space-y-4">
      {/* Existing Comments */}
      {topLevelComments.map((comment) => {
        const replies = repliesMap[comment.id] || [];
        const reactions = comment.reactions || [];

        return (
          <div key={comment.id} className="space-y-3">
            {/* Main Comment */}
            <div className="flex gap-3 group">
              <Avatar name={comment.author} size="sm" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(comment.timestamp)}</span>
                </div>
                <div
                  className="text-sm text-foreground"
                  dangerouslySetInnerHTML={{
                    __html: highlightMentions(comment.content, comment.mentions),
                  }}
                />
                
                {/* Reactions */}
                {reactions.length > 0 && (
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {reactions.map((reaction) => {
                      const hasUserReaction = reaction.users.includes(currentUser);
                      return (
                        <button
                          key={reaction.emoji}
                          onClick={() => handleReaction(comment.id, reaction.emoji)}
                          className={cn(
                            "flex items-center gap-1 px-2 py-0.5 rounded-md text-xs transition-colors",
                            hasUserReaction
                              ? "bg-[#5E6AD2]/20 text-[#5E6AD2] border border-[#5E6AD2]/30"
                              : "bg-surface hover:bg-surface-hover text-muted-foreground border border-border"
                          )}
                        >
                          <span>{reaction.emoji}</span>
                          <span>{reaction.users.length}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu open={showReactionPicker === comment.id} onOpenChange={(open) => setShowReactionPicker(open ? comment.id : null)}>
                    <DropdownMenuTrigger asChild>
                      <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <Smile className="w-3.5 h-3.5" />
                        <span>React</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <div className="flex gap-1 p-1">
                        {REACTION_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(comment.id, emoji)}
                            className="p-2 hover:bg-surface rounded-md text-lg transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {onReply && (
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  )}
                </div>

                {/* Reply Input */}
                {replyingTo === comment.id && (
                  <div className="mt-3 ml-8 space-y-2">
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={`Reply to ${comment.author}...`}
                      className="min-h-[60px] text-sm resize-none bg-[#0B0B0D] border-[#2d3036] text-foreground"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                          handleSendReply(comment.id);
                        }
                        if (e.key === "Escape") {
                          setReplyingTo(null);
                          setReplyContent("");
                        }
                      }}
                    />
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSendReply(comment.id)}
                        disabled={!replyContent.trim()}
                        className="bg-[#5E6AD2] hover:bg-[#6B77E0] text-white"
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {replies.length > 0 && (
                  <div className="mt-3 ml-8 space-y-3 border-l border-border pl-4">
                    {replies.map((reply) => {
                      const replyReactions = reply.reactions || [];
                      return (
                        <div key={reply.id} className="flex gap-3 group/reply">
                          <Avatar name={reply.author} size="sm" />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">{reply.author}</span>
                              <span className="text-xs text-muted-foreground">{formatDate(reply.timestamp)}</span>
                            </div>
                            <div
                              className="text-sm text-foreground"
                              dangerouslySetInnerHTML={{
                                __html: highlightMentions(reply.content, reply.mentions),
                              }}
                            />
                            {replyReactions.length > 0 && (
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                {replyReactions.map((reaction) => {
                                  const hasUserReplyReaction = reaction.users.includes(currentUser);
                                  return (
                                    <button
                                      key={reaction.emoji}
                                      onClick={() => handleReaction(reply.id, reaction.emoji)}
                                      className={cn(
                                        "flex items-center gap-1 px-2 py-0.5 rounded-md text-xs transition-colors",
                                        hasUserReplyReaction
                                          ? "bg-[#5E6AD2]/20 text-[#5E6AD2] border border-[#5E6AD2]/30"
                                          : "bg-surface hover:bg-surface-hover text-muted-foreground border border-border"
                                      )}
                                    >
                                      <span>{reaction.emoji}</span>
                                      <span>{reaction.users.length}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                            <div className="flex items-center gap-3 mt-2 opacity-0 group-hover/reply:opacity-100 transition-opacity">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                                    <Smile className="w-3.5 h-3.5" />
                                    <span>React</span>
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <div className="flex gap-1 p-1">
                                    {REACTION_EMOJIS.map((emoji) => (
                                      <button
                                        key={emoji}
                                        onClick={() => handleReaction(reply.id, emoji)}
                                        className="p-2 hover:bg-surface rounded-md text-lg transition-colors"
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* New Comment Input */}
      <div className="flex gap-3">
        <Avatar name={currentUser} size="sm" />
        <div className="flex-1 space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Leave a comment... (Use @ to mention)"
            className="min-h-[100px] text-base resize-none bg-[#0B0B0D] border-[#2d3036] text-foreground"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSendComment();
              }
            }}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-surface-hover hover:text-foreground p-0">
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={handleSendComment}
              disabled={!newComment.trim()}
              className="bg-[#5E6AD2] hover:bg-[#6B77E0] text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Comment
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Press <kbd className="px-1 py-0.5 rounded bg-surface border border-border text-xs">⌘</kbd> + <kbd className="px-1 py-0.5 rounded bg-surface border border-border text-xs">Enter</kbd> to send
          </p>
        </div>
      </div>
    </div>
  );
};

