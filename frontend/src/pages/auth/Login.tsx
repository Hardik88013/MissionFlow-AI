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
      
      {/* Left Side: Big Image and Logo */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black items-center justify-center">
        <img 
          src="/hero-dark.jpg" 
          alt="MissionFlow Operations" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        
        {/* Big Logo in center of left side */}
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/20 mb-8 shadow-2xl">
            <img src="/logo.png" alt="MissionFlow AI" className="h-40 w-auto" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-xl tracking-tight">Smarter Operations.<br/>A Stronger India.</h2>
          <p className="text-lg lg:text-xl text-gray-200 max-w-lg drop-shadow-md">Predictive insights, real-time tracking, and intelligent routing for mission-critical logistics.</p>
        </div>
      </div>

      {/* Right Side: Form Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-16 xl:px-24">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:hidden">
            <img src="/logo.png" alt="MissionFlow AI" className="h-16 w-auto mx-auto mb-4" />
          </div>
          
          <div className="mb-8 text-left">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">Welcome Back</h1>
            <p className="text-base text-muted-foreground">Sign in to access MissionFlow AI operations.</p>
          </div>

          <div className="bg-surface border border-border/60 rounded-2xl p-6 lg:p-8 shadow-lg">
            {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 font-medium text-sm text-center">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="operator@missionflow.ai"
                    required
                    className="w-full h-12 rounded-xl border border-border bg-background pl-11 pr-4 text-sm outline-none focus:border-[#00A859] focus:ring-1 focus:ring-[#00A859] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-bold text-foreground">Password</label>
                  <Link to="/forgot-password" className="text-sm text-[#00A859] hover:text-[#008f4c] hover:underline font-semibold transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-12 rounded-xl border border-border bg-background pl-11 pr-4 text-sm outline-none focus:border-[#00A859] focus:ring-1 focus:ring-[#00A859] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 mt-6 rounded-xl bg-[#00A859] hover:bg-[#008f4c] text-white text-base font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-[#00A859]/20 disabled:opacity-70 disabled:active:scale-100"
              >
                {isLoading ? "Authenticating..." : "Enter Mission Control"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/40 text-center flex flex-col gap-3">
              <div className="text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link to="/register" className="text-[#00A859] hover:text-[#008f4c] hover:underline font-bold transition-colors">Sign up</Link>
              </div>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors mt-1">
                ← Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}