import type { CSSProperties } from "react";
import Image from "next/image";
import { IconArrow } from "@/components/Icons";
import { freelancePortfolios } from "@/data/resume";
import styles from "@/app/page.module.css";

export default function FreelanceShowcase() {
  return (
    <section className={styles.freelanceSection} id="freelance">
      <div className={styles.freelanceReel}>
        <header className={styles.workHead}>
          <h2>Freelance portfolios</h2>
          <p>(live sites I built)</p>
        </header>

        <div className={styles.freelanceGrid}>
          {freelancePortfolios.map((site) => {
            const host = new URL(site.url).host.replace(/^www\./, "");

            return (
              <a
                className={styles.freelanceCard}
                href={site.url}
                key={site.name}
                target="_blank"
                rel="noopener noreferrer"
                style={{ "--accent": site.accent } as CSSProperties}
                aria-label={`Open ${site.name}`}
              >
                <div className={styles.freelanceFrame}>
                  <div className={styles.workChrome}>
                    <i />
                    <i />
                    <i />
                    <span>{host}</span>
                  </div>
                  <div className={styles.freelanceScreen}>
                    <Image
                      src={site.image}
                      alt={`${site.name} portfolio homepage`}
                      fill
                      sizes="(max-width: 900px) 92vw, 38rem"
                      className={styles.freelanceShot}
                    />
                  </div>
                </div>
                <div className={styles.freelanceMeta}>
                  <p className={styles.freelanceRole}>{site.category}</p>
                  <h3>{site.name}</h3>
                  <p className={styles.freelanceCopy}>{site.description}</p>
                  <span className={styles.freelanceVisit}>
                    Visit live site
                    <IconArrow />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
