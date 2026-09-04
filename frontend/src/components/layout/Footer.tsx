import { Container } from "../ui/Container";

export function Footer() {
  const footerLinks = [
    {
      title: "Platform",
      links: [
        { label: "Command Center", href: "#" },
        { label: "Fleet Intelligence", href: "#" },
        { label: "Route Optimization", href: "#" },
        { label: "AI Predictions", href: "#" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "Defense", href: "#" },
        { label: "Disaster Response", href: "#" },
        { label: "Humanitarian Aid", href: "#" },
        { label: "Industrial Logistics", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#" },
        { label: "Request Demo", href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border/40 bg-surface-elevated py-12 md:py-16">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Branding & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <img src="/logo.png" alt="MissionFlow AI Logo" className="h-10 md:h-12 w-auto" />
            </div>
            <p className="text-body-small max-w-sm">
              AI-powered logistics intelligence for mission-critical operations.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-body-small hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-16 border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>Â© 2026 MissionFlow AI. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}


