"use client";

import Link from "next/link";
import Image from "next/image";
import { FileDown } from "lucide-react";
import { profile } from "@/data/profile";

export default function SiteNav() {
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

      <a
        href={profile.resumeFile}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-gold px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-void transition hover:brightness-110"
      >
        <FileDown size={13} />
        Resume
      </a>
    </header>
  );
}
