"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}: {
  items: { title: string; subtitle?: string; level?: number }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;
    const scroller = scrollerRef.current;
    const container = containerRef.current;
    const scrollerContent = Array.from(scroller.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      scroller.appendChild(duplicatedItem);
    });
    container.style.setProperty(
      "--animation-direction",
      direction === "left" ? "forwards" : "reverse"
    );
    container.style.setProperty(
      "--animation-duration",
      speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s"
    );
    setStart(true);
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item) => (
          <li
            key={item.title}
            className="w-[280px] max-w-full relative rounded-2xl flex-shrink-0 glass border border-foreground/[0.08] px-6 py-5"
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-semibold text-foreground">
                {item.title}
              </span>
              {typeof item.level === "number" && (
                <span className="font-mono text-xs text-foreground-muted">
                  {item.level}%
                </span>
              )}
            </div>
            {item.subtitle && (
              <p className="mt-1 text-xs text-foreground-muted">{item.subtitle}</p>
            )}
            {typeof item.level === "number" && (
              <div className="mt-3 h-1.5 rounded-full bg-foreground/[0.05] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
                  style={{ width: `${item.level}%` }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
