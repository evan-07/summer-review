import { CATEGORY_ORDER, SESSION_KEYS, STATUS, type Category, type SessionKey } from '../content/config.ts';
import { getDayProgress, type AppState, type DayProgress, type SessionProgress } from '../state.ts';

export const getSessionProgress = (state: AppState, day: number, session: SessionKey): SessionProgress =>
  getDayProgress(state, day)[session];

export const recalcSession = (state: AppState, day: number, session: SessionKey): SessionProgress => {
  const current = getSessionProgress(state, day, session);
  current.totalSeconds = CATEGORY_ORDER.reduce((sum, category) => sum + current.sections[category].totalSeconds, 0);
  current.completed = CATEGORY_ORDER.every((category) => current.sections[category].status === STATUS.COMPLETED);
  return current;
};

export const recalcDay = (state: AppState, day: number): DayProgress => {
  const dayProgress = getDayProgress(state, day);
  SESSION_KEYS.forEach((session) => recalcSession(state, day, session));
  dayProgress.totalSeconds = dayProgress.morning.totalSeconds + dayProgress.afternoon.totalSeconds;
  dayProgress.dayCompleted = dayProgress.morning.completed && dayProgress.afternoon.completed;
  if (dayProgress.dayCompleted && !state.doneDays.includes(day)) state.doneDays.push(day);
  if (!dayProgress.dayCompleted) state.doneDays = state.doneDays.filter((doneDay) => doneDay !== day);
  return dayProgress;
};

export const markSectionCompleted = (state: AppState, day: number, session: SessionKey, section: Category): void => {
  getSessionProgress(state, day, session).sections[section].status = STATUS.COMPLETED;
  recalcDay(state, day);
};
