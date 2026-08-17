import type { CSSProperties } from "react";
import Image from "next/image";
import HeroScroll from "@/components/HeroScroll";
import Nav from "@/components/Nav";
import ExperienceReveal from "@/components/ExperienceReveal";
import ProcessReveal from "@/components/ProcessReveal";
import ProjectShowcase from "@/components/ProjectShowcase";
import TechStack from "@/components/TechStack";
import ContactForm from "@/components/ContactForm";
import SocialIcon from "@/components/SocialIcon";
import {
  IconArrowUpRight,
  IconBehance,
  IconCheck,
  IconGithub,
  IconLinkedin,
  IconMail,
  IconPhone,
  IconPin,
  IconPulse,
  ProcessIcon,
  ServiceIcon,
} from "@/components/Icons";
import {
  education,
  experience,
  highlights,
  process,
  profile,
  projects,
  services,
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
      <Nav />
      <main>
        <HeroScroll>
          <div className={styles.heroFrame}>
            <div className={styles.heroGlow} aria-hidden="true" />
            <p className={styles.heroWord} aria-hidden="true">
              PORTFOLIO
            </p>

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
                  Python Developer &amp; Back-End Engineer
                </p>
                <p className={styles.heroBio}>{profile.heroBio}</p>
                <div className={styles.heroSocials}>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <IconLinkedin />
                  </a>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <IconGithub />
                  </a>
                  <a
                    href={profile.behance}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Behance"
                  >
                    <IconBehance />
                  </a>
                  <a href={`mailto:${profile.email}`} aria-label="Email">
                    <IconMail />
                  </a>
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
                    src="/about_me_sec.png"
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

        <section className={styles.section} id="services">
          <div className="container">
            <div className={styles.sectionHeadCenter}>
              <p className={styles.kicker}>My Services</p>
              <h2 className={styles.sectionTitle}>What I Do</h2>
              <p className={styles.sectionLead}>
                Backend systems, databases, deployments, and product-minded
                interfaces for real-world applications.
              </p>
            </div>
            <div className={styles.servicesGrid}>
              {services.map((service) => (
                <article className={styles.serviceCard} key={service.title}>
                  <div className={styles.serviceIconBox}>
                    <ServiceIcon name={service.icon} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} id="process">
          <div className="container">
            <article className={styles.processCard}>
              <div className={styles.processHead}>
                <span className={styles.processHeadIcon} aria-hidden="true">
                  <IconPulse />
                </span>
                <h2>My Work Process</h2>
              </div>

              <ProcessReveal>
                <span className={styles.processLine} aria-hidden="true" />
                <ol className={styles.processSteps}>
                  {process.map((step, index) => (
                    <li
                      className={styles.processStep}
                      key={step.number}
                      style={{ "--step": index } as CSSProperties}
                    >
                      <div className={styles.processNode}>
                        <ProcessIcon name={step.icon} />
                      </div>
                      <span className={styles.processNumber}>{step.number}</span>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </li>
                  ))}
                </ol>
              </ProcessReveal>
            </article>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionAlt}`} id="portfolio">
          <div className="container">
            <div className={styles.sectionHeadCenter}>
              <p className={styles.kicker}>Featured Projects</p>
              <h2 className={styles.sectionTitle}>My Recent Work</h2>
              <p className={styles.sectionLead}>
                Live platforms and backend systems shipped with Python, Flask,
                and production deployments.
              </p>
            </div>
          </div>
          <ProjectShowcase projects={projects} />
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

        <section className={`${styles.section} ${styles.sectionAlt}`} id="skills">
          <div className="container">
            <TechStack />

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

        <section className={`${styles.section} ${styles.contactSection}`} id="contact">
          <div className="container">
            <div className={styles.contactGrid}>
              <div className={styles.contactInfo}>
                <p className={styles.contactBadge}>Contact</p>
                <h2 className={styles.sectionTitle}>Get in touch</h2>
                <p className={styles.contactIntro}>
                  Have a project in mind, or want to talk about a backend role
                  or freelance build?
                </p>

                <div className={styles.contactCards}>
                  <a className={styles.contactCard} href={`mailto:${profile.email}`}>
                    <span className={styles.contactCardIcon}>
                      <IconMail />
                    </span>
                    <span>
                      <strong>Email me</strong>
                      <em>{profile.email}</em>
                    </span>
                    <span className={styles.contactCardGo}>
                      <IconArrowUpRight />
                    </span>
                  </a>
                  <a
                    className={styles.contactCard}
                    href={`tel:${profile.phone.replace(/\s/g, "")}`}
                  >
                    <span className={styles.contactCardIcon}>
                      <IconPhone />
                    </span>
                    <span>
                      <strong>Call me</strong>
                      <em>{profile.phone}</em>
                    </span>
                    <span className={styles.contactCardGo}>
                      <IconArrowUpRight />
                    </span>
                  </a>
                  <a
                    className={styles.contactCard}
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={styles.contactCardIcon}>
                      <IconPin />
                    </span>
                    <span>
                      <strong>My location</strong>
                      <em>{profile.location}</em>
                    </span>
                    <span className={styles.contactCardGo}>
                      <IconArrowUpRight />
                    </span>
                  </a>
                </div>
              </div>

              <ContactForm />
            </div>
          </div>
        </section>

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
          <p>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  );
}
