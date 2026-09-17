import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Request failed");
      }

      setMessage(data.message || "Reset link sent!");
      if (data.reset_link) {
        setResetLink(data.reset_link);
      }
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
          <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter your email to receive a reset link.</p>
        </div>

        <div className="bg-surface border border-border/50 rounded-2xl p-6 shadow-xl">
          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm text-center">{error}</div>}
          {message && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded text-green-500 text-sm text-center">{message}</div>}
          
          {resetLink && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <p className="text-sm text-blue-800 mb-3 font-medium">Test Mode Bypass:</p>
              <Link to={resetLink.replace(window.location.origin, '')} className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors">
                Go to Reset Password Screen
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="operator@missionflow.ai"
                  required
                  className="w-full h-11 rounded-lg border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-[#00A859] hover:bg-[#008f4c] text-white font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
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
