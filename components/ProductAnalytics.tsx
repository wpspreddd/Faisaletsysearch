import React, { useState, useCallback } from 'react';
import { analyzeProduct } from '../services/geminiService';
import type { ProductAnalysis } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';
import BarChart from './common/BarChart';
import { 
    CheckCircleIcon,
    HeartIcon,
} from '../constants';

const MetricItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="p-2">
    <p className="text-sm text-slate-500 font-medium">{label}</p>
    <p className="text-xl font-bold text-slate-800">{value}</p>
  </div>
);

const DetailItem: React.FC<{ label: string; value: string | number | boolean }> = ({ label, value }) => {
  const renderValue = () => {
    if (typeof value === 'boolean') {
      return value ? (
        <span className="flex items-center gap-1 text-green-600 font-semibold">
          <CheckCircleIcon className="h-5 w-5" /> Yes
        </span>
      ) : (
        <span className="flex items-center gap-1 text-red-600 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
             No
        </span>
      );
    }
    return <span className="font-semibold text-slate-800">{value}</span>;
  };

  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-100">
      <p className="text-slate-600">{label}</p>
      {renderValue()}
    </div>
  );
};


const ProductAnalytics: React.FC = () => {
  const [productDesc, setProductDesc] = useState<string>('');
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [activeTrend, setActiveTrend] = useState<'sales' | 'views' | 'favorites'>('sales');


  const handleAnalyze = useCallback(async () => {
    if (!productDesc.trim()) {
      setError('Please enter a product title, description, or URL.');
      return;
    }
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setIsFavorited(false);
    try {
      const result = await analyzeProduct(productDesc);
      if (result) {
        setAnalysis(result);
        const favorites = JSON.parse(localStorage.getItem('favorite_products') || '[]');
        if (favorites.some((fav: ProductAnalysis) => fav.product_concept === result.product_concept)) {
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
  }, [productDesc]);

  const toggleFavorite = () => {
    if (!analysis) return;
    const favorites: ProductAnalysis[] = JSON.parse(localStorage.getItem('favorite_products') || '[]');
    if (isFavorited) {
        const newFavorites = favorites.filter(fav => fav.product_concept !== analysis.product_concept);
        localStorage.setItem('favorite_products', JSON.stringify(newFavorites));
        setIsFavorited(false);
    } else {
        favorites.push(analysis);
        localStorage.setItem('favorite_products', JSON.stringify(favorites));
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

  const CardTitleWithFavorite: React.FC<{title: React.ReactNode}> = ({ title }) => (
    <div className="flex justify-between items-center">
        <span>{title}</span>
        <button onClick={toggleFavorite} className="p-1 rounded-full hover:bg-slate-100 transition-colors">
            <HeartIcon className={`h-6 w-6 ${isFavorited ? 'text-red-500 fill-current' : 'text-slate-400'}`} />
        </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Product Analytics</h2>
        <p className="mt-2 text-lg text-slate-600">
          Get a comprehensive, AI-powered analysis for any product idea, title, or Etsy listing URL.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={productDesc}
            onChange={(e) => setProductDesc(e.target.value)}
            placeholder="Enter Product Title, Description, or Etsy URL"
            className="flex-grow w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow"
            disabled={loading}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Spinner /> : 'Analyze Product'}
          </button>
        </div>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>

      {loading && (
        <div className="text-center py-10">
          <div className="inline-block">
            <Spinner size="lg" />
          </div>
          <p className="mt-4 text-slate-600">AI is generating your product analysis... this may take a moment.</p>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
            <Card title={<CardTitleWithFavorite title={<span>Optimized Title Suggestion for: <span className="text-orange-600">"{analysis.product_concept}"</span></span>} />}>
              <p className="text-lg text-slate-800 bg-slate-50 p-4 rounded-md">{analysis.title_suggestion}</p>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Key Metrics">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            <MetricItem label="Mo. Sales" value={analysis.monthly_sales} />
                            <MetricItem label="Mo. Revenue" value={analysis.monthly_revenue} />
                            <MetricItem label="Total Sales" value={analysis.total_sales.toLocaleString()} />
                            <MetricItem label="Views" value={analysis.views.toLocaleString()} />
                            <MetricItem label="Favorites" value={analysis.favorites.toLocaleString()} />
                            <MetricItem label="Reviews" value={analysis.reviews.toLocaleString()} />
                            <MetricItem label="Conv. Rate" value={analysis.conversion_rate} />
                            <MetricItem label="Review Ratio" value={analysis.review_ratio} />
                            <MetricItem label="Listing Age" value={analysis.listing_age} />
                             <MetricItem label="Visibility" value={analysis.visibility_score} />
                        </div>
                    </Card>
                    <Card title="More Details">
                        <DetailItem label="Category" value={analysis.category} />
                        <DetailItem label="Personalized" value={analysis.listing_details.personalized} />
                        <DetailItem label="Customizable" value={analysis.listing_details.customizable} />
                        <DetailItem label="Craft Supply" value={analysis.listing_details.craft_supply} />
                        <DetailItem label="Has Variations" value={analysis.listing_details.has_variations} />
                        <DetailItem label="Listing Type" value={analysis.listing_details.listing_type} />
                        <DetailItem label="Made By" value={analysis.listing_details.who_made} />
                        <DetailItem label="When Made" value={analysis.listing_details.when_made} />
                        <DetailItem label="# of Tags" value={analysis.listing_details.tags_count} />
                        <DetailItem label="Title Chars" value={analysis.listing_details.title_character_count} />
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Historical Trends">
                        <div className="flex items-center gap-2 mb-4 border-b border-slate-200">
                            <button 
                                onClick={() => setActiveTrend('sales')}
                                className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${activeTrend === 'sales' ? 'bg-slate-100 text-orange-600' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                Sales
                            </button>
                            <button 
                                onClick={() => setActiveTrend('views')}
                                className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${activeTrend === 'views' ? 'bg-slate-100 text-orange-600' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                Views
                            </button>
                            <button 
                                onClick={() => setActiveTrend('favorites')}
                                className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${activeTrend === 'favorites' ? 'bg-slate-100 text-orange-600' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                Favorites
                            </button>
                        </div>
                        {activeTrend === 'sales' && <BarChart data={analysis.historical_data.sales} colorClass="bg-green-300" />}
                        {activeTrend === 'views' && <BarChart data={analysis.historical_data.views} colorClass="bg-purple-300" />}
                        {activeTrend === 'favorites' && <BarChart data={analysis.historical_data.favorites} colorClass="bg-red-300" />}
                    </Card>
                    <Card title="Tags Analysis">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-200 text-sm text-slate-600">
                                        <th className="p-2">Tag</th>
                                        <th className="p-2 text-center">Volume</th>
                                        <th className="p-2 text-center">Competition</th>
                                        <th className="p-2 text-center">Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analysis.tags_analysis.map((tag, i) => (
                                        <tr key={i} className="border-b border-slate-100">
                                            <td className="p-2 font-medium text-slate-800">{tag.tag}</td>
                                            <td className="p-2 text-center">
                                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getBadgeColor(tag.volume)}`}>{tag.volume}</span>
                                            </td>
                                            <td className="p-2 text-center">
                                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getBadgeColor(tag.competition)}`}>{tag.competition}</span>
                                            </td>
                                            <td className="p-2 font-bold text-center text-slate-700">{tag.score}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>

            <Card title="Description Feedback">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{analysis.description_feedback}</p>
            </Card>

            <Card title="Visibility & Placement Analysis">
              <p className="text-slate-700 leading-relaxed">{analysis.visibility_analysis}</p>
            </Card>
        </div>
      )}
    </div>
  );
};

export default ProductAnalytics;