import { Injectable, inject } from '@angular/core';
import { OnboardingStateService } from './onboarding-state.service';
import { ONBOARDING_STEPS, TOTAL_STEPS } from '@app/pages/onboarding/config/onboarding-steps.config';

@Injectable({
  providedIn: 'root',
})
export class OnboardingNavigationService {
  private readonly onboardingState = inject(OnboardingStateService);

  canGoToStep(step: number): boolean {
    if (step < 1 || step > TOTAL_STEPS) {
      return false;
    }

    const state = this.onboardingState.getState();
    
    // Step 1 is always accessible
    if (step === 1) {
      return true;
    }

    // Check prerequisites for each step
    switch (step) {
      case 2:
        // Can go to device selection if profile is set (or if step 1 can be skipped)
        return true; // Profile step can be skipped
      case 3:
        // Can go to device preferences if devices are selected
        return state.selectedDevices.length > 0;
      case 4:
        // Can go to accessories if devices are selected
        return state.selectedDevices.length > 0;
      case 5:
        // Can go to summary if we've completed previous steps
        return true; // Summary is always accessible once we get here
      default:
        return false;
    }
  }

  getNextStep(currentStep: number): number | null {
    if (currentStep >= TOTAL_STEPS) {
      return null;
    }

    const nextStep = currentStep + 1;
    return this.canGoToStep(nextStep) ? nextStep : null;
  }

  getPreviousStep(currentStep: number): number | null {
    if (currentStep <= 1) {
      return null;
    }

    return currentStep - 1;
  }

  getStepLabel(step: number): string {
    const stepConfig = ONBOARDING_STEPS.find(s => s.id === step);
    return stepConfig ? `Step ${step} of ${TOTAL_STEPS} · ${stepConfig.label}` : `Step ${step} of ${TOTAL_STEPS}`;
  }
}
