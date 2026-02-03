import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from '@app/core/services/storage.service';

export type OnboardingVariantStatus = 'unfinished' | 'finished';

export interface OnboardingVariant<T = unknown> {
  status: OnboardingVariantStatus;
  data: T;
}

export interface OnboardingState {
  currentStep: number;
  selectedDevices: string[];
  variants: Record<string, OnboardingVariant[]>;
}

const ONBOARDING_STATE_KEY = 'onboarding_state';
const ONBOARDING_STEP_KEY = 'onboarding_step';

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
      currentStep: 1,
      selectedDevices: [],
      variants: {},
    };
  }

  getState(): OnboardingState {
    if (!this.isBrowser) {
      return this.defaultState();
    }
    const stored = this.storage.getItem<OnboardingState>(ONBOARDING_STATE_KEY);
    return stored ?? this.defaultState();
  }

  private saveState(state: OnboardingState): void {
    if (!this.isBrowser) return;
    this.storage.setItem(ONBOARDING_STATE_KEY, state);
  }

  getCurrentStep(): number {
    if (!this.isBrowser) {
      return 1;
    }
    const state = this.getState();
    const stepFromState = state.currentStep || 1;
    const stepFromKey = this.storage.getItem<number>(ONBOARDING_STEP_KEY) ?? stepFromState;
    return stepFromKey || 1;
  }

  setCurrentStep(step: number): void {
    if (!this.isBrowser) return;
    const state = this.getState();
    const next: OnboardingState = {
      ...state,
      currentStep: step,
    };
    this.saveState(next);
    this.storage.setItem(ONBOARDING_STEP_KEY, step);
  }

  setSelectedDevices(devices: string[]): void {
    if (!this.isBrowser) return;
    const state = this.getState();
    const next: OnboardingState = {
      ...state,
      selectedDevices: [...devices],
    };
    this.saveState(next);
  }

  upsertVariant<T = unknown>(
    deviceType: string,
    variantIndex: number | null,
    payload: T,
    status: OnboardingVariantStatus,
  ): void {
    if (!this.isBrowser) return;
    const state = this.getState();
    const existingForType = (state.variants[deviceType] ?? []) as OnboardingVariant<T>[];

    let nextForType: OnboardingVariant<T>[];
    if (variantIndex === null || variantIndex < 0 || variantIndex >= existingForType.length) {
      nextForType = [...existingForType, { status, data: payload }];
    } else {
      nextForType = existingForType.map((v, i) =>
        i === variantIndex ? { status, data: payload } : v,
      );
    }

    const next: OnboardingState = {
      ...state,
      variants: {
        ...state.variants,
        [deviceType]: nextForType,
      },
    };

    this.saveState(next);
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
}

