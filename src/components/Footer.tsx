import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t-[3px] border-foreground bg-background-elevated">
      <div className="container-prose py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <Link href="/" className="font-display text-2xl tracking-wide text-foreground">
            SAMARTH KAPOOR
          </Link>
          <p className="mt-1 font-scrawl text-base text-foreground-subtle">
            AI Product Manager · Data Science &amp; Fintech
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Social href="https://github.com/" label="GitHub"><Github className="h-4 w-4" /></Social>
          <Social href="https://linkedin.com/" label="LinkedIn"><Linkedin className="h-4 w-4" /></Social>
          <Social href="mailto:kapoorsammy05@gmail.com" label="Email"><Mail className="h-4 w-4" /></Social>
        </div>
      </div>
      <div className="container-prose pb-8 border-t-2 border-dashed border-border-soft pt-6 font-mono text-xs text-foreground-subtle flex flex-wrap items-center justify-between gap-2">
        <span>© {year} Samarth Kapoor · Est. 2026</span>
        <span className="font-scrawl text-sm">with great data comes great responsibility</span>
      </div>
    </footer>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="rounded-[9px_11px_8px_12px] border-2 border-foreground bg-background-elevated p-2.5 text-foreground-muted shadow-ink-sm hover:text-white hover:bg-primary-500 hover:-translate-y-0.5 transition-all"
    >
      {children}
    </a>
  );
}
