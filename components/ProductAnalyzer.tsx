import React, { useState, useCallback } from 'react';
import { analyzeProduct } from '../services/geminiService';
import type { ProductAnalysis } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';
// Fix: Corrected import path for constants.
import { 
    EyeIcon, 
    HeartIcon, 
    ShoppingCartIcon, 
    TrendingUpIcon, 
    CalendarIcon,
    CheckCircleIcon
} from '../constants';


const MetricDisplay: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}> = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-start p-4 bg-slate-50 rounded-lg">
    <Icon className={`h-8 w-8 mr-4 ${color}`} />
    <div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);


const ProductAnalytics: React.FC = () => {
  const [productDesc, setProductDesc] = useState<string>('');
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!productDesc.trim()) {
      setError('Please enter a product title or description.');
      return;
    }
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzeProduct(productDesc);
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
  }, [productDesc]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Product Analytics</h2>
        <p className="mt-2 text-lg text-slate-600">
          Optimize your Etsy listings. Enter a product title or idea to get AI-powered suggestions.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={productDesc}
            onChange={(e) => setProductDesc(e.target.value)}
            placeholder="e.g., 'Personalized star map poster'"
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
          <p className="mt-4 text-slate-600">AI is optimizing your listing... this might take a moment.</p>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          <Card title={`Analysis for: "${analysis.product_concept}"`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div>
                      <h4 className="font-semibold text-slate-800">Suggested Pricing</h4>
                      <p className="text-2xl font-bold text-orange-600 mt-1">{analysis.pricing_suggestion}</p>
                  </div>
                  <div className="text-center">
                      {/* Fix: Replaced non-existent 'seo_score' with 'visibility_score' from ProductAnalysis type. Also updated label for clarity. */}
                      <h4 className="font-semibold text-slate-800">Visibility Score</h4>
                      <p className="text-4xl font-bold text-green-600 mt-1">{analysis.visibility_score}</p>
                  </div>
              </div>
          </Card>
          
          <Card title="Hypothetical Listing Performance">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricDisplay icon={TrendingUpIcon} label="Monthly Sales" value={analysis.monthly_sales} color="text-green-500" />
                <MetricDisplay icon={ShoppingCartIcon} label="Total Sales" value={analysis.total_sales.toLocaleString()} color="text-blue-500" />
                <MetricDisplay icon={EyeIcon} label="Views" value={analysis.views.toLocaleString()} color="text-purple-500" />
                <MetricDisplay icon={CheckCircleIcon} label="Conv. Rate" value={analysis.conversion_rate} color="text-green-600" />
                <MetricDisplay icon={HeartIcon} label="Favorites" value={analysis.favorites.toLocaleString()} color="text-red-500" />
                <MetricDisplay icon={CalendarIcon} label="Listing Age" value={analysis.listing_age} color="text-yellow-600" />
            </div>
          </Card>

          <Card title="Optimized Title Suggestion">
              <p className="text-lg text-slate-800 bg-slate-50 p-4 rounded-md">{analysis.title_suggestion}</p>
          </Card>

          {/* Fix: Replaced non-existent 'suggested_tags' with 'tags_analysis' and updated mapping to display tag names. */}
          <Card title="Tags Analysis (for listing)">
              <div className="flex flex-wrap gap-2">
                {analysis.tags_analysis.map((tagItem, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1.5 text-sm rounded-md font-medium">{tagItem.tag}</span>
                ))}
              </div>
          </Card>

          <Card title="Description Feedback">
              <p className="text-slate-700 leading-relaxed">{analysis.description_feedback}</p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProductAnalytics;
