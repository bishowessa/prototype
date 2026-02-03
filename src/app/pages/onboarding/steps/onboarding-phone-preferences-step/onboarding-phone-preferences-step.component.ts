import { Component, EventEmitter, Output } from '@angular/core';
import { PriceRangeInputComponent, PriceRangeOption } from '../../components/price-range-input.component';
import { PrimaryUseInputComponent, PrimaryUseOption } from '../../components/primary-use-input.component';
import { PhoneScreenSizeInputComponent, PhoneScreenSizeOption } from '../../components/phone-screen-size-input.component';
import { StorageCapacityInputComponent, StorageCapacityOption } from '../../components/storage-capacity-input.component';

export interface PhonePreferencesPayload {
  primaryUse: PrimaryUseOption;
  screenSize: PhoneScreenSizeOption;
  storage: StorageCapacityOption;
  priceRange: PriceRangeOption;
}

@Component({
  selector: 'app-onboarding-phone-preferences-step',
  standalone: true,
  imports: [
    PrimaryUseInputComponent,
    PhoneScreenSizeInputComponent,
    StorageCapacityInputComponent,
    PriceRangeInputComponent,
  ],
  templateUrl: './onboarding-phone-preferences-step.component.html',
})
export class OnboardingPhonePreferencesStepComponent {
  @Output() readonly save = new EventEmitter<PhonePreferencesPayload>();

  protected primaryUse: PhonePreferencesPayload['primaryUse'] = 'gaming';
  protected screenSize: PhonePreferencesPayload['screenSize'] = 'standard';
  protected storage: PhonePreferencesPayload['storage'] = '256';
  protected priceRange: PhonePreferencesPayload['priceRange'] = '500-1000';

  protected onSubmit(): void {
    this.save.emit({
      primaryUse: this.primaryUse,
      screenSize: this.screenSize,
      storage: this.storage,
      priceRange: this.priceRange,
    });
  }
}

