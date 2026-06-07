/**
 * API Dynamic Endpoint Resolver
 * 
 * Solves the Docker networking dichotomy:
 * 1. Client-side browser requests run outside the Docker bridge network,
 *    meaning they cannot resolve container names (e.g. "cookie-backend")
 *    and must talk to "localhost" or a public domain.
 * 2. Server-side requests (Next.js SSR, ISR, Server Actions) run inside
 *    the Docker network and can target the container name directly ("http://cookie-backend:8000").
 */

const getApiBaseUrl = (): string => {
  // Client-Side Execution (Browser context)
  if (typeof window !== 'undefined') {
    // Falls back to localhost:8000 for local dev if not specified
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  // Server-Side Execution (Node/Docker container context)
  // Can communicate directly with the backend container name over internal DNS
  return process.env.INTERNAL_API_URL || 'http://cookie-backend:8000';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  root: `${API_BASE_URL}/`,
  graphData: `${API_BASE_URL}/graph-data`,
  waterfall: (consent: boolean) => `${API_BASE_URL}/waterfall?consent=${consent}`,
  gdeltEvents: `${API_BASE_URL}/gdelt-events`,
  domainGroups: `${API_BASE_URL}/domain-groups`,
};
