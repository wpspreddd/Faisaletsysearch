import React from 'react';
import type { NavSection } from './types';

export const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

export const StoreIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A.75.75 0 0 1 14.25 12h.01a.75.75 0 0 1 .75.75v7.5m-4.5 0v-7.5A.75.75 0 0 1 9.75 12h.01a.75.75 0 0 1 .75.75v7.5m-4.5 0v-7.5A.75.75 0 0 1 5.25 12h.01a.75.75 0 0 1 .75.75v7.5m15-7.5-8.25-8.25L3 12m18 0-8.25 8.25L3 12.01l8.25-8.25 8.25 8.25Z" />
  </svg>
);

export const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
);

export const EtsyLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M11.95 7.425a.338.338 0 0 0-.324.341v4.738a.338.338 0 0 0 .324.342h4.786a.338.338 0 0 0 .324-.342V7.766a.338.338 0 0 0-.324-.341H11.95Zm-1.87 5.756c0-.23-.19-.42-.42-.42H5.08a.42.42 0 0 0-.42.42v3.748a.42.42 0 0 0 .42.42h4.58a.42.42 0 0 0 .42-.42v-3.748Zm11.896-1.972a.338.338 0 0 0-.324.341v6.923a.338.338 0 0 0 .324.342h.01l1.791-.002a.338.338 0 0 0 .324-.341V11.55a.338.338 0 0 0-.324-.341h-1.801Zm-7.794-5.343a.42.42 0 0 0-.42.42v2.715a.42.42 0 0 0 .42.42h3.297a.42.42 0 0 0 .42-.42V6.286a.42.42 0 0 0-.42-.42h-3.297Zm-8.252 0a.42.42 0 0 0-.42.42v7.35a.42.42 0 0 0 .42.42h3.297a.42.42 0 0 0 .42-.42V6.286a.42.42 0 0 0-.42-.42H3.93Z" />
    </svg>
);

export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.436-7.106A1.011 1.011 0 0 1 7.49 4.14h9.02a1.012 1.012 0 0 1 .98.536l4.436 7.106a1.012 1.012 0 0 1 0 .639l-4.436 7.106a1.012 1.012 0 0 1-.98.536H7.49a1.012 1.012 0 0 1-.98-.536L2.036 12.322Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

export const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
);

export const ShoppingCartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.823-6.831a.75.75 0 0 0-.67-1.035H6.128M15 15.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

export const TrendingUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 18 9-9 4.5 4.5L21.75 6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12v-6h-6" />
    </svg>
);

export const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" />
    </svg>
);

export const CalculatorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm3-6h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm3-6h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm-7.5-12h15a2.25 2.25 0 0 1 2.25 2.25v15a2.25 2.25 0 0 1-2.25-2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75A2.25 2.25 0 0 1 5.25 4.5Z" />
    </svg>
);

export const CollectionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

export const ClipboardListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h.01M15 12h.01M10.5 16.5h3.75a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H7.5A2.25 2.25 0 0 0 5.25 6.75v7.5a2.25 2.25 0 0 0 2.25 2.25Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 21v-4.5a3.375 3.375 0 0 0-3.375-3.375h-1.5A3.375 3.375 0 0 0 7.5 16.5v4.5m11.25-8.625a3.375 3.375 0 0 0-3.375-3.375h-1.5a3.375 3.375 0 0 0-3.375 3.375V15" />
    </svg>
);

export const SwitchHorizontalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h18m-7.5-12L21 7.5m0 0L16.5 12M21 7.5H3" />
    </svg>
);

export const LinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
);


export const NAV_SECTIONS: NavSection[] = [
    {
        title: "My Shop",
        items: [
            { id: 'shop_analyzer', title: 'Shop Analyzer', icon: StoreIcon },
            { id: 'product_analyzer', title: 'Product Analytics', icon: ChartBarIcon },
            { id: 'profit_calculator', title: 'Profit Calculator', icon: CalculatorIcon, isNew: true },
        ]
    },
    {
        title: "Keyword Tools",
        items: [
            { id: 'keyword_research', title: 'Keyword Tool', icon: SearchIcon },
            { id: 'bulk_keyword_tool', title: 'Bulk Keyword Tool', icon: CollectionIcon, isNew: true },
            { id: 'compare_keywords', title: 'Compare Keywords', icon: SwitchHorizontalIcon, isNew: true },
            { id: 'rank_checker', title: 'Rank Checker', icon: TrendingUpIcon, isNew: true },
        ]
    },
    {
        title: "My Collection",
        items: [
            { id: 'keyword_lists', title: 'Keyword Lists', icon: ClipboardListIcon, isNew: true },
            { id: 'favorites', title: 'Favorites', icon: HeartIcon, isNew: true },
        ]
    }
];