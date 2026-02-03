import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormSelectGroupComponent, FormSelectOption } from '@app/shared/components/form-select-group/form-select-group.component';

export type RamOption = '8' | '16' | '32';

@Component({
  selector: 'app-ram-choice-input',
  standalone: true,
  imports: [FormSelectGroupComponent],
  templateUrl: './ram-choice-input.component.html',
})
export class RamChoiceInputComponent {
  @Input() value: RamOption = '16';
  @Output() readonly valueChange = new EventEmitter<RamOption>();

  protected readonly options: FormSelectOption[] = [
    { value: '8', title: '8GB', description: 'Basic Tasks & Web' },
    { value: '16', title: '16GB', description: 'Multitasking (Recommended)' },
    { value: '32', title: '32GB+', description: 'Professional Workloads' },
  ];

  protected onValueChange(next: string): void {
    this.valueChange.emit(next as RamOption);
  }
}

