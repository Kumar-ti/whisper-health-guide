
// Local storage keys
const ANONYMOUS_TOKEN_KEY = 'health-app-anonymous-token';

/**
 * Gets the anonymous token from localStorage, if it exists
 */
export const getAnonymousToken = (): string | null => {
  return localStorage.getItem(ANONYMOUS_TOKEN_KEY);
};

/**
 * Saves the anonymous token to localStorage
 */
export const saveAnonymousToken = (token: string): void => {
  localStorage.setItem(ANONYMOUS_TOKEN_KEY, token);
};

/**
 * Removes the anonymous token from localStorage
 */
export const clearAnonymousToken = (): void => {
  localStorage.removeItem(ANONYMOUS_TOKEN_KEY);
};

/**
 * Checks if the user has an anonymous token
 */
export const hasAnonymousToken = (): boolean => {
  return !!getAnonymousToken();
};
