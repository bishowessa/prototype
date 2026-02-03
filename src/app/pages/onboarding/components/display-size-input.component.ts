import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormSelectGroupComponent, FormSelectOption } from '@app/shared/components/form-select-group/form-select-group.component';

export type DisplaySizeOption = '13-14' | '15-16' | '17-plus' | '2-in-1';

@Component({
  selector: 'app-display-size-input',
  standalone: true,
  imports: [FormSelectGroupComponent],
  templateUrl: './display-size-input.component.html',
})
export class DisplaySizeInputComponent {
  @Input() value: DisplaySizeOption = '15-16';
  @Output() readonly valueChange = new EventEmitter<DisplaySizeOption>();

  protected readonly options: FormSelectOption[] = [
    { value: '13-14', title: '13\" - 14\"', description: 'Portable', icon: 'laptop_mac' },
    { value: '15-16', title: '15\" - 16\"', description: 'Balanced', icon: 'laptop_windows' },
    { value: '17-plus', title: '17\"+', description: 'Workstation', icon: 'desktop_windows' },
    { value: '2-in-1', title: '2-in-1', description: 'Versatile', icon: 'monitor' },
  ];

  protected onValueChange(next: string): void {
    this.valueChange.emit(next as DisplaySizeOption);
  }
}

