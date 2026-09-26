import React from 'react';
import {
  Plane,
  Building2,
  Train,
  Car,
  Palmtree,
  Sparkles,
  ArrowRight,
  Flame,
  Film,
  MapPin,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

interface Screen1HomeProps {
  onStartTripSpark: () => void;
}

export const Screen1Home: React.FC<Screen1HomeProps> = ({ onStartTripSpark }) => {
  // Official MakeMyTrip service routes
  const mmtServices = [
    {
      name: 'Flights',
      action: 'Book Flights',
      icon: Plane,
      url: 'https://www.makemytrip.com/flights/',
    },
    {
      name: 'Hotels',
      action: 'Book Hotels',
      icon: Building2,
      url: 'https://www.makemytrip.com/hotels/',
    },
    {
      name: 'Trains',
      action: 'Book Trains',
      icon: Train,
      url: 'https://www.makemytrip.com/railways/',
    },
    {
      name: 'Cabs',
      action: 'Book Cabs',
      icon: Car,
      url: 'https://www.makemytrip.com/cabs/',
    },
    {
      name: 'Holidays',
      action: 'Book Holidays',
      icon: Palmtree,
      url: 'https://www.makemytrip.com/holidays-india/',
    },
  ];

  const handleOpenMmtService = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const trendingDestinations = [
    {
      name: 'Goa',
      country: 'India',
      tag: 'Beaches & Nightlife',
      image:
        'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=640&q=80',
    },
    {
      name: 'Bali',
      country: 'Indonesia',
      tag: 'Villas & Culture',
      image:
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=640&q=80',
    },
    {
      name: 'Phuket',
      country: 'Thailand',
      tag: 'Islands & Resorts',
      image:
        'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=640&q=80',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 pb-8 max-w-4xl mx-auto">
      {/* 1. BOOK TRAVEL SERVICES SECTION */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Book Travel Services
          </span>
          <span className="text-[10px] font-semibold text-slate-400">Official MakeMyTrip Services</span>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {mmtServices.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.name}
                type="button"
                onClick={() => handleOpenMmtService(service.url)}
                className="flex flex-col items-center gap-1.5 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl hover:bg-slate-50 transition-all duration-200 cursor-pointer group text-center"
                title={`${service.action} on MakeMyTrip`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100/90 text-slate-700 flex items-center justify-center group-hover:scale-105 group-hover:bg-[#EBF5FF] group-hover:text-[#008CFF] group-hover:border-[#008CFF]/30 border border-transparent transition-all duration-200 shadow-2xs">
                  <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform duration-200" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-slate-900 leading-tight">
                    {service.name}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 group-hover:text-[#008CFF] font-medium transition-colors hidden xs:inline">
                    {service.action}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. TRIPSPARK HERO */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0A142F] via-[#0C2356] to-[#103A82] p-5 sm:p-7 text-white shadow-xl border border-blue-400/20">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#008CFF]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Column: Headline, subtext, support row, and CTA */}
          <div className="md:col-span-7 space-y-4">
            {/* Small badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/12 backdrop-blur-md border border-white/20 text-white text-xs font-black tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>TripSpark</span>
              <span className="bg-[#EB2026] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                NEW
              </span>
            </div>

            {/* Large headline & Subheading */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                Saw a Reel you want to turn into a trip?
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-lg">
                Don’t just save it. MMT’s <strong className="text-white">Feasibility Engine</strong> checks real flights, hotel tiers, and budget reality to compare <strong className="text-amber-300">Exact Match</strong>, <strong className="text-emerald-300">Same Vibe</strong>, and <strong className="text-blue-300">Best Fit</strong> trips you can actually book.
              </p>
            </div>

            {/* Small support row */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px]">
              <span className="text-slate-300 font-medium mr-1">Supports:</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15 text-white font-semibold">
                Instagram Reels
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15 text-white font-semibold">
                YouTube Shorts
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15 text-white font-semibold">
                Screenshots
              </span>
            </div>

            {/* Primary CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onStartTripSpark}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-3.5 px-7 rounded-2xl bg-white hover:bg-slate-50 text-[#0065F5] hover:text-[#0051C6] font-black text-sm tracking-wider uppercase shadow-lg shadow-black/20 active:scale-[0.99] transition-all cursor-pointer group"
              >
                <span>TRY TRIPSPARK</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right Column: Subtle visual - Reel frame transitioning into a travel itinerary card */}
          <div className="md:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-[280px] sm:max-w-[300px]">
              {/* Back card: Simulated Social Reel frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-slate-900 aspect-[9/14] max-h-[260px] sm:max-h-[290px] w-full">
                <img
                  src="https://images.unsplash.com/photo-1546874177-9e664107314e?auto=format&fit=crop&w=600&q=80"
                  alt="Seoul Travel Reel"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
                
                {/* Reel UI Overlay elements */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs text-[10px] text-white">
                  <Film className="w-3 h-3 text-rose-400" />
                  <span>Travel Reel</span>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left text-white">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                    <MapPin className="w-3 h-3" />
                    <span>Seoul, South Korea</span>
                  </div>
                  <p className="text-[10px] text-slate-200 truncate mt-0.5">
                    Autumn Foliage & Street Food Vibes
                  </p>
                </div>
              </div>

              {/* Front card overlay: Transitioning into MMT Bookable Itinerary */}
              <div className="absolute -bottom-3 -right-2 sm:-right-4 w-[85%] bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200/90 shadow-2xl text-slate-900 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between text-[10px] font-extrabold text-[#008CFF] mb-1">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>MMT Itinerary Generated</span>
                  </span>
                  <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-black text-[9px]">
                    BOOKABLE
                  </span>
                </div>
                <div className="font-black text-xs text-slate-900">4N / 5D Seoul Autumn Getaway</div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                  <span>Flights + 4★ Hotel + Passes</span>
                  <span className="font-black text-slate-900 text-xs">₹64,800</span>
                </div>
                <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center gap-1 text-[9px] text-slate-600 font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Instant MakeMyTrip handoff</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRENDING DESTINATIONS SECTION */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-slate-900">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Trending on MakeMyTrip this week</span>
          </div>
          <button
            type="button"
            onClick={() => handleOpenMmtService('https://www.makemytrip.com/holidays-india/')}
            className="text-xs font-bold text-[#008CFF] hover:text-[#0065F5] transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Explore all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {trendingDestinations.map((dest) => (
            <div
              key={dest.name}
              onClick={() => handleOpenMmtService('https://www.makemytrip.com/holidays-india/')}
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 cursor-pointer shadow-xs border border-slate-200/60"
              title={`Explore ${dest.name} holiday packages on MakeMyTrip`}
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black tracking-tight">{dest.name}</h3>
                    <p className="text-[10px] text-slate-200 font-medium">{dest.tag}</p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white transition-transform duration-200 group-hover:translate-x-1 group-hover:bg-[#008CFF]">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
