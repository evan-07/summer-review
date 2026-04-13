import { CATEGORY_ORDER, SESSION_KEYS, STATUS } from './content/config.js';

const createSection = () => ({ status: STATUS.NOT_STARTED, totalSeconds: 0 });
const createSession = () => ({ completed: false, sections: Object.fromEntries(CATEGORY_ORDER.map((c) => [c, createSection()])), totalSeconds: 0 });

export const createDefaultState = () => ({
  version: 5,
  doneDays: [],
  activeDay: 1,
  activeSession: null,
  activeSection: null,
  timerState: { isRunning: false, startedAt: null, day: null, session: null, section: null },
  progress: {},
  bonusAttempts: {},
  parentScores: [],
  rewards: { stars: 0, badges: [] }
});

export const getDayProgress = (state, day) => {
  const key = `day-${day}`;
  if (!state.progress[key]) {
    state.progress[key] = { morning: createSession(), afternoon: createSession(), dayCompleted: false, totalSeconds: 0 };
  }
  return state.progress[key];
};

export const normalizeState = (state) => {
  const next = { ...createDefaultState(), ...state };
  SESSION_KEYS.forEach((session) => {
    Object.keys(next.progress || {}).forEach((key) => {
      const day = next.progress[key] || {};
      if (!day[session]) day[session] = createSession();
      CATEGORY_ORDER.forEach((c) => {
        if (!day[session].sections?.[c]) day[session].sections[c] = createSection();
      });
    });
  });
  return next;
};
