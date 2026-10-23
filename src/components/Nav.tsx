"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { IconArrow } from "@/components/Icons";
import { profile } from "@/data/resume";
import styles from "@/app/page.module.css";

const links = [
  { href: "#portfolio", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#experience", label: "Experience" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;

      if (y < 24) {
        setCompact(false);
      } else if (delta > 6) {
        setCompact(true);
        setOpen(false);
      } else if (delta < -6) {
        setCompact(false);
      }

      lastY = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`${styles.nav} ${compact ? styles.navScrolled : ""} ${open ? styles.navOpen : ""}`}
    >
      <div className={styles.navBar}>
        <a className={styles.navBrand} href="#home" onClick={() => setOpen(false)}>
          <span className={styles.navAvatar}>
            <Image
              src="/vansh-portrait.png"
              alt=""
              width={72}
              height={72}
            />
          </span>
          <span className={styles.navName}>{profile.firstName}</span>
        </a>

        <nav className={styles.navLinks} aria-label="Primary">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.navEnd}>
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
