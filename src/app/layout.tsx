import type { Metadata } from "next";
import { Anton, Great_Vibes, Manrope, Oswald, Poppins, Syne } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Vansh Kaushik | Python & Back-End Developer",
  description:
    "Portfolio of Vansh Kaushik — Python Developer and Back-End Developer building APIs, database-driven systems, and production deployments.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${greatVibes.variable} ${oswald.variable} ${anton.variable} ${manrope.variable} ${syne.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('portfolio-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}else if(window.matchMedia('(prefers-color-scheme: light)').matches){document.documentElement.setAttribute('data-theme','light');}else{document.documentElement.setAttribute('data-theme','dark');}}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`,
          }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
