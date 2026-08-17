import type { ReactNode } from "react";
import Image from "next/image";
import styles from "@/app/page.module.css";

const IMAGE_LOGOS: Record<
  string,
  { src: string; width: number; height: number; ink?: boolean; onDark?: boolean; badge?: boolean }
> = {
  html5: { src: "/tech/html5.png", width: 240, height: 256 },
  css3: { src: "/tech/css3.png", width: 230, height: 256 },
  python: { src: "/tech/python.png", width: 320, height: 320 },
  flask: { src: "/tech/flask.png", width: 280, height: 251, ink: true },
  django: { src: "/tech/django.png", width: 631, height: 187 },
  nodejs: { src: "/tech/nodejs.png", width: 360, height: 220 },
  postgresql: { src: "/tech/postgresql.png", width: 256, height: 249 },
  mysql: { src: "/tech/mysql.png", width: 256, height: 255 },
  mongodb: { src: "/tech/mongodb.png", width: 252, height: 256 },
  aws: { src: "/tech/aws.png", width: 320, height: 196, onDark: true },
  hostinger: { src: "/tech/hostinger.png", width: 256, height: 256, badge: true },
  playstore: { src: "/tech/playstore.png", width: 231, height: 256 },
  appstore: { src: "/tech/appstore.png", width: 256, height: 256, badge: true },
  figma: { src: "/tech/figma.png", width: 170, height: 256 },
  git: { src: "/tech/git.png", width: 256, height: 256 },
  github: { src: "/tech/github.png", width: 256, height: 256 },
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
        className={[
          file.ink ? styles.techLogoInk : "",
          file.onDark ? styles.techLogoOnDark : "",
          file.badge ? styles.techLogoBadge : "",
        ]
          .filter(Boolean)
          .join(" ") || undefined}
      />
    );
  }

  switch (name) {
    case "javascript":
      return (
        <Mark>
          <rect width="48" height="48" rx="6" fill="#F7DF1E" />
          <path
            fill="#111"
            d="M27.6 35.6c.6 1.1 1.3 1.9 2.7 1.9 1.3 0 2.1-.6 2.1-1.6 0-1.1-.9-1.5-2.4-2.2l-.8-.4c-2.4-1-4-2.3-4-5 0-2.5 1.9-4.4 4.8-4.4 2.1 0 3.6.7 4.7 2.6l-2.6 1.6c-.6-1-1.2-1.4-2.1-1.4-.9 0-1.5.6-1.5 1.4 0 1 .6 1.4 2.1 2l.8.4c2.8 1.2 4.4 2.4 4.4 5.2 0 3-2.3 4.6-5.4 4.6-3 0-5-1.4-6-3.3l2.7-1.6Zm-11.2.3c.5.9 1 1.6 2.1 1.6 1.1 0 1.8-.4 1.8-2.1V22.2h3.3v13.3c0 3.4-2 5-4.8 5-2.6 0-4.1-1.3-4.9-3l2.5-1.6Z"
          />
        </Mark>
      );
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
