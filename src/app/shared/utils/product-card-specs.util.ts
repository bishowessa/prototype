import { isPredictedFlagKey } from '@app/shared/utils/spec-prediction.util';

const MAX_MAIN_SPECS = 2;

/** Backend `MobileVariantSpecs` / `LaptopSpecs` field names (flat camelCase JSON). */
const STORAGE_KEYS = [
  'storage',
  'storagegb',
  'internal',
  'rom',
  'minstoragegb',
] as const;

const RAM_KEYS = ['ram', 'ramgb', 'memory', 'minramgb', 'minmemorygb'] as const;

const DEVICE_CATEGORY_SLUGS = new Set([
  'mobile',
  'phone',
  'phones',
  'laptops',
  'laptop',
  'tablet',
  'tablets',
]);

const SKIP_SPEC_KEYS = new Set([
  'price',
  'rating',
  'imageurl',
  'url_image',
  'source',
  'url',
  'id',
  'name',
  'brand',
  'categoryslug',
  'version',
  'persona',
  'listings',
  'colors',
  'producturl',
  'os',
  'operating_system',
  'operatingsystem',
  'battery',
  'batterycapacity',
  'batteryscore',
  'chipset',
  'processor',
  'displaytype',
  'displaysize',
  'displayresolution',
  'displayprotection',
  'refreshrate',
  'panel',
  'screen_size',
  'resolution',
  'graphics_card',
  'graphicscard',
  'model',
  'weight',
  'width',
  'height',
  'thickness',
]);

export interface MainSpecsOptions {
  categorySlug?: string;
  /** Variant-level specs JSON objects (mobile RAM/storage usually live here). */
  variantSpecs?: Array<Record<string, unknown> | string | null | undefined>;
}

type SpecRule = {
  keys: readonly string[];
  format: (value: unknown) => string | null;
};

function normalizeKey(key: string): string {
  return key.replace(/_/g, '').toLowerCase();
}

function parseSpecsRecord(
  specs: Record<string, unknown> | string | null | undefined,
): Record<string, unknown> {
  if (!specs) {
    return {};
  }

  if (typeof specs === 'object' && !Array.isArray(specs)) {
    return specs;
  }

  if (typeof specs !== 'string' || !specs.trim()) {
    return {};
  }

  try {
    const parsed = JSON.parse(specs) as unknown;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function collectSpecRecords(
  productSpecs: Record<string, unknown>,
  variantSpecs?: MainSpecsOptions['variantSpecs'],
): Record<string, unknown>[] {
  const records: Record<string, unknown>[] = [];

  for (const variant of variantSpecs ?? []) {
    const parsed = parseSpecsRecord(variant);
    if (Object.keys(parsed).length > 0) {
      records.push(parsed);
    }
  }

  if (Object.keys(productSpecs).length > 0) {
    records.push(productSpecs);
  }

  return records.length > 0 ? records : [productSpecs];
}

function isDisplayableSpecValue(value: unknown): boolean {
  if (value == null || value === '') {
    return false;
  }

  if (typeof value === 'boolean' || Array.isArray(value)) {
    return false;
  }

  return true;
}

function findFirstSpecValue(
  records: Record<string, unknown>[],
  keys: readonly string[],
): unknown | undefined {
  const wanted = new Set(keys.map(normalizeKey));

  for (const record of records) {
    for (const [key, value] of Object.entries(record)) {
      if (!wanted.has(normalizeKey(key))) {
        continue;
      }
      if (isPredictedFlagKey(key) || !isDisplayableSpecValue(value)) {
        continue;
      }
      return value;
    }
  }

  return undefined;
}

function firstCapacityToken(text: string): string | null {
  const match = text.trim().match(/(\d+(?:\.\d+)?)\s*(TB|GB)\b/i);
  if (!match) {
    return null;
  }

  return `${match[1]}${match[2].toUpperCase()}`;
}

function parseCombinedMemoryString(text: string): { storage: string | null; ram: string | null } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { storage: null, ram: null };
  }

  const combined = trimmed.match(
    /^(\d+(?:\.\d+)?)\s*(TB|GB)\b\s+(\d+(?:\.\d+)?)\s*GB\s*RAM\b/i,
  );
  if (combined) {
    return {
      storage: `${combined[1]}${combined[2].toUpperCase()}`,
      ram: `${combined[3]}GB`,
    };
  }

  if (/\bRAM\b/i.test(trimmed)) {
    const ramMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*GB\s*RAM\b/i);
    const ram = ramMatch ? `${ramMatch[1]}GB` : null;
    const storage = firstCapacityToken(trimmed.replace(/\b\d+(?:\.\d+)?\s*GB\s*RAM\b/i, ''));
    return { storage, ram };
  }

  const storage = firstCapacityToken(trimmed);
  return { storage, ram: null };
}

function formatStorageBadge(value: unknown): string | null {
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 0) {
    return `${numeric}GB Storage`;
  }

  const text = String(value ?? '').trim();
  if (!text) {
    return null;
  }

  const parsed = parseCombinedMemoryString(text);
  if (parsed.storage) {
    return `${parsed.storage} Storage`;
  }

  if (/storage/i.test(text)) {
    return firstCapacityToken(text) ? `${firstCapacityToken(text)} Storage` : formatShortText(text, 18);
  }

  const token = firstCapacityToken(text);
  return token ? `${token} Storage` : formatShortText(text, 18);
}

function formatRamBadge(value: unknown): string | null {
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 0) {
    return `${numeric}GB RAM`;
  }

  const text = String(value ?? '').trim();
  if (!text) {
    return null;
  }

  const parsed = parseCombinedMemoryString(text);
  if (parsed.ram) {
    return `${parsed.ram} RAM`;
  }

  if (/\bRAM\b/i.test(text)) {
    const ramMatch = text.match(/(\d+(?:\.\d+)?)\s*GB\b/i);
    return ramMatch ? `${ramMatch[1]}GB RAM` : formatShortText(text, 16);
  }

  const token = text.match(/(\d+(?:\.\d+)?)\s*GB\b/i);
  if (token) {
    return `${token[1]}GB RAM`;
  }

  return formatShortText(text, 16);
}

function formatShortText(value: unknown, maxLength = 24): string | null {
  const text = String(value ?? '').trim();
  if (!text || text === 'null' || text === 'undefined') {
    return null;
  }

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

function formatWattage(value: unknown): string | null {
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 0) {
    return `${numeric}W`;
  }

  const text = String(value ?? '').trim();
  return text ? (/w/i.test(text) ? text : `${text}W`) : null;
}

function formatDpi(value: unknown): string | null {
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 0) {
    return `${numeric} DPI`;
  }

  const text = String(value ?? '').trim();
  return text ? (/dpi/i.test(text) ? text : `${text} DPI`) : null;
}

const ACCESSORY_FALLBACK_RULES: SpecRule[] = [
  { keys: ['interfaceType', 'connectionType', 'connectivity'], format: (v) => formatShortText(v, 22) },
  { keys: ['switchType'], format: (v) => formatShortText(v, 20) },
  { keys: ['type'], format: (v) => formatShortText(v, 20) },
  { keys: ['minWattage'], format: formatWattage },
  { keys: ['minDpi'], format: formatDpi },
];

const RESERVED_SPEC_KEYS = new Set<string>([...STORAGE_KEYS, ...RAM_KEYS]);

function isDeviceCategory(categorySlug?: string): boolean {
  if (!categorySlug) {
    return false;
  }

  return DEVICE_CATEGORY_SLUGS.has(normalizeCategorySlug(categorySlug));
}

function normalizeCategorySlug(slug: string): string {
  const normalized = slug.trim().toLowerCase();
  if (normalized === 'phone' || normalized === 'phones') {
    return 'mobile';
  }
  if (normalized === 'laptop') {
    return 'laptops';
  }
  if (normalized === 'tablets') {
    return 'tablet';
  }
  return normalized;
}

function pushUnique(results: string[], label: string | null): void {
  if (!label) {
    return;
  }

  if (!results.some((item) => item.toLowerCase() === label.toLowerCase())) {
    results.push(label);
  }
}

/** Extracts up to two highlight specs, hard-prioritizing storage then RAM. */
export function extractMainProductSpecs(
  specs: Record<string, unknown> | string | null | undefined,
  options: MainSpecsOptions = {},
): string[] {
  const productSpecs = parseSpecsRecord(specs);
  const records = collectSpecRecords(productSpecs, options.variantSpecs);
  const results: string[] = [];

  const storageValue = findFirstSpecValue(records, STORAGE_KEYS);
  let storageLabel = storageValue != null ? formatStorageBadge(storageValue) : null;

  const ramValue = findFirstSpecValue(records, RAM_KEYS);
  let ramLabel = ramValue != null ? formatRamBadge(ramValue) : null;

  if (
    storageValue != null &&
    typeof storageValue === 'string' &&
    (!storageLabel || !ramLabel)
  ) {
    const parsed = parseCombinedMemoryString(storageValue);
    if (!storageLabel && parsed.storage) {
      storageLabel = `${parsed.storage} Storage`;
    }
    if (!ramLabel && parsed.ram) {
      ramLabel = `${parsed.ram} RAM`;
    }
  }

  pushUnique(results, storageLabel);
  pushUnique(results, ramLabel);

  if (results.length >= MAX_MAIN_SPECS) {
    return results.slice(0, MAX_MAIN_SPECS);
  }

  if (storageLabel || ramLabel) {
    return results.slice(0, MAX_MAIN_SPECS);
  }

  if (isDeviceCategory(options.categorySlug)) {
    return results.slice(0, MAX_MAIN_SPECS);
  }

  for (const rule of ACCESSORY_FALLBACK_RULES) {
    if (results.length >= MAX_MAIN_SPECS) {
      break;
    }

    for (const key of rule.keys) {
      const value = findFirstSpecValue(records, [key]);
      if (value == null) {
        continue;
      }

      pushUnique(results, rule.format(value));
      break;
    }
  }

  if (results.length >= MAX_MAIN_SPECS) {
    return results.slice(0, MAX_MAIN_SPECS);
  }

  for (const record of records) {
    for (const [key, value] of Object.entries(record)) {
      if (results.length >= MAX_MAIN_SPECS) {
        break;
      }

      const lowerKey = normalizeKey(key);
      if (
        isPredictedFlagKey(key) ||
        SKIP_SPEC_KEYS.has(lowerKey) ||
        RESERVED_SPEC_KEYS.has(lowerKey)
      ) {
        continue;
      }

      if (!isDisplayableSpecValue(value)) {
        continue;
      }

      pushUnique(results, formatShortText(value, 24));
    }
  }

  return results.slice(0, MAX_MAIN_SPECS);
}
