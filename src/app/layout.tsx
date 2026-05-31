import type { Metadata } from "next";
import { Inter, Architects_Daughter, Bangers, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ui/scroll-progress";
import CommandPalette from "@/components/ui/command-palette";
import { siteUrl, siteConfig } from "@/lib/site";

// Comic-strip type system (Direction A · Comic Strip) — per the brief,
// "bold comic display + clean sans body":
//   sans  — Inter               → body copy, the clean readable voice
//   boom  — Bangers             → display / headlines, the bold inked shout
//   scrawl— Architects Daughter → annotations, eyebrows, sketchy captions (used sparingly)
//   mono  — JetBrains Mono       → chips, terminal, data readouts
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const boom = Bangers({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-boom",
  display: "swap",
});

const scrawl = Architects_Daughter({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-scrawl",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: "%s · Samarth Kapoor",
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${sans.variable} ${boom.variable} ${scrawl.variable} ${jetbrains.variable}`}
    >
      <head>
        {/* Set theme before paint to prevent FOUC. Paper daylight is the default. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen overflow-x-hidden">
        <CommandPalette>
          <ScrollProgress />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CommandPalette>
      </body>
    </html>
  );
}
