import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormSelectGroupComponent, FormSelectOption } from '@app/shared/components/form-select-group/form-select-group.component';
import { StorageCapacityOption } from '@app/shared/models/preference-options.model';

@Component({
  selector: 'app-storage-capacity-input',
  standalone: true,
  imports: [FormSelectGroupComponent],
  templateUrl: './storage-capacity-input.component.html',
})
export class StorageCapacityInputComponent {
  @Input() value: StorageCapacityOption = '256';
  @Output() readonly valueChange = new EventEmitter<StorageCapacityOption>();

  protected readonly options: FormSelectOption[] = [
    { value: '128', title: '128GB' },
    { value: '256', title: '256GB' },
    { value: '512-plus', title: '512GB+' },
  ];

  protected onValueChange(next: string): void {
    this.valueChange.emit(next as StorageCapacityOption);
  }
}

