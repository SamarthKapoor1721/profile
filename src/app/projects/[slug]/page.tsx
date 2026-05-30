import { notFound } from "next/navigation";
import Link from "next/link";
import { projects } from "@/data/projects";
import GlassPanel from "@/components/ui/GlassPanel";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return notFound();

  return (
    <article className="container-prose pt-32 pb-24">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to projects
      </Link>

      <header className="mt-8">
        <div className="flex items-center gap-2">
          <span className="chip">{project.category}</span>
          <span className="font-mono text-xs text-foreground-subtle">
            {project.year}
          </span>
        </div>
        <h1 className="mt-4 font-display text-4xl md:text-6xl font-semibold tracking-tight">
          {project.title}
        </h1>
        <p className="mt-4 text-lg text-foreground-muted max-w-2xl">
          {project.tagline}
        </p>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <GlassPanel className="p-6">
          <h2 className="font-display text-lg font-semibold">Problem</h2>
          <p className="mt-2 text-sm text-foreground-muted leading-relaxed">
            {project.problem}
          </p>
        </GlassPanel>
        <GlassPanel className="p-6">
          <h2 className="font-display text-lg font-semibold">Approach</h2>
          <p className="mt-2 text-sm text-foreground-muted leading-relaxed">
            {project.approach}
          </p>
        </GlassPanel>
      </div>

      <GlassPanel className="mt-6 p-6">
        <h2 className="font-display text-lg font-semibold">Tech stack</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span key={s} className="chip font-mono text-foreground">
              {s}
            </span>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel className="mt-6 p-6">
        <h2 className="font-display text-lg font-semibold">Impact</h2>
        <ul className="mt-3 space-y-2">
          {project.impact.map((line) => (
            <li key={line} className="flex gap-3 text-sm text-foreground">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-400 shrink-0" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </GlassPanel>
    </article>
  );
}
