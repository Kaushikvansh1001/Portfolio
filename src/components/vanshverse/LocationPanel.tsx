"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, FileDown, Mail } from "lucide-react";
import { IconGithub, IconLinkedin } from "@/components/Icons";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { highlights, profile } from "@/data/profile";
import { vansora } from "@/data/projects";
import { technologies } from "@/data/skills";
import { locations, type LocationId } from "@/data/world";
import CodexFrame from "./CodexFrame";
import ContactPanel from "./ContactPanel";
import ProjectShowcase from "./ProjectShowcase";

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

const ARCHIVE = locations.filter((item) => item.id !== "clients");

function HomeBody() {
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-10">
      <figure className="mx-auto w-full max-w-[18rem] sm:max-w-sm lg:order-1">
        <div className="codex-frame">
          <div className="relative aspect-[3/4] max-h-[22rem] overflow-hidden sm:max-h-none">
            <Image
              src={profile.portrait}
              alt={`${profile.name} portrait`}
              fill
              className="object-cover object-[center_18%]"
              sizes="(max-width: 1024px) 80vw, 320px"
              priority
            />
          </div>
        </div>
        <figcaption className="mt-3 px-1 font-mono text-[11px] tracking-[0.2em] text-gold">
          {profile.location}
        </figcaption>
      </figure>
      <div className="lg:order-2">
        <p className="font-mono text-[12px] tracking-[0.26em] text-gold">{profile.title}</p>
        <h3 className="mt-2 font-intro text-3xl leading-none text-ivory sm:text-5xl">{profile.name}</h3>
        <p className="codex-copy mt-5">{profile.aboutBody}</p>
        <ul className="mt-7 grid gap-3 sm:grid-cols-2">
          {highlights.map((item) => (
            <li key={item} className="flex items-start gap-3 border border-steel bg-indigo/40 px-3 py-3 text-[0.95rem] leading-snug text-ivory">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-gold" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-9">
          <p className="codex-rule">
            <span>Education</span>
            <i />
          </p>
          <div className="space-y-5">
            {education.map((item) => (
              <div key={item.degree} className="grid gap-1 sm:grid-cols-[8.5rem_1fr]">
                <p className="font-mono text-[12px] text-gold">{item.period}</p>
                <div>
                  <h4 className="font-intro text-2xl text-ivory">{item.degree}</h4>
                  <p className="mt-1 text-base text-ash">
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
    <div className="space-y-9">
      {SKILL_GROUPS.map((group) => {
        const items = technologies.filter((tech) => tech.category === group.id);
        if (!items.length) return null;
        return (
          <section key={group.id}>
            <p className="codex-rule">
              <span>{group.label}</span>
              <i />
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {items.map((tech) => (
                <li key={tech.name} className="flex items-start gap-3 border border-steel bg-indigo/35 px-3 py-3">
                  <Image src={`/tech/${tech.logo}.png`} alt="" width={32} height={32} className="mt-0.5 h-8 w-8 object-contain" />
                  <div>
                    <h4 className="font-intro text-xl text-ivory">{tech.name}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-ash">{tech.blurb}</p>
                  </div>
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
    <div className="space-y-9">
      <div>
        <p className="font-mono text-[12px] tracking-[0.24em] text-teal">{vansora.category}</p>
        <h3 className="mt-2 font-intro text-4xl text-ivory">{vansora.name}</h3>
        <p className="codex-copy mt-4">{vansora.description}</p>
      </div>
      <div>
        <p className="codex-rule">
          <span>Architecture</span>
          <i />
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {nodes.map((node) => (
            <article key={node.title} className="border border-teal/30 bg-indigo/40 px-4 py-5">
              <h4 className="font-intro text-2xl text-teal">{node.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-ash">{node.copy}</p>
            </article>
          ))}
        </div>
      </div>
      <div>
        <p className="codex-rule">
          <span>Capabilities</span>
          <i />
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          {capabilities.map((item) => (
            <article key={item.title} className="border-l-2 border-teal/60 pl-4">
              <h4 className="font-intro text-2xl text-ivory">{item.title}</h4>
              <p className="mt-2 text-base leading-relaxed text-ash">{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function CareerBody() {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = listRef.current?.querySelectorAll("li");
    if (!items?.length) return;
    const tween = gsap.fromTo(
      items,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.32, stagger: 0.08, ease: "power2.out" },
    );
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <ol ref={listRef} className="relative space-y-8 border-l border-gold/35 pl-8">
      {experience.map((job, index) => (
        <li key={`${job.company}-${job.role}`} className="relative">
          <span className="absolute -left-[2.35rem] top-1 flex h-7 w-7 items-center justify-center rounded-full border border-gold bg-void font-mono text-[11px] text-gold">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="font-mono text-[12px] tracking-[0.16em] text-gold">{job.period}</p>
          <h4 className="mt-1 font-intro text-3xl text-ivory">{job.role}</h4>
          <p className="mt-1 text-base text-ash">{job.company}</p>
          <ul className="mt-3 space-y-2 text-base leading-relaxed text-ivory/90">
            {job.points.map((point) => (
              <li key={point} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 bg-gold" />
                <span>{point}</span>
              </li>
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
    <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
      <div>
        <p className="codex-rule">
          <span>Direct lines</span>
          <i />
        </p>
        <div className="grid gap-3">
          {links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-center gap-4 border border-steel bg-indigo/40 px-4 py-4 transition hover:border-gold"
            >
              <item.icon className="h-5 w-5 text-gold" />
              <span>
                <span className="block font-intro text-xl text-ivory">{item.label}</span>
                <span className="mt-0.5 block font-mono text-[12px] text-ash">{item.detail}</span>
              </span>
            </a>
          ))}
        </div>
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
  onNavigate,
}: {
  id: LocationId;
  onClose: () => void;
  onNavigate?: (id: LocationId) => void;
}) {
  const location = locations.find((item) => item.id === id);
  if (!location) return null;

  const archiveIndex = ARCHIVE.findIndex((item) => item.id === id);
  const previous = archiveIndex >= 0 ? ARCHIVE[(archiveIndex - 1 + ARCHIVE.length) % ARCHIVE.length] : null;
  const next = archiveIndex >= 0 ? ARCHIVE[(archiveIndex + 1) % ARCHIVE.length] : null;
  const tone = id === "lab" || id === "connect" ? "teal" : "gold";

  return (
    <CodexFrame
      labelledBy="location-title"
      closeAria="Close location"
      kicker={`Location ${location.index} · ${CATEGORY[id]}`}
      title={location.name}
      subtitle={location.blurb}
      tone={tone}
      onClose={onClose}
      footer={
        <>
          <p className="codex-hint">Esc to close · {location.index} / 07</p>
          {previous && next && onNavigate ? (
            <div className="codex-nav">
              <button type="button" onClick={() => onNavigate(previous.id)}>
                <small>Previous</small>
                <span className="inline-flex items-center gap-2">
                  <ArrowLeft size={14} /> {previous.name}
                </span>
              </button>
              <button type="button" onClick={() => onNavigate(next.id)}>
                <small>Next</small>
                <span className="inline-flex items-center gap-2">
                  {next.name} <ArrowRight size={14} />
                </span>
              </button>
            </div>
          ) : null}
        </>
      }
    >
      <PanelBody id={id} />
    </CodexFrame>
  );
}
