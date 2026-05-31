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
        {/* Web-line rail — a hand-strung strand the nodes hang from */}
        <div
          aria-hidden
          className="absolute left-[13px] top-1 bottom-1 w-[3px] bg-[repeating-linear-gradient(to_bottom,rgb(var(--fg))_0_8px,transparent_8px_14px)]"
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
                className="relative pl-12"
              >
                {/* Web node */}
                <div
                  className={`absolute left-0 top-1 grid h-7 w-7 place-items-center rounded-full border-2 border-foreground shadow-ink-sm ${
                    isActive ? "bg-primary-500 animate-pulse" : "bg-background-elevated"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-foreground"}`} />
                </div>

                <div className="rounded-[12px_10px_14px_11px] border-2 border-foreground bg-background-elevated p-5 shadow-ink spidey-sense">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-xl tracking-wide text-foreground">
                      {item.role}
                    </h3>
                    <span className="chip">{item.period}</span>
                  </div>
                  <p className="mt-1 font-scrawl text-base text-primary-500">{item.org}</p>

                  <p className="mt-3 text-base text-foreground-muted leading-relaxed">
                    {item.summary}
                  </p>

                  <ul className="mt-4 space-y-2 text-base text-foreground-muted">
                    {item.highlights.map((h) => (
                      <li key={h} className="flex gap-2.5 items-start">
                        <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-primary-500" />
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
