"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/page.module.css";

type Stat = {
  value: string;
  suffix: string;
  label: string;
};

function displayValue(target: string, current: number) {
  const decimals = target.includes(".") ? 1 : 0;
  return current.toFixed(decimals);
}

export default function StatSheet({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  const [counts, setCounts] = useState(() => stats.map(() => 1));

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setOn(true);
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!on) return;

    const targets = stats.map((stat) => Number(stat.value));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCounts(targets);
      return;
    }

    const start = performance.now();
    const duration = 1400;
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setCounts(targets.map((target) => 1 + (target - 1) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [on, stats]);

  return (
    <section
      className={styles.statSheet}
      ref={ref}
      aria-label="Experience snapshot"
    >
      {stats.map((stat, index) => (
        <div className={styles.statRow} key={stat.label}>
          <p className={styles.statLabel}>{stat.label}</p>
          <p className={styles.statValue}>
            {displayValue(stat.value, counts[index] ?? 1)}
            <span>{stat.suffix}</span>
          </p>
        </div>
      ))}
    </section>
  );
}
