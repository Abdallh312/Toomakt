/**
 * Clean HTML5 History URL Navigation Utility
 * Eliminates '#' hashes completely from the URL bar across the application.
 */

export function getCleanRoute(): string {
  if (typeof window === 'undefined') return 'home';

  // If a hash is present (e.g. from an old link or bookmark #admin/login),
  // migrate it immediately to a clean HTML5 URL path
  if (window.location.hash) {
    const rawHash = window.location.hash.replace(/^#\/?/, '');
    const cleanPath = rawHash ? `/${rawHash}` : '/';
    try {
      window.history.replaceState(null, '', cleanPath);
    } catch {
      // ignore
    }
    const cleanRoute = rawHash.replace(/^\/|\/$/g, '');
    return cleanRoute || 'home';
  }

  const path = window.location.pathname.replace(/^\/|\/$/g, '');
  return path || 'home';
}

export function navigateTo(target: string, options?: { replace?: boolean }) {
  if (typeof window === 'undefined') return;

  let clean = target.replace(/^#\/?/, '').replace(/^\/|\/$/g, '');
  if (clean === 'home' || clean === '') {
    clean = '';
  }

  const url = clean ? `/${clean}` : '/';

  if (window.location.pathname !== url || window.location.hash) {
    if (options?.replace) {
      window.history.replaceState(null, '', url);
    } else {
      window.history.pushState(null, '', url);
    }
  }

  // Trigger a popstate event so all routing listeners update instantly
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
