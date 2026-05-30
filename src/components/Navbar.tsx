"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ThemeToggle";
import { useCommandPalette } from "@/components/ui/command-palette";
import { Search } from "lucide-react";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#certifications", label: "Certifications" },
  { href: "#experience", label: "Experience" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMac, setIsMac] = useState(true);
  const { open } = useCommandPalette();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMac(/mac/i.test(navigator.platform));
  }, []);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-3" : "py-5",
      )}
    >
      <div className="container-prose">
        <div
          className={cn(
            "flex items-center justify-between rounded-xl px-5 py-2.5 transition-all",
            scrolled
              ? "glass-strong"
              : "border border-transparent",
          )}
        >
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-base font-semibold tracking-tight focus-ring rounded-md px-1"
          >
            <span className="grid h-7 w-7 place-items-center rounded-md bg-primary-500/15 border border-primary-500/30 font-mono text-sm font-bold text-primary-400">
              S
            </span>
            <span className="text-foreground">Samarth Kapoor</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-1.5 rounded-md text-foreground-muted hover:text-foreground hover:bg-foreground/[0.04] transition-colors focus-ring"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={open}
              aria-label="Open command palette"
              className="hidden md:inline-flex items-center gap-2 rounded-lg border border-border-soft px-2.5 py-1.5 text-foreground-subtle hover:text-foreground hover:border-foreground/20 transition-colors focus-ring"
            >
              <Search className="h-3.5 w-3.5" />
              <kbd className="font-mono text-[11px]">{isMac ? "⌘" : "Ctrl"} K</kbd>
            </button>
            <ThemeToggle />
            <Button href="#contact" variant="primary" className="hidden sm:inline-flex px-4 py-2 text-sm">
              Contact
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
