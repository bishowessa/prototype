import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { OnboardingNavigationService } from '@app/core/services/onboarding-navigation.service';
import { TOTAL_STEPS } from '../config/onboarding-steps.config';

export const onboardingStepGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const navigationService = inject(OnboardingNavigationService);

  const stepId = parseInt(route.params['stepId'] || '1', 10);

  // Validate step number
  if (isNaN(stepId) || stepId < 1 || stepId > TOTAL_STEPS) {
    router.navigate(['/onboarding', '1']);
    return false;
  }

  // Check if user can navigate to this step
  if (!navigationService.canGoToStep(stepId)) {
    // Redirect to first valid step
    router.navigate(['/onboarding', '1']);
    return false;
  }

  return true;
};
