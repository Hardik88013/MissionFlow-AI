
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { IconButton } from "./IconButton";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-10" />;
  }

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      document.documentElement.classList.contains("dark"));

  return (
    <IconButton
      variant="ghost"
      size="md"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {isDark ? (
        <Moon className="h-5 w-5 text-foreground" />
      ) : (
        <Sun className="h-5 w-5 text-foreground" />
      )}
    </IconButton>
  );
}
