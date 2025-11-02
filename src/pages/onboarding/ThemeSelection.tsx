import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ThemeSelection = () => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Get current theme
    const root = document.documentElement;
    const isLight = root.classList.contains("light");
    setSelectedTheme(isLight ? "light" : "dark");
  }, []);

  const handleThemeSelect = (theme: "light" | "dark") => {
    setSelectedTheme(theme);
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  };

  const handleContinue = () => {
    navigate("/onboarding/github");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold text-foreground">Choose your style</h1>
          <p className="text-sm text-muted-foreground">
            Change your theme at any time via the command menu or settings.
          </p>
        </div>

        {/* Theme Cards */}
        <div className="flex gap-6 w-full">
          {/* Light Theme */}
          <div className="flex-1">
            <Card
              onClick={() => handleThemeSelect("light")}
              className={cn(
                "cursor-pointer transition-all border-2 p-6 hover:border-border",
                selectedTheme === "light" ? "border-primary" : "border-border"
              )}
            >
              <div className="aspect-video rounded-md bg-white border border-border mb-4 p-4">
                <div className="h-full flex flex-col gap-2">
                  <div className="w-full h-3 bg-gray-200 rounded"></div>
                  <div className="w-3/4 h-3 bg-gray-300 rounded"></div>
                  <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
              <p className="text-sm font-medium text-foreground">Light</p>
            </Card>
          </div>

          {/* Dark Theme */}
          <div className="flex-1">
            <Card
              onClick={() => handleThemeSelect("dark")}
              className={cn(
                "cursor-pointer transition-all border-2 p-6 hover:border-border",
                selectedTheme === "dark" ? "border-primary" : "border-border"
              )}
            >
              <div className="aspect-video rounded-md bg-background border border-border mb-4 p-4">
                <div className="h-full flex flex-col gap-2">
                  <div className="w-full h-3 bg-surface rounded"></div>
                  <div className="w-3/4 h-3 bg-surface/80 rounded"></div>
                  <div className="w-1/2 h-3 bg-surface rounded"></div>
                </div>
              </div>
              <p className="text-sm font-medium text-foreground">Dark</p>
            </Card>
          </div>
        </div>

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

export default ThemeSelection;

