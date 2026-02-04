import { Component, EventEmitter, OnInit, Output, inject, computed, effect } from '@angular/core';
import { OnboardingStateService } from '@app/core/services/onboarding-state.service';
import { DEVICE_STRATEGIES } from '../../strategies/device-preference-strategy';
import { OnboardingLaptopPreferencesStepComponent } from '../onboarding-laptop-preferences-step/onboarding-laptop-preferences-step.component';
import { OnboardingPhonePreferencesStepComponent } from '../onboarding-phone-preferences-step/onboarding-phone-preferences-step.component';
import { StepWrapperComponent } from '../../components/step-wrapper/step-wrapper.component';
import { StepNavigationButtonComponent } from '@app/shared/components/step-navigation-button/step-navigation-button.component';
import { LaptopPreferencesPayload, PhonePreferencesPayload } from '@app/shared/models/device-preferences.model';

@Component({
  selector: 'app-onboarding-device-preferences-step',
  standalone: true,
  imports: [
    StepWrapperComponent,
    StepNavigationButtonComponent,
    OnboardingLaptopPreferencesStepComponent,
    OnboardingPhonePreferencesStepComponent,
  ],
  templateUrl: './onboarding-device-preferences-step.component.html',
})
export class OnboardingDevicePreferencesStepComponent implements OnInit {
  @Output() readonly back = new EventEmitter<void>();
  @Output() readonly continue = new EventEmitter<void>();

  private readonly onboardingState = inject(OnboardingStateService);

  protected currentDevice = computed(() => {
    // Read the state signal directly to ensure reactivity
    // Accessing state$ signal ensures the computed re-evaluates when state changes
    const state = this.onboardingState.state$();
    
    // Calculate incomplete devices inline to ensure reactivity
    // Filter to only device types (laptop, phone) - exclude accessories
    const deviceTypes = ['laptop', 'phone'];
    const incompleteDeviceTypes: string[] = [];
    const selectedDeviceTypes: string[] = [];
    
    for (const device of state.selectedDevices) {
      // Only check device types, skip accessories
      if (!deviceTypes.includes(device)) {
        continue;
      }
      
      selectedDeviceTypes.push(device);
      
      const variants = state.variants[device] ?? [];
      const hasAny = variants.length > 0;
      const allFinished = hasAny && variants.every((v) => v.status === 'finished');
      
      if (!allFinished) {
        incompleteDeviceTypes.push(device);
      }
    }
    
    // First priority: show incomplete devices
    if (incompleteDeviceTypes.includes('laptop')) {
      return 'laptop';
    } else if (incompleteDeviceTypes.includes('phone')) {
      return 'phone';
    }
    
    // Second priority: if all are finished but devices are selected, show the first selected device
    // This allows users to review/edit their preferences even if marked as finished
    if (selectedDeviceTypes.includes('laptop')) {
      return 'laptop';
    } else if (selectedDeviceTypes.includes('phone')) {
      return 'phone';
    }
    
    return null;
  });

  protected readonly strategy = computed(() => {
    const device = this.currentDevice();
    return device ? DEVICE_STRATEGIES[device] : null;
  });

  ngOnInit(): void {
    // Don't auto-advance immediately - let the user see the step
    // The template will show the appropriate device component or a message
    // Auto-advance only happens when all devices are complete (handled in pickNextDeviceOrContinue)
  }

  protected onBack(): void {
    this.back.emit();
  }

  protected onSave(payload: LaptopPreferencesPayload | PhonePreferencesPayload): void {
    const device = this.currentDevice();
    const strategy = this.strategy();
    
    if (device && strategy) {
      strategy.savePreferences(this.onboardingState, payload);
      
      // Check for next incomplete device after saving
      // Use queueMicrotask to ensure state has updated and computed signals have re-evaluated
      // This runs after the current synchronous code but before the next render cycle
      queueMicrotask(() => {
        this.pickNextDeviceOrContinue();
      });
    }
  }

  private pickNextDeviceOrContinue(): void {
    // Re-check the state directly to see if there are more incomplete devices
    const { incompleteDevices } = this.onboardingState.getDeviceCompletionGroups();
    
    // Filter to only device types (laptop, phone) - exclude accessories
    const deviceTypes = ['laptop', 'phone'];
    const incompleteDeviceTypes = incompleteDevices.filter(d => deviceTypes.includes(d));
    
    if (incompleteDeviceTypes.length === 0) {
      // All device preferences are complete, move to next step
      this.continue.emit();
    }
    // If there are still incomplete devices, the computed signal will update
    // and the template will automatically show the next device component
    // We don't need to do anything here - Angular's change detection will handle it
  }
}

