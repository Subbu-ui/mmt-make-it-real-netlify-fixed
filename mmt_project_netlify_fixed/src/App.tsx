/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TripSparkHeader } from './components/TripSparkHeader';
import { JuryQuickNav } from './components/JuryQuickNav';
import { Screen1Home } from './components/Screen1Home';
import { Screen2Inspiration } from './components/Screen2Inspiration';
import { Screen3Understand } from './components/Screen3Understand';
import { Screen4MakeItReal } from './components/Screen4MakeItReal';
import { Screen5YourTrip } from './components/Screen5YourTrip';
import { Screen6GroupPlanning } from './components/Screen6GroupPlanning';
import { Screen7Booking } from './components/Screen7Booking';
import { Screen8TripStory } from './components/Screen8TripStory';
import { Screen9ShareEarn } from './components/Screen9ShareEarn';
import { VideoAnalysisResult, CurrentTripState } from './types';
import { currentTripRepository } from './services/tripRepository';
import { createNewTripState, validateAndSyncTripState, generateTripPackage } from './services/tripManager';

export default function App() {
  // Main Step State (1 to 9)
  const [step, setStep] = useState<number>(1);
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'responsive'>('mobile');

  // CENTRAL TRIP STATE (Single Source of Truth)
  const [tripState, setTripState] = useState<CurrentTripState>(() =>
    currentTripRepository.getCurrentTrip()
  );

  // Inspiration & Analysis raw preview state
  const [inspiration, setInspiration] = useState<{
    sourceType: 'link' | 'screenshot' | 'demo';
    url?: string;
    imagePreview?: string;
    analysis?: VideoAnalysisResult;
  } | null>(null);

  const [isDemoNavOpen, setIsDemoNavOpen] = useState(false);

  // Helper to synchronously update and persist trip state
  const updateTripState = (updater: (prev: CurrentTripState) => CurrentTripState) => {
    setTripState((prev) => {
      const updated = updater(prev);
      const synced = validateAndSyncTripState(updated);
      currentTripRepository.saveCurrentTrip(synced);
      return synced;
    });
  };

  const selectedDestination = tripState.selectedDestination || 'Trip';

  const stepTitles: Record<number, string> = {
    1: 'MakeMyTrip Hub',
    2: 'Share Travel Inspiration',
    3: 'Liked & Constraints Engine',
    4: 'MMT Feasibility Engine™',
    5: `Your ${selectedDestination} Trip Package`,
    6: 'Optional Group Alignment',
    7: `MakeMyTrip Checkout (${selectedDestination})`,
    8: `Post-Trip Growth Loop (${selectedDestination})`,
    9: 'Share & Earn Referral',
  };

  const handleStartTripSpark = () => {
    setStep(2);
  };

  const handleSelectInspiration = (data: {
    sourceType: 'link' | 'screenshot' | 'demo';
    url?: string;
    imagePreview?: string;
    analysis?: VideoAnalysisResult;
  }) => {
    setInspiration(data);

    // Determine destination from actual analysis only. Never force Seoul/South Korea
    // (or any other destination) when the link/media did not provide enough evidence.
    const analysis = data.analysis;
    const invalidLocationValues = new Set([
      '',
      'exact destination uncertain',
      'destination',
      'global',
      'scenic region',
      'unknown region',
      'travel',
    ]);

    const firstValidLocation = (...values: Array<string | null | undefined>) =>
      values.find((value) => {
        const clean = value?.trim();
        return Boolean(clean && !invalidLocationValues.has(clean.toLowerCase()));
      })?.trim();

    let detectedDest = firstValidLocation(
      analysis?.city_or_destination,
      analysis?.destination,
      analysis?.location?.city,
      analysis?.region_or_state,
      analysis?.location?.region,
      analysis?.country,
      analysis?.location?.country
    );

    let detectedCountry = firstValidLocation(
      analysis?.country,
      analysis?.location?.country
    );

    // Guard against the previous "everything becomes Seoul" failure mode.
    // Seoul/South Korea is accepted only when the analysis actually contains Korea-specific evidence.
    if (detectedDest && /seoul|south korea|korea/i.test(detectedDest)) {
      const koreaEvidence = [
        ...(analysis?.evidence || []),
        analysis?.source || '',
        analysis?.captionRetrieved || '',
      ]
        .join(' ')
        .toLowerCase();

      if (!/seoul|south korea|korea|hangul|hanok|hongdae|myeongdong|gyeongbok/.test(koreaEvidence)) {
        detectedDest = undefined;
        if (detectedCountry && /south korea|korea/i.test(detectedCountry)) {
          detectedCountry = undefined;
        }
      }
    }

    if (data.sourceType === 'demo' && !detectedDest) {
      detectedDest = 'Bali';
      detectedCountry = 'Indonesia';
    }

    // For real links with insufficient evidence, carry a neutral placeholder into
    // the existing Screen 3 fallback UI so the user can upload a screenshot/video
    // or enter a destination. Do not invent a country.
    detectedDest = detectedDest || 'Destination';
    detectedCountry = detectedCountry || 'Travel';

    // Initialize clean central trip state for this session preserving user's traveller settings
    const newTrip = createNewTripState({
      destination: detectedDest,
      country: detectedCountry,
      budgetPerPerson: 35000,
      adults: tripState.adults || 2,
      children: tripState.children || 0,
      infants: tripState.infants || 0,
      totalTravellers: tripState.totalTravellers || tripState.travellers || 2,
      travellers: tripState.totalTravellers || tripState.travellers || 2,
      originCity: tripState.originCity || 'Delhi',
      inspirationSource: {
        sourceType: data.sourceType,
        url: data.url,
        imagePreview: data.imagePreview,
        analysis: data.analysis,
      },
    });

    currentTripRepository.saveCurrentTrip(newTrip);
    setTripState(newTrip);
    setStep(3);
  };

  const handleMakeItReal = (data: {
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
  }) => {
    updateTripState((prev) => {
      const targetDest = data.destination || prev.selectedDestination;
      const targetCountry = data.country || prev.country;
      const adults = data.adults ?? (data.travellers === 1 ? 1 : 2);
      const children = data.children ?? 0;
      const infants = data.infants ?? 0;
      const totalTravellers = data.travellers;
      const updated: CurrentTripState = {
        ...prev,
        selectedDestination: targetDest,
        country: targetCountry,
        originCity: data.origin,
        departureAirportCode: data.departureAirportCode || prev.departureAirportCode,
        adults,
        children,
        infants,
        totalTravellers,
        travellers: totalTravellers,
        budgetPerPerson: data.budgetPerPerson,
        dates: data.when,
      };
      return validateAndSyncTripState(updated, true);
    });
    setStep(4);
  };

  const handleSelectDestination = (
    dest: string,
    matchType: 'exact' | 'vibe' | 'best_fit',
    price?: number
  ) => {
    updateTripState((prev) => {
      const updated: CurrentTripState = {
        ...prev,
        selectedDestination: dest,
        selectedMatchType: matchType,
        packagePricePerPerson: price || prev.packagePricePerPerson,
      };
      return validateAndSyncTripState(updated, true);
    });
    setStep(5);
  };

  const handleContinueBooking = (
    selectedComponents?: import('./types').SelectedBookingComponents,
    customTotal?: number,
    customPerPerson?: number,
    customExperiences?: string[]
  ) => {
    updateTripState((prev) => {
      const updated: CurrentTripState = {
        ...prev,
        selectedComponents: selectedComponents || prev.selectedComponents || {
          flights: true,
          hotel: true,
          experiences: true,
          transfers: false,
        },
        packagePricePerPerson: customPerPerson ?? prev.packagePricePerPerson,
        groupTotal: customTotal ?? prev.groupTotal,
        customExperiences: customExperiences || prev.customExperiences,
      };
      return updated;
    });
    setStep(7);
  };

  const handlePlanWithFriends = () => {
    setStep(6);
  };

  const handleLockGroupTrip = () => {
    updateTripState((prev) => {
      const optPrice =
        prev.package?.groupOptimizedPricePerPerson ||
        Math.round(prev.packagePricePerPerson * 0.88);
      return {
        ...prev,
        isGroupOptimized: true,
        packagePricePerPerson: optPrice,
        groupTotal: optPrice * (prev.travellers || 4),
      };
    });
    setStep(7);
  };

  const handleProceedToPostTrip = () => {
    updateTripState((prev) => ({
      ...prev,
      isBooked: true,
    }));
    setStep(8);
  };

  const handleContinueToShareEarn = () => {
    setStep(9);
  };

  const handlePlanSimilarTrip = () => {
    // Demonstrates complete circular loop: New friend clicks -> enters TripSpark
    updateTripState((prev) => ({
      ...prev,
      isGroupOptimized: false,
      isBooked: false,
    }));
    setStep(3);
  };

  const handleResetToHome = () => {
    setStep(1);
    updateTripState((prev) => ({
      ...prev,
      isGroupOptimized: false,
      isBooked: false,
    }));
  };

  const handleQuickNavSelect = (s: number) => {
    // Always guarantee state consistency when navigating
    const synced = validateAndSyncTripState(tripState);
    currentTripRepository.saveCurrentTrip(synced);
    setTripState(synced);
    setStep(s);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header with MakeMyTrip Branding */}
      <TripSparkHeader
        currentStep={step}
        totalSteps={9}
        stepTitle={stepTitles[step] || 'TripSpark'}
        deviceMode={deviceMode}
        onToggleDeviceMode={() =>
          setDeviceMode((prev) => (prev === 'mobile' ? 'responsive' : 'mobile'))
        }
        onReset={handleResetToHome}
        isDemoNavOpen={isDemoNavOpen}
        onToggleDemoNav={() => setIsDemoNavOpen((prev) => !prev)}
      />

      {/* Hidden by default Demo Navigator for Judges & Evaluators */}
      <JuryQuickNav
        isOpen={isDemoNavOpen}
        onClose={() => setIsDemoNavOpen(false)}
        currentStep={step}
        destinationName={tripState.selectedDestination}
        onSelectStep={handleQuickNavSelect}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex items-start justify-center p-3 sm:p-5 md:p-6">
        <div
          className={`w-full transition-all duration-300 ${
            deviceMode === 'mobile'
              ? 'max-w-[420px] bg-white p-2.5 sm:p-4 rounded-[40px] border-4 border-slate-300/80 shadow-2xl'
              : 'max-w-[1100px] mx-auto'
          }`}
        >
          {/* Mobile phone top status indicator bar (when in phone frame) */}
          {deviceMode === 'mobile' && (
            <div className="flex items-center justify-between px-3 pt-0.5 pb-2.5 text-slate-800 text-[11px] font-semibold select-none mb-2.5 border-b border-slate-100">
              <span className="font-bold tracking-tight text-slate-900">9:41</span>
              <div className="w-20 h-3.5 bg-slate-900 rounded-full mx-auto" />
              <div className="flex items-center gap-1.5 text-slate-700">
                <span className="text-[10px] font-bold">5G</span>
                <div className="w-4.5 h-2.5 border border-slate-700 rounded-xs p-0.5 flex items-center">
                  <div className="w-full h-full bg-slate-800 rounded-2xs" />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <Screen1Home onStartTripSpark={handleStartTripSpark} />
          )}

          {step === 2 && (
            <Screen2Inspiration
              onSelectInspiration={handleSelectInspiration}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <Screen3Understand
              analysis={inspiration?.analysis}
              destination={tripState.selectedDestination}
              country={tripState.country}
              tripState={tripState}
              inspirationSource={inspiration}
              onMakeItReal={handleMakeItReal}
              onBack={() => setStep(2)}
              onRequestUploadScreenshot={() => setStep(2)}
            />
          )}

          {step === 4 && (
            <Screen4MakeItReal
              analysis={inspiration?.analysis}
              destination={tripState.selectedDestination}
              budgetPerPerson={tripState.budgetPerPerson}
              originCity={tripState.originCity}
              onSelectDestination={handleSelectDestination}
              onBack={() => setStep(3)}
            />
          )}

          {step === 5 && (
            <Screen5YourTrip
              tripState={tripState}
              onContinueBooking={handleContinueBooking}
              onPlanWithFriends={handlePlanWithFriends}
              onBack={() => setStep(4)}
              isGroupOptimized={tripState.isGroupOptimized}
            />
          )}

          {step === 6 && (
            <Screen6GroupPlanning
              tripState={tripState}
              onLockTrip={handleLockGroupTrip}
              onBack={() => setStep(5)}
            />
          )}

          {step === 7 && (
            <Screen7Booking
              tripState={tripState}
              onProceedToPostTrip={handleProceedToPostTrip}
              onBack={() => setStep(5)}
            />
          )}

          {step === 8 && (
            <Screen8TripStory
              tripState={tripState}
              onContinueToShareEarn={handleContinueToShareEarn}
              onBack={() => setStep(7)}
            />
          )}

          {step === 9 && (
            <Screen9ShareEarn
              destination={tripState.selectedDestination}
              onPlanSimilarTrip={handlePlanSimilarTrip}
              onBackToHome={handleResetToHome}
            />
          )}
        </div>
      </main>
    </div>
  );
}
