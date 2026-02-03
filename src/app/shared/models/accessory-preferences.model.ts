import { Type } from '@angular/core';
import {
  AccessoryBudgetOption,
  HeadphonesFeatureOption,
  MouseProfileOption,
  KeyboardTypeOption,
  ChargerFeatureOption,
} from './preference-options.model';

// Re-export option types for convenience
export type { HeadphonesFeatureOption, MouseProfileOption, KeyboardTypeOption, ChargerFeatureOption };

/**
 * Headphones preferences payload
 */
export interface HeadphonesPreferencesPayload {
  feature: HeadphonesFeatureOption;
  budget: AccessoryBudgetOption;
}

/**
 * Mouse preferences payload
 */
export interface MousePreferencesPayload {
  profile: MouseProfileOption;
  budget: AccessoryBudgetOption;
}

/**
 * Keyboard preferences payload
 */
export interface KeyboardPreferencesPayload {
  type: KeyboardTypeOption;
  budget: AccessoryBudgetOption;
}

/**
 * Charger preferences payload
 */
export interface ChargerPreferencesPayload {
  feature: ChargerFeatureOption;
  budget: AccessoryBudgetOption;
}

/**
 * Union type for all accessory preference payloads
 */
export type AccessoryPreferencesPayload =
  | HeadphonesPreferencesPayload
  | MousePreferencesPayload
  | KeyboardPreferencesPayload
  | ChargerPreferencesPayload;

/**
 * Accessory configuration for dynamic component loading
 */
export interface AccessoryConfig<T = AccessoryPreferencesPayload> {
  key: string;
  icon: string;
  title: string;
  subtitle: string;
  defaultValues: T;
  component: Type<any>;
}

/**
 * Accessory state management
 */
export interface AccessoryState {
  show: boolean;
  skipped: boolean;
  value: AccessoryPreferencesPayload;
}
