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
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, transparent, rgb(var(--bg)) 80%), repeating-linear-gradient(0deg, rgb(var(--hairline)) 0 1px, transparent 1px 72px), repeating-linear-gradient(90deg, rgb(var(--hairline)) 0 1px, transparent 1px 72px)",
        "radial-glow":
          "radial-gradient(circle at 50% 0%, rgb(var(--primary-500) / 0.12), transparent 60%)",
      },
      boxShadow: {
        glow: "0 0 40px rgb(var(--primary-500) / 0.18)",
        "glow-emerald": "0 0 40px rgb(var(--primary-500) / 0.18)",
        panel:
          "0 1px 0 rgb(var(--panel-highlight)) inset, 0 24px 48px -24px rgb(var(--panel-shadow))",
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
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 4s linear infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        aurora: "aurora 60s linear infinite",
        spotlight: "spotlight 2s ease .75s 1 forwards",
        scroll: "scroll var(--animation-duration,40s) var(--animation-direction,forwards) linear infinite",
        "caret-blink": "caret-blink 1.2s steps(1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
