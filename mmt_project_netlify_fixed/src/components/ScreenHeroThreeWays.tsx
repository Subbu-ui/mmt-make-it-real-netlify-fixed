import React from 'react';
import {
  Film,
  PiggyBank,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingDown,
  Info,
  Clock,
  Plane,
  Building2,
  Car,
  ChevronRight,
} from 'lucide-react';
import { InspirationDemo, StrategyType } from '../types';

interface ScreenHeroThreeWaysProps {
  demo: InspirationDemo;
  travellerCount: number;
  budgetPerPerson: number;
  totalBudget: number;
  selectedStrategy: StrategyType;
  onSelectOption: (strategy: StrategyType) => void;
  onViewDeepDive?: (strategy: StrategyType) => void;
  onViewComparisonTable?: () => void;
  onContinue: () => void;
  onBack: () => void;
}

export const ScreenHeroThreeWays: React.FC<ScreenHeroThreeWaysProps> = ({
  demo,
  travellerCount,
  budgetPerPerson,
  totalBudget,
  selectedStrategy,
  onSelectOption,
  onViewDeepDive,
  onViewComparisonTable,
  onContinue,
  onBack,
}) => {
  const recreatePrice = demo.recreateOption?.costPerPerson || 47200;
  const budgetPrice = demo.budgetOption?.costPerPerson || 34800;
  const vibePrice = demo.vibeOption?.costPerPerson || 28600;

  const recreateDiff = recreatePrice - budgetPerPerson;
  const budgetSavings = recreatePrice - budgetPrice;
  const vibeSavings = recreatePrice - vibePrice;

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-16">
      {/* Top Header & Navigation */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-[#008CFF] transition-colors cursor-pointer"
          >
            <span>←</span>
            <span>Feasibility Check</span>
          </button>
          <span className="text-xs font-bold text-[#008CFF] bg-[#EAF6FF] px-2.5 py-0.5 rounded-full">
            Holiday Packages Selection
          </span>
        </div>

        {/* Progress Indicator: Step 4 Options */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#6B6B6B] mb-1.5">
            <span className="text-[#008B73]">✓ 1 Inspiration</span>
            <span className="text-[#008B73]">✓ 2 Trip Details</span>
            <span className="text-[#008B73]">✓ 3 Feasibility</span>
            <span className="text-[#008CFF]">4 Options</span>
            <span className="text-slate-400">5 Book</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#42B8F5] to-[#0065F5] w-4/5 rounded-full" />
          </div>
        </div>
      </div>

      {/* Screen Title & Subtitle (Section 13 Specification) */}
      <div className="text-center max-w-xl mx-auto space-y-1 py-1">
        <h1 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
          3 ways to make this trip real
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6B6B]">
          Choose how you want to experience this trip for {travellerCount} guests (Target: ₹{budgetPerPerson.toLocaleString('en-IN')}/person).
        </p>
      </div>

      {/* 3 High-Trust White Cards Grid (Section 13) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ========================================================= */}
        {/* OPTION 1: RECREATE IT                                     */}
        {/* ========================================================= */}
        <div
          onClick={() => onSelectOption('recreate')}
          className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs cursor-pointer ${
            selectedStrategy === 'recreate'
              ? 'border-[#008CFF] ring-2 ring-[#008CFF]/20 shadow-md'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          {/* Card Media with Badge */}
          <div className="relative h-36 w-full overflow-hidden bg-slate-100">
            <img
              src={demo.recreateOption?.imageUrl || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80'}
              alt="Recreate It"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2.5 left-2.5">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/75 text-white backdrop-blur-xs shadow-xs">
                Closest to the Reel
              </span>
            </div>
            {selectedStrategy === 'recreate' && (
              <div className="absolute top-2.5 right-2.5 bg-[#008CFF] text-white p-1 rounded-full shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  OPTION 1
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  {demo.recreateOption?.duration || '4N / 5D'}
                </span>
              </div>
              <h3 className="text-base font-black text-[#111111] leading-snug">
                Recreate the exact trip
              </h3>
              <div className="pt-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-[#111111]">
                    ₹{recreatePrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-[#6B6B6B]">/ person</span>
                </div>
                <span className="text-[11px] font-bold text-amber-600 block mt-0.5">
                  Exceeds your target by ₹{recreateDiff > 0 ? recreateDiff.toLocaleString('en-IN') : '0'}
                </span>
              </div>

              {/* Highlights */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Exact stay category (Luxury beachfront)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Premium flights with direct timings</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Sunset dining & private transfers</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectOption('recreate');
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedStrategy === 'recreate'
                    ? 'bg-[#008CFF] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                {selectedStrategy === 'recreate' ? 'SELECTED' : 'SELECT THIS'}
              </button>
              {onViewDeepDive && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDeepDive('recreate');
                  }}
                  className="w-full text-center text-xs font-bold text-[#008CFF] hover:underline cursor-pointer py-1"
                >
                  VIEW DETAILS
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* OPTION 2 (HERO OPTION): DO IT FOR LESS                    */}
        {/* ========================================================= */}
        <div
          onClick={() => onSelectOption('budget')}
          className={`bg-white rounded-2xl border-2 transition-all flex flex-col justify-between overflow-hidden shadow-sm cursor-pointer relative ${
            selectedStrategy === 'budget'
              ? 'border-[#008CFF] ring-3 ring-[#008CFF]/20 shadow-lg'
              : 'border-[#008B73]/60 hover:border-[#008CFF]'
          }`}
        >
          {/* Card Media with Badge */}
          <div className="relative h-36 w-full overflow-hidden bg-slate-100">
            <img
              src={demo.budgetOption?.imageUrl || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80'}
              alt="Do It For Less"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2.5 left-2.5">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#008B73] text-white shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>RECOMMENDED • BEST VALUE</span>
              </span>
            </div>
            {selectedStrategy === 'budget' && (
              <div className="absolute top-2.5 right-2.5 bg-[#008CFF] text-white p-1 rounded-full shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-[#008B73] tracking-wider">
                  OPTION 2 (SMART CHOICE)
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  {demo.budgetOption?.duration || '4N / 5D'}
                </span>
              </div>
              <h3 className="text-base font-black text-[#111111] leading-snug">
                Same {demo.destination} vibe, smarter price
              </h3>
              <div className="pt-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-[#008B73]">
                    ₹{budgetPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-[#6B6B6B]">/ person</span>
                </div>
                <span className="text-[11px] font-bold text-[#008B73] block mt-0.5">
                  Within your budget • Saves ₹{budgetSavings.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Highlights */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008B73]" />
                  <span>Boutique stay with same aesthetic & pool</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008B73]" />
                  <span>MMT-optimised flight corridor timing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008B73]" />
                  <span>Similar beach club & sunset experience</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectOption('budget');
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedStrategy === 'budget'
                    ? 'bg-[#008CFF] text-white shadow-md shadow-blue-500/20'
                    : 'bg-[#EAF6FF] text-[#008CFF] hover:bg-[#008CFF] hover:text-white'
                }`}
              >
                {selectedStrategy === 'budget' ? 'SELECTED' : 'SELECT THIS'}
              </button>
              {onViewDeepDive && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDeepDive('budget');
                  }}
                  className="w-full text-center text-xs font-bold text-[#008CFF] hover:underline cursor-pointer py-1"
                >
                  VIEW DETAILS
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* OPTION 3: MATCH THE VIBE                                  */}
        {/* ========================================================= */}
        <div
          onClick={() => onSelectOption('vibe')}
          className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs cursor-pointer ${
            selectedStrategy === 'vibe'
              ? 'border-[#008CFF] ring-2 ring-[#008CFF]/20 shadow-md'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          {/* Card Media with Badge */}
          <div className="relative h-36 w-full overflow-hidden bg-slate-100">
            <img
              src={demo.vibeOption?.imageUrl || 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80'}
              alt="Match The Vibe"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2.5 left-2.5">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white backdrop-blur-xs shadow-xs">
                ALTERNATIVE DESTINATION
              </span>
            </div>
            {selectedStrategy === 'vibe' && (
              <div className="absolute top-2.5 right-2.5 bg-[#008CFF] text-white p-1 rounded-full shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  OPTION 3
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  {demo.vibeOption?.duration || '4N / 5D'}
                </span>
              </div>
              <h3 className="text-base font-black text-[#111111] leading-snug">
                Similar coastal vibe, lower crowd ({demo.vibeOption?.destination || 'Gokarna / Kerala'})
              </h3>
              <div className="pt-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-[#111111]">
                    ₹{vibePrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-[#6B6B6B]">/ person</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 block mt-0.5">
                  Save ₹{vibeSavings.toLocaleString('en-IN')} vs recreation
                </span>
              </div>

              {/* Highlights */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Gorgeous cliff / beach sunset views</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Peaceful coastal stay & uncrowded spots</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Authentic coastal dining & relaxed pace</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectOption('vibe');
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedStrategy === 'vibe'
                    ? 'bg-[#008CFF] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                {selectedStrategy === 'vibe' ? 'SELECTED' : 'SELECT THIS'}
              </button>
              {onViewDeepDive && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDeepDive('vibe');
                  }}
                  className="w-full text-center text-xs font-bold text-[#008CFF] hover:underline cursor-pointer py-1"
                >
                  VIEW DETAILS
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison table helper link */}
      {onViewComparisonTable && (
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onViewComparisonTable}
            className="text-xs font-bold text-[#008CFF] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Compare all 3 options in a detailed side-by-side matrix</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Sticky Bottom Bar / Large Action CTA */}
      <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-[#6B6B6B] block">Selected Experience:</span>
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-[#111111] capitalize">
              {selectedStrategy === 'recreate'
                ? 'Option 1: Recreate It'
                : selectedStrategy === 'budget'
                ? 'Option 2: Do It For Less (Recommended)'
                : 'Option 3: Match The Vibe'}
            </span>
            <span className="text-xs font-bold text-[#008CFF]">
              ₹
              {(selectedStrategy === 'recreate'
                ? recreatePrice
                : selectedStrategy === 'budget'
                ? budgetPrice
                : vibePrice
              ).toLocaleString('en-IN')}{' '}
              / person
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#42B8F5] to-[#0065F5] hover:brightness-105 active:scale-[0.98] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
        >
          <span>CONTINUE WITH THIS OPTION</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
