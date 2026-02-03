import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccessoryFeatureSelectComponent } from './accessory-feature-select.component';
import { AccessoryBudgetInputComponent } from './accessory-budget-input.component';
import { FormSelectOption } from '@app/shared/components/form-select-group/form-select-group.component';
import {
  KeyboardPreferencesPayload,
  KeyboardTypeOption,
} from '@app/shared/models/accessory-preferences.model';
import { AccessoryBudgetOption } from '@app/shared/models/preference-options.model';

@Component({
  selector: 'app-keyboard-preferences-content',
  standalone: true,
  imports: [AccessoryFeatureSelectComponent, AccessoryBudgetInputComponent],
  templateUrl: './keyboard-preferences-content.component.html',
})
export class KeyboardPreferencesContentComponent {
  @Input() value: KeyboardPreferencesPayload = {
    type: 'silent',
    budget: 'medium',
  };
  @Output() readonly valueChange = new EventEmitter<KeyboardPreferencesPayload>();

  protected readonly typeOptions: FormSelectOption[] = [
    { value: 'mechanical', title: 'Mechanical', icon: 'keyboard_command_key' },
    { value: 'silent', title: 'Silent', icon: 'volume_off' },
    { value: 'backlit', title: 'Backlit', icon: 'light_mode' },
  ];

  protected onTypeChange(type: string): void {
    this.value = { ...this.value, type: type as KeyboardTypeOption };
    this.valueChange.emit(this.value);
  }

  protected onBudgetChange(budget: AccessoryBudgetOption): void {
    this.value = { ...this.value, budget };
    this.valueChange.emit(this.value);
  }
}
