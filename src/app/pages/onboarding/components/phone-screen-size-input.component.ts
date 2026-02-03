import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RangeSliderPreferenceComponent } from './range-slider-preference.component';
import { PhoneScreenSizeOption } from '@app/shared/models/preference-options.model';

@Component({
  selector: 'app-phone-screen-size-input',
  standalone: true,
  imports: [RangeSliderPreferenceComponent],
  templateUrl: './phone-screen-size-input.component.html',
})
export class PhoneScreenSizeInputComponent {
  @Input() value: PhoneScreenSizeOption = 'standard';
  @Output() readonly valueChange = new EventEmitter<PhoneScreenSizeOption>();

  protected get sliderValue(): number {
    switch (this.value) {
      case 'compact':
        return 0;
      case 'large':
        return 100;
      default:
        return 50;
    }
  }

  protected onSliderChange(next: number): void {
    let mapped: PhoneScreenSizeOption = 'standard';
    if (next <= 25) {
      mapped = 'compact';
    } else if (next >= 75) {
      mapped = 'large';
    }
    this.value = mapped;
    this.valueChange.emit(mapped);
  }
}

