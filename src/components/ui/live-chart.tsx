"use client";

import { useEffect, useRef } from "react";

/**
 * LiveChart — a streaming line+area chart drawn on canvas.
 * Simulates a live metric (mean-reverting random walk) for a "real-time"
 * dashboard feel. DPR-aware, pauses when the tab is hidden, and respects
 * prefers-reduced-motion.
 */
export default function LiveChart({
  height = 140,
  points = 64,
  onValue,
}: {
  height?: number;
  points?: number;
  onValue?: (v: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onValueRef = useRef(onValue);
  onValueRef.current = onValue;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Seed data — a gently trending random walk in [0,1]
    const data: number[] = Array.from({ length: points }, (_, i) => {
      const base = 0.45 + (i / points) * 0.15;
      return base + (Math.random() - 0.5) * 0.18;
    });

    let raf = 0;
    let lastStep = 0;
    let w = 0;
    let h = 0;

    const css = () => getComputedStyle(document.documentElement);
    const accent = () => `rgb(${css().getPropertyValue("--primary-500").trim()})`;
    const accentLight = () => `rgb(${css().getPropertyValue("--primary-400").trim()})`;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const min = Math.min(...data);
      const max = Math.max(...data);
      const range = Math.max(max - min, 0.001);
      const pad = 6;
      const usableH = h - pad * 2;
      const stepX = w / (data.length - 1);

      const yFor = (v: number) => pad + usableH - ((v - min) / range) * usableH;

      ctx.clearRect(0, 0, w, h);

      // baseline grid
      ctx.strokeStyle = `rgb(${css().getPropertyValue("--fg").trim()} / 0.06)`;
      ctx.lineWidth = 1;
      for (let g = 1; g < 4; g++) {
        const y = pad + (usableH / 4) * g;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // area fill
      const a = accent();
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, a.replace("rgb", "rgba").replace(")", " / 0.28)"));
      grad.addColorStop(1, a.replace("rgb", "rgba").replace(")", " / 0)"));

      ctx.beginPath();
      ctx.moveTo(0, h);
      data.forEach((v, i) => ctx.lineTo(i * stepX, yFor(v)));
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // line
      ctx.beginPath();
      data.forEach((v, i) => {
        const x = i * stepX;
        const y = yFor(v);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = a;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.stroke();

      // leading dot
      const lastX = (data.length - 1) * stepX;
      const lastY = yFor(data[data.length - 1]);
      ctx.beginPath();
      ctx.arc(lastX, lastY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = accentLight();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(lastX, lastY, 7, 0, Math.PI * 2);
      ctx.fillStyle = a.replace("rgb", "rgba").replace(")", " / 0.18)");
      ctx.fill();
    };

    const step = (now: number) => {
      if (now - lastStep > 900) {
        lastStep = now;
        const prev = data[data.length - 1];
        // mean-reverting walk, clamped
        const next = Math.min(
          0.95,
          Math.max(0.05, prev + (Math.random() - 0.5) * 0.16 + (0.5 - prev) * 0.05),
        );
        data.push(next);
        data.shift();
        onValueRef.current?.(next);
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduced) {
      draw();
      onValueRef.current?.(data[data.length - 1]);
    } else {
      raf = requestAnimationFrame(step);
    }

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        raf = requestAnimationFrame(step);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [points]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height }}
      className="block"
      aria-hidden
    />
  );
}
