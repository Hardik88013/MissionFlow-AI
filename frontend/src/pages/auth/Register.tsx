import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function Register() {
  const [name, setName] = useState("");
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
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name: name })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
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
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface items-center justify-center">
        <img 
          src="/hero-light.jpg" 
          alt="MissionFlow Platform" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/60 to-background/20"></div>
        
        {/* Big Logo in center of left side */}
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          <img src="/logo.png" alt="MissionFlow AI" className="h-48 w-auto mb-8 drop-shadow-2xl" />
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">Command Your Fleet.<br/>Secure Your Supply Chain.</h2>
          <p className="text-xl text-white/90 max-w-lg drop-shadow-md">Join the platform powering the next generation of mission-ready logistics.</p>
        </div>
      </div>

      {/* Right Side: Form Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-16 xl:px-24">
        <div className="w-full max-w-lg">
          <div className="mb-10 text-left lg:hidden">
            <img src="/logo.png" alt="MissionFlow AI" className="h-14 w-auto mb-8" />
          </div>

          <div className="mb-8 text-left">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-3">Create Account</h1>
            <p className="text-lg text-muted-foreground">Join MissionFlow AI operations today.</p>
          </div>

          <div className="bg-surface border border-border/50 rounded-2xl p-8 shadow-xl">
            {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Commander John Doe"
                    required
                    className="w-full h-14 rounded-xl border border-border bg-background pl-12 pr-4 text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

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
                <label className="block text-sm font-semibold mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full h-14 rounded-xl border border-border bg-background pl-12 pr-4 text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 mt-4 rounded-xl bg-[#00A859] hover:bg-[#008f4c] text-white text-lg font-bold flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/40 text-center flex flex-col gap-3">
              <div className="text-base">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link to="/login" className="text-primary hover:underline font-bold">Sign in</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
