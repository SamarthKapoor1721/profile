export type SkillCategory = {
  id: string;
  label: string;
  items: { name: string; level: number }[]; // level 0–100
};

export const skills: SkillCategory[] = [
  {
    id: "data-science",
    label: "Data Science & ML",
    items: [
      { name: "Python", level: 92 },
      { name: "Pandas / NumPy", level: 90 },
      { name: "scikit-learn", level: 84 },
      { name: "PyTorch", level: 72 },
      { name: "SQL", level: 88 },
      { name: "Statistics", level: 80 },
    ],
  },
  {
    id: "fintech",
    label: "Fintech & Markets",
    items: [
      { name: "Payments Infrastructure", level: 82 },
      { name: "Capital Markets", level: 78 },
      { name: "Risk & Compliance", level: 70 },
      { name: "Quant Research", level: 74 },
      { name: "Financial Modeling", level: 80 },
    ],
  },
  {
    id: "engineering",
    label: "Engineering & Product",
    items: [
      { name: "React / Next.js", level: 88 },
      { name: "Node.js / APIs", level: 80 },
      { name: "Java / DSA", level: 82 },
      { name: "Product Strategy", level: 86 },
      { name: "AI Product Management", level: 90 },
    ],
  },
];
