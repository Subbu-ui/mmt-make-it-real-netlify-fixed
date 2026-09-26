import React from 'react';
import {
  Sparkles,
  TrendingDown,
  CheckCircle2,
  Calendar,
  Building2,
  Plane,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { PriceSavingItem, InspirationDemo } from '../types';

interface ScreenPriceSavingsProps {
  demo: InspirationDemo;
  appliedSavings: string[];
  onToggleSaving: (savingId: string) => void;
  onKeepPlan: () => void;
  onBackToCart: () => void;
}

export const ScreenPriceSavings: React.FC<ScreenPriceSavingsProps> = ({
  demo,
  appliedSavings,
  onToggleSaving,
  onKeepPlan,
  onBackToCart,
}) => {
  const savingsList = demo.savings || [];

  const totalPossibleSavings = savingsList.reduce((sum, s) => sum + s.savingPerPerson, 0);
  const currentAppliedSavings = savingsList
    .filter((s) => appliedSavings.includes(s.id))
    .reduce((sum, s) => sum + s.savingPerPerson, 0);

  return (
    <div className="space-y-6 pb-14">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToCart}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
        >
          ← Back to MMT Trip Cart
        </button>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Smart Savings Optimization
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="space-y-1 pb-4 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>MAKE IT EVEN CHEAPER?</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#041533]">
            SMART PRICE SAVING INSIGHTS
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            MakeMyTrip algorithms discovered three additional cost optimizations for your {demo.destination} journey that preserve 100% of the destination experience.
          </p>
        </div>

        {/* Live Active Savings Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-emerald-100">Applied Live Savings:</p>
            <p className="text-2xl font-black text-white">
              ₹{currentAppliedSavings.toLocaleString('en-IN')}/person
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-emerald-200 block">
              Up to ₹{totalPossibleSavings.toLocaleString('en-IN')}/person possible
            </span>
            <span className="text-[11px] text-white/80">
              Updates itinerary & total price across all screens in real-time
            </span>
          </div>
        </div>

        {/* Savings Cards */}
        <div className="space-y-3">
          {savingsList.map((item: PriceSavingItem) => {
            const isApplied = appliedSavings.includes(item.id);

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isApplied
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isApplied ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.category === 'dates' && <Calendar className="w-5 h-5" />}
                    {item.category === 'hotel' && <Building2 className="w-5 h-5" />}
                    {item.category === 'flight' && <Plane className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>{item.title}</span>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Save ₹{item.savingPerPerson.toLocaleString('en-IN')}/p
                      </span>
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 max-w-xl">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => onToggleSaving(item.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isApplied
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-[#041533] text-white hover:bg-slate-800'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>SAVING APPLIED</span>
                      </>
                    ) : (
                      <>
                        <span>APPLY SAVING</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Dual CTAs: APPLY SAVING vs KEEP MY PLAN */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onKeepPlan}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer text-center"
          >
            KEEP MY PLAN
          </button>

          <button
            type="button"
            onClick={onBackToCart}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#e41d2d] to-[#ff3b30] text-white text-sm font-extrabold shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>CONFIRM & UPDATE CART</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
