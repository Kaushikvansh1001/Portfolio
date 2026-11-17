export type Project = {
  id: string;
  name: string;
  category: string;
  description: string;
  url?: string;
  featured: boolean;
  accent: string;
  image?: string;
  images?: string[];
  year?: string;
  showcase?: "poster";
  stack?: string[];
};

export const projects: Project[] = [
  {
    id: "vansora-ai",
    name: "VansoraAI",
    category: "AI Laboratory",
    description:
      "Document question answering, spreadsheet/data analysis, and LLM integrations.",
    featured: true,
    accent: "#A987E8",
    stack: ["Next.js", "FastAPI", "Python", "Supabase"],
  },
  {
    id: "moonsjob-app",
    name: "MoonsJob App",
    category: "Mobile App",
    description: "MoonsJob Android app published on the Google Play Store.",
    url: "https://play.google.com/store/apps/details?id=com.moonsjob.app",
    featured: true,
    year: "2026",
    accent: "#34a853",
    showcase: "poster",
    image: "/projects/moonsjob-app/phone_app.png",
  },
  {
    id: "moonsjob",
    name: "MoonsJob",
    category: "Recruitment Platform",
    description:
      "Full-stack recruitment platform connecting job seekers and recruiters, with job listings, applications, and recruitment management.",
    url: "https://moonsjob.com",
    featured: true,
    year: "2026",
    accent: "#2f6fed",
    image: "/projects/moonsjob/landing.png",
    images: [
      "/projects/moonsjob/landing.png",
      "/projects/moonsjob/dashboard.png",
      "/projects/moonsjob/jobs.png",
    ],
  },
  {
    id: "raymoon-services",
    name: "Raymoon Services",
    category: "Recruitment / Backend",
    description:
      "Backend-driven recruitment platform with database integration and production deployment.",
    url: "https://raymoongroup.com",
    featured: true,
    year: "2026",
    accent: "#c9a227",
    image: "/projects/raymoon/hero.png",
    images: [
      "/projects/raymoon/hero.png",
      "/projects/raymoon/connect.png",
      "/projects/raymoon/hr.png",
    ],
  },
  {
    id: "payroll",
    name: "Payroll Management Web App",
    category: "HR / Payroll",
    description: "Web-based employee and payroll management system.",
    url: "https://raymoon.in",
    featured: true,
    year: "2026",
    accent: "#d97706",
    image: "/projects/payroll/dashboard.png",
    images: [
      "/projects/payroll/dashboard.png",
      "/projects/payroll/employees.png",
      "/projects/payroll/payroll.png",
    ],
  },
  {
    id: "aerotech-inventory",
    name: "Aerotech Inventory System",
    category: "Inventory",
    description:
      "Inventory management system for tracking products, stock, and transactions.",
    featured: false,
    accent: "#5b6cff",
    image: "/projects/aerotech/dashboard.png",
    images: [
      "/projects/aerotech/dashboard.png",
      "/projects/aerotech/parts.png",
      "/projects/aerotech/add-parts.png",
    ],
  },
  {
    id: "raymoon-admin",
    name: "Admin Panel for Raymoon Website",
    category: "Content Management",
    description:
      "Admin panel to create, edit, and delete job postings and blogs shown on the Raymoon homepage.",
    url: "https://raymoongroup.com/admin/",
    featured: false,
    year: "2026",
    accent: "#0f766e",
    image: "/projects/raymoon-admin/login.png",
    images: [
      "/projects/raymoon-admin/login.png",
      "/projects/raymoon-admin/blogs.png",
      "/projects/raymoon-admin/jobs.png",
    ],
  },
  {
    id: "raymoon-aerotech",
    name: "Raymoon Aerotech",
    category: "Aviation Platform",
    description:
      "Responsive aviation platform with business enquiry workflows and backend integration.",
    url: "https://raymoonaerotech.com",
    featured: true,
    accent: "#1f8a70",
    image: "/projects/novastraa/hero.png",
    images: [
      "/projects/novastraa/hero.png",
      "/projects/novastraa/contact.png",
      "/projects/novastraa/products.png",
    ],
  },
  {
    id: "email-reminder",
    name: "Client Email Reminder System",
    category: "Automation",
    description:
      "Flask-based application for client deadlines and automated email reminders.",
    featured: false,
    year: "2024",
    accent: "#0ea5e9",
    stack: ["Flask"],
  },
  {
    id: "asia-go",
    name: "Asia Go Travels",
    category: "Travel",
    description:
      "Travel platform featuring destinations, packages, and enquiry management.",
    url: "https://asiagotravels.com",
    featured: true,
    accent: "#0891b2",
    image: "/projects/asiago/hero.png",
    images: [
      "/projects/asiago/hero.png",
      "/projects/asiago/packages.png",
      "/projects/asiago/safari.png",
    ],
  },
  {
    id: "devnexus",
    name: "DevNexus Solutions",
    category: "Agency Website",
    description:
      "Digital solutions platform for web, mobile, UI/UX, CRM, blockchain, and AI services.",
    url: "https://devnexussolutions.com",
    featured: false,
    year: "2025",
    accent: "#334155",
    image: "/projects/devnexus/hero.png",
    images: [
      "/projects/devnexus/hero.png",
      "/projects/devnexus/funnel.png",
      "/projects/devnexus/blogs.png",
    ],
  },
  {
    id: "a2-travels",
    name: "A2 Travels CRM",
    category: "CRM / Backend",
    description:
      "Travel CRM backend with role-based access for Super Admins and Agents, bookings, and custom itinerary workflows.",
    featured: false,
    accent: "#b45309",
  },
];

export const freelancePortfolios = [
  {
    id: "priya-kharbanda" as const,
    name: "Priya Kharbanda",
    category: "Designer Portfolio",
    description:
      "Live personal site with selected work, process, services, and contact.",
    contribution: "Freelance portfolio website developed for the client.",
    url: "https://priya-kharbanda-awe7.vercel.app/",
    image: "/projects/priya-kharbanda/hero.png",
    accent: "#c6a15b",
  },
  {
    id: "radhika-garg" as const,
    name: "Radhika Garg",
    category: "UI/UX & Product Design",
    description:
      "Live personal site with selected work, process, toolkit, and contact.",
    contribution: "Freelance portfolio website developed for the client.",
    url: "https://radhika-portfolio-bice.vercel.app/",
    image: "/projects/radhika-garg/hero.png",
    accent: "#8b5a2b",
  },
] as const;

export const featuredProjects = projects.filter((project) => project.featured);
export const moreProjects = projects.filter((project) => !project.featured);
export const vansora = projects.find((project) => project.id === "vansora-ai")!;
