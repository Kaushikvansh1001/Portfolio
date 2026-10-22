"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ContactForm from "@/components/ContactForm";
import styles from "@/app/page.module.css";

export default function ContactStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const pos = useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    restX: 0,
    restY: 0,
    hover: false,
  });

  useEffect(() => {
    const stage = stageRef.current;
    const orb = orbRef.current;
    if (!stage || !orb) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;

    const rest = () => {
      const box = stage.getBoundingClientRect();
      const slot = stage.querySelector<HTMLElement>(`.${styles.talkSlot}`);
      const mark = slot?.getBoundingClientRect();
      const x = mark ? mark.left + mark.width / 2 - box.left : box.width / 2;
      const y = mark ? mark.top + mark.height / 2 - box.top : box.height * 0.72;
      pos.current.restX = x;
      pos.current.restY = y;
      if (!pos.current.hover) {
        pos.current.tx = x;
        pos.current.ty = y;
      }
    };

    const tick = () => {
      const p = pos.current;
      const ease = p.hover ? 0.22 : 0.12;
      p.x += (p.tx - p.x) * ease;
      p.y += (p.ty - p.y) * ease;
      const radius = orb.offsetWidth / 2;
      orb.style.transform = `translate3d(${p.x - radius}px, ${p.y - radius}px, 0)`;
      orb.dataset.ready = "true";
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (!fine.matches || motion.matches || open) return;
      const box = stage.getBoundingClientRect();
      pos.current.hover = true;
      pos.current.tx = event.clientX - box.left;
      pos.current.ty = event.clientY - box.top;
    };

    const onLeave = () => {
      pos.current.hover = false;
      pos.current.tx = pos.current.restX;
      pos.current.ty = pos.current.restY;
    };

    rest();
    pos.current.x = pos.current.restX;
    pos.current.y = pos.current.restY;
    tick();

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", rest);

    return () => {
      cancelAnimationFrame(frame);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", rest);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section className={`${styles.contactSection} ${styles.talkSection}`} id="contact">
      <div className={styles.talkStage} ref={stageRef}>
        <p className={styles.talkNote}>( start a project )</p>
        <h2 className={styles.talkTitle}>
          got an idea worth
          <span>building?</span>
        </h2>
        <p className={styles.talkGhost} aria-hidden="true">
          LET&apos;S TALK
        </p>
        <div className={styles.talkSlot} aria-hidden="true" />
        <button
          className={styles.talkOrb}
          type="button"
          ref={orbRef}
          hidden={open}
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          Let&apos;s talk
        </button>
      </div>

      {mounted && open
        ? createPortal(
            <div
              className={styles.talkModal}
              role="dialog"
              aria-modal="true"
              aria-labelledby="talk-dialog-title"
            >
              <button
                className={styles.talkBackdrop}
                type="button"
                aria-label="Close contact form"
                onClick={() => setOpen(false)}
              />
              <div className={styles.talkPanel}>
                <button
                  className={styles.talkClose}
                  type="button"
                  ref={closeRef}
                  onClick={() => setOpen(false)}
                  aria-label="Close contact form"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                  </svg>
                </button>
                <ContactForm />
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
