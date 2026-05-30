import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border-soft">
      <div className="container-prose py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <Link href="/" className="font-display text-lg font-semibold tracking-tight text-foreground">
            Samarth Kapoor
          </Link>
          <p className="mt-1 text-sm text-foreground-subtle">
            AI Product Manager · Data Science &amp; Fintech
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Social href="https://github.com/" label="GitHub"><Github className="h-4 w-4" /></Social>
          <Social href="https://linkedin.com/" label="LinkedIn"><Linkedin className="h-4 w-4" /></Social>
          <Social href="mailto:kapoorsammy05@gmail.com" label="Email"><Mail className="h-4 w-4" /></Social>
        </div>
      </div>
      <div className="container-prose pb-8 border-t border-border-soft pt-6 text-xs text-foreground-subtle flex flex-col sm:flex-row justify-between gap-2">
        <span>© {year} Samarth Kapoor</span>
        <span className="font-mono">Built with Next.js · Tailwind</span>
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
      className="rounded-lg border border-border-soft p-2.5 text-foreground-muted hover:text-primary-400 hover:border-primary-500/40 transition-colors"
    >
      {children}
    </a>
  );
}
