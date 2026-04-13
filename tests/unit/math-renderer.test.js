import { describe, expect, test } from 'vitest';
import { renderMath } from '../../assets/js/ui/math-renderer.js';

describe('renderMath', () => {
  test('wraps + in green span', () => {
    expect(renderMath('12 + 7')).toBe('12 <span class="op op--plus">+</span> 7');
  });

  test('wraps - in orange-red span', () => {
    expect(renderMath('35 - 18')).toBe('35 <span class="op op--minus">-</span> 18');
  });

  test('wraps × in purple span', () => {
    expect(renderMath('6 × 4')).toBe('6 <span class="op op--times">×</span> 4');
  });

  test('handles multiple operators in one question', () => {
    const result = renderMath('What is 200 + 5?');
    expect(result).toContain('<span class="op op--plus">+</span>');
    expect(result).toContain('What is 200');
    expect(result).toContain('5?');
  });

  test('leaves plain text with no operators unchanged', () => {
    expect(renderMath('Expanded form of 540')).toBe('Expanded form of 540');
  });

  test('leaves word problem text without math operators unchanged', () => {
    const q = 'A class has 20 students and 5 join. How many now?';
    expect(renderMath(q)).toBe(q);
  });

  test('does not wrap hyphens in non-operator context', () => {
    expect(renderMath('non-operator-5')).toBe('non-operator-5');
  });
});
