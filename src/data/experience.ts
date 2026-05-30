import experienceJson from "./experience.json";

export type ExperienceItem = {
  role: string;
  org: string;
  period: string;
  summary: string;
  highlights: string[];
  type: "work" | "project" | "education";
};

export const experience: ExperienceItem[] = experienceJson as ExperienceItem[];
