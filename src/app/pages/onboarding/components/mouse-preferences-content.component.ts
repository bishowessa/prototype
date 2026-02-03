import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccessoryFeatureSelectComponent } from './accessory-feature-select.component';
import { AccessoryBudgetInputComponent, AccessoryBudgetOption } from './accessory-budget-input.component';
import { FormSelectOption } from '@app/shared/components/form-select-group/form-select-group.component';

export type MouseProfileOption = 'gaming' | 'office' | 'ergonomic';

export interface MousePreferencesPayload {
  profile: MouseProfileOption;
  budget: AccessoryBudgetOption;
}

@Component({
  selector: 'app-mouse-preferences-content',
  standalone: true,
  imports: [AccessoryFeatureSelectComponent, AccessoryBudgetInputComponent],
  templateUrl: './mouse-preferences-content.component.html',
})
export class MousePreferencesContentComponent {
  @Input() value: MousePreferencesPayload = {
    profile: 'office',
    budget: 'medium',
  };
  @Output() readonly valueChange = new EventEmitter<MousePreferencesPayload>();

  protected readonly profileOptions: FormSelectOption[] = [
    { value: 'gaming', title: 'Gaming', icon: 'sports_esports' },
    { value: 'office', title: 'Office', icon: 'apartment' },
    { value: 'ergonomic', title: 'Ergonomic', icon: 'hand_gesture' },
  ];

  protected onProfileChange(profile: string): void {
    this.value = { ...this.value, profile: profile as MouseProfileOption };
    this.valueChange.emit(this.value);
  }

  protected onBudgetChange(budget: AccessoryBudgetOption): void {
    this.value = { ...this.value, budget };
    this.valueChange.emit(this.value);
  }
}
