import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
  website: z.string().optional(), // honeypot
});

const TO = process.env.CONTACT_TO_EMAIL || "kapoorsammy05@gmail.com";
const FROM = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // Honeypot — bots fill hidden fields. Pretend success without sending.
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, message } = parsed.data;

  // Dev-mode fallback: no API key → log + return ok so the UI flow works locally.
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[contact] RESEND_API_KEY missing — logging only. Set it to actually send.",
    );
    console.info("[contact] submission:", { name, email, message });
    return NextResponse.json({ ok: true, dev: true });
  }

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0B1020;">
      <h2 style="margin:0 0 8px;font-size:18px;">New portfolio message</h2>
      <p style="margin:0 0 16px;color:#4B5468;font-size:13px;">From your portfolio contact form.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:8px 0;color:#4B5468;width:80px;">Name</td>
          <td style="padding:8px 0;font-weight:600;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#4B5468;">Email</td>
          <td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
        </tr>
      </table>
      <div style="margin-top:16px;padding:16px;background:#F7F8FB;border-radius:8px;white-space:pre-wrap;line-height:1.55;">${escapeHtml(message)}</div>
    </div>
  `;

  // Send via Resend HTTP API
  const payload = {
    from: `Portfolio Contact <${FROM}>`,
    to: [TO],
    reply_to: email,
    subject: `Portfolio contact from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html,
  };

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    console.error("[contact] Resend error:", resp.status, body);
    return NextResponse.json(
      { error: "Failed to send. Try emailing directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
