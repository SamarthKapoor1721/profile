"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassPanel from "@/components/ui/GlassPanel";
import { certifications, type Certification } from "@/data/certifications";
import { ExternalLink, BadgeCheck, Award, X, Download, Eye } from "lucide-react";

const formatDate = (s: string) => {
  const [y, m] = s.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[Number(m) - 1]} ${y}`;
};

const isPdf = (src: string) => src.toLowerCase().endsWith(".pdf");

export default function Certifications() {
  const [active, setActive] = useState<Certification | null>(null);

  return (
    <section id="certifications" className="container-prose py-24 md:py-32">
      <SectionHeading
        eyebrow="Certifications"
        title="Credentials & coursework."
        description="Verified technical certificates and professional programs across AI, fintech, and data. Click any credential to view it."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((c, i) => (
          <motion.div
            key={`${c.name}-${c.date}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
          >
            <GlassPanel className="p-5 h-full rounded-xl border border-border-soft hover:border-primary-500/30 transition-colors">
              {isPdf(c.image) ? (
                <CertSeal cert={c} onView={() => setActive(c)} />
              ) : (
                <button
                  onClick={() => setActive(c)}
                  className="group relative mb-4 block h-36 w-full overflow-hidden rounded-lg border border-border-soft bg-background/80"
                >
                  <Image
                    src={c.image}
                    alt={`${c.name} credential`}
                    width={1200}
                    height={675}
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <Eye className="h-4 w-4" /> View
                    </span>
                  </span>
                  {/* persistent affordance for touch (no hover) */}
                  <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-md border border-border-soft bg-background/70 text-foreground-muted md:hidden">
                    <Eye className="h-3.5 w-3.5" />
                  </span>
                </button>
              )}

              <div className="flex items-center justify-between">
                <BadgeCheck className="h-5 w-5 text-primary-400" />
                <span className="chip">{c.category}</span>
              </div>

              <h3 className="mt-4 font-sans text-base font-bold leading-snug text-foreground">
                {c.name}
              </h3>
              <p className="mt-1 text-sm text-foreground-muted">{c.issuer}</p>

              <div className="mt-5 flex items-center justify-between border-t border-border-soft pt-3 text-xs">
                <span className="font-mono text-foreground-subtle">{formatDate(c.date)}</span>
                {c.credentialUrl && c.credentialUrl !== "#" && (
                  <a
                    href={c.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary-400 hover:text-primary-500 transition-colors focus-ring"
                  >
                    Verify <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {active && <CertViewer cert={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}

/** Designed "wax seal" tile for PDF certificates — pure CSS/SVG, renders everywhere. */
function CertSeal({ cert, onView }: { cert: Certification; onView: () => void }) {
  return (
    <button
      onClick={onView}
      className="group relative mb-4 grid h-36 w-full place-items-center overflow-hidden rounded-lg border border-border-soft bg-background/80"
    >
      {/* layered background: emerald glow + fine guilloché lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgb(var(--primary-500)/0.14),transparent_70%)]" />
      <div className="absolute inset-0 opacity-[0.12] bg-[repeating-linear-gradient(45deg,rgb(var(--fg))_0_1px,transparent_1px_7px)]" />

      {/* top-left tag */}
      <span className="absolute left-2.5 top-2.5 font-mono text-[10px] uppercase tracking-widest text-foreground-subtle">
        Certificate · PDF
      </span>

      {/* concentric seal */}
      <div className="relative grid place-items-center">
        <div className="absolute h-20 w-20 rounded-full border border-dashed border-primary-500/30 transition-transform duration-700 group-hover:rotate-90" />
        <div className="absolute h-14 w-14 rounded-full border border-primary-500/25" />
        <div className="grid h-11 w-11 place-items-center rounded-full bg-primary-500/15 ring-1 ring-primary-500/40">
          <Award className="h-5 w-5 text-primary-400" />
        </div>
      </div>

      {/* shimmer sweep on hover */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary-500/15 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-full" />

      {/* hint — shown on hover, and always on touch (no hover) */}
      <span className="absolute bottom-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-foreground-muted opacity-0 transition-opacity group-hover:opacity-100 [@media(hover:none)]:opacity-100">
        <Eye className="h-3.5 w-3.5" /> View certificate
      </span>
    </button>
  );
}

/** Modal that embeds the certificate inline (native PDF viewer for PDFs, image otherwise). */
function CertViewer({ cert, onClose }: { cert: Certification; onClose: () => void }) {
  const pdf = isPdf(cert.image);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-3xl max-h-[90vh] flex-col overflow-hidden rounded-2xl glass-strong"
      >
        {/* header */}
        <div className="flex items-center justify-between gap-4 border-b border-border-soft px-5 py-3.5">
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-semibold text-foreground">{cert.name}</h3>
            <p className="truncate text-xs text-foreground-subtle">{cert.issuer} · {formatDate(cert.date)}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg border border-border-soft p-2 text-foreground-muted hover:text-foreground hover:bg-foreground/[0.06] transition-colors focus-ring"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* body */}
        <div className="min-h-0 flex-1 overflow-auto bg-background/60 p-4">
          {pdf ? (
            <iframe
              src={`${cert.image}#toolbar=0&navpanes=0&view=FitH`}
              title={cert.name}
              className="h-[70vh] w-full rounded-lg border border-border-soft bg-white"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cert.image} alt={cert.name} className="mx-auto max-h-[70vh] w-auto rounded-lg border border-border-soft" />
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border-soft px-5 py-3">
          {cert.credentialUrl && cert.credentialUrl !== "#" && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border-soft px-3.5 py-2 text-sm text-foreground-muted hover:text-foreground hover:border-foreground/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" /> Verify
            </a>
          )}
          <a
            href={cert.image}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-primary-500/40 px-3.5 py-2 text-sm text-primary-400 hover:bg-primary-500/10 transition-colors"
          >
            <Download className="h-4 w-4" /> Open {pdf ? "PDF" : "image"}
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
