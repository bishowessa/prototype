import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PriceRangeInputComponent } from '../../components/price-range-input.component';
import { PrimaryUseInputComponent } from '../../components/primary-use-input.component';
import { PhoneScreenSizeInputComponent } from '../../components/phone-screen-size-input.component';
import { StorageCapacityInputComponent } from '../../components/storage-capacity-input.component';
import { BaseDevicePreferencesComponent } from '../../components/base-device-preferences/base-device-preferences.component';
import { PhonePreferencesPayload } from '@app/shared/models/device-preferences.model';
import { PreferenceFormBuilder } from '../../utils/preference-form-builder';
import { OnboardingStateService } from '@app/core/services/onboarding-state.service';
import { DEVICE_STRATEGIES } from '../../strategies/device-preference-strategy';
import {
  PrimaryUseOption,
  PhoneScreenSizeOption,
  StorageCapacityOption,
  PriceRangeOption,
} from '@app/shared/models/preference-options.model';

@Component({
  selector: 'app-onboarding-phone-preferences-step',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BaseDevicePreferencesComponent,
    PrimaryUseInputComponent,
    PhoneScreenSizeInputComponent,
    StorageCapacityInputComponent,
    PriceRangeInputComponent,
  ],
  templateUrl: './onboarding-phone-preferences-step.component.html',
})
export class OnboardingPhonePreferencesStepComponent implements OnInit {
  @Input() submitLabel = 'Next Step';
  @Input() submitIcon = 'arrow_forward';
  @Input() isSaving = false;
  @Output() readonly save = new EventEmitter<PhonePreferencesPayload>();

  private readonly onboardingState = inject(OnboardingStateService);
  private readonly strategy = DEVICE_STRATEGIES['phone'];

  protected form!: FormGroup;

  ngOnInit(): void {
    // Load existing preferences or use defaults
    const existingPreferences = this.strategy.loadPreferences(this.onboardingState.getState());
    const defaults: Partial<PhonePreferencesPayload> = existingPreferences || {
      primaryUse: 'gaming',
      screenSize: 'standard',
      storage: '256',
      priceRange: '500-1000',
    };

    // Build form with defaults
    this.form = PreferenceFormBuilder.buildPhoneForm(defaults);
  }

  protected get primaryUse(): PrimaryUseOption {
    return (this.form.get('primaryUse')?.value ?? 'gaming') as PrimaryUseOption;
  }

  protected get screenSize(): PhoneScreenSizeOption {
    return (this.form.get('screenSize')?.value ?? 'standard') as PhoneScreenSizeOption;
  }

  protected get storage(): StorageCapacityOption {
    return (this.form.get('storage')?.value ?? '256') as StorageCapacityOption;
  }

  protected get priceRange(): PriceRangeOption {
    return (this.form.get('priceRange')?.value ?? '500-1000') as PriceRangeOption;
  }

  protected onPrimaryUseChange(value: string): void {
    this.form.patchValue({ primaryUse: value });
  }

  protected onScreenSizeChange(value: string): void {
    this.form.patchValue({ screenSize: value });
  }

  protected onStorageChange(value: string): void {
    this.form.patchValue({ storage: value });
  }

  protected onPriceRangeChange(value: string): void {
    this.form.patchValue({ priceRange: value });
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value as PhonePreferencesPayload);
    }
  }
}
