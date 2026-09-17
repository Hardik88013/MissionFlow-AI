import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Failed to reset password");
      }

      setMessage("Password has been reset successfully! Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img src="/logo.png" alt="MissionFlow AI" className="h-12 w-auto mx-auto mb-6" />
          <h1 className="text-3xl font-bold tracking-tight">Set New Password</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter your new secure password.</p>
        </div>

        <div className="bg-surface border border-border/50 rounded-2xl p-6 shadow-xl">
          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm text-center">{error}</div>}
          {message && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded text-green-500 text-sm text-center">{message}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={!token || !!message}
                  className="w-full h-11 rounded-lg border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={!token || !!message}
                  className="w-full h-11 rounded-lg border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !token || !!message}
              className="w-full h-11 rounded-lg bg-[#00A859] hover:bg-[#008f4c] text-white font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Update Password"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-border/40 text-center">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-2">
              ← Back to Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
