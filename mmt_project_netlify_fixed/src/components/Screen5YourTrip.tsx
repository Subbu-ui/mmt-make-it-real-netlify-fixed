import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plane,
  Building2,
  Car,
  Palmtree,
  Utensils,
  ArrowRight,
  Users,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Star,
  Info,
  ExternalLink,
  Plus,
  Trash2,
  RefreshCw,
  X,
  Check,
} from 'lucide-react';
import { CurrentTripState, SelectedBookingComponents } from '../types';

interface Screen5YourTripProps {
  tripState: CurrentTripState;
  onContinueBooking: (
    selectedComponents?: SelectedBookingComponents,
    customTotal?: number,
    customPerPerson?: number,
    customExperiences?: string[]
  ) => void;
  onPlanWithFriends: () => void;
  onBack: () => void;
  isGroupOptimized?: boolean;
}

export const Screen5YourTrip: React.FC<Screen5YourTripProps> = ({
  tripState,
  onContinueBooking,
  onPlanWithFriends,
  onBack,
  isGroupOptimized = false,
}) => {
  const selectedDest = tripState.selectedDestination || 'Destination';
  const cleanDest = selectedDest.trim().toUpperCase();
  const originCity = tripState.originCity || 'Delhi';
  const travellerCount = tripState.totalTravellers || tripState.travellers || 2;
  const dates = tripState.dates || '25–29 October';
  const duration = tripState.duration || '4 Nights / 5 Days';

  // Base costs per person
  const perPersonBase = tripState.packagePricePerPerson || 34200;
  const baseFlightCost = tripState.flight?.cost || Math.round(perPersonBase * 0.44);
  const baseHotelCost = tripState.hotel?.cost || Math.round(perPersonBase * 0.36);
  const baseTransferCost = tripState.transfers?.cost || Math.round(perPersonBase * 0.05);
  const baseExpCost = tripState.experiences?.cost || Math.round(perPersonBase * 0.15);

  // =========================================================================
  // ISSUE 3: USER CHOOSES WHAT TO BOOK (SELECTABLE CATEGORIES)
  // Default: Flights, Hotel, Experiences checked; Transfer optional
  // =========================================================================
  const [selectedComponents, setSelectedComponents] = useState<SelectedBookingComponents>({
    flights: tripState.selectedComponents?.flights ?? true,
    hotel: tripState.selectedComponents?.hotel ?? true,
    experiences: tripState.selectedComponents?.experiences ?? true,
    transfers: tripState.selectedComponents?.transfers ?? false,
  });

  const toggleComponent = (key: keyof SelectedBookingComponents) => {
    setSelectedComponents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // FLIGHTS CATEGORY STATE (Alternatives: Cheapest, Fastest, Best balance)
  const [flightAlternative, setFlightAlternative] = useState<'balanced' | 'cheapest' | 'fastest'>('balanced');
  const flightDelta = flightAlternative === 'cheapest' ? -1200 : flightAlternative === 'fastest' ? 900 : 0;
  const flightFare = Math.max(3500, baseFlightCost + flightDelta);

  const flightDetails = {
    balanced: { stops: 'Non-stop', duration: '2h 35m', airline: 'IndiGo / Vistara Mid-day' },
    cheapest: { stops: '1-Stop (Quick Transit)', duration: '4h 15m', airline: 'SpiceJet Early Morning' },
    fastest: { stops: 'Non-stop Direct', duration: '2h 10m', airline: 'Air India Express Prime Evening' },
  }[flightAlternative];

  // HOTELS CATEGORY STATE (Filters: Budget, Boutique, Resort, Luxury, Hostel, Apartment)
  const hotelFilters = ['Budget', 'Boutique', 'Resort', 'Luxury', 'Hostel', 'Apartment'] as const;
  type HotelFilter = typeof hotelFilters[number];
  const [activeHotelFilter, setActiveHotelFilter] = useState<HotelFilter>('Boutique');

  const hotelTierData: Record<HotelFilter, { name: string; rate: number; area: string; category: string; why: string }> = {
    Budget: {
      name: `${selectedDest} Smart City Boutique Stay`,
      rate: Math.round(baseHotelCost * 0.65 / 4),
      area: 'Central Transit Belt',
      category: '3★ Verified Smart Stay',
      why: 'Convenient central location with modern air-conditioned rooms at minimum cost.',
    },
    Boutique: {
      name: tripState.hotel?.title || `${selectedDest} Verified Heritage Boutique Resort`,
      rate: Math.round(baseHotelCost / 4),
      area: 'Prime Aesthetic Coastal Belt',
      category: '4★ Verified Boutique Resort',
      why: 'Matches the exact courtyard pool, tropical aesthetic, and photo vibe from your Reel.',
    },
    Resort: {
      name: `${selectedDest} Sea-Breeze Lagoon Pool Resort`,
      rate: Math.round(baseHotelCost * 1.3 / 4),
      area: 'Beachfront Cove & Rainforest',
      category: '4.5★ Beachfront Resort',
      why: 'Direct lagoon pool access, buffet breakfast, and sunset cocktail lawn.',
    },
    Luxury: {
      name: `${selectedDest} 5★ Landmark Clifftop Palace`,
      rate: Math.round(baseHotelCost * 2.2 / 4),
      area: 'Exclusive Assagao / Ubud Clifftop',
      category: '5★ Luxury Private Residence',
      why: 'Ultra-exclusive private villa buyout with private butler and infinity pool.',
    },
    Hostel: {
      name: `${selectedDest} Social Nomad Pods & Pool Villa`,
      rate: Math.round(baseHotelCost * 0.35 / 4),
      area: 'Café & Nightlife Lane',
      category: 'Top-Rated Designer Hostel',
      why: 'Vibrant co-working cafe, swimming pool, and community socials.',
    },
    Apartment: {
      name: `${selectedDest} 2-BHK Aesthetic Private Coastal Suite`,
      rate: Math.round(baseHotelCost * 0.85 / 4),
      area: 'Trendy Neighborhood Walk',
      category: 'Serviced Holiday Home',
      why: 'Private kitchen, spacious balcony, and living area for group freedom.',
    },
  };

  const currentHotel = hotelTierData[activeHotelFilter];
  const currentHotelTotalCost = currentHotel.rate * 4; // 4 nights

  // EXPERIENCES CATEGORY STATE (Add, Remove, Replace)
  const defaultExperiencesList = [
    tripState.experiences?.items?.[0] || `${selectedDest} Historic Old Quarter Walking Tour & Photo Walk`,
    tripState.experiences?.items?.[1] || `${selectedDest} Sunset Catamaran Cruise with Music & Refreshments`,
    tripState.experiences?.items?.[2] || `${selectedDest} Clifftop Beach Club VIP Day Pass & Cocktails`,
  ];

  const alternativePool = [
    `${selectedDest} Gourmet Food Crawl & Artisan Cafe Trail`,
    `${selectedDest} Secret Waterfall Trek & Swimming Lagoon`,
    `${selectedDest} Scenic Speedboat Island Hopping Tour`,
    `${selectedDest} Traditional Pottery & Cultural Workshop`,
    `${selectedDest} Night Kayaking & Bioluminescent Bay Tour`,
  ];

  const [experiences, setExperiences] = useState<string[]>(
    tripState.customExperiences && tripState.customExperiences.length > 0
      ? tripState.customExperiences
      : defaultExperiencesList
  );

  const [newExpInput, setNewExpInput] = useState('');
  const [isAddingExp, setIsAddingExp] = useState(false);

  const handleRemoveExperience = (idx: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleReplaceExperience = (idx: number) => {
    const available = alternativePool.filter((item) => !experiences.includes(item));
    if (available.length === 0) return;
    const replacement = available[Math.floor(Math.random() * available.length)];
    setExperiences((prev) => {
      const copy = [...prev];
      copy[idx] = replacement;
      return copy;
    });
  };

  const handleAddExperience = () => {
    if (!newExpInput.trim()) return;
    setExperiences((prev) => [...prev, newExpInput.trim()]);
    setNewExpInput('');
    setIsAddingExp(false);
  };

  // CABS / TRANSFERS
  const transferFare = baseTransferCost;

  // DYNAMIC SELECTED TRIP TOTAL CALCULATION
  const singlePersonFlights = selectedComponents.flights ? flightFare : 0;
  const singlePersonHotel = selectedComponents.hotel ? currentHotelTotalCost : 0;
  const singlePersonExperiences = selectedComponents.experiences
    ? Math.max(1200, Math.round((baseExpCost / 3) * Math.max(1, experiences.length)))
    : 0;
  const singlePersonTransfer = selectedComponents.transfers ? transferFare : 0;

  const totalPerPerson = singlePersonFlights + singlePersonHotel + singlePersonExperiences + singlePersonTransfer;
  const totalTripPrice = totalPerPerson * travellerCount;

  // MODAL FOR "BOOK INDIVIDUAL COMPONENTS"
  const [showModularModal, setShowModularModal] = useState(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  const MMT_URLS = {
    flights: 'https://www.makemytrip.com/flights/',
    hotels: 'https://www.makemytrip.com/hotels/',
    activities: 'https://www.makemytrip.com/activities/',
    cabs: 'https://www.makemytrip.com/cabs/',
    trains: 'https://www.makemytrip.com/railways/',
    buses: 'https://www.makemytrip.com/bus-tickets/',
  } as const;

  const getMmtUrlForService = (service: string): string => {
    const value = service.toLowerCase();
    if (value.includes('flight')) return MMT_URLS.flights;
    if (value.includes('hotel') || value.includes('stay')) return MMT_URLS.hotels;
    if (value.includes('train') || value.includes('rail')) return MMT_URLS.trains;
    if (value.includes('bus')) return MMT_URLS.buses;
    if (value.includes('cab') || value.includes('transfer')) return MMT_URLS.cabs;
    if (value.includes('activit') || value.includes('experience') || value.includes('sight')) {
      return MMT_URLS.activities;
    }
    return 'https://www.makemytrip.com/';
  };

  const showHandoffAlert = (service: string) => {
    const url = getMmtUrlForService(service);
    setActiveNotification(`Opening official MakeMyTrip ${service} booking...`);

    // Use a real external link, not a fake prototype-only redirect.
    // The public MMT page opens in a new tab; production integration could
    // later pass destination/dates/traveller details through private APIs.
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    setTimeout(() => setActiveNotification(null), 3000);
  };

  const normalizedCountry = (tripState.country || '').toLowerCase();
  const normalizedDestination = selectedDest.toLowerCase();
  const isDomesticIndiaTrip =
    normalizedCountry.includes('india') ||
    ['goa', 'gokarna', 'jaipur', 'jodhpur', 'varkala', 'manali', 'mumbai', 'delhi', 'bengaluru', 'bangalore', 'kerala', 'udaipur']
      .some((place) => normalizedDestination.includes(place));

  const handlePrimaryBook = () => {
    onContinueBooking(
      selectedComponents,
      totalTripPrice,
      totalPerPerson,
      experiences
    );
  };

  const matchType = tripState.selectedMatchType || 'best_fit';
  const matchLabels: Record<string, { label: string; color: string }> = {
    exact: { label: 'EXACT REEL MATCH', color: 'bg-slate-800 text-white' },
    vibe: { label: 'SAME VIBE ALTERNATIVE', color: 'bg-emerald-700 text-white' },
    best_fit: { label: 'BEST FIT SWEET SPOT ⭐', color: 'bg-gradient-to-r from-[#008CFF] to-[#0052CC] text-white' },
  };

  const anyComponentSelected =
    selectedComponents.flights ||
    selectedComponents.hotel ||
    selectedComponents.experiences ||
    selectedComponents.transfers;

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-10">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#008CFF] transition-colors cursor-pointer"
      >
        <span>← Back to Feasibility Comparison</span>
      </button>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
        {/* ========================================================================= */}
        {/* SUMMARY HEADER: YOUR RECOMMENDED TRIP */}
        {/* ========================================================================= */}
        <div className="text-center space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider ${matchLabels[matchType]?.color || 'bg-[#008CFF] text-white'}`}>
              {matchLabels[matchType]?.label || 'RECOMMENDED TRIP'}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>MMT Feasibility Verified</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            YOUR RECOMMENDED TRIP
          </h1>
          <p className="text-xs font-bold text-slate-600">
            {originCity} ⇄ <strong className="text-slate-900">{selectedDest}</strong> • {dates} • {duration} • {travellerCount} {travellerCount === 1 ? 'Traveller' : 'Travellers'}
          </p>
        </div>

        {/* MODULAR NOTIFICATION BANNER */}
        <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs font-medium flex items-center gap-2">
          <Info className="w-4 h-4 text-[#008CFF] shrink-0" />
          <span>
            <strong>Modular Booking:</strong> TripSpark recommends the complete trip, but you choose which components to book. Select or skip any card below!
          </span>
        </div>

        {/* Feedback Alert Toast */}
        {activeNotification && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between animate-in fade-in duration-150">
            <span>{activeNotification}</span>
            <button type="button" onClick={() => setActiveNotification(null)}>
              <X className="w-3.5 h-3.5 text-emerald-700" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SEPARATE CATEGORY CARDS */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          {/* --------------------------------------------------------------------- */}
          {/* 1. ✈ FLIGHTS CARD */}
          {/* --------------------------------------------------------------------- */}
          <div className={`p-4 rounded-2xl border-2 transition-all ${
            selectedComponents.flights ? 'bg-white border-blue-200 shadow-xs' : 'bg-slate-50/70 border-slate-200 opacity-60'
          }`}>
            {/* Header & Checkbox */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedComponents.flights}
                  onChange={() => toggleComponent('flights')}
                  className="w-4 h-4 text-[#008CFF] rounded border-slate-300 focus:ring-blue-400 cursor-pointer"
                />
                <span className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <Plane className="w-4 h-4 text-[#008CFF]" />
                  <span>FLIGHTS</span>
                </span>
              </label>

              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100/70 text-[#008CFF] tracking-wider">
                TripSpark Recommended
              </span>
            </div>

            {/* Flight Body */}
            <div className="mt-3 space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    {originCity} → {selectedDest}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    {flightDetails.airline} • {flightDetails.stops} • {flightDetails.duration}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-slate-900 block">
                    ₹{flightFare.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">per person</span>
                </div>
              </div>

              {/* Optional Alternatives: Cheapest, Fastest, Best balance */}
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  OPTIONAL FLIGHT SCHEDULE ALTERNATIVES:
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  {[
                    { id: 'balanced', label: 'Best Balance', badge: 'Optimised' },
                    { id: 'cheapest', label: 'Cheapest', badge: '-₹1.2K' },
                    { id: 'fastest', label: 'Fastest', badge: '2h 10m' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setFlightAlternative(tier.id as any)}
                      className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                        flightAlternative === tier.id
                          ? 'border-[#008CFF] bg-blue-50 text-[#008CFF] font-black shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-50'
                      }`}
                    >
                      <span className="block truncate">{tier.label}</span>
                      <span className="text-[9px] text-slate-400 font-normal">{tier.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => showHandoffAlert('Flights')}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#008CFF] text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Flights on MMT</span>
                </button>
                <button
                  type="button"
                  onClick={() => showHandoffAlert('Flights Comparison')}
                  className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Compare More Flights
                </button>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* 2. 🏨 HOTELS / STAYS CARD */}
          {/* --------------------------------------------------------------------- */}
          <div className={`p-4 rounded-2xl border-2 transition-all ${
            selectedComponents.hotel ? 'bg-white border-emerald-200 shadow-xs' : 'bg-slate-50/70 border-slate-200 opacity-60'
          }`}>
            {/* Header & Checkbox */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedComponents.hotel}
                  onChange={() => toggleComponent('hotel')}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-400 cursor-pointer"
                />
                <span className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>HOTELS / STAYS</span>
                </span>
              </label>

              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 tracking-wider">
                TripSpark Recommended Stay
              </span>
            </div>

            {/* Hotel Body */}
            <div className="mt-3 space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    {currentHotel.name}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    {currentHotel.area} • <span className="font-bold text-emerald-700">{currentHotel.category}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-slate-900 block">
                    ₹{currentHotel.rate.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">per night (est.)</span>
                </div>
              </div>

              {/* Why it matches inspiration */}
              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs">
                <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider block mb-0.5">
                  WHY IT MATCHES THE INSPIRATION:
                </span>
                <p className="text-slate-700 font-medium text-[11px] leading-relaxed">
                  {currentHotel.why}
                </p>
              </div>

              {/* Filter Chips: Budget, Boutique, Resort, Luxury, Hostel, Apartment */}
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  STAY TYPE FILTERS:
                </span>
                <div className="flex flex-wrap gap-1">
                  {hotelFilters.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveHotelFilter(filter)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        activeHotelFilter === filter
                          ? 'bg-emerald-700 text-white shadow-2xs font-black'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => showHandoffAlert('Hotels')}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Hotels on MMT</span>
                </button>
                <button
                  type="button"
                  onClick={() => showHandoffAlert('Hotel Comparison')}
                  className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Compare More Hotels
                </button>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* 3. 🎟 EXPERIENCES CARD */}
          {/* --------------------------------------------------------------------- */}
          <div className={`p-4 rounded-2xl border-2 transition-all ${
            selectedComponents.experiences ? 'bg-white border-purple-200 shadow-xs' : 'bg-slate-50/70 border-slate-200 opacity-60'
          }`}>
            {/* Header & Checkbox */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedComponents.experiences}
                  onChange={() => toggleComponent('experiences')}
                  className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-400 cursor-pointer"
                />
                <span className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <Palmtree className="w-4 h-4 text-purple-600" />
                  <span>EXPERIENCES</span>
                </span>
              </label>

              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100/70 text-purple-800 tracking-wider">
                {experiences.length} Suggested Activities
              </span>
            </div>

            {/* Experiences Body */}
            <div className="mt-3 space-y-2.5">
              <div className="space-y-1.5">
                {experiences.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/90 flex items-center justify-between text-xs gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 font-black text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800 truncate">{exp}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleReplaceExperience(idx)}
                        title="Replace with alternative experience"
                        className="p-1 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveExperience(idx)}
                        title="Remove activity"
                        className="p-1 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Experience inline form */}
              {isAddingExp ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newExpInput}
                    onChange={(e) => setNewExpInput(e.target.value)}
                    placeholder="e.g. Scuba diving, Sunset cliff dinner..."
                    className="flex-1 text-xs px-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:brightness-105 cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingExp(false)}
                    className="px-2 py-1.5 text-slate-400 hover:text-slate-600 cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingExp(true)}
                  className="w-full py-1.5 px-3 rounded-xl border border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/40 text-purple-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Experience</span>
                </button>
              )}

              {/* View Activities Button */}
              <button
                type="button"
                onClick={() => showHandoffAlert('Activities & Sights')}
                className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Activities on MMT</span>
              </button>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* 4. 🚕 CABS / TRANSFERS CARD */}
          {/* --------------------------------------------------------------------- */}
          <div className={`p-4 rounded-2xl border-2 transition-all ${
            selectedComponents.transfers ? 'bg-white border-amber-200 shadow-xs' : 'bg-slate-50/70 border-slate-200 opacity-60'
          }`}>
            {/* Header & Checkbox */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedComponents.transfers}
                  onChange={() => toggleComponent('transfers')}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-400 cursor-pointer"
                />
                <span className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-amber-600" />
                  <span>CABS / TRANSFERS</span>
                </span>
              </label>

              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100/70 text-amber-800 tracking-wider">
                Optional Add-on
              </span>
            </div>

            {/* Cab Body */}
            <div className="mt-3 space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    Dedicated AC Airport Pick & Drop
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Pre-booked AC sedan with chauffeur in {selectedDest}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-slate-900 block">
                    ₹{transferFare.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">per person</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => showHandoffAlert('Cabs & Transfers')}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Cabs / Transfers on MMT</span>
                </button>
                {selectedComponents.transfers && (
                  <button
                    type="button"
                    onClick={() => setSelectedComponents((prev) => ({ ...prev, transfers: false }))}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Skip Transfer
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* 5. 🚆 OTHER TRANSPORT OPTIONS — direct MMT handoff */}
          {/* --------------------------------------------------------------------- */}
          <div className="p-4 rounded-2xl border-2 border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
                🚆 OTHER TRANSPORT OPTIONS
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 tracking-wider">
                {isDomesticIndiaTrip ? 'Domestic Alternatives' : 'Onward / Local Travel'}
              </span>
            </div>

            <p className="mt-2 text-[11px] text-slate-600 font-medium leading-relaxed">
              {isDomesticIndiaTrip
                ? `Also compare train and bus options for ${originCity} → ${selectedDest} where routes are available.`
                : 'For international trips, flights remain primary; trains, buses and cabs can still be used for onward or local travel where available.'}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                type="button"
                onClick={() => showHandoffAlert('Trains')}
                className="py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Trains on MMT</span>
              </button>
              <button
                type="button"
                onClick={() => showHandoffAlert('Buses')}
                className="py-2.5 px-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Buses on MMT</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DYNAMIC SELECTED TRIP TOTAL BANNER */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0C2356] to-[#103A82] text-white shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <span className="text-[10px] font-black uppercase text-blue-200 tracking-wider block">
                SELECTED TRIP TOTAL
              </span>
              <span className="text-xs text-slate-300">
                {travellerCount} {travellerCount === 1 ? 'traveller' : 'travellers'} • Only selected items
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black text-white">
                ₹{totalTripPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-blue-200 block">
                (₹{totalPerPerson.toLocaleString('en-IN')}/person)
              </span>
            </div>
          </div>

          {/* Component Breakdown Checklist */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="p-2 bg-white/10 rounded-xl">
              <span className="text-slate-300 block text-[10px]">Flights</span>
              <span className="font-bold text-white">
                {selectedComponents.flights ? `₹${(singlePersonFlights * travellerCount).toLocaleString('en-IN')}` : '—'}
              </span>
            </div>
            <div className="p-2 bg-white/10 rounded-xl">
              <span className="text-slate-300 block text-[10px]">Hotel</span>
              <span className="font-bold text-white">
                {selectedComponents.hotel ? `₹${(singlePersonHotel * travellerCount).toLocaleString('en-IN')}` : '—'}
              </span>
            </div>
            <div className="p-2 bg-white/10 rounded-xl">
              <span className="text-slate-300 block text-[10px]">Experiences</span>
              <span className="font-bold text-white">
                {selectedComponents.experiences ? `₹${(singlePersonExperiences * travellerCount).toLocaleString('en-IN')}` : '—'}
              </span>
            </div>
            <div className="p-2 bg-white/10 rounded-xl">
              <span className="text-slate-300 block text-[10px]">Transfers</span>
              <span className="font-bold text-white">
                {selectedComponents.transfers ? `₹${(singlePersonTransfer * travellerCount).toLocaleString('en-IN')}` : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOOKING ACTIONS: PATH 1 (PRIMARY) & PATH 2 (MODULAR) */}
        {/* ========================================================================= */}
        <div className="space-y-2.5 pt-1">
          {/* PATH 1: Primary Button */}
          <button
            type="button"
            disabled={!anyComponentSelected}
            onClick={handlePrimaryBook}
            className={`w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#E55A00] hover:brightness-105 active:scale-[0.99] text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 ${
              !anyComponentSelected ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer group'
            }`}
          >
            <span>BOOK SELECTED TRIP (₹{totalTripPrice.toLocaleString('en-IN')})</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          {/* PATH 2: Modular Individual Booking Button */}
          <button
            type="button"
            onClick={() => setShowModularModal(true)}
            className="w-full py-3 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#008CFF]" />
            <span>BOOK INDIVIDUAL COMPONENTS</span>
          </button>

          {/* Plan with Friends Button (Preserved) */}
          <button
            type="button"
            onClick={onPlanWithFriends}
            className="w-full py-2.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4 text-purple-600" />
            <span>Plan with Friends (Lightweight Alignment • Optional)</span>
          </button>
        </div>

        {/* MODULAR COMPONENTS MODAL */}
        {showModularModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Book Individual Components
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    MakeMyTrip direct modular handoff for {selectedDest}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModularModal(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setShowModularModal(false);
                    showHandoffAlert('Flights Engine');
                  }}
                  className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 flex items-center justify-between font-bold text-slate-800 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-[#008CFF]" />
                    <span>Only Flights ({originCity} ⇄ {selectedDest})</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#008CFF]" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowModularModal(false);
                    showHandoffAlert('Hotels Engine');
                  }}
                  className="w-full p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 flex items-center justify-between font-bold text-slate-800 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>Only Hotels in {selectedDest}</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowModularModal(false);
                    showHandoffAlert('Experiences & Attractions');
                  }}
                  className="w-full p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 flex items-center justify-between font-bold text-slate-800 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Palmtree className="w-4 h-4 text-purple-600" />
                    <span>Only Experiences & Day Activities</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowModularModal(false);
                    showHandoffAlert('Airport Cabs');
                  }}
                  className="w-full p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 flex items-center justify-between font-bold text-slate-800 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-amber-600" />
                    <span>Only Airport & Sightseeing Cab</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
                </button>


                <button
                  type="button"
                  onClick={() => {
                    setShowModularModal(false);
                    showHandoffAlert('Trains');
                  }}
                  className="w-full p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 flex items-center justify-between font-bold text-slate-800 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">🚆</span>
                    <span>Train Booking on MMT</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowModularModal(false);
                    showHandoffAlert('Buses');
                  }}
                  className="w-full p-3 rounded-xl border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/50 flex items-center justify-between font-bold text-slate-800 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">🚌</span>
                    <span>Bus Booking on MMT</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-600" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600">
                💡 <strong>Flexibility First:</strong> You never have to buy a bundled package. MakeMyTrip guarantees individual category pricing.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
