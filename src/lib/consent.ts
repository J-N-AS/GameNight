export const COOKIE_CONSENT_KEY = 'gamenight_cookie_consent';
export const COOKIE_CONSENT_UPDATED_EVENT = 'gamenight-cookie-consent-updated';
export const ADSENSE_SCRIPT_LOADED_EVENT = 'gamenight-adsense-loaded';
export const ADSENSE_SCRIPT_FAILED_EVENT = 'gamenight-adsense-failed';

export const GOOGLE_ANALYTICS_ID = 'G-Y25ETMGPL3';
export const GOOGLE_ADSENSE_CLIENT_ID = 'ca-pub-8193336706637140';

export function hasCookieConsent() {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.localStorage.getItem(COOKIE_CONSENT_KEY) === 'true';
  } catch {
    return false;
  }
}

export function grantCookieConsent() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    window.dispatchEvent(new Event(COOKIE_CONSENT_UPDATED_EVENT));
  } catch (error) {
    console.error('Could not save cookie consent to localStorage.', error);
  }
}
