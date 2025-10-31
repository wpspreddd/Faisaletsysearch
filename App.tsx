import React, { useState, useEffect } from 'react';
import { NAV_SECTIONS, EtsyLogo, LinkIcon } from './constants';
import KeywordResearchTool from './components/KeywordResearchTool';
import ShopAnalyzer from './components/ShopAnalyzer';
import ProductAnalytics from './components/ProductAnalytics';
import ProfitCalculator from './components/ProfitCalculator';
import BulkKeywordTool from './components/BulkKeywordTool';
import CompareKeywords from './components/CompareKeywords';
import RankChecker from './components/RankChecker';
import KeywordLists from './components/KeywordLists';
import Favorites from './components/Favorites';
import Spinner from './components/common/Spinner';


import type { NavItem } from './types';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<NavItem>(NAV_SECTIONS[0].items[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [connectedShop, setConnectedShop] = useState<string | null>(null);
  const [connectionStep, setConnectionStep] = useState<'idle' | 'connecting'>('idle');


  useEffect(() => {
    const savedShop = localStorage.getItem('connected_etsy_shop');
    if (savedShop) {
      setConnectedShop(savedShop);
    }
  }, []);

  useEffect(() => {
    if (connectionStep === 'connecting') {
      const timer = setTimeout(() => {
        const shopName = window.prompt("Etsy connection successful!\nPlease enter your shop name to link it.");
        if (shopName && shopName.trim()) {
          const trimmedName = shopName.trim();
          localStorage.setItem('connected_etsy_shop', trimmedName);
          setConnectedShop(trimmedName);
        }
        setConnectionStep('idle');
      }, 2500); // Simulate 2.5 second redirect time

      return () => clearTimeout(timer);
    }
  }, [connectionStep]);


  const handleConnect = () => {
    setConnectionStep('connecting');
  };

  const handleDisconnect = () => {
      localStorage.removeItem('connected_etsy_shop');
      setConnectedShop(null);
  };


  const renderActiveTool = () => {
    switch (activeTool.id) {
      case 'keyword_research':
        return <KeywordResearchTool />;
      case 'shop_analyzer':
        return <ShopAnalyzer connectedShop={connectedShop} />;
      case 'product_analyzer':
        return <ProductAnalytics />;
      case 'profit_calculator':
        return <ProfitCalculator />;
      case 'bulk_keyword_tool':
        return <BulkKeywordTool />;
      case 'compare_keywords':
        return <CompareKeywords />;
      case 'rank_checker':
        return <RankChecker />;
      case 'keyword_lists':
        return <KeywordLists />;
      case 'favorites':
        return <Favorites />;
      default:
        return <ShopAnalyzer connectedShop={connectedShop} />;
    }
  };

  const ConnectButton: React.FC = () => (
    <div className="p-4 border-t border-slate-200">
        {connectedShop ? (
            <div className="text-center">
                <p className="text-sm font-medium text-slate-700 truncate">Connected: <span className="font-bold">{connectedShop}</span></p>
                <button onClick={handleDisconnect} className="text-xs text-orange-600 hover:underline mt-1">Disconnect</button>
            </div>
        ) : (
            <button onClick={handleConnect} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                <LinkIcon className="h-5 w-5" />
                <span className="font-semibold text-sm">Connect Etsy Shop</span>
            </button>
        )}
    </div>
  );
  
  const EtsyConnectingView: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <EtsyLogo className="h-16 w-16 text-orange-500 mb-4" />
      <h2 className="text-2xl font-bold text-slate-800">Connecting to Etsy...</h2>
      <p className="mt-2 text-slate-600">You are being redirected to Etsy to authorize the connection.</p>
      <p className="text-slate-600">Please complete the steps in the new window.</p>
      <div className="mt-8">
        <Spinner size="lg" colorClass="border-orange-500" />
      </div>
    </div>
  );


  const SidebarContent: React.FC = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 h-16 px-4 border-b border-slate-200">
        <EtsyLogo className="h-8 w-8 text-orange-500" />
        <h1 className="text-xl font-bold text-slate-800">Seller Assistant</h1>
      </div>
      <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="px-4 text-sm font-semibold text-slate-500 mb-2">{section.title}</h2>
            <div className="space-y-1">
                {section.items.map((item) => (
                <button
                    key={item.id}
                    onClick={() => {
                    setActiveTool(item);
                    setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg text-left transition-colors duration-200 ${
                    activeTool.id === item.id
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <item.icon className="h-6 w-6" />
                        <span className="font-medium">{item.title}</span>
                    </div>
                    {item.isNew && (
                        <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>
                    )}
                </button>
                ))}
            </div>
          </div>
        ))}
      </nav>
      <ConnectButton />
      <div className="p-2 border-t border-slate-200 text-center text-xs text-slate-500">
        <p>Powered by Gemini</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 transition-transform transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <div className="relative w-72 h-full bg-white shadow-xl">
          <SidebarContent />
        </div>
        <div
          className="absolute inset-0 bg-black opacity-50"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-72 bg-white border-r border-slate-200 shadow-sm">
        <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex md:hidden items-center justify-between h-16 px-4 bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <EtsyLogo className="h-7 w-7 text-orange-500" />
            <span className="font-bold text-lg">{activeTool.title}</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {connectionStep === 'connecting' ? <EtsyConnectingView /> : renderActiveTool()}
        </div>
      </main>
    </div>
  );
};

export default App;