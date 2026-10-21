"use client";

import { techCategories, technologies } from "@/data/resume";
import { TechLogo } from "@/components/TechLogos";
import styles from "@/app/page.module.css";

function CategoryPanel({
  category,
  wide = false,
}: {
  category: (typeof techCategories)[number];
  wide?: boolean;
}) {
  const items = technologies.filter((tech) => tech.category === category.id);
  if (!items.length) return null;

  return (
    <section className={`${styles.techPanel} ${wide ? styles.techPanelWide : ""}`}>
      <header className={styles.techPanelHead}>
        <h3>{category.label}</h3>
        <span>{String(items.length).padStart(2, "0")}</span>
      </header>
      <div className={wide ? styles.techIconsWide : styles.techIcons}>
        {items.map((tech) => (
          <article className={styles.techIcon} key={tech.name}>
            <span className={styles.techIconMark}>
              <TechLogo name={tech.logo} />
            </span>
            <strong>{tech.name}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function TechStack() {
  const [primary, ...rest] = techCategories;

  return (
    <div className={styles.techStack}>
      <div className={styles.techHead}>
        <h2 className={styles.techTitle}>
          My Skill
          <span>Toolkit</span>
        </h2>
        <p className={styles.techLead}>
          The stack I use to ship backend systems and live products.
        </p>
      </div>

      <div className={styles.techBoard}>
        <CategoryPanel category={primary} wide />
        <div className={styles.techSides}>
          {rest.map((category) => (
            <CategoryPanel category={category} key={category.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
