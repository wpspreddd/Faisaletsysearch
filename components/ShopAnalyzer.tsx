import React, { useState, useCallback, useEffect } from 'react';
import { analyzeShop } from '../services/geminiService';
import type { ShopAnalysis } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { HeartIcon } from '../constants';

interface ShopAnalyzerProps {
    connectedShop: string | null;
}

const ShopAnalyzer: React.FC<ShopAnalyzerProps> = ({ connectedShop }) => {
  const [shopName, setShopName] = useState<string>('');
  const [analysis, setAnalysis] = useState<ShopAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  const handleAnalyze = useCallback(async (shopToAnalyze?: string) => {
    const targetShop = shopToAnalyze || shopName;
    if (!targetShop.trim()) {
      setError('Please enter a shop name.');
      return;
    }
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setIsFavorited(false);
    try {
      const result = await analyzeShop(targetShop);
      if (result) {
        setAnalysis(result);
        const favorites = JSON.parse(localStorage.getItem('favorite_shops') || '[]');
        if (favorites.some((fav: ShopAnalysis) => fav.shop_name === result.shop_name)) {
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
  }, [shopName]);

  useEffect(() => {
    if (connectedShop) {
        setShopName(connectedShop);
        handleAnalyze(connectedShop);
    } else {
        // Clear analysis if disconnected
        setShopName('');
        setAnalysis(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedShop]);

  const toggleFavorite = () => {
    if (!analysis) return;
    const favorites: ShopAnalysis[] = JSON.parse(localStorage.getItem('favorite_shops') || '[]');
    if (isFavorited) {
        const newFavorites = favorites.filter(fav => fav.shop_name !== analysis.shop_name);
        localStorage.setItem('favorite_shops', JSON.stringify(newFavorites));
        setIsFavorited(false);
    } else {
        favorites.push(analysis);
        localStorage.setItem('favorite_shops', JSON.stringify(favorites));
        setIsFavorited(true);
    }
  }

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
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Shop Analyzer</h2>
        <p className="mt-2 text-lg text-slate-600">
          Get a hypothetical AI-powered analysis of an Etsy shop's strengths, weaknesses, and top keywords.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="Enter an Etsy shop name"
            className="flex-grow w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow disabled:bg-slate-100"
            disabled={loading || !!connectedShop}
          />
          <button
            onClick={() => handleAnalyze()}
            disabled={loading || !!connectedShop}
            className="flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Spinner /> : 'Analyze Shop'}
          </button>
        </div>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {connectedShop && <p className="mt-4 text-sm text-slate-600">Analyzing your connected shop. To analyze another, please disconnect first.</p>}
      </div>

       {loading && (
        <div className="text-center py-10">
          <div className="inline-block">
            <Spinner size="lg" />
          </div>
          <p className="mt-4 text-slate-600">AI is analyzing the shop... this might take a moment.</p>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
            <Card title={<CardTitleWithFavorite title={`Analysis for ${analysis.shop_name}`} />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-slate-800">Shop Niche</h4>
                        <p className="text-slate-600 mt-1">{analysis.niche}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-800">Estimated Monthly Sales</h4>
                        <p className="text-2xl font-bold text-orange-600 mt-1">{analysis.estimated_monthly_sales}</p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Top Keywords">
                     <div className="flex flex-wrap gap-2">
                        {analysis.top_keywords.map((kw, i) => (
                            <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1.5 text-sm rounded-md">{kw}</span>
                        ))}
                    </div>
                </Card>
                <Card title="Strengths">
                    <ul className="list-disc list-inside space-y-2 text-slate-700">
                        {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </Card>
                <Card title="Areas for Improvement">
                    <ul className="list-disc list-inside space-y-2 text-slate-700">
                        {analysis.areas_for_improvement.map((area, i) => <li key={i}>{area}</li>)}
                    </ul>
                </Card>
            </div>
        </div>
      )}
    </div>
  );
};

export default ShopAnalyzer;