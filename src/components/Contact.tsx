"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassPanel from "@/components/ui/GlassPanel";
import Button from "@/components/ui/Button";
import { Github, Linkedin, Mail, Send, CheckCircle2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export default function Contact() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof typeof data;
        next[k] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setPending(true);
    await new Promise((r) => setTimeout(r, 900));
    setPending(false);
    setSent(true);
    e.currentTarget.reset();
  };

  return (
    <section id="contact" className="container-prose py-24 md:py-32">
      <SectionHeading
        eyebrow="Contact"
        title="Let's build something."
        description="Open to AI and fintech product roles, collaborations, and interesting problems. Drop a message or reach out directly."
        align="center"
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-5">
        {/* Direct channels */}
        <GlassPanel className="lg:col-span-2 p-6 md:p-8 rounded-xl spidey-sense">
          <h3 className="font-display text-2xl tracking-wide text-foreground">Reach the desk</h3>
          <p className="mt-1 font-scrawl text-base text-foreground-subtle">
            The fastest ways to reach me.
          </p>

          <div className="mt-6 space-y-3">
            <ContactRow icon={Mail} label="kapoorsammy05@gmail.com" href="mailto:kapoorsammy05@gmail.com" />
            <ContactRow icon={Linkedin} label="LinkedIn" href="https://linkedin.com/" />
            <ContactRow icon={Github} label="GitHub" href="https://github.com/" />
          </div>
        </GlassPanel>

        {/* Form */}
        <GlassPanel className="lg:col-span-3 p-6 md:p-8 rounded-xl">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center py-16"
            >
              <CheckCircle2 className="h-12 w-12 text-primary-400" />
              <h3 className="mt-5 text-lg font-semibold text-foreground">Message sent</h3>
              <p className="mt-2 text-sm text-foreground-muted leading-relaxed max-w-sm">
                Thanks for reaching out — I&apos;ll get back to you soon.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <Field name="name" label="Name" placeholder="Ada Lovelace" error={errors.name} />
              <Field
                name="email"
                label="Email"
                type="email"
                placeholder="ada@example.com"
                error={errors.email}
              />
              <Field
                name="message"
                label="Message"
                placeholder="Tell me about the role or project…"
                textarea
                error={errors.message}
              />

              <div className="flex items-center justify-between gap-4 pt-2">
                <span className="text-xs text-foreground-subtle">
                  Usually replies within a day.
                </span>
                <Button type="submit" variant="primary" disabled={pending} className="gap-2">
                  {pending ? "Sending…" : "Send message"} <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          )}
        </GlassPanel>
      </div>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="group flex items-center gap-3 rounded-[10px_12px_9px_13px] border-2 border-foreground bg-background-elevated
                 px-4 py-3 shadow-ink-sm hover:-translate-y-0.5 hover:shadow-ink transition-all focus-ring"
    >
      <span className="rounded-md border-2 border-foreground p-2 group-hover:bg-primary-500 transition-colors">
        <Icon className="h-4 w-4 text-foreground group-hover:text-white transition-colors" />
      </span>
      <span className="text-base text-foreground-muted group-hover:text-foreground transition-colors">
        {label}
      </span>
    </a>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
  textarea,
  error,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  error?: string;
}) {
  const baseCls =
    "w-full rounded-[10px] border-2 border-foreground bg-background-elevated px-4 py-2.5 text-base font-sans " +
    "text-foreground placeholder:text-foreground-subtle/60 " +
    "focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 " +
    "transition-all";
  return (
    <label className="block">
      <span className="font-scrawl text-base text-foreground-muted mb-1.5 block">{label}</span>
      {textarea ? (
        <textarea name={name} rows={4} placeholder={placeholder} className={baseCls} />
      ) : (
        <input name={name} type={type} placeholder={placeholder} className={baseCls} />
      )}
      {error && (
        <span className="mt-1.5 text-xs text-accent-danger block">{error}</span>
      )}
    </label>
  );
}
