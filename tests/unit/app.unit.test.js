import { describe, expect, test } from 'vitest';
import { parseDayFromSearch } from '../../assets/js/content/generators.js';
import { getRequiredQuestions } from '../../assets/js/content/question-bank.js';
import { getBonusQuestions } from '../../assets/js/content/bonus-generators.js';
import { createDefaultState, getDayProgress } from '../../assets/js/state.js';
import { recalcDay, markSectionCompleted } from '../../assets/js/features/progress.js';
import { migrateState } from '../../assets/js/storage.js';
import { calcPercentage, filterScores } from '../../assets/js/features/parent-scores.js';

describe('day parsing', () => {
  test('clamps and defaults day query', () => {
    expect(parseDayFromSearch('?day=2')).toBe(2);
    expect(parseDayFromSearch('?day=999')).toBe(15);
    expect(parseDayFromSearch('?day=nope')).toBe(1);
  });
});

describe('question generation', () => {
  test('returns required questions and distinct bonus set', () => {
    const required = getRequiredQuestions({ day: 3, session: 'morning', category: 'Easy' });
    const bonus = getBonusQuestions({ day: 3, session: 'morning', category: 'Easy', attempt: 1 });
    expect(required).toHaveLength(5);
    expect(bonus).toHaveLength(5);
    required.forEach((q) => expect(bonus).not.toContain(q));
  });
});

describe('progress and completion', () => {
  test('session/day completion logic', () => {
    const state = createDefaultState();
    const day = getDayProgress(state, 1);
    expect(day.dayCompleted).toBe(false);
    ['Easy', 'Intermediate', 'Pattern Recognition', 'Hard', 'Problem Solving'].forEach((section) => {
      markSectionCompleted(state, 1, 'morning', section);
      markSectionCompleted(state, 1, 'afternoon', section);
    });
    recalcDay(state, 1);
    expect(getDayProgress(state, 1).dayCompleted).toBe(true);
  });
});

describe('migration and parent calculations', () => {
  test('migrates old state and computes filter + percentages', () => {
    const migrated = migrateState({ doneDays: [1], parentScores: [{ id: 'a', day: 1, session: 'morning', section: 'Easy', score: 4, maxScore: 5, source: 'bonus' }] });
    expect(migrated.version).toBe(5);
    expect(calcPercentage(4, 5)).toBe(80);
    expect(filterScores(migrated.parentScores, { day: '1', session: 'morning', section: 'Easy', source: 'bonus' })).toHaveLength(1);
  });
});
