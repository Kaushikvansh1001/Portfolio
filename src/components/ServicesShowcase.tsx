"use client";

import { useEffect, useState } from "react";
import { services } from "@/data/resume";
import { ServiceIcon } from "@/components/Icons";
import styles from "@/app/page.module.css";

const HOLD = 5200;

export default function ServicesShowcase() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [clock, setClock] = useState(0);
  const active = services[index];

  useEffect(() => {
    if (paused || services.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % services.length);
    }, HOLD);

    return () => window.clearInterval(timer);
  }, [paused, clock]);

  const select = (next: number) => {
    setIndex(next);
    setClock((value) => value + 1);
  };

  return (
    <div
      className={styles.serviceShow}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.serviceHead}>
        <p className={styles.kicker}>My Services</p>
        <h2 className={styles.sectionTitle}>What I Do</h2>
      </div>

      <div className={styles.serviceStage}>
        <div className={styles.serviceCopy} key={active.title}>
          <span className={styles.serviceNumber}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3>{active.title}</h3>
          <p>{active.description}</p>
        </div>
        <div className={styles.serviceMark} key={`${active.icon}-icon`}>
          <ServiceIcon name={active.icon} />
        </div>
      </div>

      <div className={styles.serviceTabs} role="tablist" aria-label="Services">
        {services.map((service, itemIndex) => (
          <button
            className={`${styles.serviceTab} ${itemIndex === index ? styles.serviceTabOn : ""}`}
            type="button"
            role="tab"
            aria-selected={itemIndex === index}
            key={service.title}
            onClick={() => select(itemIndex)}
          >
            <em>{String(itemIndex + 1).padStart(2, "0")}</em>
            <strong>{service.title}</strong>
            {itemIndex === index ? (
              <i
                className={styles.serviceTabFill}
                key={`${clock}-${itemIndex}`}
                style={{ animationDuration: `${HOLD}ms` }}
              />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
