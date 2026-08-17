"use client";

import { useEffect, useRef } from "react";
import styles from "@/app/page.module.css";

const STEP_MS = 520;

export default function ExperienceReveal({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = [...el.querySelectorAll<HTMLElement>(`.${styles.expItem}`)];
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const setLineTo = (index: number, complete = false) => {
      if (complete) {
        el.style.setProperty("--exp-progress", "1");
        return;
      }

      const node = items[index]?.querySelector<HTMLElement>(`.${styles.expNode}`);
      if (!node) return;

      const track = el.getBoundingClientRect();
      const point = node.getBoundingClientRect();
      const y = point.top + point.height / 2 - track.top;
      const progress = Math.min(1, Math.max(0, y / track.height));
      el.style.setProperty("--exp-progress", progress.toFixed(4));
    };

    const activateAll = () => {
      el.classList.add(styles.expVisible);
      items.forEach((item) => item.classList.add(styles.expActive));
      el.style.setProperty("--exp-progress", "1");
    };

    if (motion.matches) {
      activateAll();
      return;
    }

    el.classList.add(styles.expReady);
    el.style.setProperty("--exp-progress", "0");

    const timers: number[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add(styles.expVisible);

        items.forEach((item, index) => {
          timers.push(
            window.setTimeout(() => {
              item.classList.add(styles.expActive);
              setLineTo(index, index === items.length - 1);
            }, 160 + index * STEP_MS),
          );
        });

        observer.disconnect();
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <div className={styles.expTrack} ref={ref}>
      {children}
    </div>
  );
}
