import React, { useState, useCallback } from 'react';
import { analyzeRank } from '../services/geminiService';
import type { RankAnalysis } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';

const RankChecker: React.FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [productDesc, setProductDesc] = useState<string>('');
  const [analysis, setAnalysis] = useState<RankAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!keyword.trim() || !productDesc.trim()) {
      setError('Please enter both a keyword and a product description.');
      return;
    }
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzeRank(keyword, productDesc);
      if (result) {
        setAnalysis(result);
      } else {
        setError('Failed to get analysis. The response might be invalid. Please try again.');
      }
    } catch (e) {
      setError('An unexpected error occurred. Please check the console for details.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [keyword, productDesc]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Rank Checker</h2>
        <p className="mt-2 text-lg text-slate-600">
          Get a hypothetical analysis of your product's search rank potential for a specific keyword.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter target keyword (e.g., 'custom star map')"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            disabled={loading}
        />
        <textarea
            value={productDesc}
            onChange={(e) => setProductDesc(e.target.value)}
            placeholder="Paste your product title and description here..."
            className="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            disabled={loading}
        />
        <div className="flex justify-end">
            <button
                onClick={handleAnalyze}
                disabled={loading}
                className="flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
                {loading ? <Spinner /> : 'Check Rank Potential'}
            </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

       {loading && (
        <div className="text-center py-10">
          <div className="inline-block">
            <Spinner size="lg" />
          </div>
          <p className="mt-4 text-slate-600">AI is analyzing ranking potential...</p>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
            <Card title="Hypothetical Rank Analysis">
                <div className="text-center">
                    <h4 className="text-lg font-medium text-slate-500">Estimated Rank for "{keyword}"</h4>
                    <p className="text-4xl font-bold text-orange-600 my-2">{analysis.estimated_rank}</p>
                </div>
                <div className="mt-6">
                    <h4 className="font-semibold text-slate-800">Explanation</h4>
                    <p className="text-slate-600 mt-2">{analysis.rank_explanation}</p>
                </div>
            </Card>

            <Card title="Improvement Suggestions">
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                    {analysis.improvement_suggestions.map((suggestion, i) => <li key={i}>{suggestion}</li>)}
                </ul>
            </Card>
        </div>
      )}
    </div>
  );
};

export default RankChecker;