import { getSessionProgress } from './progress.ts';
import { STATUS, type Category, type SessionKey } from '../content/config.ts';
import type { AppState } from '../state.ts';

export const startTimer = (state: AppState, day: number, session: SessionKey, section: Category): void => {
  state.timerState = { isRunning: true, startedAt: Date.now(), day, session, section };
  state.activeDay = day;
  state.activeSession = session;
  state.activeSection = section;
  getSessionProgress(state, day, session).sections[section].status = STATUS.IN_PROGRESS;
};

export const stopTimer = (state: AppState): void => {
  const timer = state.timerState;
  if (!timer.isRunning || timer.startedAt === null || timer.day === null || timer.session === null || timer.section === null) return;
  const elapsed = Math.floor((Date.now() - timer.startedAt) / 1000);
  getSessionProgress(state, timer.day, timer.session).sections[timer.section].totalSeconds += Math.max(0, elapsed);
  state.timerState = { isRunning: false, startedAt: null, day: null, session: null, section: null };
};
