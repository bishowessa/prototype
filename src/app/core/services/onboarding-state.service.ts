import { Injectable, inject, PLATFORM_ID, signal, computed, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from '@app/core/services/storage.service';
import {
  OnboardingState,
  OnboardingVariant,
  OnboardingVariantStatus,
} from '@app/shared/models/onboarding-state.model';

const ONBOARDING_STATE_KEY = 'onboarding_state';
const STORAGE_KEY_PREFIX = 'smartcompare_';

@Injectable({
  providedIn: 'root',
})
export class OnboardingStateService {
  private readonly storage = inject(StorageService);
  private readonly platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private defaultState(): OnboardingState {
    return {
      selectedDevices: [],
      variants: {},
      skippedAccessories: [],
      selectedProfileId: null,
    };
  }

  private suppressPersistence = false;

  private readonly state = signal<OnboardingState>(this.loadInitialState());

  readonly state$ = this.state.asReadonly();
  readonly selectedDevices$ = computed(() => this.state().selectedDevices);
  readonly variants$ = computed(() => this.state().variants);

  constructor() {
    if (this.isBrowser) {
      effect(() => {
        if (this.suppressPersistence) {
          return;
        }

        const currentState = this.state();
        this.storage.setItem(ONBOARDING_STATE_KEY, currentState);
      });
    }
  }

  private loadInitialState(): OnboardingState {
    if (!this.isBrowser) {
      return this.defaultState();
    }
    const stored = this.storage.getItem<OnboardingState>(ONBOARDING_STATE_KEY);
    return stored ?? this.defaultState();
  }

  getState(): OnboardingState {
    return this.state();
  }

  updateState(updater: (state: OnboardingState) => OnboardingState): void {
    this.state.update(updater);
  }

  setSelectedDevices(devices: string[]): void {
    if (!this.isBrowser) return;
    this.state.update((state) => ({
      ...state,
      selectedDevices: [...devices],
    }));
  }

  upsertVariant<T = unknown>(
    deviceType: string,
    variantIndex: number | null,
    payload: T,
    status: OnboardingVariantStatus,
  ): void {
    if (!this.isBrowser) return;

    this.state.update((state) => {
      const existingForType = (state.variants[deviceType] ?? []) as OnboardingVariant<T>[];

      let nextForType: OnboardingVariant<T>[];
      if (variantIndex === null) {
        nextForType = [{ status, data: payload }];
      } else if (variantIndex < 0 || variantIndex >= existingForType.length) {
        nextForType = [...existingForType, { status, data: payload }];
      } else {
        nextForType = existingForType.map((v, i) =>
          i === variantIndex ? { status, data: payload } : v,
        );
      }

      const skippedAccessories = (state.skippedAccessories ?? []).filter(
        (key) => key !== deviceType,
      );

      return {
        ...state,
        skippedAccessories,
        variants: {
          ...state.variants,
          [deviceType]: nextForType,
        },
      };
    });
  }

  markAccessorySkipped(deviceType: string): void {
    if (!this.isBrowser) {
      return;
    }

    this.state.update((state) => {
      const { [deviceType]: _removed, ...remainingVariants } = state.variants;

      return {
        ...state,
        variants: remainingVariants,
        skippedAccessories: [...new Set([...(state.skippedAccessories ?? []), deviceType])],
      };
    });
  }

  getDeviceCompletionGroups(): { completeDevices: string[]; incompleteDevices: string[] } {
    const state = this.getState();
    const completeDevices: string[] = [];
    const incompleteDevices: string[] = [];

    for (const device of state.selectedDevices) {
      const variants = state.variants[device] ?? [];
      const hasAny = variants.length > 0;
      const allFinished = hasAny && variants.every((v) => v.status === 'finished');

      if (allFinished) {
        completeDevices.push(device);
      } else {
        incompleteDevices.push(device);
      }
    }

    return { completeDevices, incompleteDevices };
  }

  canProceedToStep(step: number): boolean {
    const state = this.getState();

    if (step === 1) return true;
    if (step === 2) return true;
    if (step === 3) return state.selectedDevices.length > 0;
    if (step === 4) return state.selectedDevices.length > 0;
    if (step === 5) return true;

    return false;
  }

  /**
   * Hard reset: clears in-memory signals and wipes persisted onboarding state
   * from all browser storage backends (prefixed and legacy keys).
   */
  resetState(): void {
    this.suppressPersistence = true;
    this.state.set(this.defaultState());
    this.removePersistedState();
    this.suppressPersistence = false;
  }

  /** @deprecated Use resetState() — kept for backward compatibility. */
  clear(): void {
    this.resetState();
  }

  applyProfilePresets(profileId: string, presets: Record<string, unknown>): void {
    if (!this.isBrowser) return;

    const devicesToSelect: string[] = [];
    const variants: Record<string, OnboardingVariant[]> = {};

    for (const [deviceKey, payload] of Object.entries(presets)) {
      if (payload == null) continue;
      devicesToSelect.push(deviceKey);
      variants[deviceKey] = [{ status: 'finished', data: payload }];
    }

    this.state.set({
      selectedProfileId: profileId,
      selectedDevices: devicesToSelect,
      variants,
      skippedAccessories: [],
    });
  }

  hydrateFromSavedPreferences(state: OnboardingState): void {
    if (!this.isBrowser) return;
    this.state.set(state);
  }

  private removePersistedState(): void {
    if (!this.isBrowser) {
      return;
    }

    this.storage.removeItem(ONBOARDING_STATE_KEY, 'local');
    this.storage.removeItem(ONBOARDING_STATE_KEY, 'session');

    const prefixedKey = `${STORAGE_KEY_PREFIX}${ONBOARDING_STATE_KEY}`;
    window.localStorage.removeItem(ONBOARDING_STATE_KEY);
    window.sessionStorage.removeItem(ONBOARDING_STATE_KEY);
    window.localStorage.removeItem(prefixedKey);
    window.sessionStorage.removeItem(prefixedKey);
  }
}
