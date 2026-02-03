import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccessoryFeatureSelectComponent } from './accessory-feature-select.component';
import { AccessoryBudgetInputComponent } from './accessory-budget-input.component';
import { FormSelectOption } from '@app/shared/components/form-select-group/form-select-group.component';
import {
  ChargerPreferencesPayload,
  ChargerFeatureOption,
} from '@app/shared/models/accessory-preferences.model';
import { AccessoryBudgetOption } from '@app/shared/models/preference-options.model';

@Component({
  selector: 'app-charger-preferences-content',
  standalone: true,
  imports: [AccessoryFeatureSelectComponent, AccessoryBudgetInputComponent],
  templateUrl: './charger-preferences-content.component.html',
})
export class ChargerPreferencesContentComponent {
  @Input() value: ChargerPreferencesPayload = {
    feature: 'multi-port',
    budget: 'medium',
  };
  @Output() readonly valueChange = new EventEmitter<ChargerPreferencesPayload>();

  protected readonly featureOptions: FormSelectOption[] = [
    { value: 'fast-charging', title: 'Fast Charging', icon: 'bolt' },
    { value: 'multi-port', title: 'Multi-port', icon: 'input_circle' },
    { value: 'travel-friendly', title: 'Travel Friendly', icon: 'flight' },
  ];

  protected onFeatureChange(feature: string): void {
    this.value = { ...this.value, feature: feature as ChargerFeatureOption };
    this.valueChange.emit(this.value);
  }

  protected onBudgetChange(budget: AccessoryBudgetOption): void {
    this.value = { ...this.value, budget };
    this.valueChange.emit(this.value);
  }
}
