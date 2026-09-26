import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Camera,
  Calendar,
  Users,
  MapPin,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  Plane,
  Heart,
  TrendingDown,
  Compass,
} from 'lucide-react';
import { InspirationSource, InspirationDemo } from '../types';
import { SocialInspirationBottomSheet } from './SocialInspirationBottomSheet';

interface ScreenHolidayPackagesProps {
  onBackToHome: () => void;
  onOpenMakeItReal: () => void;
  onSelectSource: (source: InspirationSource) => void;
  onSelectDemo?: (demo: InspirationDemo) => void;
  initialDestination?: string;
  initialOrigin?: string;
}

export const ScreenHolidayPackages: React.FC<ScreenHolidayPackagesProps> = ({
  onBackToHome,
  onOpenMakeItReal,
  onSelectSource,
  onSelectDemo,
  initialDestination = 'Goa',
  initialOrigin = 'New Delhi',
}) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [dates, setDates] = useState('25 Oct – 29 Oct');
  const [guests, setGuests] = useState('4 Guests, 2 Rooms');
  const [activeFilter, setActiveFilter] = useState<string>('All Filters');

  const popularDestinations = [
    {
      name: 'Goa',
      tag: 'Beaches & Shacks',
      price: '₹14,999',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Thailand',
      tag: 'Islands & Nightlife',
      price: '₹28,499',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Kerala',
      tag: 'Backwaters & Hills',
      price: '₹16,499',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Maldives',
      tag: 'Overwater Luxury',
      price: '₹48,999',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Kashmir',
      tag: 'Valleys & Snow',
      price: '₹19,299',
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Top Holiday Packages Navigation Header */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
            aria-label="Back to MMT Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-[#111111] tracking-tight leading-tight">
              Holiday Packages
            </h1>
            <p className="text-xs text-[#6B6B6B] font-medium">India and International</p>
          </div>
        </div>

        {/* Feature quick pill */}
        <button
          onClick={() => setIsBottomSheetOpen(true)}
          className="px-3 py-1.5 rounded-full bg-[#EAF6FF] text-[#008CFF] hover:bg-[#008CFF] hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 border border-[#008CFF]/30 cursor-pointer shadow-xs"
        >
          <Camera className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Make It Real</span>
          <Sparkles className="w-3 h-3 text-amber-500" />
        </button>
      </div>

      {/* Main Holiday Packages Search Box Container */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-3">
        {/* Row 1: STARTING FROM & TRAVELLING TO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Starting From */}
          <div className="p-3 rounded-xl border border-slate-200 bg-[#FAFAFA] hover:border-slate-300 transition-all">
            <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block">
              STARTING FROM
            </span>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="font-bold text-sm text-[#111111] bg-transparent focus:outline-none w-full"
                placeholder="City of departure"
              />
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">India</span>
          </div>

          {/* TRAVELLING TO — PROMINENT WITH BLUE CAMERA / SOCIAL REEL INSPIRATION ICON */}
          <div className="relative p-3 rounded-xl border-2 border-[#008CFF]/40 bg-white hover:border-[#008CFF] transition-all shadow-xs group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#008CFF] uppercase tracking-wider flex items-center gap-1">
                TRAVELLING TO
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#EAF6FF] text-[#008CFF] font-black">
                  NEW ✨
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 mt-1">
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="font-black text-base text-[#111111] bg-transparent focus:outline-none w-full"
                  placeholder="Where to? (e.g. Goa)"
                />
                <span className="text-[11px] text-[#6B6B6B] block">India or International</span>
              </div>

              {/* Prominent Blue Camera / Social Inspiration Icon */}
              <button
                type="button"
                onClick={() => setIsBottomSheetOpen(true)}
                className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-gradient-to-r from-[#008CFF] to-[#006CFF] text-white text-xs font-bold shadow-md shadow-blue-500/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
                title="Saw a Reel? Tap to Make It Real!"
              >
                <Camera className="w-4 h-4" />
                <span className="text-[11px]">Reel / Pic</span>
                <Sparkles className="w-3 h-3 text-amber-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: STARTING DATE & ROOM & GUESTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Starting Date */}
          <div className="p-3 rounded-xl border border-slate-200 bg-[#FAFAFA] hover:border-slate-300 transition-all">
            <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block">
              STARTING DATE
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="font-bold text-sm text-[#111111] bg-transparent focus:outline-none w-full"
                placeholder="Travel dates"
              />
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">Flexible ±3 days</span>
          </div>

          {/* Room & Guests */}
          <div className="p-3 rounded-xl border border-slate-200 bg-[#FAFAFA] hover:border-slate-300 transition-all">
            <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block">
              ROOM & GUESTS
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Users className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="font-bold text-sm text-[#111111] bg-transparent focus:outline-none w-full"
                placeholder="Number of travellers"
              />
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">₹35,000 / person budget</span>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs font-semibold">
          {['All Filters', 'Duration 4-5D', 'Flights Included', 'Under ₹35k', 'Villa / Pool'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-full border transition-all shrink-0 cursor-pointer ${
                activeFilter === filter
                  ? 'border-[#008CFF] bg-[#EAF6FF] text-[#008CFF]'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Large Full-Width Blue Gradient SEARCH / MAKE IT REAL Button */}
        <div className="pt-2">
          <button
            onClick={() => setIsBottomSheetOpen(true)}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#42B8F5] to-[#0065F5] text-white text-sm font-black tracking-wide shadow-md shadow-blue-500/20 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Search Packages with Make It Real</span>
          </button>
        </div>
      </div>

      {/* In-stream Promotional Banner: "Turn a Reel into a Holiday Package" */}
      <div
        onClick={() => setIsBottomSheetOpen(true)}
        className="p-4 rounded-2xl bg-white border border-sky-100 shadow-xs hover:border-[#008CFF] transition-all cursor-pointer flex items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#008CFF] to-[#006CFF] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#008CFF] bg-[#EAF6FF] px-1.5 py-0.5 rounded">
                NEW FEATURE
              </span>
              <span className="text-xs font-bold text-[#111111]">
                Saw a Reel or TikTok you loved?
              </span>
            </div>
            <p className="text-xs text-[#6B6B6B] mt-0.5">
              Tap here to paste link or upload screenshot. MMT turns it into a bookable package!
            </p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-[#008CFF] text-white text-xs font-bold group-hover:bg-[#006CFF] transition-colors shrink-0">
          Try Now
        </div>
      </div>

      {/* Popular Destination Circles: Section 14 & MMT Screenshot Reference */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#111111]">
              Popular Trips at Lowest Prices!
            </h3>
            <p className="text-xs text-[#6B6B6B]">
              Handpicked packages tailored for seasonal travel
            </p>
          </div>
          <span className="text-xs text-[#008CFF] font-bold cursor-pointer hover:underline">
            View All
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {popularDestinations.map((dest) => (
            <div
              key={dest.name}
              onClick={() => {
                setDestination(dest.name);
                setIsBottomSheetOpen(true);
              }}
              className="flex flex-col items-center text-center p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-[#008CFF] transition-colors shadow-xs mb-1.5">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-xs font-black text-[#111111] group-hover:text-[#008CFF]">
                {dest.name}
              </span>
              <span className="text-[10px] text-[#6B6B6B] truncate max-w-full">
                {dest.tag}
              </span>
              <span className="text-[11px] font-extrabold text-[#008B73] mt-0.5">
                from {dest.price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Social Inspiration Bottom Sheet */}
      <SocialInspirationBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        onSelectSource={onSelectSource}
        onSelectDemo={onSelectDemo}
      />
    </div>
  );
};
