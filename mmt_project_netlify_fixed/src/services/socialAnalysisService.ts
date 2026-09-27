import {
  InspirationDemo,
  InspirationSource,
  AnalysisEvidence,
  GeminiAnalysisResult,
  AnalysisState,
  TripStrategyOption,
  DayPlan,
  PriceSavingItem,
  RouteComparisonOption,
} from '../types';
import { DEMO_INSPIRATIONS } from '../data/demoData';

// Normalized URL extraction
export function normalizeSocialUrl(rawUrl: string): {
  valid: boolean;
  platform: string;
  contentType: string;
  contentId: string;
  normalisedUrl: string;
} {
  try {
    const trimmed = rawUrl.trim();
    if (!trimmed) {
      return {
        valid: false,
        platform: 'Unknown',
        contentType: 'Unknown',
        contentId: '',
        normalisedUrl: '',
      };
    }

    const urlObj = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);

    if (urlObj.hostname.includes('instagram.com')) {
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      let contentType = 'Post';
      let contentId = '';
      if (pathParts[0] === 'reel' || pathParts[0] === 'reels') {
        contentType = 'Reel';
        contentId = pathParts[1] || '';
      } else if (pathParts[0] === 'p') {
        contentType = 'Post';
        contentId = pathParts[1] || '';
      }
      const canonicalPath = contentId ? `/reel/${contentId}/` : urlObj.pathname;
      return {
        valid: true,
        platform: 'Instagram',
        contentType,
        contentId,
        normalisedUrl: `https://www.instagram.com${canonicalPath}`,
      };
    }

    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let contentType = 'Video';
      let contentId = '';
      if (urlObj.pathname.includes('/shorts/')) {
        contentType = 'Short';
        contentId = urlObj.pathname.split('/shorts/')[1]?.split('/')[0] || '';
      } else if (urlObj.searchParams.get('v')) {
        contentId = urlObj.searchParams.get('v') || '';
      } else {
        contentId = urlObj.pathname.replace('/', '');
      }
      return {
        valid: true,
        platform: 'YouTube',
        contentType,
        contentId,
        normalisedUrl: urlObj.href,
      };
    }

    return {
      valid: true,
      platform: 'Web',
      contentType: 'Link',
      contentId: '',
      normalisedUrl: urlObj.href,
    };
  } catch {
    return {
      valid: false,
      platform: 'Unknown',
      contentType: 'Unknown',
      contentId: '',
      normalisedUrl: rawUrl,
    };
  }
}

// Call server-side link analysis API
export async function analyzeUrlWithServer(url: string): Promise<{
  success: boolean;
  evidence: AnalysisEvidence;
  aiAnalysis?: GeminiAnalysisResult;
  mediaRestricted: boolean;
  message?: string;
}> {
  try {
    const res = await fetch('/api/analyze-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    const data = await res.json();
    const isSuccess = Boolean(data.success);
    const analysisObj = data.aiAnalysis || data.analysis;
    const hasVisual = Boolean(data.actualMediaAvailable || (analysisObj && data.contentAccessStatus !== 'unaccessible'));
    const hasText = Boolean(data.hasUsefulTextEvidence || (analysisObj?.evidence && analysisObj.evidence.length > 0) || data.description);

    return {
      success: isSuccess,
      evidence: {
        sourceUrl: data.sourceUrl || url,
        normalisedUrl: data.normalisedUrl || url,
        platform: data.platform || 'Instagram',
        contentType: data.contentType || 'Reel',
        contentId: data.contentId || '',
        captionText: data.captionText || data.description,
        pageTitle: data.pageTitle,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        hasUsefulTextEvidence: hasText,
        hasUsefulVisualEvidence: hasVisual,
        mediaRestricted: data.mediaRestricted ?? !isSuccess,
      },
      aiAnalysis: analysisObj,
      mediaRestricted: data.mediaRestricted ?? !isSuccess,
      message: data.message,
    };
  } catch (error: any) {
    console.warn('Fallback: Server fetch error in analyzeUrlWithServer', error);
    // Return restricted state so user is prompted for media, NOT fallback to Bali!
    const normalized = normalizeSocialUrl(url);
    return {
      success: false,
      evidence: {
        sourceUrl: url,
        normalisedUrl: normalized.normalisedUrl,
        platform: normalized.platform,
        contentType: normalized.contentType,
        contentId: normalized.contentId,
        hasUsefulTextEvidence: false,
        hasUsefulVisualEvidence: false,
        mediaRestricted: true,
      },
      mediaRestricted: true,
      message: 'Instagram is limiting access to the Reel visuals.',
    };
  }
}

// Call server-side media analysis API (Screenshots / Uploads) with strict 20s timeout
export async function analyzeMediaWithServer(
  mediaBase64: string,
  mimeType: string,
  caption?: string,
  originalUrl?: string
): Promise<{
  success: boolean;
  analysis?: GeminiAnalysisResult;
  error?: string;
  isTimeout?: boolean;
  analysisTimeMs?: number;
  imageSentToGemini: boolean;
}> {
  const startTime = Date.now();
  const controller = new AbortController();
  // 20-second timeout guarantee
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch('/api/analyze-media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        mediaBase64,
        mimeType,
        caption,
        originalUrl,
      }),
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Media analysis failed with status ${res.status}`);
    }

    const data = await res.json();
    return {
      success: true,
      analysis: data.analysis,
      analysisTimeMs: Date.now() - startTime,
      imageSentToGemini: true,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.error('analyzeMediaWithServer error:', err);
    const isTimeout = err.name === 'AbortError' || err.message?.includes('aborted');
    return {
      success: false,
      isTimeout,
      error: isTimeout
        ? 'Analysis timed out after 20 seconds. Please try again or enter the destination manually.'
        : err.message || 'Media analysis failed',
      analysisTimeMs: Date.now() - startTime,
      imageSentToGemini: true,
    };
  }
}

// Helper to generate comprehensive MMT travel options dynamically for ANY confirmed destination
export function buildDynamicDestinationExperience(
  destination: string,
  country: string = 'India',
  experiences: string[] = ['Beach', 'Sunset', 'Nightlife', 'Coastal Stay', 'Food'],
  vibes: string[] = ['Relaxed', 'Tropical', 'Social'],
  origin: string = 'Delhi',
  budgetPerPerson: number = 25000,
  travellerCount: number = 2,
  dates: string = '15–19 November'
): {
  recreateOption: TripStrategyOption;
  budgetOption: TripStrategyOption;
  vibeOption: TripStrategyOption;
  blueprint: DayPlan[];
  savings: PriceSavingItem[];
  routeComparisons: RouteComparisonOption[];
  detectedTags: string[];
} {
  const lowerDest = (destination || '').toLowerCase();
  const isBangalore = lowerDest.includes('bangalore') || lowerDest.includes('bengaluru');
  const isManali = lowerDest.includes('manali');
  const isGoa = lowerDest.includes('goa');
  const isSeoul = lowerDest.includes('seoul') || lowerDest.includes('korea');
  const isDomestic = country.toLowerCase() === 'india' || isGoa || isBangalore || isManali;

  const recreateCost = Math.round(budgetPerPerson * 1.32);
  const budgetCost = Math.round(budgetPerPerson * 0.78);
  const vibeCost = Math.round(budgetPerPerson * 0.88);

  let heroImage = 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80';
  let budgetImage = 'https://images.unsplash.com/photo-1582650625119-3a31f841807d?auto=format&fit=crop&w=800&q=80';
  let vibeDest = 'Gokarna';
  let vibeImage = 'https://images.unsplash.com/photo-1600255821058-c4f89958d700?auto=format&fit=crop&w=800&q=80';

  let stayTitle = `5-Star Luxury Stay in ${destination}`;
  let budgetStayTitle = `4-Star Boutique Hotel in ${destination}`;
  let vibeStayTitle = `Scenic Eco-Resort in ${vibeDest}`;

  if (isSeoul) {
    heroImage = 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80';
    budgetImage = 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800&q=80';
    vibeDest = 'Busan';
    vibeImage = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80';
    stayTitle = `5-Star Luxury Hanok / Modern Suite in Gangnam, Seoul`;
    budgetStayTitle = `Chic Boutique Design Hotel in Hongdae / Myeongdong, Seoul`;
    vibeStayTitle = `Oceanfront Luxury Boutique Hotel in Haeundae, Busan`;
  } else if (isBangalore) {
    heroImage = 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80';
    budgetImage = 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80';
    vibeDest = 'Mysuru';
    vibeImage = 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=800&q=80';
    stayTitle = `Curated Luxury Suites in Indiranagar / MG Road, Bengaluru`;
    budgetStayTitle = `Chic Boutique Stay near Koramangala Cafe Strip`;
    vibeStayTitle = `Royal Heritage Hotel in ${vibeDest}`;
  } else if (isManali) {
    heroImage = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80';
    budgetImage = 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80';
    vibeDest = 'Kasol';
    vibeImage = 'https://images.unsplash.com/photo-1586016413664-864c0dd76f53?auto=format&fit=crop&w=800&q=80';
    stayTitle = `Valley-Facing Luxury Pine Chalet in Old Manali`;
    budgetStayTitle = `Cosy Mountain Wood Cottage with Balcony Views`;
    vibeStayTitle = `Riverside Alpine Retreat in ${vibeDest}`;
  } else if (isGoa) {
    heroImage = 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80';
    budgetImage = 'https://images.unsplash.com/photo-1582650625119-3a31f841807d?auto=format&fit=crop&w=800&q=80';
    vibeDest = 'Gokarna';
    vibeImage = 'https://images.unsplash.com/photo-1600255821058-c4f89958d700?auto=format&fit=crop&w=800&q=80';
    stayTitle = `5-Star Beachfront Luxury Resort in ${destination}`;
    budgetStayTitle = `4-Star Boutique Poolside Resort in ${destination}`;
    vibeStayTitle = `Cliffside Ocean View Eco Resort in ${vibeDest}`;
  }

  const recreateOption: TripStrategyOption = {
    type: 'recreate',
    title: 'RECREATE IT',
    subtitle: 'Closest possible version of what you saw in the Reel.',
    destination,
    badge: '100% inspiration match',
    duration: '4 Days / 3 Nights',
    highlights: [
      stayTitle,
      `Fastest direct flights from ${origin}`,
      'Private dedicated chauffeured cab for all transfers & venue hopping',
      'VIP reservations at trending venues and restaurants seen in the Reel',
    ],
    costPerPerson: recreateCost,
    groupTotal: recreateCost * travellerCount,
    budgetDifference: (recreateCost - budgetPerPerson) * travellerCount,
    matchScore: 100,
    stayType: stayTitle,
    flightType: `Fastest Direct Flight from ${origin}`,
    transferType: 'Private chauffeured AC Sedan / SUV for whole trip',
    experienceLevel: 'Full VIP experience with confirmed reservations',
    heroImage,
    whatStayed: [
      `${destination} exact location`,
      'Signature nightlife and dining reservations',
      'Original ambiance and venues from the creator Reel',
      'Premium comfort and zero compromise',
    ],
    whatChanged: [
      `Prime departure schedules from ${origin}`,
      'Peak season weekend tariff adjustment',
    ],
  };

  const budgetOption: TripStrategyOption = {
    type: 'budget',
    title: 'DO IT FOR LESS',
    subtitle: `Same ${destination} vibe, engineered for your budget.`,
    destination,
    badge: `Save ₹${(recreateCost - budgetCost).toLocaleString('en-IN')}/person`,
    duration: '4 Days / 3 Nights',
    highlights: [
      budgetStayTitle,
      'Smart departure flight timing saving ₹2,800/seat',
      'Pre-booked verified app cabs & local transport package',
      'Handpicked high-rated dining spots with identical vibe but no cover fees',
    ],
    costPerPerson: budgetCost,
    groupTotal: budgetCost * travellerCount,
    budgetDifference: (budgetCost - budgetPerPerson) * travellerCount,
    matchScore: 88,
    stayType: budgetStayTitle,
    flightType: `Smart Flight / Superfast Express route`,
    transferType: 'Airport transfer + flexible on-demand local cabs',
    experienceLevel: 'Independent exploration & top-rated food trails',
    heroImage: budgetImage,
    whatStayed: [
      `Same ${destination} atmosphere & neighborhoods`,
      'Top-rated boutique stay with breakfast',
      'Key sunset viewpoints, cafes, and nightlife spots',
    ],
    whatChanged: [
      'Boutique hotel 10 mins from prime strip',
      'Smart departure flight timings',
      'On-demand local cabs instead of 24x7 chauffeur',
    ],
  };

  const vibeOption: TripStrategyOption = {
    type: 'vibe',
    title: 'MATCH THE VIBE',
    subtitle: `Equivalent atmosphere in ${vibeDest} for lower overall cost.`,
    destination: vibeDest,
    badge: 'Alternative Vibe Match',
    duration: '4 Days / 3 Nights',
    highlights: [
      vibeStayTitle,
      'Uncrowded scenic landscapes with authentic local character',
      'Direct connectivity via flight/train combo',
      'Significant savings on stays, activities, and dining',
    ],
    costPerPerson: vibeCost,
    groupTotal: vibeCost * travellerCount,
    budgetDifference: (vibeCost - budgetPerPerson) * travellerCount,
    matchScore: 84,
    stayType: vibeStayTitle,
    flightType: `Direct transfer from nearest hub`,
    transferType: 'Local verified private transport',
    experienceLevel: 'Authentic local culture, nature, and dining',
    heroImage: vibeImage,
    whatStayed: [
      'Same travel vibe, food trails, and scenic charm',
      'Cafe hopping and ambient music culture',
      'High-quality boutique stay with great views',
    ],
    whatChanged: [
      `Shifted destination to ${vibeDest}`,
      'Less tourist congestion and better value per rupee',
    ],
  };

  const blueprint: DayPlan[] = [
    {
      dayNumber: 1,
      title: `Arrival in ${destination} & Check-in`,
      items: [
        {
          time: '11:30 AM',
          activity: `Arrive in ${destination}, chauffeured transfer to hotel`,
          icon: '🚖',
          componentCost: 1200,
          activityType: 'transfer',
          description: 'Smooth airport pickup via MakeMyTrip pre-booked verified cab.',
        },
        {
          time: '01:00 PM',
          activity: `Check-in at ${budgetStayTitle.slice(0, 35)}...`,
          icon: '🏡',
          componentCost: 4500,
          activityType: 'stay',
          description: 'Relaxed check-in with curated welcome amenities.',
        },
        {
          time: '07:30 PM',
          activity: isBangalore
            ? 'Indiranagar Craft Brewery & Rooftop Dinner'
            : isManali
            ? 'Old Manali Riverside Cafe & Bonfire'
            : 'Sunset Beach Shack & Golden Hour Dining',
          icon: '✨',
          componentCost: 2200,
          activityType: 'dining',
          description: 'Trending hotspot as featured in the inspiration content.',
        },
      ],
    },
    {
      dayNumber: 2,
      title: isBangalore
        ? 'City Vibe, Cafe Hopping & Nightlife'
        : isManali
        ? 'Snow Valley Adventure & Cedar Forest Walk'
        : 'Beach Hopping, Water Sports & Sunset Lounges',
      items: [
        {
          time: '10:00 AM',
          activity: isBangalore
            ? 'Specialty Coffee Trail & Art District'
            : isManali
            ? 'Solang Valley Scenic Cable Car & Vistas'
            : 'Coastal Walk & Water Sports Bay',
          icon: isBangalore ? '☕' : isManali ? '🏔️' : '🏄‍♂️',
          componentCost: 1800,
          activityType: 'sightseeing',
          description: 'Core daytime highlight matching the travel aesthetic.',
        },
        {
          time: '08:30 PM',
          activity: isBangalore
            ? 'Curated Cocktail Bar & Music Lounge'
            : isManali
            ? 'Tasting Local Trout & Craft Warmers'
            : 'Beach Club Live Acoustic Session',
          icon: '🌙',
          componentCost: 2400,
          activityType: 'leisure',
          description: 'Signature evening experience with prime table reservation.',
        },
      ],
    },
    {
      dayNumber: 3,
      title: 'Hidden Gems & Leisure Immersion',
      items: [
        {
          time: '11:00 AM',
          activity: isBangalore
            ? 'Cubbon Park Walk & Bangalore Palace Heritage'
            : isManali
            ? 'Jogini Waterfall Trek & Vashisht Hot Springs'
            : 'Colonial Latin Quarter / Heritage Walk',
          icon: '🏛️',
          componentCost: 1200,
          activityType: 'sightseeing',
          description: 'Iconic photography spots and cultural walk.',
        },
        {
          time: '06:00 PM',
          activity: 'Panoramic Sunset Spot & Farewell Dinner',
          icon: '🌅',
          componentCost: 2000,
          activityType: 'dining',
          description: 'Unwind with panoramic views and regional cuisine.',
        },
      ],
    },
    {
      dayNumber: 4,
      title: 'Souvenir Pickups & Return Journey',
      items: [
        {
          time: '10:30 AM',
          activity: 'Brunch & Local Market Souvenirs',
          icon: '🥞',
          componentCost: 800,
          activityType: 'dining',
        },
        {
          time: '02:30 PM',
          activity: `Transfer to Airport/Station back to ${origin}`,
          icon: '✈️',
          componentCost: 1200,
          activityType: 'transfer',
        },
      ],
    },
  ];

  const savings: PriceSavingItem[] = [
    {
      id: 'save-weekday',
      title: 'Shift Dates by 2 Days (Midweek Savings)',
      description: `Avoid weekend hotel tariff surges in ${destination}.`,
      savingPerPerson: 3500,
      applied: false,
      category: 'dates',
    },
    {
      id: 'save-flight-early',
      title: 'Smart Flight Departure Window',
      description: `Fly on early morning timing from ${origin} to save up to 25% on airfare.`,
      savingPerPerson: 2200,
      applied: false,
      category: 'flight',
    },
    {
      id: 'save-villa-split',
      title: 'Group Room or Suite Combo',
      description: 'Opt for connected rooms or 2-bedroom suite for maximum value.',
      savingPerPerson: 2800,
      applied: false,
      category: 'hotel',
    },
  ];

  const routeComparisons: RouteComparisonOption[] = [
    {
      id: 'opt-flight',
      name: `Direct Flight (${origin} → ${destination})`,
      mode: 'flight',
      label: 'Fastest',
      pricePerPerson: isDomestic ? 5400 : 18500,
      durationText: isDomestic ? '2h 15m' : '4h 50m',
      stopsText: 'Non-stop Direct',
      operator: 'IndiGo / Air India',
    },
    {
      id: 'opt-train',
      name: `Premium Express / Vande Bharat`,
      mode: 'train',
      label: 'Balanced',
      pricePerPerson: 2100,
      durationText: '8h 15m',
      stopsText: 'Direct connectivity',
      operator: 'IRCTC Premium Express',
    },
    {
      id: 'opt-bus',
      name: `MMT Assured Intercity AC Sleeper`,
      mode: 'bus',
      label: 'Cheapest',
      pricePerPerson: 1350,
      durationText: '11h 30m',
      stopsText: 'Overnight route',
      operator: 'MMT Assured Volvo',
    },
  ];

  const detectedTags = experiences.map((e) => `✨ ${e}`).concat(vibes.map((v) => `🌊 ${v}`));

  return {
    recreateOption,
    budgetOption,
    vibeOption,
    blueprint,
    savings,
    routeComparisons,
    detectedTags,
  };
}
