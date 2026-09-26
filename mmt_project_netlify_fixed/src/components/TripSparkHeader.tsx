import React from 'react';
import { Sparkles, Smartphone, Monitor, RotateCcw, Compass } from 'lucide-react';
import { MMTLogo } from './MMTLogo';

// BRAND LOCK:
// Do not modify the official MakeMyTrip logo/header
// during unrelated UI or functionality changes.
interface TripSparkHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  deviceMode: 'mobile' | 'responsive';
  onToggleDeviceMode: () => void;
  onReset: () => void;
  isDemoNavOpen?: boolean;
  onToggleDemoNav?: () => void;
}

export const TripSparkHeader: React.FC<TripSparkHeaderProps> = ({
  currentStep,
  totalSteps,
  stepTitle,
  deviceMode,
  onToggleDeviceMode,
  onReset,
  isDemoNavOpen = false,
  onToggleDemoNav,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3">
        {/* Left Section: [Original MakeMyTrip logo] | TripSpark ✨ \n See it. Plan it. Book it. */}
        <div
          onClick={onReset}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group focus:outline-none shrink-0"
          role="button"
          tabIndex={0}
          title="MakeMyTrip TripSpark"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onReset();
          }}
        >
          {/* Original MakeMyTrip Logo Asset */}
          <MMTLogo className="h-6 sm:h-7 w-auto" />

          {/* Clean Vertical Divider */}
          <span className="text-slate-300 font-light text-base sm:text-lg select-none shrink-0" aria-hidden="true">
            |
          </span>

          {/* TripSpark ✨ and Tagline */}
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                TripSpark
              </span>
              <span className="text-amber-500 text-sm select-none shrink-0">✨</span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 tracking-tight mt-0.5 leading-none whitespace-nowrap">
              See it. Plan it. Book it.
            </p>
          </div>
        </div>

        {/* Right Section: Step Indicator, Demo Navigator & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Unobtrusive Demo Navigator button for judges & evaluators */}
          {onToggleDemoNav && (
            <button
              type="button"
              onClick={onToggleDemoNav}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                isDemoNavOpen
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200'
              }`}
              title="Jump between prototype screens for evaluation"
            >
              <Compass className={`w-3.5 h-3.5 ${isDemoNavOpen ? 'text-amber-400' : 'text-[#008CFF]'}`} />
              <span className="hidden xs:inline">Demo Navigator</span>
              <span className="xs:hidden">Demo</span>
            </button>
          )}

          {/* Screen / Step Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shrink-0" />
            <span className="hidden md:inline text-slate-500 font-medium">
              {stepTitle} •
            </span>
            <span className="whitespace-nowrap font-bold text-slate-800">
              Screen {currentStep}
              <span className="text-slate-400 font-normal"> / {totalSteps}</span>
            </span>
          </div>

          {/* Device Frame Switch */}
          <button
            type="button"
            onClick={onToggleDeviceMode}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
            title={deviceMode === 'mobile' ? 'Switch to responsive view' : 'Switch to mobile frame'}
          >
            {deviceMode === 'mobile' ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#008CFF]" />
                <span className="hidden sm:inline">Desktop</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#EB2026]" />
                <span className="hidden sm:inline">Mobile Frame</span>
              </>
            )}
          </button>

          {/* Reset Flow Button */}
          <button
            type="button"
            onClick={onReset}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-[#EB2026] text-slate-400 hover:border-red-200 transition-colors cursor-pointer"
            title="Reset to Screen 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

