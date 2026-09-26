import React from 'react';
import { ScreenTripDetails } from './ScreenTripDetails';
import {
  BudgetMode,
  DateFlexibility,
  TravelPreference,
  InspirationDemo,
  TravellerType,
} from '../types';

interface ScreenTripConstraintsProps {
  travellerCount: number;
  demo: InspirationDemo;
  initialOrigin?: string;
  initialBudgetPerPerson?: number;
  initialDates?: string;
  initialTravellerType?: TravellerType;
  onNext: (constraints: {
    origin: string;
    budgetMode: BudgetMode;
    budgetPerPerson: number;
    totalBudget: number;
    dates: string;
    flexibility: DateFlexibility;
    duration: string;
    travelPreference: TravelPreference;
  }) => void;
  onBack: () => void;
  onChangeInspiration?: () => void;
}

export const ScreenTripConstraints: React.FC<ScreenTripConstraintsProps> = ({
  travellerCount,
  demo,
  initialOrigin = 'New Delhi',
  initialBudgetPerPerson = 35000,
  initialDates = '25 Oct',
  initialTravellerType = 'friends',
  onNext,
  onBack,
  onChangeInspiration,
}) => {
  return (
    <ScreenTripDetails
      demo={demo}
      initialTravellerCount={travellerCount}
      initialAdultCount={travellerCount}
      initialChildCount={0}
      initialTravellerType={initialTravellerType}
      initialOrigin={initialOrigin}
      initialBudgetPerPerson={initialBudgetPerPerson}
      initialDates={initialDates}
      onNext={(data) => {
        onNext({
          origin: data.origin,
          budgetMode: data.budgetMode,
          budgetPerPerson: data.budgetPerPerson,
          totalBudget: data.totalBudget,
          dates: data.dates,
          flexibility: data.flexibility,
          duration: data.duration,
          travelPreference: data.travelPreference,
        });
      }}
      onBack={onBack}
      onChangeInspiration={onChangeInspiration}
    />
  );
};
