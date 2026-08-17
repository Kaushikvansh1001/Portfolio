"use client";

import { useEffect, useRef, useState } from "react";
import { techCategories, technologies } from "@/data/resume";
import { TechLogo, TechTabIcon } from "@/components/TechLogos";
import styles from "@/app/page.module.css";

const RING_D =
  "M 100 6 H 158 A 36 36 0 0 1 194 42 V 158 A 36 36 0 0 1 158 194 H 42 A 36 36 0 0 1 6 158 V 42 A 36 36 0 0 1 42 6 H 100";

function SkillCard({
  name,
  logo,
  level,
  delay,
  play,
}: {
  name: string;
  logo: string;
  level: number;
  delay: number;
  play: boolean;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!play) {
      setProgress(0);
      return;
    }

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) {
      setProgress(level);
      return;
    }

    let frame = 0;
    let start: number | null = null;
    const duration = 1200;

    const wait = window.setTimeout(() => {
      const tick = (now: number) => {
        if (start === null) start = now;
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - (1 - t) ** 3;
        setProgress(level * eased);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(wait);
      cancelAnimationFrame(frame);
    };
  }, [play, level, delay]);

  return (
    <article
      className={`${styles.techCard} ${play ? styles.techCardPlay : ""}`}
      style={{ animationDelay: play ? `${delay}ms` : undefined }}
    >
      <svg className={styles.techRing} viewBox="0 0 200 200" aria-hidden="true">
        <path className={styles.techRingFace} d={RING_D} />
        <path className={styles.techRingTrack} d={RING_D} />
        <path
          className={styles.techRingFill}
          d={RING_D}
          pathLength={100}
          strokeDasharray={`${progress} 100`}
        />
      </svg>
      <div className={styles.techCardInner}>
        <span className={styles.techLogo}>
          <TechLogo name={logo} />
        </span>
        <span className={styles.techName}>{name}</span>
        <span className={styles.techLevel}>{Math.round(progress)}%</span>
      </div>
    </article>
  );
}

export default function TechStack() {
  const [active, setActive] = useState<(typeof techCategories)[number]["id"]>(
    "languages",
  );
  const [play, setPlay] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const items = technologies.filter((tech) => tech.category === active);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPlay(true);
        observer.disconnect();
      },
      { threshold: 0.22, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.techStack} ref={sectionRef}>
      <div className={styles.techIntro}>
        <p className={styles.kicker}>My Skills</p>
        <h2 className={styles.sectionTitle}>
          Technical Expertise &amp; Core Skill Set
        </h2>
        <p className={styles.techLead}>
          Backend-first development with Python, Flask, and production
          databases — plus the deployment and design tools I use to ship live
          products.
        </p>

        <div className={styles.techTabs} role="tablist" aria-label="Technology categories">
          {techCategories.map((category) => {
            const selected = category.id === active;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`${styles.techTab} ${selected ? styles.techTabActive : ""}`}
                onClick={() => setActive(category.id)}
              >
                <TechTabIcon name={category.id} />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.techGrid} key={`${active}-${play}`}>
        {items.map((tech, index) => (
          <SkillCard
            key={tech.name}
            name={tech.name}
            logo={tech.logo}
            level={tech.level}
            delay={index * 90}
            play={play}
          />
        ))}
      </div>
    </div>
  );
}
