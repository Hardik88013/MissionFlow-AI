import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "./hooks/useTheme";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { Home } from "./pages/Home";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Routes as RoutesPage } from "./pages/routes/Routes";
import { FleetPage } from "./pages/Fleet";
import { VehiclesPage } from "./pages/Vehicles";
import { AlertsPage } from "./pages/Alerts";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AppContent() {
  const { theme } = useTheme();

  useEffect(() => {
    // Initial theme set to body by the hook
  }, [theme]);

  return (
    <Routes>
      {/* Public website */}
      <Route path="/" element={<Home />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Mission Control (Protected) */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      {/* ETA & Route Optimization (Protected) */}
      <Route
        path="/dashboard/routes"
        element={
          <ProtectedRoute>
            <RoutesPage />
          </ProtectedRoute>
        }
      />

      {/* Fleet Management (Protected) */}
      <Route
        path="/dashboard/fleet"
        element={
          <ProtectedRoute>
            <FleetPage />
          </ProtectedRoute>
        }
      />

      {/* Vehicle Telemetry & Predictive Maintenance (Protected) */}
      <Route
        path="/dashboard/vehicles"
        element={
          <ProtectedRoute>
            <VehiclesPage />
          </ProtectedRoute>
        }
      />

      {/* Alerts & Notifications (Protected) */}
      <Route
        path="/dashboard/alerts"
        element={
          <ProtectedRoute>
            <AlertsPage />
          </ProtectedRoute>
        }
      />

      {/* Unknown routes */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

function App() {
  // Use a dummy Client ID if none is provided in env so the app doesn't crash
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "1234567890-dummy.apps.googleusercontent.com";
  
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;