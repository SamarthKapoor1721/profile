"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { experience } from "@/data/experience";
import { Briefcase, FlaskConical, GraduationCap } from "lucide-react";

const iconFor = (t: string) =>
  t === "work" ? Briefcase : t === "project" ? FlaskConical : GraduationCap;

export default function Experience() {
  return (
    <section id="experience" className="container-prose py-24 md:py-32">
      <SectionHeading
        eyebrow="Experience"
        title="Where I've been working."
        description="Product leadership, data-systems research, and quantitative engineering — in chronological order."
      />

      <div className="mt-14 relative">
        {/* Timeline rail */}
        <div
          aria-hidden
          className="absolute left-[11px] top-1 bottom-1 w-px bg-border-soft"
        />

        <ul className="space-y-10">
          {experience.map((item, i) => {
            const Icon = iconFor(item.type);
            const isActive = item.period.includes("Present");

            return (
              <motion.li
                key={item.role}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="relative pl-10"
              >
                {/* Node */}
                <div
                  className={`absolute left-0 top-1 grid h-6 w-6 place-items-center rounded-full border bg-background ${
                    isActive ? "border-primary-500" : "border-border-strong"
                  }`}
                >
                  <Icon className={`h-3 w-3 ${isActive ? "text-primary-400" : "text-foreground-subtle"}`} />
                </div>

                <div className="rounded-xl border border-border-soft bg-background-elevated/40 p-5 hover:border-primary-500/30 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {item.role}
                    </h3>
                    <span className="font-mono text-xs text-foreground-subtle">{item.period}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-primary-400">{item.org}</p>

                  <p className="mt-3 text-sm text-foreground-muted leading-relaxed">
                    {item.summary}
                  </p>

                  <ul className="mt-4 space-y-2 text-sm text-foreground-muted">
                    {item.highlights.map((h) => (
                      <li key={h} className="flex gap-2.5 items-start">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500/70" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
