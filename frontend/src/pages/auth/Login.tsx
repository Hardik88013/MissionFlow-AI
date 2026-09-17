import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../services/authApi";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerMode, setRegisterMode] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (registerMode) await authApi.register(email, password);
      else await authApi.login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to authenticate");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src="/logo.png"
            alt="MissionFlow AI"
            className="h-12 w-auto mx-auto mb-6"
          />

          <h1 className="text-3xl font-bold tracking-tight">
            Mission Control
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access MissionFlow AI operations.
          </p>
        </div>

        <div className="bg-surface border border-border/50 rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Email
              </label>

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

            <div>
              <label className="block text-sm font-semibold mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 rounded-lg border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full h-11 rounded-lg bg-[#00A859] hover:bg-[#008f4c] text-white font-bold flex items-center justify-center gap-2 transition-colors"
            >
              {busy ? "Connecting..." : registerMode ? "Create account" : "Enter Mission Control"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <button
            type="button"
            onClick={() => { setRegisterMode(!registerMode); setError(""); }}
            className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground"
          >
            {registerMode ? "Already have an account? Sign in" : "New operator? Create an account"}
          </button>

          <div className="mt-6 pt-5 border-t border-border/40 text-center">
            <a
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Return to MissionFlow AI
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}