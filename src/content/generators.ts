import { TOTAL_DAYS } from './config.ts';
import type { AppState } from '../state.ts';

export const clampDay = (day: unknown): number => {
  const n = Number(day);
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(TOTAL_DAYS, Math.floor(n)));
};

export const parseDayFromSearch = (search: string | null | undefined): number => {
  const params = new URLSearchParams(search || '');
  return clampDay(params.get('day'));
};

export const getDayUrl = (day: unknown): string => `day.html?day=${clampDay(day)}`;

export const seeded = (seed: number) => {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return (): number => (value = (value * 16807) % 2147483647) / 2147483647;
};

export const sampleInts = (seed: number, min: number, max: number, count: number): number[] => {
  const rand = seeded(seed);
  const output: number[] = [];
  for (let i = 0; i < count; i += 1) {
    output.push(min + Math.floor(rand() * (max - min + 1)));
  }
  return output;
};

export const isDayUnlocked = (dayNumber: number, state: AppState): boolean => {
  if (dayNumber <= 1) return true;
  return state.doneDays.includes(dayNumber - 1);
};
