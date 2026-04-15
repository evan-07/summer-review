import { CATEGORY_ORDER, DAY_NOTES, INSPIRATION, THEMES, type Category, type SessionKey, type ThemeConfig } from './config.ts';
import { sampleInts } from './generators.ts';

interface RequiredQuestionRequest {
  day: number;
  session: SessionKey;
  category: Category;
}

interface DayConfig {
  day: number;
  theme: ThemeConfig;
  note: string;
  inspiration: string;
  categories: readonly Category[];
}

type QuestionBuilder = (day: number, sessionOffset: number) => string[];

const builders: Record<Category, QuestionBuilder> = {
  Easy: (day, sessionOffset) => {
    const [a, b, c, d, e] = sampleInts(day * 17 + sessionOffset, 4 + day, 30 + day, 5);
    return [`${a} + ${b}`, `${c + 20} - ${d}`, `${5 + sessionOffset} × ${3 + (day % 4)}`, `${e} + ${12 + day}`, `${40 + day} - ${8 + sessionOffset}`];
  },
  Intermediate: (day, sessionOffset) => {
    const [a, b, c, d, e] = sampleInts(day * 31 + sessionOffset, 10, 60, 5);
    return [`${a + 20} + ${b}`, `${70 + c} - ${d}`, `${7 + sessionOffset} × ${5 + (day % 3)}`, `${e + 35} + ${day}`, `What is 200 + ${a + day}?`];
  },
  'Pattern Recognition': (day, sessionOffset) => {
    const step = 2 + (day % 4);
    const start = 3 + day + sessionOffset;
    return [
      `Pattern: ${start}, ${start + step}, ${start + step * 2}, ${start + step * 3}, __`,
      `Skip count by 5: ${10 + sessionOffset}, ${15 + sessionOffset}, ${20 + sessionOffset}, __`,
      'Shape pattern: ▲ ■ ▲ ■ __',
      `Even/odd check: ${day + 9}, ${day + 10}, ${day + 11}, __`,
      `Array pattern: ${2 + sessionOffset}x3, ${3 + sessionOffset}x3, ${4 + sessionOffset}x3, __`
    ];
  },
  Hard: (day, sessionOffset) => {
    const [a, b, c, d] = sampleInts(day * 47 + sessionOffset, 20, 90, 4);
    return [`${a} × ${8 + sessionOffset}`, `${150 + b} - ${c}`, `${30 + day} × ${11 + sessionOffset}`, `${600 + d} - ${280 + day}`, `Expanded form of ${500 + day * 8}`];
  },
  'Problem Solving': (day, sessionOffset) => {
    const [a, b, c] = sampleInts(day * 67 + sessionOffset, 5, 28, 3);
    return [
      `A class has ${a + 10} students and ${b} join. How many now?`,
      `There are ${c + 5} bags with ${4 + sessionOffset} marbles each. Total marbles?`,
      `A library had ${150 + day} books and lent ${a}. How many left?`,
      `Sam reads ${8 + sessionOffset} pages for ${day % 4 + 2} days. How many pages?`,
      `A shop sold ${20 + b} toys in morning and ${18 + c} in afternoon. Total?`
    ];
  }
};

export const getRequiredQuestions = ({ day, session, category }: RequiredQuestionRequest): string[] => {
  const sessionOffset = session === 'afternoon' ? 1 : 0;
  return builders[category](day, sessionOffset);
};

export const getDayConfig = (day: number): DayConfig => ({
  day,
  theme: THEMES[day - 1],
  note: DAY_NOTES[day - 1],
  inspiration: INSPIRATION[day - 1],
  categories: CATEGORY_ORDER
});
