export const techCategories = [
  { id: "programming", label: "Programming" },
  { id: "backend", label: "Backend and APIs" },
  { id: "database", label: "Databases" },
  { id: "web", label: "Web Technologies" },
  { id: "cloud", label: "Cloud and Deployment" },
  { id: "tools", label: "Developer Tools" },
] as const;

export const technologies = [
  { name: "Python", logo: "python", category: "programming", blurb: "Backend services, APIs, and automation.", proof: "Used in Payroll, Raymoon, and MoonsJob." },
  { name: "JavaScript", logo: "javascript", category: "programming", blurb: "Interactive front-end and app logic.", proof: "Front-end for live client websites." },
  { name: "HTML 5", logo: "html5", category: "web", blurb: "Semantic structure for live websites.", proof: "Markup across the public sites." },
  { name: "CSS 3", logo: "css3", category: "web", blurb: "Layout, motion, and visual polish.", proof: "Layout and motion on shipped pages." },
  { name: "Flask", logo: "flask", category: "backend", blurb: "Lightweight Python APIs and dashboards.", proof: "APIs and dashboards for Raymoon and Payroll." },
  { name: "Django", logo: "django", category: "backend", blurb: "Structured web apps and admin workflows.", proof: "Structured Python web applications." },
  { name: "Node.js", logo: "nodejs", category: "backend", blurb: "JavaScript services and tooling.", proof: "Services and tooling around live sites." },
  { name: "PostgreSQL", logo: "postgresql", category: "database", blurb: "Relational data models and queries.", proof: "Data layer for client dashboards." },
  { name: "MySQL", logo: "mysql", category: "database", blurb: "Production databases for web apps.", proof: "Production data for web apps." },
  { name: "MongoDB", logo: "mongodb", category: "database", blurb: "Document storage for flexible data.", proof: "Flexible records when the schema changes." },
  { name: "AWS", logo: "aws", category: "cloud", blurb: "Cloud hosting and EC2 deployments.", proof: "EC2 hosting for production apps." },
  { name: "Hostinger", logo: "hostinger", category: "cloud", blurb: "Live site hosting and server setup.", proof: "Live deploys for client websites." },
  { name: "Play Store", logo: "playstore", category: "cloud", blurb: "Android app publishing.", proof: "Android releases at Raymoon." },
  { name: "Git", logo: "git", category: "tools", blurb: "Version control and collaboration.", proof: "Daily version control on every project." },
  { name: "GitHub", logo: "github", category: "tools", blurb: "Repos, reviews, and shipping code.", proof: "Repos and shipping for live work." },
] as const;
