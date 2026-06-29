import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import { OnboardingNavigationService } from '@app/core/services/onboarding-navigation.service';
import { OnboardingStateService } from '@app/core/services/onboarding-state.service';
import { AuthStateService } from '@app/core/services/auth-state.service';
import { PreferenceService } from '@app/core/services/preference.service';
import { tryMapApiPreferencesToOnboardingState } from '@app/core/mappers/preference.mapper';
import { ONBOARDING_STEPS, TOTAL_STEPS } from './config/onboarding-steps.config';
import { OnboardingHeaderComponent } from './components/onboarding-header/onboarding-header.component';
import { OnboardingFooterComponent } from './components/onboarding-footer/onboarding-footer.component';
import { OnboardingProfileStepComponent } from './steps/onboarding-profile-step/onboarding-profile-step.component';
import { OnboardingDeviceSelectionStepComponent } from './steps/onboarding-device-selection-step/onboarding-device-selection-step.component';
import { OnboardingDevicePreferencesStepComponent } from './steps/onboarding-device-preferences-step/onboarding-device-preferences-step.component';
import { OnboardingAccessoryPreferencesStepComponent } from './steps/onboarding-accessory-preferences-step/onboarding-accessory-preferences-step.component';
import { OnboardingSummaryStepComponent } from './steps/onboarding-summary-step/onboarding-summary-step.component';

@Component({
  selector: 'app-onboarding-layout',
  standalone: true,
  imports: [
    OnboardingHeaderComponent,
    OnboardingFooterComponent,
    OnboardingProfileStepComponent,
    OnboardingDeviceSelectionStepComponent,
    OnboardingDevicePreferencesStepComponent,
    OnboardingAccessoryPreferencesStepComponent,
    OnboardingSummaryStepComponent,
  ],
  templateUrl: './onboarding-layout.component.html',
})
export class OnboardingLayoutComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly navigationService = inject(OnboardingNavigationService);
  private readonly onboardingState = inject(OnboardingStateService);
  private readonly authState = inject(AuthStateService);
  private readonly preferenceService = inject(PreferenceService);
  private readonly destroy$ = new Subject<void>();

  protected readonly steps = ONBOARDING_STEPS;
  protected readonly currentStep = signal(1);

  protected readonly stepLabel = computed(() => {
    return this.navigationService.getStepLabel(this.currentStep());
  });

  protected readonly stepProgress = computed(() => {
    return this.currentStep() / TOTAL_STEPS;
  });

  protected readonly currentStepConfig = computed(() => {
    return this.steps.find((s) => s.id === this.currentStep())!;
  });

  ngOnInit(): void {
    this.loadSavedPreferencesIfAuthenticated();
    this.updateStepFromRoute();

    const routeToSubscribe = this.route.firstChild || this.route;

    routeToSubscribe.paramMap.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateStepFromRoute();
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event) => {
        this.updateStepFromRoute();

        if ((event as NavigationEnd).urlAfterRedirects.startsWith('/onboarding')) {
          this.loadSavedPreferencesIfAuthenticated();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateStepFromRoute(): void {
    const routeToCheck = this.route.firstChild || this.route;
    const stepIdParam = routeToCheck.snapshot.paramMap.get('stepId');
    const stepId = stepIdParam ? parseInt(stepIdParam, 10) : 1;

    if (this.isValidStep(stepId)) {
      this.currentStep.set(stepId);
    } else {
      this.router.navigate(['/onboarding', '1']);
    }
  }

  protected goToStep(step: number): void {
    if (this.navigationService.canGoToStep(step)) {
      this.router.navigate(['/onboarding', step.toString()]);
    }
  }

  protected onStepBack(): void {
    const prevStep = this.navigationService.getPreviousStep(this.currentStep());
    if (prevStep !== null) {
      this.router.navigate(['/onboarding', prevStep.toString()]);
    }
  }

  protected onStepContinue(): void {
    const nextStep = this.navigationService.getNextStep(this.currentStep());
    if (nextStep !== null) {
      this.router.navigate(['/onboarding', nextStep.toString()]);
    }
  }

  protected onSignOut(): void {
    this.authState.consumerLogout();
  }

  private loadSavedPreferencesIfAuthenticated(): void {
    if (!this.authState.isConsumerAuthenticated()) {
      return;
    }

    forkJoin({
      options: this.preferenceService.getOptions(),
      prefs: this.preferenceService.getPreferences(),
    }).subscribe({
      next: ({ options, prefs }) => {
        const hydrated = tryMapApiPreferencesToOnboardingState(prefs, options);
        if (hydrated) {
          this.onboardingState.hydrateFromSavedPreferences(hydrated);
        }
      },
      error: () => {
        /* keep current in-memory state if fetch fails */
      },
    });
  }

  private isValidStep(step: number): boolean {
    return step >= 1 && step <= TOTAL_STEPS;
  }
}