import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Calendar,
  IndianRupee,
  Compass,
  Users,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { InspirationDemo } from '../types';

interface ScreenFeasibilityCheckProps {
  demo: InspirationDemo;
  travellerCount: number;
  budgetPerPerson: number;
  totalBudget: number;
  dates: string;
  onShowOptions: () => void;
  onBack?: () => void;
}

export const ScreenFeasibilityCheck: React.FC<ScreenFeasibilityCheckProps> = ({
  demo,
  travellerCount,
  budgetPerPerson,
  totalBudget,
  dates,
  onShowOptions,
  onBack,
}) => {
  const [analyzingStage, setAnalyzingStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnalyzingStage(1), 300);
    const timer2 = setTimeout(() => setAnalyzingStage(2), 600);
    const timer3 = setTimeout(() => {
      setAnalyzingStage(3);
      setIsComplete(true);
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const recreateCost = demo.recreateOption?.costPerPerson || 47000;
  const budgetGap = Math.max(0, recreateCost - budgetPerPerson);

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-12">
      {/* Top Header & Progress */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack || onShowOptions}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-[#008CFF] transition-colors cursor-pointer"
          >
            <span>←</span>
            <span>Make It Real</span>
          </button>
          <span className="text-xs font-bold text-[#008CFF] bg-[#EAF6FF] px-2.5 py-0.5 rounded-full">
            Feasibility Analysis
          </span>
        </div>

        {/* Progress Indicator */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#6B6B6B] mb-1.5">
            <span className="text-[#008B73]">✓ 1 Inspiration</span>
            <span className="text-[#008B73]">✓ 2 Trip Details</span>
            <span className="text-[#008CFF]">3 Feasibility</span>
            <span className="text-slate-400">4 Options</span>
            <span className="text-slate-400">5 Book</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#42B8F5] to-[#0065F5] w-3/5 rounded-full" />
          </div>
        </div>
      </div>

      {/* Main Card: Section 12 Specification */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200 space-y-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-black text-[#008CFF] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reality Check</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#111111]">
            Make It Real Feasibility Check
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            We checked flights, verified hotel inventory, and calculated real costs for your dates.
          </p>
        </div>

        {!isComplete ? (
          /* Quick Processing State */
          <div className="py-8 px-4 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full border-3 border-slate-100 border-t-[#008CFF] animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-800">
              Matching your inspiration against real MakeMyTrip inventory...
            </p>
            <div className="space-y-1.5 text-left text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span>1. Reading accommodation tariffs</span>
                {analyzingStage >= 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <span>...</span>}
              </div>
              <div className="flex items-center justify-between">
                <span>2. Checking seasonal flight corridors</span>
                {analyzingStage >= 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <span>...</span>}
              </div>
              <div className="flex items-center justify-between">
                <span>3. Formulating 3 realistic pathways</span>
                {analyzingStage >= 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <span>...</span>}
              </div>
            </div>
          </div>
        ) : (
          /* Section 12 Feasibility Result Card */
          <div className="space-y-4">
            {/* Input Summary Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B]">
                    Detected Inspiration:
                  </span>
                  <p className="text-sm font-black text-[#111111]">
                    {demo.destination} {demo.title || 'Beach Villa & Sunset Experience'}
                  </p>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B]">
                    Your Constraints:
                  </span>
                  <p className="text-xs font-bold text-slate-800">
                    {travellerCount} Travellers • ₹{budgetPerPerson.toLocaleString('en-IN')} / person • {dates}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Feasibility Insights: 3 Horizontal Cards (Section 12 Mandate) */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#111111] block">
                Key Feasibility Insights:
              </span>

              {/* 1. Budget Insight */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors flex items-start gap-3 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#111111]">1. Budget Feasibility</span>
                    {budgetGap > 0 ? (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase bg-amber-100 text-amber-800">
                        Adjustment needed
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                        Within budget
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {budgetGap > 0
                      ? `Recreating exact high-end luxury villa will exceed budget by ~₹${budgetGap.toLocaleString('en-IN')} / person. However, our “Do It For Less” package fits your ₹${budgetPerPerson.toLocaleString('en-IN')} target precisely.`
                      : `Your budget of ₹${budgetPerPerson.toLocaleString('en-IN')} / person is comfortably aligned with high-quality stays in ${demo.destination}.`}
                  </p>
                </div>
              </div>

              {/* 2. Seasonality Insight */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors flex items-start gap-3 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#008CFF] flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#111111]">2. Seasonality & Timing</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase bg-blue-100 text-[#006CFF]">
                      High Season
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Peak season in {demo.destination}. Weather conditions are ideal. Early booking is strongly recommended to lock in current airline fares.
                  </p>
                </div>
              </div>

              {/* 3. Experience Feasibility */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors flex items-start gap-3 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#111111]">3. Experience Feasibility</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                      100% Achievable
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Beach sunset, coastal dining, verified private pool ambiance, and nightlife are easily achievable across all 3 proposed routes.
                  </p>
                </div>
              </div>
            </div>

            {/* Large CTA: VIEW 3 REALISTIC TRIP OPTIONS (Section 12 Mandate) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onShowOptions}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#42B8F5] to-[#0065F5] hover:brightness-105 active:scale-[0.99] text-white font-black text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span>VIEW 3 REALISTIC TRIP OPTIONS</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <span className="text-[11px] text-center text-[#6B6B6B] block mt-2">
                Compare Recreate It, Do It For Less, and Match The Vibe side-by-side
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
