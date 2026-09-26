import React, { useState } from 'react';
import {
  Sparkles,
  Plane,
  Building2,
  Car,
  Bookmark,
  Share2,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { InspirationDemo, StrategyType } from '../types';

interface ScreenFinalCtaProps {
  demo: InspirationDemo;
  strategy: StrategyType;
  travellerCount: number;
  totalBudget: number;
  dates: string;
  origin: string;
  appliedSavingsDeduction?: number;
  onResetDemo: () => void;
  onTrackEvent?: (eventName: string) => void;
}

export const ScreenFinalCta: React.FC<ScreenFinalCtaProps> = ({
  demo,
  strategy,
  travellerCount,
  totalBudget,
  dates,
  origin,
  appliedSavingsDeduction = 0,
  onResetDemo,
  onTrackEvent,
}) => {
  const [savedToAccount, setSavedToAccount] = useState(false);
  const [shared, setShared] = useState(false);

  const currentOption =
    strategy === 'recreate'
      ? demo.recreateOption
      : strategy === 'budget'
      ? demo.budgetOption
      : demo.vibeOption;

  const perPersonPrice = currentOption.costPerPerson - appliedSavingsDeduction;
  const groupTotal = perPersonPrice * travellerCount;

  const handleOpenLink = (url: string, eventName: string) => {
    if (onTrackEvent) {
      onTrackEvent(eventName);
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSaveToAccount = () => {
    setSavedToAccount(true);
    if (onTrackEvent) onTrackEvent('trip_saved_to_mmt_account');
  };

  const handleShare = () => {
    setShared(true);
    if (onTrackEvent) onTrackEvent('trip_shared_with_friends');
    setTimeout(() => setShared(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Completion Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black uppercase tracking-wider border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>ITINERARY FEASIBILITY VERIFIED</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#041533] tracking-tight">
            READY TO MAKE IT REAL?
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Your travel inspiration from social media has been converted into a personalized, budget-friendly and directly bookable MakeMyTrip journey.
          </p>
        </div>

        {/* Booking Readiness Summary Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#041533] to-[#0d2a63] text-white shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                DESTINATION & PLAN
              </p>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>{currentOption.destination}</span>
                <span className="text-xl">{demo.flag}</span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentOption.title} • {dates} • {currentOption.duration}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                FINAL ESTIMATE
              </p>
              <p className="text-2xl sm:text-3xl font-black text-amber-300">
                ₹{groupTotal.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-slate-300">
                ₹{perPersonPrice.toLocaleString('en-IN')}/person for {travellerCount} travellers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Origin</span>
              <span className="font-extrabold text-white">{origin}</span>
            </div>
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Travellers</span>
              <span className="font-extrabold text-white">{travellerCount} Group</span>
            </div>
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Vibe Match</span>
              <span className="font-extrabold text-emerald-300">100% Protected</span>
            </div>
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Budget</span>
              <span className="font-extrabold text-white">₹{totalBudget.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Official MakeMyTrip Bookings */}
        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-wider text-slate-700">
            BOOK DIRECTLY ON OFFICIAL MAKEMYTRIP:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Book Flight */}
            <button
              type="button"
              onClick={() => handleOpenLink('https://www.makemytrip.com/flights/', 'click_book_flight')}
              className="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-[#008cff] hover:bg-sky-50/50 transition-all text-left flex flex-col justify-between shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#008cff] flex items-center justify-center">
                  <Plane className="w-5 h-5" />
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#008cff]" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase">
                  BOOK FLIGHT ON MAKEMYTRIP
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Check live flight fares for {origin} → {demo.destination}
                </p>
              </div>
            </button>

            {/* Book Hotel */}
            <button
              type="button"
              onClick={() => handleOpenLink('https://www.makemytrip.com/hotels/', 'click_book_hotel')}
              className="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all text-left flex flex-col justify-between shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase">
                  BOOK HOTEL ON MAKEMYTRIP
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  View pool villas & handpicked stays in {demo.destination}
                </p>
              </div>
            </button>

            {/* Book Transfers */}
            <button
              type="button"
              onClick={() => handleOpenLink('https://www.makemytrip.com/how2go', 'click_book_transfers')}
              className="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 transition-all text-left flex flex-col justify-between shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase">
                  BOOK TRANSFERS ON MAKEMYTRIP
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Reserve airport pickup and local sightseeing cabs
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Secondary Account & Share Buttons */}
        <div className="pt-2 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSaveToAccount}
            className={`px-5 py-3 rounded-xl border text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              savedToAccount
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {savedToAccount ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>SAVED TO MY MMT ACCOUNT ✓</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-slate-500" />
                <span>SAVE TRIP TO MY MMT ACCOUNT</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className={`px-5 py-3 rounded-xl border text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              shared
                ? 'bg-sky-50 border-sky-300 text-sky-800'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {shared ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#008cff]" />
                <span>LINK COPIED TO CLIPBOARD!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>SHARE WITH FRIENDS</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onResetDemo}
            className="px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 transition-all ml-auto cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>TEST ANOTHER REEL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
