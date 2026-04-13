import { CATEGORY_ORDER, DAY_NOTES, INSPIRATION, THEMES } from './config.js';
import { sampleInts } from './generators.js';

const builders = {
  Easy: (day, s) => {
    const [a, b, c, d, e] = sampleInts(day * 17 + s, 4 + day, 30 + day, 5);
    return [`${a} + ${b}`, `${c + 20} - ${d}`, `${5 + s} × ${3 + (day % 4)}`, `${e} + ${12 + day}`, `${40 + day} - ${8 + s}`];
  },
  Intermediate: (day, s) => {
    const [a, b, c, d, e] = sampleInts(day * 31 + s, 10, 60, 5);
    return [`${a + 20} + ${b}`, `${70 + c} - ${d}`, `${7 + s} × ${5 + (day % 3)}`, `${e + 35} + ${day}`, `What is 200 + ${a + day}?`];
  },
  'Pattern Recognition': (day, s) => {
    const step = 2 + (day % 4);
    const start = 3 + day + s;
    return [
      `Pattern: ${start}, ${start + step}, ${start + step * 2}, ${start + step * 3}, __`,
      `Skip count by 5: ${10 + s}, ${15 + s}, ${20 + s}, __`,
      `Shape pattern: ▲ ■ ▲ ■ __`,
      `Even/odd check: ${day + 9}, ${day + 10}, ${day + 11}, __`,
      `Array pattern: ${2 + s}x3, ${3 + s}x3, ${4 + s}x3, __`
    ];
  },
  Hard: (day, s) => {
    const [a, b, c, d] = sampleInts(day * 47 + s, 20, 90, 4);
    return [`${a} × ${8 + s}`, `${150 + b} - ${c}`, `${30 + day} × ${11 + s}`, `${600 + d} - ${280 + day}`, `Expanded form of ${500 + day * 8}`];
  },
  'Problem Solving': (day, s) => {
    const [a, b, c] = sampleInts(day * 67 + s, 5, 28, 3);
    return [
      `A class has ${a + 10} students and ${b} join. How many now?`,
      `There are ${c + 5} bags with ${4 + s} marbles each. Total marbles?`,
      `A library had ${150 + day} books and lent ${a}. How many left?`,
      `Sam reads ${8 + s} pages for ${day % 4 + 2} days. How many pages?`,
      `A shop sold ${20 + b} toys in morning and ${18 + c} in afternoon. Total?`
    ];
  }
};

export const getRequiredQuestions = ({ day, session, category }) => {
  const sessionOffset = session === 'afternoon' ? 1 : 0;
  return builders[category](day, sessionOffset);
};

export const getDayConfig = (day) => ({
  day,
  theme: THEMES[day - 1],
  note: DAY_NOTES[day - 1],
  inspiration: INSPIRATION[day - 1],
  categories: CATEGORY_ORDER
});
