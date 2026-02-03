import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-range-slider-preference',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './range-slider-preference.component.html',
})
export class RangeSliderPreferenceComponent {
  @Input() label = '';
  @Input() leftLabel = '';
  @Input() rightLabel = '';
  @Input() value = 50;
  @Input() step = 50;
  @Output() readonly valueChange = new EventEmitter<number>();

  protected onChange(newValue: number | string): void {
    const numeric = Number(newValue);
    this.value = numeric;
    this.valueChange.emit(numeric);
  }

  protected get trackBackground(): string {
    const v = this.value;
    return `linear-gradient(to right, #135bec 0%, #135bec ${v}%, #e5e7eb ${v}%, #e5e7eb 100%)`;
  }
}

