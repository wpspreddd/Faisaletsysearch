import React from 'react';

interface BarChartProps {
  data: { month: string; value: number }[];
  colorClass?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, colorClass = 'bg-orange-200' }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-slate-500 py-8">No trend data available.</div>;
  }

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full h-64 flex items-end justify-around gap-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
      {data.map((item, index) => {
        const heightPercentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        return (
          <div key={index} className="flex-1 flex flex-col items-center h-full group relative pt-6">
            <div
              className={`w-3/4 ${colorClass} hover:opacity-80 rounded-t-md transition-all duration-300`}
              style={{ height: `${heightPercentage}%` }}
            >
               <div className="absolute -top-0 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                {item.value}
              </div>
            </div>
            <span className="text-xs text-slate-500 mt-2 font-medium">{item.month}</span>
          </div>
        );
      })}
    </div>
  );
};

export default BarChart;