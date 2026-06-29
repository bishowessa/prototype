import type { OnboardingState, OnboardingVariant } from '@app/shared/models/onboarding-state.model';

import type {
  PreferenceOptionsResponse,
  SetUserPreferenceRequest,
  UserPreferenceResponse,
} from '@app/core/models/preference-api.model';



/** Maps onboarding state keys to backend category slugs. */

export const ONBOARDING_CATEGORY_KEY_TO_API_SLUG: Record<string, string> = {

  phone: 'mobile',

  laptop: 'laptops',

  headphones: 'headsets',

  mouse: 'mice',

  keyboard: 'keyboards',

  charger: 'chargers',

};



/** Maps backend category slugs back to onboarding device keys. */

export const API_SLUG_TO_ONBOARDING_KEY: Record<string, string> = {

  mobile: 'phone',

  laptops: 'laptop',

  headsets: 'headphones',

  mice: 'mouse',

  keyboards: 'keyboard',

  chargers: 'charger',

};



/** Normalizes legacy or UI slugs to backend category slugs. */

const API_CATEGORY_SLUG_ALIASES: Record<string, string> = {

  phone: 'mobile',

  phones: 'mobile',

  laptop: 'laptops',

  headphones: 'headsets',

  headset: 'headsets',

  mouse: 'mice',

  keyboard: 'keyboards',

  charger: 'chargers',

};



const PREFERENCE_META_KEYS = new Set(['categorySlug', 'version', 'persona']);



type BudgetTier = 'budget' | 'midrange' | 'premium' | 'flagship';



function mapUiBudgetToTier(budget: unknown): BudgetTier {

  switch (String(budget)) {

    case 'low':

      return 'budget';

    case 'high':

      return 'premium';

    case 'medium':

    default:

      return 'midrange';

  }

}



function mapPriceRangeToTier(priceRange: unknown): BudgetTier {

  switch (String(priceRange)) {

    case 'under-500':

      return 'budget';

    case '500-1000':

      return 'midrange';

    case '1000-1500':

      return 'premium';

    case '1500-plus':

      return 'flagship';

    default:

      return 'midrange';

  }

}



function mapTierToPriceRange(tier: unknown): string {

  switch (String(tier)) {

    case 'budget':

      return 'under-500';

    case 'midrange':

      return '500-1000';

    case 'premium':

      return '1000-1500';

    case 'flagship':

      return '1500-plus';

    default:

      return '500-1000';

  }

}



function mapTierToUiBudget(tier: unknown): string {

  switch (String(tier)) {

    case 'budget':

      return 'low';

    case 'premium':

    case 'flagship':

      return 'high';

    default:

      return 'medium';

  }

}



function devicePriceRangeToBudget(

  priceRange: unknown,

  device: 'phone' | 'laptop',

): { minBudget: number; maxBudget: number | null } {

  if (device === 'phone') {

    switch (String(priceRange)) {

      case 'under-500':

        return { minBudget: 5_000, maxBudget: 25_000 };

      case '500-1000':

        return { minBudget: 25_000, maxBudget: 50_000 };

      case '1000-1500':

        return { minBudget: 50_000, maxBudget: 75_000 };

      case '1500-plus':

        return { minBudget: 75_000, maxBudget: null };

      default:

        return { minBudget: 5_000, maxBudget: 150_000 };

    }

  }



  switch (String(priceRange)) {

    case 'under-500':

      return { minBudget: 15_000, maxBudget: 50_000 };

    case '500-1000':

      return { minBudget: 50_000, maxBudget: 100_000 };

    case '1000-1500':

      return { minBudget: 100_000, maxBudget: 150_000 };

    case '1500-plus':

      return { minBudget: 150_000, maxBudget: null };

    default:

      return { minBudget: 15_000, maxBudget: 250_000 };

  }

}



function accessoryBudgetToAmounts(

  deviceKey: string,

  budget: unknown,

): { minBudget: number; maxBudget: number | null } {

  const tier = String(budget);

  const slug = ONBOARDING_CATEGORY_KEY_TO_API_SLUG[deviceKey] ?? deviceKey;



  const tables: Record<string, Record<string, { min: number; max: number | null }>> = {

    headsets: {

      low: { min: 300, max: 2_000 },

      medium: { min: 2_000, max: 8_000 },

      high: { min: 8_000, max: 20_000 },

    },

    mice: {

      low: { min: 150, max: 800 },

      medium: { min: 800, max: 3_000 },

      high: { min: 3_000, max: 10_000 },

    },

    keyboards: {

      low: { min: 300, max: 1_500 },

      medium: { min: 1_500, max: 6_000 },

      high: { min: 6_000, max: 15_000 },

    },

    chargers: {

      low: { min: 150, max: 500 },

      medium: { min: 500, max: 2_000 },

      high: { min: 2_000, max: 10_000 },

    },

  };



  const table = tables[slug] ?? tables['mice'];

  const entry = table[tier] ?? table['medium'];

  return { minBudget: entry.min, maxBudget: entry.max };

}



function inferPhoneRam(minStorageGb: number): number {

  if (minStorageGb >= 512) return 12;

  if (minStorageGb >= 256) return 8;

  return 6;

}



function mapPhonePreference(

  formData: Record<string, unknown>,

  base: Record<string, unknown>,

): Record<string, unknown> {

  const storage = String(formData['storage'] ?? '128');

  const minStorageGb = storage === '512-plus' ? 512 : Number(storage) || 128;



  const screenSize = String(formData['screenSize'] ?? 'standard');

  let minDisplaySize: number | undefined;

  let maxDisplaySize: number | undefined;

  switch (screenSize) {

    case 'compact':

      minDisplaySize = 0;

      maxDisplaySize = 6.3;

      break;

    case 'standard':

      minDisplaySize = 6.3;

      maxDisplaySize = 6.7;

      break;

    case 'large':

      minDisplaySize = 6.7;

      break;

  }



  const priceRange = formData['priceRange'];

  const budget = devicePriceRangeToBudget(priceRange, 'phone');

  const primaryUse = String(formData['primaryUse'] ?? 'daily-tasks');

  let batteryNeed = 'most_of_day';

  if (primaryUse === 'gaming' || primaryUse === 'content-creation' || primaryUse === 'photography') {

    batteryNeed = 'all_day';

  }



  const result: Record<string, unknown> = {

    ...base,

    budgetTier: mapPriceRangeToTier(priceRange),

    minStorageGb,

    minRamGb: inferPhoneRam(minStorageGb),

    batteryNeed,

    minBudget: budget.minBudget,

  };



  if (budget.maxBudget != null) {

    result['maxBudget'] = budget.maxBudget;

  }

  if (minDisplaySize != null) {

    result['minDisplaySize'] = minDisplaySize;

  }

  if (maxDisplaySize != null) {

    result['maxDisplaySize'] = maxDisplaySize;

  }



  return result;

}



function mapLaptopPreference(

  formData: Record<string, unknown>,

  base: Record<string, unknown>,

): Record<string, unknown> {

  const ram = Number(formData['ramOption'] ?? 8);

  const displaySize = String(formData['displaySize'] ?? '15-16');

  let minScreenSize: number | undefined;

  let maxScreenSize: number | undefined;



  switch (displaySize) {

    case '13-14':

    case '2-in-1':

      minScreenSize = 13;

      maxScreenSize = 14;

      break;

    case '15-16':

      minScreenSize = 15;

      maxScreenSize = 16;

      break;

    case '17-plus':

      minScreenSize = 17;

      break;

  }



  const batteryPriority = Number(formData['batteryPriority'] ?? 50);

  const priceRange = formData['priceRange'];

  const budget = devicePriceRangeToBudget(priceRange, 'laptop');



  const result: Record<string, unknown> = {

    ...base,

    budgetTier: mapPriceRangeToTier(priceRange),

    minMemoryGb: ram,

    minStorageGb: ram >= 32 ? 1024 : 512,

    minRefreshRate: batteryPriority <= 33 ? 60 : 120,

    touchscreen: displaySize === '2-in-1',

    gpuClass: batteryPriority >= 67 ? 'dedicated' : 'integrated',

    minBudget: budget.minBudget,

  };



  if (budget.maxBudget != null) {

    result['maxBudget'] = budget.maxBudget;

  }

  if (minScreenSize != null) {

    result['minScreenSize'] = minScreenSize;

  }

  if (maxScreenSize != null) {

    result['maxScreenSize'] = maxScreenSize;

  }



  return result;

}



function mapHeadphonesPreference(

  formData: Record<string, unknown>,

  base: Record<string, unknown>,

): Record<string, unknown> {

  const feature = String(formData['feature'] ?? 'wireless');

  const connectionTypeMap: Record<string, string> = {

    'noise-cancelling': 'Bluetooth',

    wireless: 'Bluetooth',

    'over-ear': 'Wired',

  };

  const budget = formData['budget'];

  const amounts = accessoryBudgetToAmounts('headphones', budget);



  const result: Record<string, unknown> = {

    ...base,

    budgetTier: mapUiBudgetToTier(budget),

    connectionType: connectionTypeMap[feature] ?? 'Bluetooth',

    audioJack: feature === 'over-ear',

    batteryNeed: feature === 'over-ear' ? 'most_of_day' : 'all_day',

    minBudget: amounts.minBudget,

  };



  if (amounts.maxBudget != null) {

    result['maxBudget'] = amounts.maxBudget;

  }



  return result;

}



function mapMousePreference(

  formData: Record<string, unknown>,

  base: Record<string, unknown>,

): Record<string, unknown> {

  const profile = String(formData['profile'] ?? 'office');

  const budget = formData['budget'];

  const amounts = accessoryBudgetToAmounts('mouse', budget);



  const profileMap: Record<string, { type: string; minDpi: number; handOrientation: string }> = {

    gaming: { type: 'Gaming', minDpi: 3200, handOrientation: 'Right' },

    office: { type: 'Standard', minDpi: 1600, handOrientation: 'Right' },

    ergonomic: { type: 'Standard', minDpi: 1600, handOrientation: 'Ambidextrous' },

  };

  const mapped = profileMap[profile] ?? profileMap['office'];



  const result: Record<string, unknown> = {

    ...base,

    budgetTier: mapUiBudgetToTier(budget),

    interfaceType: profile === 'gaming' ? 'Wired' : 'Wireless',

    type: mapped.type,

    minDpi: mapped.minDpi,

    handOrientation: mapped.handOrientation,

    minBudget: amounts.minBudget,

  };



  if (amounts.maxBudget != null) {

    result['maxBudget'] = amounts.maxBudget;

  }



  return result;

}



function mapKeyboardPreference(

  formData: Record<string, unknown>,

  base: Record<string, unknown>,

): Record<string, unknown> {

  const keyboardType = String(formData['type'] ?? 'silent');

  const budget = formData['budget'];

  const amounts = accessoryBudgetToAmounts('keyboard', budget);



  const typeMap: Record<string, { switchType: string; connectivity: string; backlit: boolean }> =

    {

      mechanical: { switchType: 'Mechanical', connectivity: 'Wired', backlit: true },

      silent: { switchType: 'Membrane', connectivity: 'Wireless', backlit: false },

      backlit: { switchType: 'Membrane', connectivity: 'Wireless', backlit: true },

    };

  const mapped = typeMap[keyboardType] ?? typeMap['silent'];



  const result: Record<string, unknown> = {

    ...base,

    budgetTier: mapUiBudgetToTier(budget),

    connectivity: mapped.connectivity,

    switchType: mapped.switchType,

    size: 'Full-size',

    backlit: mapped.backlit,

    minBudget: amounts.minBudget,

  };



  if (amounts.maxBudget != null) {

    result['maxBudget'] = amounts.maxBudget;

  }



  return result;

}



function mapChargerPreference(

  formData: Record<string, unknown>,

  base: Record<string, unknown>,

): Record<string, unknown> {

  const feature = String(formData['feature'] ?? 'multi-port');

  const budget = formData['budget'];

  const amounts = accessoryBudgetToAmounts('charger', budget);



  const wattageMap: Record<string, number> = {

    'fast-charging': 65,

    'multi-port': 45,

    'travel-friendly': 30,

  };



  const result: Record<string, unknown> = {

    ...base,

    budgetTier: mapUiBudgetToTier(budget),

    minWattage: wattageMap[feature] ?? 45,

    portType: 'USB-C',

    minBudget: amounts.minBudget,

  };



  if (amounts.maxBudget != null) {

    result['maxBudget'] = amounts.maxBudget;

  }



  return result;

}



/** Maps onboarding UI form fields to backend canonical preference JSON fields. */

export function mapOnboardingToCanonicalPreference(

  deviceKey: string,

  formData: Record<string, unknown>,

): Record<string, unknown> {

  const categorySlug = ONBOARDING_CATEGORY_KEY_TO_API_SLUG[deviceKey] ?? deviceKey;

  const base: Record<string, unknown> = { categorySlug, version: 1 };



  switch (deviceKey) {

    case 'phone':

      return mapPhonePreference(formData, base);

    case 'laptop':

      return mapLaptopPreference(formData, base);

    case 'headphones':

      return mapHeadphonesPreference(formData, base);

    case 'mouse':

      return mapMousePreference(formData, base);

    case 'keyboard':

      return mapKeyboardPreference(formData, base);

    case 'charger':

      return mapChargerPreference(formData, base);

    default:

      return { ...base, ...formData };

  }

}



function hasStoredUiFormData(deviceKey: string, parsed: Record<string, unknown>): boolean {

  switch (deviceKey) {

    case 'phone':

      return (

        parsed['primaryUse'] != null ||

        parsed['storage'] != null ||

        parsed['screenSize'] != null ||

        parsed['priceRange'] != null

      );

    case 'laptop':

      return (

        parsed['ramOption'] != null ||

        parsed['displaySize'] != null ||

        parsed['priceRange'] != null

      );

    case 'headphones':

      return parsed['feature'] != null && parsed['budget'] != null;

    case 'mouse':

      return parsed['profile'] != null && parsed['budget'] != null;

    case 'keyboard': {

      const keyboardType = String(parsed['type'] ?? '');

      return (

        parsed['budget'] != null &&

        ['mechanical', 'silent', 'backlit'].includes(keyboardType)

      );

    }

    case 'charger':

      return parsed['feature'] != null && parsed['budget'] != null;

    default:

      return false;

  }

}



function resolveApiCategorySlug(

  parsed: Record<string, unknown>,

  productCategoryId: number,

  categoryIdToSlug: Map<number, string>,

): string {

  let slug = String(parsed['categorySlug'] ?? '').trim().toLowerCase();

  if (!slug && productCategoryId != null) {

    slug = String(categoryIdToSlug.get(productCategoryId) ?? '').trim().toLowerCase();

  }

  return API_CATEGORY_SLUG_ALIASES[slug] ?? slug;

}



function mapCanonicalToOnboardingFormData(

  deviceKey: string,

  parsed: Record<string, unknown>,

): Record<string, unknown> {

  if (hasStoredUiFormData(deviceKey, parsed)) {

    const formData: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(parsed)) {

      if (!PREFERENCE_META_KEYS.has(key)) {
        formData[key] = value;
      }

    }

    return formData;

  }



  switch (deviceKey) {

    case 'phone': {

      const minStorage = Number(parsed['minStorageGb'] ?? 128);

      const storage =
        minStorage >= 512 ? '512-plus' : minStorage >= 256 ? '256' : '128';



      const minDisplay = Number(parsed['minDisplaySize'] ?? 6.3);

      let screenSize = 'standard';

      if (minDisplay >= 6.7) screenSize = 'large';

      else if (minDisplay < 6.3) screenSize = 'compact';



      return {

        primaryUse: 'daily-tasks',

        screenSize,

        storage,

        priceRange: mapTierToPriceRange(parsed['budgetTier']),

      };

    }

    case 'laptop': {

      const minScreen = Number(parsed['minScreenSize'] ?? 15);

      let displaySize = '15-16';

      if (minScreen >= 17) displaySize = '17-plus';

      else if (minScreen <= 14) displaySize = '13-14';



      const gpuClass = String(parsed['gpuClass'] ?? 'integrated');

      const batteryPriority = gpuClass === 'dedicated' ? 80 : 50;



      return {

        batteryPriority,

        ramOption: String(parsed['minMemoryGb'] ?? 16),

        displaySize,

        priceRange: mapTierToPriceRange(parsed['budgetTier']),

      };

    }

    case 'headphones': {

      const connection = String(parsed['connectionType'] ?? 'Bluetooth');

      let feature = 'wireless';

      if (connection === 'Wired') feature = 'over-ear';

      else if (parsed['batteryNeed'] === 'all_day') feature = 'noise-cancelling';



      return {

        feature,

        budget: mapTierToUiBudget(parsed['budgetTier']),

      };

    }

    case 'mouse': {

      const type = String(parsed['type'] ?? 'Standard');

      let profile = 'office';

      if (type === 'Gaming') profile = 'gaming';

      else if (parsed['handOrientation'] === 'Ambidextrous') profile = 'ergonomic';



      return {

        profile,

        budget: mapTierToUiBudget(parsed['budgetTier']),

      };

    }

    case 'keyboard': {

      const switchType = String(parsed['switchType'] ?? 'Membrane');

      let type = 'silent';

      if (switchType === 'Mechanical') type = 'mechanical';

      else if (parsed['backlit'] === true) type = 'backlit';



      return {

        type,

        budget: mapTierToUiBudget(parsed['budgetTier']),

      };

    }

    case 'charger': {

      const wattage = Number(parsed['minWattage'] ?? 45);

      let feature = 'multi-port';

      if (wattage >= 65) feature = 'fast-charging';

      else if (wattage <= 30) feature = 'travel-friendly';



      return {

        feature,

        budget: mapTierToUiBudget(parsed['budgetTier']),

      };

    }

    default:

      return parsed;

  }

}



export function mapSavedPreferencesToOnboardingState(
  saved: UserPreferenceResponse[],
  options?: PreferenceOptionsResponse,
): OnboardingState {
  const variants: OnboardingState['variants'] = {};
  const selectedDevices: string[] = [];
  let selectedProfileId: string | null = null;

  const categoryIdToSlug = new Map(
    options?.categories.map((category) => [category.categoryId, category.categorySlug]) ?? [],
  );

  for (const pref of saved) {
    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(pref.preferences) as Record<string, unknown>;
    } catch {
      continue;
    }

    let slug = resolveApiCategorySlug(parsed, pref.productCategoryId, categoryIdToSlug);

    const deviceKey = API_SLUG_TO_ONBOARDING_KEY[slug];
    if (!deviceKey) {
      continue;
    }

    if (typeof parsed['persona'] === 'string') {
      selectedProfileId = parsed['persona'];
    }

    const formData = mapCanonicalToOnboardingFormData(deviceKey, parsed);

    selectedDevices.push(deviceKey);
    variants[deviceKey] = [{ status: 'finished', data: formData }];
  }

  return {
    selectedDevices: [...new Set(selectedDevices)],
    variants,
    selectedProfileId,
  };
}

/** Maps API preferences to onboarding state, or null when nothing usable was found. */
export function tryMapApiPreferencesToOnboardingState(
  prefs: UserPreferenceResponse[],
  options: PreferenceOptionsResponse,
): OnboardingState | null {
  if (!prefs.length) {
    return null;
  }

  const hydrated = mapSavedPreferencesToOnboardingState(prefs, options);
  return hydrated.selectedDevices.length > 0 ? hydrated : null;
}



/** Returns the most recently saved variant payload for a device category. */
function resolveActiveVariantData(
  variants: OnboardingVariant[] | undefined,
): Record<string, unknown> | null {
  if (!variants?.length) {
    return null;
  }

  for (let index = variants.length - 1; index >= 0; index -= 1) {
    const variant = variants[index];
    if (variant.data != null) {
      return variant.data as Record<string, unknown>;
    }
  }

  return null;
}

function isBlankFormData(data: Record<string, unknown>): boolean {
  return Object.values(data).every(
    (value) =>
      value == null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0),
  );
}

export function buildSetPreferenceRequestsFromOnboarding(
  state: OnboardingState,
  options: PreferenceOptionsResponse,
): SetUserPreferenceRequest[] {
  const slugToCategory = new Map(
    options.categories.map((category) => [category.categorySlug, category]),
  );
  const skipped = new Set(state.skippedAccessories ?? []);
  const requestsByCategoryId = new Map<number, SetUserPreferenceRequest>();

  for (const categoryKey of [...new Set(state.selectedDevices)]) {
    if (skipped.has(categoryKey)) {
      continue;
    }

    const formData = resolveActiveVariantData(state.variants[categoryKey]);
    if (!formData || isBlankFormData(formData)) {
      continue;
    }

    const categorySlug = ONBOARDING_CATEGORY_KEY_TO_API_SLUG[categoryKey] ?? categoryKey;
    const category = slugToCategory.get(categorySlug);

    if (!category) {
      console.warn(
        `Skipping preference for "${categoryKey}": no backend category with slug "${categorySlug}".`,
      );
      continue;
    }

    if (requestsByCategoryId.has(category.categoryId)) {
      console.warn(
        `Duplicate preference omitted for productCategoryId ${category.categoryId} (key: "${categoryKey}").`,
      );
      continue;
    }

    const canonical = mapOnboardingToCanonicalPreference(categoryKey, formData);

    requestsByCategoryId.set(category.categoryId, {
      productCategoryId: category.categoryId,
      preferences: JSON.stringify({
        ...canonical,
        ...(state.selectedProfileId ? { persona: state.selectedProfileId } : {}),
      }),
    });
  }

  return [...requestsByCategoryId.values()];
}

export function resolveCategoryIdForDeviceKey(
  deviceKey: string,
  options: PreferenceOptionsResponse,
): number | null {
  const categorySlug = ONBOARDING_CATEGORY_KEY_TO_API_SLUG[deviceKey] ?? deviceKey;
  return options.categories.find((category) => category.categorySlug === categorySlug)?.categoryId ?? null;
}

export function buildPreferenceJsonForCategory(
  deviceKey: string,
  formData: Record<string, unknown>,
  selectedProfileId?: string | null,
): string {
  const canonical = mapOnboardingToCanonicalPreference(deviceKey, formData);

  return JSON.stringify({
    ...canonical,
    ...(selectedProfileId ? { persona: selectedProfileId } : {}),
  });
}

