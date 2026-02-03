import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormSelectGroupComponent, FormSelectOption } from '@app/shared/components/form-select-group/form-select-group.component';

@Component({
  selector: 'app-accessory-feature-select',
  standalone: true,
  imports: [FormSelectGroupComponent],
  templateUrl: './accessory-feature-select.component.html',
})
export class AccessoryFeatureSelectComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() options: FormSelectOption[] = [];
  @Output() readonly valueChange = new EventEmitter<string>();

  protected onValueChange(next: string): void {
    this.valueChange.emit(next);
  }
}
