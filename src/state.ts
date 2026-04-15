import { CATEGORY_ORDER, SESSION_KEYS, STATUS, type Category, type ScoreSource, type SessionKey, type Status } from './content/config.ts';

export interface SectionProgress {
  status: Status;
  totalSeconds: number;
}

export type SectionProgressMap = Record<Category, SectionProgress>;

export interface SessionProgress {
  completed: boolean;
  sections: SectionProgressMap;
  totalSeconds: number;
}

export interface DayProgress {
  morning: SessionProgress;
  afternoon: SessionProgress;
  dayCompleted: boolean;
  totalSeconds: number;
}

export type ProgressMap = Record<string, DayProgress>;

export interface BonusAttempt {
  day: number;
  session: SessionKey;
  section: Category;
  attempt: number;
  source: ScoreSource;
  generatedAt: string;
  questions: string[];
}

export type BonusAttemptMap = Record<string, BonusAttempt[]>;

export interface ParentScoreEntry {
  id: string;
  day: number;
  session: SessionKey;
  section: Category;
  score: number;
  maxScore: number;
  percentage: number;
  source: ScoreSource;
  updatedAt: string;
  recordedAt: string;
  timeSeconds?: number;
  notes?: string;
}

export interface ParentScoreDraft {
  id?: string;
  day: number;
  session: SessionKey;
  section: Category;
  score: number;
  maxScore: number;
  source: ScoreSource;
  recordedAt?: string;
  timeSeconds?: number;
  notes?: string;
}

export interface RewardsState {
  stars: number;
  badges: string[];
}

export interface TimerState {
  isRunning: boolean;
  startedAt: number | null;
  day: number | null;
  session: SessionKey | null;
  section: Category | null;
}

export interface AppState {
  version: number;
  doneDays: number[];
  activeDay: number | null;
  activeSession: SessionKey | null;
  activeSection: Category | null;
  timerState: TimerState;
  progress: ProgressMap;
  bonusAttempts: BonusAttemptMap;
  parentScores: ParentScoreEntry[];
  rewards: RewardsState;
}

const createSection = (): SectionProgress => ({ status: STATUS.NOT_STARTED, totalSeconds: 0 });

const createSession = (): SessionProgress => ({
  completed: false,
  sections: Object.fromEntries(CATEGORY_ORDER.map((category) => [category, createSection()])) as SectionProgressMap,
  totalSeconds: 0
});

export const createDefaultState = (): AppState => ({
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

export const getDayProgress = (state: AppState, day: number): DayProgress => {
  const key = `day-${day}`;
  if (!state.progress[key]) {
    state.progress[key] = { morning: createSession(), afternoon: createSession(), dayCompleted: false, totalSeconds: 0 };
  }
  return state.progress[key];
};

export const normalizeState = (state: Partial<AppState>): AppState => {
  const next: AppState = { ...createDefaultState(), ...state };
  SESSION_KEYS.forEach((session) => {
    Object.keys(next.progress || {}).forEach((key) => {
      const day = next.progress[key] as Partial<DayProgress>;
      if (!day[session]) {
        day[session] = createSession();
      }
      CATEGORY_ORDER.forEach((category) => {
        const sessionProgress = day[session] as SessionProgress;
        if (!sessionProgress.sections?.[category]) {
          sessionProgress.sections[category] = createSection();
        }
      });
    });
  });
  return next;
};
