import { LEGACY_STORAGE_KEYS, STORAGE_KEY } from './content/config.js';
import { createDefaultState, normalizeState } from './state.js';

const parse = (raw) => {
  try { return JSON.parse(raw); } catch { return null; }
};

export const migrateState = (legacy) => {
  const base = createDefaultState();
  if (!legacy || typeof legacy !== 'object') return base;
  const migrated = { ...base, ...legacy };
  migrated.version = 5;
  migrated.doneDays = Array.isArray(legacy.doneDays) ? [...new Set(legacy.doneDays.map(Number).filter(Boolean))] : [];
  migrated.parentScores = Array.isArray(legacy.parentScores) ? legacy.parentScores : [];
  migrated.progress = legacy.progress && typeof legacy.progress === 'object' ? legacy.progress : {};
  migrated.bonusAttempts = legacy.bonusAttempts && typeof legacy.bonusAttempts === 'object' ? legacy.bonusAttempts : {};
  return normalizeState(migrated);
};

export const loadState = () => {
  let found = parse(localStorage.getItem(STORAGE_KEY));
  if (!found) {
    for (const key of LEGACY_STORAGE_KEYS) {
      found = parse(localStorage.getItem(key));
      if (found) break;
    }
  }
  const state = migrateState(found);
  saveState(state);
  return state;
};

export const saveState = (state) => localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeState(state)));
