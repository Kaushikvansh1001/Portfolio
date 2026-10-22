"use client";

import { useCallback, useEffect, useState } from "react";
import { profile } from "@/data/resume";
import styles from "@/app/page.module.css";

export default function IntroScreen() {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");
  const [progress, setProgress] = useState(1);

  const dismiss = useCallback(() => {
    setPhase((current) => (current === "in" ? "out" : current));
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setProgress(100);
      const skip = window.setTimeout(dismiss, 280);
      return () => {
        window.clearTimeout(skip);
        document.body.style.overflow = previousOverflow;
      };
    }

    const duration = 3200;
    const start = performance.now();
    let frame = 0;
    let finish = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
      const value = Math.max(1, Math.min(100, Math.round(eased * 100)));
      setProgress(value);

      if (t < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }

      finish = window.setTimeout(dismiss, 280);
    };

    frame = requestAnimationFrame(tick);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(finish);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [dismiss]);

  useEffect(() => {
    if (phase !== "out") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const exit = window.setTimeout(() => setPhase("done"), reduced ? 80 : 720);
    return () => window.clearTimeout(exit);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={`${styles.intro} ${phase === "out" ? styles.introOut : ""}`}
      role="status"
      aria-label="Loading portfolio"
      aria-valuemin={1}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div className={styles.introInner}>
        <p className={styles.introName}>{profile.name}</p>
        <div className={styles.introWordWrap}>
          <p className={styles.introWord} aria-hidden="true">
            portfolio
          </p>
          <p className={styles.introWord}>portfolio</p>
        </div>
        <div className={styles.introLoad}>
          <div className={styles.introTrack}>
            <div className={styles.introFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.introCount}>{progress}</span>
        </div>
      </div>
    </div>
  );
}
