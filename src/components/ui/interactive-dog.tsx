"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * InteractiveSpidey — Spider-Man mask fixed at bottom-right.
 * Eye-whites narrow/widen toward the cursor, mask tilts toward it,
 * and a web-line above lets him sway like he's hanging upside-down.
 * Click for a "thwip!".
 */
export default function InteractiveDog() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const [thwip, setThwip] = useState(false);

  const sx = useSpring(mx, { stiffness: 90, damping: 16, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 90, damping: 16, mass: 0.6 });

  const tilt = useTransform(sx, [-1, 1], [-14, 14]);
  const sway = useTransform(sx, [-1, 1], [-8, 8]);
  const eyeShiftX = useTransform(sx, [-1, 1], [-3, 3]);
  const eyeShiftY = useTransform(sy, [-1, 1], [-2, 2]);
  const lidScale = useTransform(sy, [-1, 1], [1, 0.55]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / Math.max(window.innerWidth / 2, 1);
      const dy = (e.clientY - cy) / Math.max(window.innerHeight / 2, 1);
      mx.set(Math.max(-1, Math.min(1, dx)));
      my.set(Math.max(-1, Math.min(1, dy)));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  const fire = () => {
    setThwip(true);
    setTimeout(() => setThwip(false), 500);
  };

  return (
    <div
      ref={ref}
      className="fixed bottom-6 right-6 z-50 select-none"
      aria-hidden
    >
      {/* Thwip bubble */}
      <motion.div
        initial={false}
        animate={
          thwip
            ? { opacity: 1, y: -8, scale: 1 }
            : { opacity: 0, y: 0, scale: 0.8 }
        }
        transition={{ duration: 0.2 }}
        className="absolute -top-9 right-4 rounded-full bg-red-600 text-white text-[10px] font-mono px-2 py-1 shadow-lg"
      >
        thwip!
      </motion.div>

      {/* Web line */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-16 w-px h-16 bg-gradient-to-b from-foreground/40 to-foreground/10" />

      <motion.button
        onClick={fire}
        style={{ rotate: tilt, x: sway }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-full"
        aria-label="Thwip"
      >
        <svg
          width="88"
          height="88"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_8px_20px_rgba(180,20,20,0.45)]"
        >
          <defs>
            <radialGradient id="maskGrad" cx="0.4" cy="0.3" r="0.85">
              <stop offset="0%" stopColor="#E63946" />
              <stop offset="60%" stopColor="#B81C2A" />
              <stop offset="100%" stopColor="#6B0F18" />
            </radialGradient>
            <clipPath id="maskClip">
              <path d="M50 8
                       C 78 8, 90 30, 88 54
                       C 86 76, 70 92, 50 92
                       C 30 92, 14 76, 12 54
                       C 10 30, 22 8, 50 8 Z" />
            </clipPath>
          </defs>

          {/* Mask shape */}
          <path
            d="M50 8
               C 78 8, 90 30, 88 54
               C 86 76, 70 92, 50 92
               C 30 92, 14 76, 12 54
               C 10 30, 22 8, 50 8 Z"
            fill="url(#maskGrad)"
            stroke="#3a0710"
            strokeWidth="1.2"
          />

          {/* Web pattern — clipped to mask */}
          <g clipPath="url(#maskClip)" stroke="#2a0509" strokeWidth="0.6" fill="none" opacity="0.85">
            {/* radial lines from center */}
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              const x2 = 50 + Math.cos(a) * 60;
              const y2 = 50 + Math.sin(a) * 60;
              return <line key={i} x1="50" y1="50" x2={x2} y2={y2} />;
            })}
            {/* concentric web arcs */}
            {[10, 20, 30, 40, 50].map((r) => (
              <circle key={r} cx="50" cy="50" r={r} />
            ))}
          </g>

          {/* Eye base shapes — classic teardrop */}
          <g>
            {/* Left eye */}
            <path
              d="M22 44 Q 26 32 42 36 Q 46 44 38 52 Q 26 56 22 44 Z"
              fill="#0b1220"
              stroke="#fff"
              strokeWidth="1.2"
            />
            {/* Right eye */}
            <path
              d="M78 44 Q 74 32 58 36 Q 54 44 62 52 Q 74 56 78 44 Z"
              fill="#0b1220"
              stroke="#fff"
              strokeWidth="1.2"
            />
          </g>

          {/* White eye fill that "looks" toward cursor */}
          <g clipPath="url(#eyesClip)">
            <motion.g style={{ x: eyeShiftX, y: eyeShiftY, scaleY: lidScale }}>
              <path
                d="M22 44 Q 26 32 42 36 Q 46 44 38 52 Q 26 56 22 44 Z"
                fill="#fafafa"
              />
              <path
                d="M78 44 Q 74 32 58 36 Q 54 44 62 52 Q 74 56 78 44 Z"
                fill="#fafafa"
              />
            </motion.g>
          </g>
          <defs>
            <clipPath id="eyesClip">
              <path d="M22 44 Q 26 32 42 36 Q 46 44 38 52 Q 26 56 22 44 Z" />
              <path d="M78 44 Q 74 32 58 36 Q 54 44 62 52 Q 74 56 78 44 Z" />
            </clipPath>
          </defs>

          {/* Tiny highlight on eyes */}
          <motion.circle
            cx="32"
            cy="40"
            r="1.2"
            fill="#0b1220"
            style={{ x: eyeShiftX, y: eyeShiftY }}
          />
          <motion.circle
            cx="68"
            cy="40"
            r="1.2"
            fill="#0b1220"
            style={{ x: eyeShiftX, y: eyeShiftY }}
          />
        </svg>
      </motion.button>
    </div>
  );
}
