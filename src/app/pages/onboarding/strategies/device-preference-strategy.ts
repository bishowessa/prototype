import { OnboardingLaptopPreferencesStepComponent } from '../steps/onboarding-laptop-preferences-step/onboarding-laptop-preferences-step.component';
import { OnboardingPhonePreferencesStepComponent } from '../steps/onboarding-phone-preferences-step/onboarding-phone-preferences-step.component';
import {
  DevicePreferenceStrategy,
  LaptopPreferencesPayload,
  PhonePreferencesPayload,
} from '@app/shared/models/device-preferences.model';
import { OnboardingState } from '@app/shared/models/onboarding-state.model';
import { OnboardingStateService } from '@app/core/services/onboarding-state.service';

export const DEVICE_STRATEGIES: Record<string, DevicePreferenceStrategy> = {
  laptop: {
    component: OnboardingLaptopPreferencesStepComponent,
    loadPreferences: (state) => {
      return state.variants['laptop']?.[0]?.data as LaptopPreferencesPayload | undefined;
    },
    savePreferences: (service, data) => {
      service.upsertVariant<LaptopPreferencesPayload>('laptop', null, data, 'finished');
    },
  },
  phone: {
    component: OnboardingPhonePreferencesStepComponent,
    loadPreferences: (state) => {
      return state.variants['phone']?.[0]?.data as PhonePreferencesPayload | undefined;
    },
    savePreferences: (service, data) => {
      service.upsertVariant<PhonePreferencesPayload>('phone', null, data, 'finished');
    },
  },
};
