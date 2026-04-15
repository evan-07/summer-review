import { LEGACY_STORAGE_KEYS, STORAGE_KEY } from './content/config.ts';
import { createDefaultState, normalizeState, type AppState, type ParentScoreEntry } from './state.ts';

const parse = (raw: string | null): unknown => {
  try {
    return JSON.parse(raw ?? '');
  } catch {
    return null;
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isParentScoreEntry = (value: unknown): value is ParentScoreEntry =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.day === 'number' &&
  typeof value.session === 'string' &&
  typeof value.section === 'string' &&
  typeof value.score === 'number' &&
  typeof value.maxScore === 'number' &&
  typeof value.source === 'string';

export const migrateState = (legacy: unknown): AppState => {
  const base = createDefaultState();
  if (!isRecord(legacy)) return base;

  const migrated: AppState = { ...base, ...(legacy as Partial<AppState>) };
  migrated.version = 5;
  migrated.doneDays = Array.isArray(legacy.doneDays) ? [...new Set(legacy.doneDays.map(Number).filter(Boolean))] : [];
  migrated.parentScores = Array.isArray(legacy.parentScores) ? legacy.parentScores.filter(isParentScoreEntry) : [];
  migrated.progress = isRecord(legacy.progress) ? (legacy.progress as AppState['progress']) : {};
  migrated.bonusAttempts = isRecord(legacy.bonusAttempts) ? (legacy.bonusAttempts as AppState['bonusAttempts']) : {};
  return normalizeState(migrated);
};

export const loadState = (): AppState => {
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

export const saveState = (state: AppState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeState(state)));
};
