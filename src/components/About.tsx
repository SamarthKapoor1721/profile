"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassPanel from "@/components/ui/GlassPanel";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const radarData = [
  { axis: "AI / Agents", score: 90 },
  { axis: "Data Systems", score: 86 },
  { axis: "ML / NLP", score: 80 },
  { axis: "Payments", score: 84 },
  { axis: "Quant Models", score: 82 },
  { axis: "Product", score: 88 },
];

const pillars = [
  {
    title: "Metrics-driven PM",
    body: "Every product decision starts from a hypothesis and ends with a measured outcome. Assumptions are explicit and stress-tested.",
  },
  {
    title: "Capital mechanics",
    body: "Hands-on across payment rails, order books, and clearing systems — comfortable reading API logs and ledger states.",
  },
  {
    title: "Builder by default",
    body: "I ship. LLM evaluation frameworks, real-time analytics, and forecasting models — prototyped and deployed quickly.",
  },
];

export default function About() {
  return (
    <section id="about" className="container-prose py-24 md:py-32">
      <SectionHeading
        eyebrow="About"
        title="Working at the seam of AI and finance."
        description="I focus on the intersection of machine learning, high-volume data systems, and fintech infrastructure — from payments networks to agentic ML pipelines and the product strategy that ties them together."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-5">

        {/* Profile + bio */}
        <GlassPanel className="lg:col-span-3 p-6 md:p-8 rounded-xl">
          <div className="flex flex-col sm:flex-row gap-6">
            <Portrait />

            <div className="flex-1 min-w-0 flex flex-col">
              <span className="label-mono text-primary-400">Profile</span>
              <p className="mt-4 text-sm text-foreground-muted leading-relaxed">
                A developer who also manages product. I bridge machine-learning
                systems and financial infrastructure — designing robust LLM
                evaluation pipelines, deploying cash-flow forecasting models, and
                mapping the rails money moves across. I&apos;d rather measure than
                guess: every parameter gets tracked and optimized.
              </p>

              <dl className="mt-6 border-t border-border-soft pt-4 grid grid-cols-2 gap-x-4 gap-y-3 font-mono text-xs">
                <Meta k="Role" v="AI PM · Research" />
                <Meta k="Focus" v="Fintech · ML" />
                <Meta k="Based" v="India · Remote" />
                <Meta k="Status" v="Open to roles" accent />
              </dl>
            </div>
          </div>

          {/* Pillars */}
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="rounded-lg p-4 border border-border-soft bg-background/40 hover:border-primary-500/30 transition-colors"
              >
                <div className="text-sm font-semibold text-foreground">
                  {p.title}
                </div>
                <p className="mt-2 text-xs text-foreground-muted leading-relaxed">
                  {p.body}
                </p>
              </motion.div>
            ))}
          </div>
        </GlassPanel>

        {/* Capability radar */}
        <GlassPanel className="lg:col-span-2 p-6 md:p-8 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="label-mono text-primary-400">Capabilities</span>
            <span className="chip">self-assessed</span>
          </div>

          <div className="mt-4 h-[280px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="rgb(var(--border-soft))" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: "rgb(var(--fg-muted))", fontSize: 11, fontFamily: "var(--font-inter)" }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  dataKey="score"
                  stroke="rgb(var(--primary-500))"
                  fill="rgb(var(--primary-500))"
                  fillOpacity={0.18}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}

function Meta({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div>
      <span className="text-foreground-subtle">{k}: </span>
      <span className={accent ? "text-primary-400" : "text-foreground"}>{v}</span>
    </div>
  );
}

function Portrait() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative shrink-0 w-full sm:w-44 group mx-auto sm:mx-0"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border-soft bg-background/80">
        <Image
          src="/images/passport_photo.jpeg"
          alt="Samarth Kapoor"
          fill
          sizes="(min-width: 768px) 176px, 70vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
      </div>
      <div className="mt-3 text-center sm:text-left">
        <div className="font-display text-sm font-semibold text-foreground">
          Samarth Kapoor
        </div>
        <div className="mt-0.5 text-xs text-foreground-subtle">
          AI Product Manager
        </div>
      </div>
    </motion.div>
  );
}
