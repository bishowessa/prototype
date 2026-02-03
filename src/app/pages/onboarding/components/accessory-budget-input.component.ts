import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccessoryBudgetOption } from '@app/shared/models/preference-options.model';

@Component({
  selector: 'app-accessory-budget-input',
  standalone: true,
  templateUrl: './accessory-budget-input.component.html',
})
export class AccessoryBudgetInputComponent {
  @Input() label = 'Budget Range';
  @Input() value: AccessoryBudgetOption = 'medium';
  @Output() readonly valueChange = new EventEmitter<AccessoryBudgetOption>();

  protected readonly options: { value: AccessoryBudgetOption; label: string; symbol: string }[] =
    [
      { value: 'low', label: '$', symbol: '$' },
      { value: 'medium', label: '$$', symbol: '$$' },
      { value: 'high', label: '$$$', symbol: '$$$' },
    ];

  protected onSelect(option: AccessoryBudgetOption): void {
    this.value = option;
    this.valueChange.emit(this.value);
  }

  protected isSelected(option: AccessoryBudgetOption): boolean {
    return this.value === option;
  }
}
