import type {

  AccessoryBudgetOption,

  PriceRangeOption,

} from '@app/shared/models/preference-options.model';

import type { DeviceType } from '@app/shared/models/device-options.model';

import { formatEgpRange } from '@app/shared/utils/price.util';



/** Device (laptop / phone) budget tiers — Egyptian market ranges in EGP. */

export const DEVICE_PRICE_RANGE_LABELS: Record<PriceRangeOption, string> = {

  'under-500': formatEgpRange(25_000, null, { prefix: 'Under ', openEndedSuffix: '' }),

  '500-1000': formatEgpRange(25_000, 50_000),

  '1000-1500': formatEgpRange(50_000, 75_000),

  '1500-plus': formatEgpRange(75_000, null),

};



/** Device price range options for form controls (labels only; values unchanged). */

export const DEVICE_PRICE_RANGE_OPTIONS: Array<{ value: PriceRangeOption; title: string }> = [

  { value: 'under-500', title: DEVICE_PRICE_RANGE_LABELS['under-500'] },

  { value: '500-1000', title: DEVICE_PRICE_RANGE_LABELS['500-1000'] },

  { value: '1000-1500', title: DEVICE_PRICE_RANGE_LABELS['1000-1500'] },

  { value: '1500-plus', title: DEVICE_PRICE_RANGE_LABELS['1500-plus'] },

];



/** Default accessory budget tiers when category is unknown. */

export const DEFAULT_ACCESSORY_BUDGET_LABELS: Record<AccessoryBudgetOption, string> = {

  low: formatEgpRange(1_500, null, { prefix: 'Up to ', openEndedSuffix: '' }),

  medium: formatEgpRange(1_500, 5_000),

  high: formatEgpRange(5_000, null),

};



/** Category-specific accessory budget tiers — aligned with ACCESSORY_BUDGET_PICKER_OPTIONS. */

export const ACCESSORY_BUDGET_LABELS_BY_CATEGORY: Record<

  DeviceType,

  Record<AccessoryBudgetOption, string>

> = {

  laptop: DEFAULT_ACCESSORY_BUDGET_LABELS,

  phone: DEFAULT_ACCESSORY_BUDGET_LABELS,

  headphones: DEFAULT_ACCESSORY_BUDGET_LABELS,

  mouse: DEFAULT_ACCESSORY_BUDGET_LABELS,

  keyboard: DEFAULT_ACCESSORY_BUDGET_LABELS,

  charger: DEFAULT_ACCESSORY_BUDGET_LABELS,

};



export function formatDevicePriceRange(priceRange: PriceRangeOption): string {

  return `Budget: ${DEVICE_PRICE_RANGE_LABELS[priceRange] ?? priceRange}`;

}



export function formatAccessoryBudget(

  category: DeviceType,

  budget: AccessoryBudgetOption,

): string {

  const labels =

    ACCESSORY_BUDGET_LABELS_BY_CATEGORY[category] ?? DEFAULT_ACCESSORY_BUDGET_LABELS;

  return `Budget: ${labels[budget] ?? budget}`;

}



/** Short labels for accessory budget picker buttons (EGP tiers). */

export const ACCESSORY_BUDGET_PICKER_OPTIONS: Array<{

  value: AccessoryBudgetOption;

  label: string;

  detail: string;

}> = [

  { value: 'low', label: 'Basic', detail: formatEgpRange(1_500, null, { prefix: 'Up to ', openEndedSuffix: '' }) },

  { value: 'medium', label: 'Mid-range', detail: formatEgpRange(1_500, 5_000) },

  { value: 'high', label: 'Premium', detail: formatEgpRange(5_000, null) },

];


