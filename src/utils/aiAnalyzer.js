import {
  ALL_ACTION_VERBS,
  WEAK_WORDS,
  SKILL_CATEGORIES,
  STANDARD_SECTION_HEADERS
} from '../data/dictionary';

export const analyzeResume = (resumeText, jobDescriptionText = '') => {
  if (!resumeText || resumeText.trim().length === 0) {
    return null;
  }

  const cleanText = resumeText.trim();
  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);
  const words = cleanText.toLowerCase().match(/\b[a-z0-9+#.-]+\b/g) || [];
  const wordCount = words.length;

  // 1. Contact Info Detection
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;
  const githubRegex = /github\.com\/[a-zA-Z0-9_-]+/i;

  const hasEmail = emailRegex.test(cleanText);
  const hasPhone = phoneRegex.test(cleanText);
  const hasLinkedin = linkedinRegex.test(cleanText);
  const hasGithub = githubRegex.test(cleanText);

  // 2. Section Header Detection (ATS)
  const detectedHeaders = [];
  const missingHeaders = [];

  STANDARD_SECTION_HEADERS.forEach(section => {
    const found = section.patterns.some(pattern => pattern.test(cleanText));
    if (found) {
      detectedHeaders.push(section.key);
    } else {
      missingHeaders.push(section.key);
    }
  });

  const atsSectionScore = Math.round((detectedHeaders.length / STANDARD_SECTION_HEADERS.length) * 100);

  // 3. Impact & Quantified Metrics Analysis
  // Bullet point lines usually start with -, *, •, or action words
  const bulletLines = lines.filter(line => /^[-*•\d+.]|^(spearheaded|architected|led|managed|engineered|built|developed|created|analyzed|designed|implemented)/i.test(line));
  const totalBullets = Math.max(bulletLines.length, 1);
  
  // Quantified numbers / metrics pattern: e.g., 40%, $5M, 10k, 25 users, 99.99%
  const metricRegex = /(\d+%\b|\$\d+[\d,.]*[kmb]?\b|\b\d+[\d,.]*\s*(k|m|users|clients|customers|projects|hours|percent|million|billion|star|stars|requests|connections|ms)\b|\b\d{2,}\b)/i;
  
  const bulletsWithMetrics = bulletLines.filter(bullet => metricRegex.test(bullet));
  const metricPercentage = Math.round((bulletsWithMetrics.length / totalBullets) * 100);

  let impactScore = 0;
  if (metricPercentage >= 60) impactScore = 95;
  else if (metricPercentage >= 40) impactScore = 80;
  else if (metricPercentage >= 20) impactScore = 60;
  else impactScore = 35;

  // 4. Action Verbs vs Weak Verbs Audit
  const foundStrongVerbs = new Set();
  words.forEach(w => {
    if (ALL_ACTION_VERBS.has(w)) {
      foundStrongVerbs.add(w);
    }
  });

  const foundWeakWords = [];
  WEAK_WORDS.forEach(item => {
    const regex = new RegExp(`\\b${item.word}\\b`, 'gi');
    if (regex.test(cleanText)) {
      foundWeakWords.push(item);
    }
  });

  const actionVerbScore = Math.min(100, Math.round((foundStrongVerbs.size / 6) * 100));

  // 5. Skill Extraction & Categorization
  const extractedSkills = {};
  let totalSkillsFound = 0;

  Object.entries(SKILL_CATEGORIES).forEach(([category, skillList]) => {
    const matched = skillList.filter(skill => {
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9+#.-])${escapedSkill}(?:$|[^a-zA-Z0-9+#.-])`, 'i');
      return regex.test(cleanText);
    });

    if (matched.length > 0) {
      extractedSkills[category] = matched;
      totalSkillsFound += matched.length;
    }
  });

  const skillsScore = Math.min(100, Math.round((totalSkillsFound / 12) * 100));

  // 6. Brevity & Word Count Score
  let wordCountScore = 100;
  let wordCountFeedback = "Ideal resume length.";
  if (wordCount < 150) {
    wordCountScore = 50;
    wordCountFeedback = "Too concise. Add more details about achievements and responsibilities.";
  } else if (wordCount > 1000) {
    wordCountScore = 70;
    wordCountFeedback = "Very long. Consider streamlining to 1-2 focused pages (approx 400-800 words).";
  } else if (wordCount >= 300 && wordCount <= 750) {
    wordCountScore = 100;
    wordCountFeedback = "Optimal length for ATS and recruiter reading.";
  }

  // 7. Overall Composite Score Calculation
  const overallScore = Math.round(
    impactScore * 0.25 +
    actionVerbScore * 0.20 +
    atsSectionScore * 0.20 +
    skillsScore * 0.20 +
    wordCountScore * 0.15
  );

  // 8. ATS Specific Compatibility Score
  let atsScore = atsSectionScore;
  if (!hasEmail) atsScore -= 10;
  if (!hasPhone) atsScore -= 5;
  if (!hasLinkedin) atsScore -= 5;
  atsScore = Math.max(10, Math.min(100, atsScore));

  // 9. Job Match Analysis (if Job Description text provided)
  let jobMatchData = null;
  if (jobDescriptionText && jobDescriptionText.trim().length > 20) {
    const jdClean = jobDescriptionText.toLowerCase();
    const jdWords = jdClean.match(/\b[a-z0-9+#.-]{3,}\b/g) || [];
    
    // Extract unique technical/important words from JD
    const jdWordFreq = {};
    jdWords.forEach(w => {
      // Filter out stop words
      if (!['the', 'and', 'with', 'for', 'that', 'this', 'from', 'have', 'your', 'will', 'are', 'you', 'our', 'work', 'team', 'must'].includes(w)) {
        jdWordFreq[w] = (jdWordFreq[w] || 0) + 1;
      }
    });

    const jdTopKeywords = Object.keys(jdWordFreq).sort((a, b) => jdWordFreq[b] - jdWordFreq[a]).slice(0, 25);
    
    const matchedKeywords = jdTopKeywords.filter(kw => {
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(cleanText);
    });

    const missingKeywords = jdTopKeywords.filter(kw => !matchedKeywords.includes(kw));

    const matchPercent = Math.min(100, Math.round((matchedKeywords.length / Math.max(jdTopKeywords.length, 1)) * 100));

    jobMatchData = {
      matchScore: matchPercent,
      matchedKeywords,
      missingKeywords: missingKeywords.slice(0, 10),
      totalTargetKeywords: jdTopKeywords.length
    };
  }

  // 10. Generate Categorized Suggestions
  const suggestions = [];

  // Critical Issues
  if (!hasEmail) {
    suggestions.push({
      type: 'critical',
      category: 'Contact Info',
      title: 'Missing Email Address',
      description: 'Recruiters and ATS systems need a clear email address at the top of your resume.'
    });
  }
  if (!hasPhone) {
    suggestions.push({
      type: 'critical',
      category: 'Contact Info',
      title: 'Missing Phone Number',
      description: 'Add a professional phone number so hiring managers can contact you for interviews.'
    });
  }
  if (missingHeaders.length > 0) {
    suggestions.push({
      type: 'critical',
      category: 'ATS Structure',
      title: `Missing Standard Headers: ${missingHeaders.join(', ')}`,
      description: 'ATS parsers rely on standard headings like "Work Experience", "Education", and "Skills" to categorize your profile.'
    });
  }
  if (metricPercentage < 30) {
    suggestions.push({
      type: 'critical',
      category: 'Impact & Results',
      title: 'Low Measurable Achievements',
      description: `Only ${metricPercentage}% of your bullet points contain numbers, percentages, or revenue metrics. Top candidates quantify results (e.g. "Increased sales by 30%").`
    });
  }

  // Warnings / Improvements
  if (foundWeakWords.length > 0) {
    suggestions.push({
      type: 'warning',
      category: 'Action Verbs',
      title: `Weak Buzzwords Detected (${foundWeakWords.length})`,
      description: `Found weak or passive terms like "${foundWeakWords.map(w => w.word).slice(0, 3).join('", "')}". ${foundWeakWords[0].suggestion}`
    });
  }
  if (!hasLinkedin) {
    suggestions.push({
      type: 'warning',
      category: 'Online Presence',
      title: 'LinkedIn Profile Not Found',
      description: 'Adding a LinkedIn URL increases recruiter response rates by up to 70%.'
    });
  }
  if (foundStrongVerbs.size < 5) {
    suggestions.push({
      type: 'warning',
      category: 'Impact',
      title: 'Enhance Action Verbs',
      description: 'Start bullet points with strong power verbs like "Spearheaded", "Architected", "Optimized", or "Accelerated".'
    });
  }
  if (wordCount < 250 || wordCount > 900) {
    suggestions.push({
      type: 'warning',
      category: 'Length',
      title: wordCountFeedback,
      description: `Current word count is ${wordCount} words.`
    });
  }

  // Strengths
  if (metricPercentage >= 50) {
    suggestions.push({
      type: 'strength',
      category: 'Impact',
      title: 'Strong Quantified Impact',
      description: `${metricPercentage}% of bullet points include concrete metrics and measurable outcomes!`
    });
  }
  if (foundStrongVerbs.size >= 6) {
    suggestions.push({
      type: 'strength',
      category: 'Language',
      title: 'Excellent Power Verb Usage',
      description: `Used ${foundStrongVerbs.size} unique high-impact action verbs across experience bullets.`
    });
  }
  if (atsSectionScore === 100) {
    suggestions.push({
      type: 'strength',
      category: 'ATS Compliance',
      title: 'Complete Section Architecture',
      description: 'Includes all standard section headings required for seamless ATS parsing.'
    });
  }

  return {
    overallScore,
    atsScore,
    impactScore,
    actionVerbScore,
    skillsScore,
    wordCountScore,
    wordCount,
    wordCountFeedback,
    contactInfo: { hasEmail, hasPhone, hasLinkedin, hasGithub },
    detectedHeaders,
    missingHeaders,
    bulletStats: {
      totalBullets,
      bulletsWithMetrics: bulletsWithMetrics.length,
      metricPercentage
    },
    strongVerbs: Array.from(foundStrongVerbs),
    weakWordsFound: foundWeakWords,
    extractedSkills,
    suggestions,
    jobMatchData,
    bulletLines
  };
};

export const generateBulletRewrites = (bulletText) => {
  if (!bulletText || bulletText.trim().length === 0) return [];
  
  const text = bulletText.trim();
  const words = text.split(" ");
  const topic = words.slice(Math.min(2, words.length - 1)).join(" ") || "core project deliverables";

  return [
    `Spearheaded ${text.toLowerCase().replace(/^(worked on|helped with|responsible for|handled|did)\s*/i, '')}, elevating system performance by 35% and reducing execution time.`,
    `Architected scalable solutions for ${topic}, driving key business metrics up by 40% while streamlining workflows.`,
    `Engineered high-impact deliverables for ${topic}, collaborating with cross-functional teams to achieve 99% operational uptime.`
  ];
};
