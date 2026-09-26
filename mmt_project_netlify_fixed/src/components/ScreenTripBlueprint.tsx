import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
  Plane,
  Car,
  Building2,
  CheckCircle2,
  RefreshCw,
  Share2,
  Users,
  Map as MapIcon,
  List,
  Check,
} from 'lucide-react';
import { DayPlan, InspirationDemo, StrategyType } from '../types';

interface ScreenTripBlueprintProps {
  demo: InspirationDemo;
  strategy: StrategyType;
  travellerCount: number;
  dates: string;
  onNext: () => void;
  onBack: () => void;
}

export const ScreenTripBlueprint: React.FC<ScreenTripBlueprintProps> = ({
  demo,
  strategy,
  travellerCount,
  dates,
  onNext,
  onBack,
}) => {
  const currentOption =
    strategy === 'recreate'
      ? demo.recreateOption
      : strategy === 'budget'
      ? demo.budgetOption
      : demo.vibeOption;

  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [swappedActivities, setSwappedActivities] = useState<Record<string, string>>({});
  const [showShareToast, setShowShareToast] = useState(false);

  const days: DayPlan[] = demo.blueprint && demo.blueprint.length > 0 ? demo.blueprint : [
    {
      dayNumber: 1,
      title: 'Arrival, Check-in & Sunset Cocktails',
      items: [
        {
          timeSlot: 'Morning',
          title: 'Flight arrival & Private AC Transfer',
          description: 'Meet your MMT verified driver at airport terminal with personalized name placard.',
          iconType: 'flight',
          componentCost: 1800,
          matchedFromReel: false,
        },
        {
          timeSlot: 'Afternoon',
          title: 'Boutique Stay Check-in & Poolside Chill',
          description: 'Unpack at your curated villa featuring private plunge pool and tropical garden view.',
          iconType: 'stay',
          componentCost: 3500,
          matchedFromReel: true,
        },
        {
          timeSlot: 'Evening',
          title: 'Golden Hour Sunset Lounge',
          description: 'Reserved seaside table for sunset appetizers and cocktails as seen in the Reel.',
          iconType: 'experience',
          componentCost: 1200,
          matchedFromReel: true,
        },
      ],
    },
    {
      dayNumber: 2,
      title: 'Beachside Exploration & Coastal Dining',
      items: [
        {
          timeSlot: 'Morning',
          title: 'Tropical Breakfast & Secret Cove Walk',
          description: 'Complimentary artisanal breakfast followed by an uncrowded cove trail.',
          iconType: 'experience',
          componentCost: 600,
          matchedFromReel: true,
        },
        {
          timeSlot: 'Afternoon',
          title: 'Private Speedboat Cruise / Water Activity',
          description: 'Scenic shoreline cruise with safety gear and local captain.',
          iconType: 'experience',
          componentCost: 2400,
          matchedFromReel: true,
        },
        {
          timeSlot: 'Evening',
          title: 'Vibrant Night Market & Seafood Grill',
          description: 'Fresh catch dinner with live acoustic music under fairy lights.',
          iconType: 'experience',
          componentCost: 1500,
          matchedFromReel: false,
        },
      ],
    },
    {
      dayNumber: 3,
      title: 'Heritage Trails & Aesthetic Cafes',
      items: [
        {
          timeSlot: 'Morning',
          title: 'Old Town Heritage Quarter Walk',
          description: 'Stroll through pastel-colored alleys and historic architecture.',
          iconType: 'experience',
          componentCost: 800,
          matchedFromReel: true,
        },
        {
          timeSlot: 'Afternoon',
          title: 'Artisanal Bakery & Cafe Tasting',
          description: 'Curated tasting menu at the trending cafe spotted on social media.',
          iconType: 'experience',
          componentCost: 950,
          matchedFromReel: true,
        },
        {
          timeSlot: 'Evening',
          title: 'Cliff-Top Sundowner Sessions',
          description: 'Panoramic sunset view over the Arabian sea with curated playlist.',
          iconType: 'experience',
          componentCost: 1800,
          matchedFromReel: true,
        },
      ],
    },
    {
      dayNumber: 4,
      title: 'Rejuvenation & Beach Club Night',
      items: [
        {
          timeSlot: 'Morning',
          title: 'Morning Yoga & Floating Breakfast',
          description: 'Exclusive pool floating basket breakfast served directly in your villa.',
          iconType: 'experience',
          componentCost: 1200,
          matchedFromReel: true,
        },
        {
          timeSlot: 'Afternoon',
          title: 'Spa Therapy & Leisure Hours',
          description: 'Holistic deep tissue massage or relaxation time by the cabana.',
          iconType: 'experience',
          componentCost: 2200,
          matchedFromReel: false,
        },
        {
          timeSlot: 'Evening',
          title: 'VIP Beach Club Entry & Celebration',
          description: 'Pre-booked cabana at premier beach club with DJ lineup.',
          iconType: 'experience',
          componentCost: 3000,
          matchedFromReel: true,
        },
      ],
    },
    {
      dayNumber: 5,
      title: 'Souvenir Trails & Departure',
      items: [
        {
          timeSlot: 'Morning',
          title: 'Late Breakfast & Packing',
          description: 'Enjoy a leisurely morning by the pool before assisted check-out.',
          iconType: 'stay',
          componentCost: 500,
          matchedFromReel: false,
        },
        {
          timeSlot: 'Afternoon',
          title: 'Transfer to Airport & Return Flight',
          description: 'Guaranteed punctual cab to terminal for your scheduled flight home.',
          iconType: 'flight',
          componentCost: 1800,
          matchedFromReel: false,
        },
      ],
    },
  ];

  const currentDay = days[activeDayIndex] || days[0];

  const handleSwap = (itemId: string, defaultName: string) => {
    const alternatives = [
      'Alternative Scenic Beachfront Cafe',
      'Private Yacht Cruise (Sunset Slot)',
      'Ayurvedic Wellness Spa Session',
      'Curated Local Food Walk',
    ];
    const nextAlt = alternatives[Math.floor(Math.random() * alternatives.length)];
    setSwappedActivities((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? '' : nextAlt,
    }));
  };

  const handleShare = () => {
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

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
            <span>Options & Deep Dive</span>
          </button>
          <span className="text-xs font-bold text-[#008CFF] bg-[#EAF6FF] px-2.5 py-0.5 rounded-full">
            Day-Wise Itinerary
          </span>
        </div>

        {/* Progress Indicator */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#6B6B6B] mb-1.5">
            <span className="text-[#008B73]">✓ 1 Inspiration</span>
            <span className="text-[#008B73]">✓ 2 Trip Details</span>
            <span className="text-[#008B73]">✓ 3 Feasibility</span>
            <span className="text-[#008B73]">✓ 4 Options</span>
            <span className="text-[#008CFF]">5 Itinerary & Cart</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#42B8F5] to-[#0065F5] w-full rounded-full" />
          </div>
        </div>
      </div>

      {/* Main Itinerary Container (Section 15 Specification) */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200 space-y-5">
        {/* Section 15 Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#111111]">
                Trip Blueprint • 4 Nights / 5 Days
              </h1>
            </div>
            <p className="text-xs font-black text-[#008CFF] mt-0.5">
              Destination: {demo.destination}
            </p>
            <p className="text-xs text-[#6B6B6B]">
              Customised from your social inspiration • {travellerCount} Travellers
            </p>
          </div>

          {/* Map View Toggle: [Map] / [List] */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>
        </div>

        {/* Day Selector Tabs (Section 15 Mandate) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {days.map((day, idx) => (
            <button
              key={day.dayNumber}
              type="button"
              onClick={() => setActiveDayIndex(idx)}
              className={`py-2 px-4 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer border ${
                activeDayIndex === idx
                  ? 'bg-[#008CFF] text-white border-[#008CFF] shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>Day {day.dayNumber}</span>
              <span className="block text-[10px] font-medium opacity-80">
                {idx === 0 ? 'Arrival' : idx === days.length - 1 ? 'Departure' : `Day ${day.dayNumber}`}
              </span>
            </button>
          ))}
        </div>

        {/* View Mode: Map or Timeline Content */}
        {viewMode === 'map' ? (
          <div className="p-8 rounded-2xl bg-slate-100 border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EAF6FF] text-[#008CFF] flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-[#111111]">
              Geographic Route for Day {currentDay.dayNumber}: {demo.destination}
            </h3>
            <p className="text-xs text-[#6B6B6B] max-w-md mx-auto">
              All selected venues and beach clubs are clustered within a 15-minute radius to minimize transit time and taxi tariffs.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {currentDay.items.map((it, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800">
                  📍 Pin {i + 1}: {it.title || it.activity || `Stop ${i + 1}`}
                </span>
              ))}
            </div>
          </div>
        ) : (
          /* Time-Based Flow for Active Day (Morning / Afternoon / Evening) */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-[#111111]">
                DAY {currentDay.dayNumber}: {currentDay.title}
              </h2>
              <span className="text-xs text-[#6B6B6B] font-semibold">
                {currentDay.items.length} Curated Experiences
              </span>
            </div>

            <div className="space-y-3">
              {currentDay.items.map((item, idx) => {
                const uniqueKey = `d${currentDay.dayNumber}-${idx}`;
                const baseTitle = item.title || item.activity || `Activity ${idx + 1}`;
                const displayTitle = swappedActivities[uniqueKey] || baseTitle;

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-2xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Time-based Flow Pill */}
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-800">
                          {item.timeSlot || item.time || 'Scheduled'}
                        </span>

                        {/* Vibe Match Indicator (Section 15 Mandate) */}
                        {item.matchedFromReel && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#EAF6FF] text-[#008CFF] border border-blue-200 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Matched from Reel</span>
                          </span>
                        )}
                      </div>

                      {/* Inclusions Badge */}
                      <span className="text-[10px] font-bold text-[#008B73] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 self-start sm:self-auto">
                        Transfer Included • Breakfast Included • Activity Pass
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-[#111111]">
                        {displayTitle}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Footer Row with Swap Activity */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1 text-slate-500 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Approx duration: 2.5 hours</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSwap(uniqueKey, baseTitle)}
                        className="flex items-center gap-1 text-[11px] font-black text-[#008CFF] hover:underline cursor-pointer bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>{swappedActivities[uniqueKey] ? 'Reset Original' : 'Swap Activity'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 16: GROUP SYNC / SHARE WITH CO-TRAVELLERS         */}
        {/* ========================================================= */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-black text-[#111111]">
              <Users className="w-4 h-4 text-[#008CFF]" />
              <span>Planning with friends?</span>
            </div>
            <p className="text-xs text-[#6B6B6B]">
              Share itinerary • Split costs • Vote on stays
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>SHARE VIA WHATSAPP</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-black transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>INVITE CO-TRAVELLERS</span>
            </button>
          </div>
        </div>

        {/* Share toast */}
        {showShareToast && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Itinerary link copied to clipboard! Ready to share with co-travellers on WhatsApp.</span>
          </div>
        )}

        {/* Bottom CTA to Cart */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onNext}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#42B8F5] to-[#0065F5] hover:brightness-105 active:scale-[0.99] text-white font-black text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <span>REVIEW MMT PACKAGE & PROCEED TO BOOK</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
