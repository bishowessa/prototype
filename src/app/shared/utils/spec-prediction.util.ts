/** Normalizes spec/flag keys for pairing value fields with `is*Predicted` flags. */
function normalizeSpecKey(key: string): string {
  return key.replace(/_/g, '').toLowerCase();
}

/** True when the key is a standalone ML prediction flag (not a displayable spec). */
export function isPredictedFlagKey(key: string): boolean {
  return /^is[A-Za-z]+Predicted$/i.test(key) || /^is_.*_predicted$/i.test(key);
}

/** Builds a set of normalized field names whose values were ML-predicted. */
export function buildPredictedFieldSet(parsed: Record<string, unknown>): Set<string> {
  const predicted = new Set<string>();

  for (const [key, value] of Object.entries(parsed)) {
    if (value !== true && value !== 'true') {
      continue;
    }

    const camelMatch = key.match(/^is(.+)Predicted$/i);
    if (camelMatch) {
      predicted.add(normalizeSpecKey(camelMatch[1]));
      continue;
    }

    const snakeMatch = key.match(/^is_(.+)_predicted$/i);
    if (snakeMatch) {
      predicted.add(normalizeSpecKey(snakeMatch[1]));
    }
  }

  return predicted;
}

/** Whether a spec field value should show the "Estimated" label. */
export function isSpecFieldPredicted(
  specKey: string,
  predictedFields: Set<string>,
): boolean {
  return predictedFields.has(normalizeSpecKey(specKey));
}
