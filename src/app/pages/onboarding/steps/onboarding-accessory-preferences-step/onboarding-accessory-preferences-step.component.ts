import { Component, EventEmitter, OnInit, Output, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { OnboardingStateService } from '@app/core/services/onboarding-state.service';
import { PreferenceService } from '@app/core/services/preference.service';
import {
  buildPreferenceJsonForCategory,
  resolveCategoryIdForDeviceKey,
} from '@app/core/mappers/preference.mapper';
import { AccordionComponent } from '@app/shared/components/accordion/accordion.component';
import { ACCESSORY_CONFIGS } from '../../config/accessory-config';
import { StepNavigationButtonComponent } from '@app/shared/components/step-navigation-button/step-navigation-button.component';
import { HeadphonesPreferencesContentComponent } from '../../components/headphones-preferences-content.component';
import { MousePreferencesContentComponent } from '../../components/mouse-preferences-content.component';
import { KeyboardPreferencesContentComponent } from '../../components/keyboard-preferences-content.component';
import { ChargerPreferencesContentComponent } from '../../components/charger-preferences-content.component';
import {
  AccessoryState,
  AccessoryPreferencesPayload,
  HeadphonesPreferencesPayload,
  MousePreferencesPayload,
  KeyboardPreferencesPayload,
  ChargerPreferencesPayload,
} from '@app/shared/models/accessory-preferences.model';
import { isBlankPreferencePayload } from '../../utils/onboarding-preference.utils';

@Component({
  selector: 'app-onboarding-accessory-preferences-step',
  standalone: true,
  imports: [
    AccordionComponent,
    StepNavigationButtonComponent,
    HeadphonesPreferencesContentComponent,
    MousePreferencesContentComponent,
    KeyboardPreferencesContentComponent,
    ChargerPreferencesContentComponent,
  ],
  templateUrl: './onboarding-accessory-preferences-step.component.html',
})
export class OnboardingAccessoryPreferencesStepComponent implements OnInit {
  @Output() readonly back = new EventEmitter<void>();
  @Output() readonly continue = new EventEmitter<void>();

  private readonly onboardingState = inject(OnboardingStateService);
  private readonly preferenceService = inject(PreferenceService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly focusKey = this.route.snapshot.queryParams['focus'] as string | undefined;
  protected readonly editMode = this.route.snapshot.queryParamMap.get('view') === 'true';

  protected readonly configs = ACCESSORY_CONFIGS;
  protected readonly accessoryStates = signal<Map<string, AccessoryState>>(new Map());
  protected readonly isSaving = signal(false);
  protected readonly saveError = signal('');

  protected readonly submitLabel = computed(() =>
    this.editMode ? 'Save Preferences' : 'Next Step',
  );

  protected readonly submitIcon = computed(() => (this.editMode ? 'save' : 'arrow_forward'));

  protected readonly visibleAccessories = computed(() => {
    const accessories = this.configs.filter((config) => {
      const state = this.accessoryStates().get(config.key);
      return state?.show && !state?.skipped;
    });

    if (this.editMode && this.focusKey) {
      return accessories.filter((config) => config.key === this.focusKey);
    }

    return accessories;
  });

  ngOnInit(): void {
    const state = this.onboardingState.getState();
    const selectedDevices = state.selectedDevices;
    const skippedSet = new Set(state.skippedAccessories ?? []);
    const newMap = new Map<string, AccessoryState>();

    this.configs.forEach((config) => {
      const show = selectedDevices.includes(config.key);
      const existingValue = state.variants[config.key]?.[0]?.data;
      const isSkipped = skippedSet.has(config.key);
      const resolvedValue = isBlankPreferencePayload(existingValue)
        ? config.defaultValues
        : (existingValue as AccessoryPreferencesPayload);

      newMap.set(config.key, {
        show,
        skipped: isSkipped,
        value: resolvedValue,
      });
    });

    this.accessoryStates.set(newMap);

    const hasAnyAccessories = Array.from(newMap.values()).some((value) => value.show);
    if (!hasAnyAccessories && !this.editMode) {
      this.continue.emit();
    }
  }

  protected getAccessoryState(key: string): AccessoryState | undefined {
    return this.accessoryStates().get(key);
  }

  protected getAccessoryValue(key: string): AccessoryPreferencesPayload {
    const stateValue = this.accessoryStates().get(key)?.value;
    if (stateValue) {
      return stateValue;
    }

    const config = this.configs.find((c) => c.key === key);
    return (config?.defaultValues ?? {}) as AccessoryPreferencesPayload;
  }

  protected getHeadphonesValue(): HeadphonesPreferencesPayload {
    return this.getAccessoryValue('headphones') as HeadphonesPreferencesPayload;
  }

  protected getMouseValue(): MousePreferencesPayload {
    return this.getAccessoryValue('mouse') as MousePreferencesPayload;
  }

  protected getKeyboardValue(): KeyboardPreferencesPayload {
    return this.getAccessoryValue('keyboard') as KeyboardPreferencesPayload;
  }

  protected getChargerValue(): ChargerPreferencesPayload {
    return this.getAccessoryValue('charger') as ChargerPreferencesPayload;
  }

  protected shouldShow(key: string): boolean {
    const state = this.accessoryStates().get(key);
    return (state?.show && !state?.skipped) ?? false;
  }

  protected isInitiallyOpen(key: string): boolean {
    if (this.focusKey) {
      return key === this.focusKey;
    }

    const visible = this.visibleAccessories();
    return visible.length > 0 && visible[0].key === key;
  }

  protected onSkip(key: string): void {
    const map = new Map(this.accessoryStates());
    const state = map.get(key);
    const config = this.configs.find((c) => c.key === key);

    if (state && config) {
      map.set(key, {
        ...state,
        skipped: true,
        value: config.defaultValues,
      });
      this.accessoryStates.set(map);
      this.onboardingState.markAccessorySkipped(key);
      this.checkIfAllSkipped();
    }
  }

  protected onValueChange(key: string, value: AccessoryPreferencesPayload): void {
    const map = new Map(this.accessoryStates());
    const state = map.get(key);

    if (state) {
      map.set(key, { ...state, value });
      this.accessoryStates.set(map);

      if (state.show && !state.skipped) {
        this.onboardingState.upsertVariant(key, 0, value, 'finished');
      }
    }
  }

  protected onBack(): void {
    this.back.emit();
  }

  protected onNext(): void {
    const keysToPersist = this.resolveAccessoryKeysToPersist();

    keysToPersist.forEach((key) => {
      const state = this.accessoryStates().get(key);
      if (!state?.show || state.skipped) {
        return;
      }

      const config = this.configs.find((c) => c.key === key);
      const payload = isBlankPreferencePayload(state.value)
        ? config?.defaultValues ?? state.value
        : state.value;

      if (!isBlankPreferencePayload(payload)) {
        this.onboardingState.upsertVariant(key, 0, payload, 'finished');
      }
    });

    if (this.editMode) {
      this.persistAccessoriesAndReturnToSummary(keysToPersist);
      return;
    }

    this.continue.emit();
  }

  private resolveAccessoryKeysToPersist(): string[] {
    if (this.editMode && this.focusKey) {
      return this.shouldShow(this.focusKey) ? [this.focusKey] : [];
    }

    return this.visibleAccessories().map((config) => config.key);
  }

  private persistAccessoriesAndReturnToSummary(keys: string[]): void {
    if (keys.length === 0) {
      void this.router.navigate(['/onboarding', '5'], { queryParams: { view: 'true' } });
      return;
    }

    this.isSaving.set(true);
    this.saveError.set('');

    const state = this.onboardingState.getState();

    this.preferenceService
      .getOptions()
      .pipe(
        switchMap((options) => {
          const requests = keys
            .map((key) => {
              const accessoryState = this.accessoryStates().get(key);
              if (!accessoryState?.show || accessoryState.skipped) {
                return null;
              }

              const config = this.configs.find((c) => c.key === key);
              const payload = isBlankPreferencePayload(accessoryState.value)
                ? config?.defaultValues ?? accessoryState.value
                : accessoryState.value;

              if (isBlankPreferencePayload(payload)) {
                return null;
              }

              const categoryId = resolveCategoryIdForDeviceKey(key, options);
              if (categoryId == null) {
                return null;
              }

              const preferencesJson = buildPreferenceJsonForCategory(
                key,
                { ...(payload as object) },
                state.selectedProfileId,
              );

              return this.preferenceService.editPreference(categoryId, preferencesJson);
            })
            .filter((request): request is ReturnType<PreferenceService['editPreference']> => request != null);

          if (requests.length === 0) {
            return of([]);
          }

          return forkJoin(requests);
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

  private checkIfAllSkipped(): void {
    if (this.editMode) {
      return;
    }

    const map = this.accessoryStates();
    const allSkipped = Array.from(map.values()).every((state) => !state.show || state.skipped);

    if (allSkipped) {
      this.continue.emit();
    }
  }
}
