import { useState } from "react";
import { UserPlus, Mail, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface InvitePeopleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InvitePeopleModal = ({ open, onOpenChange }: InvitePeopleModalProps) => {
  const [emails, setEmails] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);

  const handleSendInvites = () => {
    if (emails.trim()) {
      const emailList = emails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email.length > 0);
      setInvitedUsers((prev) => [...prev, ...emailList]);
      setEmails("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Invite people</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Add team members to collaborate on issues and projects
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Invite Form */}
          <Card className="bg-surface border-border">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email addresses
                </label>
                <Input
                  type="text"
                  placeholder="email@example.com, email2@example.com..."
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple emails with commas
                </p>
              </div>
              <Button
                onClick={handleSendInvites}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Send invites
              </Button>
            </CardContent>
          </Card>

          {/* Invited Users */}
          {invitedUsers.length > 0 && (
            <Card className="bg-surface border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <h2 className="font-semibold text-foreground">Pending invitations</h2>
                </div>
                <div className="space-y-2">
                  {invitedUsers.map((email, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
                    >
                      <span className="text-sm text-foreground">{email}</span>
                      <span className="text-xs text-muted-foreground">Pending</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {invitedUsers.length === 0 && (
            <div className="flex flex-col items-center gap-4 text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground/40" />
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground">No pending invitations</h2>
                <p className="text-muted-foreground text-sm">
                  Invited team members will appear here
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

