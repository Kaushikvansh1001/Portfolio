import Image from "next/image";
import Nav from "@/components/Nav";
import {
  IconBadge,
  IconBolt,
  IconBriefcase,
  IconCheck,
  IconDevice,
  IconDownload,
  IconGithub,
  IconGlobe,
  IconLinkedin,
  IconMail,
  IconPulse,
  IconUsers,
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
  skills,
  stats,
} from "@/data/resume";
import styles from "./page.module.css";

const statIcons = [IconBolt, IconUsers, IconBriefcase, IconBadge];

export default function Home() {
  const featured = projects.filter((project) => project.featured);
  const more = projects.filter((project) => !project.featured);

  return (
    <>
      <Nav />
      <main>
        <section className={`${styles.hero} container`} id="home">
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.eyebrow}>Hello, I&apos;m</p>
              <h1 className={styles.heroName}>
                {profile.firstName} <em>{profile.lastName}</em>
              </h1>
              <p className={styles.heroTitle}>{profile.shortTitle}</p>
              <p className={styles.heroBio}>{profile.heroBio}</p>
              <div className={styles.heroActions}>
                <a className={styles.btnPrimary} href="#portfolio">
                  View My Work
                </a>
                <a
                  className={styles.btnOutline}
                  href={profile.resumeFile}
                  download
                >
                  <IconDownload />
                  Download CV
                </a>
              </div>
              <div className={styles.socialRow}>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <IconGithub />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <IconLinkedin />
                </a>
                <a href={`mailto:${profile.email}`} aria-label="Email">
                  <IconMail />
                </a>
              </div>
            </div>

            <div className={styles.heroVisual} aria-hidden="true">
              <div className={styles.heroOrb} />
              <div className={styles.heroRing} />
              <div className={styles.heroPortrait}>
                <Image
                  src="/vansh-portrait.png"
                  alt="Vansh Kaushik"
                  width={640}
                  height={640}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.stats} container`} aria-label="Highlights">
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => {
              const Icon = statIcons[index] ?? IconBolt;
              return (
                <div className={styles.statItem} key={stat.label}>
                  <div className={styles.statIcon}>
                    <Icon />
                  </div>
                  <div>
                    <span className={styles.statValue}>{stat.value}</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
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
                  <div className={styles.deskMock} />
                  <div className={styles.experienceBadge}>3+ Years Experience</div>
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
                  <div className={styles.serviceIcon}>
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

              <div className={styles.processTrack}>
                <span className={styles.processLine} aria-hidden="true" />
                <ol className={styles.processSteps}>
                  {process.map((step) => (
                    <li className={styles.processStep} key={step.number}>
                      <div className={styles.processNode}>
                        <ProcessIcon name={step.icon} />
                      </div>
                      <span className={styles.processNumber}>{step.number}</span>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </article>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionAlt}`} id="portfolio">
          <div className="container">
            <div className={styles.sectionHeadRow}>
              <div>
                <p className={styles.kicker}>Featured Projects</p>
                <h2 className={styles.sectionTitle}>My Recent Work</h2>
              </div>
              <a className={styles.viewAll} href="#all-projects">
                View All Projects →
              </a>
            </div>

            <div className={styles.projectGrid}>
              {featured.map((project) => {
                const card = (
                  <>
                    <div
                      className={styles.projectThumb}
                      style={{
                        background: `linear-gradient(145deg, ${project.accent}, #111 78%)`,
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

                return project.url ? (
                  <a
                    className={styles.projectCard}
                    key={project.name}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {card}
                  </a>
                ) : (
                  <article className={styles.projectCard} key={project.name}>
                    {card}
                  </article>
                );
              })}
            </div>

            <div className={styles.moreProjects} id="all-projects">
              {more.map((project) =>
                project.url ? (
                  <a
                    className={styles.moreItem}
                    key={project.name}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div>
                      <h4>{project.name}</h4>
                      <p>
                        {project.category} — {project.description}
                      </p>
                    </div>
                    <span className={styles.moreLink}>Visit ↗</span>
                  </a>
                ) : (
                  <div className={styles.moreItem} key={project.name}>
                    <div>
                      <h4>{project.name}</h4>
                      <p>
                        {project.category} — {project.description}
                      </p>
                    </div>
                    <span className={styles.moreLink}>Private</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <section className={styles.section} id="experience">
          <div className="container">
            <div className={styles.sectionHeadCenter}>
              <p className={styles.kicker}>Experience</p>
              <h2 className={styles.sectionTitle}>Where I&apos;ve Worked</h2>
            </div>
            <div className={styles.timeline}>
              {experience.map((job) => (
                <article className={styles.jobCard} key={`${job.company}-${job.role}`}>
                  <div className={styles.jobMeta}>
                    <div>
                      <h3>{job.role}</h3>
                      <p className={styles.jobCompany}>{job.company}</p>
                    </div>
                    <p className={styles.jobPeriod}>{job.period}</p>
                  </div>
                  <ul>
                    {job.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionAlt}`} id="skills">
          <div className="container">
            <div className={styles.sectionHeadCenter}>
              <p className={styles.kicker}>Skills</p>
              <h2 className={styles.sectionTitle}>Tech Stack</h2>
            </div>
            <div className={styles.skillsGrid}>
              {skills.map((group) => (
                <div className={styles.skillCard} key={group.category}>
                  <h3>{group.category}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "2.5rem" }}>
              <div className={styles.sectionHeadCenter}>
                <p className={styles.kicker}>Education</p>
                <h2 className={styles.sectionTitle}>Academic Background</h2>
              </div>
              <div className={styles.timeline}>
                {education.map((item) => (
                  <article className={styles.jobCard} key={item.degree}>
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

        <section className={styles.section} id="contact">
          <div className="container">
            <div className={styles.ctaBand}>
              <div>
                <h2>Let&apos;s Work Together!</h2>
                <p>
                  Open to backend roles, freelance builds, and collaborations.
                  Based in {profile.location}.
                </p>
              </div>
              <a className={styles.btnPrimary} href={`mailto:${profile.email}`}>
                Contact Me
              </a>
            </div>
          </div>
        </section>

        <footer className={`${styles.footer} container`}>
          <div className={styles.footerLinks}>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#experience">Experience</a>
            <a href="#contact">Contact</a>
          </div>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {profile.name}. All Rights Reserved.
          </p>
          <div className={styles.featureRow}>
            <span className={styles.featureItem}>
              <IconBolt /> Fast Loading
            </span>
            <span className={styles.featureItem}>
              <IconDevice /> Fully Responsive
            </span>
            <span className={styles.featureItem}>
              <IconGlobe /> Cross Browser Compatible
            </span>
          </div>
        </footer>
      </main>
    </>
  );
}
