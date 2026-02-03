import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { OnboardingStateService } from '@app/core/services/onboarding-state.service';
import { AccordionComponent } from '@app/shared/components/accordion/accordion.component';
import {
  HeadphonesPreferencesContentComponent,
  HeadphonesPreferencesPayload,
} from '../../components/headphones-preferences-content.component';
import {
  MousePreferencesContentComponent,
  MousePreferencesPayload,
} from '../../components/mouse-preferences-content.component';
import {
  KeyboardPreferencesContentComponent,
  KeyboardPreferencesPayload,
} from '../../components/keyboard-preferences-content.component';
import {
  ChargerPreferencesContentComponent,
  ChargerPreferencesPayload,
} from '../../components/charger-preferences-content.component';

@Component({
  selector: 'app-onboarding-accessory-preferences-step',
  standalone: true,
  imports: [
    AccordionComponent,
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

  protected showHeadphones = false;
  protected showMouse = false;
  protected showKeyboard = false;
  protected showCharger = false;

  protected headphonesValue: HeadphonesPreferencesPayload = {
    feature: 'noise-cancelling',
    budget: 'medium',
  };
  protected mouseValue: MousePreferencesPayload = {
    profile: 'office',
    budget: 'medium',
  };
  protected keyboardValue: KeyboardPreferencesPayload = {
    type: 'silent',
    budget: 'medium',
  };
  protected chargerValue: ChargerPreferencesPayload = {
    feature: 'multi-port',
    budget: 'medium',
  };

  protected skippedAccessories = new Set<string>();

  ngOnInit(): void {
    const state = this.onboardingState.getState();
    const selectedDevices = state.selectedDevices;

    this.showHeadphones = selectedDevices.includes('headphones');
    this.showMouse = selectedDevices.includes('mouse');
    this.showKeyboard = selectedDevices.includes('keyboard');
    this.showCharger = selectedDevices.includes('charger');

    // Only auto-advance if NO accessories are selected
    // If accessories are selected, show the step even if they're already configured
    const hasAnyAccessories = this.showHeadphones || this.showMouse || this.showKeyboard || this.showCharger;
    if (!hasAnyAccessories) {
      // No accessories selected, skip this step
      this.continue.emit();
      return;
    }

    // Load existing preferences if available
    this.loadExistingPreferences(state);
  }

  private loadExistingPreferences(state: ReturnType<OnboardingStateService['getState']>): void {
    if (this.showHeadphones && state.variants['headphones']?.[0]?.data) {
      this.headphonesValue = state.variants['headphones'][0].data as HeadphonesPreferencesPayload;
    }
    if (this.showMouse && state.variants['mouse']?.[0]?.data) {
      this.mouseValue = state.variants['mouse'][0].data as MousePreferencesPayload;
    }
    if (this.showKeyboard && state.variants['keyboard']?.[0]?.data) {
      this.keyboardValue = state.variants['keyboard'][0].data as KeyboardPreferencesPayload;
    }
    if (this.showCharger && state.variants['charger']?.[0]?.data) {
      this.chargerValue = state.variants['charger'][0].data as ChargerPreferencesPayload;
    }
  }

  protected onBack(): void {
    this.back.emit();
  }

  protected onNext(): void {
    // Save preferences for non-skipped accessories
    if (this.showHeadphones && !this.skippedAccessories.has('headphones')) {
      this.onboardingState.upsertVariant('headphones', null, this.headphonesValue, 'finished');
    }
    if (this.showMouse && !this.skippedAccessories.has('mouse')) {
      this.onboardingState.upsertVariant('mouse', null, this.mouseValue, 'finished');
    }
    if (this.showKeyboard && !this.skippedAccessories.has('keyboard')) {
      this.onboardingState.upsertVariant('keyboard', null, this.keyboardValue, 'finished');
    }
    if (this.showCharger && !this.skippedAccessories.has('charger')) {
      this.onboardingState.upsertVariant('charger', null, this.chargerValue, 'finished');
    }

    this.continue.emit();
  }

  private checkIfAllSkipped(): void {
    // Check if all selected accessories are skipped
    const allSkipped =
      (!this.showHeadphones || this.skippedAccessories.has('headphones')) &&
      (!this.showMouse || this.skippedAccessories.has('mouse')) &&
      (!this.showKeyboard || this.skippedAccessories.has('keyboard')) &&
      (!this.showCharger || this.skippedAccessories.has('charger'));

    if (allSkipped) {
      // All accessories are skipped, auto-advance to next step
      this.continue.emit();
    }
  }

  protected onSkipHeadphones(): void {
    this.skippedAccessories.add('headphones');
    // Reset form values
    this.headphonesValue = {
      feature: 'noise-cancelling',
      budget: 'medium',
    };
    this.checkIfAllSkipped();
  }

  protected onSkipMouse(): void {
    this.skippedAccessories.add('mouse');
    // Reset form values
    this.mouseValue = {
      profile: 'office',
      budget: 'medium',
    };
    this.checkIfAllSkipped();
  }

  protected onSkipKeyboard(): void {
    this.skippedAccessories.add('keyboard');
    // Reset form values
    this.keyboardValue = {
      type: 'silent',
      budget: 'medium',
    };
    this.checkIfAllSkipped();
  }

  protected onSkipCharger(): void {
    this.skippedAccessories.add('charger');
    // Reset form values
    this.chargerValue = {
      feature: 'multi-port',
      budget: 'medium',
    };
    this.checkIfAllSkipped();
  }

  protected get shouldShowHeadphones(): boolean {
    return this.showHeadphones && !this.skippedAccessories.has('headphones');
  }

  protected get shouldShowMouse(): boolean {
    return this.showMouse && !this.skippedAccessories.has('mouse');
  }

  protected get shouldShowKeyboard(): boolean {
    return this.showKeyboard && !this.skippedAccessories.has('keyboard');
  }

  protected get shouldShowCharger(): boolean {
    return this.showCharger && !this.skippedAccessories.has('charger');
  }

  protected onHeadphonesChange(value: HeadphonesPreferencesPayload): void {
    this.headphonesValue = value;
  }

  protected onMouseChange(value: MousePreferencesPayload): void {
    this.mouseValue = value;
  }

  protected onKeyboardChange(value: KeyboardPreferencesPayload): void {
    this.keyboardValue = value;
  }

  protected onChargerChange(value: ChargerPreferencesPayload): void {
    this.chargerValue = value;
  }
}
