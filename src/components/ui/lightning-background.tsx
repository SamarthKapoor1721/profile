"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Bolt = {
  points: { x: number; y: number }[];
  life: number;
  max: number;
  hue: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
};

/**
 * LightningBackground — full-bleed interactive canvas.
 * - drifting glow particles
 * - mouse motion emits crackling lightning bolts from cursor toward random nearby points
 * - click triggers a burst of bolts radiating outward
 */
export default function LightningBackground({
  className,
  density = 60,
  ambientMs = 1100,
}: {
  className?: string;
  density?: number;
  ambientMs?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = canvas.offsetWidth * devicePixelRatio);
    let h = (canvas.height = canvas.offsetHeight * devicePixelRatio);
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const bolts: Bolt[] = [];
    const particles: Particle[] = [];
    let mouse = { x: -9999, y: -9999, px: -9999, py: -9999 };
    let lastEmit = 0;

    for (let i = 0; i < density; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.6 + 0.4,
        hue: 200 + Math.random() * 60,
      });
    }

    const makeBolt = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      hue: number
    ) => {
      const pts: { x: number; y: number }[] = [];
      const steps = 14;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;
        const jitter = (1 - Math.abs(0.5 - t) * 2) * 28;
        pts.push({
          x: x + (Math.random() - 0.5) * jitter,
          y: y + (Math.random() - 0.5) * jitter,
        });
      }
      bolts.push({ points: pts, life: 0, max: 18 + Math.random() * 10, hue });
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      const dx = mouse.x - mouse.px;
      const dy = mouse.y - mouse.py;
      const speed = Math.hypot(dx, dy);
      const now = performance.now();
      if (speed > 4 && now - lastEmit > 40) {
        lastEmit = now;
        const angle = Math.random() * Math.PI * 2;
        const dist = 80 + Math.random() * 120;
        makeBolt(
          mouse.x,
          mouse.y,
          mouse.x + Math.cos(angle) * dist,
          mouse.y + Math.sin(angle) * dist,
          200 + Math.random() * 80
        );
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2 + Math.random() * 0.3;
        const d = 140 + Math.random() * 80;
        makeBolt(cx, cy, cx + Math.cos(a) * d, cy + Math.sin(a) * d, 280 + Math.random() * 60);
      }
    };

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);

    let raf = 0;
    let t = 0;
    let nextAmbient = performance.now() + 800;
    const loop = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      t += 0.006;

      // animated gradient wash (shifts over time)
      const g = ctx.createLinearGradient(
        W * (0.5 + 0.5 * Math.cos(t)),
        0,
        W * (0.5 - 0.5 * Math.cos(t)),
        H
      );
      g.addColorStop(0, `hsla(${(t * 30) % 360}, 70%, 12%, 0.22)`);
      g.addColorStop(0.5, "rgba(5, 7, 13, 0.30)");
      g.addColorStop(1, `hsla(${(t * 30 + 180) % 360}, 70%, 12%, 0.22)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // ambient lightning every ~1-2s, even when idle
      const now = performance.now();
      if (now > nextAmbient) {
        const x1 = Math.random() * W;
        const y1 = Math.random() * H * 0.6;
        const angle = Math.random() * Math.PI * 2;
        const dist = 120 + Math.random() * 200;
        makeBolt(
          x1,
          y1,
          x1 + Math.cos(angle) * dist,
          y1 + Math.sin(angle) * dist,
          200 + Math.random() * 100
        );
        nextAmbient = now + ambientMs + Math.random() * ambientMs;
      }

      // particles drift, attracted slightly to cursor
      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 200 * 200) {
          const f = (1 - Math.sqrt(d2) / 200) * 0.05;
          p.vx += dx * f * 0.002;
          p.vy += dy * f * 0.002;
        }
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, 0.55)`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 70%, 0.9)`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // bolts
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i];
        const alpha = 1 - b.life / b.max;
        ctx.lineCap = "round";
        ctx.strokeStyle = `hsla(${b.hue}, 100%, 75%, ${alpha})`;
        ctx.shadowColor = `hsla(${b.hue}, 100%, 65%, ${alpha})`;
        ctx.shadowBlur = 14;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(b.points[0].x, b.points[0].y);
        for (let k = 1; k < b.points.length; k++) {
          ctx.lineTo(b.points[k].x, b.points[k].y);
        }
        ctx.stroke();
        // inner bright core
        ctx.strokeStyle = `hsla(0, 0%, 100%, ${alpha * 0.9})`;
        ctx.shadowBlur = 4;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        b.life++;
        if (b.life >= b.max) bolts.splice(i, 1);
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
    };
  }, [density, ambientMs]);

  return (
    <canvas
      ref={ref}
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  );
}
