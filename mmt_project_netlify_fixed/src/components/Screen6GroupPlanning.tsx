import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Lock,
  Share2,
  MessageCircle,
} from 'lucide-react';
import { CurrentTripState } from '../types';

interface Screen6GroupPlanningProps {
  tripState: CurrentTripState;
  onLockTrip: () => void;
  onBack: () => void;
}

export const Screen6GroupPlanning: React.FC<Screen6GroupPlanningProps> = ({
  tripState,
  onLockTrip,
  onBack,
}) => {
  const [isOptimized, setIsOptimized] = useState(tripState.isGroupOptimized || false);
  const destName = tripState.selectedDestination || 'Destination';
  const travellers = tripState.totalTravellers || tripState.travellers || 2;
  const optimizedPrice =
    tripState.package?.groupOptimizedPricePerPerson ||
    Math.round(tripState.packagePricePerPerson * 0.88);
  const friendBudget = Math.round(optimizedPrice * 1.02);

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-10">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#008CFF] transition-colors cursor-pointer"
      >
        <span>← Back to Package Itinerary</span>
      </button>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
        {/* Title */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#008CFF] text-[11px] font-black uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Optional Group Alignment • Lightweight</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Align Your Travel Group
          </h1>
          <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
            Share this link with your friends to lock dates, split costs, and unlock group discounts before booking.
          </p>
        </div>

        {/* Quick WhatsApp / Link Share Card */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <MessageCircle className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="text-xs font-black text-emerald-950 block">
                Share TripSpark Vote on WhatsApp
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">
                Friends vote on budget & dates with 1 tap
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert('Trip link copied to clipboard!');
            }}
            className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100/50 transition-colors cursor-pointer shrink-0"
          >
            Copy Link
          </button>
        </div>

        {/* Group Alignment Scorecard */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-black text-slate-900">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#008CFF]" />
              <span>Group Status:</span>
            </span>
            <span>{travellers} Friends Responded</span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Dates */}
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-semibold">Travel Dates:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                {travellers}/{travellers} Agree on {tripState.dates || 'Late October'} <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </span>
            </div>

            {/* Destination */}
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-semibold">Destination:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                {travellers}/{travellers} Enthusiastic for {destName} <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </span>
            </div>

            {/* Budget */}
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-semibold">Budget Alignment:</span>
              {isOptimized ? (
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                  {travellers}/{travellers} Fit budget <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </span>
              ) : (
                <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                  {travellers - 1}/{travellers} Fit budget <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Group readiness bar */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-center space-y-2">
          <span className="text-[10px] font-black uppercase text-[#008CFF] tracking-wider block">
            GROUP READINESS SCORE
          </span>
          <div className="text-3xl font-black text-slate-900">
            {isOptimized ? '100% Ready' : '92% Aligned'}
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#008CFF] to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: isOptimized ? '100%' : '92%' }}
            />
          </div>
        </div>

        {/* Budget Optimization Action */}
        {!isOptimized ? (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>One friend requested staying under ₹{(friendBudget / 1000).toFixed(0)}K. Tap below to apply group tariff discount.</span>
            </div>

            <button
              type="button"
              onClick={() => setIsOptimized(true)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#008CFF] to-[#0052CC] hover:brightness-105 active:scale-[0.99] text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>APPLY GROUP DISCOUNT FOR EVERYONE</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Group Multi-Passenger Tariff Applied (-12% Savings)</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-semibold text-emerald-700">New price per person:</span>
                <span className="text-xl font-black text-emerald-900">
                  ₹{optimizedPrice.toLocaleString('en-IN')}<span className="text-xs font-normal"> / person</span>
                </span>
              </div>
              <p className="text-xs font-bold text-emerald-700 flex items-center gap-1 pt-1 border-t border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% group consensus achieved! Ready to lock.</span>
              </p>
            </div>

            {/* Button: LOCK THIS TRIP */}
            <button
              type="button"
              onClick={onLockTrip}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#E55A00] hover:brightness-105 active:scale-[0.99] text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>LOCK GROUP RATE & PROCEED TO CHECKOUT</span>
            </button>
          </div>
        )}

        {/* Optional Skip Option */}
        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={onLockTrip}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer py-1 underline underline-offset-4"
          >
            Skip alignment & proceed straight to booking →
          </button>
        </div>
      </div>
    </div>
  );
};
