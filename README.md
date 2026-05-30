# Samarth Kapoor — Portfolio

A premium, modern portfolio for an AI Product Manager focused on Data Science and Fintech. Quant/data-terminal aesthetic: near-black slate, a single emerald accent, monospace reserved for data, glassmorphism, a live streaming chart, a ⌘K command palette, and a Three.js network-graph hero. Includes a local content admin panel.

## Tech stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + custom design tokens
- **Animation**: Framer Motion (UI) + GSAP available
- **3D**: Three.js via React Three Fiber + drei (lazy-loaded, hero only)
- **Charts**: Recharts (radar, skill bars). D3 can be added per-chart.
- **Deploy**: Vercel

## Getting started

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Folder structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, fonts, nav, footer
│   │   ├── page.tsx                # Single-page composition of all sections
│   │   ├── globals.css             # Tailwind + design tokens + utilities
│   │   └── projects/[slug]/page.tsx
│   ├── components/
│   │   ├── Hero.tsx                # Fullscreen 3D hero
│   │   ├── About.tsx               # Narrative + radar chart
│   │   ├── Skills.tsx              # 3 categories, animated bars
│   │   ├── Projects.tsx            # Grid + modal case studies
│   │   ├── Certifications.tsx      # Card grid
│   │   ├── Experience.tsx          # Animated timeline
│   │   ├── Contact.tsx             # Form + zod validation
│   │   ├── Navbar.tsx / Footer.tsx
│   │   ├── three/HeroScene.tsx     # R3F particle field + flow lines
│   │   └── ui/                     # Button, GlassPanel, SectionHeading
│   ├── data/                       # Typed content: skills, projects, certs, experience
│   └── lib/utils.ts                # cn(), motion presets
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
└── package.json
```

## Design system

### Color palette

| Token              | Hex       | Use                              |
|--------------------|-----------|----------------------------------|
| background         | `#080B10` | Page base (near-black slate)      |
| background.elevated| `#0D1117` | Surfaces                          |
| background.panel   | `#11161D` | Cards behind glass                |
| foreground         | `#E6EDF3` | Primary text                      |
| foreground.muted   | `#8B949E` | Secondary text                    |
| foreground.subtle  | `#6E7681` | Captions, mono labels             |
| primary (500)      | `#10B981` | Emerald — the single brand accent |
| primary (400)      | `#34D399` | Lighter emerald (glow, hover)     |
| accent.amber       | `#F59E0B` | Sparing highlights                |
| accent.danger      | `#F87171` | Errors only                       |

Light and dark themes are token swaps at `:root[data-theme]`. Emerald wash for select words via `.text-accent`.

### Typography

- **Display**: Space Grotesk (headings, brand)
- **Body**: Inter (UI, prose)
- **Mono**: JetBrains Mono (data labels, captions)

All loaded via `next/font` (zero CLS, automatic preloading).

### Reusable components

- `<Button variant="primary|secondary|ghost" href? withArrow? />`
- `<GlassPanel strong? />`
- `<SectionHeading eyebrow title description align />`

### Motion principles

- All section reveals use `whileInView` + `viewport={{ once: true }}`.
- Easing: `[0.22, 1, 0.36, 1]` (smooth out-cubic) for hero/heading.
- 3D limited to hero, lazy-loaded via `next/dynamic({ ssr: false })`.

## Performance checklist

- [x] Three.js dynamically imported — no SSR cost, no main-bundle weight
- [x] Fonts via `next/font` (self-hosted, swap)
- [x] Optimized image domains in `next.config.mjs`
- [x] `optimizePackageImports` for framer-motion, lucide-react, recharts
- [x] Tailwind purges unused CSS
- [x] Particles capped at 1400; DPR clamped to 1.6

To verify Lighthouse 90+: build with `npm run build && npm start`, then run Lighthouse in incognito.

## Environment variables

Copy `.env.example` → `.env.local` and fill in as needed. Everything is optional for a basic deploy.

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical production URL (used for metadata, OG, sitemap, robots). On Vercel it falls back to `VERCEL_URL` automatically. |
| `RESEND_API_KEY` | Optional | Enables the contact form to actually send email via Resend. Without it, submissions are logged and the UI still succeeds. |
| `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` | Optional | Recipient / sender for contact email. |
| `ADMIN_PASSWORD` | Local only | Password for the `/admin` content panel. Defaults to `admin` locally; ignored in production (writes are blocked there). |

## Content admin (`/admin`)

Content lives in `src/data/*.json` (`projects`, `experience`, `certifications`), read through typed loaders in `src/data/*.ts`.

- Run `npm run dev`, open **`/admin`**, log in with `ADMIN_PASSWORD`.
- Add / edit / delete items via forms; upload cert images **or PDFs** (saved to `public/images/uploads/`).
- Changes write to the JSON files → **commit & push** to publish.

The write endpoints are **hard-blocked on Vercel** (read-only filesystem + `VERCEL` env guard), so the panel is a local authoring tool — the live site can't be mutated. `/admin` and `/api/*` are excluded from search via `robots.ts`.

## Deploying to Vercel

1. Push this repo to GitHub (ensure `src/data/*.json` and `public/images/` are committed — that's your content).
2. Import into Vercel — framework is auto-detected; build command `next build`.
3. Set **`NEXT_PUBLIC_SITE_URL`** to your domain in Project → Settings → Environment Variables.
4. (Optional) Set `RESEND_API_KEY` + `CONTACT_TO_EMAIL` to enable contact emails.
5. Deploy.

To add content after launch: edit locally via `/admin`, commit, push — Vercel redeploys automatically.

## Scaling suggestions

- **Live dashboards**: Add `app/dashboard/` with server actions hitting `/api/markets`. Recharts → consider `lightweight-charts` for L2/candlestick.
- **Analytics**: Vercel Analytics + PostHog for funnel insight on Contact CTA.
- **MDX case studies**: Migrate `data/projects.ts` to MDX in `content/projects/*.mdx` once you want richer write-ups.
- **Newsletter**: Resend + a simple `/api/subscribe` route, gated to Contact form.
- **A/B**: Vercel Edge Config for landing-copy experiments.

## License

MIT — content (project descriptions, certifications) is personal; replace before reuse.
