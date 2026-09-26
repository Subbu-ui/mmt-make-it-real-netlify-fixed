import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Star,
  Building2,
  Plane,
  Palmtree,
  ShieldCheck,
  Compass,
  Clock,
  TrendingDown,
  Layers,
  Info,
} from 'lucide-react';
import { VideoAnalysisResult } from '../types';

interface Screen4MakeItRealProps {
  analysis?: VideoAnalysisResult | null;
  destination?: string;
  budgetPerPerson?: number;
  originCity?: string;
  onSelectDestination: (dest: string, matchType: 'exact' | 'vibe' | 'best_fit', price: number) => void;
  onBack: () => void;
}

export interface FeasibilityOption {
  id: 'exact' | 'vibe' | 'best_fit';
  name: string;
  cleanDestination: string;
  country: string;
  subtitle: string;
  badge: string;
  matchScore: number;
  price: number;
  isAboveBudget: boolean;
  budgetDeltaText: string;
  isBestFit?: boolean;
  image: string;
  flightText: string;
  stayText: string;
  vibeFidelity: string;
  logisticsScore: string;
  feasibilityScore: number;
  verdict: string;
  whatStayed: string[];
  whatAdjusted: string[];
}

// Helper to guarantee SAME VIBE is ALWAYS a DISTINCT, DIFFERENT destination
interface VibeAlternative {
  name: string;
  country: string;
  image: string;
  vibeText: string;
  stayText: string;
}

function resolveVibeAlternative(
  cleanDest: string,
  sourceCountry: string | null | undefined,
  travelVibes: string[] = []
): VibeAlternative {
  const lower = cleanDest.toLowerCase();
  const country = (sourceCountry || '').toLowerCase();
  const vibeStr = (travelVibes || []).join(' ').toLowerCase();

  // SAME AESTHETIC is deliberately constrained to a DIFFERENT destination
  // inside the SAME COUNTRY as the Reel/original destination.
  // Destination-specific mappings come first so the prototype stays believable.
  if (lower.includes('goa')) {
    return {
      name: 'Gokarna',
      country: 'India 🇮🇳',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      vibeText: '93% match: Pristine beaches, cliff cafés and a relaxed coastal aesthetic',
      stayText: 'Kudle Clifftop Boutique Eco-Resort',
    };
  }
  if (lower.includes('bali') || lower.includes('ubud') || lower.includes('uluwatu')) {
    return {
      name: 'Lombok',
      country: 'Indonesia 🇮🇩',
      image: 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?auto=format&fit=crop&w=800&q=80',
      vibeText: '91% match: Tropical beaches, boutique villas, waterfalls and laid-back island energy',
      stayText: 'Lombok Ocean-View Boutique Pool Villa',
    };
  }
  if (lower.includes('seoul') || lower.includes('korea')) {
    return {
      name: 'Busan',
      country: 'South Korea 🇰🇷',
      image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
      vibeText: '91% match: Korean café culture, neon nightlife and dramatic coastal scenery',
      stayText: 'Haeundae Boutique Ocean Design Hotel',
    };
  }
  if (lower.includes('paris') || lower.includes('france')) {
    return {
      name: 'Nice',
      country: 'France 🇫🇷',
      image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=800&q=80',
      vibeText: '90% match: Romantic streets, café culture, heritage architecture and scenic promenades',
      stayText: 'Old Nice Boutique Residence near Promenade des Anglais',
    };
  }
  if (lower.includes('ladakh') || lower.includes('spiti') || lower.includes('leh')) {
    return {
      name: 'Manali',
      country: 'India 🇮🇳',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      vibeText: '90% match: Mountain valleys, scenic drives, monasteries and adventure-led landscapes',
      stayText: 'Old Manali Valley-View Boutique Chalet',
    };
  }
  if (lower.includes('dubai') || lower.includes('uae')) {
    return {
      name: 'Abu Dhabi',
      country: 'United Arab Emirates 🇦🇪',
      image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=800&q=80',
      vibeText: '91% match: Premium city experiences, modern architecture, beaches and desert escapes',
      stayText: 'Saadiyat Island Design Resort',
    };
  }
  if (lower.includes('jaipur') || lower.includes('rajasthan')) {
    return {
      name: 'Jodhpur',
      country: 'India 🇮🇳',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      vibeText: '93% match: Royal architecture, colourful lanes, forts and heritage courtyards',
      stayText: 'Heritage Haveli Boutique Hotel near Stepwell',
    };
  }
  if (lower.includes('phuket') || lower.includes('thailand')) {
    return {
      name: 'Krabi',
      country: 'Thailand 🇹🇭',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
      vibeText: '92% match: Limestone cliffs, tropical beaches, island hopping and relaxed nightlife',
      stayText: 'Ao Nang Cliffside Boutique Resort',
    };
  }
  if (lower.includes('singapore')) {
    return {
      name: 'Sentosa Island',
      country: 'Singapore 🇸🇬',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
      vibeText: '88% match: Modern waterfront leisure, premium stays and high-energy attractions',
      stayText: 'Sentosa Cove Lifestyle Resort',
    };
  }

  // Country-level fallbacks: still SAME COUNTRY, never a random foreign destination.
  if (country.includes('india')) {
    const isBeach = /beach|coastal|sea/.test(vibeStr);
    const isMountain = /mountain|trek|snow|scenic|alpine/.test(vibeStr);
    const name = isBeach ? 'Varkala' : isMountain ? 'Manali' : 'Udaipur';
    return {
      name,
      country: 'India 🇮🇳',
      image: isBeach
        ? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      vibeText: isBeach
        ? '90% match: Coastal scenery, cafés and relaxed beach energy'
        : isMountain
        ? '90% match: Scenic mountain landscapes, nature and adventure'
        : '89% match: Heritage architecture, boutique stays and cultural experiences',
      stayText: `${name} Boutique Experience Stay`,
    };
  }
  if (country.includes('indonesia')) {
    return {
      name: lower.includes('lombok') ? 'Yogyakarta' : 'Lombok',
      country: 'Indonesia 🇮🇩',
      image: 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?auto=format&fit=crop&w=800&q=80',
      vibeText: '90% match: Tropical scenery, local culture and boutique stays within Indonesia',
      stayText: 'Curated Indonesian Boutique Resort',
    };
  }
  if (country.includes('south korea') || country === 'korea') {
    return {
      name: lower.includes('busan') ? 'Jeju Island' : 'Busan',
      country: 'South Korea 🇰🇷',
      image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
      vibeText: '90% match: Korean culture, cafés, food and visually distinctive neighbourhoods',
      stayText: 'Korea Design Boutique Stay',
    };
  }
  if (country.includes('france')) {
    return {
      name: lower.includes('nice') ? 'Bordeaux' : 'Nice',
      country: 'France 🇫🇷',
      image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=800&q=80',
      vibeText: '89% match: French café culture, architecture and scenic urban experiences',
      stayText: 'French Heritage Boutique Hotel',
    };
  }
  if (country.includes('thailand')) {
    return {
      name: lower.includes('krabi') ? 'Chiang Mai' : 'Krabi',
      country: 'Thailand 🇹🇭',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
      vibeText: '90% match: Distinctive Thai scenery, food, culture and value-oriented stays',
      stayText: 'Thailand Boutique Experience Resort',
    };
  }
  if (country.includes('vietnam')) {
    return {
      name: lower.includes('hoi an') ? 'Da Nang' : 'Hoi An',
      country: 'Vietnam 🇻🇳',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
      vibeText: '90% match: Heritage streets, food culture, cafés and scenic coastal access',
      stayText: 'Vietnam Heritage Boutique Stay',
    };
  }
  if (country.includes('malaysia')) {
    return {
      name: lower.includes('penang') ? 'Langkawi' : 'George Town (Penang)',
      country: 'Malaysia 🇲🇾',
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
      vibeText: '89% match: Food, heritage, tropical scenery and boutique stays within Malaysia',
      stayText: 'Malaysia Curated Boutique Stay',
    };
  }
  if (country.includes('japan')) {
    return {
      name: lower.includes('kyoto') ? 'Kanazawa' : 'Kyoto',
      country: 'Japan 🇯🇵',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      vibeText: '91% match: Traditional streets, food, temples and design-led stays within Japan',
      stayText: 'Japanese Machiya Boutique Stay',
    };
  }
  if (country.includes('italy')) {
    return {
      name: lower.includes('florence') ? 'Verona' : 'Florence',
      country: 'Italy 🇮🇹',
      image: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=800&q=80',
      vibeText: '90% match: Historic streets, food, art and romantic architecture within Italy',
      stayText: 'Italian Historic Centre Boutique Hotel',
    };
  }
  if (country.includes('spain')) {
    return {
      name: lower.includes('valencia') ? 'Seville' : 'Valencia',
      country: 'Spain 🇪🇸',
      image: 'https://images.unsplash.com/photo-1509840841025-9088ba78a826?auto=format&fit=crop&w=800&q=80',
      vibeText: '89% match: Architecture, food, nightlife and walkable neighbourhoods within Spain',
      stayText: 'Spanish Design Boutique Hotel',
    };
  }
  if (country.includes('switzerland')) {
    return {
      name: lower.includes('lucerne') ? 'Interlaken' : 'Lucerne',
      country: 'Switzerland 🇨🇭',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      vibeText: '92% match: Lakes, alpine scenery and scenic rail experiences within Switzerland',
      stayText: 'Swiss Alpine Boutique Hotel',
    };
  }

  // Unknown country: do not cross a border just to fill the card. Keep the
  // alternative explicitly within the detected country and avoid fabricating a foreign place.
  const cleanCountry = sourceCountry?.trim() || 'the same country';
  return {
    name: `Alternative in ${cleanCountry.replace(/\s*[\u{1F1E6}-\u{1F1FF}]{2}\s*/gu, '').trim()}`,
    country: sourceCountry?.trim() || 'Same country',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
    vibeText: 'Same-country alternative selected to preserve the aesthetic without changing countries',
    stayText: 'Comparable boutique stay matched to the original aesthetic',
  };
}

function ensureDistinctSameCountryAlternative(
  exactDestination: string,
  sourceCountry: string | null | undefined,
  alternative: VibeAlternative
): VibeAlternative {
  const norm = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

  if (norm(alternative.name) !== norm(exactDestination)) return alternative;

  const country = (sourceCountry || '').toLowerCase();
  const sameCountryFallbacks: Record<string, string[]> = {
    india: ['Udaipur', 'Varkala', 'Manali', 'Gokarna', 'Jodhpur'],
    indonesia: ['Lombok', 'Yogyakarta', 'Nusa Penida'],
    'south korea': ['Busan', 'Jeju Island', 'Gyeongju'],
    korea: ['Busan', 'Jeju Island', 'Gyeongju'],
    france: ['Nice', 'Bordeaux', 'Lyon'],
    thailand: ['Krabi', 'Chiang Mai', 'Koh Samui'],
    vietnam: ['Hoi An', 'Da Nang', 'Nha Trang'],
    malaysia: ['George Town (Penang)', 'Langkawi', 'Kuala Lumpur'],
    japan: ['Kyoto', 'Kanazawa', 'Osaka'],
    italy: ['Florence', 'Verona', 'Bologna'],
    spain: ['Valencia', 'Seville', 'Granada'],
    switzerland: ['Lucerne', 'Interlaken', 'Zermatt'],
    'united arab emirates': ['Abu Dhabi', 'Ras Al Khaimah', 'Dubai'],
    uae: ['Abu Dhabi', 'Ras Al Khaimah', 'Dubai'],
    singapore: ['Sentosa Island', 'Marina Bay', 'Katong'],
  };

  const key = Object.keys(sameCountryFallbacks).find((k) => country.includes(k));
  const candidates = key ? sameCountryFallbacks[key] : [];
  const replacement = candidates.find((name) => norm(name) !== norm(exactDestination));

  if (!replacement) return alternative;
  return { ...alternative, name: replacement, stayText: `${replacement} Boutique Experience Stay` };
}

export const Screen4MakeItReal: React.FC<Screen4MakeItRealProps> = ({
  analysis,
  destination,
  budgetPerPerson = 35000,
  originCity = 'Delhi',
  onSelectDestination,
  onBack,
}) => {
  const destName = (destination || analysis?.city_or_destination || analysis?.destination || 'Goa').trim();
  const lowerDest = destName.toLowerCase();

  // GUARANTEED DISTINCT ALTERNATIVE DESTINATION FOR "SAME VIBE"
  const sourceCountry = analysis?.country || analysis?.location?.country || null;
  const vibeAlternative = ensureDistinctSameCountryAlternative(
    destName,
    sourceCountry,
    resolveVibeAlternative(destName, sourceCountry, analysis?.travelVibes)
  );

  // Tailored 3-way feasibility data based on detected destination
  let options: FeasibilityOption[] = [];

  if (lowerDest.includes('seoul') || lowerDest.includes('korea')) {
    options = [
      {
        id: 'exact',
        name: 'SEOUL (AS SEEN IN REEL)',
        cleanDestination: 'Seoul',
        country: 'South Korea 🇰🇷',
        subtitle: 'EXACT MATCH',
        badge: '100% INSPIRATION RECREATION',
        matchScore: 100,
        feasibilityScore: 64,
        price: 52400,
        isAboveBudget: 52400 > budgetPerPerson,
        budgetDeltaText: 52400 > budgetPerPerson ? `+₹${(52400 - budgetPerPerson).toLocaleString('en-IN')} over budget` : `Within target budget`,
        image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80',
        flightText: `Connecting / Scheduled flights from ${originCity} (₹23,500 peak fare)`,
        stayText: '5★ Luxury Bukchon Traditional Hanok Villa (₹18,500/night)',
        vibeFidelity: '100% exact locations & private tea house access',
        logisticsScore: `Scheduled flight from ${originCity} • K-ETA in 48h`,
        verdict: 'Exact reel recreation with luxury Hanok stay. High aesthetic fidelity, but requires a budget stretch above your target.',
        whatStayed: [
          'Bukchon Hanok private courtyard villa',
          'Gangnam & Myeongdong luxury dining',
          'Private chauffeured airport limousine',
        ],
        whatAdjusted: [
          'Budget extends to ₹52,400 per person',
          'Peak season airfare premium applied',
        ],
      },
      {
        id: 'vibe',
        name: `${vibeAlternative.name.toUpperCase()} (COASTAL & CAFES)`,
        cleanDestination: vibeAlternative.name,
        country: vibeAlternative.country,
        subtitle: 'SAME AESTHETIC (SAME COUNTRY)',
        badge: `SAME AESTHETIC · SAME COUNTRY · ${vibeAlternative.name.toUpperCase()}`,
        matchScore: 91,
        feasibilityScore: 89,
        price: 27800,
        isAboveBudget: 27800 > budgetPerPerson,
        budgetDeltaText: budgetPerPerson >= 27800 ? `Save ₹${(budgetPerPerson - 27800).toLocaleString('en-IN')} below budget` : `Within budget`,
        image: vibeAlternative.image,
        flightText: `Value flight route from ${originCity} (₹13,800)`,
        stayText: vibeAlternative.stayText,
        vibeFidelity: vibeAlternative.vibeText,
        logisticsScore: `Convenient connection from ${originCity}`,
        verdict: `Captures the identical neon street culture, artisan cafes, and dramatic coastal scenery at 47% lower total cost than central Seoul.`,
        whatStayed: [
          'Identical Korean cafe culture & street food',
          'Vibrant coastal cliff scenery & night markets',
          'High-speed KTX connectivity option',
        ],
        whatAdjusted: [
          `Shifted from Seoul to distinct coastal ${vibeAlternative.name}`,
          'Boutique sea-view hotel instead of private Hanok',
        ],
      },
      {
        id: 'best_fit',
        name: 'SEOUL (SMART VALUE SWEET SPOT)',
        cleanDestination: 'Seoul',
        country: 'South Korea 🇰🇷',
        subtitle: 'BEST FIT · EXACT DESTINATION SMART PLAN ⭐',
        badge: 'MMT FEASIBILITY SWEET SPOT ⭐',
        matchScore: 95,
        feasibilityScore: 97,
        price: Math.min(34200, Math.round(budgetPerPerson * 0.95)),
        isAboveBudget: false,
        isBestFit: true,
        budgetDeltaText: `Within budget (₹${Math.max(0, budgetPerPerson - 34200).toLocaleString('en-IN')} surplus)`,
        image: 'https://images.unsplash.com/photo-1546874177-9e664107314e?auto=format&fit=crop&w=800&q=80',
        flightText: `Smart schedule flight from ${originCity} (₹16,500 smart fare)`,
        stayText: 'Hongdae Design Boutique 4★ (steps to cafes & subway)',
        vibeFidelity: '95% match: Includes Hanok village day pass & photo tour',
        logisticsScore: `Optimal flight route from ${originCity} • K-ETA in 48h`,
        verdict: `The engineered sweet spot: Keeps Seoul, visits the exact Hanok alleys from your inspiration, and pairs flights from ${originCity} with an aesthetic boutique stay inside your ₹${budgetPerPerson.toLocaleString('en-IN')} budget.`,
        whatStayed: [
          'Seoul destination & Bukchon Hanok highlights',
          'Trendy Hongdae cafe & lifestyle district',
          `Flight convenience from ${originCity}`,
        ],
        whatAdjusted: [
          'Curated 4★ design hotel instead of ₹18K/night Hanok',
          'Smart early-bird flight timing saves money',
        ],
      },
    ];
  } else if (lowerDest.includes('bali')) {
    options = [
      {
        id: 'exact',
        name: 'BALI (PRIVATE POOL VILLA)',
        cleanDestination: 'Bali',
        country: 'Indonesia 🇮🇩',
        subtitle: 'EXACT MATCH',
        badge: '100% INSPIRATION RECREATION',
        matchScore: 100,
        feasibilityScore: 61,
        price: 52400,
        isAboveBudget: 52400 > budgetPerPerson,
        budgetDeltaText: 52400 > budgetPerPerson ? `+₹${(52400 - budgetPerPerson).toLocaleString('en-IN')} over budget` : `Within target budget`,
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        flightText: `1-Stop flight from ${originCity} (₹24,800)`,
        stayText: '5★ Luxury Jungle Villa with Private Infinity Pool (The Kayon)',
        vibeFidelity: '100% exact clifftop infinity pool & floating breakfast',
        logisticsScore: `1-Stop connection from ${originCity} • Visa on Arrival`,
        verdict: 'Closest possible version of what you saw in the reel. Sublime luxury, but exceeds your target budget.',
        whatStayed: ['Ubud private infinity pool villa', 'Floating breakfast in villa', 'VIP Cretya day club access'],
        whatAdjusted: ['Requires group budget stretch for 5★ private villa buyout'],
      },
      {
        id: 'vibe',
        name: `${vibeAlternative.name.toUpperCase()} (CLIFF VILLA)`,
        cleanDestination: vibeAlternative.name,
        country: vibeAlternative.country,
        subtitle: 'SAME AESTHETIC (SAME COUNTRY)',
        badge: `SAME AESTHETIC · SAME COUNTRY · ${vibeAlternative.name.toUpperCase()}`,
        matchScore: 89,
        feasibilityScore: 91,
        price: 28500,
        isAboveBudget: 28500 > budgetPerPerson,
        budgetDeltaText: budgetPerPerson >= 28500 ? `Save ₹${(budgetPerPerson - 28500).toLocaleString('en-IN')} below budget` : `Within budget`,
        image: vibeAlternative.image,
        flightText: `Flight route from ${originCity} to ${vibeAlternative.name} (₹13,200)`,
        stayText: vibeAlternative.stayText,
        vibeFidelity: vibeAlternative.vibeText,
        logisticsScore: `Fast connection from ${originCity} • Free Visa on Arrival`,
        verdict: `Delivers the private pool luxury, tropical cliffs, and beach clubs at 45% less cost with a fast route from ${originCity}.`,
        whatStayed: ['Private pool tropical lifestyle', 'Cliffside sea views', 'Vibrant beach clubs & cafes'],
        whatAdjusted: [`Destination shifted from Bali to ${vibeAlternative.name}`, 'Fast flight connection'],
      },
      {
        id: 'best_fit',
        name: 'BALI (SMART VALUE VILLA)',
        cleanDestination: 'Bali',
        country: 'Indonesia 🇮🇩',
        subtitle: 'BEST FIT · EXACT DESTINATION SMART PLAN ⭐',
        badge: 'MMT FEASIBILITY SWEET SPOT ⭐',
        matchScore: 94,
        feasibilityScore: 96,
        price: Math.min(34700, Math.round(budgetPerPerson * 0.95)),
        isAboveBudget: false,
        isBestFit: true,
        budgetDeltaText: `Within budget (₹${Math.max(0, budgetPerPerson - 34700).toLocaleString('en-IN')} surplus)`,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        flightText: `Optimised scheduled flight from ${originCity} (₹16,800)`,
        stayText: '4★ Ubud Boutique Resort with Direct Lagoon Pool Access',
        vibeFidelity: '94% match: Rainforest setting, rice terraces & beach club day pass',
        logisticsScore: `Optimised route from ${originCity} • Visa on Arrival`,
        verdict: `The engineered sweet spot: Keeps Bali, includes jungle infinity pool living and rice terrace visits, while staying strictly within your ₹${budgetPerPerson.toLocaleString('en-IN')} budget.`,
        whatStayed: ['Bali Ubud rainforest destination', 'Pool-access luxury & jungle views', 'Tegalalang rice terraces'],
        whatAdjusted: ['4★ boutique resort pool-suite instead of standalone 5★ villa', 'Smart transit flight timing saves money'],
      },
    ];
  } else if (lowerDest.includes('goa')) {
    options = [
      {
        id: 'exact',
        name: 'GOA (PRIVATE HERITAGE VILLA)',
        cleanDestination: 'Goa',
        country: 'India 🇮🇳',
        subtitle: 'EXACT MATCH',
        badge: '100% INSPIRATION RECREATION',
        matchScore: 100,
        feasibilityScore: 72,
        price: 44500,
        isAboveBudget: 44500 > budgetPerPerson,
        budgetDeltaText: 44500 > budgetPerPerson ? `+₹${(44500 - budgetPerPerson).toLocaleString('en-IN')} over budget` : `Within target budget`,
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
        flightText: `Direct / non-stop from ${originCity} to Goa MOPA (₹8,200)`,
        stayText: 'Private 4-BHK Portuguese Heritage Pool Villa in Assagao (₹24,000/night)',
        vibeFidelity: '100% exact Assagao heritage aesthetic & private pool',
        logisticsScore: `Direct route from ${originCity} • Domestic ease`,
        verdict: 'Full private villa buyout in trending Assagao. Exclusive luxury, but extends budget for private buyout.',
        whatStayed: ['Private pool Portuguese villa', 'Assagao trendy culinary belt', 'Private chauffeur SUV'],
        whatAdjusted: ['Requires budget stretch for private villa buyout'],
      },
      {
        id: 'vibe',
        name: `${vibeAlternative.name.toUpperCase()} (CLIFF BEACH SUITES)`,
        cleanDestination: vibeAlternative.name,
        country: vibeAlternative.country,
        subtitle: 'SAME AESTHETIC (SAME COUNTRY)',
        badge: `SAME AESTHETIC · SAME COUNTRY · ${vibeAlternative.name.toUpperCase()}`,
        matchScore: 93,
        feasibilityScore: 92,
        price: 21500,
        isAboveBudget: 21500 > budgetPerPerson,
        budgetDeltaText: budgetPerPerson >= 21500 ? `Save ₹${(budgetPerPerson - 21500).toLocaleString('en-IN')} below budget` : `Within budget`,
        image: vibeAlternative.image,
        flightText: `Flight from ${originCity} to nearby hub + Scenic Coastal Cab (₹8,500)`,
        stayText: vibeAlternative.stayText,
        vibeFidelity: vibeAlternative.vibeText,
        logisticsScore: `Flight from ${originCity} + coastal drive • Domestic ease`,
        verdict: `Pure bohemian coastal magic without North Goa commercial crowds at 38% lower total cost.`,
        whatStayed: ['Cliffside sunset ocean vistas', 'Bohemian beach cafe culture', 'Tranquil coastal living'],
        whatAdjusted: [`Shifted to pristine ${vibeAlternative.name} coastline`],
      },
      {
        id: 'best_fit',
        name: 'GOA (NORTH GOA BOUTIQUE)',
        cleanDestination: 'Goa',
        country: 'India 🇮🇳',
        subtitle: 'BEST FIT · EXACT DESTINATION SMART PLAN ⭐',
        badge: 'MMT FEASIBILITY SWEET SPOT ⭐',
        matchScore: 96,
        feasibilityScore: 98,
        price: Math.min(28800, Math.round(budgetPerPerson * 0.95)),
        isAboveBudget: false,
        isBestFit: true,
        budgetDeltaText: `Within budget (₹${Math.max(0, budgetPerPerson - 28800).toLocaleString('en-IN')} surplus)`,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
        flightText: `Direct non-stop flight from ${originCity} to Goa MOPA (₹6,800)`,
        stayText: '4★ Anjuna Heritage Boutique Resort with Pool Access',
        vibeFidelity: '96% match: Walk to cafes, sunset beach clubs & Latin quarter',
        logisticsScore: `Direct route from ${originCity} • Instant domestic trip`,
        verdict: `The sweet spot: Stay in North Goa, enjoy heritage architecture and beach clubs, strictly within your ₹${budgetPerPerson.toLocaleString('en-IN')} budget.`,
        whatStayed: ['North Goa prime location (Anjuna / Vagator)', 'Portuguese heritage aesthetic & pool access', `Direct flight convenience from ${originCity}`],
        whatAdjusted: ['Boutique heritage room instead of entire private villa buyout'],
      },
    ];
  } else {
    // Dynamic universal fallback calibrated to user inputs and guaranteed distinct Same Vibe
    const exactPrice = Math.max(22000, Math.round(budgetPerPerson * 1.38));
    const vibePrice = Math.max(15000, Math.round(budgetPerPerson * 0.78));
    const smartPrice = Math.max(18000, Math.round(budgetPerPerson * 0.94));

    options = [
      {
        id: 'exact',
        name: `${destName.toUpperCase()} (AS SEEN IN REEL)`,
        cleanDestination: destName,
        country: analysis?.country || 'Travel Destination',
        subtitle: 'EXACT MATCH',
        badge: '100% INSPIRATION RECREATION',
        matchScore: 100,
        feasibilityScore: 66,
        price: exactPrice,
        isAboveBudget: exactPrice > budgetPerPerson,
        budgetDeltaText: exactPrice > budgetPerPerson ? `+₹${(exactPrice - budgetPerPerson).toLocaleString('en-IN')} over budget` : `Within target budget`,
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
        flightText: `Full-service flight route (${originCity} ⇄ ${destName})`,
        stayText: `5-Star Luxury Landmark Property in ${destName}`,
        vibeFidelity: '100% exact locations & premium VIP access',
        logisticsScore: `Direct / optimal route from ${originCity}`,
        verdict: `Faithful recreation of all highlights from the inspiration in ${destName}. Demands premium budget extension.`,
        whatStayed: [`Exact ${destName} destination & sights`, '5-star premier stay tier'],
        whatAdjusted: ['Priced at premium tier above budget'],
      },
      {
        id: 'vibe',
        name: `${vibeAlternative.name.toUpperCase()} (CURATED VIBE)`,
        cleanDestination: vibeAlternative.name,
        country: vibeAlternative.country,
        subtitle: 'SAME AESTHETIC (SAME COUNTRY)',
        badge: `SAME AESTHETIC · SAME COUNTRY · ${vibeAlternative.name.toUpperCase()}`,
        matchScore: 90,
        feasibilityScore: 90,
        price: vibePrice,
        isAboveBudget: vibePrice > budgetPerPerson,
        budgetDeltaText: budgetPerPerson >= vibePrice ? `Save ₹${(budgetPerPerson - vibePrice).toLocaleString('en-IN')} below budget` : `Within budget`,
        image: vibeAlternative.image,
        flightText: `Value connection flight (${originCity} ⇄ ${vibeAlternative.name})`,
        stayText: vibeAlternative.stayText,
        vibeFidelity: vibeAlternative.vibeText,
        logisticsScore: `Efficient travel route from ${originCity}`,
        verdict: `Captures the same atmosphere and experiences in ${vibeAlternative.name} with intelligent accommodation selection at a much lower cost.`,
        whatStayed: ['Core sensory vibes & activities', 'Comfortable transfers'],
        whatAdjusted: [`Distinct destination shifted to ${vibeAlternative.name}`, 'Boutique 4-star tier instead of ultra-luxury'],
      },
      {
        id: 'best_fit',
        name: `${destName.toUpperCase()} (SMART VALUE SWEET SPOT)`,
        cleanDestination: destName,
        country: analysis?.country || 'Travel Destination',
        subtitle: `BEST FIT · ${destName.toUpperCase()} BUDGET-OPTIMIZED ⭐`,
        badge: 'MMT FEASIBILITY SWEET SPOT ⭐',
        matchScore: 95,
        feasibilityScore: 97,
        price: smartPrice,
        isAboveBudget: false,
        isBestFit: true,
        budgetDeltaText: `Within budget (₹${Math.max(0, budgetPerPerson - smartPrice).toLocaleString('en-IN')} surplus)`,
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
        flightText: `Smart schedule flight (${originCity} ⇄ ${destName})`,
        stayText: `Top-rated 4★ Central Boutique Hotel in ${destName} (MMT Assured)`,
        vibeFidelity: `95% match with top ${destName} reel highlights included`,
        logisticsScore: `Fastest direct travel window from ${originCity}`,
        verdict: `Optimized flight timing from ${originCity} and verified MMT Assured hotel keep the full ${destName} trip strictly inside budget.`,
        whatStayed: [`Exact ${destName} destination & reel highlights`, 'Central location convenience'],
        whatAdjusted: ['Smart airfare timing & verified boutique stay'],
      },
    ];
  }

  const [selectedId, setSelectedId] = useState<'exact' | 'vibe' | 'best_fit'>(
    options[2]?.id || 'best_fit'
  );

  const selectedOpt = options.find((o) => o.id === selectedId) || options[2] || options[0];

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-10">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#008CFF] transition-colors cursor-pointer"
      >
        <span>← Back to Inspiration & Reality Check</span>
      </button>

      {/* Hero Feasibility Engine Container */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
        {/* HERO TITLE & ENGINE BRANDING */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-[#008CFF] text-white text-[11px] font-black tracking-wider uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>MakeMyTrip Feasibility Engine™</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            The Feasibility Verdict
          </h1>
          <p className="text-xs text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
            TripSpark tested your social inspiration against real flight routes from{' '}
            <span className="font-bold text-slate-800">{originCity}</span>, live hotel tiers, and your{' '}
            <span className="font-bold text-slate-800">₹{budgetPerPerson.toLocaleString('en-IN')}/person</span> budget.
          </p>
        </div>

        {/* FEASIBILITY ENGINE REAL-TIME SIMULATION HUD */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0A142F] to-[#0D285E] text-white border border-blue-400/20 shadow-inner space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-blue-200 border-b border-white/10 pb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>MakeMyTrip Feasibility Engine Status</span>
            </span>
            <span className="text-[10px] text-amber-300 font-black uppercase tracking-wider">
              3 Realistic Pathways Found
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
            <div className="bg-white/10 rounded-xl p-2">
              <span className="text-slate-300 block">Flight Routes</span>
              <span className="font-bold text-white text-[11px] truncate block">{originCity} Routes Verified</span>
            </div>
            <div className="bg-white/10 rounded-xl p-2">
              <span className="text-slate-300 block">Stays Matched</span>
              <span className="font-bold text-white text-[11px]">Boutique & Hanok</span>
            </div>
            <div className="bg-white/10 rounded-xl p-2">
              <span className="text-slate-300 block">Target Budget</span>
              <span className="font-bold text-emerald-300 text-[11px]">₹{(budgetPerPerson / 1000).toFixed(0)}K / person</span>
            </div>
            <div className="bg-white/10 rounded-xl p-2">
              <span className="text-slate-300 block">Travel Season</span>
              <span className="font-bold text-amber-300 text-[11px]">Peak Foliage / Sun</span>
            </div>
          </div>
        </div>

        {/* COMPARISON INSTRUCTION */}
        <div className="text-center pt-1">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
            Compare The 3 Pathways Below • Tap To Select
          </span>
        </div>

        {/* THE TRI-OPTION FEASIBILITY COMPARISON CARDS */}
        <div className="space-y-3.5">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedId(opt.id)}
                className={`rounded-2xl border-2 transition-all cursor-pointer overflow-hidden relative ${
                  isSelected
                    ? opt.isBestFit
                      ? 'border-[#008CFF] bg-blue-50/40 ring-4 ring-blue-500/15 shadow-lg'
                      : 'border-slate-800 bg-slate-50/60 ring-2 ring-slate-400/20 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs'
                }`}
              >
                {/* Top Badge Banner */}
                <div
                  className={`px-3.5 py-1.5 flex items-center justify-between text-[10px] font-black uppercase tracking-wider ${
                    opt.isBestFit
                      ? 'bg-gradient-to-r from-[#008CFF] to-[#0052CC] text-white'
                      : opt.id === 'exact'
                      ? 'bg-slate-800 text-slate-100'
                      : 'bg-emerald-700 text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {opt.isBestFit && <Star className="w-3 h-3 fill-amber-300 text-amber-300" />}
                    <span>{opt.badge}</span>
                  </span>
                  <span className="font-black">
                    Feasibility: {opt.feasibilityScore}/100
                  </span>
                </div>

                {/* Card Main Body */}
                <div className="p-3.5 sm:p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Photo Thumbnail */}
                      <img
                        src={opt.image}
                        alt={opt.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-slate-200 shadow-2xs"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
                          {opt.subtitle}
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                          {opt.cleanDestination}
                        </h3>
                        <p className="text-[11px] font-bold text-[#008CFF] mt-0.5">
                          {opt.country}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                            🎯 {opt.matchScore}% Match
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Budget Delta Tag */}
                    <div className="text-right shrink-0">
                      <div className="text-base sm:text-xl font-black text-slate-900">
                        ₹{opt.price.toLocaleString('en-IN')}
                        <span className="text-[10px] font-normal text-slate-500 block sm:inline"> / person</span>
                      </div>
                      <div className="mt-1">
                        {opt.isAboveBudget ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>{opt.budgetDeltaText}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{opt.budgetDeltaText}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Feasibility Breakdown Ticker */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] space-y-1.5">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-semibold flex items-center gap-1 text-slate-500">
                        <Plane className="w-3 h-3 text-[#008CFF]" /> Flights:
                      </span>
                      <span className="font-bold text-slate-800 text-right truncate max-w-[260px]">
                        {opt.flightText}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-semibold flex items-center gap-1 text-slate-500">
                        <Building2 className="w-3 h-3 text-emerald-600" /> Stay:
                      </span>
                      <span className="font-bold text-slate-800 text-right truncate max-w-[260px]">
                        {opt.stayText}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-semibold flex items-center gap-1 text-slate-500">
                        <Compass className="w-3 h-3 text-purple-600" /> Vibe:
                      </span>
                      <span className="font-bold text-slate-800 text-right truncate max-w-[260px]">
                        {opt.vibeFidelity}
                      </span>
                    </div>
                  </div>

                  {/* Feasibility Reality Check Verdict */}
                  <div className="text-[11px] text-slate-600 leading-relaxed font-medium bg-white/80 p-2 rounded-lg border border-slate-100">
                    <span className="font-black text-slate-800 mr-1">Reality Verdict:</span>
                    {opt.verdict}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SIDE-BY-SIDE QUICK COMPARISON MATRIX */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#008CFF]" />
              <span>Feasibility Comparison Matrix</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-semibold">MMT Engine Matrix</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold">
                  <th className="py-1.5 pr-2">Metric</th>
                  <th className="py-1.5 px-2">Exact Match</th>
                  <th className="py-1.5 px-2">Same Vibe</th>
                  <th className="py-1.5 pl-2 text-[#008CFF]">Best Fit ⭐</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-1.5 font-bold text-slate-900 pr-2">Total / Person</td>
                  <td className="py-1.5 px-2 font-bold text-amber-700">₹{options[0]?.price.toLocaleString('en-IN')}</td>
                  <td className="py-1.5 px-2 font-bold text-emerald-700">₹{options[1]?.price.toLocaleString('en-IN')}</td>
                  <td className="py-1.5 pl-2 font-black text-[#008CFF]">₹{options[2]?.price.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-bold text-slate-900 pr-2">Budget Delta</td>
                  <td className="py-1.5 px-2 text-amber-700 font-semibold">+₹{(options[0]?.price - budgetPerPerson).toLocaleString('en-IN')} Gap</td>
                  <td className="py-1.5 px-2 text-emerald-700 font-semibold">Save ₹{(budgetPerPerson - options[1]?.price).toLocaleString('en-IN')}</td>
                  <td className="py-1.5 pl-2 text-emerald-700 font-bold">✅ In Budget</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-bold text-slate-900 pr-2">Vibe Match %</td>
                  <td className="py-1.5 px-2">100% Exact</td>
                  <td className="py-1.5 px-2">91% Equivalent</td>
                  <td className="py-1.5 pl-2 font-bold text-slate-900">95% Optimised</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-bold text-slate-900 pr-2">Feasibility Score</td>
                  <td className="py-1.5 px-2 text-slate-600 font-bold">{options[0]?.feasibilityScore}/100</td>
                  <td className="py-1.5 px-2 text-slate-600 font-bold">{options[1]?.feasibilityScore}/100</td>
                  <td className="py-1.5 pl-2 font-black text-emerald-700">{options[2]?.feasibilityScore}/100 ⭐</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* WHY THIS RECOMMENDATION? */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 uppercase tracking-wider">
            <Info className="w-3.5 h-3.5 text-[#008CFF]" />
            <span>Why MakeMyTrip Recommends {selectedOpt.name}?</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {selectedOpt.id === 'best_fit' && (
              <>
                <strong>Best Fit is our highest-rated feasibility recommendation</strong> because it preserves the exact destination and aesthetic highlights from your inspiration, while eliminating unnecessary hotel and peak-airfare markups. You get direct flights and verified 4★ boutique accommodations within your ₹{budgetPerPerson.toLocaleString('en-IN')} budget.
              </>
            )}
            {selectedOpt.id === 'exact' && (
              <>
                <strong>Exact Match recreates the pristine social reel experience</strong> with zero compromise on the 5-star private villa/Hanok property. This is ideal if your travel group is ready to stretch the budget by ₹{(selectedOpt.price - budgetPerPerson).toLocaleString('en-IN')} per person for ultimate luxury.
              </>
            )}
            {selectedOpt.id === 'vibe' && (
              <>
                <strong>Same Aesthetic keeps you in the same country</strong> while shifting to a different destination with a similar visual and experiential feel. It preserves the inspiration while giving you another realistic option within the same country.
              </>
            )}
          </p>
        </div>

        {/* ILLUSTRATIVE PRICING DISCLAIMER */}
        <div className="p-2.5 rounded-xl bg-slate-100/80 border border-slate-200/60 text-center">
          <p className="text-[10px] text-slate-500 font-medium">
            ⚡ <strong>Prototype Demonstration:</strong> All flight and package rates are illustrative dynamic estimates calibrated to your chosen constraints. Final booking rates are locked via MakeMyTrip booking engine.
          </p>
        </div>

        {/* PRIMARY ACTION BUTTON */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() =>
              onSelectDestination(
                selectedOpt.cleanDestination,
                selectedOpt.id,
                Math.round(selectedOpt.price)
              )
            }
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#E55A00] hover:brightness-105 active:scale-[0.99] text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>LOCK {selectedOpt.cleanDestination.toUpperCase()} & VIEW BOOKING-READY TRIP</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
