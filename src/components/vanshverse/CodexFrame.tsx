"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { X } from "lucide-react";

export default function CodexFrame({
  labelledBy,
  closeAria,
  kicker,
  title,
  subtitle,
  tone = "gold",
  footer,
  onClose,
  children,
}: {
  labelledBy: string;
  closeAria: string;
  kicker: string;
  title: string;
  subtitle?: string;
  tone?: "gold" | "teal";
  footer?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const reduced = useRef(false);
  const closing = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useLayoutEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const header = headerRef.current;
    const body = bodyRef.current;
    const footerNode = footerRef.current;
    if (!overlay || !panel) return;

    panel.focus({ preventScroll: true });

    if (reduced.current) return;

    const parts = [header, body, footerNode].filter(Boolean);
    gsap.set(overlay, { opacity: 0 });
    gsap.set(panel, { opacity: 0, scale: 0.965 });
    gsap.set(parts, { opacity: 0, y: 10 });

    const enter = gsap.timeline();
    enter
      .to(overlay, { opacity: 1, duration: 0.22, ease: "power1.out" })
      .to(panel, { opacity: 1, scale: 1, duration: 0.36, ease: "power3.out" }, 0.04)
      .to(parts, { opacity: 1, y: 0, duration: 0.28, stagger: 0.06, ease: "power2.out" }, 0.14);

    return () => {
      enter.kill();
    };
  }, []);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (reduced.current || !overlay || !panel) {
      onCloseRef.current();
      return;
    }
    const parts = [headerRef.current, bodyRef.current, footerRef.current].filter(Boolean);
    gsap.killTweensOf([overlay, panel, ...parts]);
    gsap
      .timeline({ onComplete: () => onCloseRef.current() })
      .to(parts, { opacity: 0, y: -8, duration: 0.14, stagger: 0.03, ease: "power1.in" }, 0)
      .to(panel, { opacity: 0, scale: 0.975, duration: 0.2, ease: "power2.in" }, 0)
      .to(overlay, { opacity: 0, duration: 0.18, ease: "power1.in" }, 0.04);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <div ref={overlayRef} className="codex-overlay" data-tone={tone}>
      <button type="button" className="codex-dim" aria-label={closeAria} onClick={close} />
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className="codex-panel"
      >
        <span className="codex-corner codex-corner-tl" aria-hidden="true" />
        <span className="codex-corner codex-corner-tr" aria-hidden="true" />
        <span className="codex-corner codex-corner-bl" aria-hidden="true" />
        <span className="codex-corner codex-corner-br" aria-hidden="true" />

        <header ref={headerRef} className="codex-header">
          <div className="codex-header-copy">
            <p className="codex-kicker">{kicker}</p>
            <h2 id={labelledBy} className="codex-title">
              {title}
            </h2>
            {subtitle ? <p className="codex-subtitle">{subtitle}</p> : null}
          </div>
          <button type="button" className="codex-close" aria-label="Close archive" onClick={close}>
            <X size={18} />
          </button>
        </header>

        <div ref={bodyRef} className="codex-body">
          {children}
        </div>

        <footer ref={footerRef} className="codex-footer">
          {footer ?? <p className="codex-hint">Esc to return to the world</p>}
        </footer>
      </section>
    </div>
  );
}
