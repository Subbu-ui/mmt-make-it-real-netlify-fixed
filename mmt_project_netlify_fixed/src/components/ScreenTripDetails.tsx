import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Sliders,
  Sparkles,
  Camera,
  ArrowRight,
  ChevronDown,
  X,
  Plus,
  Minus,
  Check,
  Plane,
  Clock,
  IndianRupee,
} from 'lucide-react';
import {
  BudgetMode,
  DateFlexibility,
  TravelPreference,
  TravellerType,
  InspirationDemo,
} from '../types';

interface ScreenTripDetailsProps {
  demo: InspirationDemo;
  initialTravellerCount?: number;
  initialAdultCount?: number;
  initialChildCount?: number;
  initialTravellerType?: TravellerType;
  initialOrigin?: string;
  initialBudgetPerPerson?: number;
  initialDates?: string;
  onNext: (data: {
    origin: string;
    travellerType: TravellerType;
    travellerCount: number;
    adultCount: number;
    childCount: number;
    budgetMode: BudgetMode;
    budgetPerPerson: number;
    totalBudget: number;
    dates: string;
    flexibility: DateFlexibility;
    duration: string;
    travelPreference: TravelPreference;
  }) => void;
  onBack: () => void;
  onChangeInspiration?: () => void;
}

export const ScreenTripDetails: React.FC<ScreenTripDetailsProps> = ({
  demo,
  initialTravellerCount = 4,
  initialAdultCount = 4,
  initialChildCount = 0,
  initialTravellerType = 'friends',
  initialOrigin = 'New Delhi',
  initialBudgetPerPerson = 35000,
  initialDates = '25 Oct',
  onNext,
  onBack,
  onChangeInspiration,
}) => {
  // Form States
  const [origin, setOrigin] = useState(initialOrigin);
  const [dates, setDates] = useState(initialDates);
  const [travellerType, setTravellerType] = useState<TravellerType>(initialTravellerType);
  const [adultCount, setAdultCount] = useState(initialAdultCount);
  const [childCount, setChildCount] = useState(initialChildCount);
  const totalTravellers = adultCount + childCount;

  const [duration, setDuration] = useState('4–5 Days');
  const [travelPreference, setTravelPreference] = useState<TravelPreference>('mmt_optimise');
  const [budgetMode, setBudgetMode] = useState<BudgetMode>('per_person');
  const [budgetPerPerson, setBudgetPerPerson] = useState(initialBudgetPerPerson);
  const [isFlexibleDates, setIsFlexibleDates] = useState(true);

  // Modals / Bottom Sheets
  const [isTravellerSheetOpen, setIsTravellerSheetOpen] = useState(false);
  const [isOriginSheetOpen, setIsOriginSheetOpen] = useState(false);
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);

  // Budget calculations
  const totalBudget = budgetPerPerson * Math.max(1, totalTravellers);

  const handleApplyTravellers = () => {
    setIsTravellerSheetOpen(false);
  };

  const handleSubmit = () => {
    onNext({
      origin,
      travellerType,
      travellerCount: totalTravellers,
      adultCount,
      childCount,
      budgetMode,
      budgetPerPerson,
      totalBudget,
      dates,
      flexibility: isFlexibleDates ? 'flexible_3' : 'exact',
      duration,
      travelPreference,
    });
  };

  const originCities = ['New Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad'];

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-12">
      {/* Top Header & Progress */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-[#008CFF] transition-colors cursor-pointer"
          >
            <span>←</span>
            <span>Make It Real</span>
          </button>
          <span className="text-xs font-bold text-[#008CFF] bg-[#EAF6FF] px-2.5 py-0.5 rounded-full">
            Holiday Packages Engine
          </span>
        </div>

        {/* Progress Indicator: Step 2 active */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#6B6B6B] mb-1.5">
            <span className="text-[#008B73]">✓ 1 Inspiration</span>
            <span className="text-[#008CFF]">2 Trip Details</span>
            <span className="text-slate-400">3 Options</span>
            <span className="text-slate-400">4 Itinerary</span>
            <span className="text-slate-400">5 Book</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#42B8F5] to-[#0065F5] w-2/5 rounded-full" />
          </div>
        </div>
      </div>

      {/* Main MakeMyTrip Holiday Packages Search Container (Section 10 Reference) */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
            Plan your trip
          </h1>
          <span className="text-xs font-semibold text-[#008CFF] bg-[#EAF6FF] px-2 py-0.5 rounded-full">
            Custom Package
          </span>
        </div>

        {/* Primary Search Grid: Row 1 Origin & Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Starting From */}
          <div
            onClick={() => setIsOriginSheetOpen(true)}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-[#008CFF] transition-all cursor-pointer bg-slate-50/50 hover:bg-white"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B6B] block">
              STARTING FROM
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-base font-black text-[#111111] truncate">{origin}</span>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">India</span>
          </div>

          {/* Travelling To (With Camera Icon to re-upload / change inspiration) */}
          <div className="p-3.5 rounded-xl border border-[#008CFF]/50 bg-[#EAF6FF]/30 hover:border-[#008CFF] transition-all relative">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#008CFF]">
                TRAVELLING TO
              </span>
              {onChangeInspiration && (
                <button
                  type="button"
                  onClick={onChangeInspiration}
                  className="flex items-center gap-1 text-[10px] font-black text-[#008CFF] hover:underline cursor-pointer bg-white px-2 py-0.5 rounded-full shadow-xs border border-blue-200"
                  title="Change social reel / screenshot"
                >
                  <Camera className="w-3 h-3 text-[#008CFF]" />
                  <span>Change Inspiration</span>
                </button>
              )}
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-base font-black text-[#111111] truncate">
                {demo.destination}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#008B73]" />
            </div>
            <span className="text-[11px] text-[#6B6B6B] block mt-0.5">
              Detected from your Reel inspiration
            </span>
          </div>
        </div>

        {/* Primary Search Grid: Row 2 Date & Travellers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Starting Date */}
          <div
            onClick={() => setIsDateSheetOpen(true)}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-[#008CFF] transition-all cursor-pointer bg-slate-50/50 hover:bg-white"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B6B] block">
              STARTING DATE
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-base font-black text-[#111111]">{dates}</span>
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              {isFlexibleDates ? 'Flexible dates (±3 Days)' : 'Exact date'}
            </span>
          </div>

          {/* Travellers (Opens Section 11 Bottom Sheet) */}
          <div
            onClick={() => setIsTravellerSheetOpen(true)}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-[#008CFF] transition-all cursor-pointer bg-slate-50/50 hover:bg-white"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B6B] block">
              TRAVELLERS
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-base font-black text-[#111111]">
                {totalTravellers} Guests
              </span>
              <Users className="w-4 h-4 text-[#008CFF] shrink-0" />
            </div>
            <span className="text-[11px] text-[#6B6B6B] block mt-0.5 capitalize">
              {adultCount} Adults{childCount > 0 ? `, ${childCount} Children` : ''} • {travellerType}
            </span>
          </div>
        </div>

        {/* Section 10: CHOOSE FILTERS */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#111111] block">
            CHOOSE FILTERS
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Duration */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-bold text-[#6B6B6B] uppercase block">
                Trip Duration
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Weekend (2–3D)', '4–5 Days', '1 Week (6–7D)'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      duration === d
                        ? 'bg-[#008CFF] text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Transport */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-bold text-[#6B6B6B] uppercase block">
                Transport Preference
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'mmt_optimise', label: 'Let MMT Optimise' },
                  { id: 'flight', label: 'Flight Only' },
                  { id: 'train_cab', label: 'Train / Cab' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTravelPreference(t.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      travelPreference === t.id
                        ? 'bg-[#008CFF] text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Per Person */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#6B6B6B] uppercase">
                  Target Budget ({budgetMode === 'per_person' ? 'Per Person' : 'Total Trip'})
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setBudgetMode('per_person')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                      budgetMode === 'per_person'
                        ? 'bg-[#008CFF] text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    Per Person
                  </button>
                  <button
                    type="button"
                    onClick={() => setBudgetMode('total')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                      budgetMode === 'total'
                        ? 'bg-[#008CFF] text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    Total Trip
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={10000}
                  max={120000}
                  step={2500}
                  value={budgetPerPerson}
                  onChange={(e) => setBudgetPerPerson(Number(e.target.value))}
                  className="flex-1 accent-[#008CFF]"
                />
                <div className="text-right shrink-0">
                  <span className="text-base font-black text-[#111111]">
                    ₹{budgetPerPerson.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-[#6B6B6B] block">
                    / person (Total: ₹{totalBudget.toLocaleString('en-IN')})
                  </span>
                </div>
              </div>
            </div>

            {/* Flexible Dates Checkbox */}
            <div className="sm:col-span-2 flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                <Calendar className="w-4 h-4 text-[#008CFF]" />
                <span>Flexible Dates: ±3 Days (Unlock cheaper flights & villa rates)</span>
              </div>
              <input
                type="checkbox"
                checked={isFlexibleDates}
                onChange={(e) => setIsFlexibleDates(e.target.checked)}
                className="w-4 h-4 accent-[#008CFF] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 10 Large CTA: MAKE THIS TRIP REAL in MMT blue gradient */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#42B8F5] to-[#0065F5] hover:brightness-105 active:scale-[0.99] text-white font-black text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <span>MAKE THIS TRIP REAL</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <span className="text-[11px] text-center text-[#6B6B6B] block mt-2">
            Builds 3 instant trip strategies (Recreate It, Do It For Less, Match The Vibe) with verified pricing
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 11: TRAVELLER SELECTION BOTTOM SHEET             */}
      {/* ========================================================= */}
      {isTravellerSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            onClick={() => setIsTravellerSheetOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          <div className="relative z-10 w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-[#111111]">Select Travellers & Budget</h3>
              <button
                onClick={() => setIsTravellerSheetOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Travelling As */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B6B]">
                Travelling as:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'solo', label: 'Solo', count: 1 },
                  { id: 'couple', label: 'Couple', count: 2 },
                  { id: 'friends', label: 'Friends', count: 4 },
                  { id: 'family', label: 'Family', count: 3 },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setTravellerType(item.id as TravellerType);
                      setAdultCount(item.count);
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-bold text-center transition-all cursor-pointer border ${
                      travellerType === item.id
                        ? 'bg-[#EAF6FF] border-[#008CFF] text-[#008CFF]'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Counters for Adults & Children */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-black text-[#111111] block">Adults</span>
                  <span className="text-[10px] text-[#6B6B6B]">12+ years</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAdultCount((c) => Math.max(1, c - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-black text-[#111111]">
                    {adultCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdultCount((c) => c + 1)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-black text-[#111111] block">Children</span>
                  <span className="text-[10px] text-[#6B6B6B]">2–11 years</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setChildCount((c) => Math.max(0, c - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-black text-[#111111]">
                    {childCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setChildCount((c) => c + 1)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Budget Selection & Automatic Total calculation */}
            <div className="p-3 rounded-xl bg-[#EAF6FF]/60 border border-[#008CFF]/20 space-y-2">
              <span className="text-[10px] font-bold text-[#008CFF] uppercase block">
                Budget Breakdown
              </span>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6B6B6B]">Per person estimate:</span>
                <span className="font-bold text-[#111111]">
                  ₹{budgetPerPerson.toLocaleString('en-IN')} / person
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#008CFF]/20 font-black">
                <span className="text-[#111111]">{totalTravellers} Travellers Total:</span>
                <span className="text-base text-[#008CFF]">
                  ₹{totalBudget.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={handleApplyTravellers}
              className="w-full py-3 rounded-xl bg-[#008CFF] hover:bg-[#006CFF] text-white text-xs font-black transition-colors cursor-pointer uppercase tracking-wider"
            >
              APPLY
            </button>
          </div>
        </div>
      )}

      {/* Origin City Modal */}
      {isOriginSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsOriginSheetOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-xl p-5 border border-slate-200 space-y-3">
            <h3 className="text-sm font-black text-[#111111]">Select Departure City</h3>
            <div className="grid grid-cols-2 gap-2">
              {originCities.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setOrigin(c);
                    setIsOriginSheetOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold text-left border cursor-pointer ${
                    origin === c
                      ? 'bg-[#EAF6FF] border-[#008CFF] text-[#008CFF]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Dates Modal */}
      {isDateSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsDateSheetOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-xl p-5 border border-slate-200 space-y-3">
            <h3 className="text-sm font-black text-[#111111]">Select Starting Date</h3>
            <div className="space-y-2">
              {['25 Oct', '1 Nov', '15 Nov', '1 Dec', '20 Dec (Festive)'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDates(d);
                    setIsDateSheetOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-left border flex items-center justify-between cursor-pointer ${
                    dates === d
                      ? 'bg-[#EAF6FF] border-[#008CFF] text-[#008CFF]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{d}</span>
                  {dates === d && <Check className="w-4 h-4 text-[#008CFF]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
