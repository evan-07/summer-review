import { loadState } from './storage.ts';
import { route } from './router.js';

export const startApp = (): void => {
  const state = loadState();
  route(state);
};

document.addEventListener('DOMContentLoaded', startApp);
