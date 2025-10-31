import React, { useState, useCallback } from 'react';
import { analyzeKeyword } from '../services/geminiService';
import type { KeywordAnalysis } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';
import BarChart from './common/BarChart';
import { HeartIcon } from '../constants';

const KeywordResearchTool: React.FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [analysis, setAnalysis] = useState<KeywordAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  const handleAnalyze = useCallback(async () => {
    if (!keyword.trim()) {
      setError('Please enter a keyword.');
      return;
    }
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setIsFavorited(false);
    try {
      const result = await analyzeKeyword(keyword);
      if (result) {
        setAnalysis(result);
        const favorites = JSON.parse(localStorage.getItem('favorite_keywords') || '[]');
        if (favorites.some((fav: {keyword: string}) => fav.keyword === keyword)) {
            setIsFavorited(true);
        }
      } else {
        setError('Failed to get analysis. The response might be invalid. Please try again.');
      }
    } catch (e) {
      setError('An unexpected error occurred. Please check the console for details.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  const toggleFavorite = () => {
    if (!analysis || !keyword) return;
    const favorites = JSON.parse(localStorage.getItem('favorite_keywords') || '[]');
    if (isFavorited) {
        const newFavorites = favorites.filter((fav: {keyword: string}) => fav.keyword !== keyword);
        localStorage.setItem('favorite_keywords', JSON.stringify(newFavorites));
        setIsFavorited(false);
    } else {
        favorites.push({ keyword, analysis });
        localStorage.setItem('favorite_keywords', JSON.stringify(favorites));
        setIsFavorited(true);
    }
  }
  
  const getBadgeColor = (value: string) => {
    const lowerValue = value.toLowerCase();
    if (lowerValue.includes('low')) return 'bg-green-100 text-green-800';
    if (lowerValue.includes('medium')) return 'bg-yellow-100 text-yellow-800';
    if (lowerValue.includes('high')) return 'bg-red-100 text-red-800';
    return 'bg-slate-100 text-slate-800';
  };

  const CardTitleWithFavorite: React.FC<{title: string}> = ({ title }) => (
    <div className="flex justify-between items-center">
        {title}
        <button onClick={toggleFavorite} className="p-1 rounded-full hover:bg-slate-100 transition-colors">
            <HeartIcon className={`h-6 w-6 ${isFavorited ? 'text-red-500 fill-current' : 'text-slate-400'}`} />
        </button>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Keyword Research</h2>
        <p className="mt-2 text-lg text-slate-600">
          Enter a keyword to analyze its potential on Etsy, discover related terms, and get product ideas.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g., 'handmade leather journal'"
            className="flex-grow w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow"
            disabled={loading}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Spinner /> : 'Analyze Keyword'}
          </button>
        </div>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>

      {loading && (
        <div className="text-center py-10">
          <div className="inline-block">
            <Spinner size="lg" />
          </div>
          <p className="mt-4 text-slate-600">AI is analyzing... this might take a moment.</p>
        </div>
      )}

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title={<CardTitleWithFavorite title="At a Glance" />} className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                  <div className="pt-4 sm:pt-0">
                      <h4 className="text-sm font-medium text-slate-500">Competition</h4>
                      <p className="text-3xl font-bold text-slate-800 mt-1">{analysis.competition_score}<span className="text-lg text-slate-500">/100</span></p>
                      <span className={`mt-2 inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${getBadgeColor(analysis.competition)}`}>{analysis.competition}</span>
                  </div>
                  <div className="pt-4 sm:pt-0">
                      <h4 className="text-sm font-medium text-slate-500">Monthly Searches</h4>
                      <p className="text-3xl font-bold text-slate-800 mt-1">{analysis.estimated_monthly_searches.toLocaleString()}</p>
                      <span className={`mt-2 inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${getBadgeColor(analysis.search_volume)}`}>{analysis.search_volume}</span>
                  </div>
                  <div className="pt-4 sm:pt-0">
                      <h4 className="text-sm font-medium text-slate-500">Buyer Intent</h4>
                       <p className="text-3xl font-bold text-slate-800 mt-1 capitalize">{analysis.buyer_intent}</p>
                       <span className={`mt-2 inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${getBadgeColor(analysis.buyer_intent)}`}>{analysis.buyer_intent}</span>
                  </div>
              </div>
          </Card>

          <Card title="Search Volume Trend (12 Months)" className="lg:col-span-3">
            <BarChart data={analysis.historical_data} />
          </Card>

          <Card title="Long-tail Keywords" className="lg:col-span-2">
            <div className="flex flex-wrap gap-2">
              {analysis.long_tail_keywords.map((tag, i) => (
                <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1.5 text-sm rounded-md">{tag}</span>
              ))}
            </div>
          </Card>
          
          <Card title="Niche Suggestions">
            <ul className="list-disc list-inside space-y-2 text-slate-700">
                {analysis.niche_suggestions.map((niche, i) => <li key={i}>{niche}</li>)}
            </ul>
          </Card>

          <Card title="Suggested Tags (for listings)" className="lg:col-span-3">
            <div className="flex flex-wrap gap-2">
              {analysis.suggested_tags.map((tag, i) => (
                <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1.5 text-sm rounded-md font-medium">{tag}</span>
              ))}
            </div>
          </Card>

          <Card title="Product Ideas" className="lg:col-span-3">
             <ul className="list-disc list-inside space-y-2 text-slate-700">
                {analysis.product_ideas.map((idea, i) => <li key={i}>{idea}</li>)}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
};

export default KeywordResearchTool;