import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Github, Keyboard } from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";

const OnboardingComplete = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useOnboarding();

  const handleOpenLinear = () => {
    completeOnboarding();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold text-foreground">You're good to go</h1>
          <p className="text-base text-muted-foreground">
            Go ahead and explore the app. When you're ready, create your first issue by pressing{" "}
            <kbd className="px-2 py-0.5 text-xs font-semibold bg-surface border border-border rounded text-foreground">
              c
            </kbd>
            .
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {/* Tell your team */}
          <Card className="bg-surface border-border">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Tell your team</h3>
              <p className="text-sm text-muted-foreground">
                Make sure to invite your team members.
              </p>
            </CardContent>
          </Card>

          {/* Integrate GitHub & Slack */}
          <Card className="bg-surface border-border">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Github className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Integrate GitHub & Slack</h3>
              <p className="text-sm text-muted-foreground">
                Link your pull requests and create issues from Slack.
              </p>
            </CardContent>
          </Card>

          {/* Keyboard shortcuts */}
          <Card className="bg-surface border-border">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Keyboard className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Keyboard shortcuts</h3>
              <p className="text-sm text-muted-foreground">
                Learn the keyboard commands by pressing{" "}
                <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-background border border-border rounded text-foreground">
                  ?
                </kbd>
                .
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Open Linear Button */}
        <Button
          onClick={handleOpenLinear}
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Open Linear
        </Button>
      </div>
    </div>
  );
};

export default OnboardingComplete;

