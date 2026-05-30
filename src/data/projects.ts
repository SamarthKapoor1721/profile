import projectsJson from "./projects.json";

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  problem: string;
  approach: string;
  stack: string[];
  impact: string[];
  category: string;
  year: string;
  image?: string;
  links?: { github?: string; demo?: string; paper?: string };
};

export const projects: Project[] = projectsJson as Project[];
