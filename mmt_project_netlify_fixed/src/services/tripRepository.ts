/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurrentTripState, VideoAnalysisResult } from '../types';
import { createNewTripState, createDemoTripState, validateAndSyncTripState } from './tripManager';

export interface TripRepository {
  getCurrentTrip(): CurrentTripState | null;
  saveTrip(trip: CurrentTripState): void;
  clearTrip(): void;
}

/**
 * RealTripRepository:
 * Dedicated exclusively to real user-driven flow (from pasted reels, links, screenshots).
 * Sets isDemoMode = false and ensures user data is never overwritten by demo presets.
 */
export class RealTripRepository implements TripRepository {
  private currentTrip: CurrentTripState | null = null;

  getCurrentTrip(): CurrentTripState {
    if (!this.currentTrip) {
      this.currentTrip = createNewTripState({
        destination: 'Bali',
        country: 'Indonesia',
        originCity: 'Delhi',
        adults: 2,
        children: 0,
        infants: 0,
        totalTravellers: 2,
        travellers: 2,
        budgetPerPerson: 35000,
        isDemoMode: false,
      });
    }
    return this.currentTrip;
  }

  saveTrip(trip: CurrentTripState): void {
    // Enforce isDemoMode = false for real user flow
    this.currentTrip = {
      ...trip,
      isDemoMode: false,
    };
  }

  saveCurrentTrip(trip: CurrentTripState): void {
    this.saveTrip(trip);
  }

  clearTrip(): void {
    this.currentTrip = null;
  }

  createFromAnalysis(params: {
    analysis?: VideoAnalysisResult;
    destination: string;
    country?: string;
    originCity?: string;
    travellers?: number;
    dates?: string;
    duration?: string;
    budgetPerPerson?: number;
    targetPrice?: number;
    matchType?: 'exact' | 'vibe' | 'best_fit';
    sourceType: 'link' | 'screenshot';
    url?: string;
    imagePreview?: string;
  }): CurrentTripState {
    const freshTrip = createNewTripState({
      destination: params.destination,
      country: params.country,
      originCity: params.originCity,
      travellers: params.travellers,
      dates: params.dates,
      duration: params.duration,
      budgetPerPerson: params.budgetPerPerson,
      targetPrice: params.targetPrice,
      matchType: params.matchType,
      isDemoMode: false,
      inspirationSource: {
        sourceType: params.sourceType,
        url: params.url,
        imagePreview: params.imagePreview,
        analysis: params.analysis,
      },
      analysis: params.analysis,
    });

    this.currentTrip = freshTrip;
    return freshTrip;
  }
}

/**
 * DemoTripRepository:
 * Isolated repository for demo scenario only (e.g. Try Demo click).
 * Sets isDemoMode = true.
 */
export class DemoTripRepository implements TripRepository {
  private currentTrip: CurrentTripState | null = null;

  getCurrentTrip(): CurrentTripState | null {
    if (!this.currentTrip) {
      this.currentTrip = createDemoTripState();
    }
    return this.currentTrip;
  }

  saveTrip(trip: CurrentTripState): void {
    this.currentTrip = {
      ...trip,
      isDemoMode: true,
    };
  }

  clearTrip(): void {
    this.currentTrip = null;
  }

  createDemo(): CurrentTripState {
    const demo = createDemoTripState();
    this.currentTrip = demo;
    return demo;
  }
}

export const realTripRepo = new RealTripRepository();
export const demoTripRepo = new DemoTripRepository();
export const currentTripRepository = realTripRepo;
