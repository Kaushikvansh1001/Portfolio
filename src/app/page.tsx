import type { CSSProperties } from "react";
import Image from "next/image";
import HeroScroll from "@/components/HeroScroll";
import Nav from "@/components/Nav";
import ExperienceReveal from "@/components/ExperienceReveal";
import ProcessReveal from "@/components/ProcessReveal";
import ProjectShowcase from "@/components/ProjectShowcase";
import TechStack from "@/components/TechStack";
import ServicesShowcase from "@/components/ServicesShowcase";
import ContactStage from "@/components/ContactStage";
import IntroScreen from "@/components/IntroScreen";
import SocialIcon from "@/components/SocialIcon";
import { IconCheck } from "@/components/Icons";
import {
  education,
  experience,
  highlights,
  profile,
  projects,
  socials,
} from "@/data/resume";
import styles from "./page.module.css";

const heroStats = [
  { value: "1.6+", label: "Years Experience" },
  { value: "10+", label: "Projects Completed" },
  { value: "8+", label: "Live Web Apps" },
];

export default function Home() {
  return (
    <>
      <IntroScreen />
      <Nav />
      <main>
        <HeroScroll>
          <div className={styles.heroFrame}>
            <div className={styles.heroGlow} aria-hidden="true" />
            <div className={styles.heroPhoto}>
              <Image
                src={profile.heroPhoto}
                alt={profile.name}
                width={900}
                height={1200}
                priority
              />
            </div>

            <div className={styles.heroContent}>
              <div className={styles.heroLeft}>
                <p className={styles.eyebrow}>Hello, I&apos;m</p>
                <h1 className={styles.heroName}>
                  {profile.firstName}
                  <span>{profile.lastName}</span>
                </h1>
                <p className={styles.heroTitle}>
                  Software Development Engineer
                </p>
                <p className={styles.heroBio}>{profile.heroBio}</p>
                <div className={styles.heroSocials}>
                  {socials.map((item) =>
                    item.href ? (
                      <a
                        href={item.href}
                        key={item.id}
                        {...(item.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        aria-label={item.name}
                      >
                        <SocialIcon id={item.id} name={item.name} />
                      </a>
                    ) : null,
                  )}
                </div>
              </div>

            </div>

            <div className={styles.heroStats}>
              {heroStats.map((stat) => (
                <div className={styles.heroStat} key={stat.label}>
                  <span className={styles.heroStatValue}>{stat.value}</span>
                  <span className={styles.heroStatLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </HeroScroll>

        <section className={styles.workSection} id="portfolio">
          <ProjectShowcase projects={projects} />
        </section>

        <section className={`${styles.section} ${styles.sectionAlt}`} id="about">
          <div className="container">
            <div className={styles.aboutGrid}>
              <div>
                <p className={styles.kicker}>About Me</p>
                <h2 className={styles.sectionTitle}>{profile.aboutHeadline}</h2>
                <p className={styles.aboutCopy}>{profile.aboutBody}</p>
                <ul className={styles.checkList}>
                  {highlights.map((item) => (
                    <li key={item}>
                      <span className={styles.checkIcon}>
                        <IconCheck />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className={styles.signature}>{profile.name}</p>
              </div>
              <div className={styles.aboutVisual}>
                <div className={styles.aboutImage}>
                  <img
                    src="/about_me.png"
                    alt="Backend stack: Python, Flask, REST APIs, PostgreSQL, and AWS"
                    width={1536}
                    height={1024}
                    className={styles.aboutPhoto}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} id="process">
          <div className="container">
            <ProcessReveal />
          </div>
        </section>

        <section className={`${styles.section} ${styles.servicesSection}`} id="services">
          <div className="container">
            <ServicesShowcase />
          </div>
        </section>

        <section className={`${styles.section} ${styles.experienceSection}`} id="experience">
          <div className="container">
            <div className={styles.sectionHeadCenter}>
              <p className={styles.kicker}>Experience</p>
              <h2 className={styles.sectionTitle}>Where I&apos;ve Worked</h2>
            </div>
            <ExperienceReveal>
              {experience.map((job, index) => (
                <div
                  className={`${styles.expItem}${job.period.includes("Present") ? ` ${styles.expCurrent}` : ""}`}
                  key={`${job.company}-${job.role}`}
                  style={{ "--i": index } as CSSProperties}
                >
                  <span className={styles.expNode} aria-hidden="true" />
                  <article className={styles.expCard}>
                    <div className={styles.jobMeta}>
                      <div>
                        <p className={styles.jobCompany}>{job.company}</p>
                        <h3>{job.role}</h3>
                      </div>
                      <p className={styles.jobPeriod}>
                        {job.period.includes("Present") ? (
                          <span className={styles.expLive} aria-hidden="true" />
                        ) : null}
                        {job.period}
                      </p>
                    </div>
                    <ul>
                      {job.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </article>
                </div>
              ))}
            </ExperienceReveal>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionAlt} ${styles.skillsSection}`} id="skills">
          <div className="container">
            <TechStack />
          </div>
        </section>

        <section className={styles.section} id="education">
          <div className="container">
            <div className={styles.eduWrap}>
              <div className={styles.sectionHeadCenter}>
                <p className={styles.kicker}>Education</p>
                <h2 className={styles.sectionTitle}>Academic Background</h2>
              </div>
              <div className={styles.eduGrid}>
                {education.map((item) => (
                  <article className={`${styles.jobCard} ${styles.eduCard}`} key={item.degree}>
                    <div className={styles.jobMeta}>
                      <div>
                        <h3>{item.degree}</h3>
                        <p className={styles.jobCompany}>{item.school}</p>
                      </div>
                      <p className={styles.jobPeriod}>{item.period}</p>
                    </div>
                    <p style={{ color: "var(--text-muted)" }}>{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ContactStage />

        <section className={`${styles.section} ${styles.sectionAlt}`} id="social">
          <div className={`container ${styles.socialRow}`}>
            <div>
              <p className={styles.kicker}>Social</p>
              <h2 className={styles.sectionTitle}>Find me online</h2>
            </div>
            <div className={styles.socialGrid}>
              {socials.map((item) =>
                item.href ? (
                  <a
                    className={styles.socialLink}
                    key={item.id}
                    href={item.href}
                    {...(item.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    aria-label={item.name}
                  >
                    <SocialIcon id={item.id} name={item.name} />
                  </a>
                ) : (
                  <span className={styles.socialLink} key={item.id}>
                    <SocialIcon id={item.id} name={item.name} />
                  </span>
                ),
              )}
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <p>Designed and built from scratch in 2026.</p>
        </footer>
      </main>
    </>
  );
}
