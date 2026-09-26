import React, { useState } from 'react';
import {
  Share2,
  Gift,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Instagram,
  RefreshCw,
} from 'lucide-react';
import { MMTLogo } from './MMTLogo';

interface Screen9ShareEarnProps {
  destination?: string;
  onPlanSimilarTrip: () => void;
  onBackToHome: () => void;
}

export const Screen9ShareEarn: React.FC<Screen9ShareEarnProps> = ({
  destination = 'Trip',
  onPlanSimilarTrip,
  onBackToHome,
}) => {
  const [copied, setCopied] = useState(false);
  const [sharedToast, setSharedToast] = useState<string | null>(null);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    setSharedToast(`Shared link to ${platform}! Simulated +200 points credited.`);
    setTimeout(() => setSharedToast(null), 3500);
  };

  return (
    <div className="space-y-4 max-w-md mx-auto pb-8">
      {/* Toast */}
      {sharedToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-4">
          {sharedToast}
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
        {/* Title */}
        <div className="text-center space-y-1">
          <span className="text-[10px] font-black uppercase text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full tracking-wider border border-purple-200">
            Loop & Growth
          </span>
          <h1 className="text-2xl font-black text-[#111111]">
            SHARE & EARN
          </h1>
          <p className="text-xs text-[#6B6B6B]">
            Inspire your network & earn rewards when friends plan trips.
          </p>
        </div>

        {/* Demo Points Breakdown (Screen 9 Mandate) */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-purple-900">
            <Gift className="w-4 h-4 text-purple-600" />
            <span>TripSpark Referral Points</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-purple-100">
              <span className="font-semibold text-slate-800">Share your {destination} Trip Story</span>
              <span className="font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                +200 demo MMT points
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-purple-100">
              <span className="font-semibold text-slate-800">A friend explores your trip</span>
              <span className="font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                +50 demo points
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-purple-100">
              <span className="font-semibold text-slate-800">A friend books a similar trip</span>
              <span className="font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                +500 demo points
              </span>
            </div>
          </div>

          {/* Prototype Label (Screen 9 Mandate) */}
          <p className="text-[10px] text-purple-700/80 text-center italic">
            Illustrative prototype rewards
          </p>
        </div>

        {/* Share Buttons (Screen 9 Mandate) */}
        <div className="space-y-2">
          {/* SHARE TO INSTAGRAM */}
          <button
            type="button"
            onClick={() => handleShare('Instagram')}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-black text-xs tracking-wider uppercase shadow-sm hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Instagram className="w-4 h-4" />
            <span>SHARE TO INSTAGRAM</span>
          </button>

          {/* SHARE TO WHATSAPP */}
          <button
            type="button"
            onClick={() => handleShare('WhatsApp')}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs tracking-wider uppercase shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>SHARE TO WHATSAPP</span>
          </button>

          {/* COPY LINK */}
          <button
            type="button"
            onClick={handleCopy}
            className="w-full py-3 px-4 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-black text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">LINK COPIED!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>COPY LINK</span>
              </>
            )}
          </button>
        </div>

        {/* Complete Circular Growth Loop Demonstration (Screen 9 Mandate) */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-emerald-50 border-2 border-blue-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#008CFF]">
              Virality Simulation
            </span>
            <span className="text-[9px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
              New Friend Experience
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-black text-[#111111]">
              Simulate Friend's View: “PLAN A SIMILAR TRIP”
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              When a friend clicks your shared story link, they enter TripSpark to customize their own starting city, budget, and dates.
            </p>
          </div>

          {/* Button: PLAN A SIMILAR TRIP */}
          <button
            type="button"
            onClick={onPlanSimilarTrip}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#42B8F5] to-[#0065F5] hover:brightness-105 active:scale-[0.99] text-white font-black text-xs tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>PLAN A SIMILAR TRIP (TRY AS NEW TRAVELLER)</span>
          </button>
        </div>

        {/* Return to MMT Home */}
        <button
          type="button"
          onClick={onBackToHome}
          className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-center block"
        >
          Return to MakeMyTrip Home
        </button>
      </div>
    </div>
  );
};
