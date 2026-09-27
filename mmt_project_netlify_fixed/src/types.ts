export type TravellerType = 'solo' | 'couple' | 'friends' | 'family';
export type BudgetMode = 'per_person' | 'total_trip' | 'total';
export type DateFlexibility = 'exact' | 'flexible_3' | 'flexible_month';
export type TravelPreference = 'flight' | 'train' | 'bus' | 'road' | 'cheapest' | 'fastest' | 'mmt_optimise';
export type StrategyType = 'recreate' | 'budget' | 'vibe';

export type ScreenStep =
  | 'home'
  | 'holiday_packages'
  | 'capture'
  | 'analysis'
  | 'traveller_inputs'
  | 'trip_constraints'
  | 'feasibility_check'
  | 'hero_three_ways'
  | 'why_this_option'
  | 'deep_dive_recreate'
  | 'deep_dive_budget'
  | 'deep_dive_vibe'
  | 'comparison_table'
  | 'trip_blueprint'
  | 'mmt_cart'
  | 'price_comparison'
  | 'price_savings'
  | 'group_module'
  | 'final_cta';

export interface InspirationTag {
  id: string;
  label: string;
  emoji: string;
  category: 'vibe' | 'feature' | 'activity' | 'amenity';
}

export interface DayItineraryItem {
  time?: string;
  timeSlot?: string;
  activity?: string;
  title?: string;
  icon?: string;
  iconType?: string;
  componentCost: number;
  transportType?: string;
  activityType?: 'stay' | 'flight' | 'transfer' | 'sightseeing' | 'dining' | 'leisure';
  description?: string;
  matchedFromReel?: boolean;
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  items: DayItineraryItem[];
}

export interface TripStrategyOption {
  type: StrategyType;
  title: string;
  subtitle: string;
  destination: string;
  badge: string;
  duration: string;
  highlights: string[];
  costPerPerson: number;
  groupTotal: number;
  budgetDifference: number; // positive = over budget, negative = under budget
  matchScore: number;
  stayType: string;
  flightType: string;
  transferType: string;
  experienceLevel: string;
  heroImage: string;
  imageUrl?: string;
  whatStayed: string[];
  whatChanged: string[];
}

export interface CartBreakdown {
  journeyCost: number;
  hotelCost: number;
  transferCost: number;
  activityCost: number;
  localSpend: number;
  journeyTitle: string;
  hotelTitle: string;
  transferTitle: string;
  activityTitle: string;
}

export interface PriceSavingItem {
  id: string;
  title: string;
  description: string;
  savingPerPerson: number;
  applied: boolean;
  category: 'flight' | 'hotel' | 'dates';
}

export interface GroupMemberVote {
  id: string;
  name: string;
  avatar: string;
  status: 'in' | 'maybe' | 'cant_go';
  budgetPreference?: number;
  comment?: string;
}

export interface RouteComparisonOption {
  id: string;
  name: string;
  mode: 'flight' | 'bus' | 'train' | 'multimodal';
  label: 'Fastest' | 'Best Value' | 'Cheapest' | 'Balanced';
  pricePerPerson: number;
  durationText: string;
  stopsText: string;
  operator?: string;
}

export interface InspirationDemo {
  id: string;
  title: string;
  sourceUrl: string;
  sourcePlatform: 'Instagram Reel' | 'YouTube Short' | 'TikTok / Creator';
  creatorHandle: string;
  destination: string;
  country: string;
  flag: string;
  confidenceScore: number;
  thumbnail: string;
  videoPreviewPlaceholder: string;
  detectedTags: string[];
  recommendedDuration: string;
  defaultOrigin: string;
  defaultDates: string;
  defaultBudgetPerPerson: number;
  recreateOption: TripStrategyOption;
  budgetOption: TripStrategyOption;
  vibeOption: TripStrategyOption;
  blueprint: DayPlan[];
  savings: PriceSavingItem[];
  routeComparisons: RouteComparisonOption[];
}

export type InspirationSource =
  | {
      type: 'DEMO';
      demoId: string;
    }
  | {
      type: 'INSTAGRAM_URL';
      url: string;
    }
  | {
      type: 'YOUTUBE_URL';
      url: string;
    }
  | {
      type: 'WEB_URL';
      url: string;
    }
  | {
      type: 'URL';
      url: string;
      platform?: string;
    }
  | {
      type: 'UPLOADED_IMAGE';
      file?: File;
      base64?: string;
      previewUrl?: string;
      captionHint?: string;
    }
  | {
      type: 'UPLOADED_VIDEO';
      file?: File;
      base64?: string;
      previewUrl?: string;
      captionHint?: string;
    };

export interface AnalysisEvidence {
  sourceUrl?: string;
  normalisedUrl?: string;
  platform?: string;
  contentType?: string;
  contentId?: string;
  captionText?: string;
  pageTitle?: string;
  description?: string;
  thumbnailUrl?: string;
  thumbnailBase64?: string;
  uploadedImages?: string[];
  uploadedVideo?: string;
  hasUsefulTextEvidence: boolean;
  hasUsefulVisualEvidence: boolean;
  mediaRestricted?: boolean;
}

export interface DestinationLocation {
  country: string | null;
  region: string | null;
  city: string | null;
  place: string | null;
  displayName: string | null;
  confidence: number;
  evidence: string[];
  source: string;
}

export interface DestinationInference {
  country: string;
  region_or_state: string;
  city_or_destination: string;
  specific_place?: string | null;
  confidence: number;
  evidence: string[];
  suggestedDestinations?: string[];
  sourceOfInference?: 'visual_content' | 'post_text' | 'metadata' | 'none';
}

export interface VideoAnalysisResult {
  destination?: string | null;
  country?: string | null;
  region_or_state?: string | null;
  city_or_destination?: string | null;
  specific_place?: string | null;
  displayName?: string | null;
  locationConfidence?: number;
  confidence?: number;
  evidence: string[];
  source?: string;
  location?: DestinationLocation;
  destinationInference?: DestinationInference;
  suggestedDestinations?: string[];
  sourceOfInference?: 'visual_content' | 'post_text' | 'metadata' | 'none';
  contentAccessStatus?: 'visual_analyzed' | 'text_only' | 'unaccessible' | 'generic_fallback';
  inputSource?: 'uploaded_image' | 'uploaded_video' | 'youtube_url' | 'instagram_reel' | 'tiktok_url' | 'web_url';
  inputUrl?: string;
  inputMimeType?: string;
  actualMediaAvailable?: boolean;
  captionRetrieved?: string | null;
  thumbnailRetrieved?: string | null;
  videoUploadedToGemini?: boolean;
  experience_tags?: string[];
  possibleHotelOrProperty?: string;
  landmarks: string[];
  activities: string[];
  travelVibes: string[];
  accommodationStyle?: string;
  tripType?: string;
  visualHighlights?: string[];
  suggestedDuration?: string;
  summary: string;
}

export interface GeminiAnalysisResult {
  destination: string;
  city?: string;
  stateOrRegion?: string;
  region?: string;
  country: string;
  confidence: number;
  visibleText?: string[];
  destinationEvidence: string[];
  detectedExperiences: string[];
  travelVibes: string[];
  landmarks: string[];
  activities?: string[];
  possibleProperties?: string[];
  summary: string;
  needsConfirmation?: boolean;
  needsUserConfirmation?: boolean;
  alternativeDestinations?: string[];
}

export type ImagePipelineStep =
  | 'IDLE'
  | 'IMAGE_RECEIVED'
  | 'PREPARING_IMAGE'
  | 'ANALYSING_IMAGE'
  | 'PARSING_RESULT'
  | 'SUCCESS'
  | 'NEEDS_CONFIRMATION'
  | 'FAILED'
  | 'STEP_1_UPLOAD_MEDIA'
  | 'STEP_2_EXTRACT_TEXT'
  | 'STEP_3_IDENTIFY_LANDMARKS'
  | 'STEP_4_CONFIRM_DESTINATION';

export type AnalysisState =
  | 'IDLE'
  | 'LINK_CAPTURED'
  | 'FETCHING_PUBLIC_METADATA'
  | 'MEDIA_AVAILABLE'
  | 'MEDIA_RESTRICTED'
  | 'WAITING_FOR_USER_MEDIA'
  | 'IMAGE_RECEIVED'
  | 'PREPARING_IMAGE'
  | 'ANALYSING_MEDIA'
  | 'ANALYSING_IMAGE'
  | 'PARSING_RESULT'
  | 'DESTINATION_PREDICTED'
  | 'WAITING_FOR_CONFIRMATION'
  | 'VIBE_MATCH_ONLY'
  | 'DESTINATION_CONFIRMED'
  | 'ANALYSIS_FAILED';

export interface TripSession {
  sourceType: 'DEMO' | 'INSTAGRAM_URL' | 'INSTAGRAM_REEL' | 'YOUTUBE_URL' | 'WEB_URL' | 'UPLOADED_IMAGE' | 'UPLOADED_VIDEO';
  sourceUrl: string;
  normalisedUrl?: string;
  platform: string;
  contentId: string;

  metadataStatus?: string;
  caption?: string;
  thumbnail?: string;

  uploadedMedia?: string;
  uploadedFileName?: string;
  uploadedFileSize?: number;

  analysisStatus: AnalysisState;
  imagePipelineStep?: ImagePipelineStep;

  predictedDestination: string;
  city?: string;
  stateOrRegion?: string;
  predictionConfidence: number | null;
  visibleText?: string[];
  destinationEvidence: string[];
  alternativeDestinations?: string[];

  confirmedDestination: string;
  confirmedCountry?: string;

  detectedExperiences: string[];
  detectedVibes: string[];

  selectedIntentSignals: string[];

  origin: string;
  travellerType: TravellerType;
  travellerCount: number;
  adultCount: number;
  childCount: number;
  budgetMode: BudgetMode;
  budget: number;
  budgetPerPerson: number;
  totalBudget: number;
  dates: string;
  flexibility: DateFlexibility;
  duration: string;
  transportPreference: TravelPreference;

  selectedStrategy: StrategyType;
  recreatePlan?: TripStrategyOption;
  doItForLessPlan?: TripStrategyOption;
  vibeMatchPlan?: TripStrategyOption;

  blueprint?: DayPlan[];
  savings?: PriceSavingItem[];
  routeComparisons?: RouteComparisonOption[];
  appliedSavings: string[];
  isSaved?: boolean;
  usedDemoData: boolean;

  // Debug Inspection Details
  imageSentToGemini?: boolean;
  metadataFound?: boolean;
  geminiModelUsed?: string;
  analysisTimeMs?: number;
  vibeOnlyMatch?: boolean;
}

export interface AnalyticsEvent {
  eventName:
    | 'inspiration_submitted'
    | 'inspiration_understood'
    | 'traveller_inputs_completed'
    | 'feasibility_checked'
    | 'recreate_viewed'
    | 'budget_version_viewed'
    | 'vibe_match_viewed'
    | 'trip_option_selected'
    | 'itinerary_created'
    | 'mmt_booking_link_clicked'
    | 'trip_saved';
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface ItineraryDay {
  day: string; // e.g. "DAY 1"
  title: string;
  icon?: string;
  activities?: string[];
}

export interface TripPackageComponent {
  title: string;
  subtitle?: string;
  cost: number;
  category: 'flight' | 'hotel' | 'transfer' | 'experience' | 'local_spend';
}

export interface CurrentTripPackage {
  destination: string;
  country: string;
  originCity: string;
  dates: string;
  duration: string;
  flightName: string;
  hotelName: string;
  hotelType: string;
  transfersName: string;
  topExperiences: string[];
  components: TripPackageComponent[];
  pricePerPerson: number;
  groupOptimizedPricePerPerson: number;
  travellers: number;
  totalGroupPrice: number;
  isGroupOptimized: boolean;
}

export interface TripComponentDetail {
  title: string;
  subtitle?: string;
  cost: number;
}

export interface TripExperienceDetail {
  title: string;
  subtitle?: string;
  cost: number;
  items: string[];
}

export interface SelectedBookingComponents {
  flights: boolean;
  hotel: boolean;
  experiences: boolean;
  transfers: boolean;
}

export interface CurrentTripState {
  isDemoMode: boolean;
  inspirationSource: {
    sourceType: 'link' | 'screenshot' | 'demo';
    url?: string;
    imagePreview?: string;
    analysis?: VideoAnalysisResult;
    title?: string;
  } | null;
  detectedDestination: string;
  selectedDestination: string;
  country: string;
  adults: number;
  children: number;
  infants: number;
  totalTravellers: number;
  travellers: number;
  originCity: string;
  departureAirportCode?: string;
  dates: string;
  duration: string;
  budgetPerPerson: number;
  selectedMatchType: 'exact' | 'vibe' | 'best_fit';
  itinerary: ItineraryDay[];
  flight: TripComponentDetail;
  hotel: TripComponentDetail;
  transfers: TripComponentDetail;
  experiences: TripExperienceDetail;
  packagePricePerPerson: number;
  groupTotal: number;
  package: CurrentTripPackage;
  selectedComponents?: SelectedBookingComponents;
  customExperiences?: string[];
  bookingReference?: string;
  isBooked: boolean;
  isGroupOptimized?: boolean;
}
