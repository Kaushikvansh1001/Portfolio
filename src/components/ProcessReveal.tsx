"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { process } from "@/data/resume";
import { ProcessIcon } from "@/components/Icons";
import styles from "@/app/page.module.css";

const HOLD = 4800;
const PATH =
  "M 50 120 C 140 40 180 200 230 120 S 360 40 410 120 S 540 200 590 120 S 720 40 770 120 S 900 200 950 120";
const VIEW_W = 1000;
const VIEW_H = 220;

export default function ProcessReveal() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const [length, setLength] = useState(0);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const active = process[index];
  const progress = process.length > 1 ? index / (process.length - 1) : 0;

  const go = (next: number) => {
    const wrapped = (next + process.length) % process.length;
    if (wrapped === index) return;
    const forward = (wrapped - index + process.length) % process.length;
    setDir(forward <= process.length / 2 ? 1 : -1);
    setIndex(wrapped);
  };

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const measure = () => {
      const total = path.getTotalLength();
      setLength(total);
      setPoints(
        process.map((_, itemIndex) => {
          const point = path.getPointAtLength(
            (itemIndex / Math.max(1, process.length - 1)) * total,
          );
          return { x: point.x, y: point.y };
        }),
      );
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (paused || process.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => go(index + 1), HOLD);
    return () => window.clearInterval(timer);
  }, [paused, index]);

  const orb = points[index] ?? { x: 50, y: 120 };

  return (
    <div
      className={styles.processShow}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.processHead}>
        <p className={styles.kicker}>How I Work</p>
        <h2 className={styles.sectionTitle}>My Work Process</h2>
      </div>

      <div className={styles.processFlow} aria-label="Work process steps">
        <svg
          className={styles.processSvg}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          fill="none"
          aria-hidden="true"
        >
          <path className={styles.processTrackLine} d={PATH} />
          <path
            className={styles.processDrawLine}
            d={PATH}
            ref={pathRef}
            style={
              {
                strokeDasharray: length || 1,
                strokeDashoffset: length ? length * (1 - progress) : 1,
              } as CSSProperties
            }
          />
        </svg>

        {points.length ? (
          <span
            className={styles.processOrb}
            style={{
              left: `${(orb.x / VIEW_W) * 100}%`,
              top: `${(orb.y / VIEW_H) * 100}%`,
            }}
          />
        ) : null}

        {points.map((point, itemIndex) => {
          const step = process[itemIndex];
          const on = itemIndex === index;
          const done = itemIndex < index;

          return (
            <button
              className={`${styles.processStation} ${on ? styles.processStationOn : ""} ${done ? styles.processStationDone : ""}`}
              type="button"
              key={step.number}
              aria-current={on ? "step" : undefined}
              aria-label={`${step.number} ${step.title}`}
              onClick={() => go(itemIndex)}
              style={{
                left: `${(point.x / VIEW_W) * 100}%`,
                top: `${(point.y / VIEW_H) * 100}%`,
              }}
            >
              <span className={styles.processStationIcon}>
                <ProcessIcon name={step.icon} />
              </span>
              <span className={styles.processStationName}>{step.title}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.processCaption} key={active.number} data-dir={dir}>
        <span className={styles.processCaptionNum}>{active.number}</span>
        <div>
          <h3>{active.title}</h3>
          <p>{active.description}</p>
        </div>
      </div>
    </div>
  );
}
