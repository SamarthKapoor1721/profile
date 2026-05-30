"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassPanel from "@/components/ui/GlassPanel";
import TiltCard from "@/components/ui/tilt-card";
import { projects, type Project } from "@/data/projects";
import { ArrowUpRight, X, Github, ExternalLink } from "lucide-react";

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="projects" className="container-prose py-24 md:py-32">
      <SectionHeading
        eyebrow="Projects"
        title="Selected work."
        description="Shipped systems across ML pipelines, predictive risk, decentralized protocols, and real-time products. Select a project for the full write-up."
      />

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <motion.article
            key={p.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.05, duration: 0.55 }}
            className="relative h-full"
          >
            <TiltCard className="group h-full rounded-xl">
              <button
                onClick={() => setActive(p)}
                className="relative z-10 w-full text-left rounded-xl glass p-6 h-full flex flex-col justify-between
                           transition-colors duration-300 hover:border-primary-500/30 focus-ring"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="chip-accent chip">{p.category}</span>
                    <span className="font-mono text-xs text-foreground-subtle">{p.year}</span>
                  </div>

                  <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-foreground group-hover:text-primary-400 transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-foreground-muted leading-relaxed line-clamp-3">
                    {p.tagline}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border-soft">
                  <div className="flex flex-wrap gap-1.5">
                    {p.stack.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-mono text-foreground-subtle border border-border-soft rounded-md px-1.5 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                    {p.stack.length > 4 && (
                      <span className="text-[11px] font-mono text-foreground-subtle pl-1 flex items-center">
                        +{p.stack.length - 4}
                      </span>
                    )}
                  </div>

                  <span className="mt-5 inline-flex items-center gap-1 text-sm text-foreground-muted group-hover:text-primary-400 transition-colors">
                    View details <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </button>
            </TiltCard>
          </motion.article>
        ))}
      </div>

      <AnimatePresence>
        {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <GlassPanel strong className="p-6 md:p-10 rounded-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-lg border border-border-soft p-2 text-foreground-muted hover:text-foreground hover:bg-foreground/[0.06] transition-colors focus-ring"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3">
            <span className="chip-accent chip">{project.category}</span>
            <span className="font-mono text-xs text-foreground-subtle">{project.year}</span>
          </div>

          <h3 className="mt-4 font-display text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            {project.title}
          </h3>
          <p className="mt-2 text-foreground-muted">{project.tagline}</p>

          {project.image && (
            <div className="relative mt-5 aspect-[16/9] w-full overflow-hidden rounded-lg border border-border-soft bg-background">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.image} alt={`${project.title} preview`} className="h-full w-full object-cover" />
            </div>
          )}

          {project.links && (
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border-soft px-4 py-2 hover:bg-foreground/[0.06] transition-colors"
                >
                  <Github className="h-4 w-4" /> Repository
                </a>
              )}
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-primary-500/40 text-primary-400 px-4 py-2 hover:bg-primary-500/10 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" /> Live demo
                </a>
              )}
              {project.links.paper && (
                <a
                  href={project.links.paper}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border-soft px-4 py-2 hover:bg-foreground/[0.06] transition-colors"
                >
                  <ExternalLink className="h-4 w-4" /> Paper
                </a>
              )}
            </div>
          )}

          <div className="mt-8 grid gap-6 md:grid-cols-2 border-t border-border-soft pt-6">
            <Block title="Problem">{project.problem}</Block>
            <Block title="Approach">{project.approach}</Block>
          </div>

          <div className="mt-8 border-t border-border-soft pt-6">
            <h4 className="label-mono text-primary-400">Tech stack</h4>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.stack.map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-border-soft pt-6">
            <h4 className="label-mono text-primary-400">Impact</h4>
            <ul className="mt-3 space-y-2.5">
              {project.impact.map((line) => (
                <li key={line} className="flex gap-3 text-sm text-foreground-muted leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-500 shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="label-mono text-primary-400">{title}</h4>
      <p className="mt-3 text-sm text-foreground-muted leading-relaxed">{children}</p>
    </div>
  );
}
