import type { Metadata } from "next";
import { Great_Vibes, Sora } from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Vansh Kaushik | Software Development Engineer",
  description:
    "Portfolio of Vansh Kaushik — Python Developer and Back-End Developer building APIs, database-driven systems, and production deployments.",
  icons: {
    icon: [{ url: "/favicon_vk.png", type: "image/png" }],
    apple: "/favicon_vk.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${greatVibes.variable} ${sora.variable}`}
      data-theme="dark"
    >
      <body>{children}</body>
    </html>
  );
}
