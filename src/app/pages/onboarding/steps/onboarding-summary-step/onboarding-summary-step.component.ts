import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingStateService } from '@app/core/services/onboarding-state.service';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { LaptopPreferencesPayload } from '../onboarding-laptop-preferences-step/onboarding-laptop-preferences-step.component';
import { PhonePreferencesPayload } from '../onboarding-phone-preferences-step/onboarding-phone-preferences-step.component';
import {
  HeadphonesPreferencesPayload,
} from '../../components/headphones-preferences-content.component';
import { MousePreferencesPayload } from '../../components/mouse-preferences-content.component';
import { KeyboardPreferencesPayload } from '../../components/keyboard-preferences-content.component';
import { ChargerPreferencesPayload } from '../../components/charger-preferences-content.component';

interface DeviceSummary {
  type: string;
  icon: string;
  title: string;
  tags: string[];
}

@Component({
  selector: 'app-onboarding-summary-step',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './onboarding-summary-step.component.html',
})
export class OnboardingSummaryStepComponent implements OnInit {
  private readonly onboardingState = inject(OnboardingStateService);
  private readonly router = inject(Router);

  protected deviceSummaries: DeviceSummary[] = [];

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
      summaries.push({
        type: 'laptop',
        icon: 'laptop_mac',
        title: 'Laptop Profile',
        tags,
      });
    }

    // Phone summary
    const phoneVariant = state.variants['phone']?.[0]?.data as PhonePreferencesPayload | undefined;
    if (phoneVariant) {
      const tags = this.formatPhoneTags(phoneVariant);
      summaries.push({
        type: 'phone',
        icon: 'smartphone',
        title: 'Smartphone Profile',
        tags,
      });
    }

    // Accessories summaries
    const headphonesVariant = state.variants['headphones']?.[0]?.data as HeadphonesPreferencesPayload | undefined;
    if (headphonesVariant) {
      const tags = this.formatHeadphonesTags(headphonesVariant);
      summaries.push({
        type: 'headphones',
        icon: 'headphones',
        title: 'Headphones',
        tags,
      });
    }

    const mouseVariant = state.variants['mouse']?.[0]?.data as MousePreferencesPayload | undefined;
    if (mouseVariant) {
      const tags = this.formatMouseTags(mouseVariant);
      summaries.push({
        type: 'mouse',
        icon: 'mouse',
        title: 'Mouse',
        tags,
      });
    }

    const keyboardVariant = state.variants['keyboard']?.[0]?.data as KeyboardPreferencesPayload | undefined;
    if (keyboardVariant) {
      const tags = this.formatKeyboardTags(keyboardVariant);
      summaries.push({
        type: 'keyboard',
        icon: 'keyboard',
        title: 'Keyboard',
        tags,
      });
    }

    const chargerVariant = state.variants['charger']?.[0]?.data as ChargerPreferencesPayload | undefined;
    if (chargerVariant) {
      const tags = this.formatChargerTags(chargerVariant);
      summaries.push({
        type: 'charger',
        icon: 'power',
        title: 'Charger',
        tags,
      });
    }

    this.deviceSummaries = summaries;
  }

  private formatLaptopTags(payload: LaptopPreferencesPayload): string[] {
    const tags: string[] = [];

    // RAM
    tags.push(`${payload.ramOption}GB RAM`);

    // Display size
    const displayMap: Record<string, string> = {
      '13-14': '13"-14" Display',
      '15-16': '15"-16" Display',
      '17-plus': '17"+ Display',
      '2-in-1': '2-in-1 Convertible',
    };
    tags.push(displayMap[payload.displaySize] || payload.displaySize);

    // Price range
    const priceMap: Record<string, string> = {
      'under-500': 'Budget: Under $500',
      '500-1000': 'Budget: $500-$1,000',
      '1000-1500': 'Budget: $1,000-$1,500',
      '1500-plus': 'Budget: $1,500+',
    };
    tags.push(priceMap[payload.priceRange] || payload.priceRange);

    // Battery vs Performance
    if (payload.batteryPriority <= 33) {
      tags.push('Long Battery Life');
    } else if (payload.batteryPriority >= 67) {
      tags.push('High Performance');
    } else {
      tags.push('Balanced');
    }

    return tags;
  }

  private formatPhoneTags(payload: PhonePreferencesPayload): string[] {
    const tags: string[] = [];

    // Primary use
    const useMap: Record<string, string> = {
      photography: 'Photography Expert',
      gaming: 'Gaming Focus',
      'daily-tasks': 'Daily Tasks',
      'content-creation': 'Content Creation',
    };
    tags.push(useMap[payload.primaryUse] || payload.primaryUse);

    // Storage
    tags.push(`${payload.storage}GB Storage`);

    // Screen size
    const screenMap: Record<string, string> = {
      compact: 'Compact Size',
      standard: 'Standard Size',
      large: 'Large Screen',
    };
    tags.push(screenMap[payload.screenSize] || payload.screenSize);

    // Price range
    const priceMap: Record<string, string> = {
      'under-500': 'Budget: Under $500',
      '500-1000': 'Budget: $500-$1,000',
      '1000-1500': 'Budget: $1,000-$1,500',
      '1500-plus': 'Budget: $1,500+',
    };
    tags.push(priceMap[payload.priceRange] || payload.priceRange);

    return tags;
  }

  private formatHeadphonesTags(payload: HeadphonesPreferencesPayload): string[] {
    const tags: string[] = [];

    const featureMap: Record<string, string> = {
      'noise-cancelling': 'Noise Cancelling',
      wireless: 'Wireless',
      'over-ear': 'Over-ear',
    };
    tags.push(featureMap[payload.feature] || payload.feature);

    const budgetMap: Record<string, string> = {
      low: 'Budget: $',
      medium: 'Budget: $$',
      high: 'Budget: $$$',
    };
    tags.push(budgetMap[payload.budget] || payload.budget);

    return tags;
  }

  private formatMouseTags(payload: MousePreferencesPayload): string[] {
    const tags: string[] = [];

    const profileMap: Record<string, string> = {
      gaming: 'Gaming',
      office: 'Office',
      ergonomic: 'Ergonomic',
    };
    tags.push(profileMap[payload.profile] || payload.profile);

    const budgetMap: Record<string, string> = {
      low: 'Budget: $',
      medium: 'Budget: $$',
      high: 'Budget: $$$',
    };
    tags.push(budgetMap[payload.budget] || payload.budget);

    return tags;
  }

  private formatKeyboardTags(payload: KeyboardPreferencesPayload): string[] {
    const tags: string[] = [];

    const typeMap: Record<string, string> = {
      mechanical: 'Mechanical',
      silent: 'Silent',
      backlit: 'Backlit',
    };
    tags.push(typeMap[payload.type] || payload.type);

    const budgetMap: Record<string, string> = {
      low: 'Budget: $',
      medium: 'Budget: $$',
      high: 'Budget: $$$',
    };
    tags.push(budgetMap[payload.budget] || payload.budget);

    return tags;
  }

  private formatChargerTags(payload: ChargerPreferencesPayload): string[] {
    const tags: string[] = [];

    const featureMap: Record<string, string> = {
      'fast-charging': 'Fast Charging',
      'multi-port': 'Multi-port',
      'travel-friendly': 'Travel Friendly',
    };
    tags.push(featureMap[payload.feature] || payload.feature);

    const budgetMap: Record<string, string> = {
      low: 'Budget: $',
      medium: 'Budget: $$',
      high: 'Budget: $$$',
    };
    tags.push(budgetMap[payload.budget] || payload.budget);

    return tags;
  }

  protected onFinish(): void {
    // Navigate to products/dashboard
    this.router.navigate(['/']);
  }
}
