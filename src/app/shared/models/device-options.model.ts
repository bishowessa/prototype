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

export type DeviceSummaryStatus = 'configured' | 'skipped' | 'not-set';

/**
 * Device summary for display
 */
export interface DeviceSummary {
  type: DeviceType;
  icon: string;
  title: string;
  tags: string[];
  stepIndex: number;
  status: DeviceSummaryStatus;
  statusLabel: string;
  /** @deprecated Use `status === 'configured'` */
  configured: boolean;
}
