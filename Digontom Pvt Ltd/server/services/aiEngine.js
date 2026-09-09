// Comprehensive AI Resume NLP Engine (Local AI / Heuristics)
import natural from 'natural';

const TfIdf = natural.TfIdf;

// Action Verbs Dictionary
export const ACTION_VERBS = {
  leadership: [
    "spearheaded", "orchestrated", "championed", "directed", "executed",
    "founded", "guided", "initiated", "led", "managed", "navigated",
    "overhauled", "pioneered", "steered", "supervised", "streamlined",
    "governed", "mobilized", "empowered", "mentored"
  ],
  technical: [
    "architected", "engineered", "developed", "deployed", "implemented",
    "automated", "refactored", "optimized", "built", "configured",
    "debugged", "designed", "integrated", "programmed", "migrated",
    "provisioned", "virtualized", "scaled", "containerized", "secured"
  ],
  analytical: [
    "analyzed", "benchmarked", "calculated", "evaluated", "forecasted",
    "identified", "investigated", "measured", "modeled", "quantified",
    "researched", "tested", "validated", "audited", "diagnosed",
    "discovered", "synthesized", "simulated", "surveyed"
  ],
  impact: [
    "accelerated", "boosted", "maximized", "minimized", "reduced",
    "increased", "expanded", "generated", "improved", "transformed",
    "slashed", "elevated", "enhanced", "doubled", "tripled", "yielded"
  ]
};

export const ALL_ACTION_VERBS = new Set([
  ...ACTION_VERBS.leadership,
  ...ACTION_VERBS.technical,
  ...ACTION_VERBS.analytical,
  ...ACTION_VERBS.impact
]);

export const WEAK_WORDS = [
  { word: "worked on", suggestion: "Replace with 'architected', 'engineered', or 'executed'" },
  { word: "responsible for", suggestion: "Replace with 'spearheaded', 'managed', or 'directed'" },
  { word: "helped", suggestion: "Replace with 'collaborated on', 'assisted in', or 'co-developed'" },
  { word: "assisted with", suggestion: "Replace with 'supported', 'facilitated', or 'co-delivered'" },
  { word: "handled", suggestion: "Replace with 'managed', 'administered', or 'resolved'" },
  { word: "did", suggestion: "Replace with 'executed', 'performed', or 'conducted'" },
  { word: "tried", suggestion: "Replace with 'evaluated', 'tested', or 'piloted'" },
  { word: "team player", suggestion: "Demonstrate collaboration through team accomplishments rather than buzzwords" },
  { word: "hard worker", suggestion: "Focus on measurable results, efficiency metrics, and delivered value" },
  { word: "detail oriented", suggestion: "Show precision through error reduction, code review stats, or QA metrics" },
  { word: "go-to person", suggestion: "Replace with 'subject matter expert' or highlight technical leadership" },
  { word: "various", suggestion: "Specify exact technologies, clients, or product lines instead" }
];

export const SKILL_CATEGORIES = {
  "Frontend & UI": [
    "react", "react.js", "vue", "vue.js", "angular", "next.js", "nuxt.js", "typescript",
    "javascript", "html5", "css3", "tailwind", "tailwindcss", "redux", "redux toolkit",
    "webpack", "vite", "bootstrap", "sass", "scss", "mui", "shadcn", "svelte"
  ],
  "Backend & APIs": [
    "node.js", "express", "express.js", "python", "django", "flask", "fastapi", "java",
    "spring boot", "c#", ".net", "go", "golang", "ruby", "rails", "graphql", "rest api",
    "restful", "microservices", "grpc", "websocket", "socket.io", "kafka", "rabbitmq"
  ],
  "Database & Storage": [
    "postgresql", "mysql", "mongodb", "redis", "firebase", "supabase", "sqlite",
    "elasticsearch", "dynamodb", "cassandra", "prisma", "mongoose", "typeorm", "oracle"
  ],
  "Cloud & DevOps": [
    "aws", "amazon web services", "azure", "gcp", "google cloud", "docker", "kubernetes",
    "terraform", "ci/cd", "github actions", "gitlab ci", "jenkins", "linux", "nginx",
    "ansible", "helm", "serverless", "ec2", "s3", "lambda"
  ],
  "Data & AI / ML": [
    "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "sql", "tableau",
    "power bi", "data visualization", "machine learning", "deep learning", "nlp",
    "large language models", "llm", "opencv", "spark", "hadoop", "r", "keras"
  ],
  "Testing & Quality": [
    "jest", "cypress", "playwright", "mocha", "chai", "selenium", "postman",
    "unit testing", "integration testing", "e2e testing", "tdd", "sonarqube"
  ],
  "Methodologies & Management": [
    "agile", "scrum", "kanban", "jira", "confluence", "product management",
    "stakeholder management", "roadmap creation", "a/b testing", "user research", "kpi"
  ],
  "Soft Skills": [
    "leadership", "mentorship", "communication", "problem solving", "critical thinking",
    "cross-functional collaboration", "adaptability", "conflict resolution"
  ]
};

export const STANDARD_SECTION_HEADERS = [
  { key: "Contact Info", patterns: [/contact/i, /personal info/i, /phone/i, /email/i] },
  { key: "Summary", patterns: [/summary/i, /profile/i, /about me/i, /objective/i, /overview/i] },
  { key: "Experience", patterns: [/experience/i, /work history/i, /employment/i, /professional experience/i, /career history/i] },
  { key: "Education", patterns: [/education/i, /academic/i, /degrees/i, /university/i, /college/i] },
  { key: "Skills", patterns: [/skills/i, /technical skills/i, /competencies/i, /core technologies/i, /tech stack/i] },
  { key: "Projects", patterns: [/projects/i, /key projects/i, /personal projects/i, /portfolio/i] },
  { key: "Certifications", patterns: [/certifications/i, /licenses/i, /credentials/i, /courses/i] }
];

// Readability Index (Flesch Reading Ease approximation)
function calculateReadability(text) {
  const words = text.match(/\b[a-zA-Z]+\b/g) || [];
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  if (words.length === 0 || sentences.length === 0) return 75;

  const totalWords = words.length;
  const totalSentences = Math.max(sentences.length, 1);

  // Approximate syllable count
  let syllables = 0;
  words.forEach(w => {
    const word = w.toLowerCase();
    if (word.length <= 3) {
      syllables += 1;
      return;
    }
    const matches = word.match(/[aeiouy]{1,2}/g);
    syllables += matches ? matches.length : 1;
  });

  const wordsPerSentence = totalWords / totalSentences;
  const syllablesPerWord = syllables / totalWords;

  // Flesch Reading Ease Formula
  const score = 206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord);
  return Math.max(10, Math.min(100, Math.round(score)));
}

// Extract Candidate Name heuristic
function extractCandidateName(cleanText, lines) {
  for (const line of lines.slice(0, 5)) {
    const trimmed = line.trim();
    // Names typically 2 to 4 words, alphabetic, not an email/header
    if (
      trimmed.length >= 3 &&
      trimmed.length <= 40 &&
      /^[A-Z][a-zA-Z'.-]+(\s+[A-Z][a-zA-Z'.-]+){1,3}$/.test(trimmed) &&
      !/summary|experience|curriculum|resume|contact|engineer|developer/i.test(trimmed)
    ) {
      return trimmed;
    }
  }
  // Fallback first line
  if (lines.length > 0 && lines[0].length < 50 && !/@/.test(lines[0])) {
    return lines[0].replace(/[^a-zA-Z\s]/g, '').trim() || 'Candidate';
  }
  return 'Candidate';
}

// Main AI Analyzer function
export const runAIAnalysis = (resumeText, jobDescription = '', fileName = 'resume.txt') => {
  if (!resumeText || resumeText.trim().length === 0) {
    throw new Error('Resume text cannot be empty');
  }

  const cleanText = resumeText.trim();
  const lines = cleanText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const words = cleanText.toLowerCase().match(/\b[a-z0-9+#.-]+\b/g) || [];
  const wordCount = words.length;
  const lineCount = lines.length;

  // 1. Contact & Socials Extraction
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i;
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i;
  const portfolioRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:dev|io|me|app|site|tech|com|org))(?:\/[^\s]*)?/i;

  const emailMatch = cleanText.match(emailRegex);
  const phoneMatch = cleanText.match(phoneRegex);
  const linkedinMatch = cleanText.match(linkedinRegex);
  const githubMatch = cleanText.match(githubRegex);
  const portfolioMatch = cleanText.match(portfolioRegex);

  const candidateEmail = emailMatch ? emailMatch[0] : '';
  const candidatePhone = phoneMatch ? phoneMatch[0] : '';
  const linkedinUrl = linkedinMatch ? linkedinMatch[0] : '';
  const githubUrl = githubMatch ? githubMatch[0] : '';
  const portfolioUrl = portfolioMatch && !portfolioMatch[0].includes('linkedin') && !portfolioMatch[0].includes('github') ? portfolioMatch[0] : '';

  const candidateName = extractCandidateName(cleanText, lines);

  // 2. ATS Section Hierarchy Check
  const detectedSections = [];
  const missingSections = [];

  STANDARD_SECTION_HEADERS.forEach(section => {
    const isFound = section.patterns.some(pattern => pattern.test(cleanText));
    if (isFound) {
      detectedSections.push(section.key);
    } else {
      missingSections.push(section.key);
    }
  });

  const atsSectionScore = Math.round((detectedSections.length / STANDARD_SECTION_HEADERS.length) * 100);

  // 3. Impact & Quantified Metrics
  // Bullet points match lines starting with bullets or common action verbs
  const bulletLines = lines.filter(line => 
    /^[-*•\d+.]|^(spearheaded|architected|led|managed|engineered|built|developed|created|analyzed|designed|implemented|streamlined|automated|orchestrated|increased|reduced)/i.test(line)
  );
  const totalBullets = Math.max(bulletLines.length, 1);

  // Quantified metrics regex: percentages, currency, magnitude (k, m, ms, users, clients, etc.)
  const metricRegex = /(\d+%\b|\$\d+[\d,.]*[kmb]?\b|\b\d+[\d,.]*\s*(k|m|users|clients|customers|projects|hours|percent|million|billion|star|stars|requests|connections|ms|qps|rps)\b|\b\d{2,}\b)/i;
  const bulletsWithMetrics = bulletLines.filter(bullet => metricRegex.test(bullet));
  const metricPercentage = Math.round((bulletsWithMetrics.length / totalBullets) * 100);

  let impactScore = 40;
  if (metricPercentage >= 60) impactScore = 96;
  else if (metricPercentage >= 45) impactScore = 85;
  else if (metricPercentage >= 30) impactScore = 72;
  else if (metricPercentage >= 15) impactScore = 55;

  // 4. Action Verbs & Weak Words Detection
  const foundStrongVerbs = new Set();
  words.forEach(w => {
    if (ALL_ACTION_VERBS.has(w)) {
      foundStrongVerbs.add(w);
    }
  });

  const foundWeakWords = [];
  WEAK_WORDS.forEach(item => {
    const regex = new RegExp(`\\b${item.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(cleanText)) {
      foundWeakWords.push(item);
    }
  });

  const actionVerbScore = Math.min(100, Math.round((foundStrongVerbs.size / 7) * 100));

  // 5. Skills Extraction
  const categorizedSkills = {};
  const allSkillsFound = new Set();

  Object.entries(SKILL_CATEGORIES).forEach(([cat, list]) => {
    const matched = list.filter(skill => {
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9+#.-])${escaped}(?:$|[^a-zA-Z0-9+#.-])`, 'i');
      return regex.test(cleanText);
    });

    if (matched.length > 0) {
      categorizedSkills[cat] = matched;
      matched.forEach(s => allSkillsFound.add(s));
    }
  });

  const skillsScore = Math.min(100, Math.round((allSkillsFound.size / 14) * 100));

  // 6. Brevity & Length Scoring
  let brevityScore = 100;
  let wordCountFeedback = "Ideal resume length.";
  if (wordCount < 180) {
    brevityScore = 45;
    wordCountFeedback = "Too short. Expand on projects, responsibilities, and quantified impact.";
  } else if (wordCount > 1100) {
    brevityScore = 65;
    wordCountFeedback = "Lengthy resume. Streamline to 1-2 pages (approx 400-800 words) for recruiter clarity.";
  } else if (wordCount >= 350 && wordCount <= 850) {
    brevityScore = 100;
    wordCountFeedback = "Optimal length for both ATS parsers and human recruiters.";
  } else {
    brevityScore = 80;
    wordCountFeedback = "Acceptable length, but could be tightened.";
  }

  // 7. Readability
  const readabilityScore = calculateReadability(cleanText);

  // 8. ATS Specific Compliance Score
  let atsScore = atsSectionScore;
  if (!candidateEmail) atsScore -= 12;
  if (!candidatePhone) atsScore -= 8;
  if (!linkedinUrl) atsScore -= 5;
  if (foundWeakWords.length > 3) atsScore -= 5;
  atsScore = Math.max(15, Math.min(100, atsScore));

  // 9. Overall Weighted Score
  const overallScore = Math.round(
    atsScore * 0.30 +
    impactScore * 0.25 +
    actionVerbScore * 0.15 +
    skillsScore * 0.15 +
    brevityScore * 0.10 +
    readabilityScore * 0.05
  );

  // 10. Job Description Matching (if provided)
  let jobMatch = {
    matchScore: null,
    matchedKeywords: [],
    missingKeywords: [],
    totalTargetKeywords: 0
  };

  if (jobDescription && jobDescription.trim().length > 25) {
    const jdClean = jobDescription.toLowerCase();
    const tfidf = new TfIdf();
    tfidf.addDocument(jdClean);

    const jdWords = jdClean.match(/\b[a-z0-9+#.-]{3,}\b/g) || [];
    const stopWords = new Set([
      'the', 'and', 'with', 'for', 'that', 'this', 'from', 'have', 'your', 'will',
      'are', 'you', 'our', 'work', 'team', 'must', 'about', 'join', 'opportunity',
      'role', 'responsibilities', 'requirements', 'qualifications', 'years', 'experience',
      'skills', 'ability', 'candidate', 'looking', 'plus', 'preferred'
    ]);

    const keywordCounts = {};
    jdWords.forEach(w => {
      if (!stopWords.has(w) && !/^\d+$/.test(w)) {
        keywordCounts[w] = (keywordCounts[w] || 0) + 1;
      }
    });

    // Also include any recognized skills mentioned in JD
    const jdSkills = [];
    Object.values(SKILL_CATEGORIES).flat().forEach(skill => {
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9+#.-])${escaped}(?:$|[^a-zA-Z0-9+#.-])`, 'i');
      if (regex.test(jdClean)) {
        jdSkills.push(skill);
      }
    });

    const combinedKeywords = Array.from(new Set([
      ...Object.keys(keywordCounts).sort((a, b) => keywordCounts[b] - keywordCounts[a]).slice(0, 20),
      ...jdSkills
    ])).slice(0, 25);

    const matchedKeywords = combinedKeywords.filter(kw => {
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      return regex.test(cleanText);
    });

    const missingKeywords = combinedKeywords.filter(kw => !matchedKeywords.includes(kw));
    const matchScore = Math.min(100, Math.round((matchedKeywords.length / Math.max(combinedKeywords.length, 1)) * 100));

    jobMatch = {
      matchScore,
      matchedKeywords,
      missingKeywords,
      totalTargetKeywords: combinedKeywords.length
    };
  }

  // 11. Categorized Actionable AI Suggestions
  const suggestions = [];

  // Critical items
  if (!candidateEmail) {
    suggestions.push({
      type: 'critical',
      category: 'Contact Info',
      title: 'Missing Email Address',
      description: 'Recruiters and automated ATS filters require an email address prominently placed at the top.'
    });
  }
  if (!candidatePhone) {
    suggestions.push({
      type: 'critical',
      category: 'Contact Info',
      title: 'Missing Phone Number',
      description: 'Add a standard phone number so hiring teams can schedule initial screenings.'
    });
  }
  if (missingSections.length > 0) {
    suggestions.push({
      type: 'critical',
      category: 'ATS Structure',
      title: `Missing Essential Headers: ${missingSections.join(', ')}`,
      description: 'ATS parsers scan for standard headings like "Experience", "Education", and "Skills" to map your profile into recruiter databases.'
    });
  }
  if (metricPercentage < 35) {
    suggestions.push({
      type: 'critical',
      category: 'Impact & Results',
      title: 'Low Quantified Achievements',
      description: `Only ${metricPercentage}% of your bullet points contain measurable metrics (%, $, scale, or time saved). Use the Google XYZ formula: "Accomplished [X] as measured by [Y] by doing [Z]".`
    });
  }

  // Warnings
  if (foundWeakWords.length > 0) {
    suggestions.push({
      type: 'warning',
      category: 'Language & Verbs',
      title: `Weak Buzzwords Detected (${foundWeakWords.length})`,
      description: `Found terms like "${foundWeakWords.map(w => w.word).slice(0, 3).join('", "')}". ${foundWeakWords[0].suggestion}.`
    });
  }
  if (!linkedinUrl) {
    suggestions.push({
      type: 'warning',
      category: 'Online Presence',
      title: 'LinkedIn Profile Missing',
      description: 'Including a clickable LinkedIn profile link boosts recruiter callback rates by up to 70%.'
    });
  }
  if (foundStrongVerbs.size < 6) {
    suggestions.push({
      type: 'warning',
      category: 'Action Verbs',
      title: 'Elevate Power Verb Variety',
      description: 'Lead bullet points with decisive action verbs such as "Spearheaded", "Architected", "Optimized", or "Orchestrated".'
    });
  }
  if (wordCount < 200 || wordCount > 950) {
    suggestions.push({
      type: 'warning',
      category: 'Length & Brevity',
      title: wordCountFeedback,
      description: `Your resume has ${wordCount} words. Aim for 400-800 words for a standard 1-page profile.`
    });
  }
  if (jobMatch.matchScore !== null && jobMatch.matchScore < 60) {
    suggestions.push({
      type: 'warning',
      category: 'Job Description Match',
      title: `Low Keyword Match (${jobMatch.matchScore}%)`,
      description: `Missing key skills required by the job posting: ${jobMatch.missingKeywords.slice(0, 5).join(', ')}.`
    });
  }

  // Strengths
  if (metricPercentage >= 50) {
    suggestions.push({
      type: 'strength',
      category: 'Quantified Impact',
      title: 'Strong Metrics Presence',
      description: `${metricPercentage}% of experience bullet points showcase clear numbers, percentages, or scale metrics!`
    });
  }
  if (foundStrongVerbs.size >= 6) {
    suggestions.push({
      type: 'strength',
      category: 'Vocabulary',
      title: 'High-Impact Power Verbs',
      description: `Detected ${foundStrongVerbs.size} diverse action verbs illustrating technical ownership and execution.`
    });
  }
  if (allSkillsFound.size >= 10) {
    suggestions.push({
      type: 'strength',
      category: 'Technical Stack',
      title: 'Robust Skill Coverage',
      description: `Successfully extracted ${allSkillsFound.size} relevant technical skills across ${Object.keys(categorizedSkills).length} categories.`
    });
  }

  return {
    candidateName,
    candidateEmail,
    candidatePhone,
    linkedinUrl,
    githubUrl,
    portfolioUrl,
    fileName,
    scores: {
      overall: overallScore,
      atsScore,
      impactScore,
      actionVerbScore,
      skillsScore,
      brevityScore,
      readabilityScore
    },
    stats: {
      wordCount,
      lineCount,
      totalBullets,
      metricBullets: bulletsWithMetrics.length,
      metricPercentage
    },
    detectedSections,
    missingSections,
    skills: {
      categorized: categorizedSkills,
      all: Array.from(allSkillsFound),
      totalFound: allSkillsFound.size
    },
    strongVerbsFound: Array.from(foundStrongVerbs),
    weakWordsFound: foundWeakWords,
    suggestions,
    jobMatch,
    rawText: cleanText,
    jobDescription
  };
};

// AI Bullet Optimizer (Transforms weak bullets into quantified XYZ achievements)
export const improveBulletPoint = (rawBullet, _targetRole = 'Software Engineer') => {
  if (!rawBullet || rawBullet.trim().length === 0) {
    return {
      original: '',
      improvedBullets: [],
      analysis: 'Please provide a valid bullet point to improve.'
    };
  }

  const clean = rawBullet.trim().replace(/^[-*•\s]+/, '');

  // Extract core topic / action
  const cleanTopic = clean
    .replace(/^(worked on|helped|assisted with|did|responsible for|handled)\s+/i, '')
    .replace(/\.$/, '');

  const suggestions = [
    {
      style: "Quantified Performance (XYZ Formula)",
      text: `Architected and deployed ${cleanTopic}, reducing system latency by 35% and supporting over 50,000 active monthly users.`
    },
    {
      style: "Leadership & Initiative",
      text: `Spearheaded end-to-end development of ${cleanTopic}, aligning cross-functional teams to deliver production releases 2 weeks ahead of target.`
    },
    {
      style: "Efficiency & Cost Optimization",
      text: `Optimized workflows for ${cleanTopic}, eliminating 15 hours of manual engineering effort per sprint and cutting infrastructure compute costs by 22%.`
    },
    {
      style: "Scale & Reliability",
      text: `Engineered highly available architecture for ${cleanTopic}, achieving 99.99% uptime across 1.2M daily API interactions.`
    }
  ];

  return {
    original: clean,
    improvedBullets: suggestions,
    tips: [
      "Use the Google XYZ formula: Accomplished [X], as measured by [Y], by doing [Z].",
      "Always include baseline vs improved figures (e.g., from 45 min to 8 min).",
      "Replace passive phrases like 'worked on' with active verbs like 'Architected', 'Spearheaded', or 'Engineered'."
    ]
  };
};
