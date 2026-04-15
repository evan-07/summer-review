import { getDayConfig } from '../content/question-bank.ts';
import { getIndexElements, renderContinueDayPanel, renderDayGrid, renderIndexSummary, renderMissionHub } from './index-view.js';

export const renderIndexPage = (state) => {
  const elements = getIndexElements();
  renderIndexSummary(elements, state);
  renderMissionHub(elements, state, getDayConfig);
  renderContinueDayPanel(elements.continueDay, state);
  renderDayGrid(elements.dayGrid, state, getDayConfig);
};
