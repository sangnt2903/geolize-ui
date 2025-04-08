/**
 * Common utility functions for the application
 */

/**
 * Format a date string to a more readable format
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Truncate a string to a specified length
 * @param str - String to truncate
 * @param length - Maximum length
 * @returns Truncated string
 */
export const truncateString = (str: string, length: number = 100): string => {
  if (str.length <= length) return str;
  return `${str.substring(0, length)}...`;
};

/**
 * Debounce a function call
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};