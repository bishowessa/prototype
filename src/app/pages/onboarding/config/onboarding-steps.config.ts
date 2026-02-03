import { OnboardingProfileStepComponent } from '../steps/onboarding-profile-step/onboarding-profile-step.component';
import { OnboardingDeviceSelectionStepComponent } from '../steps/onboarding-device-selection-step/onboarding-device-selection-step.component';
import { OnboardingDevicePreferencesStepComponent } from '../steps/onboarding-device-preferences-step/onboarding-device-preferences-step.component';
import { OnboardingAccessoryPreferencesStepComponent } from '../steps/onboarding-accessory-preferences-step/onboarding-accessory-preferences-step.component';
import { OnboardingSummaryStepComponent } from '../steps/onboarding-summary-step/onboarding-summary-step.component';
import { OnboardingStep } from '@app/shared/models/onboarding-step.model';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    label: 'Profile',
    component: OnboardingProfileStepComponent,
    canSkip: true,
    canGoBack: false,
    description: 'Tell us about yourself',
  },
  {
    id: 2,
    label: 'Devices',
    component: OnboardingDeviceSelectionStepComponent,
    canSkip: false,
    canGoBack: true,
    description: 'Select your devices',
  },
  {
    id: 3,
    label: 'Preferences',
    component: OnboardingDevicePreferencesStepComponent,
    canSkip: false,
    canGoBack: true,
    description: 'Fine-tune device preferences',
  },
  {
    id: 4,
    label: 'Accessories',
    component: OnboardingAccessoryPreferencesStepComponent,
    canSkip: false,
    canGoBack: true,
    description: 'Customize your accessories',
  },
  {
    id: 5,
    label: 'Summary',
    component: OnboardingSummaryStepComponent,
    canSkip: false,
    canGoBack: true,
    description: 'Review your selections',
  },
];

export const TOTAL_STEPS = ONBOARDING_STEPS.length;
