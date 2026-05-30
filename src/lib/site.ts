/**
 * Canonical site URL, resolved in priority order:
 *  1. NEXT_PUBLIC_SITE_URL  — set this to your production domain on Vercel
 *  2. VERCEL_URL            — auto-set on Vercel (preview + prod) deployments
 *  3. localhost             — local dev fallback
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

export const siteConfig = {
  name: "Samarth Kapoor",
  title: "Samarth Kapoor — AI Product Manager · Data Science · Fintech",
  description:
    "Portfolio of Samarth Kapoor — AI Product Manager building data-driven financial products at the intersection of AI, fintech, and product strategy.",
};
