import { TOTAL_DAYS } from '../content/config.ts';
import { getDayUrl } from '../content/generators.ts';

export const formatDuration = (sec = 0) => `${Math.floor(sec / 60)}m ${sec % 60}s`;

export const renderTracker = (wrap, current, doneDays) => {
  if (!wrap) return;
  wrap.innerHTML = '';
  for (let d = 1; d <= TOTAL_DAYS; d += 1) {
    const a = document.createElement('a');
    a.href = getDayUrl(d);
    a.className = 'day-dot';
    if (d === current) a.classList.add('current');
    if (doneDays.includes(d)) a.classList.add('done');
    a.textContent = String(d);
    wrap.appendChild(a);
  }
};
