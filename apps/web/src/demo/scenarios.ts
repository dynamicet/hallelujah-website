// Review scenarios are selected only from explicit URL values. They never use cookies or storage.
export function demoScenario<const T extends string>(
  value: string | string[] | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  return typeof value === 'string' && allowed.includes(value as T) ? value as T : fallback
}
