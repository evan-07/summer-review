import { SCORE_ID_PREFIX } from '../content/config.js';

export const calcPercentage = (score, maxScore) => (maxScore ? Math.round((Number(score) / Number(maxScore)) * 100) : 0);

export const saveParentScore = (state, entry) => {
  const now = new Date().toISOString();
  const row = { ...entry, id: entry.id || `${SCORE_ID_PREFIX}${Date.now()}`, percentage: calcPercentage(entry.score, entry.maxScore), updatedAt: now, recordedAt: entry.recordedAt || now };
  state.parentScores.push(row);
  return row;
};

export const updateParentScore = (state, id, patch) => {
  state.parentScores = state.parentScores.map((row) => row.id === id ? { ...row, ...patch, percentage: calcPercentage(patch.score ?? row.score, patch.maxScore ?? row.maxScore), updatedAt: new Date().toISOString() } : row);
};

export const deleteParentScore = (state, id) => {
  state.parentScores = state.parentScores.filter((row) => row.id !== id);
};

export const filterScores = (scores, filters) => scores.filter((entry) => {
  if (filters.day && String(entry.day) !== String(filters.day)) return false;
  if (filters.session && entry.session !== filters.session) return false;
  if (filters.section && entry.section !== filters.section) return false;
  if (filters.source && entry.source !== filters.source) return false;
  return true;
});
