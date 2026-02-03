import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormSelectGroupComponent, FormSelectOption } from '@app/shared/components/form-select-group/form-select-group.component';
import { PriceRangeOption } from '@app/shared/models/preference-options.model';

@Component({
  selector: 'app-price-range-input',
  standalone: true,
  imports: [FormSelectGroupComponent],
  templateUrl: './price-range-input.component.html',
})
export class PriceRangeInputComponent {
  @Input() value: PriceRangeOption = '500-1000';
  @Output() readonly valueChange = new EventEmitter<PriceRangeOption>();

  protected readonly options: FormSelectOption[] = [
    { value: 'under-500', title: 'Under $500' },
    { value: '500-1000', title: '$500 - $1000' },
    { value: '1000-1500', title: '$1000 - $1500' },
    { value: '1500-plus', title: '$1500+' },
  ];

  protected onValueChange(next: string): void {
    this.valueChange.emit(next as PriceRangeOption);
  }
}

