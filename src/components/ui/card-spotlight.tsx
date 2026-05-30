"use client";

import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import React, { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * CardSpotlight — subtle radial gradient that follows the cursor inside the card
 * on hover. Used by Linear, Vercel, and most polished AI/SaaS sites.
 */
export default function CardSpotlight({
  children,
  className,
  radius = 280,
  color = "rgb(91, 124, 255)",
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
  color?: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [hover, setHover] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, ${color}, transparent 70%)`;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn("group relative", className)}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-[0.12]"
        style={{ background }}
        animate={{ opacity: hover ? 0.12 : 0 }}
      />
      {children}
    </div>
  );
}
