import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { OnboardingStateService } from '@app/core/services/onboarding-state.service';

type DeviceType = 'laptop' | 'phone' | 'headphones' | 'mouse' | 'keyboard' | 'charger';

interface DeviceOption {
  id: DeviceType;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-onboarding-device-selection-step',
  standalone: true,
  imports: [NgClass, IconComponent],
  templateUrl: './onboarding-device-selection-step.component.html',
})
export class OnboardingDeviceSelectionStepComponent implements OnInit {
  @Output() readonly back = new EventEmitter<void>();
  @Output() readonly continue = new EventEmitter<void>();

  private readonly onboardingState = inject(OnboardingStateService);

  protected readonly devices: DeviceOption[] = [
    { id: 'laptop', icon: 'laptop_mac', label: 'Laptop' },
    { id: 'phone', icon: 'smartphone', label: 'Phone' },
    { id: 'headphones', icon: 'headphones', label: 'Headphones' },
    { id: 'mouse', icon: 'mouse', label: 'Mouse' },
    { id: 'keyboard', icon: 'keyboard', label: 'Keyboard' },
    { id: 'charger', icon: 'power', label: 'Charger' },
  ];

  protected selected = new Set<DeviceType>();

  ngOnInit(): void {
    const state = this.onboardingState.getState();
    for (const id of state.selectedDevices as DeviceType[]) {
      this.selected.add(id);
    }
  }

  protected isSelected(id: DeviceType): boolean {
    return this.selected.has(id);
  }

  protected toggleDevice(id: DeviceType): void {
    if (this.selected.has(id)) {
      this.selected.delete(id);
    } else {
      this.selected.add(id);
    }
  }

  protected onBack(): void {
    this.back.emit();
  }

  protected onContinue(): void {
    const devices = Array.from(this.selected);
    this.onboardingState.setSelectedDevices(devices);
    if (devices.length === 0) {
      return;
    }
    this.continue.emit();
  }
}
