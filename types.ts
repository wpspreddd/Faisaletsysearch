// Fix: Add React import to resolve namespace error.
import type * as React from 'react';

export interface NavItem {
  id: string;
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  isNew?: boolean;
}

export interface NavSection {
    title: string;
    items: NavItem[];
}

export interface KeywordAnalysis {
  competition: 'Low' | 'Medium' | 'High' | string;
  search_volume: 'Low' | 'Medium' | 'High' | string;
  buyer_intent: 'Informational' | 'Commercial' | 'Transactional' | string;
  niche_suggestions: string[];
  long_tail_keywords: string[];
  suggested_tags: string[];
  product_ideas: string[];
  // New fields for chart and detailed metrics
  competition_score: number; // A score from 0-100
  estimated_monthly_searches: number; // Estimated number of searches
  historical_data: { month: string; value: number }[]; // Data for the last 12 months
}

export interface ShopAnalysis {
  shop_name: string;
  niche: string;
  estimated_monthly_sales: string;
  top_keywords: string[];
  strengths: string[];
  areas_for_improvement: string[];
}

export interface ProductAnalysis {
  product_concept: string;
  title_suggestion: string;
  description_feedback: string;
  pricing_suggestion: string;
  
  // Metrics
  monthly_sales: string;
  monthly_revenue: string;
  total_sales: number;
  listing_age: string;
  reviews: number;
  views: number;
  favorites: number;
  monthly_reviews: string;
  conversion_rate: string;
  category: string;
  visibility_score: string;
  review_ratio: string;

  // Tags Analysis
  tags_analysis: {
    tag: string;
    volume: string;
    competition: string;
    score: number;
  }[];

  // Listing Details
  listing_details: {
    when_made: string;
    listing_type: string;
    customizable: boolean;
    craft_supply: boolean;
    personalized: boolean;
    auto_renew: boolean;
    has_variations: boolean;
    title_character_count: number;
    tags_count: number;
    who_made: string;
  };

  historical_data: {
    sales: { month: string; value: number }[];
    views: { month: string; value: number }[];
    favorites: { month: string; value: number }[];
  };

  visibility_analysis: string;
}

export interface RankAnalysis {
  estimated_rank: string;
  rank_explanation: string;
  improvement_suggestions: string[];
}