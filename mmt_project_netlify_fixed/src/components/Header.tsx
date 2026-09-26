import React from 'react';
import {
  Menu,
  Wallet,
  Briefcase,
  Sparkles,
  Smartphone,
  Monitor,
  RotateCcw,
  BarChart2,
  ChevronRight,
  Palmtree,
  Plane,
  Building2,
} from 'lucide-react';
import { MMTLogo } from './MMTLogo';

interface HeaderProps {
  currentStep?: string;
  currentScreen?: string;
  onNavigate?: (screen: string) => void;
  onReset?: () => void;
  onToggleAnalytics?: () => void;
  deviceView?: 'desktop' | 'mobile';
  onToggleDeviceView?: () => void;
  showDevTools?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep = 'home',
  currentScreen,
  onNavigate,
  onReset,
  onToggleAnalytics,
  deviceView = 'desktop',
  onToggleDeviceView,
  showDevTools = false,
}) => {
  const activeScreen = currentScreen || currentStep;

  const handleNav = (screen: string) => {
    if (typeof onNavigate === 'function') {
      onNavigate(screen);
    }
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Micro-Bar: Account & MMT Services (Desktop only) */}
      <div className="hidden sm:block bg-[#FAFAFA] border-b border-slate-100 text-[11px] text-[#6B6B6B] py-1 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <Briefcase className="w-3 h-3 text-[#008CFF]" />
              Introducing <strong className="text-[#111111]">myBiz</strong> for Corporate Travel
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <Wallet className="w-3 h-3 text-emerald-600" />
              <strong>myCash:</strong> ₹1,250 available
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Viewport switch for jury / presentation */}
            {onToggleDeviceView && (
              <button
                onClick={onToggleDeviceView}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-200/70 hover:bg-slate-300 text-slate-700 font-medium transition-colors cursor-pointer text-[10px]"
                title="Toggle Phone Frame / Desktop Layout"
              >
                {deviceView === 'mobile' ? (
                  <>
                    <Monitor className="w-3 h-3 text-[#008CFF]" />
                    <span>Switch to Desktop View</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3 h-3 text-purple-600" />
                    <span>Preview Mobile Frame</span>
                  </>
                )}
              </button>
            )}

            {/* Secret Demo / Debug Trigger */}
            {showDevTools && onToggleAnalytics && (
              <button
                onClick={onToggleAnalytics}
                className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <BarChart2 className="w-3 h-3" />
                <span>Analytics</span>
              </button>
            )}

            {showDevTools && onReset && (
              <button
                onClick={onReset}
                className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-red-600 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Flow</span>
              </button>
            )}

            <span className="font-bold text-slate-900">INR (₹)</span>
            <span>English</span>
          </div>
        </div>
      </div>

      {/* Main MakeMyTrip Header Bar */}
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Hamburger & Official MakeMyTrip Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNav('home')}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleNav('home')}
            className="flex items-center cursor-pointer focus:outline-none"
            title="MakeMyTrip Home"
          >
            <MMTLogo className="h-7 sm:h-8 w-auto" />
          </button>
        </div>

        {/* Center: MMT Core Category Tabs (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-bold">
          <button
            onClick={() => handleNav('home')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeScreen === 'home'
                ? 'bg-[#EAF6FF] text-[#008CFF]'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNav('holiday_packages')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              activeScreen === 'holiday_packages'
                ? 'bg-[#EAF6FF] text-[#008CFF]'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Palmtree className="w-3.5 h-3.5" />
            <span>Holiday Packages</span>
          </button>

          <a
            href="https://www.makemytrip.com/flights/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Flights
          </a>

          <a
            href="https://www.makemytrip.com/hotels/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Hotels
          </a>

          {/* Make It Real Feature Button */}
          <button
            onClick={() => handleNav('capture')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
              activeScreen !== 'home' && activeScreen !== 'holiday_packages'
                ? 'bg-gradient-to-r from-[#42B8F5] to-[#0065F5] text-white font-black'
                : 'bg-[#EAF6FF] text-[#008CFF] hover:bg-[#008CFF] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Make It Real</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-white/20 uppercase">
              NEW
            </span>
          </button>
        </nav>

        {/* Right: Quick CTA on mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => handleNav('capture')}
            className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#42B8F5] to-[#0065F5] text-white text-[11px] font-black flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3 h-3" />
            <span>Make It Real</span>
          </button>
        </div>
      </div>
    </header>
  );
};
