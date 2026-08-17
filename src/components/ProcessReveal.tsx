"use client";

import { useEffect, useRef } from "react";
import styles from "@/app/page.module.css";

export default function ProcessReveal({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) {
      el.classList.add(styles.processVisible);
      return;
    }

    el.classList.add(styles.processReady);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add(styles.processVisible);
        observer.disconnect();
      },
      { threshold: 0.28, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.processTrack} ref={ref}>
      {children}
    </div>
  );
}
