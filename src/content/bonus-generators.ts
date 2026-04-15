import { getRequiredQuestions } from './question-bank.ts';
import { sampleInts } from './generators.ts';
import type { Category, SessionKey } from './config.ts';

interface BonusQuestionRequest {
  day: number;
  session: SessionKey;
  category: Category;
  attempt: number;
}

export const getBonusQuestions = ({ day, session, category, attempt }: BonusQuestionRequest): string[] => {
  const required = new Set(getRequiredQuestions({ day, session, category }));
  const ints = sampleInts(day * 101 + attempt * 11 + (session === 'afternoon' ? 3 : 1), 6, 55, 10);
  const output: string[] = [];
  for (let i = 0; output.length < 5 && i < ints.length; i += 2) {
    const question = `${ints[i]} + ${ints[i + 1]} (${category} bonus)`;
    if (!required.has(question)) output.push(question);
  }
  while (output.length < 5) output.push(`Challenge ${output.length + 1}: ${day + output.length} × ${attempt + 2}`);
  return output;
};
