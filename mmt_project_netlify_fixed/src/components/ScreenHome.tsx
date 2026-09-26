import React, { useState } from 'react';
import {
  Plane,
  Building2,
  Palmtree,
  Train,
  Bus,
  Car,
  Home,
  ShieldCheck,
  Compass,
  CreditCard,
  FileCheck,
  Clock,
  Sparkles,
  Mic,
  ArrowRight,
  Play,
  Share2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { InspirationDemo, InspirationSource } from '../types';
import { DEMO_INSPIRATIONS } from '../data/demoData';
import { SocialInspirationBottomSheet } from './SocialInspirationBottomSheet';

interface ScreenHomeProps {
  onStartMakeItReal: () => void;
  onOpenHolidayPackages?: () => void;
  onSelectSource?: (source: InspirationSource) => void;
  onSelectDemoDirectly?: (demo: InspirationDemo) => void;
}

export const ScreenHome: React.FC<ScreenHomeProps> = ({
  onStartMakeItReal,
  onOpenHolidayPackages,
  onSelectSource,
  onSelectDemoDirectly,
}) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [myraQuery, setMyraQuery] = useState('');

  const primaryServices = [
    {
      id: 'flights',
      title: 'Flights',
      subtitle: 'Domestic & Int.',
      icon: Plane,
      color: 'text-[#008CFF] bg-[#EAF6FF]',
      action: () => window.open('https://www.makemytrip.com/flights/', '_blank'),
    },
    {
      id: 'hotels',
      title: 'Hotels',
      subtitle: 'Villas, Homestays',
      icon: Building2,
      color: 'text-[#E41D2D] bg-[#FFEAEA]',
      action: () => window.open('https://www.makemytrip.com/hotels/', '_blank'),
    },
    {
      id: 'holidays',
      title: 'Holiday Packages',
      subtitle: 'Goa, Bali, Kerala',
      icon: Palmtree,
      color: 'text-[#008B73] bg-[#E6F8F3]',
      isHighlighted: true,
      action: () => {
        if (onOpenHolidayPackages) onOpenHolidayPackages();
        else onStartMakeItReal();
      },
    },
    {
      id: 'trains',
      title: 'Trains / Bus',
      subtitle: 'IRCTC Authorized',
      icon: Train,
      color: 'text-amber-600 bg-amber-50',
      action: () => window.open('https://www.makemytrip.com/railways/', '_blank'),
    },
  ];

  const secondaryServices = [
    { label: 'Airport Cabs', icon: Car },
    { label: 'Villas & Homestays', icon: Home },
    { label: 'Outstation Cabs', icon: Car },
    { label: 'Forex & Currency', icon: CreditCard },
    { label: 'Tours & Attractions', icon: Compass },
    { label: 'Hourly Stays', icon: Clock },
    { label: 'Visa Services', icon: FileCheck },
    { label: 'Travel Insurance', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Search Pill: Myra Voice & Natural Language Search */}
      <div className="relative p-[1.5px] rounded-2xl bg-gradient-to-r from-[#008CFF] via-purple-500 to-[#E41D2D] shadow-xs">
        <div className="bg-white rounded-[14px] px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={myraQuery}
              onChange={(e) => setMyraQuery(e.target.value)}
              placeholder="Ask Myra about your trip or drop a Reel link..."
              className="text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-medium bg-transparent focus:outline-none w-full truncate"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsBottomSheetOpen(true);
                }
              }}
            />
          </div>

          <button
            onClick={() => setIsBottomSheetOpen(true)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors shrink-0 cursor-pointer"
            title="Speak to Myra"
          >
            <Mic className="w-4 h-4 text-purple-600" />
          </button>
        </div>
      </div>

      {/* Primary Service Cards: Reference 1 MakeMyTrip Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {primaryServices.map((service) => {
          const Icon = service.icon;
          return (
            <button
              key={service.id}
              onClick={service.action}
              className={`p-3.5 rounded-2xl bg-white border text-left flex flex-col justify-between transition-all hover:shadow-md cursor-pointer group ${
                service.isHighlighted
                  ? 'border-[#008CFF]/50 ring-2 ring-[#008CFF]/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${service.color} transition-transform group-hover:scale-105`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {service.isHighlighted && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#008CFF] text-white">
                    HOT
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-black text-[#111111] group-hover:text-[#008CFF] transition-colors leading-tight">
                  {service.title}
                </h3>
                <p className="text-[11px] text-[#6B6B6B] truncate mt-0.5">
                  {service.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Secondary Services Card: Clean White Container */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-xs border border-slate-200">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {secondaryServices.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                onClick={() => {
                  if (item.label.includes('Villas')) {
                    if (onOpenHolidayPackages) onOpenHolidayPackages();
                    else setIsBottomSheetOpen(true);
                  } else {
                    window.open('https://www.makemytrip.com/', '_blank');
                  }
                }}
                className="flex flex-col items-center text-center p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-[#EAF6FF] text-slate-600 group-hover:text-[#008CFF] flex items-center justify-center mb-1 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-slate-700 group-hover:text-[#008CFF] leading-tight line-clamp-2">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: MAKE IT REAL NATURAL PROMOTIONAL CARD */}
      {/* Clean white card beneath major service cards, resembling an authentic MMT product card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border-2 border-[#008CFF]/30 hover:border-[#008CFF] transition-all">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            {/* Social Reel Video Thumbnail Illustration */}
            <div
              onClick={() => setIsBottomSheetOpen(true)}
              className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-xs cursor-pointer group"
            >
              <img
                src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=300&q=80"
                alt="Social Reel Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-1">
                <div className="w-6 h-6 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-xs">
                  <Play className="w-3 h-3 fill-slate-900 ml-0.5" />
                </div>
              </div>
            </div>

            {/* Promotional Copy */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-[#EAF6FF] text-[#008CFF] text-[10px] font-black tracking-wider uppercase">
                  NEW ✨
                </span>
                <span className="text-[11px] text-[#6B6B6B] font-bold">
                  In Holiday Packages
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#111111] leading-tight">
                Make It Real
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-[#111111] mt-0.5">
                “Saw a Reel that made you want to travel?”
              </p>
              <p className="text-xs text-[#6B6B6B] mt-0.5 leading-relaxed">
                Share the inspiration. We’ll turn it into a trip you can actually take.
              </p>
            </div>
          </div>

          {/* Action Button in MMT bright blue */}
          <div className="w-full sm:w-auto shrink-0">
            <button
              onClick={() => setIsBottomSheetOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#008CFF] hover:bg-[#006CFF] text-white text-xs font-black shadow-md shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wide"
            >
              <span>TRY MAKE IT REAL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Sample Inspiration Chips */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="text-[11px] font-bold text-[#6B6B6B]">Try with popular examples:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {DEMO_INSPIRATIONS.slice(0, 3).map((demo) => (
              <button
                key={demo.id}
                onClick={() => {
                  if (onSelectDemoDirectly) onSelectDemoDirectly(demo);
                  if (onSelectSource) onSelectSource({ type: 'DEMO', demoId: demo.id });
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-[#EAF6FF] text-slate-700 hover:text-[#008CFF] border border-slate-200 transition-colors font-medium text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <span>{demo.flag}</span>
                <span>{demo.destination}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Holiday Packages Direct Entry Banner */}
      <div
        onClick={() => {
          if (onOpenHolidayPackages) onOpenHolidayPackages();
          else onStartMakeItReal();
        }}
        className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E6F8F3] text-[#008B73] flex items-center justify-center shrink-0">
            <Palmtree className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#111111] group-hover:text-[#008CFF] transition-colors">
              Explore Holiday Packages
            </h3>
            <p className="text-xs text-[#6B6B6B]">
              Customise flights, hotels, villa stays, and activities across 200+ destinations
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#008CFF] transition-colors shrink-0" />
      </div>

      {/* Social Inspiration Bottom Sheet */}
      <SocialInspirationBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        onSelectSource={(source) => {
          if (onSelectSource) onSelectSource(source);
          else onStartMakeItReal();
        }}
        onSelectDemo={onSelectDemoDirectly}
      />
    </div>
  );
};
