import type { ReactNode } from "react";
import Image from "next/image";
import styles from "@/app/page.module.css";

const IMAGE_LOGOS: Record<
  string,
  { src: string; width: number; height: number; badge?: boolean }
> = {
  html5: { src: "/tech/html5.png", width: 512, height: 512 },
  css3: { src: "/tech/css3.png", width: 512, height: 512 },
  javascript: { src: "/tech/javascript.png", width: 512, height: 512 },
  python: { src: "/tech/python.png", width: 512, height: 512 },
  flask: { src: "/tech/flask.png", width: 512, height: 512 },
  django: { src: "/tech/django.png", width: 512, height: 512 },
  nodejs: { src: "/tech/nodejs.png", width: 512, height: 512 },
  postgresql: { src: "/tech/postgresql.png", width: 512, height: 512 },
  mysql: { src: "/tech/mysql.png", width: 512, height: 512 },
  mongodb: { src: "/tech/mongodb.png", width: 512, height: 512 },
  aws: { src: "/tech/aws.png", width: 512, height: 512 },
  hostinger: { src: "/tech/hostinger.png", width: 512, height: 512 },
  playstore: { src: "/tech/playstore.png", width: 512, height: 512 },
  appstore: { src: "/tech/appstore.png", width: 256, height: 256, badge: true },
  figma: { src: "/tech/figma.png", width: 170, height: 256 },
  git: { src: "/tech/git.png", width: 512, height: 512 },
  github: { src: "/tech/github.png", width: 512, height: 512 },
};

function Mark({
  children,
  viewBox = "0 0 48 48",
}: {
  children: ReactNode;
  viewBox?: string;
}) {
  return (
    <svg viewBox={viewBox} fill="none" aria-hidden>
      {children}
    </svg>
  );
}

export function TechLogo({ name }: { name: string }) {
  const file = IMAGE_LOGOS[name];
  if (file) {
    return (
      <Image
        src={file.src}
        alt=""
        width={file.width}
        height={file.height}
        className={file.badge ? styles.techLogoBadge : undefined}
      />
    );
  }

  switch (name) {
    default:
      return (
        <Mark>
          <rect width="48" height="48" rx="10" fill="currentColor" opacity="0.15" />
        </Mark>
      );
  }
}

export function TechTabIcon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    "aria-hidden": true,
  } as const;

  switch (name) {
    case "languages":
      return (
        <svg {...common}>
          <path d="m8 8-5 4 5 4M16 8l5 4-5 4M13 5l-2 14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "database":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="6.5" rx="7" ry="2.8" />
          <path d="M5 6.5v11c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8v-11" />
          <path d="M5 12c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8" />
        </svg>
      );
    case "devops":
      return (
        <svg {...common}>
          <path d="M7 17h11a4 4 0 0 0 .4-8 5.5 5.5 0 0 0-10.6-1.2A3.8 3.8 0 0 0 7 17Z" />
        </svg>
      );
    case "uiux":
      return (
        <svg {...common}>
          <path d="m14 5 5 5-11 11H3v-5L14 5Z" strokeLinejoin="round" />
          <path d="m12 7 5 5" />
        </svg>
      );
    case "tools":
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 0 0-5.5 5.5L4 17l3 3 5.2-5.2a4 4 0 0 0 5.5-5.5l-2.4 2.4-2.3-2.3 2.4-2.4Z" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}
