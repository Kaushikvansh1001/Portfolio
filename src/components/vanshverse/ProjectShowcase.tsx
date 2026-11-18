"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";

type ShowcaseItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  url?: string;
  image?: string;
  images?: string[];
  year?: string;
  stack?: string[];
};

const ITEMS: ShowcaseItem[] = projects.filter((project) => project.id !== "vansora-ai");

export default function ProjectShowcase() {
  const [index, setIndex] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);
  const project = ITEMS[index];
  const preview = project.images?.[0] ?? project.image;
  const total = ITEMS.length;

  const go = useMemo(() => {
    return (nextIndex: number, direction: 1 | -1) => {
      const wrapped = (nextIndex + total) % total;
      const stage = stageRef.current;
      if (!stage || reduced.current) {
        setIndex(wrapped);
        return;
      }
      gsap.to(stage, {
        x: direction * -28,
        opacity: 0,
        duration: 0.16,
        ease: "power2.in",
        onComplete: () => {
          setIndex(wrapped);
          gsap.fromTo(
            stage,
            { x: direction * 28, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.24, ease: "power2.out" },
          );
        },
      });
    };
  }, [total]);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(index + 1, 1);
      if (event.key === "ArrowLeft") go(index - 1, -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  return (
    <div className="flex min-h-0 flex-col">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[12px] tracking-[0.24em] text-gold">
          Project {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(index - 1, -1)}
            className="inline-flex items-center gap-2 border border-steel px-3 py-2 text-sm text-ash transition hover:border-gold hover:text-gold"
          >
            <ArrowLeft size={16} /> Previous
          </button>
          <button
            type="button"
            onClick={() => go(index + 1, 1)}
            className="inline-flex items-center gap-2 border border-steel px-3 py-2 text-sm text-ash transition hover:border-gold hover:text-gold"
          >
            Next <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div ref={stageRef} className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
        <div className="codex-frame">
          {preview ? (
            <div className="relative aspect-[16/10]">
              <Image
                src={preview}
                alt={`${project.name} preview`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 640px"
                priority={index === 0}
              />
            </div>
          ) : (
            <div className="flex aspect-[16/10] items-center justify-center font-intro text-6xl text-gold/40">
              {project.name[0]}
            </div>
          )}
        </div>

        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-gold">
            {project.category}
            {project.year ? ` · ${project.year}` : ""}
          </p>
          <h3 className="mt-2 font-intro text-3xl leading-tight text-ivory sm:text-4xl">{project.name}</h3>
          <p className="codex-copy mt-4">{project.description}</p>
          {project.stack?.length ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <li key={item} className="codex-chip">
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
          {project.url ? (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="codex-link">
              Live project <ArrowUpRight size={14} />
            </a>
          ) : null}
        </div>
      </div>

      <div className="mt-6 h-px overflow-hidden bg-steel">
        <div className="h-full bg-gold transition-[width] duration-300" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
    </div>
  );
}
