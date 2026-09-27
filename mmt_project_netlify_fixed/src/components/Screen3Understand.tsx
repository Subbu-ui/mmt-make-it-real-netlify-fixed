import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  MapPin,
  Check,
  Calendar,
  Users,
  IndianRupee,
  Navigation,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Edit2,
  UploadCloud,
  Compass,
  Heart,
  Plus,
  Minus,
  Info,
  Search,
  X,
} from 'lucide-react';
import { VideoAnalysisResult, CurrentTripState } from '../types';

export interface AirportOption {
  city: string;
  code: string;
  state: string;
  name: string;
}

export const INDIAN_AIRPORTS: AirportOption[] = [
  { city: 'Delhi', code: 'DEL', state: 'Delhi NCR', name: 'Indira Gandhi International' },
  { city: 'Mumbai', code: 'BOM', state: 'Maharashtra', name: 'Chhatrapati Shivaji Maharaj' },
  { city: 'Bengaluru', code: 'BLR', state: 'Karnataka', name: 'Kempegowda International' },
  { city: 'Hyderabad', code: 'HYD', state: 'Telangana', name: 'Rajiv Gandhi International' },
  { city: 'Jaipur', code: 'JAI', state: 'Rajasthan', name: 'Jaipur International' },
  { city: 'Lucknow', code: 'LKO', state: 'Uttar Pradesh', name: 'Chaudhary Charan Singh' },
  { city: 'Kochi', code: 'COK', state: 'Kerala', name: 'Cochin International' },
  { city: 'Chandigarh', code: 'IXC', state: 'Punjab / Haryana', name: 'Shaheed Bhagat Singh' },
  { city: 'Guwahati', code: 'GAU', state: 'Assam', name: 'Lokpriya Gopinath Bordoloi' },
  { city: 'Bhubaneswar', code: 'BBI', state: 'Odisha', name: 'Biju Patnaik International' },
  { city: 'Nagpur', code: 'NAG', state: 'Maharashtra', name: 'Dr. Babasaheb Ambedkar' },
  { city: 'Surat', code: 'STV', state: 'Gujarat', name: 'Surat International' },
  { city: 'Indore', code: 'IDR', state: 'Madhya Pradesh', name: 'Devi Ahilyabai Holkar' },
  { city: 'Amritsar', code: 'ATQ', state: 'Punjab', name: 'Sri Guru Ram Dass Jee' },
  { city: 'Kolkata', code: 'CCU', state: 'West Bengal', name: 'Netaji Subhas Chandra Bose' },
  { city: 'Chennai', code: 'MAA', state: 'Tamil Nadu', name: 'Chennai International' },
  { city: 'Ahmedabad', code: 'AMD', state: 'Gujarat', name: 'Sardar Vallabhbhai Patel' },
  { city: 'Pune', code: 'PNQ', state: 'Maharashtra', name: 'Pune International Airport' },
  { city: 'Goa', code: 'GOX', state: 'Goa', name: 'Manohar International (MOPA)' },
  { city: 'Varanasi', code: 'VNS', state: 'Uttar Pradesh', name: 'Lal Bahadur Shastri' },
  { city: 'Patna', code: 'PAT', state: 'Bihar', name: 'Jay Prakash Narayan' },
  { city: 'Coimbatore', code: 'CJB', state: 'Tamil Nadu', name: 'Coimbatore International' },
  { city: 'Thiruvananthapuram', code: 'TRV', state: 'Kerala', name: 'Trivandrum International' },
  { city: 'Mangaluru', code: 'IXE', state: 'Karnataka', name: 'Mangaluru International' },
  { city: 'Visakhapatnam', code: 'VTZ', state: 'Andhra Pradesh', name: 'Visakhapatnam International' },
  { city: 'Vadodara', code: 'BDQ', state: 'Gujarat', name: 'Vadodara Airport' },
  { city: 'Bhopal', code: 'BHO', state: 'Madhya Pradesh', name: 'Raja Bhoj Airport' },
  { city: 'Srinagar', code: 'SXR', state: 'Jammu & Kashmir', name: 'Sheikh ul-Alam International' },
  { city: 'Bagdogra', code: 'IXB', state: 'West Bengal', name: 'Bagdogra Airport' },
  { city: 'Ranchi', code: 'IXR', state: 'Jharkhand', name: 'Birsa Munda Airport' },
  { city: 'Raipur', code: 'RPR', state: 'Chhattisgarh', name: 'Swami Vivekananda Airport' },
  { city: 'Dehradun', code: 'DED', state: 'Uttarakhand', name: 'Jolly Grant Airport' },
  { city: 'Udaipur', code: 'UDR', state: 'Rajasthan', name: 'Maharana Pratap Airport' },
  { city: 'Jodhpur', code: 'JDH', state: 'Rajasthan', name: 'Jodhpur Airport' },
];

interface Screen3UnderstandProps {
  analysis?: VideoAnalysisResult | null;
  destination?: string;
  country?: string;
  tripState?: CurrentTripState;
  inspirationSource?: {
    sourceType: 'link' | 'screenshot' | 'demo';
    url?: string;
    imagePreview?: string;
  } | null;
  onMakeItReal: (data: {
    selectedChips: string[];
    origin: string;
    departureAirportCode?: string;
    travellers: number;
    adults?: number;
    children?: number;
    infants?: number;
    budgetPerPerson: number;
    when: string;
    destination?: string;
    country?: string;
  }) => void;
  onBack: () => void;
  onRequestUploadScreenshot?: () => void;
}

export const Screen3Understand: React.FC<Screen3UnderstandProps> = ({
  analysis,
  destination: propDestination,
  country: propCountry,
  tripState,
  onMakeItReal,
  onBack,
  onRequestUploadScreenshot,
}) => {
  // =========================================================================
  // A. CLEAN DESTINATION DETECTION (NO "Global", "Scenic Region", "Region")
  // =========================================================================
  const rawCountry = analysis?.country || (analysis?.location?.country ?? propCountry ?? null);
  const cleanCountry =
    rawCountry && rawCountry !== 'Global' && rawCountry !== 'Travel' && rawCountry !== 'Scenic Region'
      ? rawCountry
      : null;

  const rawRegion = analysis?.region_or_state || (analysis?.location?.region ?? null);
  const cleanRegion =
    rawRegion && rawRegion !== 'Scenic Region' && rawRegion !== 'Region' && rawRegion !== 'Broader Region'
      ? rawRegion
      : null;

  const rawCity = analysis?.city_or_destination || (analysis?.location?.city ?? null);
  const cleanCity =
    rawCity &&
    rawCity !== 'Exact destination uncertain' &&
    rawCity !== 'Scenic Region' &&
    rawCity !== 'Destination'
      ? rawCity
      : null;

  const cleanPlace = analysis?.specific_place || (analysis?.location?.place ?? null);

  const confidence =
    typeof analysis?.locationConfidence === 'number'
      ? analysis.locationConfidence
      : typeof analysis?.confidence === 'number'
      ? analysis.confidence
      : 0;

  const evidence = Array.isArray(analysis?.evidence) ? analysis.evidence : [];
  const source =
    analysis?.source ||
    (analysis?.sourceOfInference === 'post_text' ? 'post text' : 'visual clues');

  let initialDisplayName: string | null = analysis?.displayName || analysis?.location?.displayName || null;
  if (!initialDisplayName) {
    if (cleanCity && cleanCountry) {
      initialDisplayName = `${cleanCity}${cleanRegion && cleanRegion !== cleanCity ? `, ${cleanRegion}` : ''}, ${cleanCountry}`;
    } else if (cleanRegion && cleanCountry) {
      initialDisplayName = `${cleanRegion}, ${cleanCountry}`;
    } else if (cleanCity) {
      initialDisplayName = cleanCity;
    } else if (cleanCountry) {
      initialDisplayName = cleanCountry;
    } else if (
      analysis?.destination &&
      analysis.destination !== 'Destination' &&
      analysis.destination !== 'Scenic Region' &&
      analysis.destination !== 'Global'
    ) {
      initialDisplayName = analysis.destination;
    }
  }

  // Ensure no dummy geography slips through into display name
  if (
    initialDisplayName &&
    (initialDisplayName.includes('Global') ||
      initialDisplayName.includes('Scenic Region') ||
      initialDisplayName.includes('Exact destination uncertain'))
  ) {
    initialDisplayName = null;
  }

  const hasExplicitLocation = Boolean(cleanCity || cleanRegion || cleanCountry);
  const isLocationDetected = Boolean(
    initialDisplayName &&
      (confidence >= 35 || hasExplicitLocation || (evidence && evidence.length > 0))
  );

  const location = {
    country: cleanCountry,
    region: cleanRegion,
    city: cleanCity,
    place: cleanPlace,
    displayName: initialDisplayName,
    confidence,
    evidence,
    source,
  };

  // STEP 9 — DEVELOPMENT DEBUGGING (Browser Console)
  useEffect(() => {
    console.log('--- TripSpark Frontend Destination Debug ---');
    console.log('detectedCountry:', location.country);
    console.log('detectedRegion:', location.region);
    console.log('detectedCity:', location.city);
    console.log('detectedPlace:', location.place);
    console.log('locationConfidence:', location.confidence);
    console.log('locationEvidence:', location.evidence);
    console.log('contentAccessStatus:', analysis?.contentAccessStatus || 'visual_analyzed');
    console.log('--------------------------------------------');
  }, [
    analysis,
    location.country,
    location.region,
    location.city,
    location.place,
    location.confidence,
  ]);

  // Destination Display & Edit State
  const [currentDisplayName, setCurrentDisplayName] = useState<string | null>(location.displayName);
  const [isEditingDestination, setIsEditingDestination] = useState(false);
  const [customDestinationInput, setCustomDestinationInput] = useState('');
  const [showEvidence, setShowEvidence] = useState(false);
  const [isVibeOnly, setIsVibeOnly] = useState(false);

  useEffect(() => {
    if (location.displayName) {
      setCurrentDisplayName(location.displayName);
    }
  }, [location.displayName]);

  const handleSaveCustomDestination = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCurrentDisplayName(trimmed);
    setIsVibeOnly(false);
    setIsEditingDestination(false);
  };

  // =========================================================================
  // E. EXPERIENCE UNDERSTANDING (Separate from Destination)
  // =========================================================================
  const defaultVibes = ['SCENIC', 'RELAXING', 'BEACH', 'COASTAL', 'FOOD', 'NIGHTLIFE'];
  const detectedVibes =
    Array.isArray(analysis?.travelVibes) && analysis.travelVibes.length > 0
      ? analysis.travelVibes.map((v) => v.toUpperCase())
      : defaultVibes;

  // "What caught your eye?": ONLY elements supported by the content
  const supportedItems: string[] = [];
  if (Array.isArray(analysis?.visualHighlights)) {
    supportedItems.push(...analysis.visualHighlights);
  }
  if (Array.isArray(analysis?.activities)) {
    supportedItems.push(...analysis.activities);
  }
  if (Array.isArray(analysis?.landmarks)) {
    supportedItems.push(...analysis.landmarks);
  }

  const uniqueSupported = Array.from(
    new Set(
      supportedItems
        .map((s) => s.trim())
        .filter(
          (s) =>
            Boolean(s) &&
            !s.includes('Global') &&
            !s.includes('Scenic Region') &&
            !s.includes('Scenic Scenery')
        )
    )
  );

  const availableChips =
    uniqueSupported.length > 0
      ? uniqueSupported.slice(0, 6)
      : detectedVibes.slice(0, 4).map((v) => `${v.charAt(0) + v.slice(1).toLowerCase()} Experience`);

  const [selectedChips, setSelectedChips] = useState<string[]>(() => availableChips.slice(0, 3));

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  // =========================================================================
  // F. TRAVELLER COUNT STATE (ONE SOURCE OF TRUTH)
  // Default: adults: 2, children: 0, infants: 0, totalTravellers: 2
  // =========================================================================
  const [adults, setAdults] = useState<number>(tripState?.adults ?? 2);
  const [children, setChildren] = useState<number>(tripState?.children ?? 0);
  const [infants, setInfants] = useState<number>(tripState?.infants ?? 0);

  const totalTravellers = adults + children + infants;

  const handleSelectTravellerPreset = (type: 'solo' | 'couple' | 'friends' | 'family') => {
    if (type === 'solo') {
      setAdults(1);
      setChildren(0);
      infants && setInfants(0);
    } else if (type === 'couple') {
      setAdults(2);
      setChildren(0);
      infants && setInfants(0);
    } else if (type === 'family') {
      setAdults(2);
      setChildren(1);
    } else if (type === 'friends') {
      setAdults(4);
      setChildren(0);
    }
  };

  const adjustAdults = (delta: number) => {
    setAdults((prev) => Math.max(1, Math.min(12, prev + delta)));
  };

  // Reality Constraints State
  const initialOrigin = tripState?.originCity || 'Delhi';
  const initialAirport = INDIAN_AIRPORTS.find((a) => a.city.toLowerCase() === initialOrigin.toLowerCase());
  const [origin, setOrigin] = useState(initialOrigin);
  const [departureAirportCode, setDepartureAirportCode] = useState<string>(
    tripState?.departureAirportCode || initialAirport?.code || 'DEL'
  );
  const [originSearch, setOriginSearch] = useState('');
  const [isOriginDropdownOpen, setIsOriginDropdownOpen] = useState(false);
  const originDropdownRef = useRef<HTMLDivElement>(null);

  // Manual Budget Input State (Primary control, minimum ₹5,000)
  const initialBudget = tripState?.budgetPerPerson || 35000;
  const [budgetPerPerson, setBudgetPerPerson] = useState<number>(initialBudget);
  const [budgetInputValue, setBudgetInputValue] = useState<string>(String(initialBudget));
  const [budgetError, setBudgetError] = useState<string | null>(null);

  const [when, setWhen] = useState(tripState?.dates || '25–29 October (Autumn)');

  const quickOrigins = [
    { city: 'Delhi', code: 'DEL' },
    { city: 'Mumbai', code: 'BOM' },
    { city: 'Bengaluru', code: 'BLR' },
    { city: 'Hyderabad', code: 'HYD' },
  ];

  const quickBudgetChips = [
    { label: '₹25K', value: 25000 },
    { label: '₹50K', value: 50000 },
    { label: '₹75K', value: 75000 },
    { label: '₹1L', value: 100000 },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (originDropdownRef.current && !originDropdownRef.current.contains(e.target as Node)) {
        setIsOriginDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAirport = (opt: { city: string; code: string }) => {
    setOrigin(opt.city);
    setDepartureAirportCode(opt.code);
    setOriginSearch('');
    setIsOriginDropdownOpen(false);
  };

  const handleBudgetChange = (val: string) => {
    const digitsOnly = val.replace(/[^\d]/g, '');
    setBudgetInputValue(digitsOnly);
    if (!digitsOnly) {
      setBudgetPerPerson(0);
      setBudgetError('Minimum budget is ₹5,000 per person');
      return;
    }
    const num = parseInt(digitsOnly, 10);
    setBudgetPerPerson(num);
    if (num < 5000) {
      setBudgetError('Minimum budget is ₹5,000 per person');
    } else {
      setBudgetError(null);
    }
  };

  const handleSelectBudgetPreset = (val: number) => {
    setBudgetPerPerson(val);
    setBudgetInputValue(String(val));
    setBudgetError(null);
  };

  const totalTripBudget = Math.max(0, budgetPerPerson) * totalTravellers;

  const filteredAirports = originSearch.trim()
    ? INDIAN_AIRPORTS.filter((a) => {
        const q = originSearch.toLowerCase();
        return (
          a.city.toLowerCase().includes(q) ||
          a.code.toLowerCase().includes(q) ||
          a.state.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q)
        );
      }).slice(0, 7)
    : [];

  const handleSubmit = () => {
    const finalDest = isVibeOnly
      ? 'Same Vibe Experience'
      : currentDisplayName || location.city || location.region || location.country || 'Destination';

    const finalBudget = Math.max(5000, budgetPerPerson || 5000);

    onMakeItReal({
      selectedChips,
      origin,
      departureAirportCode,
      travellers: totalTravellers,
      adults,
      children,
      infants,
      budgetPerPerson: finalBudget,
      when,
      destination: finalDest,
      country: location.country || undefined,
    });
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-10">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#008CFF] transition-colors cursor-pointer"
      >
        <span>← Back to Inspiration</span>
      </button>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-4 sm:space-y-5">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-[#008CFF] text-[11px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analysing Your Inspiration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Destination & Experience Analysis
          </h1>
        </div>

        {/* ========================================================================= */}
        {/* D. SIMPLIFIED DESTINATION CARD */}
        {/* ========================================================================= */}
        {isLocationDetected && currentDisplayName && !isVibeOnly ? (
          /* DETECTED DESTINATION CARD */
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/50 border border-blue-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                POSSIBLE DESTINATION
              </span>
              <button
                type="button"
                onClick={() => setIsEditingDestination((prev) => !prev)}
                className="text-xs font-black text-[#008CFF] hover:underline cursor-pointer flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>Change</span>
              </button>
            </div>

            {/* Destination Name */}
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-[#EB2026] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {currentDisplayName}
                </h2>
                <p className="text-xs font-semibold text-slate-600 mt-1">
                  {location.confidence}% confidence • Based on {location.source}
                </p>
                {analysis?.actualMediaAvailable === false && (
                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-[11px] font-medium text-amber-900">
                    <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>TripSpark could access the post text, but not the full video.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Why we think this link */}
            <div className="pt-1 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowEvidence((prev) => !prev)}
                className="text-xs font-bold text-slate-700 hover:text-[#008CFF] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Why we think this →</span>
                {showEvidence ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>
            </div>

            {/* Evidence Drawer */}
            {showEvidence && location.evidence.length > 0 && (
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5 animate-in fade-in duration-150">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                  CITED EVIDENCE:
                </span>
                <ul className="space-y-1">
                  {location.evidence.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700 leading-snug">
                      <span className="text-[#008CFF] font-black">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Inline Editor if open */}
            {isEditingDestination && (
              <div className="p-3 bg-white rounded-xl border border-blue-200 space-y-2 animate-in fade-in">
                <span className="text-xs font-bold text-slate-800 block">
                  Enter destination manually:
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customDestinationInput}
                    onChange={(e) => setCustomDestinationInput(e.target.value)}
                    placeholder="e.g. North Goa, Bali, Paris"
                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#008CFF] font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveCustomDestination(customDestinationInput)}
                    className="px-3.5 py-2 rounded-lg bg-[#008CFF] text-white text-xs font-black hover:brightness-105 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* B. LOCATION NOT CONFIRMED COMPACT CARD */
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                LOCATION NOT CONFIRMED
              </span>
              <p className="text-sm font-bold text-slate-800 mt-1 leading-snug">
                We understand the experience, but need one more clue to identify the destination.
              </p>
            </div>

            {/* ONLY Three Compact Actions (Section B) */}
            <div className="space-y-2 pt-1">
              {!isEditingDestination ? (
                <button
                  type="button"
                  onClick={() => setIsEditingDestination(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-300 hover:border-[#008CFF] text-xs font-bold text-slate-800 transition-colors cursor-pointer text-center shadow-2xs"
                >
                  Enter destination
                </button>
              ) : (
                <div className="p-3 bg-white rounded-xl border border-blue-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">
                    Type your destination:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customDestinationInput}
                      onChange={(e) => setCustomDestinationInput(e.target.value)}
                      placeholder="e.g. North Goa, Bali, Paris"
                      className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#008CFF] font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveCustomDestination(customDestinationInput)}
                      className="px-3.5 py-2 rounded-lg bg-[#008CFF] text-white text-xs font-black hover:brightness-105 cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onRequestUploadScreenshot) {
                      onRequestUploadScreenshot();
                    } else {
                      onBack();
                    }
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                  <span>Upload another screenshot</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsVibeOnly(true);
                    setCurrentDisplayName('Same Vibe Experience');
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl border text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    isVibeOnly
                      ? 'bg-blue-50 border-[#008CFF] text-[#008CFF]'
                      : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>Continue with vibe only</span>
                  {isVibeOnly && <Check className="w-3.5 h-3.5 text-[#008CFF]" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* E. EXPERIENCE UNDERSTANDING (Separate from Destination) */}
        {/* ========================================================================= */}
        <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
              <span>EXPERIENCE UNDERSTANDING</span>
            </span>
            <span className="text-[10px] font-medium text-slate-400">Independent Vibes</span>
          </div>

          {/* Clean Upper-Case Vibe Tags */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {detectedVibes.map((vibe) => (
              <span
                key={vibe}
                className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-[10px] font-black tracking-wider uppercase border border-rose-100 shadow-2xs"
              >
                {vibe}
              </span>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* E. WHAT CAUGHT YOUR EYE? (ONLY SUPPORTED OPTIONS) */}
        {/* ========================================================================= */}
        <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              WHAT CAUGHT YOUR EYE?
            </span>
            <span className="text-[10px] font-medium text-slate-400">Supported by content</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {availableChips.map((chip) => {
              const isSelected = selectedChips.includes(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => toggleChip(chip)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#008CFF] text-white shadow-2xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{chip}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* F. APPLY YOUR REALITY CONSTRAINTS (SINGLE SOURCE OF TRUTH) */}
        {/* ========================================================================= */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
            APPLY YOUR TRAVEL REALITY CONSTRAINTS
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* 1. Departure City (Searchable with Autocomplete) */}
            <div className="p-3 rounded-2xl bg-white border border-slate-200/90 space-y-2 relative" ref={originDropdownRef}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-[#008CFF]" />
                  <span>Departure City</span>
                </span>
                <span className="text-[11px] font-black text-slate-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                  {origin} {departureAirportCode ? `(${departureAirportCode})` : ''}
                </span>
              </div>

              {/* Search input with autocomplete */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={originSearch}
                  onChange={(e) => {
                    setOriginSearch(e.target.value);
                    setIsOriginDropdownOpen(true);
                  }}
                  onFocus={() => setIsOriginDropdownOpen(true)}
                  placeholder="Search city or airport (e.g. Jaipur, Kochi)..."
                  className="w-full text-xs font-semibold text-slate-800 bg-slate-50 pl-8 pr-7 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#008CFF] focus:bg-white transition-all"
                />
                {originSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setOriginSearch('');
                      setIsOriginDropdownOpen(false);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Autocomplete Suggestions Dropdown */}
              {isOriginDropdownOpen && originSearch.trim() && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-48 overflow-y-auto p-1 text-xs divide-y divide-slate-50 animate-in fade-in zoom-in-95 duration-100">
                  {filteredAirports.length > 0 ? (
                    filteredAirports.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => handleSelectAirport({ city: item.city, code: item.code })}
                        className="w-full text-left p-2 rounded-lg hover:bg-blue-50 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div>
                          <span className="font-bold text-slate-800 text-xs">
                            {item.city} ({item.code})
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate">
                            {item.name}, {item.state}
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-[#008CFF] bg-blue-100/50 px-1.5 py-0.5 rounded">
                          {item.code}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-2 text-center">
                      <p className="text-[11px] text-slate-500 mb-1">
                        No airport found for "{originSearch}"
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setOrigin(originSearch.trim());
                          setDepartureAirportCode('ORIGIN');
                          setIsOriginDropdownOpen(false);
                          setOriginSearch('');
                        }}
                        className="text-[11px] font-bold text-[#008CFF] hover:underline cursor-pointer"
                      >
                        Use "{originSearch.trim()}" as custom origin
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Options (Shortcuts only) */}
              <div className="pt-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  POPULAR SHORTCUTS:
                </span>
                <div className="flex flex-wrap gap-1">
                  {quickOrigins.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleSelectAirport(item)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        origin.toLowerCase() === item.city.toLowerCase()
                          ? 'bg-[#008CFF] text-white shadow-2xs font-black'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.city} ({item.code})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Travellers (Unified Shared State) */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Users className="w-3 h-3 text-purple-600" /> Travellers: {totalTravellers}
                </span>
                {/* Clean Stepper */}
                <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
                  <button
                    type="button"
                    onClick={() => adjustAdults(-1)}
                    disabled={adults <= 1}
                    className="w-5 h-5 rounded flex items-center justify-center bg-white text-slate-700 disabled:opacity-30 cursor-pointer shadow-2xs"
                    title="Decrease travellers"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-4 text-center font-bold text-xs text-slate-800">
                    {totalTravellers}
                  </span>
                  <button
                    type="button"
                    onClick={() => adjustAdults(1)}
                    disabled={adults >= 12}
                    className="w-5 h-5 rounded flex items-center justify-center bg-white text-slate-700 disabled:opacity-30 cursor-pointer shadow-2xs"
                    title="Increase travellers"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex gap-1 pt-0.5">
                {[
                  { id: 'solo', label: 'Solo (1)', count: 1 },
                  { id: 'couple', label: 'Couple (2)', count: 2 },
                  { id: 'family', label: 'Family (3)', count: 3 },
                  { id: 'friends', label: 'Group (4)', count: 4 },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectTravellerPreset(opt.id as any)}
                    className={`flex-1 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer text-center ${
                      totalTravellers === opt.count
                        ? 'bg-purple-600 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Budget Per Person (Primary Editable Numeric Input + Dynamic Total) */}
            <div className="p-3 rounded-2xl bg-white border border-slate-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Budget Per Person</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Min: ₹5,000</span>
              </div>

              {/* Primary Control: Editable Numeric Input */}
              <div className="relative flex items-center">
                <span className="absolute left-3 font-black text-emerald-700 text-sm">₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={budgetInputValue}
                  onChange={(e) => handleBudgetChange(e.target.value)}
                  placeholder="e.g. 43500"
                  className="w-full pl-7 pr-3 py-1.5 text-sm font-black text-slate-900 bg-emerald-50/40 rounded-xl border border-emerald-300 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              {budgetError && (
                <p className="text-[10px] font-bold text-red-500">{budgetError}</p>
              )}

              {/* Optional Quick-select chips (Shortcuts only) */}
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  QUICK SHORTCUTS:
                </span>
                <div className="flex gap-1">
                  {quickBudgetChips.map((chip) => (
                    <button
                      key={chip.value}
                      type="button"
                      onClick={() => handleSelectBudgetPreset(chip.value)}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer text-center ${
                        budgetPerPerson === chip.value
                          ? 'bg-emerald-600 text-white shadow-2xs font-black'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Total Trip Budget */}
              <div className="pt-1.5 border-t border-slate-100">
                <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-black uppercase text-emerald-800 tracking-wider block">
                      TOTAL TRIP BUDGET
                    </span>
                    <span className="text-sm font-black text-emerald-950">
                      ₹{totalTripBudget.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-700 block">
                      ₹{(budgetPerPerson || 0).toLocaleString('en-IN')} × {totalTravellers}
                    </span>
                    <span className="text-[9px] text-slate-500">
                      {totalTravellers === 1 ? '1 traveller' : `${totalTravellers} travellers`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Target Travel Window (Full Width / Not Clipped) */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-600" /> Target Travel Window
              </span>
              <input
                type="text"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                placeholder="e.g. 25–29 October (Autumn)"
                className="w-full text-xs font-bold text-slate-800 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:border-[#008CFF]"
              />
            </div>
          </div>
        </div>

        {/* CTA TO RUN FEASIBILITY ENGINE */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#008CFF] to-[#0065F5] hover:brightness-105 active:scale-[0.99] text-white text-xs sm:text-sm font-black tracking-wide shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>RUN FEASIBILITY ENGINE WITH REAL CONSTRAINTS</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
