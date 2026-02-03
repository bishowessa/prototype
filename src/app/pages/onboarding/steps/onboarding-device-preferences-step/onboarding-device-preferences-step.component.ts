import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { OnboardingStateService } from '@app/core/services/onboarding-state.service';
import {
  LaptopPreferencesPayload,
  OnboardingLaptopPreferencesStepComponent,
} from '../onboarding-laptop-preferences-step/onboarding-laptop-preferences-step.component';
import {
  OnboardingPhonePreferencesStepComponent,
  PhonePreferencesPayload,
} from '../onboarding-phone-preferences-step/onboarding-phone-preferences-step.component';

@Component({
  selector: 'app-onboarding-device-preferences-step',
  standalone: true,
  imports: [OnboardingLaptopPreferencesStepComponent, OnboardingPhonePreferencesStepComponent],
  templateUrl: './onboarding-device-preferences-step.component.html',
})
export class OnboardingDevicePreferencesStepComponent implements OnInit {
  @Output() readonly back = new EventEmitter<void>();
  @Output() readonly continue = new EventEmitter<void>();

  private readonly onboardingState = inject(OnboardingStateService);

  protected currentDevice: 'laptop' | 'phone' | null = null;

  ngOnInit(): void {
    this.pickNextDevice();
  }

  protected onBack(): void {
    this.back.emit();
  }

  protected onLaptopSave(payload: LaptopPreferencesPayload): void {
    this.onboardingState.upsertVariant('laptop', null, payload, 'finished');
    this.pickNextDeviceOrContinue();
  }

  protected onPhoneSave(payload: PhonePreferencesPayload): void {
    this.onboardingState.upsertVariant('phone', null, payload, 'finished');
    this.pickNextDeviceOrContinue();
  }

  private pickNextDevice(): void {
    const { incompleteDevices } = this.onboardingState.getDeviceCompletionGroups();

    if (incompleteDevices.includes('laptop')) {
      this.currentDevice = 'laptop';
    } else if (incompleteDevices.includes('phone')) {
      this.currentDevice = 'phone';
    } else {
      this.currentDevice = null;
    }
  }

  private pickNextDeviceOrContinue(): void {
    this.pickNextDevice();
    if (this.currentDevice === null) {
      // Always emit continue to go to step 4 (accessories)
      // Step 4 will handle showing accessories or auto-advancing if none selected
      this.continue.emit();
    }
  }
}

