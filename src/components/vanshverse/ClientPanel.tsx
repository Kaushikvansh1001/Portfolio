"use client";

import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import { freelancePortfolios } from "@/data/projects";
import type { ClientId } from "@/data/world";
import ScrollFrame from "./ScrollFrame";

export default function ClientPanel({
  id,
  onClose,
}: {
  id: ClientId;
  onClose: () => void;
}) {
  const client = freelancePortfolios.find((item) => item.id === id);
  if (!client) return null;

  return (
    <ScrollFrame labelledBy="client-title" closeAria="Close client" onClose={onClose}>
      {(close) => (
        <>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.24em] text-gold">CLIENT BOULEVARD · FREELANCE WORK</p>
            <h2 id="client-title" className="mt-1 font-display text-3xl text-ivory sm:text-4xl">
              {client.name}
            </h2>
            <p className="mt-2 text-sm uppercase tracking-[0.16em] text-forest">{client.category}</p>
          </div>
          <button type="button" onClick={close} className="scroll-seal" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          {client.image ? (
            <div className="relative overflow-hidden rounded-[1.2rem] border border-gold/20 bg-void">
              <div className="relative aspect-[16/10]">
                <Image
                  src={client.image}
                  alt={`${client.name} portfolio`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 520px"
                />
              </div>
            </div>
          ) : null}
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-gold">OVERVIEW</p>
            <p className="mt-3 text-sm leading-relaxed text-mist/80">{client.description}</p>
            {"contribution" in client && client.contribution ? (
              <>
                <p className="mt-6 font-mono text-[11px] tracking-[0.22em] text-gold">CONTRIBUTION</p>
                <p className="mt-3 text-sm leading-relaxed text-mist/80">{client.contribution}</p>
              </>
            ) : null}
            {client.url ? (
              <a
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-void transition hover:brightness-110"
              >
                Visit Live Portfolio <ArrowUpRight size={15} />
              </a>
            ) : null}
          </div>
        </div>
        </>
      )}
    </ScrollFrame>
  );
}
