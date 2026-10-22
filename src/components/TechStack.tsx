"use client";

import { useEffect, useMemo, useState } from "react";
import { techCategories, technologies } from "@/data/resume";
import { TechLogo } from "@/components/TechLogos";
import styles from "@/app/page.module.css";

const filters = [{ id: "all" as const, label: "All" }, ...techCategories];

export default function TechStack() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [index, setIndex] = useState(0);
  const [clock, setClock] = useState(0);
  const [paused, setPaused] = useState(false);

  const items = useMemo(
    () =>
      filter === "all"
        ? [...technologies]
        : technologies.filter((tech) => tech.category === filter),
    [filter],
  );

  useEffect(() => {
    setIndex(0);
  }, [filter]);

  useEffect(() => {
    if (paused || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [filter, items.length, clock, paused]);

  const select = (next: number) => {
    setIndex(next);
    setClock((value) => value + 1);
  };

  const active = items[index] ?? items[0];
  if (!active) return null;

  const category =
    techCategories.find((item) => item.id === active.category)?.label ?? "";

  return (
    <div className={styles.techStack}>
      <div className={styles.techHead}>
        <h2 className={styles.techTitle}>
          My Skill
          <span>Toolkit</span>
        </h2>
        <div className={styles.techFilters} role="tablist" aria-label="Skill filters">
          {filters.map((item) => (
            <button
              className={`${styles.techFilter} ${filter === item.id ? styles.techFilterOn : ""}`}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              key={item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={styles.techStage}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className={styles.techFeatured}>
          <div className={styles.techHeroIcon} key={active.logo}>
            <TechLogo name={active.logo} />
          </div>
          <p className={styles.techKicker}>{category}</p>
          <h3 className={styles.techName}>{active.name}</h3>
          <p className={styles.techBlurb}>{active.blurb}</p>
          <div className={styles.techProgress}>
            <span>
              {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
            <i>
              <b style={{ width: `${((index + 1) / items.length) * 100}%` }} />
            </i>
          </div>
        </div>

        <div className={styles.techGrid}>
          {items.map((tech, itemIndex) => (
            <button
              className={`${styles.techTile} ${itemIndex === index ? styles.techTileOn : ""}`}
              type="button"
              key={tech.name}
              onClick={() => select(itemIndex)}
            >
              <span className={styles.techTileIcon}>
                <TechLogo name={tech.logo} />
              </span>
              <strong>{tech.name}</strong>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
