import { Component, EventEmitter, OnInit, Output, inject, signal, computed } from '@angular/core';
import { OnboardingStateService } from '@app/core/services/onboarding-state.service';
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

  protected readonly configs = ACCESSORY_CONFIGS;
  protected readonly accessoryStates = signal<Map<string, AccessoryState>>(new Map());

  protected readonly visibleAccessories = computed(() => {
    return this.configs.filter(config => {
      const state = this.accessoryStates().get(config.key);
      return state?.show && !state?.skipped;
    });
  });

  ngOnInit(): void {
    const state = this.onboardingState.getState();
    const selectedDevices = state.selectedDevices;

    const newMap = new Map<string, AccessoryState>();
    
    this.configs.forEach(config => {
      const show = selectedDevices.includes(config.key);
      const existingValue = state.variants[config.key]?.[0]?.data;
      
      newMap.set(config.key, {
        show,
        skipped: false,
        value: (existingValue || config.defaultValues) as AccessoryPreferencesPayload,
      });
    });

    this.accessoryStates.set(newMap);

    // Auto-advance if no accessories are selected
    const hasAnyAccessories = Array.from(newMap.values()).some(v => v.show);
    if (!hasAnyAccessories) {
      this.continue.emit();
      return;
    }
  }

  protected getAccessoryState(key: string): AccessoryState | undefined {
    return this.accessoryStates().get(key);
  }

  /**
   * Always returns a concrete payload for the given accessory key.
   * Falls back to the config's defaultValues so templates never see `undefined`.
   */
  protected getAccessoryValue(key: string): AccessoryPreferencesPayload {
    const stateValue = this.accessoryStates().get(key)?.value;
    if (stateValue) {
      return stateValue;
    }

    const config = this.configs.find(c => c.key === key);
    return (config?.defaultValues ?? {}) as AccessoryPreferencesPayload;
  }

  /**
   * Type-safe getters for each accessory type
   */
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

  protected onSkip(key: string): void {
    const map = new Map(this.accessoryStates());
    const state = map.get(key);
    const config = this.configs.find(c => c.key === key);
    
    if (state && config) {
      map.set(key, {
        ...state,
        skipped: true,
        value: config.defaultValues,
      });
      this.accessoryStates.set(map);
      this.checkIfAllSkipped();
    }
  }

  protected onValueChange(key: string, value: AccessoryPreferencesPayload): void {
    const map = new Map(this.accessoryStates());
    const state = map.get(key);
    
    if (state) {
      map.set(key, { ...state, value });
      this.accessoryStates.set(map);
    }
  }

  protected onBack(): void {
    this.back.emit();
  }

  protected onNext(): void {
    const map = this.accessoryStates();
    
    // Save preferences for non-skipped accessories
    map.forEach((state, key) => {
      if (state.show && !state.skipped) {
        this.onboardingState.upsertVariant(key, null, state.value, 'finished');
      }
    });

    this.continue.emit();
  }

  private checkIfAllSkipped(): void {
    const map = this.accessoryStates();
    const allSkipped = Array.from(map.values()).every(
      state => !state.show || state.skipped
    );

    if (allSkipped) {
      this.continue.emit();
    }
  }
}
