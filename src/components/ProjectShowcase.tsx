"use client";

import { useState } from "react";
import { IconChevronDown } from "@/components/Icons";
import ProjectCarousel from "@/components/ProjectCarousel";
import { type Project } from "@/data/resume";
import styles from "@/app/page.module.css";

function ProjectCard({ project }: { project: Project }) {
  const card = (
    <>
      <div
        className={styles.projectThumb}
        style={{
          background: project.image
            ? undefined
            : `linear-gradient(145deg, ${project.accent}, #111 78%)`,
        }}
      >
        <span>{project.name}</span>
      </div>
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
      >
        {card}
      </a>
    );
  }

  return <article className={styles.projectCard}>{card}</article>;
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
