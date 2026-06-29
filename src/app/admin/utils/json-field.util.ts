/**
 * Parse a JSON string into key-value entries for the dynamic field editor.
 */
export function parseSpecsToFields(specsJson: string): { key: string; value: string }[] {
  if (!specsJson?.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(specsJson) as Record<string, unknown>;
    return Object.entries(parsed).map(([key, value]) => ({
      key,
      value: value === null || value === undefined ? '' : String(value),
    }));
  } catch {
    return [];
  }
}

/**
 * Build a JSON string from active dynamic field entries.
 */
export function buildSpecsFromFields(
  fields: { key: string; value: string; markedForRemoval?: boolean }[],
): string {
  const obj: Record<string, string> = {};

  for (const field of fields) {
    if (field.markedForRemoval || !field.key.trim()) {
      continue;
    }
    obj[field.key.trim()] = field.value;
  }

  return JSON.stringify(obj);
}

/**
 * Parse user preference JSON for read-only display.
 */
export function parsePreferencesJson(json: string): { key: string; value: string }[] {
  return parseSpecsToFields(json);
}
