/**
 * Onboarding state management types
 */

export type OnboardingVariantStatus = 'unfinished' | 'finished';

export interface OnboardingVariant<T = unknown> {
  status: OnboardingVariantStatus;
  data: T;
}

export interface OnboardingState {
  selectedDevices: string[];
  variants: Record<string, OnboardingVariant[]>;
}
