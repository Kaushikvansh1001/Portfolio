"use client";

import { useEffect, useRef } from "react";
import styles from "@/app/page.module.css";

export default function HeroScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 901px)");

    let frame = 0;

    const update = () => {
      frame = 0;

      if (motion.matches || !desktop.matches) {
        section.style.setProperty("--hero-rise", "1");
        pin.classList.remove(styles.heroPinned, styles.heroReleased);
        return;
      }

      const total = section.offsetHeight - window.innerHeight;
      const top = section.getBoundingClientRect().top;
      const progress = total > 8 ? Math.min(1, Math.max(0, -top / total)) : 1;
      section.style.setProperty("--hero-rise", progress.toFixed(4));

      pin.classList.toggle(styles.heroPinned, top <= 0 && progress < 1);
      pin.classList.toggle(styles.heroReleased, progress >= 1);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    desktop.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      desktop.removeEventListener("change", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className={styles.hero} id="home" ref={sectionRef}>
      <div className={styles.heroPin} ref={pinRef}>
        {children}
      </div>
    </section>
  );
}
