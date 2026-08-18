"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { IconArrow, IconChevronLeft, IconChevronRight } from "@/components/Icons";
import { type Project } from "@/data/resume";
import styles from "@/app/page.module.css";

function wrapOffset(index: number, active: number, total: number) {
  let offset = index - active;
  const half = total / 2;
  if (offset > half) offset -= total;
  if (offset < -half) offset += total;
  return offset;
}

const AUTO_MS = 4200;
const INNER_MS = 2400;

function projectShots(project: Project) {
  if (project.images?.length) return project.images;
  if (project.image) return [project.image];
  return [];
}

function CoverGallery({
  project,
  playing,
}: {
  project: Project;
  playing: boolean;
}) {
  const shots = projectShots(project);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (!playing || shots.length < 2) {
      setSlide(0);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const id = window.setInterval(() => {
      setSlide((current) => (current + 1) % shots.length);
    }, INNER_MS);

    return () => window.clearInterval(id);
  }, [playing, shots.length]);

  if (!shots.length) {
    return (
      <div className={styles.coverPlaceholder} aria-hidden="true">
        <span className={styles.coverLetter}>{project.name[0]}</span>
        <span className={styles.coverWatermark}>{project.name}</span>
      </div>
    );
  }

  return (
    <>
      {shots.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`${project.name} screenshot ${index + 1}`}
          fill
          sizes="(max-width: 700px) 90vw, 768px"
          className={styles.coverImg}
          data-on={index === slide}
          priority={index === 0}
        />
      ))}
      {playing && shots.length > 1 ? (
        <div className={styles.coverDots} aria-hidden="true">
          {shots.map((src, index) => (
            <span
              key={src}
              className={styles.coverDot}
              data-on={index === slide}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}

export default function ProjectCarousel({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointer = useRef({ x: 0, dragging: false, moved: false });
  const rootRef = useRef<HTMLDivElement>(null);
  const total = projects.length;

  const go = useCallback(
    (dir: number) => {
      setActive((current) => (current + dir + total) % total);
    },
    [total],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  useEffect(() => {
    if (paused || total < 2) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    const tick = () => {
      if (document.hidden || pointer.current.dragging) return;
      go(1);
    };

    const id = window.setInterval(tick, AUTO_MS);
    return () => window.clearInterval(id);
  }, [active, paused, go, total]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointer.current = { x: event.clientX, dragging: true, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointer.current.dragging) return;
    if (Math.abs(event.clientX - pointer.current.x) > 8) {
      pointer.current.moved = true;
    }
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointer.current.dragging) return;
    const dx = event.clientX - pointer.current.x;
    pointer.current.dragging = false;
    if (Math.abs(dx) > 56) go(dx < 0 ? 1 : -1);
  };

  return (
    <div
      className={styles.coverflow}
      ref={rootRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      <button
        type="button"
        className={`${styles.coverBtn} ${styles.coverBtnPrev}`}
        onClick={() => go(-1)}
        aria-label="Previous project"
      >
        <IconChevronLeft />
      </button>

      <div
        className={styles.coverStage}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="region"
        aria-roledescription="carousel"
        aria-label="Project showcase"
      >
        {projects.map((project, index) => {
          const offset = wrapOffset(index, active, total);
          const abs = Math.abs(offset);
          const isActive = offset === 0;
          const far = abs > 3;

          return (
            <article
              key={project.name}
              className={styles.coverCard}
              data-active={isActive}
              data-far={far}
              style={
                {
                  "--offset": offset,
                  "--abs": abs,
                  "--accent": project.accent,
                } as CSSProperties
              }
              onClick={() => {
                if (pointer.current.moved) return;
                if (!isActive) setActive(index);
              }}
              aria-hidden={far}
              aria-current={isActive ? "true" : undefined}
            >
              <div className={styles.coverMedia}>
                <CoverGallery project={project} playing={paused && isActive} />
              </div>

              <p className={styles.coverCategory}>{project.category}</p>

              <div className={styles.coverMeta}>
                <div className={styles.coverCopy}>
                  <h3>{project.name}</h3>
                  <p className={styles.coverBlurb}>{project.description}</p>
                </div>
                {project.url ? (
                  <a
                    className={styles.coverView}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    onPointerDown={(event) => event.stopPropagation()}
                  >
                    View
                    <IconArrow />
                  </a>
                ) : (
                  <span className={styles.coverView}>Private</span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <button
        type="button"
        className={`${styles.coverBtn} ${styles.coverBtnNext}`}
        onClick={() => go(1)}
        aria-label="Next project"
      >
        <IconChevronRight />
      </button>
    </div>
  );
}
