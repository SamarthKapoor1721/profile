"use client";

type Tech = { name: string; slug: string };

// Simple Icons CDN slugs. Rendered as CSS masks so they pick up the theme
// color (and turn emerald on hover) instead of clashing brand colors.
const rowA: Tech[] = [
  { name: "Python", slug: "python" },
  { name: "PyTorch", slug: "pytorch" },
  { name: "scikit-learn", slug: "scikitlearn" },
  { name: "Pandas", slug: "pandas" },
  { name: "NumPy", slug: "numpy" },
  { name: "TypeScript", slug: "typescript" },
  { name: "JavaScript", slug: "javascript" },
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextdotjs" },
  { name: "Node.js", slug: "nodedotjs" },
];

const rowB: Tech[] = [
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "Prisma", slug: "prisma" },
  { name: "MongoDB", slug: "mongodb" },
  { name: "Express", slug: "express" },
  { name: "Solidity", slug: "solidity" },
  { name: "Ethereum", slug: "ethereum" },
  { name: "Streamlit", slug: "streamlit" },
  { name: "Socket.IO", slug: "socketdotio" },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "Vite", slug: "vite" },
];

function LogoMark({ slug, name }: Tech) {
  return (
    <span
      role="img"
      aria-label={name}
      className="block h-6 w-6 shrink-0 bg-foreground-muted transition-colors duration-300 group-hover/pill:bg-primary-400"
      style={{
        WebkitMaskImage: `url(https://cdn.simpleicons.org/${slug})`,
        maskImage: `url(https://cdn.simpleicons.org/${slug})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

function Row({ items, reverse }: { items: Tech[]; reverse?: boolean }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_6%,white_94%,transparent)]">
      <div
        className="flex w-max gap-3 animate-scroll hover:[animation-play-state:paused]"
        style={reverse ? ({ "--animation-direction": "reverse" } as React.CSSProperties) : undefined}
      >
        {row.map((t, i) => (
          <span
            key={`${t.slug}-${i}`}
            className="group/pill flex shrink-0 items-center gap-2.5 rounded-lg border border-border-soft bg-background/50 px-4 py-2.5 whitespace-nowrap hover:border-primary-500/30 transition-colors"
          >
            <LogoMark slug={t.slug} name={t.name} />
            <span className="font-mono text-sm text-foreground-muted group-hover/pill:text-foreground transition-colors">
              {t.name}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TechMarquee() {
  return (
    <div className="relative border-y border-border-soft bg-background-elevated/30 py-6 overflow-hidden">
      <div className="container-prose mb-4">
        <span className="label-mono text-foreground-subtle">Tools I build with</span>
      </div>
      <div className="space-y-3">
        <Row items={rowA} />
        <Row items={rowB} reverse />
      </div>
    </div>
  );
}
