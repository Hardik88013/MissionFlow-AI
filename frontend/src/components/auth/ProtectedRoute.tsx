import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { authApi } from "../../services/authApi";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [state, setState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    authApi.me().then(() => setState("authenticated")).catch(() => setState("unauthenticated"));
  }, []);

  if (state === "loading") {
    return <div className="min-h-screen grid place-items-center bg-[#f4f8fb] text-slate-600">Checking your session...</div>;
  }
  if (state === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
