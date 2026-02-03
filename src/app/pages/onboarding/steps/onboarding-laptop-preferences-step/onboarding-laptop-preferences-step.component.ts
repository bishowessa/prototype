import { Component, EventEmitter, Output } from '@angular/core';
import { BatteryPerformanceInputComponent } from '../../components/battery-performance-input.component';
import { RamChoiceInputComponent, RamOption } from '../../components/ram-choice-input.component';
import {
  DisplaySizeInputComponent,
  DisplaySizeOption,
} from '../../components/display-size-input.component';
import {
  PriceRangeInputComponent,
  PriceRangeOption,
} from '../../components/price-range-input.component';

export interface LaptopPreferencesPayload {
  batteryPriority: number;
  ramOption: '8' | '16' | '32';
  displaySize: '13-14' | '15-16' | '17-plus' | '2-in-1';
  priceRange: 'under-500' | '500-1000' | '1000-1500' | '1500-plus';
}

@Component({
  selector: 'app-onboarding-laptop-preferences-step',
  standalone: true,
  imports: [
    BatteryPerformanceInputComponent,
    RamChoiceInputComponent,
    DisplaySizeInputComponent,
    PriceRangeInputComponent,
  ],
  templateUrl: './onboarding-laptop-preferences-step.component.html',
})
export class OnboardingLaptopPreferencesStepComponent {
  @Output() readonly save = new EventEmitter<LaptopPreferencesPayload>();

  protected batteryPriority = 50;
  protected ramOption: RamOption = '16';
  protected displaySize: DisplaySizeOption = '15-16';
  protected priceRange: PriceRangeOption = '500-1000';

  protected onSubmit(): void {
    console.log(
      'onSubmit',
      this.batteryPriority,
      this.ramOption,
      this.displaySize,
      this.priceRange,
    );
    this.save.emit({
      batteryPriority: this.batteryPriority,
      ramOption: this.ramOption,
      displaySize: this.displaySize,
      priceRange: this.priceRange,
    });
  }
}
