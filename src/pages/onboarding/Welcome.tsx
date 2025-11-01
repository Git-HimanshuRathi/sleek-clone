import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

const Welcome = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/onboarding/theme");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-8">
        {/* Linear Logo */}
        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
          <Logo size="lg" showText={false} />
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold text-foreground">Welcome to Linear</h1>
          <p className="text-base text-muted-foreground max-w-sm">
            Linear is a purpose-built system for developing products. Streamline issues, projects, and product roadmaps.
          </p>
        </div>

        {/* Get Started Button */}
        <Button
          onClick={handleGetStarted}
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Get started
        </Button>
      </div>
    </div>
  );
};

export default Welcome;

