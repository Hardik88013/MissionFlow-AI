import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      login(data.access_token, data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-16 xl:px-24">
        <div className="w-full max-w-lg">
          <div className="mb-10 text-left">
            <img src="/logo.png" alt="MissionFlow AI" className="h-14 w-auto mb-8" />
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-3">Welcome Back</h1>
            <p className="text-lg text-muted-foreground">Sign in to access MissionFlow AI operations.</p>
          </div>

          <div className="bg-surface border border-border/50 rounded-2xl p-8 shadow-xl">
            {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="operator@missionflow.ai"
                    required
                    className="w-full h-14 rounded-xl border border-border bg-background pl-12 pr-4 text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold">Password</label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-14 rounded-xl border border-border bg-background pl-12 pr-4 text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 mt-4 rounded-xl bg-[#00A859] hover:bg-[#008f4c] text-white text-lg font-bold flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Authenticating..." : "Enter Mission Control"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/40 text-center flex flex-col gap-3">
              <div className="text-base">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link to="/register" className="text-primary hover:underline font-bold">Sign up</Link>
              </div>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-2">
                ← Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-surface">
        <img 
          src="/hero-dark.jpg" 
          alt="MissionFlow Operations" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-16 w-full">
          <h2 className="text-4xl font-bold text-white mb-4">Smarter Operations.<br/>A Stronger India.</h2>
          <p className="text-lg text-white/80 max-w-md">Predictive insights, real-time tracking, and intelligent routing for mission-critical logistics.</p>
        </div>
      </div>
    </div>
  );
}