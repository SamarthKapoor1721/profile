"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * GlowBorder — an inked comic panel. Hard ink outline + offset drop shadow that
 * snaps to a spidey-sense red glow on hover. Same API as before so call sites are
 * unchanged: `always` keeps the accent glow on permanently (e.g. the hero panel).
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
    <div
      className={cn(
        "group relative rounded-[14px_10px_16px_11px] border-[2.5px] border-foreground bg-background-panel h-full",
        "transition-all duration-150",
        always
          ? "shadow-glow"
          : "shadow-ink hover:-translate-y-[3px] hover:rotate-[-0.4deg] hover:shadow-glow",
        className,
      )}
    >
      <div className={cn("relative h-full rounded-[inherit] overflow-hidden", innerClassName)}>
        {children}
      </div>
    </div>
  );
}
