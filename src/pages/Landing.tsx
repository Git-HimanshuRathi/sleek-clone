import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useEffect } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const { isCompleted } = useOnboarding();

  // Redirect to dashboard if onboarding is already completed
  useEffect(() => {
    if (isCompleted) {
      navigate("/dashboard", { replace: true });
    }
  }, [isCompleted, navigate]);

  const handleStartBuilding = () => {
    navigate("/onboarding/welcome");
  };

  const handleAuth = () => {
    navigate("/onboarding/welcome");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <Logo size="md" />

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Product
            </a>
            <a href="#" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Resources
            </a>
            <a href="#" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Customers
            </a>
            <a href="#" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Now
            </a>
            <a href="#" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handleAuth}
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Log in
            </button>
            <Button 
              onClick={handleAuth}
              size="sm" 
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              Sign up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 mb-16">
          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl font-semibold leading-tight">
            Linear is a purpose-built tool for planning and building products.
          </h1>

          {/* Sub-headline */}
          <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Meet the system for modern software development. Streamline issues, projects, and product roadmaps.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-6 pt-4">
            <Button
              onClick={handleStartBuilding}
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-base"
            >
              Start building.
            </Button>
            <a
              href="#"
              className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
              New: Linear agent for Slack <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* App Mockup Preview */}
        <div className="relative mt-20 max-w-6xl mx-auto">
          <div className="relative rounded-lg overflow-hidden border border-border/50 bg-surface shadow-2xl transform rotate-[-2deg]">
            {/* Mockup Header Bar */}
            <div className="h-12 bg-surface-hover border-b border-border/50 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-destructive"></div>
                <div className="h-2 w-2 rounded-full bg-foreground/20"></div>
                <div className="h-2 w-2 rounded-full bg-foreground/20"></div>
              </div>
              <div className="text-xs text-foreground/50">linear.app</div>
              <div className="w-16"></div>
            </div>

            {/* Mockup Content */}
            <div className="flex h-[500px]">
              {/* Sidebar */}
              <div className="w-64 bg-surface border-r border-border/50 p-4 space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <Logo size="sm" />
                  <span className="text-xs text-foreground/40">▼</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-surface-hover">
                    <span className="text-sm text-foreground/80">Inbox</span>
                    <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">1</span>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-6 space-y-4">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs text-foreground/50">
                  <span>Engineering</span>
                  <span>/</span>
                  <span>Spice harvester</span>
                  <span>/</span>
                  <span>ENG-135</span>
                </div>

                {/* Task Title */}
                <h2 className="text-2xl font-semibold text-foreground">Refactor sonic crawler</h2>

                {/* Code/Comment Section */}
                <div className="space-y-3 mt-6">
                  <p className="text-sm text-foreground/70">
                    Comment.documentContent is defined wrongly. It should be a LazyManyToOne relation.
                  </p>
                  
                  <div className="bg-surface-hover rounded-md p-4 border border-border/30">
                    <pre className="text-xs text-foreground/60 font-mono">
                      {`/** The document content that this comment is associated with. */
@ManyToOne
private LazyManyToOne<DocumentContent> documentContent;`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Activity Sidebar */}
              <div className="w-80 bg-surface border-l border-border/50 p-4 space-y-4">
                <div className="text-xs font-medium text-foreground/50 mb-4">Recent activity</div>
                <div className="space-y-3">
                  <div className="p-3 rounded-md bg-surface-hover/50">
                    <div className="text-sm font-medium text-foreground/90">ENG-135 Refactor sonic crawler</div>
                    <div className="text-xs text-foreground/50 mt-1">nan assigned you</div>
                    <div className="text-xs text-foreground/40 mt-1">2h</div>
                  </div>
                  <div className="p-3 rounded-md">
                    <div className="text-sm font-medium text-foreground/70">LLM Chatbot</div>
                    <div className="text-xs text-foreground/50 mt-1">New project update by raissa</div>
                    <div className="text-xs text-foreground/40 mt-1">8h</div>
                  </div>
                  <div className="p-3 rounded-md">
                    <div className="text-sm font-medium text-foreground/70">uploading images via API</div>
                    <div className="text-xs text-foreground/40 mt-1">1d</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;

