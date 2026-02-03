import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RangeSliderPreferenceComponent } from './range-slider-preference.component';

@Component({
  selector: 'app-battery-performance-input',
  standalone: true,
  imports: [RangeSliderPreferenceComponent],
  templateUrl: './battery-performance-input.component.html',
})
export class BatteryPerformanceInputComponent {
  @Input() value = 50;
  @Output() readonly valueChange = new EventEmitter<number>();

  protected onValueChange(next: number): void {
    this.value = next;
    this.valueChange.emit(next);
  }
}

