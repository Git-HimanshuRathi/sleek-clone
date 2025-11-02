import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Github } from "lucide-react";

const ConnectGitHub = () => {
  const navigate = useNavigate();

  const handleAuthenticate = () => {
    // Handle GitHub authentication
    console.log("Authenticating with GitHub...");
    navigate("/onboarding/invite");
  };

  const handleLater = () => {
    navigate("/onboarding/invite");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full flex flex-col items-center text-center space-y-8">
        {/* GitHub Logo and Title */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <Github className="w-12 h-12 text-foreground" />
          </div>
          <h1 className="text-4xl font-semibold text-foreground">Connect with GitHub</h1>
          <p className="text-base text-muted-foreground">
            Automate issue workflow when GitHub pull requests are opened and merged.
          </p>
        </div>

        {/* Features Card */}
        <Card className="w-full bg-surface border-border">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3 text-left">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                Linear links the issue and the GitHub pull request automatically.
              </p>
            </div>
            <div className="flex items-start gap-3 text-left">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                Linear syncs the issue status when a pull request is opened, closed, merged, or reverted.
              </p>
            </div>
            <div className="flex items-start gap-3 text-left">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                Linear will not ask for code read permissions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Authenticate Button */}
        <Button
          onClick={handleAuthenticate}
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Authenticate with GitHub
        </Button>

        {/* Skip Link */}
        <button
          onClick={handleLater}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          I'll do this later
        </button>
      </div>
    </div>
  );
};

export default ConnectGitHub;

