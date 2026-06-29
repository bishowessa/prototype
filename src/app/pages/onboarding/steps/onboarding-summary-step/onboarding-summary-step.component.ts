import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { OnboardingStateService } from '@app/core/services/onboarding-state.service';
import { PreferenceService } from '@app/core/services/preference.service';
import {
  buildSetPreferenceRequestsFromOnboarding,
  mapSavedPreferencesToOnboardingState,
} from '@app/core/mappers/preference.mapper';
import {
  formatAccessoryBudget,
  formatDevicePriceRange,
} from '../../config/onboarding-budget.labels';
import type { AccessoryBudgetOption, PriceRangeOption } from '@app/shared/models/preference-options.model';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { LaptopPreferencesPayload, PhonePreferencesPayload } from '@app/shared/models/device-preferences.model';
import {
  HeadphonesPreferencesPayload,
  MousePreferencesPayload,
  KeyboardPreferencesPayload,
  ChargerPreferencesPayload,
} from '@app/shared/models/accessory-preferences.model';
import { DeviceSummary, DeviceSummaryStatus, DeviceType } from '@app/shared/models/device-options.model';
import type { OnboardingState } from '@app/shared/models/onboarding-state.model';
import { hasMeaningfulPreferenceData, isBlankPreferencePayload } from '../../utils/onboarding-preference.utils';

const CATEGORY_DEFINITIONS: Array<{
  type: DeviceType;
  icon: string;
  title: string;
  stepIndex: number;
}> = [
  { type: 'laptop', icon: 'laptop_mac', title: 'Laptop', stepIndex: 3 },
  { type: 'phone', icon: 'smartphone', title: 'Smartphone', stepIndex: 3 },
  { type: 'headphones', icon: 'headphones', title: 'Headphones', stepIndex: 4 },
  { type: 'mouse', icon: 'mouse', title: 'Mouse', stepIndex: 4 },
  { type: 'keyboard', icon: 'keyboard', title: 'Keyboard', stepIndex: 4 },
  { type: 'charger', icon: 'power', title: 'Charger', stepIndex: 4 },
];

const SUMMARY_STATUS_LABELS: Record<DeviceSummaryStatus, string> = {
  configured: 'Configured',
  skipped: 'Skipped',
  'not-set': 'Not configured',
};

function sanitizeTag(value: string | null | undefined): string | null {
  const text = (value ?? '').trim();
  if (!text || text === 'undefined' || text === 'null' || text === 'Budget:') {
    return null;
  }
  return text;
}

function compactTags(tags: Array<string | null | undefined>): string[] {
  return tags
    .map((tag) => sanitizeTag(tag))
    .filter((tag): tag is string => tag !== null);
}

function optionalLabel(
  value: string | null | undefined,
  map: Record<string, string>,
): string | null {
  if (value == null || String(value).trim() === '') {
    return null;
  }
  return map[value] ?? String(value).trim();
}

function optionalAccessoryBudget(
  category: DeviceType,
  budget: AccessoryBudgetOption | null | undefined,
): string | null {
  if (budget == null || String(budget).trim() === '') {
    return null;
  }
  return sanitizeTag(formatAccessoryBudget(category, budget));
}

function optionalDeviceBudget(priceRange: PriceRangeOption | null | undefined): string | null {
  if (priceRange == null || String(priceRange).trim() === '') {
    return null;
  }
  return sanitizeTag(formatDevicePriceRange(priceRange));
}

function formatLaptopTags(payload: LaptopPreferencesPayload): Array<string | null> {
  const tags: Array<string | null> = [];
  if (payload.ramOption != null) {
    tags.push(`${payload.ramOption}GB RAM`);
  }
  tags.push(
    optionalLabel(payload.displaySize, {
      '13-14': '13"-14" Display',
      '15-16': '15"-16" Display',
      '17-plus': '17"+ Display',
      '2-in-1': '2-in-1 Convertible',
    }),
  );
  tags.push(optionalDeviceBudget(payload.priceRange));
  if (payload.batteryPriority != null && !Number.isNaN(Number(payload.batteryPriority))) {
    if (payload.batteryPriority <= 33) tags.push('Long Battery Life');
    else if (payload.batteryPriority >= 67) tags.push('High Performance');
    else tags.push('Balanced');
  }
  return tags;
}

function formatPhoneTags(payload: PhonePreferencesPayload): Array<string | null> {
  return [
    optionalLabel(payload.primaryUse, {
      photography: 'Photography Expert',
      gaming: 'Gaming Focus',
      'daily-tasks': 'Daily Tasks',
      'content-creation': 'Content Creation',
    }),
    payload.storage != null ? `${payload.storage}GB Storage` : null,
    optionalLabel(payload.screenSize, {
      compact: 'Compact Size',
      standard: 'Standard Size',
      large: 'Large Screen',
    }),
    optionalDeviceBudget(payload.priceRange),
  ];
}

function formatHeadphonesTags(payload: HeadphonesPreferencesPayload): Array<string | null> {
  return [
    optionalLabel(payload.feature, {
      'noise-cancelling': 'Noise Cancelling',
      wireless: 'Wireless',
      'over-ear': 'Over-ear',
    }),
    optionalAccessoryBudget('headphones', payload.budget),
  ];
}

function formatMouseTags(payload: MousePreferencesPayload): Array<string | null> {
  return [
    optionalLabel(payload.profile, {
      gaming: 'Gaming',
      office: 'Office',
      ergonomic: 'Ergonomic',
    }),
    optionalAccessoryBudget('mouse', payload.budget),
  ];
}

function formatKeyboardTags(payload: KeyboardPreferencesPayload): Array<string | null> {
  return [
    optionalLabel(payload.type, {
      mechanical: 'Mechanical',
      silent: 'Silent',
      backlit: 'Backlit',
    }),
    optionalAccessoryBudget('keyboard', payload.budget),
  ];
}

function formatChargerTags(payload: ChargerPreferencesPayload): Array<string | null> {
  return [
    optionalLabel(payload.feature, {
      'fast-charging': 'Fast Charging',
      'multi-port': 'Multi-port',
      'travel-friendly': 'Travel Friendly',
    }),
    optionalAccessoryBudget('charger', payload.budget),
  ];
}

function formatTagsForCategory(type: DeviceType, data: unknown): Array<string | null> {
  switch (type) {
    case 'laptop':
      return formatLaptopTags(data as LaptopPreferencesPayload);
    case 'phone':
      return formatPhoneTags(data as PhonePreferencesPayload);
    case 'headphones':
      return formatHeadphonesTags(data as HeadphonesPreferencesPayload);
    case 'mouse':
      return formatMouseTags(data as MousePreferencesPayload);
    case 'keyboard':
      return formatKeyboardTags(data as KeyboardPreferencesPayload);
    case 'charger':
      return formatChargerTags(data as ChargerPreferencesPayload);
    default:
      return [];
  }
}

function resolveSummaryStatus(
  type: DeviceType,
  variant: { status: string; data: unknown } | undefined,
  explicitlySkipped: boolean,
): DeviceSummaryStatus {
  if (explicitlySkipped) {
    return 'skipped';
  }
  if (variant?.status === 'finished' && hasMeaningfulPreferenceData(type, variant.data)) {
    return 'configured';
  }
  return 'not-set';
}

function buildDeviceSummaries(state: OnboardingState): DeviceSummary[] {
  const selected = new Set(state.selectedDevices as DeviceType[]);
  const skippedAccessories = new Set(state.skippedAccessories ?? []);

  return CATEGORY_DEFINITIONS.filter((category) => selected.has(category.type)).map((category) => {
    const variant = state.variants[category.type]?.[0];
    const status = resolveSummaryStatus(
      category.type,
      variant,
      skippedAccessories.has(category.type),
    );
    const tags =
      status === 'configured' ? compactTags(formatTagsForCategory(category.type, variant!.data)) : [];

    return {
      type: category.type,
      icon: category.icon,
      title: category.title,
      tags,
      stepIndex: category.stepIndex,
      status,
      statusLabel: SUMMARY_STATUS_LABELS[status],
      configured: status === 'configured',
    };
  });
}

@Component({
  selector: 'app-onboarding-summary-step',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './onboarding-summary-step.component.html',
})
export class OnboardingSummaryStepComponent implements OnInit {
  private readonly onboardingState = inject(OnboardingStateService);
  private readonly preferenceService = inject(PreferenceService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly viewMode = signal(
    this.route.snapshot.queryParamMap.get('view') === 'true',
  );

  protected readonly isLoadingPreferences = signal(false);
  protected readonly preferencesLoadError = signal('');

  protected readonly deviceSummaries = computed(() =>
    buildDeviceSummaries(this.onboardingState.state$()),
  );

  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal('');

  ngOnInit(): void {
    if (this.viewMode()) {
      this.loadPreferencesFromApi();
    }
  }

  protected loadPreferencesFromApi(): void {
    this.isLoadingPreferences.set(true);
    this.preferencesLoadError.set('');

    forkJoin({
      options: this.preferenceService.getOptions(),
      prefs: this.preferenceService.getPreferences(),
    }).subscribe({
      next: ({ options, prefs }) => {
        const hydrated = mapSavedPreferencesToOnboardingState(prefs, options);
        this.onboardingState.hydrateFromSavedPreferences(hydrated);
        this.isLoadingPreferences.set(false);
      },
      error: () => {
        this.onboardingState.hydrateFromSavedPreferences({
          selectedDevices: [],
          variants: {},
          selectedProfileId: null,
          skippedAccessories: [],
        });
        this.preferencesLoadError.set('Could not load your saved preferences. Please try again.');
        this.isLoadingPreferences.set(false);
      },
    });
  }

  protected editCategory(stepIndex: number, deviceType?: DeviceType): void {
    const queryParams: Record<string, string> = {};
    if (deviceType && (stepIndex === 3 || stepIndex === 4)) {
      queryParams['focus'] = deviceType;
    }
    if (this.viewMode()) {
      queryParams['view'] = 'true';
    }
    void this.router.navigate(
      ['/onboarding', stepIndex.toString()],
      { queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined },
    );
  }

  protected goHome(): void {
    void this.router.navigate(['/']);
  }

  protected startPreferenceSetup(): void {
    void this.router.navigate(['/onboarding', '1']);
  }

  protected onFinish(): void {
    this.isSubmitting.set(true);
    this.submitError.set('');

    const state = this.onboardingState.getState();
    const hasPreferences = Object.entries(state.variants).some(([deviceKey, variants]) => {
      const data = variants?.[0]?.data;
      return (
        variants?.length > 0 &&
        !isBlankPreferencePayload(data) &&
        hasMeaningfulPreferenceData(deviceKey as DeviceType, data)
      );
    });

    if (!hasPreferences) {
      this.isSubmitting.set(false);
      void this.router.navigate(['/']);
      return;
    }

    this.preferenceService
      .getOptions()
      .pipe(
        switchMap((options) => {
          const payload = buildSetPreferenceRequestsFromOnboarding(state, options);

          if (payload.length === 0) {
            return of(null);
          }

          console.log('Sending Preferences Payload:', payload);
          return this.preferenceService.savePreferences(payload);
        }),
      )
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          void this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Failed to save preferences:', err);
          this.submitError.set('Failed to save preferences. Please try again.');
          this.isSubmitting.set(false);
        },
      });
  }
}
