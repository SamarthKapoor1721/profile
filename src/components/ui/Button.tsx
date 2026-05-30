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

const variants: Record<Variant, string> = {
  primary:
    "bg-primary-500 text-background font-semibold border border-primary-500 hover:bg-primary-400 hover:border-primary-400 transition-colors active:scale-[0.98]",
  secondary:
    "border border-border-strong text-foreground bg-background-elevated/40 hover:bg-background-elevated hover:border-foreground/30 transition-colors active:scale-[0.98]",
  ghost:
    "text-foreground-muted hover:text-foreground bg-transparent transition-colors active:scale-[0.98]",
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
    "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium",
    "transition-all duration-200 focus-ring",
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
