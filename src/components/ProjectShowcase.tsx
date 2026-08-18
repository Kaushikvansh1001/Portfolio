"use client";

import { useEffect, useState } from "react";
import { IconChevronDown } from "@/components/Icons";
import ProjectCarousel from "@/components/ProjectCarousel";
import { type Project } from "@/data/resume";
import styles from "@/app/page.module.css";

const INNER_MS = 2400;

function projectShots(project: Project) {
  if (project.images?.length) return project.images;
  if (project.image) return [project.image];
  return [];
}

function ThumbGallery({
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
      <div
        className={styles.projectThumb}
        style={{
          background: `linear-gradient(145deg, ${project.accent}, #111 78%)`,
        }}
      >
        <span>{project.name}</span>
      </div>
    );
  }

  return (
    <div className={styles.projectThumb} data-photo="true">
      {shots.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          className={styles.projectThumbImg}
          data-on={index === slide}
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
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);
  const hover = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onFocus: () => setHovered(true),
    onBlur: () => setHovered(false),
  };

  const card = (
    <>
      <ThumbGallery project={project} playing={hovered} />
      <div className={styles.projectBody}>
        <h3>{project.name}</h3>
        <p className={styles.projectCategory}>{project.category}</p>
        <p className={styles.projectDesc}>{project.description}</p>
      </div>
    </>
  );

  if (project.url) {
    return (
      <a
        className={styles.projectCard}
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        {...hover}
      >
        {card}
      </a>
    );
  }

  return (
    <article className={styles.projectCard} {...hover}>
      {card}
    </article>
  );
}

export default function ProjectShowcase({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false);
  const featured = projects.filter((project) => project.featured);
  const more = projects.filter((project) => !project.featured);

  return (
    <>
      <ProjectCarousel projects={featured} />

      {more.length > 0 ? (
        <div className={`container ${styles.seeMoreBlock}`}>
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
            <div className={styles.projectGrid} id="more-projects">
              {more.map((project) => (
                <ProjectCard key={project.name} project={project} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
