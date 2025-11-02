import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  FolderKanban, 
  Star, 
  Plus, 
  Filter,
  Inbox,
  CheckSquare,
  LayoutGrid,
  ChevronDown,
  Calendar,
  Box
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useEffect, useState } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const { isCompleted } = useOnboarding();
  const [isLoaded, setIsLoaded] = useState(false);

  // Only redirect to dashboard if onboarding is completed
  // If not completed, show landing page (user can start onboarding via "Start building" button)
  useEffect(() => {
    if (isCompleted) {
      navigate("/dashboard", { replace: true });
    }
    // If not completed, stay on landing page - don't redirect
  }, [isCompleted, navigate]);

  // Trigger animation on mount
  useEffect(() => {
    // Reset to false first to ensure animation plays
    setIsLoaded(false);
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      // Small delay to ensure state reset is applied
      setTimeout(() => {
        setIsLoaded(true);
      }, 10);
    });
  }, []);

  const handleStartBuilding = () => {
    navigate("/onboarding/welcome");
  };

  const handleAuth = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-foreground">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <div className="ml-14 md:ml-20 lg:ml-44">
            <Logo size="md" />
          </div>

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
          <div className="flex items-center gap-4 mr-32">
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
        <div className="max-w-4xl text-left space-y-6 mb-20 ml-14 md:ml-20 lg:ml-44">
          {/* Main Headline */}
          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-inter font-medium leading-tight transition-all duration-1000 mt-8 max-w-3xl ${
              isLoaded 
                ? 'opacity-100 blur-none translate-y-0' 
                : 'opacity-0 blur-md translate-y-4'
            }`}
          >
            <span className="whitespace-nowrap">Linear is a purpose-built tool for</span><br />
            <span className="whitespace-nowrap">planning and building products.</span>
          </h1>

          {/* Sub-headline */}
          <p 
            className={`text-lg md:text-xl text-foreground/70 max-w-3xl leading-relaxed transition-all duration-1000 delay-200 ${
              isLoaded 
                ? 'opacity-100 blur-none translate-y-0' 
                : 'opacity-0 blur-md translate-y-4'
            }`}
          >
            Meet the system for modern software development.<br />
            Streamline issues, projects, and product roadmaps.
          </p>

          {/* CTAs */}
          <div className={`flex items-center gap-6 pt-4 transition-all duration-1000 delay-300 ${
              isLoaded 
                ? 'opacity-100 blur-none translate-y-0' 
                : 'opacity-0 blur-md translate-y-4'
            }`}>
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

        {/* App Mockup Preview with 3D Effect */}
        <div className={`relative mt-32 max-w-[95%] mx-auto transition-all duration-1000 delay-[1300ms] ${
          isLoaded 
            ? 'opacity-100 blur-none translate-y-0' 
            : 'opacity-0 blur-md translate-y-4'
        }`}>
          <div 
            className="relative rounded-xl overflow-hidden border border-border/30 bg-surface shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] transition-all duration-1000 delay-[1300ms] ease-out"
            style={{
              transform: isLoaded 
                ? 'perspective(1400px) rotateZ(-3deg) rotateX(5deg) rotateY(-8deg) translateY(0)'
                : 'translateY(20px)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Top Header Bar with Tabs */}
            <div className="h-14 bg-background border-b border-border/50 flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <button className="px-3 py-1.5 text-sm font-medium text-foreground relative">
                  Projects
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-muted-foreground/70 hover:text-foreground flex items-center gap-1.5">
                  <FolderKanban className="w-3.5 h-3.5" />
                  All projects
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-muted-foreground/70 hover:text-foreground flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5" />
                  New view
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" className="h-8 text-xs">
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Add project
                </Button>
              </div>
            </div>

            {/* Filter Section */}
            <div className="h-10 bg-background border-b border-border/50 px-6 flex items-center">
              <Button variant="ghost" size="sm" className="h-7 text-xs flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" />
                Filter
              </Button>
            </div>

            {/* Main Content - Projects Table */}
            <div className="flex h-[600px] bg-background">
              {/* Sidebar */}
              <div className="w-60 bg-sidebar-background border-r border-border/50 p-3 flex flex-col text-sm">
                <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-semibold">HA</div>
                  <span className="text-xs font-medium text-sidebar-foreground flex-1">Hacakthon-L...</span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </div>
                <div className="space-y-0.5 mb-4">
                  <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sidebar-foreground">
                    <Inbox className="w-4 h-4" />
                    <span className="text-xs">Inbox</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sidebar-foreground">
                    <CheckSquare className="w-4 h-4" />
                    <span className="text-xs">My issues</span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Workspace</div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sidebar-foreground">
                      <FolderKanban className="w-4 h-4" />
                      <span className="text-xs">Projects</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sidebar-foreground">
                      <LayoutGrid className="w-4 h-4" />
                      <span className="text-xs">Views</span>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Your teams</div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 px-2 py-1.5">
                      <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-semibold">HA</div>
                      <span className="text-xs text-sidebar-foreground flex-1">Hacakthon-LinearClone</span>
                      <ChevronDown className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <div className="ml-6 space-y-0.5">
                      <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sidebar-foreground">
                        <CheckSquare className="w-4 h-4" />
                        <span className="text-xs">Issues</span>
                      </div>
                      <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md bg-sidebar-accent text-sidebar-accent-foreground">
                        <FolderKanban className="w-4 h-4" />
                        <span className="text-xs">Projects</span>
                      </div>
                      <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sidebar-foreground">
                        <LayoutGrid className="w-4 h-4" />
                        <span className="text-xs">Views</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Table Area */}
              <div className="flex-1 overflow-hidden">
                <table className="w-full">
                  <thead className="sticky top-0 bg-background border-b border-border/50 z-10">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Health</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Priority</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Lead</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Target date</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50 hover:bg-surface/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                            <Box className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">Create Linear Clone-Hackathon</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              <span className="text-xs text-muted-foreground">Basic UI Creation Nov 2</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-500" viewBox="0 0 16 16" fill="none">
                              <path d="M2 8L6 12L14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <span className="text-sm text-green-500">On track</span>
                          <span className="text-xs text-muted-foreground ml-1">21h</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-end gap-0.5">
                          <div className="w-1 bg-foreground rounded-sm" style={{ height: '7px' }} />
                          <div className="w-1 bg-foreground rounded-sm" style={{ height: '10px' }} />
                          <div className="w-1 bg-foreground rounded-sm" style={{ height: '13px' }} />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-semibold">AD</div>
                          <span className="text-sm text-foreground">Aadit Dhariwal</span>
                          <button className="ml-1 w-4 h-4 rounded border border-border/50 hover:bg-surface flex items-center justify-center">
                            <Plus className="w-2.5 h-2.5 text-muted-foreground" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="relative w-4 h-4">
                            <div className="absolute inset-0 border-2 border-border/50 rounded-full" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-1 h-1 rounded-full bg-orange-500" />
                            </div>
                          </div>
                          <span className="text-sm text-foreground">0%</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Powering the world's best product teams section */}
        <div className="container mx-auto px-6 py-12 mt-20">
          <div className="max-w-7xl mx-auto text-center">
            {/* Heading */}
            <h2 className="text-2xl md:text-3xl font-medium leading-tight text-foreground mb-2 block">
              Powering the world's best product teams.
            </h2>
            
            {/* Sub-heading */}
            <p className="text-sm md:text-base text-foreground/70 mb-10 block">
              From next-gen startups to established enterprises.
            </p>

            {/* Company Logos Grid - 2 rows x 4 columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-center justify-items-center">
              {/* Row 1 */}
              <div className="text-base md:text-lg font-medium text-foreground">
                Company A
              </div>
              <div className="flex items-center gap-1.5 text-base md:text-lg font-medium text-foreground">
                <span className="bg-foreground text-background rounded px-1.5 py-0.5 text-xs font-bold">$</span>
                Company B
              </div>
              <div className="text-base md:text-lg font-medium text-foreground">
                Company C
              </div>
              <div className="flex items-center gap-1.5 text-base md:text-lg font-medium text-foreground">
                Company D
                <ArrowRight className="w-3 h-3 rotate-[-45deg]" />
              </div>
              
              {/* Row 2 */}
              <div className="flex items-center gap-1.5 text-base md:text-lg font-medium text-foreground">
                <span className="text-foreground text-sm">▲</span>
                Company E
              </div>
              <div className="text-base md:text-lg font-medium text-foreground">
                Company F
              </div>
              <div className="flex items-center gap-1.5 text-base md:text-lg font-medium text-foreground">
                <span className="text-foreground text-sm">✴</span>
                Company G
              </div>
              <div className="flex items-center gap-1.5 text-base md:text-lg font-medium text-foreground">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="12" height="12" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <path d="M2 6 L6 8 L2 10 Z" fill="currentColor" />
                </svg>
                Company H
              </div>
            </div>
          </div>
        </div>

        {/* Made for modern product teams section */}
        <div className="container mx-auto px-6 py-12 mt-24 md:mt-32">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-end">
            {/* Left Content Block - Heading */}
            <div className="text-left md:pr-16 md:pl-12">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-foreground">
                Made for modern
                <br />
                product teams
              </h2>
            </div>

            {/* Right Content Block - Descriptive Paragraph */}
            <div className="text-left md:pl-2">
              <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                Linear is shaped by the practices and principles
                <br />
                that distinguish world-class product teams from
                <br />
                the rest: relentless focus, fast execution, and a
                <br />
                commitment to the quality of craft.{" "}
                <a href="#" className="font-semibold text-foreground hover:text-foreground/80 transition-colors inline-flex items-center gap-1">
                  Make the switch
                  <ArrowRight className="w-3 h-3 inline" />
                </a>
              </p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {/* Card 1: Purpose-built for product development */}
            <div className="bg-surface rounded-2xl p-4 flex flex-col">
              <div className="flex-1 mb-4 min-h-[120px] flex items-center justify-center relative">
                {/* Abstract illustration with overlapping rectangles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* Background rectangles */}
                    <div className="absolute top-2 left-2 w-12 h-10 bg-foreground/10 rounded rotate-[-5deg]" />
                    <div className="absolute top-4 left-6 w-14 h-11 bg-foreground/10 rounded rotate-[3deg]" />
                    <div className="absolute top-6 left-10 w-12 h-9 bg-foreground/10 rounded rotate-[-2deg]" />
                    {/* Circular icon with 'd' */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-foreground/20 flex items-center justify-center border-2 border-foreground/30">
                      <span className="text-lg font-medium text-foreground">d</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Purpose-built for product development</span>
                <div className="w-5 h-5 rounded-full border border-foreground/30 flex items-center justify-center">
                  <Plus className="w-3 h-3 text-foreground" />
                </div>
              </div>
            </div>

            {/* Card 2: Designed to move fast */}
            <div className="bg-surface rounded-2xl p-4 flex flex-col">
              <div className="flex-1 mb-4 min-h-[120px] flex flex-col items-center justify-center relative">
                <div className="text-2xl font-medium text-foreground mb-4">50ms</div>
                {/* Speed/radiating lines graphic */}
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                    <line x1="50" y1="50" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" className="text-foreground/40" />
                    <line x1="50" y1="50" x2="30" y2="15" stroke="currentColor" strokeWidth="1.5" className="text-foreground/40" />
                    <line x1="50" y1="50" x2="45" y2="10" stroke="currentColor" strokeWidth="1.5" className="text-foreground/40" />
                    <line x1="50" y1="50" x2="80" y2="20" stroke="currentColor" strokeWidth="1.5" className="text-foreground/40" />
                    <line x1="50" y1="50" x2="70" y2="15" stroke="currentColor" strokeWidth="1.5" className="text-foreground/40" />
                    <line x1="50" y1="50" x2="55" y2="10" stroke="currentColor" strokeWidth="1.5" className="text-foreground/40" />
                    <line x1="50" y1="50" x2="20" y2="80" stroke="currentColor" strokeWidth="1.5" className="text-foreground/40" />
                    <line x1="50" y1="50" x2="30" y2="85" stroke="currentColor" strokeWidth="1.5" className="text-foreground/40" />
                    <line x1="50" y1="50" x2="45" y2="90" stroke="currentColor" strokeWidth="1.5" className="text-foreground/40" />
                    <line x1="50" y1="50" x2="80" y2="80" stroke="currentColor" strokeWidth="1.5" className="text-foreground/40" />
                    <line x1="50" y1="50" x2="70" y2="85" stroke="currentColor" strokeWidth="1.5" className="text-foreground/40" />
                    <line x1="50" y1="50" x2="55" y2="90" stroke="currentColor" strokeWidth="1.5" className="text-foreground/40" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Designed to move fast</span>
                <div className="w-5 h-5 rounded-full border border-foreground/30 flex items-center justify-center">
                  <Plus className="w-3 h-3 text-foreground" />
                </div>
              </div>
            </div>

            {/* Card 3: Crafted to perfection */}
            <div className="bg-surface rounded-2xl p-4 flex flex-col">
              <div className="flex-1 mb-4 min-h-[120px] flex items-center justify-center relative">
                {/* Grid/plane perspective */}
                <div className="relative w-full h-full">
                  {/* Perspective grid */}
                  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                    {/* Grid lines */}
                    <line x1="10" y1="50" x2="50" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" className="text-foreground/30" />
                    <line x1="30" y1="50" x2="60" y2="25" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" className="text-foreground/30" />
                    <line x1="50" y1="50" x2="70" y2="30" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" className="text-foreground/30" />
                    <line x1="70" y1="50" x2="80" y2="35" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" className="text-foreground/30" />
                    <line x1="10" y1="70" x2="50" y2="80" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" className="text-foreground/30" />
                    <line x1="30" y1="70" x2="60" y2="85" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" className="text-foreground/30" />
                    <line x1="50" y1="70" x2="70" y2="90" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" className="text-foreground/30" />
                    <line x1="70" y1="70" x2="80" y2="95" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" className="text-foreground/30" />
                  </svg>
                  {/* Plus sign and Create text */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <Plus className="w-4 h-4 text-foreground" />
                    </div>
                    <span className="text-xs font-medium text-foreground">Create</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Crafted to perfection</span>
                <div className="w-5 h-5 rounded-full border border-foreground/30 flex items-center justify-center">
                  <Plus className="w-3 h-3 text-foreground" />
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

