// Data dictionary for Heuristic Client-Side Resume Analysis

export const ACTION_VERBS = {
  leadership: [
    "spearheaded", "orchestrated", "championed", "directed", "executed",
    "founded", "guided", "initiated", "led", "managed", "navigated",
    "overhauled", "pioneered", "steered", "supervised", "streamlined"
  ],
  technical: [
    "architected", "engineered", "developed", "deployed", "implemented",
    "automated", "refactored", "optimized", "built", "configured",
    "debugged", "designed", "integrated", "programmed", "migrated"
  ],
  analytical: [
    "analyzed", "benchmarked", "calculated", "evaluated", "forecasted",
    "identified", "investigated", "measured", "modeled", "quantified",
    "researched", "tested", "validated", "audited", "diagnosed"
  ],
  impact: [
    "accelerated", "boosted", "maximized", "minimized", "reduced",
    "increased", "expanded", "generated", "improved", "transformed",
    "scaled", "slashed", "elevated", "enhanced", "doubled"
  ]
};

export const ALL_ACTION_VERBS = new Set([
  ...ACTION_VERBS.leadership,
  ...ACTION_VERBS.technical,
  ...ACTION_VERBS.analytical,
  ...ACTION_VERBS.impact
]);

export const WEAK_WORDS = [
  { word: "worked on", suggestion: "Replace with 'engineered', 'built', or 'executed'" },
  { word: "responsible for", suggestion: "Replace with 'spearheaded', 'managed', or 'directed'" },
  { word: "helped", suggestion: "Replace with 'collaborated on', 'assisted in', or 'contributed to'" },
  { word: "assisted with", suggestion: "Replace with 'supported', 'facilitated', or 'co-developed'" },
  { word: "handled", suggestion: "Replace with 'managed', 'resolved', or 'administered'" },
  { word: "did", suggestion: "Replace with 'executed', 'performed', or 'conducted'" },
  { word: "team player", suggestion: "Demonstrate teamwork with action verbs rather than self-labeling" },
  { word: "hard worker", suggestion: "Focus on measurable accomplishments instead of subjective terms" },
  { word: "detail oriented", suggestion: "Show precision through error reduction or quality metrics" },
  { word: "go-to person", suggestion: "Replace with 'subject matter expert' or highlight leadership" }
];

export const SKILL_CATEGORIES = {
  "Frontend & UI": [
    "react", "react.js", "vue", "angular", "next.js", "typescript", "javascript",
    "html5", "css3", "tailwind", "tailwindcss", "redux", "webpack", "vite", "bootstrap"
  ],
  "Backend & APIs": [
    "node.js", "express", "python", "django", "flask", "fastapi", "java", "spring boot",
    "c#", ".net", "go", "golang", "ruby", "rails", "graphql", "rest api", "microservices"
  ],
  "Database & Cloud": [
    "postgresql", "mysql", "mongodb", "redis", "firebase", "aws", "azure", "gcp",
    "docker", "kubernetes", "terraform", "ci/cd", "github actions", "sqlite"
  ],
  "Data & AI / ML": [
    "python", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "sql",
    "tableau", "power bi", "data visualization", "machine learning", "nlp", "r"
  ],
  "Management & Agile": [
    "agile", "scrum", "jira", "confluence", "product management", "stakeholder management",
    "roadmap creation", "a/b testing", "user research", "kpi tracking"
  ],
  "Soft Skills": [
    "communication", "leadership", "problem solving", "critical thinking",
    "time management", "cross-functional collaboration", "adaptability", "mentorship"
  ]
};

export const STANDARD_SECTION_HEADERS = [
  { key: "summary", patterns: [/summary/i, /profile/i, /about me/i, /objective/i] },
  { key: "experience", patterns: [/experience/i, /work history/i, /employment/i, /professional experience/i] },
  { key: "education", patterns: [/education/i, /academic background/i, /degrees/i] },
  { key: "skills", patterns: [/skills/i, /technical skills/i, /competencies/i, /technologies/i] },
  { key: "projects", patterns: [/projects/i, /key projects/i, /personal projects/i] },
  { key: "certifications", patterns: [/certifications/i, /licenses/i, /courses/i] }
];

export const BULLET_REWRITE_TEMPLATES = [
  {
    pattern: /worked on|helped|did|built/i,
    templates: [
      "Architected and implemented high-performance {topic}, resulting in a 35% improvement in processing efficiency.",
      "Spearheaded the development of {topic}, driving user adoption up by 40% within the first quarter.",
      "Engineered end-to-end solutions for {topic}, decreasing operational latency and reducing system downtime by 25%."
    ]
  },
  {
    pattern: /managed|handled|led/i,
    templates: [
      "Directly led a cross-functional team of 6+ engineers to deliver {topic} 2 weeks ahead of schedule.",
      "Orchestrated operational workflows for {topic}, increasing team productivity by 30% while maintaining zero defects.",
      "Championed the roadmap for {topic}, aligning stakeholder objectives and delivering scalable business value."
    ]
  },
  {
    pattern: /analyzed|researched|tested/i,
    templates: [
      "Analyzed key metrics across {topic}, identifying data-driven optimization opportunities that generated $15k in cost savings.",
      "Benchmarked system performance for {topic}, elevating baseline quality scores from 78% to 96%.",
      "Executed comprehensive diagnostic testing on {topic}, mitigating critical vulnerabilities and enhancing security compliance."
    ]
  }
];
