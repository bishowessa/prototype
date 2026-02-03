/**
 * Device type identifier
 */
export type DeviceType = 'laptop' | 'phone' | 'headphones' | 'mouse' | 'keyboard' | 'charger';

/**
 * Device option for selection UI
 */
export interface DeviceOption {
  id: DeviceType;
  icon: string;
  label: string;
}

/**
 * Device summary for display
 */
export interface DeviceSummary {
  type: string;
  icon: string;
  title: string;
  tags: string[];
}
