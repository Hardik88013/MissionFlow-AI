import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "./hooks/useTheme";

import { Home } from "./pages/Home";
import { Login } from "./pages/auth/Login";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Routes as RoutesPage } from "./pages/routes/Routes";

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    // Initial theme set to body by the hook
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public website */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />

        {/* Mission Control */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ETA & Route Optimization */}
        <Route
          path="/dashboard/routes"
          element={<RoutesPage />}
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;