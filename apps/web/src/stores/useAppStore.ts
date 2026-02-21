import { create } from 'zustand';

interface AppState {
  // Placeholder for future app-wide state (e.g. user, theme)
  _version: number;
}

export const useAppStore = create<AppState>(() => ({
  _version: 1,
}));
