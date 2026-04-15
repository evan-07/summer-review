export const TOTAL_DAYS = 15;
export const STORAGE_KEY = 'g2-math-progress-v5';
export const LEGACY_STORAGE_KEYS = ['g2-math-progress-v4', 'g2-math-progress-v3', 'g2-math-progress-v2'] as const;
export const CATEGORY_ORDER = ['Easy', 'Intermediate', 'Pattern Recognition', 'Hard', 'Problem Solving'] as const;
export const SESSION_KEYS = ['morning', 'afternoon'] as const;

export type Category = (typeof CATEGORY_ORDER)[number];
export type SessionKey = (typeof SESSION_KEYS)[number];

export interface ThemeConfig {
  name: string;
  icon: string;
  className: string;
}

export const THEMES: ThemeConfig[] = [
  { name: 'Nature Forest', icon: '🌤️', className: 'theme-day-01' },
  { name: 'Safari Animals', icon: '🦁', className: 'theme-day-02' },
  { name: 'Ocean Friends', icon: '🐠', className: 'theme-day-03' },
  { name: 'Dinosaur Land', icon: '🦕', className: 'theme-day-04' },
  { name: 'Splash Coast', icon: '🌊', className: 'theme-day-05' },
  { name: 'Sky Aircraft', icon: '✈️', className: 'theme-day-06' },
  { name: 'Jungle Adventure', icon: '🐒', className: 'theme-day-07' },
  { name: 'Farm Day', icon: '🚜', className: 'theme-day-08' },
  { name: 'Arctic Animals', icon: '🐧', className: 'theme-day-09' },
  { name: 'Puzzle Planet', icon: '🧩', className: 'theme-day-10' },
  { name: 'Castle Quest', icon: '🏰', className: 'theme-day-11' },
  { name: 'Robot Lab', icon: '🤖', className: 'theme-day-12' },
  { name: 'Pirate Bay', icon: '🏴‍☠️', className: 'theme-day-13' },
  { name: 'Superhero City', icon: '🦸', className: 'theme-day-14' },
  { name: 'Math Champions', icon: '🏆', className: 'theme-day-15' }
];

export const INSPIRATION = [
  'Tiny steps every day build giant math powers.',
  'Mistakes are clues that help us find smarter answers.',
  'Curious kids become clever problem solvers.',
  'When learning feels hard, your brain is growing strong.',
  'Be brave enough to try, and smart enough to try again.',
  'Practice turns "I cannot yet" into "I can now."',
  'Think, test, and explore. Math is an adventure.',
  'Your effort is your superpower.',
  'You are getting stronger every day.',
  'Steady practice builds strong math muscles.',
  'Patterns help us predict what comes next.',
  'Math is like detective work with numbers.',
  'Ask questions, try ideas, and keep going.',
  'You can do hard things one step at a time.',
  'Champions are made with patience and practice.'
] as const;

export const DAY_NOTES = [
  'Addition/Subtraction review + first multiplication ideas',
  'Addition/Subtraction review + first multiplication ideas',
  'Addition/Subtraction review + first multiplication ideas',
  '2-digit operations + stronger multiplication facts',
  '2-digit operations + stronger multiplication facts',
  '2-digit operations + stronger multiplication facts',
  '2-digit and 3-digit by 1-digit + place value',
  '2-digit and 3-digit by 1-digit + place value',
  '2-digit and 3-digit by 1-digit + place value',
  '2-digit by 2-digit with distributive thinking',
  '2-digit by 2-digit with distributive thinking',
  '2-digit by 2-digit with distributive thinking',
  '3-digit by 2-digit and stretch work',
  '3-digit by 2-digit and stretch work',
  '3-digit by 2-digit and stretch work'
] as const;

export const STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS];

export const SCORE_SOURCE = {
  REQUIRED: 'required',
  BONUS: 'bonus'
} as const;

export type ScoreSource = (typeof SCORE_SOURCE)[keyof typeof SCORE_SOURCE];

export const SCORE_ID_PREFIX = 'score-';
