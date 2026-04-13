import { getSessionProgress } from './progress.js';

export const startTimer = (state, day, session, section) => {
  state.timerState = { isRunning: true, startedAt: Date.now(), day, session, section };
  state.activeDay = day;
  state.activeSession = session;
  state.activeSection = section;
  getSessionProgress(state, day, session).sections[section].status = 'in_progress';
};

export const stopTimer = (state) => {
  const timer = state.timerState;
  if (!timer?.isRunning) return;
  const elapsed = Math.floor((Date.now() - timer.startedAt) / 1000);
  getSessionProgress(state, timer.day, timer.session).sections[timer.section].totalSeconds += Math.max(0, elapsed);
  state.timerState = { isRunning: false, startedAt: null, day: null, session: null, section: null };
};
