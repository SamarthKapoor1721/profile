"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  href?: string;
  external?: boolean;
  withArrow?: boolean;
}

// Comic-button inks: hard ink outline + offset drop, lifts on hover, presses flat on click.
const variants: Record<Variant, string> = {
  primary:
    "bg-primary-500 text-white border-2 border-foreground shadow-ink-sm hover:-translate-y-0.5 hover:shadow-ink active:translate-y-0.5 active:shadow-none",
  secondary:
    "bg-background-elevated text-foreground border-2 border-foreground shadow-ink-sm hover:-translate-y-0.5 hover:shadow-ink active:translate-y-0.5 active:shadow-none",
  ghost:
    "text-foreground-muted hover:text-primary-500 bg-transparent border-2 border-transparent active:scale-[0.98]",
};

export default function Button({
  variant = "primary",
  href,
  external,
  withArrow,
  className,
  children,
  ...props
}: ButtonProps) {
  const base = cn(
    "inline-flex items-center justify-center gap-2 rounded-[10px_12px_9px_13px] px-5 py-2.5 text-base font-sans",
    "transition-all duration-150 focus-ring",
    variants[variant],
    className,
  );

  const content = (
    <>
      {children}
      {withArrow && <ArrowUpRight className="h-4 w-4" />}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a className={base} href={href} target="_blank" rel="noreferrer">
          {content}
        </a>
      );
    }
    return (
      <Link className={base} href={href}>
        {content}
      </Link>
    );
  }

  return (
    <button className={base} {...props}>
      {content}
    </button>
  );
}
