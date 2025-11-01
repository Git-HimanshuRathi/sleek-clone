import { useState, useEffect } from "react";
import { Inbox as InboxIcon, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initialInboxNotifications, InboxNotification } from "@/data/mockData";

const Inbox = () => {
  const [notifications, setNotifications] = useState<InboxNotification[]>([]);

  useEffect(() => {
    // Load notifications from localStorage
    const stored = localStorage.getItem("inboxNotifications");
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      setNotifications(initialInboxNotifications);
    }
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "now";
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Inbox</h1>
          {unreadCount > 0 && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {notifications.length > 0 ? (
        <div className="flex-1 overflow-y-auto px-6 py-3">
          <div className="space-y-0.5">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 px-2 py-2 rounded-md hover:bg-surface transition-colors cursor-pointer ${
                  !notification.read ? "bg-surface/50" : ""
                }`}
                onClick={() => {
                  const updated = notifications.map((n) =>
                    n.id === notification.id ? { ...n, read: true } : n
                  );
                  setNotifications(updated);
                  localStorage.setItem("inboxNotifications", JSON.stringify(updated));
                }}
              >
                <div className="mt-0.5">
                  <Mail className={`w-4 h-4 ${!notification.read ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {notification.title}
                    </span>
                    {notification.issueNumber && (
                      <span className="text-xs text-muted-foreground font-mono">
                        {notification.issueNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                  <span className="text-xs text-muted-foreground/60 mt-1 block">
                    {formatTime(notification.timestamp)}
                  </span>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 max-w-md text-center">
            <InboxIcon className="w-16 h-16 text-muted-foreground/40" />
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">Your inbox is empty</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;
