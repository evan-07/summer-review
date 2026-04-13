import { loadState } from './storage.js';
import { route } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
  const state = loadState();
  route(state);
});
