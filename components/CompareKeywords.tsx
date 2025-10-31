import React, { useState, useCallback } from 'react';
import { analyzeKeyword } from '../services/geminiService';
import type { KeywordAnalysis } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';

const CompareKeywords: React.FC = () => {
  const [keyword1, setKeyword1] = useState<string>('');
  const [keyword2, setKeyword2] = useState<string>('');
  const [analysis1, setAnalysis1] = useState<KeywordAnalysis | null>(null);
  const [analysis2, setAnalysis2] = useState<KeywordAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!keyword1.trim() || !keyword2.trim()) {
      setError('Please enter both keywords to compare.');
      return;
    }
    setLoading(true);
    setError(null);
    setAnalysis1(null);
    setAnalysis2(null);

    try {
      const [result1, result2] = await Promise.all([
        analyzeKeyword(keyword1),
        analyzeKeyword(keyword2)
      ]);
      setAnalysis1(result1);
      setAnalysis2(result2);
      if (!result1 || !result2) {
        setError('Failed to get complete analysis for one or both keywords. Please try again.');
      }
    } catch (e) {
      setError('An unexpected error occurred. Please check the console for details.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [keyword1, keyword2]);
  
  const ComparisonRow: React.FC<{ label: string; value1: React.ReactNode; value2: React.ReactNode }> = ({ label, value1, value2 }) => (
    <tr className="border-b border-slate-200">
        <td className="py-3 px-4 text-sm font-medium text-slate-600">{label}</td>
        <td className="py-3 px-4 text-center text-slate-800">{value1}</td>
        <td className="py-3 px-4 text-center text-slate-800">{value2}</td>
    </tr>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Compare Keywords</h2>
        <p className="mt-2 text-lg text-slate-600">
          Analyze two keywords side-by-side to see how they stack up.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={keyword1}
            onChange={(e) => setKeyword1(e.target.value)}
            placeholder="e.g., 'handmade leather journal'"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow"
            disabled={loading}
          />
          <input
            type="text"
            value={keyword2}
            onChange={(e) => setKeyword2(e.target.value)}
            placeholder="e.g., 'personalized diary'"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow"
            disabled={loading}
          />
        </div>
        <div className="flex justify-end mt-4">
            <button
                onClick={handleAnalyze}
                disabled={loading}
                className="flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? <Spinner /> : 'Compare'}
            </button>
        </div>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>

      {loading && (
        <div className="text-center py-10">
          <div className="inline-block"><Spinner size="lg" /></div>
          <p className="mt-4 text-slate-600">AI is comparing keywords...</p>
        </div>
      )}

      {analysis1 && analysis2 && (
        <Card title="Comparison Result">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700 rounded-tl-lg">Metric</th>
                            <th className="py-3 px-4 text-center text-sm font-semibold text-slate-700">{keyword1}</th>
                            <th className="py-3 px-4 text-center text-sm font-semibold text-slate-700 rounded-tr-lg">{keyword2}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <ComparisonRow label="Competition Score" value1={`${analysis1.competition_score}/100`} value2={`${analysis2.competition_score}/100`} />
                        <ComparisonRow label="Competition" value1={analysis1.competition} value2={analysis2.competition} />
                        <ComparisonRow label="Monthly Searches" value1={analysis1.estimated_monthly_searches.toLocaleString()} value2={analysis2.estimated_monthly_searches.toLocaleString()} />
                        <ComparisonRow label="Search Volume" value1={analysis1.search_volume} value2={analysis2.search_volume} />
                        <ComparisonRow label="Buyer Intent" value1={analysis1.buyer_intent} value2={analysis2.buyer_intent} />
                         <ComparisonRow 
                            label="Long-tail Keywords" 
                            value1={analysis1.long_tail_keywords.length} 
                            value2={analysis2.long_tail_keywords.length} 
                        />
                         <ComparisonRow 
                            label="Product Ideas" 
                            value1={analysis1.product_ideas.length} 
                            value2={analysis2.product_ideas.length} 
                        />
                    </tbody>
                </table>
            </div>
        </Card>
      )}
    </div>
  );
};

export default CompareKeywords;