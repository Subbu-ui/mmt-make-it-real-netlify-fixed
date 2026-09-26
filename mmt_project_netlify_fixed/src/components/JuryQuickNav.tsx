import React from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';

interface JuryQuickNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  destinationName?: string;
  onSelectStep: (step: number) => void;
}

export const JuryQuickNav: React.FC<JuryQuickNavProps> = ({
  isOpen,
  onClose,
  currentStep,
  destinationName,
  onSelectStep,
}) => {
  if (!isOpen) return null;

  const tripLabel = destinationName ? `${destinationName} Trip` : 'Booking Trip';
  const steps = [
    { num: 1, label: 'Home', subtitle: 'MMT Hub & Feasibility Entry' },
    { num: 2, label: 'Inspiration', subtitle: 'Reel / Short Link Analysis' },
    { num: 3, label: 'Liked & Constraints', subtitle: 'Taste & Traveler Reality Check' },
    { num: 4, label: 'Feasibility Hero', subtitle: 'Exact Match vs Same Vibe vs Best Fit' },
    { num: 5, label: tripLabel, subtitle: 'Booking-Ready MMT Package' },
    { num: 6, label: 'Group Sync', subtitle: 'Lightweight Alignment (Optional)' },
    { num: 7, label: 'MMT Checkout', subtitle: 'Production-Plausible Booking' },
    { num: 8, label: 'TripStory', subtitle: 'Post-Trip Growth Loop' },
    { num: 9, label: 'Share & Earn', subtitle: 'Referral & MMT MyCash Loop' },
  ];

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 shadow-xl py-3 px-4 relative z-30 animate-in slide-in-from-top-3 duration-200">
      <div className="max-w-6xl mx-auto space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-sm">✨</span>
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              Demo Navigator — Screen Jump for Evaluators
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Navigator"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5 pt-1">
          {steps.map((s) => {
            const isActive = currentStep === s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  onSelectStep(s.num);
                  onClose();
                }}
                className={`p-2 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between border ${
                  isActive
                    ? 'bg-[#008CFF] text-white border-[#008CFF] shadow-sm ring-2 ring-blue-300/40'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {s.num}
                  </span>
                  {isActive && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <div className="text-[11px] font-bold truncate leading-tight">{s.label}</div>
                <div className={`text-[9px] truncate mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                  {s.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
