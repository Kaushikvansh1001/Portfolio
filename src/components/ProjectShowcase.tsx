"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IconChevronDown } from "@/components/Icons";
import { type Project } from "@/data/resume";
import styles from "@/app/page.module.css";

const INNER_MS = 2800;

function projectShots(project: Project) {
  if (project.images?.length) return project.images;
  if (project.image) return [project.image];
  return [];
}

function WorkScreen({
  project,
  playing,
}: {
  project: Project;
  playing: boolean;
}) {
  const shots = projectShots(project);
  const [slide, setSlide] = useState(0);
  const [cursor, setCursor] = useState({ x: 50, y: 50, on: false });
  const stageRef = useRef<HTMLDivElement>(null);

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

  const moveCursor = (event: React.MouseEvent<HTMLDivElement>) => {
    const box = stageRef.current?.getBoundingClientRect();
    if (!box) return;
    setCursor({
      x: event.clientX - box.left,
      y: event.clientY - box.top,
      on: true,
    });
  };

  const screen = (
    <div
      className={styles.workScreen}
      ref={stageRef}
      onMouseMove={moveCursor}
      onMouseEnter={moveCursor}
      onMouseLeave={() => setCursor((current) => ({ ...current, on: false }))}
    >
      {shots.length ? (
        shots.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`${project.name} screenshot ${index + 1}`}
            fill
            sizes="(max-width: 900px) 92vw, 72rem"
            className={styles.workShot}
            data-on={index === slide}
          />
        ))
      ) : (
        <div className={styles.workBlank} aria-hidden="true">
          <span>{project.name[0]}</span>
        </div>
      )}
      <div className={styles.workGlow} aria-hidden="true" />
      <span
        className={styles.workCursor}
        aria-hidden="true"
        data-on={cursor.on}
        style={{ left: cursor.x, top: cursor.y }}
      />
    </div>
  );

  const frame = (
    <>
      <div className={styles.workChrome}>
        <i />
        <i />
        <i />
        <span>{project.name}</span>
      </div>
      {screen}
    </>
  );

  if (project.url) {
    return (
      <a
        className={styles.workFrame}
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${project.name}`}
      >
        {frame}
      </a>
    );
  }

  return <div className={styles.workFrame}>{frame}</div>;
}

function WorkYear({ label }: { label: string }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const slot = slotRef.current;
    const labelNode = labelRef.current;
    if (!slot || !labelNode) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const max = Math.max(0, slot.clientHeight - labelNode.offsetHeight);
      if (!max) {
        labelNode.style.transform = "translateY(0px)";
        return;
      }

      const rect = slot.getBoundingClientRect();
      const start = Math.min(140, window.innerHeight * 0.18);
      const traveled = start - rect.top;
      const range = Math.max(1, rect.height - window.innerHeight * 0.42);
      const offset = Math.min(max, Math.max(0, (traveled / range) * max));
      labelNode.style.transform = `translateY(${offset}px)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [label]);

  return (
    <div className={styles.workYearSlot} ref={slotRef}>
      <p className={styles.workYear} ref={labelRef}>
        <span className={styles.workDot} aria-hidden="true" />
        <span>{label}</span>
      </p>
    </div>
  );
}

function posterWords(name: string) {
  if (name.toLowerCase() === "moonsjob app") return ["moons", "job", "app"];
  return name.toLowerCase().split(/\s+/);
}

function posterSlots(shots: string[]) {
  if (shots.length >= 3) return [shots[0], shots[1], shots[2]];
  if (shots.length === 2) return [shots[1], shots[0], undefined];
  return [undefined, shots[0], undefined];
}

function WorkPoster({ project }: { project: Project }) {
  const slots = posterSlots(projectShots(project));
  const words = posterWords(project.name);

  const stage = (
    <div className={styles.appPoster}>
      <h3 className={styles.appPosterType}>
        {words.map((word) => (
          <span key={word}>{word}</span>
        ))}
      </h3>
      <div className={styles.appPosterCards}>
        {slots.map((src, slot) => (
          <div
            className={styles.appPosterCard}
            data-slot={slot}
            data-empty={!src}
            key={slot}
          >
            {src ? (
              <Image
                src={src}
                alt={slot === 1 ? `${project.name} preview` : ""}
                fill
                sizes={slot === 1 ? "320px" : "180px"}
                className={styles.appPosterShot}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <article className={`${styles.workChapter} ${styles.workChapterPoster}`}>
      {project.url ? (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.name}`}
        >
          {stage}
        </a>
      ) : (
        stage
      )}
      <div className={styles.appPosterCopy}>
        <p className={styles.appPosterKicker}>{project.category}</p>
        <p>{project.description}</p>
      </div>
    </article>
  );
}

function WorkChapter({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.28 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <article className={styles.workChapter} ref={ref} data-in={inView}>
      <div className={styles.workCopy}>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
      </div>
      <WorkScreen project={project} playing={inView} />
    </article>
  );
}

function WorkEntry({ project }: { project: Project }) {
  return (
    <div className={styles.workGroup}>
      <WorkYear label={project.name} />
      <div className={styles.workGroupMain}>
        {project.showcase === "poster" ? (
          <WorkPoster project={project} />
        ) : (
          <WorkChapter project={project} />
        )}
      </div>
    </div>
  );
}

export default function ProjectShowcase({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false);
  const featured = projects.filter((project) => project.featured);
  const more = projects.filter((project) => !project.featured);

  return (
    <div className={styles.workReel}>
      <header className={styles.workHead}>
        <h2>Some recent work</h2>
        <p>(live platforms and backends)</p>
      </header>

      {featured.map((project) => (
        <WorkEntry key={project.name} project={project} />
      ))}

      {more.length > 0 ? (
        <div className={styles.seeMoreBlock}>
          <button
            type="button"
            className={styles.seeMoreBtn}
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="more-projects"
          >
            {open ? "Show less" : "See more"}
            <span className={styles.seeMoreIcon}>
              <IconChevronDown />
            </span>
          </button>

          {open ? (
            <div id="more-projects">
              {more.map((project) => (
                <WorkEntry key={project.name} project={project} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
