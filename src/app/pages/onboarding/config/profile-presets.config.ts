import {
  LaptopPreferencesPayload,
  PhonePreferencesPayload,
} from '@app/shared/models/device-preferences.model';
import {
  HeadphonesPreferencesPayload,
  MousePreferencesPayload,
  KeyboardPreferencesPayload,
  ChargerPreferencesPayload,
} from '@app/shared/models/accessory-preferences.model';

export type ProfileType =
  | 'student'
  | 'remote-worker'
  | 'gamer'
  | 'content-creator'
  | 'developer'
  | 'frequent-traveler';

export interface ProfilePresets {
  laptop?: LaptopPreferencesPayload;
  phone?: PhonePreferencesPayload;
  headphones?: HeadphonesPreferencesPayload;
  mouse?: MousePreferencesPayload;
  keyboard?: KeyboardPreferencesPayload;
  charger?: ChargerPreferencesPayload;
}

export const PROFILE_PRESETS: Record<ProfileType, ProfilePresets> = {
  student: {
    laptop: {
      batteryPriority: 60, // Good battery for all-day classes
      ramOption: '8', // Basic needs
      displaySize: '13-14', // Portable
      priceRange: 'under-500', // Budget-friendly
    },
    phone: {
      primaryUse: 'daily-tasks',
      screenSize: 'standard',
      storage: '128', // Basic storage
      priceRange: 'under-500', // Budget-friendly
    },
    headphones: {
      feature: 'wireless',
      budget: 'low',
    },
    mouse: {
      profile: 'office',
      budget: 'low',
    },
    keyboard: {
      type: 'silent',
      budget: 'low',
    },
    charger: {
      feature: 'multi-port',
      budget: 'low',
    },
  },
  'remote-worker': {
    laptop: {
      batteryPriority: 50, // Balanced
      ramOption: '16', // Multitasking
      displaySize: '15-16', // Comfortable screen
      priceRange: '500-1000', // Mid-range
    },
    phone: {
      primaryUse: 'daily-tasks',
      screenSize: 'standard',
      storage: '256',
      priceRange: '500-1000',
    },
    headphones: {
      feature: 'noise-cancelling', // Important for focus
      budget: 'medium',
    },
    mouse: {
      profile: 'ergonomic', // Long hours
      budget: 'medium',
    },
    keyboard: {
      type: 'backlit', // Late night work
      budget: 'medium',
    },
    charger: {
      feature: 'multi-port',
      budget: 'medium',
    },
  },
  gamer: {
    laptop: {
      batteryPriority: 20, // Performance over battery
      ramOption: '32', // High performance
      displaySize: '17-plus', // Large screen
      priceRange: '1500-plus', // High-end
    },
    phone: {
      primaryUse: 'gaming',
      screenSize: 'large', // Better gaming experience
      storage: '512-plus', // Games take space
      priceRange: '1500-plus', // High-end
    },
    headphones: {
      feature: 'over-ear', // Better sound quality
      budget: 'high',
    },
    mouse: {
      profile: 'gaming',
      budget: 'high',
    },
    keyboard: {
      type: 'mechanical', // Gaming preference
      budget: 'high',
    },
    charger: {
      feature: 'fast-charging',
      budget: 'high',
    },
  },
  'content-creator': {
    laptop: {
      batteryPriority: 40, // Performance focused
      ramOption: '32', // Heavy editing
      displaySize: '15-16', // Color accuracy
      priceRange: '1500-plus', // Professional grade
    },
    phone: {
      primaryUse: 'content-creation',
      screenSize: 'large', // Better for editing
      storage: '512-plus', // Media files
      priceRange: '1500-plus', // Professional
    },
    headphones: {
      feature: 'over-ear', // Audio quality
      budget: 'high',
    },
    mouse: {
      profile: 'ergonomic', // Long editing sessions
      budget: 'medium',
    },
    keyboard: {
      type: 'backlit', // Late night work
      budget: 'medium',
    },
    charger: {
      feature: 'multi-port',
      budget: 'medium',
    },
  },
  developer: {
    laptop: {
      batteryPriority: 45, // Balanced
      ramOption: '32', // Compiling, VMs
      displaySize: '15-16', // Multi-monitor setups
      priceRange: '1000-1500', // High performance
    },
    phone: {
      primaryUse: 'daily-tasks',
      screenSize: 'standard',
      storage: '256',
      priceRange: '500-1000',
    },
    headphones: {
      feature: 'noise-cancelling', // Focus
      budget: 'medium',
    },
    mouse: {
      profile: 'ergonomic', // Long coding sessions
      budget: 'medium',
    },
    keyboard: {
      type: 'mechanical', // Developer preference
      budget: 'high',
    },
    charger: {
      feature: 'multi-port',
      budget: 'medium',
    },
  },
  'frequent-traveler': {
    laptop: {
      batteryPriority: 80, // Long battery life crucial
      ramOption: '16', // Balanced performance
      displaySize: '13-14', // Portable
      priceRange: '1000-1500', // Durable, reliable
    },
    phone: {
      primaryUse: 'daily-tasks',
      screenSize: 'compact', // Easier to carry
      storage: '256',
      priceRange: '500-1000',
    },
    headphones: {
      feature: 'noise-cancelling', // Airplane noise
      budget: 'high',
    },
    mouse: {
      profile: 'office',
      budget: 'low',
    },
    keyboard: {
      type: 'silent',
      budget: 'low',
    },
    charger: {
      feature: 'travel-friendly', // Compact, portable
      budget: 'medium',
    },
  },
};
