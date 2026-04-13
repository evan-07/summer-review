import { CATEGORY_ORDER, SESSION_KEYS } from '../content/config.js';
import { getDayProgress } from '../state.js';

export const getSessionProgress = (state, day, session) => getDayProgress(state, day)[session];

export const recalcSession = (state, day, session) => {
  const current = getSessionProgress(state, day, session);
  current.totalSeconds = CATEGORY_ORDER.reduce((sum, c) => sum + current.sections[c].totalSeconds, 0);
  current.completed = CATEGORY_ORDER.every((c) => current.sections[c].status === 'completed');
  return current;
};

export const recalcDay = (state, day) => {
  const dayProgress = getDayProgress(state, day);
  SESSION_KEYS.forEach((s) => recalcSession(state, day, s));
  dayProgress.totalSeconds = dayProgress.morning.totalSeconds + dayProgress.afternoon.totalSeconds;
  dayProgress.dayCompleted = dayProgress.morning.completed && dayProgress.afternoon.completed;
  if (dayProgress.dayCompleted && !state.doneDays.includes(day)) state.doneDays.push(day);
  if (!dayProgress.dayCompleted) state.doneDays = state.doneDays.filter((d) => d !== day);
  return dayProgress;
};

export const markSectionCompleted = (state, day, session, section) => {
  getSessionProgress(state, day, session).sections[section].status = 'completed';
  recalcDay(state, day);
};
