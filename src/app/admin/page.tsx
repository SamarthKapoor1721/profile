"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Lock, Plus, Pencil, Trash2, Save, X, Upload, LogOut,
  FolderGit2, Briefcase, BadgeCheck, Loader2, AlertTriangle, FileText,
} from "lucide-react";

const isPdf = (src: string) => src.toLowerCase().endsWith(".pdf");

type ContentType = "projects" | "experience" | "certifications";
type FieldKind = "text" | "textarea" | "stringlist" | "select" | "image" | "links";
type Field = {
  name: string;
  label: string;
  kind: FieldKind;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  help?: string;
};

const TABS: { type: ContentType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { type: "projects", label: "Projects", icon: FolderGit2 },
  { type: "experience", label: "Experience", icon: Briefcase },
  { type: "certifications", label: "Certifications", icon: BadgeCheck },
];

const FIELDS: Record<ContentType, Field[]> = {
  projects: [
    { name: "title", label: "Title", kind: "text", required: true },
    { name: "slug", label: "Slug", kind: "text", required: true, placeholder: "my-project", help: "URL id, lowercase-with-dashes" },
    { name: "tagline", label: "Tagline", kind: "text" },
    { name: "category", label: "Category", kind: "text", placeholder: "FinTech" },
    { name: "year", label: "Year", kind: "text", placeholder: "2026" },
    { name: "problem", label: "Problem", kind: "textarea" },
    { name: "approach", label: "Approach", kind: "textarea" },
    { name: "stack", label: "Tech stack", kind: "stringlist", help: "One item per line" },
    { name: "impact", label: "Impact", kind: "stringlist", help: "One bullet per line" },
    { name: "image", label: "Thumbnail (optional)", kind: "image" },
    { name: "links", label: "Links", kind: "links" },
  ],
  experience: [
    { name: "role", label: "Role", kind: "text", required: true },
    { name: "org", label: "Organization", kind: "text", required: true },
    { name: "period", label: "Period", kind: "text", placeholder: "2025 — Present" },
    { name: "type", label: "Type", kind: "select", options: ["work", "project", "education"] },
    { name: "summary", label: "Summary", kind: "textarea" },
    { name: "highlights", label: "Highlights", kind: "stringlist", help: "One bullet per line" },
  ],
  certifications: [
    { name: "name", label: "Name", kind: "text", required: true },
    { name: "issuer", label: "Issuer", kind: "text", required: true },
    { name: "date", label: "Date", kind: "text", placeholder: "2025-02", help: "Format YYYY-MM" },
    { name: "category", label: "Category", kind: "select", options: ["AI", "Fintech", "Data", "Product"] },
    { name: "credentialUrl", label: "Credential URL", kind: "text", placeholder: "https://… or #" },
    { name: "image", label: "Image or PDF", kind: "image", required: true, help: "Upload a screenshot/image or the Coursera PDF certificate" },
  ],
};

const DEFAULTS: Record<ContentType, () => Record<string, unknown>> = {
  projects: () => ({ title: "", slug: "", tagline: "", category: "", year: "", problem: "", approach: "", stack: [], impact: [], links: {} }),
  experience: () => ({ role: "", org: "", period: "", type: "work", summary: "", highlights: [] }),
  certifications: () => ({ name: "", issuer: "", date: "", category: "AI", credentialUrl: "#", image: "" }),
};

const labelFor = (type: ContentType, item: Record<string, unknown>) =>
  type === "experience" ? `${item.role} — ${item.org}` : String(item.title ?? item.name ?? "Untitled");

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_pw");
    if (saved) {
      setPassword(saved);
      setAuthed(true);
    }
  }, []);

  if (!authed) {
    return <Login onLogin={(pw) => { sessionStorage.setItem("admin_pw", pw); setPassword(pw); setAuthed(true); }} />;
  }
  return <Dashboard password={password} onLogout={() => { sessionStorage.removeItem("admin_pw"); setAuthed(false); setPassword(""); }} />;
}

function Login({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    // Validate by hitting a read endpoint with the password.
    const res = await fetch("/api/admin/projects", { headers: { "x-admin-password": pw } });
    setBusy(false);
    if (res.ok) onLogin(pw);
    else setErr("Incorrect password.");
  };

  return (
    <main className="min-h-screen grid place-items-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm glass-strong rounded-xl p-8">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary-500/15 border border-primary-500/30">
          <Lock className="h-5 w-5 text-primary-400" />
        </div>
        <h1 className="mt-5 font-display text-xl font-semibold">Admin access</h1>
        <p className="mt-1 text-sm text-foreground-subtle">Enter your admin password to manage content.</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoFocus
          placeholder="Password"
          className="mt-5 w-full rounded-lg border border-border-soft bg-background/50 px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20"
        />
        {err && <p className="mt-2 text-xs text-accent-danger">{err}</p>}
        <button
          type="submit"
          disabled={busy || !pw}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 text-background font-semibold py-2.5 text-sm hover:bg-primary-400 transition-colors disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Unlock
        </button>
      </form>
    </main>
  );
}

function Dashboard({ password, onLogout }: { password: string; onLogout: () => void }) {
  const [type, setType] = useState<ContentType>("projects");
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ index: number | null; data: Record<string, unknown> } | null>(null);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  const headers = useCallback(
    (json = false) => ({
      "x-admin-password": password,
      ...(json ? { "Content-Type": "application/json" } : {}),
    }),
    [password],
  );

  const load = useCallback(async (t: ContentType) => {
    setLoading(true);
    const res = await fetch(`/api/admin/${t}`, { headers: { "x-admin-password": password } });
    const data = await res.json().catch(() => ({}));
    setItems(res.ok ? data.items ?? [] : []);
    setLoading(false);
  }, [password]);

  useEffect(() => { load(type); setEditing(null); }, [type, load]);

  const flash = (kind: "ok" | "err", msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const save = async () => {
    if (!editing) return;
    const isNew = editing.index === null;
    const res = await fetch(`/api/admin/${type}`, {
      method: isNew ? "POST" : "PUT",
      headers: headers(true),
      body: JSON.stringify(isNew ? editing.data : { index: editing.index, item: editing.data }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setItems(data.items);
      setEditing(null);
      flash("ok", isNew ? "Added — saved to data file." : "Updated.");
    } else {
      flash("err", data.error ?? "Save failed.");
    }
  };

  const remove = async (index: number) => {
    if (!confirm("Delete this item? This rewrites the data file.")) return;
    const res = await fetch(`/api/admin/${type}?index=${index}`, { method: "DELETE", headers: headers() });
    const data = await res.json().catch(() => ({}));
    if (res.ok) { setItems(data.items); flash("ok", "Deleted."); }
    else flash("err", data.error ?? "Delete failed.");
  };

  return (
    <main className="min-h-screen container-prose py-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Content admin</h1>
          <p className="mt-1 text-sm text-foreground-subtle">
            Edits write to <span className="font-mono">src/data/*.json</span> — commit &amp; push to publish.
          </p>
        </div>
        <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-lg border border-border-soft px-3 py-2 text-sm text-foreground-muted hover:text-foreground hover:border-foreground/20 transition-colors">
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-2 border-b border-border-soft">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = t.type === type;
          return (
            <button
              key={t.type}
              onClick={() => setType(t.type)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors ${
                active ? "border-primary-500 text-foreground" : "border-transparent text-foreground-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid lg:grid-cols-5 gap-8">
        {/* List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground-muted">{items.length} item{items.length === 1 ? "" : "s"}</h2>
            <button
              onClick={() => setEditing({ index: null, data: DEFAULTS[type]() })}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500 text-background font-semibold px-3 py-1.5 text-sm hover:bg-primary-400 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add new
            </button>
          </div>

          <ul className="mt-4 space-y-2">
            {loading && <li className="text-sm text-foreground-subtle flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</li>}
            {!loading && items.map((item, i) => (
              <li
                key={i}
                className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors ${
                  editing?.index === i ? "border-primary-500/50 bg-primary-500/5" : "border-border-soft hover:border-foreground/15"
                }`}
              >
                <span className="min-w-0 text-sm text-foreground truncate">{labelFor(type, item)}</span>
                <span className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setEditing({ index: i, data: structuredClone(item) })} className="p-1.5 rounded-md text-foreground-muted hover:text-primary-400 hover:bg-foreground/5" aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(i)} className="p-1.5 rounded-md text-foreground-muted hover:text-accent-danger hover:bg-foreground/5" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </span>
              </li>
            ))}
            {!loading && items.length === 0 && (
              <li className="text-sm text-foreground-subtle">Nothing yet — add your first item.</li>
            )}
          </ul>
        </div>

        {/* Editor */}
        <div className="lg:col-span-3">
          {editing ? (
            <Editor
              type={type}
              data={editing.data}
              isNew={editing.index === null}
              onChange={(data) => setEditing((e) => (e ? { ...e, data } : e))}
              onSave={save}
              onCancel={() => setEditing(null)}
              password={password}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-border-soft p-10 text-center text-sm text-foreground-subtle">
              Select an item to edit, or add a new one.
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm shadow-lg ${
          toast.kind === "ok" ? "bg-primary-500 text-background" : "bg-accent-danger text-white"
        }`}>
          {toast.kind === "err" && <AlertTriangle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}
    </main>
  );
}

function Editor({
  type, data, isNew, onChange, onSave, onCancel, password,
}: {
  type: ContentType;
  data: Record<string, unknown>;
  isNew: boolean;
  onChange: (d: Record<string, unknown>) => void;
  onSave: () => void;
  onCancel: () => void;
  password: string;
}) {
  const set = (name: string, value: unknown) => onChange({ ...data, [name]: value });

  return (
    <div className="rounded-xl border border-border-soft bg-background-elevated/40 p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">{isNew ? "Add" : "Edit"} {type.slice(0, -1)}</h3>
        <button onClick={onCancel} className="p-1.5 rounded-md text-foreground-muted hover:text-foreground hover:bg-foreground/5" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {FIELDS[type].map((f) => (
          <FieldInput key={f.name} field={f} value={data[f.name]} onChange={(v) => set(f.name, v)} password={password} />
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button onClick={onSave} className="inline-flex items-center gap-2 rounded-lg bg-primary-500 text-background font-semibold px-4 py-2.5 text-sm hover:bg-primary-400 transition-colors">
          <Save className="h-4 w-4" /> {isNew ? "Add item" : "Save changes"}
        </button>
        <button onClick={onCancel} className="rounded-lg border border-border-soft px-4 py-2.5 text-sm text-foreground-muted hover:text-foreground transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-border-soft bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle/60 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20";

function FieldInput({
  field, value, onChange, password,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
  password: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground-muted">
        {field.label}{field.required && <span className="text-accent-danger"> *</span>}
      </span>
      {field.help && <span className="block text-xs text-foreground-subtle mt-0.5">{field.help}</span>}
      <div className="mt-1.5">
        {field.kind === "text" && (
          <input className={inputCls} value={String(value ?? "")} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
        )}
        {field.kind === "textarea" && (
          <textarea className={inputCls} rows={3} value={String(value ?? "")} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
        )}
        {field.kind === "stringlist" && (
          <textarea
            className={`${inputCls} font-mono`}
            rows={4}
            value={Array.isArray(value) ? (value as string[]).join("\n") : ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
          />
        )}
        {field.kind === "select" && (
          <select className={inputCls} value={String(value ?? field.options?.[0] ?? "")} onChange={(e) => onChange(e.target.value)}>
            {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        )}
        {field.kind === "image" && (
          <ImageField value={String(value ?? "")} onChange={onChange} password={password} />
        )}
        {field.kind === "links" && (
          <LinksField value={(value as Record<string, string>) ?? {}} onChange={onChange} />
        )}
      </div>
    </label>
  );
}

function LinksField({ value, onChange }: { value: Record<string, string>; onChange: (v: unknown) => void }) {
  const set = (k: string, v: string) => {
    const next = { ...value };
    if (v) next[k] = v; else delete next[k];
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {(["demo", "github", "paper"] as const).map((k) => (
        <input key={k} className={inputCls} placeholder={`${k} URL`} value={value[k] ?? ""} onChange={(e) => set(k, e.target.value)} />
      ))}
    </div>
  );
}

function ImageField({ value, onChange, password }: { value: string; onChange: (v: unknown) => void; password: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const upload = async (file: File) => {
    setBusy(true); setErr("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", headers: { "x-admin-password": password }, body: fd });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) onChange(data.path);
    else setErr(data.error ?? "Upload failed.");
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        {value ? (
          isPdf(value) ? (
            <a href={value} target="_blank" rel="noreferrer" className="grid h-16 w-24 place-items-center gap-0.5 rounded-md border border-border-soft bg-background shrink-0 hover:border-primary-500/40 transition-colors">
              <FileText className="h-5 w-5 text-primary-400" />
              <span className="text-[10px] text-foreground-subtle">PDF</span>
            </a>
          ) : (
            <div className="relative h-16 w-24 overflow-hidden rounded-md border border-border-soft bg-background shrink-0">
              <Image src={value} alt="preview" fill unoptimized className="object-cover" />
            </div>
          )
        ) : (
          <div className="grid h-16 w-24 place-items-center rounded-md border border-dashed border-border-soft text-foreground-subtle shrink-0">
            <span className="text-xs">none</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg border border-border-soft px-3 py-2 text-sm text-foreground-muted hover:text-foreground hover:border-foreground/20 transition-colors disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }}
        />
      </div>
      <input className={`${inputCls} mt-2 font-mono text-xs`} placeholder="/images/… or /images/uploads/cert.pdf" value={value} onChange={(e) => onChange(e.target.value)} />
      {err && <p className="mt-1 text-xs text-accent-danger">{err}</p>}
    </div>
  );
}
