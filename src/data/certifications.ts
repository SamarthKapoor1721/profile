import certificationsJson from "./certifications.json";

export type Certification = {
  name: string;
  issuer: string;
  date: string; // YYYY-MM
  credentialUrl?: string;
  image: string;
  category: "AI" | "Fintech" | "Data" | "Product";
};

export const certifications: Certification[] = certificationsJson as Certification[];
