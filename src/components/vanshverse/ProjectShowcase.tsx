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
        x: direction * -36,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setIndex(wrapped);
          gsap.fromTo(
            stage,
            { x: direction * 36, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.28, ease: "power2.out" },
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
    <div className="flex min-h-[28rem] flex-col">
      <div className="mb-5 flex items-end justify-between gap-4">
        <p className="font-mono text-[11px] tracking-[0.28em] text-gold">
          PROJECT {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <div className="h-[2px] min-w-32 flex-1 overflow-hidden bg-gold/15">
          <div
            className="h-full bg-gold transition-[width] duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <div ref={stageRef} className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="relative overflow-hidden rounded-[1.4rem] border border-gold/20 bg-void">
          {preview ? (
            <div className="relative aspect-[16/10]">
              <Image
                src={preview}
                alt={`${project.name} preview`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 520px"
                priority={index === 0}
              />
            </div>
          ) : (
            <div className="flex aspect-[16/10] items-center justify-center font-display text-6xl text-gold/30">
              {project.name[0]}
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-void/80 to-transparent" />
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
            {project.category}
            {project.year ? ` · ${project.year}` : ""}
          </p>
          <h3 className="mt-2 font-display text-3xl leading-tight text-ivory sm:text-4xl">{project.name}</h3>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-mist/80">{project.description}</p>
          {project.stack?.length ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <li
                  key={item}
                  className="border border-gold/25 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-mist"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-void transition hover:brightness-110"
            >
              Live Demo <ArrowUpRight size={14} />
            </a>
          ) : null}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-gold/15 pt-4">
        <button
          type="button"
          onClick={() => go(index - 1, -1)}
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-mist/70 transition hover:text-gold"
        >
          <ArrowLeft size={14} /> Previous Project
        </button>
        <button
          type="button"
          onClick={() => go(index + 1, 1)}
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-mist/70 transition hover:text-gold"
        >
          Next Project <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
