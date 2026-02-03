import { Type } from '@angular/core';

/**
 * Onboarding step configuration
 */
export interface OnboardingStep {
  id: number;
  label: string;
  component: Type<any>;
  canSkip?: boolean;
  canGoBack?: boolean;
  description?: string;
}
