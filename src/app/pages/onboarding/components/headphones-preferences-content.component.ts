import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccessoryFeatureSelectComponent } from './accessory-feature-select.component';
import { AccessoryBudgetInputComponent, AccessoryBudgetOption } from './accessory-budget-input.component';
import { FormSelectOption } from '@app/shared/components/form-select-group/form-select-group.component';

export type HeadphonesFeatureOption = 'noise-cancelling' | 'wireless' | 'over-ear';

export interface HeadphonesPreferencesPayload {
  feature: HeadphonesFeatureOption;
  budget: AccessoryBudgetOption;
}

@Component({
  selector: 'app-headphones-preferences-content',
  standalone: true,
  imports: [AccessoryFeatureSelectComponent, AccessoryBudgetInputComponent],
  templateUrl: './headphones-preferences-content.component.html',
})
export class HeadphonesPreferencesContentComponent {
  @Input() value: HeadphonesPreferencesPayload = {
    feature: 'noise-cancelling',
    budget: 'medium',
  };
  @Output() readonly valueChange = new EventEmitter<HeadphonesPreferencesPayload>();

  protected readonly featureOptions: FormSelectOption[] = [
    { value: 'noise-cancelling', title: 'Noise Cancelling', icon: 'noise_control_off' },
    { value: 'wireless', title: 'Wireless', icon: 'mobile_share' },
    { value: 'over-ear', title: 'Over-ear', icon: 'hearing' },
  ];

  protected onFeatureChange(feature: string): void {
    this.value = { ...this.value, feature: feature as HeadphonesFeatureOption };
    this.valueChange.emit(this.value);
  }

  protected onBudgetChange(budget: AccessoryBudgetOption): void {
    this.value = { ...this.value, budget };
    this.valueChange.emit(this.value);
  }
}
