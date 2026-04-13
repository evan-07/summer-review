import { getRequiredQuestions } from './question-bank.js';
import { sampleInts } from './generators.js';

export const getBonusQuestions = ({ day, session, category, attempt }) => {
  const required = new Set(getRequiredQuestions({ day, session, category }));
  const ints = sampleInts(day * 101 + attempt * 11 + (session === 'afternoon' ? 3 : 1), 6, 55, 10);
  const out = [];
  for (let i = 0; out.length < 5 && i < ints.length; i += 2) {
    const q = `${ints[i]} + ${ints[i + 1]} (${category} bonus)`;
    if (!required.has(q)) out.push(q);
  }
  while (out.length < 5) out.push(`Challenge ${out.length + 1}: ${day + out.length} × ${attempt + 2}`);
  return out;
};
