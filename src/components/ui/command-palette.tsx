"use client";

import { useEffect, useMemo, useRef, useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  User,
  Layers,
  FolderGit2,
  BadgeCheck,
  Briefcase,
  Mail,
  Github,
  Linkedin,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

type Item = {
  id: string;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  keywords?: string;
};

const PaletteContext = createContext<{ open: () => void }>({ open: () => {} });

export const useCommandPalette = () => useContext(PaletteContext);

export default function CommandPalette({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const go = (hash: string) => () => {
    setOpen(false);
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  };
  const ext = (url: string) => () => {
    setOpen(false);
    window.open(url, "_blank", "noopener");
  };

  const items = useMemo<Item[]>(
    () => [
      { id: "about", label: "About", hint: "Profile & background", icon: User, action: go("#about") },
      { id: "skills", label: "Skills", hint: "Stack & capabilities", icon: Layers, action: go("#skills") },
      { id: "projects", label: "Projects", hint: "Selected work", icon: FolderGit2, action: go("#projects") },
      { id: "certifications", label: "Certifications", hint: "Credentials", icon: BadgeCheck, action: go("#certifications") },
      { id: "experience", label: "Experience", hint: "Work history", icon: Briefcase, action: go("#experience") },
      { id: "contact", label: "Contact", hint: "Get in touch", icon: Mail, action: go("#contact") },
      { id: "email", label: "Email me", hint: "kapoorsammy05@gmail.com", icon: Mail, action: ext("mailto:kapoorsammy05@gmail.com"), keywords: "mail message" },
      { id: "github", label: "GitHub", hint: "Open profile", icon: Github, action: ext("https://github.com/"), keywords: "code repo" },
      { id: "linkedin", label: "LinkedIn", hint: "Open profile", icon: Linkedin, action: ext("https://linkedin.com/") },
    ],
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(q) ||
        it.hint.toLowerCase().includes(q) ||
        it.keywords?.toLowerCase().includes(q),
    );
  }, [query, items]);

  // Global ⌘K / Ctrl-K toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[active]?.action();
    }
  };

  return (
    <PaletteContext.Provider value={{ open: () => setOpen(true) }}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-start justify-center p-4 pt-[15vh] bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={onListKey}
              className="w-full max-w-lg glass-strong rounded-xl overflow-hidden shadow-2xl"
            >
              {/* Search */}
              <div className="flex items-center gap-3 border-b border-border-soft px-4 py-3">
                <Search className="h-4 w-4 text-foreground-subtle shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Jump to a section or link…"
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none"
                />
                <kbd className="hidden sm:inline-flex font-mono text-[10px] text-foreground-subtle border border-border-soft rounded px-1.5 py-0.5">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <ul className="max-h-[320px] overflow-y-auto p-2">
                {filtered.length === 0 && (
                  <li className="px-3 py-6 text-center text-sm text-foreground-subtle">
                    No matches
                  </li>
                )}
                {filtered.map((it, i) => {
                  const Icon = it.icon;
                  const isActive = i === active;
                  return (
                    <li key={it.id}>
                      <button
                        onMouseEnter={() => setActive(i)}
                        onClick={it.action}
                        className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                          isActive ? "bg-primary-500/10" : "hover:bg-foreground/[0.04]"
                        }`}
                      >
                        <span
                          className={`grid h-8 w-8 place-items-center rounded-md border ${
                            isActive
                              ? "border-primary-500/40 text-primary-400"
                              : "border-border-soft text-foreground-muted"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm text-foreground">{it.label}</span>
                          <span className="block text-xs text-foreground-subtle truncate">
                            {it.hint}
                          </span>
                        </span>
                        {isActive && (
                          <CornerDownLeft className="ml-auto h-3.5 w-3.5 text-foreground-subtle shrink-0" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Footer */}
              <div className="flex items-center gap-4 border-t border-border-soft px-4 py-2.5 text-[11px] text-foreground-subtle font-mono">
                <span className="flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  <ArrowDown className="h-3 w-3" /> navigate
                </span>
                <span className="flex items-center gap-1">
                  <CornerDownLeft className="h-3 w-3" /> select
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PaletteContext.Provider>
  );
}
