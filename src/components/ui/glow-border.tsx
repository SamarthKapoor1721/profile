"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * GlowBorder — a rotating conic-gradient border that lights up on hover.
 * The spinning gradient lives behind the content; an inner panel masks the
 * centre so only a ~1px animated edge shows.
 */
export default function GlowBorder({
  children,
  className,
  innerClassName,
  always = false,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  always?: boolean;
}) {
  return (
    <div className={cn("group relative rounded-xl p-px overflow-hidden", className)}>
      {/* static faint edge */}
      <div className="absolute inset-0 rounded-[inherit] border border-border-soft" />
      {/* rotating gradient edge */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-[-150%] animate-spin [animation-duration:6s] transition-opacity duration-500",
          "bg-[conic-gradient(from_0deg,transparent_0%,rgb(var(--primary-500))_15%,transparent_35%)]",
          always ? "opacity-70" : "opacity-0 group-hover:opacity-100",
        )}
      />
      <div className={cn("relative rounded-[calc(0.75rem-1px)] bg-background-panel h-full", innerClassName)}>
        {children}
      </div>
    </div>
  );
}
