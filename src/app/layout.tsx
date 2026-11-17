import type { Metadata } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Sora, Syne } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VANSHVERSE | Vansh Kaushik — Software Development Engineer",
  description:
    "Portfolio of Vansh Kaushik — Python Developer and Back-End Developer building APIs, database-driven systems, and production deployments.",
  icons: {
    icon: [{ url: "/favicon_new.png", type: "image/png" }],
    apple: "/favicon_new.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${sora.variable} ${syne.variable} ${jetbrains.variable} ${cormorant.variable}`}
    >
      <body className="bg-void font-sans text-ivory antialiased">{children}</body>
    </html>
  );
}
