import React, { useState } from 'react';
import {
  Check,
  ArrowRight,
  ShieldCheck,
  IndianRupee,
  Film,
  PiggyBank,
  Table,
  CheckCircle2,
  Sparkles,
  Plane,
  Building2,
  Calendar,
  AlertCircle,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { InspirationDemo, StrategyType } from '../types';

export type DeepDiveView = 'recreate' | 'budget' | 'vibe' | 'comparison';

interface ScreenWhyThisOptionProps {
  demo: InspirationDemo;
  strategy: StrategyType;
  travellerCount: number;
  initialView?: DeepDiveView;
  onSelectStrategy?: (strategy: StrategyType) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ScreenWhyThisOption: React.FC<ScreenWhyThisOptionProps> = ({
  demo,
  strategy,
  travellerCount,
  initialView,
  onSelectStrategy,
  onNext,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<DeepDiveView>(
    initialView || (strategy as DeepDiveView) || 'budget'
  );

  const currentOption =
    activeTab === 'recreate'
      ? demo.recreateOption
      : activeTab === 'budget'
      ? demo.budgetOption
      : demo.vibeOption;

  const handleSelectTab = (tab: DeepDiveView) => {
    setActiveTab(tab);
    if (tab !== 'comparison' && onSelectStrategy) {
      onSelectStrategy(tab as StrategyType);
    }
  };

  const recreatePrice = demo.recreateOption?.costPerPerson || 47200;
  const currentPrice = currentOption?.costPerPerson || 34800;
  const savingsPerPerson = Math.max(0, recreatePrice - currentPrice);
  const totalGroupSavings = savingsPerPerson * travellerCount;

  // Comparison details based on active tab
  const similarityScore = activeTab === 'recreate' ? 98 : activeTab === 'budget' ? 91 : 84;
  const stayComparison =
    activeTab === 'recreate'
      ? {
          original: '5-Star Luxury Beach Villa (₹24,000/night)',
          mmt: 'Exact Luxury Beach Villa with Private Pool',
          tradeoff: 'Full match with high luxury tariff',
        }
      : activeTab === 'budget'
      ? {
          original: '5-Star Luxury Beachfront Villa',
          mmt: 'Verified Boutique Villa (Private Pool, 400m from beach)',
          tradeoff: 'Identical aesthetic & pool, saves ₹14,000 on accommodation',
        }
      : {
          original: 'Goa High-Season Beach Club & Villa',
          mmt: 'Cliff-edge Boutique Eco-Resort with Panoramic Sea View',
          tradeoff: 'More peaceful coastal vibe with lower tourist density',
        };

  const flightComparison =
    activeTab === 'recreate'
      ? {
          original: 'Prime Afternoon Flight (Peak hours)',
          mmt: 'Direct Flight at prime slot',
          tradeoff: 'Standard peak fare',
        }
      : activeTab === 'budget'
      ? {
          original: 'Peak hour flight',
          mmt: 'MMT-optimised early morning departure',
          tradeoff: 'Saves ₹4,200/seat with guaranteed early check-in pass',
        }
      : {
          original: 'Goa Flight Corridor',
          mmt: 'Alternative Airport Corridor with scenic coastal drive',
          tradeoff: 'Saves ₹6,500/seat with cab included',
        };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-16">
      {/* Top Navigation & Progress */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-[#008CFF] transition-colors cursor-pointer"
          >
            <span>←</span>
            <span>All 3 Options</span>
          </button>
          <span className="text-xs font-bold text-[#008CFF] bg-[#EAF6FF] px-2.5 py-0.5 rounded-full">
            Detailed Comparison
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 p-1 rounded-xl flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => handleSelectTab('recreate')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'recreate'
                ? 'bg-white text-[#111111] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Recreate It
          </button>
          <button
            type="button"
            onClick={() => handleSelectTab('budget')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'budget'
                ? 'bg-[#008CFF] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Do It For Less ★
          </button>
          <button
            type="button"
            onClick={() => handleSelectTab('vibe')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'vibe'
                ? 'bg-white text-[#111111] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Match The Vibe
          </button>
          <button
            type="button"
            onClick={() => handleSelectTab('comparison')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-white text-[#111111] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Comparison Matrix
          </button>
        </div>
      </div>

      {/* Main Section 14 Content */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200 space-y-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#008CFF] block">
            MMT VALUE ENGINEERING BREAKDOWN
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#111111] mt-0.5">
            Original Social Inspiration vs Selected MMT Package
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            How MakeMyTrip engineered this holiday package while preserving the exact aesthetic you fell in love with.
          </p>
        </div>

        {/* Section 14 Highlights: Visual Similarity Banner */}
        <div className="p-4 rounded-xl bg-[#EAF6FF]/70 border border-[#008CFF]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#008CFF] text-white flex flex-col items-center justify-center shrink-0">
              <span className="text-lg font-black">{similarityScore}%</span>
              <span className="text-[8px] font-bold uppercase tracking-wider">MATCH</span>
            </div>
            <div>
              <h3 className="text-sm font-black text-[#111111]">
                Visual & Experience Similarity Score: {similarityScore}%
              </h3>
              <p className="text-xs text-slate-700">
                Verified against reel frame colors, private pool dimensions, and sunset ambiance.
              </p>
            </div>
          </div>

          {savingsPerPerson > 0 && (
            <div className="text-right shrink-0 bg-white px-3 py-1.5 rounded-lg border border-blue-200">
              <span className="text-[10px] font-bold text-[#6B6B6B] uppercase block">Total Group Savings</span>
              <span className="text-sm font-black text-[#008B73]">
                Save ₹{totalGroupSavings.toLocaleString('en-IN')} for {travellerCount} pax
              </span>
            </div>
          )}
        </div>

        {/* Side by Side Comparison (Section 14 Mandate) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column A: Original Inspiration */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-black uppercase text-slate-500">
                Original Social Inspiration
              </span>
              <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full font-bold text-slate-700">
                Reel / Screenshot
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Stay</span>
                <p className="font-bold text-slate-800">{stayComparison.original}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Flights</span>
                <p className="font-bold text-slate-800">{flightComparison.original}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Dining / Passes</span>
                <p className="font-bold text-slate-800">Unbooked walk-in rates & standard queue</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Estimated Price</span>
                <p className="font-black text-slate-800 text-sm">
                  ₹{recreatePrice.toLocaleString('en-IN')} / person
                </p>
              </div>
            </div>
          </div>

          {/* Column B: Selected MMT Package */}
          <div className="p-4 rounded-xl bg-[#EAF6FF]/30 border border-[#008CFF]/50 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#008CFF]/20">
              <span className="text-xs font-black uppercase text-[#008CFF]">
                Selected MMT Package ({activeTab === 'budget' ? 'Do It For Less' : activeTab === 'recreate' ? 'Recreate It' : 'Match The Vibe'})
              </span>
              <span className="text-[10px] bg-[#008CFF] text-white px-2 py-0.5 rounded-full font-bold">
                Guaranteed MMT
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#008CFF] uppercase block">Stay</span>
                <p className="font-bold text-[#111111]">{stayComparison.mmt}</p>
                <p className="text-[10px] text-emerald-700 mt-0.5 font-semibold">✓ {stayComparison.tradeoff}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#008CFF] uppercase block">Flights</span>
                <p className="font-bold text-[#111111]">{flightComparison.mmt}</p>
                <p className="text-[10px] text-emerald-700 mt-0.5 font-semibold">✓ {flightComparison.tradeoff}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#008CFF] uppercase block">Dining / Passes</span>
                <p className="font-bold text-[#111111]">Pre-reserved sunset tables & confirmed airport transfers</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#008CFF] uppercase block">MMT Package Price</span>
                <p className="font-black text-[#008B73] text-sm">
                  ₹{currentPrice.toLocaleString('en-IN')} / person (Total ₹{(currentPrice * travellerCount).toLocaleString('en-IN')})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 14 Price Breakdown & Savings Summary */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#111111] block">
            Itemized Price Breakdown (Per Person)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-[#6B6B6B] block">Flights (Roundtrip)</span>
              <span className="font-black text-[#111111]">₹{Math.round(currentPrice * 0.42).toLocaleString('en-IN')}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-[#6B6B6B] block">Accommodation</span>
              <span className="font-black text-[#111111]">₹{Math.round(currentPrice * 0.38).toLocaleString('en-IN')}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-[#6B6B6B] block">Transfers & Cabs</span>
              <span className="font-black text-[#111111]">₹{Math.round(currentPrice * 0.08).toLocaleString('en-IN')}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-[#6B6B6B] block">Experiences & Entry</span>
              <span className="font-black text-[#111111]">₹{Math.round(currentPrice * 0.12).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* CTA to Blueprint Itinerary */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#6B6B6B]">
            Next: View day-wise timeline with activities, sunset slots, and stay check-in.
          </div>
          <button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#42B8F5] to-[#0065F5] hover:brightness-105 active:scale-[0.98] text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <span>VIEW DAY-WISE ITINERARY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
