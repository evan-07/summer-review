import { TOTAL_DAYS } from './config.js';

export const clampDay = (day) => {
  const n = Number(day);
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(TOTAL_DAYS, Math.floor(n)));
};

export const parseDayFromSearch = (search) => {
  const params = new URLSearchParams(search || '');
  return clampDay(params.get('day'));
};

export const getDayUrl = (day) => `day.html?day=${clampDay(day)}`;

export const seeded = (seed) => {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => (value = (value * 16807) % 2147483647) / 2147483647;
};

export const sampleInts = (seed, min, max, count) => {
  const rand = seeded(seed);
  const output = [];
  for (let i = 0; i < count; i += 1) {
    output.push(min + Math.floor(rand() * (max - min + 1)));
  }
  return output;
};

export const isDayUnlocked = (dayNumber, state) => {
  if (dayNumber <= 1) return true;
  return state.doneDays.includes(dayNumber - 1);
};
