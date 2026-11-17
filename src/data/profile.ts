export const profile = {
  name: "Vansh Kaushik",
  firstName: "Vansh",
  lastName: "Kaushik",
  title: "Software Development Engineer",
  shortTitle: "Software Development Engineer",
  location: "Gurugram, Haryana",
  phone: "+91 97110 34055",
  email: "vanshkaushik1802@gmail.com",
  github: "https://github.com/Kaushikvansh1001",
  githubHandle: "Kaushikvansh1001",
  linkedin: "https://www.linkedin.com/in/vanshkaushik7776",
  behance: "https://www.behance.net/vanshkaushik6",
  resumeFile: "/VanshKaushik_Resume.pdf",
  heroPhoto: "/vansh-hero.png",
  portrait: "/vansh-portrait.png",
  cutout: "/vansh-cutout.png",
  tagline: "Turning ideas into powerful digital experiences.",
  summary:
    "Python Developer with experience building backend applications, database-driven systems, and automation solutions using Python, Flask, PostgreSQL, and MySQL. Skilled in deploying web and mobile applications on AWS and Hostinger, with strong UI/UX instincts for intuitive products.",
  heroBio:
    "I build reliable backend systems, REST APIs, and production-ready applications with Python, Flask, and modern databases — then ship them live on AWS and Hostinger.",
  aboutHeadline: "Building backend systems that ship and scale.",
  aboutBody:
    "From Flask dashboards and automated email systems to live recruitment and aviation platforms, I focus on clean APIs, solid databases, and deployments that hold up in production. I also bring UI/UX awareness so products feel as good as they perform.",
  universe: {
    name: "VANSHVERSE",
    tagline: "YOUR CAREER. YOUR WORLD. YOUR STORY.",
    headline: "A WORLD BUILT WITH CODE.",
    subtitle: "Software Engineer | Python | Backend | Cloud | AI",
  },
};

export const socials = [
  {
    id: "linkedin",
    name: "LinkedIn",
    detail: "vanshkaushik7776",
    href: profile.linkedin,
  },
  {
    id: "github",
    name: "GitHub",
    detail: profile.githubHandle,
    href: profile.github,
  },
  {
    id: "phone",
    name: "Phone",
    detail: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, "")}`,
  },
  {
    id: "gmail",
    name: "Gmail",
    detail: profile.email,
    href: `mailto:${profile.email}`,
  },
] as const;

export const highlights = [
  "Clean & Efficient Backend Code",
  "REST APIs & Database Design",
  "AWS & Hostinger Deployments",
  "Great User Experience Mindset",
];

export const stats = [
  { value: "10+", label: "Projects Completed" },
  { value: "2+", label: "Years Experience" },
  { value: "8+", label: "Live Web Apps" },
  { value: "100%", label: "Delivery Focus" },
];

export const heroStats = [
  { value: "2", suffix: "+", label: "Years Experience" },
  { value: "10", suffix: "+", label: "Projects Completed" },
  { value: "8", suffix: "+", label: "Live Web Apps" },
];
