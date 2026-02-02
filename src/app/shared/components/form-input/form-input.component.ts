import { Component, input, signal, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '@app/shared/components/icon/icon.component';

const INPUT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FormInputComponent),
  multi: true,
};

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [IconComponent],
  providers: [INPUT_VALUE_ACCESSOR],
  templateUrl: './form-input.component.html',
  styles: [':host { display: block; }'],
})
export class FormInputComponent implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly type = input<'text' | 'email' | 'password'>('text');
  readonly placeholder = input<string>('');
  readonly icon = input<string>('');
  readonly id = input<string>('');
  readonly name = input<string>('');

  protected value = signal('');
  protected onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};
  protected disabled = signal(false);

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
