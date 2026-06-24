import { Component, OnInit, inject, effect, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OnboardingStateService } from '@app/core/services/onboarding-state.service';
import { AuthService } from '@app/core/services/auth.service'; // <-- NEW: Added AuthService
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { LaptopPreferencesPayload, PhonePreferencesPayload } from '@app/shared/models/device-preferences.model';
import {
  HeadphonesPreferencesPayload,
  MousePreferencesPayload,
  KeyboardPreferencesPayload,
  ChargerPreferencesPayload,
} from '@app/shared/models/accessory-preferences.model';
import { DeviceSummary } from '@app/shared/models/device-options.model';

@Component({
  selector: 'app-onboarding-summary-step',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './onboarding-summary-step.component.html',
})
export class OnboardingSummaryStepComponent implements OnInit {
  private readonly onboardingState = inject(OnboardingStateService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected deviceSummaries: DeviceSummary[] = [];
  
  // NEW: UI State signals for the submission process
  isSubmitting = signal(false);
  submitError = signal('');

  constructor() {
    effect(() => {
      this.onboardingState.state$();
      this.loadSummaries();
    });
  }

  ngOnInit(): void {
    this.loadSummaries();
  }

  private loadSummaries(): void {
    const state = this.onboardingState.getState();
    const summaries: DeviceSummary[] = [];

    // Laptop summary
    const laptopVariant = state.variants['laptop']?.[0]?.data as LaptopPreferencesPayload | undefined;
    if (laptopVariant) {
      const tags = this.formatLaptopTags(laptopVariant);
      summaries.push({ type: 'laptop', icon: 'laptop_mac', title: 'Laptop Profile', tags });
    }

    // Phone summary
    const phoneVariant = state.variants['phone']?.[0]?.data as PhonePreferencesPayload | undefined;
    if (phoneVariant) {
      const tags = this.formatPhoneTags(phoneVariant);
      summaries.push({ type: 'phone', icon: 'smartphone', title: 'Smartphone Profile', tags });
    }

    // Accessories summaries
    const headphonesVariant = state.variants['headphones']?.[0]?.data as HeadphonesPreferencesPayload | undefined;
    if (headphonesVariant) {
      const tags = this.formatHeadphonesTags(headphonesVariant);
      summaries.push({ type: 'headphones', icon: 'headphones', title: 'Headphones', tags });
    }

    const mouseVariant = state.variants['mouse']?.[0]?.data as MousePreferencesPayload | undefined;
    if (mouseVariant) {
      const tags = this.formatMouseTags(mouseVariant);
      summaries.push({ type: 'mouse', icon: 'mouse', title: 'Mouse', tags });
    }

    const keyboardVariant = state.variants['keyboard']?.[0]?.data as KeyboardPreferencesPayload | undefined;
    if (keyboardVariant) {
      const tags = this.formatKeyboardTags(keyboardVariant);
      summaries.push({ type: 'keyboard', icon: 'keyboard', title: 'Keyboard', tags });
    }

    const chargerVariant = state.variants['charger']?.[0]?.data as ChargerPreferencesPayload | undefined;
    if (chargerVariant) {
      const tags = this.formatChargerTags(chargerVariant);
      summaries.push({ type: 'charger', icon: 'power', title: 'Charger', tags });
    }

    this.deviceSummaries = summaries;
  }

  // --- Formatting Helpers (Unchanged) ---
  private formatLaptopTags(payload: LaptopPreferencesPayload): string[] {
    const tags: string[] = [`${payload.ramOption}GB RAM`];
    const displayMap: Record<string, string> = { '13-14': '13"-14" Display', '15-16': '15"-16" Display', '17-plus': '17"+ Display', '2-in-1': '2-in-1 Convertible' };
    tags.push(displayMap[payload.displaySize] || payload.displaySize);
    const priceMap: Record<string, string> = { 'under-500': 'Budget: Under $500', '500-1000': 'Budget: $500-$1,000', '1000-1500': 'Budget: $1,000-$1,500', '1500-plus': 'Budget: $1,500+' };
    tags.push(priceMap[payload.priceRange] || payload.priceRange);
    if (payload.batteryPriority <= 33) tags.push('Long Battery Life');
    else if (payload.batteryPriority >= 67) tags.push('High Performance');
    else tags.push('Balanced');
    return tags;
  }

  private formatPhoneTags(payload: PhonePreferencesPayload): string[] {
    const tags: string[] = [];
    const useMap: Record<string, string> = { photography: 'Photography Expert', gaming: 'Gaming Focus', 'daily-tasks': 'Daily Tasks', 'content-creation': 'Content Creation' };
    tags.push(useMap[payload.primaryUse] || payload.primaryUse);
    tags.push(`${payload.storage}GB Storage`);
    const screenMap: Record<string, string> = { compact: 'Compact Size', standard: 'Standard Size', large: 'Large Screen' };
    tags.push(screenMap[payload.screenSize] || payload.screenSize);
    const priceMap: Record<string, string> = { 'under-500': 'Budget: Under $500', '500-1000': 'Budget: $500-$1,000', '1000-1500': 'Budget: $1,000-$1,500', '1500-plus': 'Budget: $1,500+' };
    tags.push(priceMap[payload.priceRange] || payload.priceRange);
    return tags;
  }

  private formatHeadphonesTags(payload: HeadphonesPreferencesPayload): string[] {
    return [
      ({ 'noise-cancelling': 'Noise Cancelling', wireless: 'Wireless', 'over-ear': 'Over-ear' } as Record<string, string>)[payload.feature] || payload.feature,
      ({ low: 'Budget: $', medium: 'Budget: $$', high: 'Budget: $$$' } as Record<string, string>)[payload.budget] || payload.budget
    ];
  }

  private formatMouseTags(payload: MousePreferencesPayload): string[] {
    return [
      ({ gaming: 'Gaming', office: 'Office', ergonomic: 'Ergonomic' } as Record<string, string>)[payload.profile] || payload.profile,
      ({ low: 'Budget: $', medium: 'Budget: $$', high: 'Budget: $$$' } as Record<string, string>)[payload.budget] || payload.budget
    ];
  }

  private formatKeyboardTags(payload: KeyboardPreferencesPayload): string[] {
    return [
      ({ mechanical: 'Mechanical', silent: 'Silent', backlit: 'Backlit' } as Record<string, string>)[payload.type] || payload.type,
      ({ low: 'Budget: $', medium: 'Budget: $$', high: 'Budget: $$$' } as Record<string, string>)[payload.budget] || payload.budget
    ];
  }

  private formatChargerTags(payload: ChargerPreferencesPayload): string[] {
    return [
      ({ 'fast-charging': 'Fast Charging', 'multi-port': 'Multi-port', 'travel-friendly': 'Travel Friendly' } as Record<string, string>)[payload.feature] || payload.feature,
      ({ low: 'Budget: $', medium: 'Budget: $$', high: 'Budget: $$$' } as Record<string, string>)[payload.budget] || payload.budget
    ];
  }

  // --- NEW: THE ACTUAL SUBMISSION LOGIC ---
  protected onFinish(): void {
    this.isSubmitting.set(true);
    this.submitError.set('');

    const state = this.onboardingState.getState();
    const payload = [];

    // Map your frontend string keys to the Database Category IDs
    const categoryIdMap: Record<string, number> = {
      'phone': 1,
      'laptop': 2,
      'headphones': 3,
      'mouse': 4,
      'keyboard': 5,
      'charger': 6
    };

    // Extract real data from the state service
    for (const [categoryKey, variants] of Object.entries(state.variants)) {
      if (variants && variants.length > 0 && variants[0].data) {
        payload.push({
          productCategoryId: categoryIdMap[categoryKey] || 99,
          preferences: JSON.stringify(variants[0].data) // Stringify inner object per backend rule
        });
      }
    }

    // If somehow they skipped everything, just send them home
    if (payload.length === 0) {
      this.router.navigate(['/']);
      return;
    }

    // Send real payload to the backend
    this.authService.savePreferences(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/']); // Redirect to home/dashboard
      },
      error: (err) => {
        console.error('Failed to save preferences:', err);
        this.submitError.set('Failed to save preferences. Please try again.');
        this.isSubmitting.set(false);
      }
    });
  }
}