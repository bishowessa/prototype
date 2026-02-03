import { Injectable, inject, PLATFORM_ID, signal, computed, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from '@app/core/services/storage.service';
import {
  OnboardingState,
  OnboardingVariant,
  OnboardingVariantStatus,
} from '@app/shared/models/onboarding-state.model';

const ONBOARDING_STATE_KEY = 'onboarding_state';

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
    };
  }

  private readonly state = signal<OnboardingState>(this.loadInitialState());

  // Public readonly signal for reactive access
  readonly state$ = this.state.asReadonly();

  // Computed signals for common state access
  readonly selectedDevices$ = computed(() => this.state().selectedDevices);
  readonly variants$ = computed(() => this.state().variants);

  constructor() {
    // Auto-save state to storage whenever it changes
    if (this.isBrowser) {
      effect(() => {
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
    this.state.update(state => ({
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
    
    this.state.update(state => {
      const existingForType = (state.variants[deviceType] ?? []) as OnboardingVariant<T>[];

      let nextForType: OnboardingVariant<T>[];
      if (variantIndex === null || variantIndex < 0 || variantIndex >= existingForType.length) {
        nextForType = [...existingForType, { status, data: payload }];
      } else {
        nextForType = existingForType.map((v, i) =>
          i === variantIndex ? { status, data: payload } : v,
        );
      }

      return {
        ...state,
        variants: {
          ...state.variants,
          [deviceType]: nextForType,
        },
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
    if (step === 2) return true; // Profile can be skipped
    if (step === 3) return state.selectedDevices.length > 0;
    if (step === 4) return state.selectedDevices.length > 0;
    if (step === 5) return true; // Summary is always accessible
    
    return false;
  }

  clear(): void {
    if (!this.isBrowser) return;
    this.storage.removeItem(ONBOARDING_STATE_KEY);
    this.state.set(this.defaultState());
  }
}

