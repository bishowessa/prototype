import { Type } from '@angular/core';
import { OnboardingState } from './onboarding-state.model';
import type { OnboardingStateService } from '@app/core/services/onboarding-state.service';
import {
  RamOption,
  DisplaySizeOption,
  PriceRangeOption,
  PrimaryUseOption,
  PhoneScreenSizeOption,
  StorageCapacityOption,
} from './preference-options.model';

/**
 * Laptop preferences payload
 */
export interface LaptopPreferencesPayload {
  batteryPriority: number;
  ramOption: RamOption;
  displaySize: DisplaySizeOption;
  priceRange: PriceRangeOption;
}

/**
 * Phone preferences payload
 */
export interface PhonePreferencesPayload {
  primaryUse: PrimaryUseOption;
  screenSize: PhoneScreenSizeOption;
  storage: StorageCapacityOption;
  priceRange: PriceRangeOption;
}

/**
 * Strategy for handling device preference components
 */
export interface DevicePreferenceStrategy {
  component: Type<any>;
  loadPreferences(state: OnboardingState): any;
  savePreferences(service: OnboardingStateService, data: any): void;
}
