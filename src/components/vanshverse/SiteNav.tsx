"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { profile } from "@/data/profile";
import { locations } from "@/data/world";
import { gameApi } from "@/game/events";

function ScrollMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M7 10.5 C7 8.6 8.7 7.2 11 7.2 H21 L25 11.2 V21.5 C25 23.4 23.3 24.8 21 24.8 H11 C8.7 24.8 7 23.4 7 21.5 Z" />
      <path d="M21 7.2 V11.2 H25" />
      <path d="M11.5 14.6 H20.5 M11.5 17.6 H18.2 M11.5 20.6 H16.5" />
    </svg>
  );
}

function CompassMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="verse-compass">
      <circle cx="24" cy="24" r="20" />
      <circle cx="24" cy="24" r="14.2" />
      <path d="M24 6 L27.2 20.8 L24 18.8 L20.8 20.8 Z" className="verse-compass-n" />
      <path d="M42 24 L27.2 20.8 L29.2 24 L27.2 27.2 Z" />
      <path d="M24 42 L20.8 27.2 L24 29.2 L27.2 27.2 Z" />
      <path d="M6 24 L20.8 27.2 L18.8 24 L20.8 20.8 Z" />
      <circle cx="24" cy="24" r="3.1" className="verse-compass-gem" />
    </svg>
  );
}

export default function SiteNav({ compact = false }: { compact?: boolean }) {
  const [atlasOpen, setAtlasOpen] = useState(false);

  useEffect(() => {
    if (compact) setAtlasOpen(false);
  }, [compact]);

  useEffect(() => {
    if (!atlasOpen) return;
    const onPointer = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest(".verse-atlas")) return;
      setAtlasOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAtlasOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [atlasOpen]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between p-3 sm:p-4">
      <Link href="/" className="pointer-events-auto" aria-label="VANSHVERSE home">
        <Image
          src="/new_logo.png"
          alt="VANSH KAUSHIK VERSE"
          width={217}
          height={72}
          className="h-10 w-auto sm:h-12"
          priority
        />
      </Link>

      <div className={`pointer-events-auto verse-kit${compact ? " is-compact" : ""}`}>
        <div className="verse-hud-wrap">
          <a
            href={profile.resumeFile}
            target="_blank"
            rel="noopener noreferrer"
            className="verse-hud"
            aria-label="Download resume"
          >
            <span className="verse-hud-mark" aria-hidden="true">
              <ScrollMark />
            </span>
            <span className="verse-hud-copy">
              <strong>Resume</strong>
              <small>Personal record</small>
            </span>
          </a>
          <span className="verse-hud-tip">Download resume</span>
        </div>

        <div className={`verse-atlas ${atlasOpen ? "is-open" : ""}`}>
          <div className="verse-hud-wrap">
            <button
              type="button"
              className="verse-hud"
              aria-label="World map"
              aria-expanded={atlasOpen}
              onClick={() => setAtlasOpen((value) => !value)}
            >
              <span className="verse-hud-mark" aria-hidden="true">
                <CompassMark />
              </span>
              <span className="verse-hud-copy">
                <strong>World Map</strong>
                <small>Travel the verse</small>
              </span>
            </button>
            <span className="verse-hud-tip">Explore locations</span>
          </div>
          <div className="verse-atlas-menu" role="listbox" aria-label="Travel to a location">
            <p>Locations</p>
            <ul>
              {locations.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      gameApi.teleportTo?.(item.id);
                      setAtlasOpen(false);
                    }}
                  >
                    <span>{item.index}</span>
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
