import React, { useState } from 'react';
import {
  Users,
  User,
  Heart,
  Home,
  Plus,
  Minus,
  ArrowRight,
  Info,
} from 'lucide-react';
import { TravellerType } from '../types';

interface ScreenTravellerGroupProps {
  initialType?: TravellerType;
  initialCount?: number;
  onNext: (type: TravellerType, totalCount: number, adultCount: number, childCount: number) => void;
  onBack: () => void;
}

export const ScreenTravellerGroup: React.FC<ScreenTravellerGroupProps> = ({
  initialType = 'friends',
  initialCount = 4,
  onNext,
  onBack,
}) => {
  const [travellerType, setTravellerType] = useState<TravellerType>(initialType);
  const [count, setCount] = useState<number>(initialCount);
  const [adultCount, setAdultCount] = useState<number>(initialCount);
  const [childCount, setChildCount] = useState<number>(0);

  const handleTypeSelect = (type: TravellerType) => {
    setTravellerType(type);
    if (type === 'solo') {
      setCount(1);
      setAdultCount(1);
      setChildCount(0);
    } else if (type === 'couple') {
      setCount(2);
      setAdultCount(2);
      setChildCount(0);
    } else if (type === 'friends') {
      setCount(4);
      setAdultCount(4);
      setChildCount(0);
    } else if (type === 'family') {
      setCount(3);
      setAdultCount(2);
      setChildCount(1);
    }
  };

  const updateCount = (delta: number) => {
    const next = Math.max(1, Math.min(12, count + delta));
    setCount(next);
    setAdultCount(next);
  };

  const updateAdults = (delta: number) => {
    const next = Math.max(1, Math.min(8, adultCount + delta));
    setAdultCount(next);
    setCount(next + childCount);
  };

  const updateChildren = (delta: number) => {
    const next = Math.max(0, Math.min(6, childCount + delta));
    setChildCount(next);
    setCount(adultCount + next);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
        >
          ← Back to Inspiration Vibe
        </button>
        <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
          Step 3 of 8: Traveller Group
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="max-w-xl mx-auto text-center space-y-2 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#041533]">
            WHO’S COMING ALONG?
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Group size impacts hotel room distribution (villas vs hotel rooms) and multimodal transfer savings.
          </p>
        </div>

        {/* Group Archetype Options */}
        <div className="max-w-xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { id: 'solo', label: 'Solo', icon: User, desc: '1 traveller' },
            { id: 'couple', label: 'Couple', icon: Heart, desc: '2 travellers' },
            { id: 'friends', label: 'Friends', icon: Users, desc: '3+ travellers' },
            { id: 'family', label: 'Family', icon: Home, desc: 'Adults + Kids' },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = travellerType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTypeSelect(item.id as TravellerType)}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  isSelected
                    ? 'border-[#008cff] bg-sky-50 text-sky-950 ring-2 ring-sky-300 font-bold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isSelected
                      ? 'bg-[#008cff] text-white'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold">{item.label}</p>
                  <p className="text-[10px] text-slate-500">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Count Counter */}
        <div className="max-w-md mx-auto bg-slate-50 rounded-2xl p-5 border border-slate-200">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 text-center mb-4">
            HOW MANY PEOPLE ARE TRAVELLING?
          </p>

          {travellerType !== 'family' ? (
            <div className="flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => updateCount(-1)}
                disabled={count <= 1}
                className="w-12 h-12 rounded-full border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-lg transition-all shadow-xs cursor-pointer"
              >
                <Minus className="w-5 h-5" />
              </button>
              <div className="text-center min-w-[120px]">
                <span className="text-4xl font-black text-[#041533]">{count}</span>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  {count === 1 ? 'Traveller' : 'Travellers (Group)'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateCount(1)}
                disabled={count >= 12}
                className="w-12 h-12 rounded-full border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center text-lg transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          ) : (
            /* Family Split: Adults & Children */
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                <div>
                  <p className="text-xs font-bold text-slate-800">Adults (12+ yrs)</p>
                  <p className="text-[10px] text-slate-500">Standard airfare & bed</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateAdults(-1)}
                    disabled={adultCount <= 1}
                    className="w-8 h-8 rounded-full border border-slate-300 bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-sm font-black w-6 text-center">{adultCount}</span>
                  <button
                    type="button"
                    onClick={() => updateAdults(1)}
                    className="w-8 h-8 rounded-full border border-slate-300 bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                <div>
                  <p className="text-xs font-bold text-slate-800">Children (2-11 yrs)</p>
                  <p className="text-[10px] text-slate-500">Discounted fares / sharing</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateChildren(-1)}
                    disabled={childCount <= 0}
                    className="w-8 h-8 rounded-full border border-slate-300 bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-sm font-black w-6 text-center">{childCount}</span>
                  <button
                    type="button"
                    onClick={() => updateChildren(1)}
                    className="w-8 h-8 rounded-full border border-slate-300 bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-center pt-1 text-xs text-slate-600 font-semibold">
                Total Group: <span className="text-[#008cff] font-extrabold">{count} Travellers</span>
              </div>
            </div>
          )}

          {count === 4 && travellerType === 'friends' && (
            <div className="mt-4 p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] text-center font-medium flex items-center justify-center gap-1.5">
              <span>★ 4 Friends matches the Young Turks primary benchmark test session</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={() => onNext(travellerType, count, adultCount, childCount)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#e41d2d] to-[#ff3b30] text-white text-sm font-extrabold shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>CONTINUE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
