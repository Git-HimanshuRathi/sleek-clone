import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/Avatar";
import { Users, Plus } from "lucide-react";

const JoinOrCreateTeam = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("join");

  // Mock teams data
  const existingTeams = [
    { id: 1, name: "SriCharan", members: 1, avatar: "SC" },
  ];

  const handleContinue = () => {
    navigate("/onboarding/invite");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold text-foreground">Join or create a team at SriCharan</h1>
          <p className="text-base text-muted-foreground">
            Teams are groups of people who regularly work together on issues and projects.
          </p>
        </div>

        {/* Team Selection Card */}
        <Card className="w-full bg-surface border-border">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="join">Join existing teams</TabsTrigger>
                <TabsTrigger value="create">Create a new team</TabsTrigger>
              </TabsList>

              <TabsContent value="join" className="space-y-3">
                {existingTeams.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-surface-hover transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={team.name} size="sm" />
                      <div className="text-left">
                        <p className="font-medium text-foreground">{team.name}</p>
                        <p className="text-sm text-muted-foreground">
                          • {team.members} {team.members === 1 ? "member" : "members"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar name="PSC" size="xs" />
                      <Button size="sm" variant="outline">
                        Join
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="create" className="space-y-4">
                <div className="p-8 border-2 border-dashed border-border rounded-lg text-center">
                  <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Create a new team to get started
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default JoinOrCreateTeam;

