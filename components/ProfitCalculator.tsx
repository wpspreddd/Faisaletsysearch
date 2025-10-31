import React, { useState, useMemo } from 'react';
import Card from './common/Card';

const InputField: React.FC<{ label: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; isPercent?: boolean }> = ({ label, value, onChange, isPercent = false }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <div className="mt-1 relative rounded-md shadow-sm">
            {!isPercent && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><span className="text-gray-500 sm:text-sm">$</span></div>}
            <input
                type="number"
                value={value}
                onChange={onChange}
                className={`w-full rounded-md border-slate-300 focus:border-orange-500 focus:ring-orange-500 ${!isPercent ? 'pl-7' : ''} ${isPercent ? 'pr-12' : ''}`}
                placeholder="0.00"
            />
            {isPercent && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><span className="text-gray-500 sm:text-sm">%</span></div>}
        </div>
    </div>
);


const ProfitCalculator: React.FC = () => {
    const [salePrice, setSalePrice] = useState(25);
    const [shippingCharge, setShippingCharge] = useState(5);
    const [itemCost, setItemCost] = useState(5);
    const [shippingCost, setShippingCost] = useState(5);
    
    const [transactionFeePercent, setTransactionFeePercent] = useState(6.5);
    const [processingFeePercent, setProcessingFeePercent] = useState(3);
    const [processingFeeFixed, setProcessingFeeFixed] = useState(0.25);
    const [offsiteAdFeePercent, setOffsiteAdFeePercent] = useState(12);
    const [useOffsiteAd, setUseOffsiteAd] = useState(false);
    const listingFee = 0.20;

    const calculations = useMemo(() => {
        const totalRevenue = salePrice + shippingCharge;
        
        const transactionFee = totalRevenue * (transactionFeePercent / 100);
        const processingFee = totalRevenue * (processingFeePercent / 100) + processingFeeFixed;
        const offsiteAdFee = useOffsiteAd ? totalRevenue * (offsiteAdFeePercent / 100) : 0;
        
        const totalFees = listingFee + transactionFee + processingFee + offsiteAdFee;
        const totalCost = itemCost + shippingCost;
        
        const profit = totalRevenue - totalCost - totalFees;
        const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

        return { totalRevenue, totalFees, totalCost, profit, margin };
    }, [salePrice, shippingCharge, itemCost, shippingCost, transactionFeePercent, processingFeePercent, processingFeeFixed, offsiteAdFeePercent, useOffsiteAd]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Profit Calculator</h2>
        <p className="mt-2 text-lg text-slate-600">
          Estimate your profit and margins by entering your product's costs and pricing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <Card title="Pricing & Costs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Sale Price" value={salePrice} onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)} />
                    <InputField label="Shipping Charge (to customer)" value={shippingCharge} onChange={(e) => setShippingCharge(parseFloat(e.target.value) || 0)} />
                    <InputField label="Cost of Item (materials)" value={itemCost} onChange={(e) => setItemCost(parseFloat(e.target.value) || 0)} />
                    <InputField label="Cost of Shipping (what you pay)" value={shippingCost} onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)} />
                </div>
            </Card>
            <Card title="Etsy Fees (US Defaults)">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField label="Transaction Fee" value={transactionFeePercent} onChange={(e) => setTransactionFeePercent(parseFloat(e.target.value) || 0)} isPercent />
                    <InputField label="Payment Processing Fee" value={processingFeePercent} onChange={(e) => setProcessingFeePercent(parseFloat(e.target.value) || 0)} isPercent />
                    <InputField label="Payment Processing Fixed" value={processingFeeFixed} onChange={(e) => setProcessingFeeFixed(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="mt-6">
                    <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" checked={useOffsiteAd} onChange={(e) => setUseOffsiteAd(e.target.checked)} />
                        <span className="ml-2 text-sm text-slate-700">Apply Offsite Ad Fee?</span>
                    </label>
                    {useOffsiteAd && (
                         <div className="mt-4 md:w-1/3">
                            <InputField label="Offsite Ad Fee" value={offsiteAdFeePercent} onChange={(e) => setOffsiteAdFeePercent(parseFloat(e.target.value) || 0)} isPercent />
                         </div>
                    )}
                </div>
                 <p className="text-sm text-slate-500 mt-4">Note: A non-configurable $0.20 listing fee is also included in the calculation.</p>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <Card title="Profit Summary">
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-lg">
                        <span className="text-slate-600">Total Revenue</span>
                        <span className="font-semibold text-slate-800">${calculations.totalRevenue.toFixed(2)}</span>
                    </div>
                    <hr/>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Total Costs</span>
                        <span className="font-medium text-red-600">-${calculations.totalCost.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Total Etsy Fees</span>
                        <span className="font-medium text-red-600">-${calculations.totalFees.toFixed(2)}</span>
                    </div>
                    <hr/>
                    <div className="text-center py-4">
                        <p className="text-lg text-slate-600">Estimated Profit</p>
                        <p className={`text-5xl font-bold ${calculations.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${calculations.profit.toFixed(2)}
                        </p>
                    </div>
                     <div className="text-center py-2">
                        <p className="text-md text-slate-600">Profit Margin</p>
                        <p className={`text-3xl font-bold ${calculations.margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {calculations.margin.toFixed(1)}%
                        </p>
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfitCalculator;