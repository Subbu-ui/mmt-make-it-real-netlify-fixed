import React, { useState } from 'react';
import {
  Plane,
  Building2,
  Car,
  Palmtree,
  ArrowRight,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Download,
  Share2,
  Calendar,
  Clock,
  User,
  Info,
} from 'lucide-react';
import { MMTLogo } from './MMTLogo';
import { CurrentTripState } from '../types';

interface Screen7BookingProps {
  tripState: CurrentTripState;
  onProceedToPostTrip: () => void;
  onBack: () => void;
}

export const Screen7Booking: React.FC<Screen7BookingProps> = ({
  tripState,
  onProceedToPostTrip,
  onBack,
}) => {
  const originCity = tripState.originCity || 'Delhi';
  const destination = tripState.selectedDestination || 'Your Trip';
  const cleanDestination = destination.trim().toUpperCase();
  const travellers = tripState.totalTravellers || tripState.travellers || 2;
  const dates = tripState.dates || '25–29 October';
  const duration = tripState.duration || '4 Nights / 5 Days';
  const perPerson = tripState.packagePricePerPerson || 34200;
  const total = tripState.groupTotal || perPerson * travellers;
  const selectedComp = tripState.selectedComponents || {
    flights: true,
    hotel: true,
    experiences: true,
    transfers: false,
  };

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'paylater'>('upi');
  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState('MMT-TS-984210');

  const handleConfirmBooking = () => {
    setIsBooked(true);
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-10">
      {/* Back button */}
      {!isBooked && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#008CFF] transition-colors cursor-pointer"
        >
          <span>← Back to Package Itinerary</span>
        </button>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
        {/* BRAND LOCK HEADER */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <MMTLogo className="h-6 sm:h-7 w-auto" />
          <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 tracking-wide flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>MMT Assured Checkout</span>
          </span>
        </div>

        {!isBooked ? (
          /* PRE-BOOKING CHECKOUT VIEW */
          <div className="space-y-4 animate-in fade-in">
            {/* Trip Headline */}
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black text-[#008CFF] bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Step 4 of 4 • Checkout
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {cleanDestination}
              </h1>
              <p className="text-xs font-bold text-slate-500">
                {originCity} ⇄ {destination} • {dates} • {duration}
              </p>
            </div>

            {/* Package Components Checklist */}
            <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-2 text-xs">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                Selected Booking Summary:
              </span>
              <div className="space-y-1.5">
                {selectedComp.flights && (
                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200/80">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                      <Plane className="w-3.5 h-3.5 text-[#008CFF]" />
                      <span>Flights: {tripState.flight?.title || `${originCity} ⇄ ${destination}`}</span>
                    </span>
                    <span className="text-emerald-700 font-black text-[10px]">Confirmed Seats</span>
                  </div>
                )}
                {selectedComp.hotel && (
                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200/80">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Hotel: {tripState.hotel?.title || `${destination} Verified Stay`}</span>
                    </span>
                    <span className="text-emerald-700 font-black text-[10px]">MMT Assured</span>
                  </div>
                )}
                {selectedComp.experiences && (
                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200/80">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                      <Palmtree className="w-3.5 h-3.5 text-purple-600" />
                      <span>Experiences: {tripState.customExperiences?.length || tripState.experiences?.items?.length || 3} Curated Activities in {destination}</span>
                    </span>
                    <span className="text-purple-700 font-black text-[10px]">Included</span>
                  </div>
                )}
                {selectedComp.transfers && (
                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200/80">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                      <Car className="w-3.5 h-3.5 text-amber-600" />
                      <span>Transfers: AC Chauffeur Pick & Drop in {destination}</span>
                    </span>
                    <span className="text-emerald-700 font-black text-[10px]">Included</span>
                  </div>
                )}
              </div>
            </div>

            {/* Lead Traveller Info Form */}
            <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-2.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                Traveller Details:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">Lead Traveller</span>
                  <span className="font-bold text-slate-800">Subhashish Poddar</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">Traveller Count</span>
                  <span className="font-bold text-slate-800">{travellers} Travellers</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                Select Payment Mode:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-[#008CFF] bg-blue-50/70 text-[#008CFF] font-black shadow-xs ring-2 ring-blue-400/20'
                      : 'border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto mb-1 text-[#008CFF]" />
                  <span className="text-[11px] block">UPI / GPay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#008CFF] bg-blue-50/70 text-[#008CFF] font-black shadow-xs ring-2 ring-blue-400/20'
                      : 'border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  <span className="text-[11px] block">Credit/Debit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paylater')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'paylater'
                      ? 'border-[#008CFF] bg-blue-50/70 text-[#008CFF] font-black shadow-xs ring-2 ring-blue-400/20'
                      : 'border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                  <span className="text-[11px] block">0% EMI</span>
                </button>
              </div>
            </div>

            {/* Price Total Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0A142F] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                  Total Payable
                </span>
                <span className="text-2xl font-black text-white">
                  ₹{total.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-300 block">
                  ₹{perPerson.toLocaleString('en-IN')} × {travellers} travellers
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-400 font-bold block">MMT Price Lock</span>
                <span className="text-[10px] text-slate-400">Taxes & GST included</span>
              </div>
            </div>

            {/* Prototype Disclaimer */}
            <div className="p-2.5 bg-slate-100 rounded-xl text-center border border-slate-200/80">
              <p className="text-[10px] text-slate-500 font-medium">
                ⚡ <strong>MakeMyTrip Prototype Simulation:</strong> No actual payment will be deducted. All inventory and pricing are illustrative estimates.
              </p>
            </div>

            {/* Confirm CTA */}
            <button
              type="button"
              onClick={handleConfirmBooking}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#E55A00] hover:brightness-105 active:scale-[0.99] text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>CONFIRM & BOOK TRIP (₹{total.toLocaleString('en-IN')})</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        ) : (
          /* POST-BOOKING CONFIRMATION VOUCHER */
          <div className="space-y-4 animate-in zoom-in-95 duration-200">
            {/* Success Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-black text-slate-900">
                Booking Confirmed & Assured! ✈️
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Your trip to <strong className="text-slate-900">{cleanDestination}</strong> has been secured via MakeMyTrip.
              </p>
              <div className="inline-block px-3 py-1 bg-white rounded-full border border-emerald-200 text-xs font-black text-emerald-800 shadow-2xs">
                Booking Reference: {bookingId}
              </div>
            </div>

            {/* Trip Details Voucher */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-600">Travel Dates:</span>
                <span className="font-black text-slate-900">{dates}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-600">Travellers:</span>
                <span className="font-black text-slate-900">{travellers} Guests (Lead: Subhashish Poddar)</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-600">Total Paid (Prototype):</span>
                <span className="font-black text-slate-900">₹{total.toLocaleString('en-IN')} (All inclusive)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-600">Customer Support:</span>
                <span className="font-black text-[#008CFF]">24x7 MMT Helpline Enabled</span>
              </div>
            </div>

            {/* Growth Loop Notification Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#008CFF] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next: Post-Trip Growth Loop</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Once you return from {destination}, TripSpark turns your vacation into an interactive social story. When friends book your itinerary, you earn MakeMyTrip MyCash rewards.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={onProceedToPostTrip}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#008CFF] to-[#0052CC] hover:brightness-105 active:scale-[0.99] text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>EXPLORE POST-TRIP GROWTH LOOP</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => alert('Voucher downloaded to device (Prototype simulation)')}
                className="w-full py-3 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOWNLOAD CONFIRMATION VOUCHER (PDF)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
