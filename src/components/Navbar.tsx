"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ThemeToggle";
import { useCommandPalette } from "@/components/ui/command-palette";
import { Search, Menu, X, ArrowUpRight } from "lucide-react";

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
  const [menuOpen, setMenuOpen] = useState(false);
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

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

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
            "flex items-center justify-between rounded-xl px-4 sm:px-5 py-2.5 transition-all",
            scrolled || menuOpen ? "glass-strong" : "border border-transparent",
          )}
        >
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 font-display text-base font-semibold tracking-tight focus-ring rounded-md px-1"
          >
            <span className="grid h-7 w-7 place-items-center rounded-md bg-primary-500/15 border border-primary-500/30 font-mono text-sm font-bold text-primary-400">
              S
            </span>
            <span className="text-foreground">Samarth Kapoor</span>
          </Link>

          {/* Desktop nav */}
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

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="md:hidden grid h-9 w-9 place-items-center rounded-lg border border-border-soft text-foreground-muted hover:text-foreground transition-colors focus-ring"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2 glass-strong rounded-xl p-2"
            >
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg px-4 py-3 text-foreground-muted hover:text-foreground hover:bg-foreground/[0.05] transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <div className="my-2 h-px bg-border-soft" />
              <button
                onClick={() => { setMenuOpen(false); open(); }}
                className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-foreground-muted hover:text-foreground hover:bg-foreground/[0.05] transition-colors"
              >
                <Search className="h-4 w-4" /> Search
              </button>
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-3 text-sm font-semibold text-background hover:bg-primary-400 transition-colors"
              >
                Contact <ArrowUpRight className="h-4 w-4" />
              </a>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
