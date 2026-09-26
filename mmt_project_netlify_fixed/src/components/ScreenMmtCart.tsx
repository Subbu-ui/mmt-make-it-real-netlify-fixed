import React, { useState } from 'react';
import {
  Plane,
  Building2,
  Car,
  Ticket,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Tag,
  PhoneCall,
  ChevronRight,
  Check,
} from 'lucide-react';
import { InspirationDemo, StrategyType } from '../types';

interface ScreenMmtCartProps {
  demo: InspirationDemo;
  strategy: StrategyType;
  travellerCount: number;
  totalBudget: number;
  origin: string;
  appliedSavingsDeduction?: number;
  onViewPriceComparison: () => void;
  onViewSavings: () => void;
  onNextFinal?: () => void;
  onBack: () => void;
  onTrackLinkClick?: (service: string) => void;
}

export const ScreenMmtCart: React.FC<ScreenMmtCartProps> = ({
  demo,
  strategy,
  travellerCount,
  totalBudget,
  origin,
  appliedSavingsDeduction = 0,
  onViewPriceComparison,
  onViewSavings,
  onNextFinal,
  onBack,
  onTrackLinkClick,
}) => {
  const currentOption =
    strategy === 'recreate'
      ? demo.recreateOption
      : strategy === 'budget'
      ? demo.budgetOption
      : demo.vibeOption;

  const [couponApplied, setCouponApplied] = useState(true);
  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);

  // Pricing calculations
  const perPersonBase = currentOption?.costPerPerson || 34800;
  const packageTotal = perPersonBase * travellerCount;

  // Breakdown items (Section 17 specification)
  const flightShare = Math.round(packageTotal * 0.35);
  const stayShare = Math.round(packageTotal * 0.40);
  const activitiesShare = packageTotal - flightShare - stayShare;

  const couponDiscount = couponApplied ? 5000 : 0;
  const finalPrice = Math.max(0, packageTotal - couponDiscount - appliedSavingsDeduction);

  const handleOpenLink = (url: string, service: string) => {
    if (onTrackLinkClick) {
      onTrackLinkClick(service);
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleProceedToBook = () => {
    setBookingSuccessModal(true);
    if (onNextFinal) {
      onNextFinal();
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto pb-16">
      {/* Top Header & Navigation */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-[#008CFF] transition-colors cursor-pointer"
          >
            <span>←</span>
            <span>Back to Itinerary</span>
          </button>
          <span className="text-xs font-bold text-[#008CFF] bg-[#EAF6FF] px-2.5 py-0.5 rounded-full">
            Final Step: Trip Summary
          </span>
        </div>

        {/* Progress Indicator */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#6B6B6B] mb-1.5">
            <span className="text-[#008B73]">✓ 1 Inspiration</span>
            <span className="text-[#008B73]">✓ 2 Trip Details</span>
            <span className="text-[#008B73]">✓ 3 Feasibility</span>
            <span className="text-[#008B73]">✓ 4 Options</span>
            <span className="text-[#008CFF]">5 Review & Book</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#42B8F5] to-[#0065F5] w-full rounded-full" />
          </div>
        </div>
      </div>

      {/* Main Cart Container (Section 17 Specification) */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200 space-y-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#008CFF] block">
            CONFIRMED MAKEMYTRIP HOLIDAY PACKAGE
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#111111] mt-0.5">
            Your Make It Real Package Summary
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            All inclusions, flight segments, boutique villas, and activity passes bundled into one seamless booking.
          </p>
        </div>

        {/* Summary Card (Section 17 Specification) */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Destination</span>
              <p className="font-black text-[#111111] text-sm">{demo.destination}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Duration</span>
              <p className="font-black text-[#111111] text-sm">4N / 5D</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Travellers</span>
              <p className="font-black text-[#111111] text-sm">{travellerCount} Guests</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Strategy</span>
              <p className="font-black text-[#008CFF] text-sm capitalize">
                {strategy === 'budget' ? 'Do It For Less' : strategy === 'recreate' ? 'Recreate It' : 'Match The Vibe'}
              </p>
            </div>
          </div>

          {/* Package Price Formula */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-600 font-semibold">Package Price:</span>
            <span className="text-sm font-bold text-slate-800">
              ₹{perPersonBase.toLocaleString('en-IN')} × {travellerCount} = ₹{packageTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Breakdown Items List (Section 17 Mandate) */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#111111] block">
            Itemized Booking Breakdown
          </span>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#008CFF] flex items-center justify-center">
                <Plane className="w-4 h-4" />
              </div>
              <div>
                <p className="font-black text-[#111111]">Flights ({origin} ⇄ {demo.destination})</p>
                <p className="text-[11px] text-slate-500">Includes baggage allowance & seat select for {travellerCount} pax</p>
              </div>
            </div>
            <span className="font-black text-slate-900">₹{flightShare.toLocaleString('en-IN')}</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-black text-[#111111]">Villa / Boutique Stay (4 Nights)</p>
                <p className="text-[11px] text-slate-500">Private pool villa with complimentary daily breakfast</p>
              </div>
            </div>
            <span className="font-black text-slate-900">₹{stayShare.toLocaleString('en-IN')}</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <p className="font-black text-[#111111]">Activities, Sunset Table & Transfers</p>
                <p className="text-[11px] text-slate-500">Airport AC cabs + reserved beach club pass</p>
              </div>
            </div>
            <span className="font-black text-slate-900">₹{activitiesShare.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Discounts / MMT Offers (Section 17 Mandate) */}
        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-black text-emerald-900">MMT MAKEITREAL Holiday Coupon</span>
            </div>
            <button
              type="button"
              onClick={() => setCouponApplied(!couponApplied)}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              {couponApplied ? 'Remove' : 'Apply'}
            </button>
          </div>
          {couponApplied && (
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>Promo applied at checkout</span>
              <span>- ₹5,000</span>
            </div>
          )}
        </div>

        {/* Final Price Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-[#0a2258] text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-300 tracking-wider block">
              FINAL PRICE (TOTAL FOR {travellerCount})
            </span>
            <span className="text-2xl font-black text-white">
              ₹{finalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-300 block">
              (₹{Math.round(finalPrice / travellerCount).toLocaleString('en-IN')} / person, all taxes included)
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            Guaranteed Rate
          </span>
        </div>

        {/* ========================================================= */}
        {/* SECTION 18: EXTERNAL BOOKING LINKS / MMT CHECKOUT         */}
        {/* ========================================================= */}
        <div className="space-y-3 pt-2">
          {/* Primary CTA (Section 18 Mandate): PROCEED TO BOOK ON MAKEMYTRIP */}
          <button
            type="button"
            onClick={handleProceedToBook}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#E55A00] hover:brightness-105 active:scale-[0.99] text-white font-black text-base shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <span>PROCEED TO BOOK ON MAKEMYTRIP</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Secondary Options (Section 18 Mandate) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleOpenLink(`https://www.makemytrip.com/flights/`, 'flights')}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#008CFF] text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plane className="w-3.5 h-3.5 text-[#008CFF]" />
              <span>Book Flights First</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => handleOpenLink(`https://www.makemytrip.com/hotels/`, 'hotels')}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#008CFF] text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-[#008CFF]" />
              <span>Reserve Stay Only</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => handleOpenLink(`https://www.makemytrip.com/holidays-india/`, 'expert')}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#008CFF] text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>Customise with Expert</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Success Modal */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setBookingSuccessModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-xl font-black text-[#111111]">
              Connecting to MakeMyTrip Booking Engine
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your customized Make It Real itinerary for <strong>{demo.destination}</strong> (4 Guests • ₹{finalPrice.toLocaleString('en-IN')}) has been reserved. In the production app, you will now proceed to traveler identity and payment verification.
            </p>
            <button
              type="button"
              onClick={() => setBookingSuccessModal(false)}
              className="w-full py-3 rounded-xl bg-[#008CFF] hover:bg-[#006CFF] text-white text-xs font-black transition-colors cursor-pointer uppercase tracking-wider"
            >
              CLOSE & VIEW CART
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
