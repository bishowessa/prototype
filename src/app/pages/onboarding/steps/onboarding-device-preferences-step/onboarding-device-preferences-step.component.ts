import { Component, EventEmitter, OnInit, Output, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { OnboardingStateService } from '@app/core/services/onboarding-state.service';
import { PreferenceService } from '@app/core/services/preference.service';
import {
  buildPreferenceJsonForCategory,
  resolveCategoryIdForDeviceKey,
} from '@app/core/mappers/preference.mapper';
import { DEVICE_STRATEGIES } from '../../strategies/device-preference-strategy';
import { OnboardingLaptopPreferencesStepComponent } from '../onboarding-laptop-preferences-step/onboarding-laptop-preferences-step.component';
import { OnboardingPhonePreferencesStepComponent } from '../onboarding-phone-preferences-step/onboarding-phone-preferences-step.component';
import { StepWrapperComponent } from '../../components/step-wrapper/step-wrapper.component';
import { StepNavigationButtonComponent } from '@app/shared/components/step-navigation-button/step-navigation-button.component';
import { LaptopPreferencesPayload, PhonePreferencesPayload } from '@app/shared/models/device-preferences.model';

@Component({
  selector: 'app-onboarding-device-preferences-step',
  standalone: true,
  imports: [
    StepWrapperComponent,
    StepNavigationButtonComponent,
    OnboardingLaptopPreferencesStepComponent,
    OnboardingPhonePreferencesStepComponent,
  ],
  templateUrl: './onboarding-device-preferences-step.component.html',
})
export class OnboardingDevicePreferencesStepComponent implements OnInit {
  @Output() readonly back = new EventEmitter<void>();
  @Output() readonly continue = new EventEmitter<void>();

  private readonly onboardingState = inject(OnboardingStateService);
  private readonly preferenceService = inject(PreferenceService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly focusKey = this.route.snapshot.queryParamMap.get('focus') ?? undefined;
  protected readonly editMode = this.route.snapshot.queryParamMap.get('view') === 'true';

  protected readonly isSaving = signal(false);
  protected readonly saveError = signal('');

  protected readonly submitLabel = computed(() =>
    this.editMode ? 'Save Preferences' : 'Next Step',
  );

  protected readonly submitIcon = computed(() => (this.editMode ? 'save' : 'arrow_forward'));

  protected currentDevice = computed(() => {
    const state = this.onboardingState.state$();
    const deviceTypes = ['laptop', 'phone'];

    if (this.focusKey && deviceTypes.includes(this.focusKey) && state.selectedDevices.includes(this.focusKey)) {
      return this.focusKey;
    }

    const incompleteDeviceTypes: string[] = [];
    const selectedDeviceTypes: string[] = [];

    for (const device of state.selectedDevices) {
      if (!deviceTypes.includes(device)) {
        continue;
      }

      selectedDeviceTypes.push(device);

      const variants = state.variants[device] ?? [];
      const hasAny = variants.length > 0;
      const allFinished = hasAny && variants.every((v) => v.status === 'finished');

      if (!allFinished) {
        incompleteDeviceTypes.push(device);
      }
    }

    if (incompleteDeviceTypes.includes('laptop')) {
      return 'laptop';
    }
    if (incompleteDeviceTypes.includes('phone')) {
      return 'phone';
    }

    if (selectedDeviceTypes.includes('laptop')) {
      return 'laptop';
    }
    if (selectedDeviceTypes.includes('phone')) {
      return 'phone';
    }

    return null;
  });

  protected readonly strategy = computed(() => {
    const device = this.currentDevice();
    return device ? DEVICE_STRATEGIES[device] : null;
  });

  ngOnInit(): void {
    // Step content is driven by computed state.
  }

  protected onBack(): void {
    this.back.emit();
  }

  protected onSave(payload: LaptopPreferencesPayload | PhonePreferencesPayload): void {
    const device = this.currentDevice();
    const strategy = this.strategy();

    if (!device || !strategy) {
      return;
    }

    strategy.savePreferences(this.onboardingState, payload);

    if (this.editMode) {
      this.persistCategoryAndReturnToSummary(device, { ...payload });
      return;
    }

    queueMicrotask(() => {
      this.pickNextDeviceOrContinue();
    });
  }

  private persistCategoryAndReturnToSummary(
    deviceKey: string,
    formData: Record<string, unknown>,
  ): void {
    this.isSaving.set(true);
    this.saveError.set('');

    const state = this.onboardingState.getState();

    this.preferenceService
      .getOptions()
      .pipe(
        switchMap((options) => {
          const categoryId = resolveCategoryIdForDeviceKey(deviceKey, options);
          if (categoryId == null) {
            throw new Error(`No backend category found for "${deviceKey}".`);
          }

          const preferencesJson = buildPreferenceJsonForCategory(
            deviceKey,
            formData,
            state.selectedProfileId,
          );

          return this.preferenceService.editPreference(categoryId, preferencesJson);
        }),
      )
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          void this.router.navigate(['/onboarding', '5'], {
            queryParams: { view: 'true' },
          });
        },
        error: () => {
          this.isSaving.set(false);
          this.saveError.set('Failed to save preferences. Please try again.');
        },
      });
  }

  private pickNextDeviceOrContinue(): void {
    const { incompleteDevices } = this.onboardingState.getDeviceCompletionGroups();
    const deviceTypes = ['laptop', 'phone'];
    const incompleteDeviceTypes = incompleteDevices.filter((device) => deviceTypes.includes(device));

    if (incompleteDeviceTypes.length === 0) {
      this.continue.emit();
    }
  }
}
