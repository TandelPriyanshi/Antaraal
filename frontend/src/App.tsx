import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import HomePage from "./page/HomePage";
import SignIn from "./page/SignIn";
import ForgotPassword from "./page/ForgotPassword";
import SignUp from "./page/SignUp";
import Dashboard from "./page/Dashboard";
import LoadingSpinner from "./components/LoadingSpinner";
import NotFound from "./page/NotFound";
import DailyReflections from "./components/ui/DailyReflections";
import EntryDetail from "./components/ui/EntryDetail";
import InspirationPage from "./components/ui/InspirationPage";
import PromptPage from "./components/ui/PromptPage";
import PromptDetail from "./components/ui/PromptDetail";
import StatsPage from "./components/ui/StatsPage";

// Wrapper component for protected routes
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" replace />;
};

// Component to handle auth-based redirects
const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // Just render children, no redirect needed as we want to stay on home page
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            
            {/* Home route - shows different content based on auth status */}
            <Route
              path="/"
              element={
                <AuthRedirect>
                  <HomePage />
                </AuthRedirect>
              }
            />
            
            {/* Protected Dashboard and Feature Routes */}
            <Route
              path="/journal/new"
              element={
                <PrivateRoute>
                  <DailyReflections />
                </PrivateRoute>
              }
            />
            <Route
              path="/entry/:id"
              element={
                <PrivateRoute>
                  <EntryDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/inspiration"
              element={
                <PrivateRoute>
                  <InspirationPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/stats"
              element={
                <PrivateRoute>
                  <StatsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/prompt"
              element={
                <PrivateRoute>
                  <PromptPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/prompt/:id"
              element={
                <PrivateRoute>
                  <PromptDetail />
                </PrivateRoute>
              }
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
