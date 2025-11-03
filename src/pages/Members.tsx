import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Users, Search } from "lucide-react";

interface Member {
  id: string;
  name: string;
  username: string;
  status: string;
  joined: string;
  teams: string;
  avatar?: string;
}

const Members = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);

  // Load members from localStorage (same as settings)
  useEffect(() => {
    const loadMembers = () => {
      try {
        // Try to get from settings localStorage or use default
        const stored = localStorage.getItem("members");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setMembers(parsed);
            return;
          }
        }
        // Default member (from settings)
        setMembers([
          {
            id: "1",
            name: "Lakshya Bagani",
            username: "lakshyabagani123",
            status: "Admin",
            joined: "Nov 2",
            teams: "LAK",
          },
        ]);
      } catch {
        setMembers([
          {
            id: "1",
            name: "Lakshya Bagani",
            username: "lakshyabagani123",
            status: "Admin",
            joined: "Nov 2",
            teams: "LAK",
          },
        ]);
      }
    };

    loadMembers();
  }, []);

  const membersCount = members.length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background" style={{ marginTop: "8px" }}>
      {/* Top Header */}
      <div className="px-3 md:px-5 border-b flex items-center justify-between" style={{ borderColor: "#1A1C1E", paddingTop: "8px", paddingBottom: "8px" }}>
        <h1 className="text-sm font-medium text-foreground">Members {membersCount > 0 ? membersCount : ""}</h1>
        <div className="flex items-center gap-2">
          <Button
            className="flex items-center gap-1.5 h-7 px-2.5 rounded-md transition-colors text-xs bg-[#232527] hover:bg-[#2B2D2F] text-[#EDEDED]"
            onClick={() => navigate("/settings?section=admin-members")}
          >
            <Plus className="w-3.5 h-3.5" />
            Invite
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="border-b px-3 md:px-5 py-2" style={{ borderColor: "#1A1C1E" }}>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Filter"
              className="pl-8 h-7 text-xs bg-[#17181B] border-[#2d3036] text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 md:px-5">
          {/* Table Header */}
          <div className="flex items-center py-2 border-b border-border">
            <div className="flex-1 text-xs font-medium text-muted-foreground">Name ↓</div>
            <div className="flex items-center flex-shrink-0" style={{ width: '300px' }}>
              <div className="text-xs font-medium text-muted-foreground" style={{ width: '100px' }}>Status</div>
              <div className="text-xs font-medium text-muted-foreground" style={{ width: '100px' }}>Joined</div>
              <div className="text-xs font-medium text-muted-foreground" style={{ width: '100px' }}>Teams</div>
            </div>
          </div>

          {/* Table Rows */}
          {members.length > 0 ? (
            members.map((member) => (
              <div
                key={member.id}
                className="flex items-center py-2 border-b border-border hover:bg-surface/70 transition-colors"
              >
                {/* Name */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 rounded-full bg-[#25272E] border-2 border-[#FF9500] flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-[#FF9500]">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.username}</div>
                  </div>
                </div>

                {/* Right side columns */}
                <div className="flex items-center flex-shrink-0" style={{ width: '300px' }}>
                  {/* Status */}
                  <div className="text-sm text-foreground" style={{ width: '100px' }}>{member.status}</div>

                  {/* Joined */}
                  <div className="text-sm text-foreground" style={{ width: '100px' }}>{member.joined}</div>

                  {/* Teams */}
                  <div className="flex items-center gap-1.5" style={{ width: '100px' }}>
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm text-foreground">{member.teams}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <div className="text-sm text-muted-foreground">No members found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Members;

