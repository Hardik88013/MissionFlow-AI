import { ThemeToggle } from "../ui/ThemeToggle";
import { Container } from "../ui/Container";
import React from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-surface/80 backdrop-blur-md">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="font-bold text-xl tracking-tighter text-primary">MissionFlow AI</div>
            </div>
            <ThemeToggle />
          </div>
        </Container>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
