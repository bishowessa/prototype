import { Component, input, signal, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const CHECKBOX_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FormCheckboxComponent),
  multi: true,
};

@Component({
  selector: 'app-form-checkbox',
  standalone: true,
  providers: [CHECKBOX_VALUE_ACCESSOR],
  templateUrl: './form-checkbox.component.html',
  styles: [':host { display: block; }'],
})
export class FormCheckboxComponent implements ControlValueAccessor {
  readonly id = input.required<string>();
  readonly label = input<string>('');
  readonly labelClass = input<string>('text-sm text-slate-600 dark:text-slate-400');
  /** When true, align checkbox to top (for multi-line labels). */
  readonly alignTop = input<boolean>(false);

  protected checked = signal(false);
  protected onChange: (value: boolean) => void = () => {};
  protected onTouched: () => void = () => {};
  protected disabled = signal(false);

  writeValue(value: boolean | null): void {
    this.checked.set(value ?? false);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected onInput(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.checked.set(checked);
    this.onChange(checked);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
