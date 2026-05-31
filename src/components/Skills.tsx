"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import GlowBorder from "@/components/ui/glow-border";
import { skills } from "@/data/skills";

const titleFor = (id: string) => {
  switch (id) {
    case "data-science":
      return "Data Science & ML";
    case "fintech":
      return "Fintech & Markets";
    case "engineering":
      return "Engineering & Product";
    default:
      return "Skills";
  }
};

export default function Skills() {
  return (
    <section id="skills" className="container-prose py-24 md:py-32">
      <SectionHeading
        eyebrow="Skills"
        title="A stack built for financial data products."
        description="Machine-learning tooling, quantitative pipelines, and full-stack engineering — the layers I work across to ship reliable systems."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {skills.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: idx * 0.08, duration: 0.6 }}
            className="h-full"
          >
            <GlowBorder className="h-full">
              <div className="p-6 h-full">
                <div className="flex items-center justify-between pb-4 border-b-2 border-dashed border-border-soft">
                  <h3 className="font-display text-lg tracking-wide text-foreground">
                    {titleFor(cat.id)}
                  </h3>
                  <span className="chip">{cat.items.length} powers</span>
                </div>

                <ul className="mt-5 space-y-4">
                  {cat.items.map((s, i) => (
                    <li key={s.name}>
                      <div className="flex items-center justify-between text-base">
                        <span className="text-foreground-muted">{s.name}</span>
                        <span className="font-mono text-xs text-foreground-subtle tabular-nums">
                          {s.level}
                        </span>
                      </div>
                      <div className="mt-2 h-2.5 rounded-full border-2 border-foreground bg-background overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.level}%` }}
                          viewport={{ once: true, margin: "-60px" }}
                          transition={{ delay: 0.1 + i * 0.05, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full bg-primary-500"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </GlowBorder>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
