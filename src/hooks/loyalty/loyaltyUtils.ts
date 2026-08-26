export const LUXE_POINTS_PER_NAIRA_UNIT = 1000;
export const NAIRA_PER_UNIT = 500;

/**
 * Calculates the reference Naira redemption value for a given amount of Luxe Points.
 * Formula: 1,000 Luxe Points = ₦500
 * @param points The number of points
 * @returns The reference value in Naira
 */
export const getLuxePointsReferenceValue = (points: number): number => {
  return points * (NAIRA_PER_UNIT / LUXE_POINTS_PER_NAIRA_UNIT);
};

/**
 * Formats a number as a Naira string with thousand separators.
 * @param value The value in Naira
 * @returns Formatted string (e.g., ₦42,500)
 */
export const formatNairaValue = (value: number): string => {
  return `₦${value.toLocaleString()}`;
};

export const REDEMPTION_CODE_PREFIX = 'LUXE';
