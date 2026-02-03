import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  HeadphonesPreferencesPayload,
  MousePreferencesPayload,
  KeyboardPreferencesPayload,
  ChargerPreferencesPayload,
} from '@app/shared/models/accessory-preferences.model';
import {
  LaptopPreferencesPayload,
  PhonePreferencesPayload,
} from '@app/shared/models/device-preferences.model';

/**
 * Helper class for building preference forms with type safety
 */
export class PreferenceFormBuilder {
  /**
   * Builds a form for accessory preferences (headphones, mouse, keyboard, charger)
   */
  static buildAccessoryForm<T extends HeadphonesPreferencesPayload | MousePreferencesPayload | KeyboardPreferencesPayload | ChargerPreferencesPayload>(
    defaults: Partial<T> = {} as Partial<T>
  ): FormGroup {
    // Determine the primary field based on payload type
    const primaryField = this.getAccessoryPrimaryField(defaults);
    const primaryValue = this.getAccessoryPrimaryValue(defaults, primaryField);

    return new FormGroup({
      [primaryField]: new FormControl(primaryValue, [Validators.required]),
      budget: new FormControl(defaults.budget || 'medium', [Validators.required]),
    });
  }

  /**
   * Builds a form for laptop preferences
   */
  static buildLaptopForm(defaults: Partial<LaptopPreferencesPayload> = {}): FormGroup {
    return new FormGroup({
      batteryPriority: new FormControl(defaults.batteryPriority ?? 50, [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]),
      ramOption: new FormControl(defaults.ramOption || '16', [Validators.required]),
      displaySize: new FormControl(defaults.displaySize || '15-16', [Validators.required]),
      priceRange: new FormControl(defaults.priceRange || '500-1000', [Validators.required]),
    });
  }

  /**
   * Builds a form for phone preferences
   */
  static buildPhoneForm(defaults: Partial<PhonePreferencesPayload> = {}): FormGroup {
    return new FormGroup({
      primaryUse: new FormControl(defaults.primaryUse || 'gaming', [Validators.required]),
      screenSize: new FormControl(defaults.screenSize || 'standard', [Validators.required]),
      storage: new FormControl(defaults.storage || '256', [Validators.required]),
      priceRange: new FormControl(defaults.priceRange || '500-1000', [Validators.required]),
    });
  }

  /**
   * Patches a form with default values, merging with existing form values
   */
  static patchForm<T>(form: FormGroup, defaults: Partial<T>): void {
    form.patchValue(defaults, { emitEvent: false });
  }

  /**
   * Gets the primary field name for accessory forms
   */
  private static getAccessoryPrimaryField(
    payload: Partial<HeadphonesPreferencesPayload | MousePreferencesPayload | KeyboardPreferencesPayload | ChargerPreferencesPayload>
  ): string {
    if ('feature' in payload && payload.feature) return 'feature';
    if ('profile' in payload && payload.profile) return 'profile';
    if ('type' in payload && payload.type) return 'type';
    return 'feature'; // default
  }

  /**
   * Gets the primary field value for accessory forms
   */
  private static getAccessoryPrimaryValue(
    payload: Partial<HeadphonesPreferencesPayload | MousePreferencesPayload | KeyboardPreferencesPayload | ChargerPreferencesPayload>,
    field: string
  ): string {
    const value = (payload as Record<string, string | undefined>)[field];
    if (value) return value;

    // Provide sensible defaults
    switch (field) {
      case 'feature':
        return 'noise-cancelling';
      case 'profile':
        return 'office';
      case 'type':
        return 'silent';
      default:
        return '';
    }
  }
}
