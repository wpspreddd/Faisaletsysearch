import React, { useState, useCallback } from 'react';
import { analyzeKeyword } from '../services/geminiService';
import type { KeywordAnalysis } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';

const BulkKeywordTool: React.FC = () => {
  const [keywords, setKeywords] = useState<string>('');
  const [results, setResults] = useState<Map<string, KeywordAnalysis | null>>(new Map());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentlyProcessing, setCurrentlyProcessing] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    const keywordList = keywords.split('\n').map(k => k.trim()).filter(Boolean);
    if (keywordList.length === 0) {
      setError('Please enter at least one keyword.');
      return;
    }
    setLoading(true);
    setError(null);
    setResults(new Map());
    setOpenAccordion(null);

    for (const keyword of keywordList) {
        setCurrentlyProcessing(keyword);
        try {
            const result = await analyzeKeyword(keyword);
            setResults(prev => new Map(prev).set(keyword, result));
        } catch (e) {
            console.error(`Failed to analyze keyword: ${keyword}`, e);
            setResults(prev => new Map(prev).set(keyword, null));
        }
    }

    setLoading(false);
    setCurrentlyProcessing(null);
  }, [keywords]);
  
  const getBadgeColor = (value: string) => {
    const lowerValue = value.toLowerCase();
    if (lowerValue.includes('low')) return 'bg-green-100 text-green-800';
    if (lowerValue.includes('medium')) return 'bg-yellow-100 text-yellow-800';
    if (lowerValue.includes('high')) return 'bg-red-100 text-red-800';
    return 'bg-slate-100 text-slate-800';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Bulk Keyword Tool</h2>
        <p className="mt-2 text-lg text-slate-600">
          Analyze multiple keywords at once. Enter one keyword per line.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="handmade leather journal&#10;personalized star map&#10;boho wall decor"
            className="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow"
            disabled={loading}
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Spinner /> : `Analyze ${keywords.split('\n').map(k => k.trim()).filter(Boolean).length} Keywords`}
          </button>
        </div>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>

      {loading && (
        <div className="text-center py-10">
          <div className="inline-block">
            <Spinner size="lg" />
          </div>
          <p className="mt-4 text-slate-600">Analyzing keywords... {currentlyProcessing && `Processing: "${currentlyProcessing}"`}</p>
        </div>
      )}

      {results.size > 0 && (
        <Card title="Analysis Results">
            <div className="space-y-2">
                {Array.from(results.entries()).map(([keyword, analysis]) => (
                    <div key={keyword} className="border border-slate-200 rounded-lg">
                        <button onClick={() => setOpenAccordion(openAccordion === keyword ? null : keyword)} className="w-full flex justify-between items-center p-4 text-left">
                            <span className="font-semibold text-slate-800">{keyword}</span>
                            <div className="flex items-center gap-4">
                                {analysis && <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getBadgeColor(analysis.competition)}`}>{analysis.competition}</span>}
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 transition-transform ${openAccordion === keyword ? 'rotate-180' : ''}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>
                        </button>
                        {openAccordion === keyword && (
                            <div className="p-4 border-t border-slate-200 bg-slate-50">
                                {analysis ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                         <div>
                                            <h4 className="text-sm font-medium text-slate-500">Competition</h4>
                                            <p className="text-xl font-bold text-slate-800 mt-1">{analysis.competition_score}<span className="text-sm text-slate-500">/100</span></p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-500">Monthly Searches</h4>
                                            <p className="text-xl font-bold text-slate-800 mt-1">{analysis.estimated_monthly_searches.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-500">Buyer Intent</h4>
                                            <p className="text-xl font-bold text-slate-800 mt-1 capitalize">{analysis.buyer_intent}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-center text-red-500">Failed to get analysis for this keyword.</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Card>
      )}
    </div>
  );
};

export default BulkKeywordTool;