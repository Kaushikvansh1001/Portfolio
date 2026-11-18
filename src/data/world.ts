export type LocationId =
  | "home"
  | "code"
  | "projects"
  | "lab"
  | "career"
  | "connect"
  | "clients";

export type ClientId = "priya-kharbanda" | "radhika-garg";

export const locations = [
  {
    id: "home" as const,
    index: "01",
    name: "My Home",
    blurb: "About me, education, and the person behind the systems.",
    prompt: "Step inside and read the developer profile.",
    art: "/vanshverse/bldg-home.webp",
    x: 760,
    width: 380,
  },
  {
    id: "code" as const,
    index: "02",
    name: "Code Station",
    blurb: "Explore the technologies I use to build applications.",
    prompt: "Open the stack I ship with.",
    art: "/vanshverse/bldg-code.webp",
    x: 1760,
    width: 310,
  },
  {
    id: "projects" as const,
    index: "03",
    name: "Project District",
    blurb: "Live platforms, backends, and shipped products.",
    prompt: "Walk the district of shipped work.",
    art: "/vanshverse/bldg-projects.webp",
    x: 2780,
    width: 540,
  },
  {
    id: "lab" as const,
    index: "04",
    name: "AI Laboratory",
    blurb: "VansoraAI — document Q&A, data analysis, and LLM integrations.",
    prompt: "Enter the laboratory.",
    art: "/vanshverse/bldg-lab.webp",
    x: 4220,
    width: 430,
  },
  {
    id: "career" as const,
    index: "05",
    name: "Career Tower",
    blurb: "Roles, companies, and dates from the path so far.",
    prompt: "Review the professional record.",
    art: "/vanshverse/bldg-tower.webp",
    x: 5080,
    width: 250,
  },
  {
    id: "clients" as const,
    index: "06",
    name: "Client Boulevard",
    blurb: "Freelance portfolio sites developed for clients.",
    prompt: "Approach a client to view their live portfolio.",
    x: 6020,
    width: 780,
  },
  {
    id: "connect" as const,
    index: "07",
    name: "Connect Hub",
    blurb: "Email, LinkedIn, GitHub, and a message form.",
    prompt: "Open a line to the developer.",
    art: "/vanshverse/bldg-hub.webp",
    x: 7100,
    width: 360,
  },
];

export const boulevardNpcs: {
  id: ClientId;
  sheet: "priya" | "radhika";
  x: number;
  flipX: boolean;
}[] = [
  { id: "priya-kharbanda", sheet: "priya", x: 5878, flipX: false },
  { id: "radhika-garg", sheet: "radhika", x: 6162, flipX: true },
];

export const WORLD = {
  width: 8000,
  height: 900,
  ground: 792,
};
