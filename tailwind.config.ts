import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Tokens are CSS variables; light/dark are swapped at :root.
        background: {
          DEFAULT: "rgb(var(--bg) / <alpha-value>)",
          elevated: "rgb(var(--bg-elevated) / <alpha-value>)",
          panel: "rgb(var(--bg-panel) / <alpha-value>)",
        },
        foreground: {
          DEFAULT: "rgb(var(--fg) / <alpha-value>)",
          muted: "rgb(var(--fg-muted) / <alpha-value>)",
          subtle: "rgb(var(--fg-subtle) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--primary-500) / <alpha-value>)",
          50: "rgb(var(--primary-50) / <alpha-value>)",
          400: "rgb(var(--primary-400) / <alpha-value>)",
          500: "rgb(var(--primary-500) / <alpha-value>)",
          600: "rgb(var(--primary-600) / <alpha-value>)",
          900: "rgb(var(--primary-900) / <alpha-value>)",
        },
        accent: {
          emerald: "rgb(var(--accent-emerald) / <alpha-value>)",
          amber: "rgb(var(--accent-amber) / <alpha-value>)",
          danger: "rgb(var(--accent-danger) / <alpha-value>)",
          // Legacy aliases repointed onto the new palette so any stray
          // reference still renders on-theme rather than breaking the build.
          cyan: "rgb(var(--accent-emerald) / <alpha-value>)",
          gold: "rgb(var(--accent-amber) / <alpha-value>)",
          red: "rgb(var(--accent-danger) / <alpha-value>)",
        },
      },
      fontFamily: {
        // Comic-strip type system. `sans`/`display`/`mono` keep their semantic
        // names so existing utility classes keep working — they just speak comic now.
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-boom)", "Impact", "system-ui", "sans-serif"],
        scrawl: ["var(--font-scrawl)", "Comic Sans MS", "cursive"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        // Comic halftone dot screen — the signature shading of an inked panel.
        "grid-fade":
          "linear-gradient(to bottom, transparent, rgb(var(--bg)) 88%), radial-gradient(rgb(var(--fg) / 0.08) 22%, transparent 23%)",
        halftone: "radial-gradient(rgb(var(--fg) / 0.08) 22%, transparent 23%)",
        "radial-glow":
          "radial-gradient(circle at 50% 0%, rgb(var(--primary-500) / 0.12), transparent 60%)",
      },
      boxShadow: {
        // Hard, offset "ink" shadows — no blur, like a printed comic drop.
        glow: "4px 6px 0 rgb(var(--primary-500))",
        "glow-emerald": "4px 6px 0 rgb(var(--primary-500))",
        ink: "3px 4px 0 rgb(var(--fg) / 0.85)",
        "ink-sm": "2px 2px 0 rgb(var(--fg) / 0.85)",
        "ink-lg": "5px 7px 0 rgb(var(--fg) / 0.9)",
        panel: "3px 4px 0 rgb(var(--fg) / 0.18)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        aurora: {
          from: { backgroundPosition: "50% 50%, 50% 50%" },
          to: { backgroundPosition: "350% 50%, 350% 50%" },
        },
        spotlight: {
          "0%": { opacity: "0", transform: "translate(-72%, -62%) scale(0.5)" },
          "100%": { opacity: "1", transform: "translate(-50%,-40%) scale(1)" },
        },
        scroll: {
          to: { transform: "translate(calc(-50% - 0.5rem))" },
        },
        "caret-blink": {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        // Comic "POW" reveal — a punchy over-scale snap as a panel enters.
        pow: {
          "0%": { opacity: "0", transform: "scale(0.82) rotate(-2deg)" },
          "60%": { opacity: "1", transform: "scale(1.04) rotate(.6deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
        wobble: {
          "0%,100%": { transform: "rotate(-1.5deg)" },
          "50%": { transform: "rotate(1.5deg)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 4s linear infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        aurora: "aurora 60s linear infinite",
        spotlight: "spotlight 2s ease .75s 1 forwards",
        scroll: "scroll var(--animation-duration,40s) var(--animation-direction,forwards) linear infinite",
        "caret-blink": "caret-blink 1.2s steps(1) infinite",
        pow: "pow 0.5s cubic-bezier(0.22,1,0.36,1) both",
        wobble: "wobble 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
