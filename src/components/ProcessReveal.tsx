"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { process } from "@/data/resume";
import { IconChevronLeft, IconChevronRight, ProcessIcon } from "@/components/Icons";
import styles from "@/app/page.module.css";

const HOLD = 5200;
const SWIPE = 48;

export default function ProcessReveal() {
  const [index, setIndex] = useState(0);
  const [shift, setShift] = useState(0);
  const [pull, setPull] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const dragged = useRef(false);
  const last = process.length - 1;

  const go = (next: number) => {
    setIndex(Math.max(0, Math.min(last, next)));
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const measure = () => {
      const card = viewport.querySelector<HTMLElement>("[data-card]");
      const track = viewport.firstElementChild;
      if (!card || !(track instanceof HTMLElement)) return;
      const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
      setShift(index * (card.offsetWidth + gap));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [index]);

  useEffect(() => {
    if (paused || dragging || process.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current >= last ? 0 : current + 1));
    }, HOLD);

    return () => window.clearInterval(timer);
  }, [paused, dragging, last]);

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      go(index + 1);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      go(index - 1);
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    startX.current = event.clientX;
    dragged.current = false;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (startX.current == null) return;
    const dx = event.clientX - startX.current;
    if (Math.abs(dx) > 8) dragged.current = true;
    setPull(dx);
  };

  const onPointerUp = () => {
    if (startX.current == null) return;
    const dx = pull;
    startX.current = null;
    setDragging(false);
    setPull(0);
    if (Math.abs(dx) < SWIPE) return;
    go(dx < 0 ? index + 1 : index - 1);
  };

  const moveGlow = (event: PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(max-width: 820px)").matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    event.currentTarget.style.setProperty("--mx", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - box.top}px`);
    event.currentTarget.style.setProperty("--rx", `${(0.5 - y) * 7}deg`);
    event.currentTarget.style.setProperty("--ry", `${(x - 0.5) * 9}deg`);
  };

  return (
    <div
      className={styles.processShow}
      tabIndex={0}
      data-paused={paused || dragging}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={onKey}
    >
      <div className={styles.processHead}>
        <h2 className={styles.processTitle}>How I Work</h2>
        <div className={styles.processArrows}>
          <button
            type="button"
            className={styles.processNavBtn}
            data-kind="prev"
            aria-label="Previous step"
            disabled={index === 0}
            onClick={() => go(index - 1)}
          >
            <IconChevronLeft />
          </button>
          <button
            type="button"
            className={styles.processNavBtn}
            data-kind="next"
            aria-label="Next step"
            disabled={index === last}
            onClick={() => go(index + 1)}
          >
            <IconChevronRight />
          </button>
        </div>
      </div>

      <div
        className={styles.processViewport}
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className={styles.processTrack}
          data-dragging={dragging}
          style={{ transform: `translate3d(${-shift + pull}px, 0, 0)` }}
        >
          {process.map((step, itemIndex) => (
            <article
              className={styles.processCard}
              data-card=""
              data-on={itemIndex === index}
              data-step={step.number}
              key={step.number}
              onPointerEnter={moveGlow}
              onPointerMove={moveGlow}
              onPointerLeave={(event) => {
                event.currentTarget.style.setProperty("--rx", "0deg");
                event.currentTarget.style.setProperty("--ry", "0deg");
              }}
              onClick={() => {
                if (dragged.current) return;
                go(itemIndex);
              }}
            >
              <span className={styles.processCardGrid} aria-hidden="true" />
              <span className={styles.processCardOrb} aria-hidden="true" />
              <span className={styles.processCardGlow} aria-hidden="true" />
              <div className={styles.processCardTop}>
                <b className={styles.processCardNum}>{step.number}</b>
                <span className={styles.processCardIcon} aria-hidden="true">
                  <i />
                  <ProcessIcon name={step.icon} />
                </span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {itemIndex === index ? (
                <span className={styles.processCardTimer} />
              ) : null}
            </article>
          ))}
        </div>
      </div>

      <div className={styles.processPager} aria-label="Work process steps">
        {process.map((step, itemIndex) => (
          <button
            type="button"
            className={styles.processPage}
            data-on={itemIndex === index}
            key={step.number}
            aria-current={itemIndex === index ? "step" : undefined}
            aria-label={`Step ${step.number} ${step.title}`}
            onClick={() => go(itemIndex)}
          >
            {step.number}
          </button>
        ))}
      </div>
    </div>
  );
}
