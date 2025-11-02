import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { OnboardingProvider, useOnboarding } from "./contexts/OnboardingContext";
import { MainLayout } from "./components/Layout/MainLayout";
import MyIssues from "./pages/MyIssues";
import Inbox from "./pages/Inbox";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import IssueDetail from "./pages/IssueDetail";
import Views from "./pages/Views";
import More from "./pages/More";
import ImportIssues from "./pages/ImportIssues";
import InvitePeople from "./pages/InvitePeople";
import LinkGitHub from "./pages/LinkGitHub";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import TeamsPage from "./pages/TeamsPage";
import Members from "./pages/Members";
import Settings from "./pages/Settings";
import TeamIssues from "./pages/TeamIssues";
import Welcome from "./pages/onboarding/Welcome";
import ThemeSelection from "./pages/onboarding/ThemeSelection";
import SubscribeToUpdates from "./pages/onboarding/SubscribeToUpdates";
import JoinOrCreateTeam from "./pages/onboarding/JoinOrCreateTeam";
import InviteCoWorkers from "./pages/onboarding/InviteCoWorkers";
import CommandMenuIntro from "./pages/onboarding/CommandMenuIntro";
import ConnectGitHub from "./pages/onboarding/ConnectGitHub";
import OnboardingComplete from "./pages/onboarding/OnboardingComplete";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isCompleted } = useOnboarding();
  
  if (!isCompleted) {
    return <Navigate to="/onboarding/welcome" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page - Public */}
      <Route path="/" element={<Landing />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Settings Route - Full page, outside main layout */}
      <Route path="/settings" element={<Settings />} />
      
      {/* Onboarding Routes */}
      <Route path="/onboarding/welcome" element={<Welcome />} />
      <Route path="/onboarding/theme" element={<ThemeSelection />} />
      <Route path="/onboarding/subscribe" element={<SubscribeToUpdates />} />
      <Route path="/onboarding/team" element={<JoinOrCreateTeam />} />
      <Route path="/onboarding/invite" element={<InviteCoWorkers />} />
      <Route path="/onboarding/command-menu" element={<CommandMenuIntro />} />
      <Route path="/onboarding/github" element={<ConnectGitHub />} />
      <Route path="/onboarding/complete" element={<OnboardingComplete />} />

      {/* Main App Routes - Protected by onboarding completion */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/my-issues" element={<MyIssues />} />
        <Route path="/my-issues/:tab" element={<MyIssues />} />
        <Route path="/my-issues/issue/:issueId" element={<IssueDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<ProjectDetail />} />
        <Route path="/views" element={<Views />} />
        <Route path="/teams/*" element={<TeamsPage />} />
        <Route path="/members" element={<Members />} />
        <Route path="/more" element={<More />} />
        <Route path="/team/issues" element={<TeamIssues />} />
        <Route path="/team/issues/active" element={<TeamIssues />} />
        <Route path="/team/issues/backlog" element={<TeamIssues />} />
        <Route path="/team/projects" element={<Projects />} />
        <Route path="/team/views" element={<Dashboard />} />
        <Route path="/import" element={<ImportIssues />} />
        <Route path="/invite" element={<InvitePeople />} />
        <Route path="/github" element={<LinkGitHub />} />
      </Route>

      {/* Root redirect - handled by ProtectedRoute */}
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <OnboardingProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AppRoutes />
        </BrowserRouter>
      </OnboardingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
