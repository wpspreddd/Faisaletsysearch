import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import type { KeywordAnalysis, ShopAnalysis, ProductAnalysis } from '../types';

type FavoriteKeyword = {
    keyword: string;
    analysis: KeywordAnalysis;
}

const Favorites: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'keywords' | 'shops' | 'products'>('keywords');
    const [favoriteKeywords, setFavoriteKeywords] = useState<FavoriteKeyword[]>([]);
    const [favoriteShops, setFavoriteShops] = useState<ShopAnalysis[]>([]);
    const [favoriteProducts, setFavoriteProducts] = useState<ProductAnalysis[]>([]);

    useEffect(() => {
        const keywords = JSON.parse(localStorage.getItem('favorite_keywords') || '[]');
        const shops = JSON.parse(localStorage.getItem('favorite_shops') || '[]');
        const products = JSON.parse(localStorage.getItem('favorite_products') || '[]');
        setFavoriteKeywords(keywords);
        setFavoriteShops(shops);
        setFavoriteProducts(products);
    }, []);
    
    const removeFromFavorites = (id: string, type: 'keywords' | 'shops' | 'products') => {
        if(type === 'keywords') {
            const newFavorites = favoriteKeywords.filter(fav => fav.keyword !== id);
            setFavoriteKeywords(newFavorites);
            localStorage.setItem('favorite_keywords', JSON.stringify(newFavorites));
        } else if (type === 'shops') {
            const newFavorites = favoriteShops.filter(fav => fav.shop_name !== id);
            setFavoriteShops(newFavorites);
            localStorage.setItem('favorite_shops', JSON.stringify(newFavorites));
        } else if (type === 'products') {
            const newFavorites = favoriteProducts.filter(fav => fav.product_concept !== id);
            setFavoriteProducts(newFavorites);
            localStorage.setItem('favorite_products', JSON.stringify(newFavorites));
        }
    }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Favorites</h2>
        <p className="mt-2 text-lg text-slate-600">
          Your saved keywords, shops, and product analyses all in one place.
        </p>
      </div>

      <div>
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                    onClick={() => setActiveTab('keywords')}
                    className={`${activeTab === 'keywords' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    Keywords ({favoriteKeywords.length})
                </button>
                <button
                    onClick={() => setActiveTab('shops')}
                    className={`${activeTab === 'shops' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    Shops ({favoriteShops.length})
                </button>
                 <button
                    onClick={() => setActiveTab('products')}
                    className={`${activeTab === 'products' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    Products ({favoriteProducts.length})
                </button>
            </nav>
        </div>

        <div className="mt-6">
            {activeTab === 'keywords' && (
                <div className="space-y-4">
                    {favoriteKeywords.length > 0 ? favoriteKeywords.map(fav => (
                        <div key={fav.keyword} className="p-4 bg-white rounded-lg shadow-sm flex justify-between items-center">
                            <span className="font-semibold text-slate-800">{fav.keyword}</span>
                            <button onClick={() => removeFromFavorites(fav.keyword, 'keywords')} className="text-sm text-red-500 hover:text-red-700">Remove</button>
                        </div>
                    )) : <p className="text-slate-500 text-center py-8">No favorite keywords yet.</p>}
                </div>
            )}
            {activeTab === 'shops' && (
                <div className="space-y-4">
                     {favoriteShops.length > 0 ? favoriteShops.map(fav => (
                        <div key={fav.shop_name} className="p-4 bg-white rounded-lg shadow-sm flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-slate-800">{fav.shop_name}</p>
                                <p className="text-sm text-slate-500">{fav.niche}</p>
                            </div>
                            <button onClick={() => removeFromFavorites(fav.shop_name, 'shops')} className="text-sm text-red-500 hover:text-red-700">Remove</button>
                        </div>
                    )) : <p className="text-slate-500 text-center py-8">No favorite shops yet.</p>}
                </div>
            )}
             {activeTab === 'products' && (
                <div className="space-y-4">
                     {favoriteProducts.length > 0 ? favoriteProducts.map(fav => (
                        <div key={fav.product_concept} className="p-4 bg-white rounded-lg shadow-sm flex justify-between items-center">
                             <div>
                                <p className="font-semibold text-slate-800">{fav.product_concept}</p>
                                <p className="text-sm text-slate-500">Suggested Title: {fav.title_suggestion}</p>
                            </div>
                            <button onClick={() => removeFromFavorites(fav.product_concept, 'products')} className="text-sm text-red-500 hover:text-red-700">Remove</button>
                        </div>
                    )) : <p className="text-slate-500 text-center py-8">No favorite products yet.</p>}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default Favorites;