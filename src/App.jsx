import React, { useState } from 'react';
import { analyze } from './lib/analyzer';

function LightbulbIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}

function ScoreCircle({ score }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = 'text-missing';
  if (score >= 75) color = 'text-success';
  else if (score >= 50) color = 'text-yellow-500';

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-card rounded-xl">
      <h3 className="text-xl font-bold mb-4">Match Score</h3>
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-gray-700"
          />
          {/* Progress Circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`score-circle-anim ${color}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-mono font-bold">{score}%</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [results, setResults] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    if (!resumeText.trim() || !jdText.trim()) return;
    const analysisResults = analyze(resumeText, jdText);
    setResults(analysisResults);
    setAnalyzed(true);
  };

  const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (event) => setResumeText(event.target.result);
          reader.readAsText(file);
      }
      e.target.value = null; // reset
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">
          Smart Resume Analyzer
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Compare your resume against any job description to discover what you are missing and how you can improve your chances of getting hired.
        </p>
      </header>

      {/* Input Panel */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="text-lg font-medium">Your Resume</label>
            <label className="cursor-pointer text-sm text-accent hover:text-purple-400 transition-colors">
              Upload .txt
              <input type="file" accept=".txt" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
          <textarea
            className="w-full h-80 bg-card border border-gray-700 rounded-xl p-4 text-sm font-mono placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all overflow-y-auto resize-none"
            placeholder="Paste your resume text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2">Job Description</label>
          <textarea
            className="w-full h-80 bg-card border border-gray-700 rounded-xl p-4 text-sm font-mono placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all overflow-y-auto resize-none"
            placeholder="Paste the job description text here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-center mb-16">
        <button
          onClick={handleAnalyze}
          disabled={!resumeText.trim() || !jdText.trim()}
          className="px-10 py-4 bg-accent hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          Analyze Match
        </button>
      </div>

      {/* Results Panel */}
      {analyzed && results && (
        <div className="animate-fade-in space-y-8">
          <div className="grid md:grid-cols-3 gap-8 border-t border-gray-800 pt-12">
            {/* Left Col: Score & Chart */}
            <div className="space-y-8 md:col-span-1">
              <ScoreCircle score={results.score} />
              
              {/* Keyword Density Chart */}
              <div className="bg-card p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Resume Keywords Density</h3>
                <div className="space-y-3">
                  {results.topResumeKeywords.length > 0 ? (
                    results.topResumeKeywords.map((item, idx) => (
                      <div key={idx} className="flex items-center text-sm font-mono">
                        <div className="w-24 truncate mr-2" title={item.keyword}>
                          {item.keyword}
                        </div>
                        <div className="flex-1 bg-gray-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-accent h-full rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <div className="w-8 text-right ml-2 text-gray-400">
                          {item.count}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No keywords extracted.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Col: Keywords & Suggestions */}
            <div className="space-y-8 md:col-span-2">
              <div className="grid md:grid-cols-2 gap-8">
                 {/* Matched Keywords */}
                <div className="bg-card p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-success mb-4 flex items-center">
                     Matched Skills
                     <span className="ml-2 bg-success/20 text-success text-xs py-1 px-2 rounded-full">
                       {results.matched.length}
                     </span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {results.matched.length > 0 ? (
                       results.matched.map((k, i) => (
                        <span key={i} className="px-3 py-1 bg-success/10 text-success border border-success/30 rounded-full text-sm font-medium">
                          {k}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No matched keywords found.</p>
                    )}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="bg-card p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-missing mb-4 flex items-center">
                    Missing Skills
                    <span className="ml-2 bg-missing/20 text-missing text-xs py-1 px-2 rounded-full">
                       {results.missing.length}
                     </span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                     {results.missing.length > 0 ? (
                       results.missing.map((k, i) => (
                        <span key={i} className="px-3 py-1 bg-missing/10 text-missing border border-missing/30 rounded-full text-sm font-medium">
                          {k}
                        </span>
                      ))
                     ) : (
                        <p className="text-gray-500 text-sm">Great job! You matched all keywords.</p>
                     )}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-card p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4 text-white">Actionable Suggestions</h3>
                <div className="space-y-3">
                  {results.suggestions.length > 0 ? (
                    results.suggestions.map((s, i) => (
                      <div key={i} className="flex p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        <LightbulbIcon className="text-accent flex-shrink-0 mr-3 mt-0.5" />
                        <span className="text-gray-300">{s}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        <LightbulbIcon className="text-success flex-shrink-0 mr-3 mt-0.5" />
                        <span className="text-gray-300">Your resume seems solid with the keywords. Focus on impact and metrics next!</span>
                      </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
