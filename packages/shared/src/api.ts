// API contract types and client helpers (for web consumption)

const API_PREFIX = '/api/v1';

export const api = {
  health: () => fetch('/health').then((r) => r.json()),

  // Placeholder endpoints (not implemented yet)
  // me: () => fetch(`${API_PREFIX}/me`).then(r => r.json()),
  // projects: { list: () => fetch(`${API_PREFIX}/projects`).then(r => r.json()) },
} as const;

export type HealthResponse = { status: string };
