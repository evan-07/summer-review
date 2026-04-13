import { describe, expect, test } from 'vitest';
import { getCostumeSVG } from '../../assets/js/ui/mascot.js';

describe('getCostumeSVG', () => {
  test('returns a non-empty string for each valid day 1-15', () => {
    for (let day = 1; day <= 15; day++) {
      const svg = getCostumeSVG(day);
      expect(typeof svg).toBe('string');
      expect(svg.length).toBeGreaterThan(0);
    }
  });

  test('returns day-1 costume as fallback for out-of-range days', () => {
    expect(getCostumeSVG(0)).toBe(getCostumeSVG(1));
    expect(getCostumeSVG(16)).toBe(getCostumeSVG(1));
  });
});
