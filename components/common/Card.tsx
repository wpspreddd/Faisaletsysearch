
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-md ${className}`}>
      <h3 className="text-xl font-semibold text-slate-800 mb-4 pb-3 border-b border-slate-200">{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export default Card;
