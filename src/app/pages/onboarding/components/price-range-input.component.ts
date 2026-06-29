import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormSelectGroupComponent, FormSelectOption } from '@app/shared/components/form-select-group/form-select-group.component';
import { PriceRangeOption } from '@app/shared/models/preference-options.model';
import { DEVICE_PRICE_RANGE_OPTIONS } from '../config/onboarding-budget.labels';

@Component({
  selector: 'app-price-range-input',
  standalone: true,
  imports: [FormSelectGroupComponent],
  templateUrl: './price-range-input.component.html',
})
export class PriceRangeInputComponent {
  @Input() value: PriceRangeOption = '500-1000';
  @Output() readonly valueChange = new EventEmitter<PriceRangeOption>();

  protected readonly options: FormSelectOption[] = DEVICE_PRICE_RANGE_OPTIONS;

  protected onValueChange(next: string): void {
    this.valueChange.emit(next as PriceRangeOption);
  }
}
