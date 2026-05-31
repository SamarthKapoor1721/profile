"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import CountUp from "@/components/ui/count-up";
import LiveChart from "@/components/ui/live-chart";
import GlowBorder from "@/components/ui/glow-border";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { ArrowRight, ArrowUpRight, TrendingUp, Activity } from "lucide-react";

const stats = [
  { label: "Forecast accuracy", value: 92, suffix: "%" },
  { label: "Risk model AUC", value: 0.84, decimals: 2 },
  { label: "Inference latency", value: 50, prefix: "<", suffix: "ms" },
  { label: "Corridors modeled", value: 12 },
];

/** Hand-inked web strands in a panel corner — the comic-page gutter motif. */
function WebCorner({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      className={className}
      style={{ position: "absolute", width: 110, height: 110, pointerEvents: "none", opacity: 0.45 }}
    >
      <path
        d="M0 0 L100 30 M0 0 L30 100 M0 0 L70 70 M0 25 L60 90 M25 0 L90 60"
        stroke="rgb(var(--fg))"
        fill="none"
        strokeWidth="1.2"
      />
      <path
        d="M18 6 Q30 22 8 34 M40 10 Q52 30 14 52 M62 16 Q70 40 24 72"
        stroke="rgb(var(--fg))"
        fill="none"
        strokeWidth="0.8"
        opacity="0.7"
      />
    </svg>
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full overflow-hidden flex items-center"
    >
      {/* Halftone shading + inked web corners — the splash-page backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid-fade opacity-50" />
      <WebCorner className="left-0 top-24 -z-10" />
      <WebCorner className="right-0 bottom-10 -z-10 rotate-180" />

      <div className="container-prose pt-36 pb-24 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">

          {/* Left: splash panel */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="label-mono"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-500/60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary-500" />
              </span>
              spidey-sense: available for AI / fintech roles
            </motion.div>

            <h1 className="mt-5 font-display text-6xl md:text-8xl tracking-wide leading-[0.85]">
              <motion.span
                initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="block text-foreground"
              >
                SAMARTH
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.85, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="block text-accent"
              >
                KAPOOR
              </motion.span>
            </h1>

            {/* Tagline as a comic speech bubble */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="relative mt-6 inline-block max-w-md rounded-[16px_12px_18px_13px] border-[2.5px] border-foreground bg-background-elevated px-5 py-3 shadow-ink"
            >
              <span className="font-display text-xl tracking-wide text-foreground">
                AI Product Manager · Data Science &amp; Fintech!
              </span>
              {/* bubble tail */}
              <span className="absolute -bottom-[11px] left-9 h-4 w-4 rotate-45 border-b-[2.5px] border-r-[2.5px] border-foreground bg-background-elevated" />
            </motion.div>

            <TextGenerateEffect
              words="I build intelligent money infrastructure — pairing agentic ML pipelines with payments and market-structure expertise to ship data products that are measured, not guessed."
              className="mt-7 max-w-xl font-sans text-lg leading-relaxed text-foreground-muted text-balance"
              duration={0.4}
            />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button href="#projects" variant="primary" className="gap-2">
                View projects <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="#experience" variant="secondary">
                Experience
              </Button>
              <Button href="#contact" variant="ghost" className="gap-1.5">
                Get in touch <ArrowUpRight className="h-4 w-4" />
              </Button>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-6 w-full max-w-2xl"
            >
              {stats.map((s) => (
                <div key={s.label} className="border-l-[3px] border-primary-500 pl-4">
                  <dt className="font-scrawl text-xs tracking-wide text-foreground-subtle">
                    {s.label}
                  </dt>
                  <dd className="mt-1 font-mono text-2xl font-semibold text-foreground tabular-nums">
                    <CountUp
                      value={s.value}
                      prefix={s.prefix}
                      suffix={s.suffix}
                      decimals={s.decimals}
                    />
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Right: live dashboard — the "spider-radar" data panel */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md"
            >
              <span className="comic-tag absolute -top-3 left-6 z-10">live data feed</span>
              <HeroDashboard />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-foreground-subtle text-xs font-scrawl tracking-[0.2em] flex flex-col items-center gap-2">
        <span>scroll ↓</span>
        <span className="h-8 w-px bg-gradient-to-b from-foreground-subtle/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
}

function HeroDashboard() {
  const [live, setLive] = useState(0.5);
  const [prev, setPrev] = useState(0.5);

  const handleValue = (v: number) => {
    setPrev(live);
    setLive(v);
  };

  const confidence = (live * 100).toFixed(1);
  const delta = ((live - prev) * 100).toFixed(2);
  const up = live >= prev;

  return (
    <GlowBorder always innerClassName="overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border-soft px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-foreground/15" />
        <span className="h-3 w-3 rounded-full bg-foreground/15" />
        <span className="h-3 w-3 rounded-full bg-foreground/15" />
        <span className="ml-2 font-mono text-[11px] text-foreground-subtle">
          model-monitor · live
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-primary-400">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse" />
          streaming
        </span>
      </div>

      {/* Live metric */}
      <div className="px-5 pt-5">
        <div className="flex items-end justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-foreground-subtle">
              Model confidence
            </div>
            <div className="mt-1 font-mono text-3xl font-semibold text-foreground tabular-nums">
              {confidence}
              <span className="text-foreground-subtle text-xl">%</span>
            </div>
          </div>
          <div
            className={`flex items-center gap-1 font-mono text-sm tabular-nums ${
              up ? "text-primary-400" : "text-accent-amber"
            }`}
          >
            <TrendingUp className={`h-4 w-4 ${up ? "" : "rotate-180"}`} />
            {up ? "+" : ""}
            {delta}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-2 pt-2">
        <LiveChart height={140} onValue={handleValue} />
      </div>

      {/* Mini stat strip */}
      <div className="grid grid-cols-3 divide-x divide-border-soft border-t border-border-soft font-mono">
        {[
          { k: "p50", v: "38ms" },
          { k: "p99", v: "47ms" },
          { k: "req/s", v: "1.2k" },
        ].map((m) => (
          <div key={m.k} className="px-4 py-3">
            <div className="text-[10px] uppercase tracking-wider text-foreground-subtle">
              {m.k}
            </div>
            <div className="mt-0.5 text-sm text-foreground tabular-nums">{m.v}</div>
          </div>
        ))}
      </div>

      {/* Terminal line */}
      <div className="flex items-center gap-2 border-t border-border-soft px-4 py-3 font-mono text-[12px] text-foreground-subtle">
        <Activity className="h-3.5 w-3.5 text-primary-400" />
        <span className="text-primary-400">$</span>
        <span>eval --suite fintech</span>
        <span className="inline-block h-3.5 w-1.5 bg-primary-500 animate-caret-blink" />
      </div>
    </GlowBorder>
  );
}
