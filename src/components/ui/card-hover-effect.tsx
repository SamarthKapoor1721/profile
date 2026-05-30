"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";

export const HoverEffect = ({
  items,
  className,
  renderItem,
  onItemClick,
}: {
  items: { key: string }[];
  className?: string;
  renderItem: (item: { key: string }, idx: number) => ReactNode;
  onItemClick?: (key: string) => void;
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((item, idx) => (
        <div
          key={item.key}
          onMouseEnter={() => setHovered(idx)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onItemClick?.(item.key)}
          className="relative group block p-2 h-full w-full cursor-pointer"
        >
          <AnimatePresence>
            {hovered === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-primary-500/10 block rounded-2xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
              />
            )}
          </AnimatePresence>
          {renderItem(item, idx)}
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-6 overflow-hidden glass border border-foreground/[0.08] group-hover:border-primary-400/40 relative z-20 transition-colors",
        className
      )}
    >
      <div className="relative z-50">{children}</div>
    </div>
  );
};
