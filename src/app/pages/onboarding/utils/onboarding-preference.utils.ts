import type { DeviceType } from '@app/shared/models/device-options.model';

/** True when payload is null, undefined, {}, or every field is null/empty. */
export function isBlankPreferencePayload(data: unknown): boolean {
  if (data == null) {
    return true;
  }

  if (typeof data !== 'object' || Array.isArray(data)) {
    return false;
  }

  return Object.values(data as Record<string, unknown>).every(
    (value) =>
      value == null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0),
  );
}

const ACCESSORY_TYPES = new Set<DeviceType>(['headphones', 'mouse', 'keyboard', 'charger']);

export function isAccessoryType(type: DeviceType): boolean {
  return ACCESSORY_TYPES.has(type);
}

/** Whether variant data contains at least one meaningful preference field. */
export function hasMeaningfulPreferenceData(type: DeviceType, data: unknown): boolean {
  if (isBlankPreferencePayload(data)) {
    return false;
  }

  const record = data as Record<string, unknown>;

  switch (type) {
    case 'laptop':
      return (
        record['ramOption'] != null ||
        record['displaySize'] != null ||
        record['priceRange'] != null ||
        record['batteryPriority'] != null
      );
    case 'phone':
      return (
        record['primaryUse'] != null ||
        record['storage'] != null ||
        record['screenSize'] != null ||
        record['priceRange'] != null
      );
    case 'headphones':
      return record['feature'] != null && record['budget'] != null;
    case 'mouse':
      if (record['profile'] != null && record['budget'] != null) {
        return true;
      }
      return (
        record['minDpi'] != null ||
        record['interfaceType'] != null ||
        (record['type'] != null &&
          !['mechanical', 'silent', 'backlit'].includes(String(record['type'])))
      );
    case 'keyboard':
      return record['type'] != null && record['budget'] != null;
    case 'charger':
      return record['feature'] != null && record['budget'] != null;
    default:
      return false;
  }
}
