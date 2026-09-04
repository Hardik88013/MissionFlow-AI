import { useState } from "react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { label: "Platform", href: "#platform" },
    { label: "Solutions", href: "#solutions" },
    { label: "Industries", href: "#industries" },
    { label: "Intelligence", href: "#intelligence" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-surface/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* LEFT: Logo */}
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="MissionFlow AI Logo" className="h-8 w-8" />
            <div className="font-bold text-xl tracking-tighter text-primary">
              MissionFlow AI
            </div>
          </div>

          {/* CENTER: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* RIGHT: Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button variant="primary">Request Demo</Button>
          </div>

          {/* MOBILE: Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <IconButton
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </IconButton>
          </div>
        </div>
      </Container>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-surface px-4 py-4 space-y-4">
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-border/40">
            <Button variant="primary" className="w-full">
              Request Demo
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
