import { SCORE_ID_PREFIX, type Category, type ScoreSource, type SessionKey } from '../content/config.ts';
import type { AppState, ParentScoreDraft, ParentScoreEntry } from '../state.ts';

export interface ParentScoreFilters {
  day?: number | string;
  session?: SessionKey | '';
  section?: Category | '';
  source?: ScoreSource | '';
}

export const calcPercentage = (score: number, maxScore: number): number =>
  maxScore ? Math.round((Number(score) / Number(maxScore)) * 100) : 0;

export const saveParentScore = (state: AppState, entry: ParentScoreDraft): ParentScoreEntry => {
  const now = new Date().toISOString();
  const row: ParentScoreEntry = {
    ...entry,
    id: entry.id || `${SCORE_ID_PREFIX}${Date.now()}`,
    percentage: calcPercentage(entry.score, entry.maxScore),
    updatedAt: now,
    recordedAt: entry.recordedAt || now
  };
  state.parentScores.push(row);
  return row;
};

export const updateParentScore = (state: AppState, id: string, patch: Partial<ParentScoreDraft>): void => {
  state.parentScores = state.parentScores.map((row) =>
    row.id === id
      ? {
          ...row,
          ...patch,
          percentage: calcPercentage(patch.score ?? row.score, patch.maxScore ?? row.maxScore),
          updatedAt: new Date().toISOString()
        }
      : row
  );
};

export const deleteParentScore = (state: AppState, id: string): void => {
  state.parentScores = state.parentScores.filter((row) => row.id !== id);
};

export const filterScores = (scores: ParentScoreEntry[], filters: ParentScoreFilters): ParentScoreEntry[] =>
  scores.filter((entry) => {
    if (filters.day && String(entry.day) !== String(filters.day)) return false;
    if (filters.session && entry.session !== filters.session) return false;
    if (filters.section && entry.section !== filters.section) return false;
    if (filters.source && entry.source !== filters.source) return false;
    return true;
  });
