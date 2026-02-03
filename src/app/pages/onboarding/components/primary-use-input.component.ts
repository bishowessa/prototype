import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormSelectGroupComponent, FormSelectOption } from '@app/shared/components/form-select-group/form-select-group.component';
import { PrimaryUseOption } from '@app/shared/models/preference-options.model';

@Component({
  selector: 'app-primary-use-input',
  standalone: true,
  imports: [FormSelectGroupComponent],
  templateUrl: './primary-use-input.component.html',
})
export class PrimaryUseInputComponent {
  @Input() value: PrimaryUseOption = 'gaming';
  @Output() readonly valueChange = new EventEmitter<PrimaryUseOption>();

  protected readonly options: FormSelectOption[] = [
    { value: 'photography', title: 'Photography', icon: 'photo_camera' },
    { value: 'gaming', title: 'Gaming', icon: 'sports_esports' },
    { value: 'daily-tasks', title: 'Daily Tasks', icon: 'task_alt' },
    { value: 'content-creation', title: 'Content Creation', icon: 'movie_edit' },
  ];

  protected onValueChange(next: string): void {
    this.valueChange.emit(next as PrimaryUseOption);
  }
}

