// 1. Tokenize & normalize text
export function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase().match(/\b[a-z][a-z0-9+#.]*\b/g) || [];
}

// 2. Remove stopwords
const STOPWORDS = new Set(['the','and','for','with','that','have','this','from','are','was','were','been','will','you','your','our','their','they','these','those','but','not','its','into','about','which','also','more','other','than','then','when','where','there','here','what','who','how','all','any','some','each','both','few','more','most','such','only','same','so','as','at','be','by','do','if','in','is','it','no','of','on','or','to','up','an','a']);

export function cleanTokens(tokens) {
  return tokens.filter(t => t.length > 2 && !STOPWORDS.has(t));
}

// 3. Extract skill keywords (give higher weight to known tech terms if needed)
export function extractKeywords(text) {
  const tokens = cleanTokens(tokenize(text));
  const freq = {};
  tokens.forEach(t => freq[t] = (freq[t] || 0) + 1);
  return freq;
}

// 4. Compute match score
export function computeScore(resumeFreq, jdFreq) {
  const jdKeys = Object.keys(jdFreq);
  if (jdKeys.length === 0) return 0;
  const matched = jdKeys.filter(k => resumeFreq[k]);
  return Math.round((matched.length / jdKeys.length) * 100);
}

// 5. Generate suggestions
export function getSuggestions(resumeFreq, jdFreq) {
  return Object.keys(jdFreq)
    .filter(k => !resumeFreq[k])
    .slice(0, 8)
    .map(k => `Consider adding "${k}" to your resume — it appears in the job description.`);
}

// 6. Main analyze function
export function analyze(resumeText, jdText) {
  const resumeFreq = extractKeywords(resumeText);
  const jdFreq = extractKeywords(jdText);
  
  const jdKeys = Object.keys(jdFreq);
  const matched = jdKeys.filter(k => resumeFreq[k]);
  const missing = jdKeys.filter(k => !resumeFreq[k]);
  
  const score = computeScore(resumeFreq, jdFreq);
  const suggestions = getSuggestions(resumeFreq, jdFreq);
  
  // Get top 10 keywords from resume by frequency
  const topResumeKeywords = Object.entries(resumeFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([keyword, count]) => ({ keyword, count }));
    
  // Normalize top resume keywords count for bar chart
  const maxCount = topResumeKeywords.length > 0 ? topResumeKeywords[0].count : 1;
  const topResumeKeywordsNormalized = topResumeKeywords.map(item => ({
      ...item,
      percentage: Math.max(10, Math.round((item.count / maxCount) * 100))
  }));

  return {
    score,
    matched,
    missing,
    suggestions,
    topResumeKeywords: topResumeKeywordsNormalized,
  };
}
