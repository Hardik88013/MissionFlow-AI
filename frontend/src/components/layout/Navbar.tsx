import { useState, useEffect } from "react";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";
import { Menu, X, Search, ArrowRight } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Home", href: "#home", active: true },
    { label: "Product", href: "#product" },
    { label: "Solutions", href: "#solutions" },
    { label: "Resources", href: "#resources" },
    { label: "About", href: "#about" },
  ];

  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border/40" : "bg-white border-b border-transparent"
      }`}
    >
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* LEFT: Logo */}
          <div className="flex items-center shrink-0">
            <img src="/logo.png" alt="MissionFlow AI Logo" className="h-10 md:h-12 w-auto" />
          </div>

          {/* CENTER: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 h-full">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`relative h-full flex items-center text-sm font-semibold transition-colors ${
                  link.active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {link.active && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-t-full" />
                )}
              </a>
            ))}
          </nav>

          {/* RIGHT: Desktop Actions */}
          <div className="hidden lg:flex items-center gap-6 shrink-0">
            <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <a href="#signin" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
              Sign In
            </a>
            <Button className="bg-[#00A859] hover:bg-[#008f4c] text-white shadow-md shadow-green-500/20 rounded-md font-bold px-5 h-10">
              Request Demo <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>

          {/* MOBILE: Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <IconButton
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </IconButton>
          </div>
        </div>
      </Container>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-white px-4 py-4 space-y-4 shadow-xl">
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-base font-medium transition-colors ${
                  link.active ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-border/40 flex flex-col gap-3">
            <a href="#signin" className="text-base font-medium text-foreground text-center py-2">
              Sign In
            </a>
            <Button className="w-full bg-[#00A859] hover:bg-[#008f4c] text-white rounded-md font-bold">
              Request Demo
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
