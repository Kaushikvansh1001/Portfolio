"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { FileDown, Mail, X } from "lucide-react";
import { IconGithub, IconLinkedin } from "@/components/Icons";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { highlights, profile } from "@/data/profile";
import { vansora } from "@/data/projects";
import { technologies } from "@/data/skills";
import { locations, type LocationId } from "@/data/world";
import ContactPanel from "./ContactPanel";
import ProjectShowcase from "./ProjectShowcase";
import ScrollFrame from "./ScrollFrame";

const CATEGORY: Record<LocationId, string> = {
  home: "Profile",
  code: "Toolkit",
  projects: "Showcase",
  lab: "Architecture",
  career: "Timeline",
  connect: "Signal",
  clients: "Freelance",
};

const SKILL_GROUPS = [
  { id: "programming", label: "Programming Languages" },
  { id: "backend", label: "Backend Development" },
  { id: "web", label: "Frontend Development" },
  { id: "database", label: "Databases" },
  { id: "cloud", label: "Cloud and Deployment" },
  { id: "tools", label: "Developer Tools" },
] as const;

function useReduced() {
  const reduced = useRef(false);
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  return reduced;
}

function HomeBody() {
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[0.78fr_1.22fr]">
      <div className="relative mx-auto w-full max-w-sm">
        <div className="absolute -inset-3 border border-gold/25" />
        <div className="relative overflow-hidden bg-void">
          <Image
            src={profile.cutout}
            alt={profile.name}
            width={480}
            height={640}
            className="h-auto w-full object-contain"
          />
        </div>
        <p className="mt-3 font-mono text-[10px] tracking-[0.22em] text-gold">
          {profile.location}
        </p>
      </div>
      <div>
        <p className="font-mono text-[11px] tracking-[0.28em] text-gold">SOFTWARE DEVELOPMENT ENGINEER</p>
        <h3 className="mt-2 font-display text-4xl leading-none text-ivory sm:text-5xl">{profile.name}</h3>
        <p className="mt-3 text-sm uppercase tracking-[0.18em] text-forest">{profile.title}</p>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-mist/80">{profile.aboutBody}</p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {highlights.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-mist/80">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-gold" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-8 border-t border-gold/20 pt-5">
          <p className="font-mono text-[11px] tracking-[0.24em] text-gold">EDUCATION</p>
          <div className="mt-4 space-y-4">
            {education.map((item) => (
              <div key={item.degree} className="grid gap-1 sm:grid-cols-[7.5rem_1fr]">
                <p className="font-mono text-[11px] text-gold/80">{item.period}</p>
                <div>
                  <h4 className="font-display text-lg text-ivory">{item.degree}</h4>
                  <p className="text-sm text-mist/70">
                    {item.school} · {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeBody() {
  return (
    <div className="space-y-8">
      {SKILL_GROUPS.map((group) => {
        const items = technologies.filter((tech) => tech.category === group.id);
        if (!items.length) return null;
        return (
          <section key={group.id}>
            <div className="mb-3 flex items-center gap-3">
              <h4 className="font-mono text-[11px] uppercase tracking-[0.24em] text-gold">{group.label}</h4>
              <span className="h-px flex-1 bg-gold/20" />
            </div>
            <ul className="flex flex-wrap gap-3">
              {items.map((tech) => (
                <li key={tech.name} className="group relative">
                  <div className="flex items-center gap-3 border border-gold/15 bg-indigo/80 px-3 py-2.5 transition hover:border-gold/50 hover:bg-gold/10">
                    <Image src={`/tech/${tech.logo}.png`} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
                    <span className="font-display text-base text-ivory">{tech.name}</span>
                  </div>
                  <p className="pointer-events-none absolute left-0 top-full z-10 mt-2 hidden w-64 border border-gold/20 bg-void px-3 py-2 text-xs leading-relaxed text-mist/75 group-hover:block">
                    {tech.blurb} {tech.proof}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function LabBody() {
  const nodes = [
    { title: "Next.js", copy: "Frontend application layer." },
    { title: "FastAPI", copy: "Python API services." },
    { title: "Python", copy: "Core language for the laboratory." },
    { title: "Supabase", copy: "Authentication and database." },
  ];
  const capabilities = [
    { title: "Document Q&A", copy: "Question answering over documents." },
    { title: "Spreadsheet analysis", copy: "Spreadsheet and dataset analysis." },
    { title: "LLM integrations", copy: "Large language model integrations." },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[11px] tracking-[0.24em] text-teal">{vansora.category}</p>
        <h3 className="mt-2 font-display text-4xl text-ivory">{vansora.name}</h3>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-mist/80">{vansora.description}</p>
      </div>
      <div>
        <p className="font-mono text-[11px] tracking-[0.24em] text-gold">ARCHITECTURE</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {nodes.map((node, index) => (
            <article key={node.title} className="relative border border-teal/25 bg-void/70 px-3 py-4 text-center">
              {index < nodes.length - 1 ? (
                <span className="absolute right-[-0.55rem] top-1/2 hidden h-px w-3 bg-teal/50 sm:block" />
              ) : null}
              <h4 className="font-display text-lg text-teal">{node.title}</h4>
              <p className="mt-1 text-xs text-mist/70">{node.copy}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {capabilities.map((item) => (
          <article key={item.title} className="border-l-2 border-teal/50 pl-4">
            <h4 className="font-display text-xl text-ivory">{item.title}</h4>
            <p className="mt-1 text-sm text-mist/75">{item.copy}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function CareerBody() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduced = useReduced();

  useEffect(() => {
    const items = listRef.current?.querySelectorAll("li");
    if (reduced.current || !items?.length) return;
    const tween = gsap.fromTo(
      items,
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, duration: 0.35, stagger: 0.12, ease: "power2.out" },
    );
    return () => {
      tween.kill();
    };
  }, [reduced]);

  return (
    <ol ref={listRef} className="relative space-y-8 border-l border-gold/30 pl-8">
      {experience.map((job, index) => (
        <li key={`${job.company}-${job.role}`} className="relative">
          <span className="absolute -left-[2.15rem] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-gold bg-void font-mono text-[10px] text-gold">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="font-mono text-[11px] tracking-[0.18em] text-gold">{job.period}</p>
          <h4 className="mt-1 font-display text-2xl text-ivory">{job.role}</h4>
          <p className="text-sm text-forest">{job.company}</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-mist/75">
            {job.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

function ConnectBody() {
  const links = [
    { href: `mailto:${profile.email}`, label: "Email", detail: profile.email, icon: Mail, external: false },
    { href: profile.linkedin, label: "LinkedIn", detail: "vanshkaushik7776", icon: IconLinkedin, external: true },
    { href: profile.github, label: "GitHub", detail: profile.githubHandle, icon: IconGithub, external: true },
    { href: profile.resumeFile, label: "Resume", detail: "PDF", icon: FileDown, external: true },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((item) => (
          <a
            key={item.label}
            href={item.href}
            {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group flex items-center gap-4 border border-gold/20 bg-indigo/60 px-4 py-4 transition hover:border-gold hover:bg-gold/10"
          >
            <item.icon className="h-5 w-5 text-gold transition group-hover:scale-110" />
            <span>
              <span className="block font-display text-lg text-ivory">{item.label}</span>
              <span className="block font-mono text-[11px] text-mist/60">{item.detail}</span>
            </span>
          </a>
        ))}
      </div>
      <ContactPanel />
    </div>
  );
}

function PanelBody({ id }: { id: LocationId }) {
  if (id === "home") return <HomeBody />;
  if (id === "code") return <CodeBody />;
  if (id === "projects") return <ProjectShowcase />;
  if (id === "lab") return <LabBody />;
  if (id === "career") return <CareerBody />;
  if (id === "connect") return <ConnectBody />;
  return null;
}

export default function LocationPanel({
  id,
  onClose,
}: {
  id: LocationId;
  onClose: () => void;
}) {
  const location = locations.find((item) => item.id === id);
  if (!location) return null;

  return (
    <ScrollFrame labelledBy="location-title" closeAria="Close location" onClose={onClose}>
      {(close) => (
        <>
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] tracking-[0.24em] text-gold">
                LOCATION {location.index} · {CATEGORY[id]}
              </p>
              <h2 id="location-title" className="mt-1 font-display text-3xl text-ivory sm:text-4xl">
                {location.name}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-mist/65">{location.blurb}</p>
            </div>
            <button type="button" onClick={close} className="scroll-seal" aria-label="Close">
              <X size={16} />
            </button>
          </div>
          <PanelBody id={id} />
        </>
      )}
    </ScrollFrame>
  );
}
