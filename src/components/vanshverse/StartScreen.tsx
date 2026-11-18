"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { SkipForward } from "lucide-react";
import { profile } from "@/data/profile";

const SEEN_KEY = "vanshverse-gate";

const CRITICAL = [
  "/new_logo.png",
  "/vanshverse/layer-mountains.jpg",
  "/vanshverse/prop-arch.webp",
];

const EXTRA = [
  "/vanshverse/layer-clouds.webp",
  "/vanshverse/bldg-home.webp",
  "/vanshverse/bldg-projects.webp",
  "/vanshverse/bldg-lab.webp",
];

const ASSETS = [...CRITICAL, ...EXTRA];

function preload(src: string) {
  return new Promise<void>((resolve) => {
    const image = new window.Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function ResumeMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M7 10.5 C7 8.6 8.7 7.2 11 7.2 H21 L25 11.2 V21.5 C25 23.4 23.3 24.8 21 24.8 H11 C8.7 24.8 7 23.4 7 21.5 Z" />
      <path d="M21 7.2 V11.2 H25" />
      <path d="M11.5 14.6 H20.5 M11.5 17.6 H18.2 M11.5 20.6 H16.5" />
    </svg>
  );
}

function EnterArrows() {
  return (
    <span className="gate-enter-arrows" aria-hidden="true">
      <svg viewBox="0 0 8 12" className="gate-enter-chevron">
        <path d="M1.2 1.4 6.4 6 1.2 10.6" />
      </svg>
      <svg viewBox="0 0 8 12" className="gate-enter-chevron">
        <path d="M1.2 1.4 6.4 6 1.2 10.6" />
      </svg>
    </span>
  );
}

export default function StartScreen() {
  const router = useRouter();
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const villageRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const doorLRef = useRef<HTMLDivElement>(null);
  const doorRRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);
  const entering = useRef(false);
  const pointer = useRef({ x: 0, y: 0 });
  const chromeRef = useRef<HTMLElement>(null);
  const enterBtnRef = useRef<HTMLButtonElement>(null);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);

  const embers = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => ({
        id: index,
        left: `${6 + ((index * 17) % 88)}%`,
        delay: `${(index * 0.37) % 6}s`,
        duration: `${6.5 + (index % 5) * 0.7}s`,
        size: index % 3 === 0 ? 4 : 2,
      })),
    [],
  );

  const finishIntro = useCallback(() => {
    intro.current?.kill();
    gsap.set(
      [brandRef.current, copyRef.current, actionRef.current, bloomRef.current],
      { opacity: 1, y: 0, scale: 1, clearProps: "filter" },
    );
    gsap.set(veilRef.current, { opacity: 0 });
    gsap.set(stageRef.current, { scale: 1, y: 0 });
    gsap.set(doorLRef.current, { xPercent: -38, rotateY: 0 });
    gsap.set(doorRRef.current, { xPercent: 38, rotateY: 0 });
    gsap.set(bloomRef.current, { opacity: 0.32, scale: 1 });
    setReady(true);
  }, []);

  useEffect(() => {
    router.prefetch("/explore");
    let alive = true;
    let count = 0;
    ASSETS.forEach((src) => {
      void preload(src).then(() => {
        if (!alive) return;
        count += 1;
        setLoaded(count);
      });
    });
    return () => {
      alive = false;
    };
  }, [router]);

  useEffect(() => {
    if (loaded < CRITICAL.length) return;
    const seen = (() => {
      try {
        return sessionStorage.getItem(SEEN_KEY) === "1";
      } catch {
        return false;
      }
    })();
    const skip = seen || reducedMotion();
    if (skip) {
      finishIntro();
      return;
    }

    const veil = veilRef.current;
    const brand = brandRef.current;
    const copy = copyRef.current;
    const action = actionRef.current;
    const bloom = bloomRef.current;
    const stage = stageRef.current;
    if (!veil || !brand || !copy || !action || !stage) return;

    gsap.set(veil, { opacity: 1 });
    gsap.set(brand, { opacity: 0, y: 16 });
    gsap.set(copy, { opacity: 0, y: 14 });
    gsap.set(action, { opacity: 0, y: 12 });
    gsap.set(bloom, { opacity: 0, scale: 0.72 });
    gsap.set(stage, { scale: 1.08 });
    gsap.set(doorLRef.current, { xPercent: 0, rotateY: 0 });
    gsap.set(doorRRef.current, { xPercent: 0, rotateY: 0 });

    const timeline = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        sessionStorage.setItem(SEEN_KEY, "1");
        setReady(true);
      },
    });
    intro.current = timeline;

    timeline
      .to(bloom, { opacity: 0.55, scale: 1, duration: 0.7 }, 0.15)
      .to(brand, { opacity: 1, y: 0, duration: 0.7 }, 0.45)
      .to(stage, { scale: 1, duration: 1.15, ease: "power3.out" }, 0.7)
      .to(veil, { opacity: 0, duration: 1.05 }, 0.75)
      .to(doorLRef.current, { xPercent: -38, duration: 1.05, ease: "power3.inOut" }, 0.85)
      .to(doorRRef.current, { xPercent: 38, duration: 1.05, ease: "power3.inOut" }, 0.85)
      .to(copy, { opacity: 1, y: 0, duration: 0.55 }, 1.55)
      .to(action, { opacity: 1, y: 0, duration: 0.5 }, 2.05)
      .to(bloom, { opacity: 0.32, duration: 0.6 }, 2.2);

    return () => {
      timeline.kill();
    };
  }, [loaded, finishIntro]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion() || window.matchMedia("(pointer: coarse)").matches) return;

    let frame = 0;
    const tick = () => {
      const x = pointer.current.x;
      const y = pointer.current.y;
      if (entering.current) {
        frame = window.requestAnimationFrame(tick);
        return;
      }
      const move = (node: HTMLDivElement | null, depth: number) => {
        if (!node) return;
        node.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
      };
      move(skyRef.current, 10);
      move(cloudsRef.current, 22);
      move(portalRef.current, 5);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);

    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const enterWorld = () => {
    if (entering.current) return;
    entering.current = true;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode */
    }
    router.prefetch("/explore");

    if (reducedMotion()) {
      setEntered(true);
      router.push("/explore");
      return;
    }

    intro.current?.kill();
    enterBtnRef.current?.classList.add("is-opening");

    gsap.to([skyRef.current, cloudsRef.current, portalRef.current], {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });

    const timeline = gsap.timeline({
      onComplete: () => {
        setEntered(true);
        router.push("/explore");
      },
    });
    timeline
      .to(enterBtnRef.current, { scale: 1.04, opacity: 0, duration: 0.45, ease: "power2.inOut" }, 0)
      .to([copyRef.current, chromeRef.current], { opacity: 0, y: -6, duration: 0.55, ease: "power2.inOut" }, 0.1)
      .to(brandRef.current, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, 0.14)
      .to(actionRef.current, { opacity: 0, duration: 0.35, ease: "power1.in" }, 0.28)
      .to(doorLRef.current, { xPercent: -108, rotateY: 0, duration: 1.7, ease: "power1.inOut" }, 0.22)
      .to(doorRRef.current, { xPercent: 108, rotateY: 0, duration: 1.7, ease: "power1.inOut" }, 0.22)
      .to(bloomRef.current, { opacity: 0.5, scale: 1.12, duration: 1.5, ease: "power1.inOut" }, 0.32)
      .to(villageRef.current, { scale: 1.05, duration: 1.8, ease: "power1.inOut" }, 0.26)
      .to(stageRef.current, { scale: 1.16, y: -18, duration: 1.9, ease: "power1.inOut" }, 0.22)
      .to(veilRef.current, { opacity: 1, duration: 1.05, ease: "power1.inOut" }, 1.2);
  };

  const progress = Math.round((loaded / ASSETS.length) * 100);
  const waiting = loaded < CRITICAL.length;

  return (
    <main ref={rootRef} className={`gate${entered ? " is-leaving" : ""}`}>
      <header ref={chromeRef} className="gate-chrome">
        <div className="verse-kit">
          <div className="verse-hud-wrap">
            <a
              href={profile.resumeFile}
              target="_blank"
              rel="noopener noreferrer"
              className="verse-hud"
              aria-label="Download resume"
            >
              <span className="verse-hud-mark" aria-hidden="true">
                <ResumeMark />
              </span>
              <span className="verse-hud-copy">
                <strong>Resume</strong>
                <small>Personal record</small>
              </span>
            </a>
          </div>
        </div>
      </header>

      <div ref={stageRef} className="gate-stage">
        <div ref={skyRef} className="gate-sky">
          <Image
            src="/vanshverse/layer-mountains.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_62%]"
          />
        </div>

        <div ref={cloudsRef} className="gate-clouds">
          <div className="gate-cloud-drift">
            <Image src="/vanshverse/layer-clouds.webp" alt="" fill sizes="140vw" className="object-contain object-top" />
          </div>
        </div>

        <div className="gate-haze" />

        <div ref={portalRef} className="gate-portal-shift">
        <div className="gate-portal">
          <div ref={villageRef} className="gate-aperture">
            <div className="gate-village">
              <Image src="/vanshverse/bldg-projects.webp" alt="" width={280} height={200} className="gate-house gate-house-left" />
              <Image src="/vanshverse/bldg-home.webp" alt="" width={320} height={360} className="gate-house gate-house-mid" />
              <Image src="/vanshverse/bldg-lab.webp" alt="" width={240} height={300} className="gate-house gate-house-right" />
            </div>
            <div ref={bloomRef} className="gate-bloom" />
            <div ref={doorLRef} className="gate-door gate-door-left" aria-hidden="true" />
            <div ref={doorRRef} className="gate-door gate-door-right" aria-hidden="true" />
          </div>
          <Image
            src="/vanshverse/prop-arch.webp"
            alt=""
            width={1200}
            height={780}
            priority
            className="gate-arch"
          />
        </div>
        </div>

        <div className="gate-ground" />
        <div className="gate-vignette" />

        <div className="gate-embers" aria-hidden="true">
          {embers.map((ember) => (
            <span
              key={ember.id}
              className="gate-ember"
              style={{
                left: ember.left,
                animationDelay: ember.delay,
                animationDuration: ember.duration,
                width: ember.size,
                height: ember.size,
              }}
            />
          ))}
        </div>
      </div>

      <div ref={veilRef} className="gate-veil" />

      <div className="gate-ui">
        <div ref={brandRef} className="gate-brand">
          <Image
            src="/new_logo.png"
            alt="VANSH KAUSHIK VERSE"
            width={520}
            height={172}
            priority
            className="gate-logo"
          />
          <span className="gate-sheen" aria-hidden="true" />
        </div>

        <div ref={copyRef} className="gate-copy">
          <p className="gate-kicker">Vansh Kaushik · Software Development Engineer</p>
          <h1 className="gate-title">Every world begins with an idea.</h1>
          <p className="gate-role">{profile.universe.subtitle}</p>
          <p className="gate-tag">A world built with code.</p>
        </div>

        <div ref={actionRef} className="gate-actions">
          <button
            ref={enterBtnRef}
            type="button"
            className="gate-enter"
            onClick={enterWorld}
            disabled={waiting || !ready}
          >
            <span className="gate-enter-fill" aria-hidden="true" />
            <span className="gate-enter-copy">
              <span className="gate-enter-label">Enter VANSHVERSE</span>
              <EnterArrows />
            </span>
          </button>
          <p className="gate-hint">An interactive software engineering portfolio</p>
        </div>
      </div>

      {!ready ? (
        <button
          type="button"
          className="gate-skip"
          onClick={() => {
            try {
              sessionStorage.setItem(SEEN_KEY, "1");
            } catch {
              /* private mode */
            }
            finishIntro();
          }}
        >
          <SkipForward size={13} />
          Skip intro
        </button>
      ) : null}

      {waiting ? (
        <div className="gate-load" role="status" aria-live="polite">
          <span>Opening the gate</span>
          <i style={{ width: `${progress}%` }} />
        </div>
      ) : null}
    </main>
  );
}
