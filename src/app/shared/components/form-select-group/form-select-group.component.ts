import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

export interface FormSelectOption {
  value: string;
  title: string;
  description?: string;
  icon?: string;
}

@Component({
  selector: 'app-form-select-group',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './form-select-group.component.html',
})
export class FormSelectGroupComponent {
  @Input() label = '';
  @Input() columns: 1 | 2 | 3 | 4 = 3;
  @Input() value = '';
  @Input() options: FormSelectOption[] = [];

  @Output() readonly valueChange = new EventEmitter<string>();

  protected get gridClass(): string {
    switch (this.columns) {
      case 4:
        return 'grid grid-cols-2 md:grid-cols-4 gap-4';
      case 2:
        return 'grid grid-cols-2 gap-4';
      case 1:
        return 'grid grid-cols-1 gap-4';
      default:
        return 'grid grid-cols-1 md:grid-cols-3 gap-4';
    }
  }

  protected onSelect(option: FormSelectOption): void {
    this.value = option.value;
    this.valueChange.emit(this.value);
  }
}

