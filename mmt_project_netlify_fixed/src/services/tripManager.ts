import { CurrentTripState, CurrentTripPackage, TripPackageComponent, ItineraryDay, VideoAnalysisResult } from '../types';

/**
 * Destination-specific metadata dictionary for rich, believable itineraries & packages.
 * Includes flights, top stays, landmarks, and country info.
 */
interface DestinationPreset {
  country: string;
  flag: string;
  airportCode: string;
  hotelName: string;
  hotelType: string;
  landmarks: string[];
  days: { day: string; title: string }[];
  baseFlightCost: number;
  baseHotelCost: number;
  baseTransferCost: number;
  baseExperienceCost: number;
  baseLocalSpend: number;
}

const DESTINATION_PRESETS: Record<string, DestinationPreset> = {
  SEOUL: {
    country: 'South Korea 🇰🇷',
    flag: '🇰🇷',
    airportCode: 'ICN',
    hotelName: 'Lotte Hotel Seoul (Myeongdong Luxury Stay)',
    hotelType: '5-Star Executive Central Stay',
    landmarks: ['Gyeongbokgung Palace', 'Bukchon Hanok Village', 'Myeongdong Street Food', 'N Seoul Tower', 'Hongdae Nightlife'],
    days: [
      { day: 'DAY 1', title: 'Arrival in Seoul + Myeongdong Night Market & Street Food' },
      { day: 'DAY 2', title: 'Gyeongbokgung Palace Royal Walk + Bukchon Hanok Village' },
      { day: 'DAY 3', title: 'N Seoul Tower Sunset Cable Car + Han River Cruise' },
      { day: 'DAY 4', title: 'DDP Design Plaza & Vibrant Hongdae Indie Cafe Hopping' },
      { day: 'DAY 5', title: 'Insadong Traditional Tea Houses & Departure from Incheon' },
    ],
    baseFlightCost: 18500,
    baseHotelCost: 12500,
    baseTransferCost: 1500,
    baseExperienceCost: 4500,
    baseLocalSpend: 3000,
  },
  PARIS: {
    country: 'France 🇫🇷',
    flag: '🇫🇷',
    airportCode: 'CDG',
    hotelName: 'Pullman Paris Tour Eiffel (River & Landmark Views)',
    hotelType: 'Boutique Haussmann-Style Hotel',
    landmarks: ['Eiffel Tower', 'Louvre Museum', 'Seine River Cruise', 'Montmartre', 'Champs-Élysées'],
    days: [
      { day: 'DAY 1', title: 'Arrival in Paris + Twilight Seine River Cruise & Eiffel Lights' },
      { day: 'DAY 2', title: 'Louvre Masterpieces & Tuileries Garden Stroll' },
      { day: 'DAY 3', title: 'Montmartre Bohemian Walk & Sacré-Cœur Artist Square' },
      { day: 'DAY 4', title: 'Champs-Élysées & Arc de Triomphe Sunset Vista' },
      { day: 'DAY 5', title: 'Le Marais Boutique Bakery Breakfast & Departure from CDG' },
    ],
    baseFlightCost: 32000,
    baseHotelCost: 22000,
    baseTransferCost: 2500,
    baseExperienceCost: 6500,
    baseLocalSpend: 5500,
  },
  GOA: {
    country: 'India 🇮🇳',
    flag: '🇮🇳',
    airportCode: 'GOX',
    hotelName: 'Heritage Coastal Boutique Villa (Anjuna & Vagator)',
    hotelType: 'Sea-Breeze Heritage Resort',
    landmarks: ['Anjuna Beach', 'Fontainhas Latin Quarter', 'Chapora Fort', 'Dudhsagar Falls'],
    days: [
      { day: 'DAY 1', title: 'Arrival at MOPA Airport + North Goa Coastal Villa Check-in' },
      { day: 'DAY 2', title: 'Anjuna & Vagator Cliff Beach Clubs & Sunset Cocktails' },
      { day: 'DAY 3', title: 'Fontainhas Portuguese Heritage Quarter Photo Tour' },
      { day: 'DAY 4', title: 'Backwater Catamaran Cruise & Seafood Feast' },
      { day: 'DAY 5', title: 'Lazy Beachside Brunch & Return Flight' },
    ],
    baseFlightCost: 7500,
    baseHotelCost: 8500,
    baseTransferCost: 1200,
    baseExperienceCost: 3200,
    baseLocalSpend: 2500,
  },
  BALI: {
    country: 'Indonesia 🇮🇩',
    flag: '🇮🇩',
    airportCode: 'DPS',
    hotelName: 'Seminyak Sea-Breeze Private Pool Villa',
    hotelType: 'Tropical Private Pool Sanctuary',
    landmarks: ['Uluwatu Temple', 'Tegalalang Rice Terraces', 'Seminyak Beach', 'Nusa Penida'],
    days: [
      { day: 'DAY 1', title: 'Arrival in Denpasar + Seminyak Private Pool Villa Check-in' },
      { day: 'DAY 2', title: 'Uluwatu Sunset Temple & Clifftop Beach Club Vibe' },
      { day: 'DAY 3', title: 'Ubud Tegalalang Rice Terraces & Jungle Swing' },
      { day: 'DAY 4', title: 'Nusa Penida Coastal Speedboat Safari & Snorkeling' },
      { day: 'DAY 5', title: 'Traditional Balinese Herbal Spa & Airport Drop' },
    ],
    baseFlightCost: 16500,
    baseHotelCost: 10800,
    baseTransferCost: 1400,
    baseExperienceCost: 3800,
    baseLocalSpend: 2500,
  },
  PHUKET: {
    country: 'Thailand 🇹🇭',
    flag: '🇹🇭',
    airportCode: 'HKT',
    hotelName: 'Kata Beachfront Pool Resort',
    hotelType: 'Andaman Sea Ocean-View Resort',
    landmarks: ['Kata Beach', 'Phi Phi Islands', 'Old Phuket Town', 'Big Buddha'],
    days: [
      { day: 'DAY 1', title: 'Arrival in Phuket + Kata Beach Sunset Check-in' },
      { day: 'DAY 2', title: 'Phi Phi Islands Speedboat Hopping & Maya Bay' },
      { day: 'DAY 3', title: 'Old Phuket Town Sino-Portuguese Heritage & Night Market' },
      { day: 'DAY 4', title: 'Big Buddha Panoramic Viewpoint & Sunset Beach Club' },
      { day: 'DAY 5', title: 'Morning Andaman Swim & Return Departure' },
    ],
    baseFlightCost: 14500,
    baseHotelCost: 10500,
    baseTransferCost: 1200,
    baseExperienceCost: 3800,
    baseLocalSpend: 3600,
  },
};

/**
 * Generates an authentic package tailored strictly to the specified destination.
 */
export function generateTripPackage(params: {
  destination: string;
  country?: string;
  originCity: string;
  travellers: number;
  dates?: string;
  duration?: string;
  budgetPerPerson: number;
  targetPrice?: number;
  isGroupOptimized?: boolean;
  analysis?: VideoAnalysisResult;
}): CurrentTripPackage {
  const destClean = (params.destination || 'Destination').trim();
  const destUpper = destClean.toUpperCase();

  // Find preset or fallback
  const presetKey = Object.keys(DESTINATION_PRESETS).find(
    (k) => destUpper.includes(k) || k.includes(destUpper)
  );
  const preset = presetKey ? DESTINATION_PRESETS[presetKey] : null;

  const country = params.country || preset?.country || (params.analysis?.country ? `${params.analysis.country}` : 'Global');
  const originCity = params.originCity || 'Delhi';
  const dates = params.dates || '25–29 October';
  const duration = params.duration || '4 Nights / 5 Days';
  const travellers = params.travellers || 4;

  const flightName = preset
    ? `Flights (${originCity} → ${destClean} ${preset.airportCode})`
    : `Flights (${originCity} → ${destClean} Airport)`;

  const hotelName = preset
    ? preset.hotelName
    : (params.analysis?.possibleHotelOrProperty || `${destClean} Central Boutique Stay`);

  const hotelType = preset ? preset.hotelType : 'Curated Premium Accommodation';
  const transfersName = `Private AC Airport & Sightseeing Transfers in ${destClean}`;

  const topExperiences = (params.analysis?.landmarks && params.analysis.landmarks.length > 0)
    ? params.analysis.landmarks.slice(0, 4)
    : (preset?.landmarks || [`${destClean} City Highlights`, 'Local Culinary Journey', 'Scenic Sunset Experience', 'Cultural Heritage Tour']);

  // Calibrate component prices based on targetPrice, preset or budget
  let flightCost = 0;
  let hotelCost = 0;
  let transferCost = 0;
  let experienceCost = 0;
  let localSpend = 0;

  if (params.targetPrice && params.targetPrice > 0) {
    const base = params.targetPrice;
    flightCost = Math.round(base * 0.44);
    hotelCost = Math.round(base * 0.36);
    transferCost = Math.round(base * 0.05);
    experienceCost = base - flightCost - hotelCost - transferCost;
    localSpend = Math.round(base * 0.08);
  } else if (preset) {
    flightCost = preset.baseFlightCost;
    hotelCost = preset.baseHotelCost;
    transferCost = preset.baseTransferCost;
    experienceCost = preset.baseExperienceCost;
    localSpend = preset.baseLocalSpend;
  } else {
    flightCost = Math.round(params.budgetPerPerson * 0.44);
    hotelCost = Math.round(params.budgetPerPerson * 0.36);
    transferCost = Math.round(params.budgetPerPerson * 0.05);
    experienceCost = Math.round(params.budgetPerPerson * 0.15);
    localSpend = Math.round(params.budgetPerPerson * 0.08);
  }

  const rawTotal = flightCost + hotelCost + transferCost + experienceCost;
  const pricePerPerson = params.targetPrice && params.targetPrice > 0 ? params.targetPrice : rawTotal;
  const groupOptimizedPricePerPerson = Math.round(pricePerPerson * 0.88); // 12% group discount

  const activePrice = params.isGroupOptimized ? groupOptimizedPricePerPerson : pricePerPerson;

  return {
    destination: destClean,
    country,
    originCity,
    dates,
    duration,
    flightName,
    hotelName,
    hotelType,
    transfersName,
    topExperiences,
    components: [
      {
        title: flightName,
        subtitle: 'Direct / 1-Stop Verified Partner Airline',
        cost: params.isGroupOptimized ? Math.round(flightCost * 0.88) : flightCost,
        category: 'flight',
      },
      {
        title: hotelName,
        subtitle: `${hotelType} • Verified MMT Stay`,
        cost: params.isGroupOptimized ? Math.round(hotelCost * 0.88) : hotelCost,
        category: 'hotel',
      },
      {
        title: transfersName,
        subtitle: 'Dedicated vehicle with chauffeur',
        cost: transferCost,
        category: 'transfer',
      },
      {
        title: `${destClean} Sights & Experiences (${topExperiences.slice(0, 3).join(', ')})`,
        subtitle: topExperiences.slice(0, 2).join(', '),
        cost: experienceCost,
        category: 'experience',
      },
      {
        title: 'Estimated Local Spend',
        subtitle: 'Cafes, street markets & shopping',
        cost: localSpend,
        category: 'local_spend',
      },
    ],
    pricePerPerson,
    groupOptimizedPricePerPerson,
    travellers,
    totalGroupPrice: activePrice * travellers,
    isGroupOptimized: !!params.isGroupOptimized,
  };
}

/**
 * Generates an itinerary strictly for the chosen destination.
 */
export function generateItinerary(
  destination: string,
  analysis?: VideoAnalysisResult
): ItineraryDay[] {
  const destClean = (destination || 'Destination').trim();
  const destUpper = destClean.toUpperCase();

  const presetKey = Object.keys(DESTINATION_PRESETS).find(
    (k) => destUpper.includes(k) || k.includes(destUpper)
  );

  if (presetKey && DESTINATION_PRESETS[presetKey]) {
    return DESTINATION_PRESETS[presetKey].days;
  }

  // Build dynamically from Gemini analysis landmarks if available
  const landmarks = analysis?.landmarks || [];
  const activities = analysis?.activities || [];

  return [
    {
      day: 'DAY 1',
      title: `Arrival in ${destClean} + Check-in & Evening Orientation`,
    },
    {
      day: 'DAY 2',
      title: landmarks[0]
        ? `${landmarks[0]} & Cultural Discovery Walk`
        : `Top Iconic Highlights of ${destClean}`,
    },
    {
      day: 'DAY 3',
      title: landmarks[1]
        ? `${landmarks[1]} + Local Food & Cafe Hopping`
        : (activities[0] || `Scenic Viewpoints & Historic Sights in ${destClean}`),
    },
    {
      day: 'DAY 4',
      title: landmarks[2]
        ? `${landmarks[2]} & Vibrant Evening Leisure`
        : `Hidden Gems & Local Markets in ${destClean}`,
    },
    {
      day: 'DAY 5',
      title: `Farewell ${destClean} Morning Breakfast & Return Departure`,
    },
  ];
}

/**
 * Builds a complete CurrentTripState for a new destination or inspiration source.
 * Enforces zero carry-over of stale destination data.
 */
export function createNewTripState(params: {
  destination: string;
  country?: string;
  originCity?: string;
  adults?: number;
  children?: number;
  infants?: number;
  totalTravellers?: number;
  travellers?: number;
  dates?: string;
  duration?: string;
  budgetPerPerson?: number;
  targetPrice?: number;
  matchType?: 'exact' | 'vibe' | 'best_fit';
  isDemoMode?: boolean;
  isGroupOptimized?: boolean;
  inspirationSource?: CurrentTripState['inspirationSource'];
  analysis?: VideoAnalysisResult;
}): CurrentTripState {
  const destination = (params.destination && params.destination !== 'Exact destination uncertain' ? params.destination : 'Bali').trim();
  const originCity = params.originCity || 'Delhi';
  const adults = typeof params.adults === 'number' ? params.adults : 2;
  const children = typeof params.children === 'number' ? params.children : 0;
  const infants = typeof params.infants === 'number' ? params.infants : 0;
  const totalTravellers = typeof params.totalTravellers === 'number'
    ? params.totalTravellers
    : (typeof params.travellers === 'number' ? params.travellers : (adults + children + infants));
  const travellers = totalTravellers;
  const dates = params.dates || '25–29 October';
  const duration = params.duration || '4 Nights / 5 Days';
  const budgetPerPerson = params.budgetPerPerson || 35000;
  const matchType = params.matchType || 'exact';
  const isDemoMode = !!params.isDemoMode;
  const isGroupOptimized = !!params.isGroupOptimized;

  const pkg = generateTripPackage({
    destination,
    country: params.country,
    originCity,
    travellers,
    dates,
    duration,
    budgetPerPerson,
    targetPrice: params.targetPrice,
    isGroupOptimized,
    analysis: params.analysis,
  });

  const itinerary = generateItinerary(destination, params.analysis);

  const activePrice = isGroupOptimized
    ? pkg.groupOptimizedPricePerPerson
    : pkg.pricePerPerson;

  const flightComp: TripPackageComponent = pkg.components.find((c) => c.category === 'flight') || {
    title: pkg.flightName,
    subtitle: 'Direct / 1-stop verified route',
    cost: Math.round(activePrice * 0.44),
    category: 'flight',
  };
  const hotelComp: TripPackageComponent = pkg.components.find((c) => c.category === 'hotel') || {
    title: pkg.hotelName,
    subtitle: pkg.hotelType,
    cost: Math.round(activePrice * 0.36),
    category: 'hotel',
  };
  const transferComp: TripPackageComponent = pkg.components.find((c) => c.category === 'transfer') || {
    title: pkg.transfersName,
    subtitle: 'Private AC Airport & City Transfers',
    cost: Math.round(activePrice * 0.05),
    category: 'transfer',
  };
  const expComp: TripPackageComponent = pkg.components.find((c) => c.category === 'experience') || {
    title: `${destination} Experiences`,
    subtitle: 'Curated sightseeing',
    cost: Math.round(activePrice * 0.15),
    category: 'experience',
  };

  return {
    isDemoMode,
    inspirationSource: params.inspirationSource || null,
    detectedDestination: destination,
    selectedDestination: destination,
    country: pkg.country,
    adults,
    children,
    infants,
    totalTravellers,
    travellers,
    originCity,
    dates,
    duration,
    budgetPerPerson,
    selectedMatchType: matchType,
    itinerary,
    flight: {
      title: flightComp.title,
      subtitle: flightComp.subtitle,
      cost: flightComp.cost,
    },
    hotel: {
      title: hotelComp.title,
      subtitle: hotelComp.subtitle,
      cost: hotelComp.cost,
    },
    transfers: {
      title: transferComp.title,
      subtitle: transferComp.subtitle,
      cost: transferComp.cost,
    },
    experiences: {
      title: expComp.title,
      subtitle: expComp.subtitle,
      cost: expComp.cost,
      items: pkg.topExperiences,
    },
    packagePricePerPerson: activePrice,
    groupTotal: activePrice * travellers,
    package: pkg,
    bookingReference: `MMT-TS-${Math.floor(10000 + Math.random() * 90000)}`,
    isBooked: false,
    isGroupOptimized,
  };
}

/**
 * Isolated DEMO Trip State (only used when user explicitly requests TRY DEMO).
 */
export function createDemoTripState(): CurrentTripState {
  return createNewTripState({
    destination: 'Bali',
    country: 'Indonesia 🇮🇩',
    originCity: 'Delhi',
    adults: 2,
    children: 0,
    infants: 0,
    totalTravellers: 2,
    travellers: 2,
    dates: '25–29 October',
    duration: '4 Nights / 5 Days',
    budgetPerPerson: 35000,
    isDemoMode: true,
  });
}

/**
 * Validation guard: Ensures that the package and itinerary match selectedDestination.
 * Regenerates synchronously if any discrepancy is detected or if force is true.
 */
export function validateAndSyncTripState(
  state: CurrentTripState,
  force: boolean = false
): CurrentTripState {
  if (
    force ||
    !state.package ||
    state.package.destination.trim().toUpperCase() !== state.selectedDestination.trim().toUpperCase()
  ) {
    const freshPackage = generateTripPackage({
      destination: state.selectedDestination,
      country: state.country,
      originCity: state.originCity,
      travellers: state.travellers,
      dates: state.dates,
      duration: state.duration,
      budgetPerPerson: state.budgetPerPerson,
      targetPrice: state.packagePricePerPerson,
      isGroupOptimized: state.isGroupOptimized,
      analysis: state.inspirationSource?.analysis,
    });

    const freshItinerary = generateItinerary(
      state.selectedDestination,
      state.inspirationSource?.analysis
    );

    const activePrice = state.isGroupOptimized
      ? freshPackage.groupOptimizedPricePerPerson
      : freshPackage.pricePerPerson;

    const flightComp: TripPackageComponent = freshPackage.components.find((c) => c.category === 'flight') || {
      title: freshPackage.flightName,
      subtitle: 'Direct / 1-stop verified route',
      cost: Math.round(activePrice * 0.44),
      category: 'flight',
    };
    const hotelComp: TripPackageComponent = freshPackage.components.find((c) => c.category === 'hotel') || {
      title: freshPackage.hotelName,
      subtitle: freshPackage.hotelType,
      cost: Math.round(activePrice * 0.36),
      category: 'hotel',
    };
    const transferComp: TripPackageComponent = freshPackage.components.find((c) => c.category === 'transfer') || {
      title: freshPackage.transfersName,
      subtitle: 'Private AC Airport & City Transfers',
      cost: Math.round(activePrice * 0.05),
      category: 'transfer',
    };
    const expComp: TripPackageComponent = freshPackage.components.find((c) => c.category === 'experience') || {
      title: `${state.selectedDestination} Experiences`,
      subtitle: 'Curated sightseeing',
      cost: Math.round(activePrice * 0.15),
      category: 'experience',
    };

    return {
      ...state,
      adults: state.adults ?? 2,
      children: state.children ?? 0,
      infants: state.infants ?? 0,
      totalTravellers: state.totalTravellers ?? state.travellers ?? 2,
      travellers: state.totalTravellers ?? state.travellers ?? 2,
      country: freshPackage.country,
      itinerary: freshItinerary,
      package: freshPackage,
      flight: {
        title: flightComp.title,
        subtitle: flightComp.subtitle,
        cost: flightComp.cost,
      },
      hotel: {
        title: hotelComp.title,
        subtitle: hotelComp.subtitle,
        cost: hotelComp.cost,
      },
      transfers: {
        title: transferComp.title,
        subtitle: transferComp.subtitle,
        cost: transferComp.cost,
      },
      experiences: {
        title: expComp.title,
        subtitle: expComp.subtitle,
        cost: expComp.cost,
        items: freshPackage.topExperiences,
      },
      packagePricePerPerson: activePrice,
      groupTotal: activePrice * state.travellers,
    };
  }
  return state;
}
