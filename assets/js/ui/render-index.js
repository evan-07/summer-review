import { TOTAL_DAYS } from '../content/config.js';
import { getDayConfig } from '../content/question-bank.js';
import { getDayUrl } from '../content/generators.js';
import { getDayProgress } from '../state.js';
import { formatDuration, renderTracker } from './components.js';

export const renderIndexPage = (state) => {
  renderTracker(document.querySelector('[data-progress-tracker]'), 0, state.doneDays);
  document.querySelector('[data-done-count]').textContent = `${state.doneDays.length} / ${TOTAL_DAYS}`;
  document.querySelector('[data-active-day]').textContent = state.activeDay ? `Day ${state.activeDay}` : 'None yet';
  const total = Object.values(state.progress).reduce((sum, day) => sum + (day.totalSeconds || 0), 0);
  document.querySelector('[data-total-time]').textContent = formatDuration(total);

  const continueWrap = document.querySelector('[data-continue-day]');
  const active = state.activeDay && getDayProgress(state, state.activeDay);
  continueWrap.innerHTML = active && !active.dayCompleted ? `<a class="card day-card" href="${getDayUrl(state.activeDay)}">Continue Day ${state.activeDay}</a>` : '';

  const grid = document.querySelector('[data-day-grid]');
  grid.innerHTML = '';
  for (let day = 1; day <= TOTAL_DAYS; day += 1) {
    const cfg = getDayConfig(day);
    const progress = getDayProgress(state, day);
    const status = progress.dayCompleted ? 'complete' : progress.totalSeconds > 0 ? 'in-progress' : 'not-started';
    const card = document.createElement('a');
    card.href = getDayUrl(day);
    card.className = `card day-card day-card--${status}`;
    card.innerHTML = `<h3>Day ${day} ${cfg.theme.icon}</h3><p>${cfg.note}</p><span class="chip">${cfg.theme.name}</span>`;
    grid.appendChild(card);
  }
};
