import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { OnboardingProfileStepComponent } from './steps/onboarding-profile-step/onboarding-profile-step.component';
import { OnboardingDeviceSelectionStepComponent } from './steps/onboarding-device-selection-step/onboarding-device-selection-step.component';
import { OnboardingDevicePreferencesStepComponent } from './steps/onboarding-device-preferences-step/onboarding-device-preferences-step.component';
import { OnboardingAccessoryPreferencesStepComponent } from './steps/onboarding-accessory-preferences-step/onboarding-accessory-preferences-step.component';
import { OnboardingSummaryStepComponent } from './steps/onboarding-summary-step/onboarding-summary-step.component';
import { OnboardingStateService } from '@app/core/services/onboarding-state.service';

@Component({
  selector: 'app-onboarding-layout',
  standalone: true,
  imports: [
    IconComponent,
    OnboardingProfileStepComponent,
    OnboardingDeviceSelectionStepComponent,
    OnboardingDevicePreferencesStepComponent,
    OnboardingAccessoryPreferencesStepComponent,
    OnboardingSummaryStepComponent,
  ],
  templateUrl: './onboarding-layout.component.html',
})
export class OnboardingLayoutComponent implements OnInit {
  private readonly onboardingState = inject(OnboardingStateService);
  private readonly router = inject(Router);

  protected readonly totalSteps = 5;
  protected currentStep = 1;

  get stepLabel(): string {
    return `Step ${this.currentStep} of ${this.totalSteps}`;
  }

  get stepProgress(): number {
    return this.currentStep / this.totalSteps;
  }

  ngOnInit(): void {
    this.currentStep = this.onboardingState.getCurrentStep();
  }

  protected goToStep(step: number): void {
    this.currentStep = step;
    this.onboardingState.setCurrentStep(step);
  }

  protected onSignOut(): void {
    this.onboardingState.setCurrentStep(1);
    this.router.navigate(['/login']);
  }
}
