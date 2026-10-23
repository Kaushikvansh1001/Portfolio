"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import { services } from "@/data/resume";
import styles from "@/app/page.module.css";

const HOLD = 5600;
const SWIPE = 48;

function wrapOffset(itemIndex: number, active: number, total: number) {
  let offset = itemIndex - active;
  const half = Math.floor(total / 2);
  if (offset > half) offset -= total;
  if (offset < -half) offset += total;
  return offset;
}

export default function ServicesShowcase() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [clock, setClock] = useState(0);
  const startX = useRef<number | null>(null);
  const swiped = useRef(false);
  const wheelLock = useRef(false);
  const fanRef = useRef<HTMLDivElement>(null);
  const active = services[index];

  const go = (next: number) => {
    const wrapped = (next + services.length) % services.length;
    if (wrapped === index) return;
    setIndex(wrapped);
    setClock((value) => value + 1);
  };

  useEffect(() => {
    if (paused || services.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      go(index + 1);
    }, HOLD);

    return () => window.clearInterval(timer);
  }, [paused, clock, index]);

  useEffect(() => {
    const el = fanRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) < 18 && Math.abs(event.deltaY) < 18) return;
      if (Math.abs(event.deltaX) < Math.abs(event.deltaY)) return;
      event.preventDefault();
      if (wheelLock.current) return;
      wheelLock.current = true;
      go(event.deltaX > 0 ? index + 1 : index - 1);
      window.setTimeout(() => {
        wheelLock.current = false;
      }, 420);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [index]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    startX.current = event.clientX;
    swiped.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (startX.current == null) return;
    if (Math.abs(event.clientX - startX.current) > 12) swiped.current = true;
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (startX.current == null) return;
    const dx = event.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) < SWIPE) return;
    go(dx < 0 ? index + 1 : index - 1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      go(index + 1);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      go(index - 1);
    }
  };

  return (
    <div
      className={styles.serviceShow}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.serviceSplit}>
        <div className={styles.serviceCopy}>
          <p className={styles.kicker}>My Services</p>
          <h2 className={styles.sectionTitle}>What I Do</h2>
          <p className={styles.serviceCount} aria-hidden="true">
            <span key={index}>{String(index + 1).padStart(2, "0")}</span>
            <i>/</i>
            {String(services.length).padStart(2, "0")}
          </p>
          <div className={styles.serviceCaption} key={active.title}>
            <h3>{active.title}</h3>
            <p>{active.description}</p>
          </div>
          <div className={styles.serviceDots}>
            {services.map((service, itemIndex) => (
              <button
                className={`${styles.serviceDot} ${itemIndex === index ? styles.serviceDotOn : ""}`}
                type="button"
                key={service.title}
                aria-label={`Show ${service.title}`}
                onClick={() => go(itemIndex)}
              />
            ))}
          </div>
        </div>

        <div
          className={styles.serviceFan}
          ref={fanRef}
          role="tablist"
          aria-label="Services"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {services.map((service, itemIndex) => {
            const offset = wrapOffset(itemIndex, index, services.length);
            const on = offset === 0;

            return (
              <button
                className={`${styles.serviceCard} ${on ? styles.serviceCardOn : ""} ${Math.abs(offset) >= 2 ? styles.serviceCardFar : ""}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-label={service.title}
                key={service.title}
                onClick={() => {
                  if (swiped.current) return;
                  go(itemIndex);
                }}
                onFocus={() => setPaused(true)}
                style={
                  {
                    "--offset": offset,
                    "--abs": Math.abs(offset),
                    "--s": on ? 1 : Math.abs(offset) >= 2 ? 0.86 : 0.93,
                    "--z": 20 - Math.abs(offset),
                  } as CSSProperties
                }
              >
                <span className={styles.serviceCardTab}>{service.label}</span>
                <span className={styles.serviceCardIcon}>
                  <Image
                    src={service.image}
                    alt=""
                    width={512}
                    height={512}
                    className={styles.serviceCardImg}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
