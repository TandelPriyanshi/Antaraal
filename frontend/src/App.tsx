import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Homepage from "./pages/Homepage";
import Features from "./pages/Features";
import Demo from "./pages/Demo";
import Privacy from "./pages/Privacy";
import Subscription from "./pages/Subscription";
import Help from "./pages/Help";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import DashboardLayout from "./components/DashboardLayout";
import DailyReflections from "./pages/DailyReflections";
import EntryDetail from "./pages/EntryDetail";
import EntriesList from "./pages/EntriesList";
import InspirationPage from "./pages/InspirationPage";
import PromptDetail from "./pages/PromptDetail";
import PromptPage from "./pages/PromptPage";
import StatsPage from "./pages/StatsPage";
import NewEntry from "./pages/NewEntry";
import { EntriesProvider } from "./contexts/EntriesContext";
import ScrollManager from "./components/ScrollManager";

const queryClient = new QueryClient();

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (!user.isEmailVerified) {
    return <Navigate to={`/verify-email?userId=${user.id}&email=${encodeURIComponent(user.email)}`} replace />;
  }

  return <>{children}</>;
};

const AppContent = () => (
  <Routes>
          {/* Public routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/features" element={<Features />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/help" element={<Help />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="reflections" element={<DailyReflections />} />
            <Route path="entries" element={<EntriesList />} />
            <Route path="entries/:id" element={<EntryDetail />} />
            <Route path="inspiration" element={<InspirationPage />} />
            <Route path="prompts" element={<PromptPage />} />
            <Route path="prompt-detail" element={<PromptDetail />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="new-entry" element={<NewEntry />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
      </Routes>
);

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <EntriesProvider>
            <Toaster />
            <Sonner />
            <ScrollManager />
            <AppContent />
          </EntriesProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
