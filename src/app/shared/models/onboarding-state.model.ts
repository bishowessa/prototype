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
  /** Accessory keys the user explicitly skipped on step 4. */
  skippedAccessories?: string[];
  /** Frontend-only persona id (student, gamer, etc.) */
  selectedProfileId?: string | null;
}
