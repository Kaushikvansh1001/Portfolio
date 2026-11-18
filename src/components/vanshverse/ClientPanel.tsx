"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { freelancePortfolios } from "@/data/projects";
import type { ClientId } from "@/data/world";
import CodexFrame from "./CodexFrame";

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
    <CodexFrame
      labelledBy="client-title"
      closeAria="Close client"
      kicker="Client Boulevard · Freelance work"
      title={client.name}
      subtitle={client.category}
      onClose={onClose}
      footer={<p className="codex-hint">Esc to return to Client Boulevard</p>}
    >
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        {client.image ? (
          <div className="codex-frame">
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
          <p className="codex-rule">
            <span>Overview</span>
            <i />
          </p>
          <p className="codex-copy">{client.description}</p>
          {"contribution" in client && client.contribution ? (
            <>
              <p className="codex-rule mt-8">
                <span>Contribution</span>
                <i />
              </p>
              <p className="codex-copy">{client.contribution}</p>
            </>
          ) : null}
          {client.url ? (
            <a href={client.url} target="_blank" rel="noopener noreferrer" className="codex-link">
              Visit live portfolio <ArrowUpRight size={15} />
            </a>
          ) : null}
        </div>
      </div>
    </CodexFrame>
  );
}
