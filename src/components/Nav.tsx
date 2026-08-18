"use client";

import { useEffect, useState } from "react";
import { IconArrow, IconMoon, IconSun } from "@/components/Icons";
import { useTheme } from "@/components/ThemeProvider";
import styles from "@/app/page.module.css";

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
];

export default function Nav() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`${styles.nav} ${scrolled ? styles.navScrolled : ""} ${open ? styles.navOpen : ""}`}
    >
      <div className={styles.navBar}>
        <nav className={styles.navLinks} aria-label="Primary">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.navEnd}>
          <button
            type="button"
            className={styles.themeBtn}
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
            }
          >
            {theme === "dark" ? <IconSun /> : <IconMoon />}
          </button>
          <a className={styles.navCta} href="#contact" onClick={() => setOpen(false)}>
            <span className={styles.navCtaText}>Get in Touch</span>
            <span className={styles.navCtaIcon} aria-hidden="true">
              <IconArrow />
            </span>
          </a>
          <button
            type="button"
            className={styles.menuBtn}
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <nav className={styles.navMobile} aria-label="Mobile">
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
