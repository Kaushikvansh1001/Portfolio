"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

export default function ScrollFrame({
  labelledBy,
  closeAria,
  onClose,
  children,
}: {
  labelledBy: string;
  closeAria: string;
  onClose: () => void;
  children: (close: () => void) => ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const node = rootRef.current;
    if (!node || reduced.current) return;
    const tl = gsap.timeline();
    tl.fromTo(
      node,
      { clipPath: "inset(0% 46% 0% 46%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.68, ease: "power3.out" },
    );
    return () => {
      tl.kill();
    };
  }, []);

  const close = () => {
    const node = rootRef.current;
    if (reduced.current || !node) {
      onClose();
      return;
    }
    gsap.to(node, {
      clipPath: "inset(0% 46% 0% 46%)",
      duration: 0.28,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button type="button" className="absolute inset-0 bg-void/55" aria-label={closeAria} onClick={close} />
      <div ref={rootRef} className="scroll-stage relative z-10 flex w-full max-w-5xl items-stretch">
        <img src="/vanshverse/scroll-left.webp" alt="" className="scroll-post scroll-post-left" />
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          className="scroll-skin max-h-[78dvh] min-h-[26rem] flex-1 overflow-y-auto px-10 py-7 sm:px-14 sm:py-8"
        >
          {children(close)}
        </section>
        <img src="/vanshverse/scroll-right.webp" alt="" className="scroll-post scroll-post-right" />
      </div>
    </div>
  );
}
