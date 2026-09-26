import React, { useState } from 'react';
import {
  CheckCircle2,
  Sparkles,
  ArrowDown,
  Upload,
  Camera,
  Play,
  Share2,
  ArrowRight,
  Film,
  Heart,
  RotateCcw,
  IndianRupee,
} from 'lucide-react';
import { MMTLogo } from './MMTLogo';
import { CurrentTripState } from '../types';

interface Screen8TripStoryProps {
  tripState: CurrentTripState;
  onContinueToShareEarn: () => void;
  onBack: () => void;
}

export const Screen8TripStory: React.FC<Screen8TripStoryProps> = ({
  tripState,
  onContinueToShareEarn,
  onBack,
}) => {
  const [storyGenerated, setStoryGenerated] = useState(false);
  const destName = tripState.selectedDestination || 'Destination';
  const cleanDest = destName.trim().toUpperCase();

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-10">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#008CFF] transition-colors cursor-pointer"
      >
        <span>← Back to Booking Confirmation</span>
      </button>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
        {/* Header: Post-Trip Growth Loop */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Post-Trip Growth Loop</span>
            </div>
            <h2 className="text-base font-black text-slate-900 mt-0.5">{cleanDest} TRIP STORY</h2>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Trip Booked <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </span>
        </div>

        {/* Growth Loop Context Explanation */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-800">
            How the MakeMyTrip Growth Loop works:
          </p>
          <p className="leading-relaxed">
            When you return from {destName}, TripSpark transforms your photos into an interactive story. When friends view your story and book via MakeMyTrip, they get a verified trip and you earn <strong>MMT MyCash rewards</strong>.
          </p>
        </div>

        {!storyGenerated ? (
          /* Post-Trip Story Creation Trigger Card */
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 border border-blue-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs text-[#008CFF] flex items-center justify-center mx-auto">
              <Camera className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                Preview Your Post-Trip Story
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                See how your {destName} memories become the next traveller's inspiration reel with 1-click bookable MakeMyTrip links.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-1">
              <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-semibold shadow-2xs">
                📷 6 Vacation Photos
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-semibold shadow-2xs">
                🎥 1 Trip Highlight Clip
              </span>
            </div>

            {/* Button: CREATE TRIP STORY */}
            <button
              type="button"
              onClick={() => setStoryGenerated(true)}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#008CFF] to-[#0052CC] hover:brightness-105 active:scale-[0.99] text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>GENERATE VERTICAL TRIP STORY</span>
            </button>
          </div>
        ) : (
          /* Vertical Travel Story Preview */
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center space-y-0.5">
              <span className="text-[10px] font-black uppercase text-[#008CFF] tracking-wider">
                GENERATED VERTICAL STORY PREVIEW
              </span>
              <h3 className="text-lg font-black text-slate-900">
                {destName}: Reel to Real ✈️
              </h3>
            </div>

            {/* Story Flow Card */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-lg">
              {/* 1. WHAT INSPIRED US */}
              <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
                <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider">
                  1. WHAT INSPIRED US
                </span>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{tripState.inspirationSource?.title || `Viral ${destName} Travel Reel`}</span>
                </p>
              </div>

              <div className="flex justify-center">
                <ArrowDown className="w-4 h-4 text-slate-500" />
              </div>

              {/* 2. HOW FEASIBILITY ENGINE PLANNED IT */}
              <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
                <span className="text-[9px] font-black uppercase text-[#42B8F5] tracking-wider">
                  2. HOW MAKEMYTRIP FEASIBILITY ENGINE PLANNED IT
                </span>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#42B8F5] shrink-0" />
                  <span>{destName} Best Fit (₹{tripState.packagePricePerPerson.toLocaleString('en-IN')}/person inside budget)</span>
                </p>
              </div>

              <div className="flex justify-center">
                <ArrowDown className="w-4 h-4 text-slate-500" />
              </div>

              {/* 3. WHAT WE EXPERIENCED */}
              <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
                <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">
                  3. WHAT WE EXPERIENCED
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="h-16 rounded-lg overflow-hidden bg-slate-700">
                    <img
                      src="https://images.unsplash.com/photo-1546874177-9e664107314e?auto=format&fit=crop&w=300&q=80"
                      alt="Travel photo 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="h-16 rounded-lg overflow-hidden bg-slate-700">
                    <img
                      src="https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=300&q=80"
                      alt="Travel photo 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="h-16 rounded-lg overflow-hidden bg-slate-700">
                    <img
                      src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80"
                      alt="Travel photo 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 font-medium">
                  Real memories: Verified stay, cafe trail & sunset sights
                </p>
              </div>

              <div className="flex justify-center">
                <ArrowDown className="w-4 h-4 text-slate-500" />
              </div>

              {/* 4. 1-CLICK BOOK THIS TRIP LINK */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-[#008CFF] to-[#0065F5] text-center space-y-1 shadow-md">
                <h4 className="text-sm font-black text-white">
                  BOOK THIS TRIP ON MAKEMYTRIP ✈️
                </h4>
                <p className="text-[10px] text-blue-100 font-bold uppercase tracking-wider">
                  Friends get ₹1,500 off • You earn ₹2,000 MyCash
                </p>
              </div>
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={onContinueToShareEarn}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#E55A00] hover:brightness-105 active:scale-[0.99] text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>SHARE STORY & EARN MMT MYCASH</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
