import React, { useState } from 'react';
import {
  Users,
  Share2,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { GroupMemberVote, InspirationDemo } from '../types';

interface ScreenGroupModuleProps {
  demo: InspirationDemo;
  travellerCount: number;
  dates: string;
  perPersonBudget: number;
  onProceedToBooking: () => void;
  onBackToCart: () => void;
}

export const ScreenGroupModule: React.FC<ScreenGroupModuleProps> = ({
  demo,
  travellerCount,
  dates,
  perPersonBudget,
  onProceedToBooking,
  onBackToCart,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);
  const [splitMode, setSplitMode] = useState<'equal' | 'custom'>('equal');
  const [lockedIn, setLockedIn] = useState(false);

  // Calibrated per-person price (default ₹34,700 for Bali)
  const actualPerPerson = demo.id === 'bali-villa' ? 34700 : demo.budgetOption.costPerPerson;
  const totalGroupCost = actualPerPerson * travellerCount;

  // Custom split amounts per member
  const [customSplits, setCustomSplits] = useState<{ [id: string]: number }>({
    m1: actualPerPerson,
    m2: actualPerPerson,
    m3: actualPerPerson,
    m4: actualPerPerson,
  });

  const [members, setMembers] = useState<GroupMemberVote[]>([
    {
      id: 'm1',
      name: 'You (Organizer)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      status: 'in',
      budgetPreference: actualPerPerson,
      comment: 'Found this reel! Let’s do the Bali Do It For Less plan.',
    },
    {
      id: 'm2',
      name: 'Rohan Sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      status: 'in',
      budgetPreference: 35000,
      comment: '100% in for Ubud! Price under ₹35k is unreal.',
    },
    {
      id: 'm3',
      name: 'Ananya Sen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      status: 'in',
      budgetPreference: 34000,
      comment: 'Pool villa vibe is essential. I voted In!',
    },
    {
      id: 'm4',
      name: 'Vikram Nair',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      status: 'maybe',
      budgetPreference: 32000,
      comment: 'Checking leave for 26th Oct. Might need +1 day flexibility.',
    },
  ]);

  const toggleStatus = (id: string, newStatus: 'in' | 'maybe' | 'cant_go') => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    );
  };

  const handleCopy = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const whatsappMessage = `Guys, found the exact ${demo.destination} villa from the Reel! It works out to ₹${actualPerPerson.toLocaleString('en-IN')} per person including flights and stay. Check it out here: https://www.makemytrip.com/make-it-real/${demo.id}`;

  const handleCopyWhatsapp = () => {
    navigator.clipboard?.writeText(whatsappMessage);
    setCopiedWhatsapp(true);
    setTimeout(() => setCopiedWhatsapp(false), 2500);
  };

  const handleShareToWhatsapp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCustomSplitChange = (id: string, value: number) => {
    setCustomSplits((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const totalCustomCalculated = (Object.values(customSplits) as number[]).reduce((sum: number, v: number) => sum + v, 0);
  const splitDifference = totalGroupCost - totalCustomCalculated;

  const inCount = members.filter((m) => m.status === 'in').length;
  const maybeCount = members.filter((m) => m.status === 'maybe').length;

  return (
    <div className="space-y-6 pb-14">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToCart}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
        >
          ← Back to Cart
        </button>
        <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
          Screen 16: Group Travel Feature
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>GROUP SYNC ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#041533]">
              PLANNING TOGETHER?
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Invite your group to review the itinerary, confirm budget thresholds, and coordinate the booking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0 border border-slate-200"
            >
              {copiedLink ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-600" />
                  <span>Share Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 1. Group Cost & Per-Person Split Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
              TOTAL GROUP COST ({travellerCount} TRAVELLERS)
            </span>
            <p className="text-2xl font-black text-[#041533] mt-1">
              ₹{totalGroupCost.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">All flights, stays & transfers included</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
              PER-PERSON EQUAL SPLIT
            </span>
            <p className="text-2xl font-black text-emerald-700 mt-1">
              ₹{actualPerPerson.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-emerald-800 font-medium mt-0.5">✓ Fits within target ₹35k budget</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
              CONSENSUS STATUS
            </span>
            <p className="text-xl font-black text-amber-950 mt-1">
              {inCount} of {members.length} Voted "I’m In"
            </p>
            <p className="text-xs text-amber-800 font-medium mt-0.5">
              {maybeCount > 0 ? `${maybeCount} friend considering dates` : 'All ready to book'}
            </p>
          </div>
        </div>

        {/* 2. Villa Sharing Benefit (Explicit requirement) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/50 border-2 border-emerald-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                GROUP ECONOMIES OF SCALE
              </p>
              <h3 className="text-sm sm:text-base font-extrabold text-emerald-950 mt-0.5">
                “{travellerCount} people sharing 1 villa saves ₹6,800 per person vs booking separate hotel rooms”
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                Full private villa with private pool, living quarters, and private kitchen at a fraction of 4 separate deluxe rooms.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-xs shrink-0">
            SAVE ₹27,200 AS A GROUP
          </span>
        </div>

        {/* 3. Interactive Split Calculator */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>Interactive Split Calculator</span>
                <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full font-bold">
                  MMT Social Pay
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Choose how your group divides the booking cost:
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setSplitMode('equal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  splitMode === 'equal'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Split Equally (₹{actualPerPerson.toLocaleString('en-IN')} each)
              </button>
              <button
                type="button"
                onClick={() => setSplitMode('custom')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  splitMode === 'custom'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Custom Split
              </button>
            </div>
          </div>

          {splitMode === 'equal' ? (
            <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-700 font-medium">
                  Each traveller pays exactly <strong>₹{actualPerPerson.toLocaleString('en-IN')}</strong> upon checkout.
                </span>
              </div>
              <span className="font-extrabold text-[#041533]">4 × ₹{actualPerPerson.toLocaleString('en-IN')} = ₹{totalGroupCost.toLocaleString('en-IN')}</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {members.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="text-xs font-bold text-slate-900 truncate">{m.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        value={customSplits[m.id] || actualPerPerson}
                        onChange={(e) => handleCustomSplitChange(m.id, parseInt(e.target.value) || 0)}
                        className="w-24 px-2 py-1 text-xs font-bold border border-slate-300 rounded-lg text-right"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {splitDifference !== 0 && (
                <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between ${
                  splitDifference > 0 ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <span>{splitDifference > 0 ? `Remaining to allocate: ₹${splitDifference.toLocaleString('en-IN')}` : `Over-allocated by: ₹${Math.abs(splitDifference).toLocaleString('en-IN')}`}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomSplits({
                        m1: actualPerPerson,
                        m2: actualPerPerson,
                        m3: actualPerPerson,
                        m4: actualPerPerson,
                      });
                    }}
                    className="text-[11px] underline cursor-pointer"
                  >
                    Reset to equal
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. WhatsApp Share Summary Card (Explicit requirement) */}
        <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Share Summary Card</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
              Ready to send
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-2xs space-y-2">
            <p className="text-xs text-slate-800 font-mono leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              “{whatsappMessage}”
            </p>
            <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyWhatsapp}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedWhatsapp ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied Message!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleShareToWhatsapp}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Open in WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5. Lock in for 48 Hours with Refundable Deposit */}
        <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          lockedIn ? 'border-sky-500 bg-sky-50/60' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              lockedIn ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Lock in this price for 48 hours
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-extrabold">
                  100% Refundable Deposit
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Hold flight fares & villa availability for ₹999/person while your friends vote and confirm leave.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLockedIn(!lockedIn)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              lockedIn
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {lockedIn ? '✓ 48H PRICE LOCKED (₹999/p)' : 'Lock In Price for ₹999/p'}
          </button>
        </div>

        {/* Member Status Grid */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Traveller Responses ({travellerCount} slots)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{member.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Target: ₹{member.budgetPreference?.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Status Switcher */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => toggleStatus(member.id, 'in')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                        member.status === 'in'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      I’m In
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(member.id, 'maybe')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                        member.status === 'maybe'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Maybe
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(member.id, 'cant_go')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                        member.status === 'cant_go'
                          ? 'bg-red-500 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Can’t Go
                    </button>
                  </div>
                </div>

                {member.comment && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 italic flex items-start gap-1.5">
                    <MessageSquare className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                    <span>“{member.comment}”</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA: CONTINUE TO FINAL BOOKING / BOOK NOW */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            {lockedIn ? '🔒 Price locked for 48 hours • Ready for final MMT booking' : 'Group consensus ready for final MMT booking.'}
          </div>
          <button
            type="button"
            onClick={onProceedToBooking}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#e41d2d] to-[#ff3b30] text-white text-sm font-extrabold shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>CONTINUE TO FINAL BOOKING / BOOK NOW</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
