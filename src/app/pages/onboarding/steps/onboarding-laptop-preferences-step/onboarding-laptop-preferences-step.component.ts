import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BatteryPerformanceInputComponent } from '../../components/battery-performance-input.component';
import { RamChoiceInputComponent } from '../../components/ram-choice-input.component';
import { DisplaySizeInputComponent } from '../../components/display-size-input.component';
import { PriceRangeInputComponent } from '../../components/price-range-input.component';
import { BaseDevicePreferencesComponent } from '../../components/base-device-preferences/base-device-preferences.component';
import { LaptopPreferencesPayload } from '@app/shared/models/device-preferences.model';
import { PreferenceFormBuilder } from '../../utils/preference-form-builder';
import { OnboardingStateService } from '@app/core/services/onboarding-state.service';
import { DevicePreferenceStrategy } from '@app/shared/models/device-preferences.model';
import { DEVICE_STRATEGIES } from '../../strategies/device-preference-strategy';
import {
  RamOption,
  DisplaySizeOption,
  PriceRangeOption,
} from '@app/shared/models/preference-options.model';

@Component({
  selector: 'app-onboarding-laptop-preferences-step',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BaseDevicePreferencesComponent,
    BatteryPerformanceInputComponent,
    RamChoiceInputComponent,
    DisplaySizeInputComponent,
    PriceRangeInputComponent,
  ],
  templateUrl: './onboarding-laptop-preferences-step.component.html',
})
export class OnboardingLaptopPreferencesStepComponent implements OnInit {
  @Output() readonly save = new EventEmitter<LaptopPreferencesPayload>();

  private readonly onboardingState = inject(OnboardingStateService);
  private readonly strategy: DevicePreferenceStrategy = DEVICE_STRATEGIES['laptop'];

  protected form!: FormGroup;

  ngOnInit(): void {
    // Load existing preferences or use defaults
    const existingPreferences = this.strategy.loadPreferences(this.onboardingState.getState());
    const defaults: Partial<LaptopPreferencesPayload> = existingPreferences || {
      batteryPriority: 50,
      ramOption: '16',
      displaySize: '15-16',
      priceRange: '500-1000',
    };

    // Build form with defaults
    this.form = PreferenceFormBuilder.buildLaptopForm(defaults);
  }

  protected get batteryPriority(): number {
    return this.form.get('batteryPriority')?.value ?? 50;
  }

  protected get ramOption(): RamOption {
    return (this.form.get('ramOption')?.value ?? '16') as RamOption;
  }

  protected get displaySize(): DisplaySizeOption {
    return (this.form.get('displaySize')?.value ?? '15-16') as DisplaySizeOption;
  }

  protected get priceRange(): PriceRangeOption {
    return (this.form.get('priceRange')?.value ?? '500-1000') as PriceRangeOption;
  }

  protected onBatteryPriorityChange(value: number): void {
    this.form.patchValue({ batteryPriority: value });
  }

  protected onRamOptionChange(value: string): void {
    this.form.patchValue({ ramOption: value });
  }

  protected onDisplaySizeChange(value: string): void {
    this.form.patchValue({ displaySize: value });
  }

  protected onPriceRangeChange(value: string): void {
    this.form.patchValue({ priceRange: value });
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value as LaptopPreferencesPayload);
    }
  }
}
