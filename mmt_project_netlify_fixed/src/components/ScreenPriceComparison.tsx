import React from 'react';
import {
  Plane,
  Train,
  Bus,
  Car,
  Clock,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Zap,
} from 'lucide-react';
import { InspirationDemo, RouteComparisonOption } from '../types';

interface ScreenPriceComparisonProps {
  demo: InspirationDemo;
  origin: string;
  onBack: () => void;
  onSelectRouteOption?: (option: RouteComparisonOption) => void;
}

export const ScreenPriceComparison: React.FC<ScreenPriceComparisonProps> = ({
  demo,
  origin,
  onBack,
  onSelectRouteOption,
}) => {
  const routes = demo.routeComparisons || [];

  const handleOpenMmt = (mode: string) => {
    let url = 'https://www.makemytrip.com/flights/';
    if (mode === 'train') url = 'https://www.makemytrip.com/railways/';
    if (mode === 'bus') url = 'https://www.makemytrip.com/bus-tickets/';
    if (mode === 'multimodal') url = 'https://www.makemytrip.com/how2go';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 pb-14">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
        >
          ← Back to MMT Trip Cart
        </button>
        <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
          Multimodal Price Comparison
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="space-y-1 pb-4 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#008cff] text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>MMT MULTIMODAL ECOSYSTEM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#041533]">
            COMPARE YOUR OPTIONS
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Route comparison between <strong>{origin}</strong> and <strong>{demo.destination}</strong> powered by MakeMyTrip's cross-transport flight, rail, bus and cab network.
          </p>
        </div>

        {/* Mandatory Label from prompt */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
          “Prototype route comparison inspired by MMT’s multimodal booking ecosystem.”
        </div>

        {/* Route Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map((rt) => {
            const isFastest = rt.label === 'Fastest';
            const isBestValue = rt.label === 'Best Value';
            const isCheapest = rt.label === 'Cheapest';

            return (
              <div
                key={rt.id}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between bg-white shadow-2xs ${
                  isBestValue
                    ? 'border-emerald-500 ring-2 ring-emerald-100'
                    : isFastest
                    ? 'border-sky-500'
                    : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isBestValue
                          ? 'bg-emerald-100 text-emerald-800'
                          : isFastest
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rt.label}
                    </span>
                    <div className="flex items-center gap-1 text-slate-400">
                      {rt.mode === 'flight' && <Plane className="w-4 h-4" />}
                      {rt.mode === 'train' && <Train className="w-4 h-4" />}
                      {rt.mode === 'bus' && <Bus className="w-4 h-4" />}
                      {rt.mode === 'multimodal' && <Car className="w-4 h-4" />}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{rt.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{rt.stopsText}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Travel time:</span>
                      </span>
                      <span className="font-bold text-slate-900">{rt.durationText}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200">
                      <span>Prototype price:</span>
                      <span className="text-base font-black text-[#041533]">
                        ₹{rt.pricePerPerson.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleOpenMmt(rt.mode)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>VIEW / BOOK ON MAKE MY TRIP</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </button>
                  {onSelectRouteOption && (
                    <button
                      type="button"
                      onClick={() => onSelectRouteOption(rt)}
                      className="w-full py-1.5 text-[11px] font-semibold text-[#008cff] hover:underline cursor-pointer"
                    >
                      Use this journey in cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Domestic Manali Multimodal Callout if applicable */}
        {demo.id === 'manali-glass-cabin' && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <strong>Multimodal Demonstration Note:</strong> Notice how for Manali, MMT compares Flight+Cab (₹7,900), Volvo Sleeper Bus (₹2,100), and Vande Bharat Train+Cab (₹3,400) directly side by side!
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 rounded-xl bg-[#041533] text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ← Return to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
