import { CATEGORY_ORDER, TOTAL_DAYS } from '../content/config.ts';

export const getParentElements = () => ({
  form: document.querySelector('[data-score-form]'),
  historyBody: document.querySelector('[data-history-body]'),
  summary: document.querySelector('[data-parent-summary]'),
  clearBtn: document.querySelector('[data-clear-parent-scores]'),
  resetBtn: document.querySelector('[data-reset-all-progress]'),
  trendChart: document.querySelector('[data-score-trend]'),
  filterEls: {
    day: document.querySelector('[data-filter-day]'),
    session: document.querySelector('[data-filter-session]'),
    section: document.querySelector('[data-filter-section]'),
    source: document.querySelector('[data-filter-source]')
  },
  dayOptions: document.querySelector('[data-day-options]')
});

export const populateParentFilters = (elements) => {
  const dayOptions = Array.from({ length: TOTAL_DAYS }, (_, index) => {
    return `<option value="${index + 1}">Day ${index + 1}</option>`;
  }).join('');

  elements.dayOptions.innerHTML = dayOptions;
  elements.filterEls.day.innerHTML += dayOptions;
  elements.filterEls.section.innerHTML += CATEGORY_ORDER.map((section) => `<option>${section}</option>`).join('');
};

export const getFilterValues = (filterEls) => {
  return Object.fromEntries(Object.entries(filterEls).map(([key, element]) => [key, element.value]));
};

export const renderTrendChart = (svg, rows) => {
  const values = rows.map((row) => row.percentage);
  if (!values.length) {
    svg.innerHTML = '';
    return;
  }

  const points = values.map((value, index) => {
    return `${(index / Math.max(values.length - 1, 1)) * 100},${38 - value * 0.32}`;
  }).join(' ');

  svg.innerHTML = `<polyline points="${points}" fill="none" stroke="#2d6df6" stroke-width="2"/>`;
};

export const renderParentSummary = (summary, state, rows) => {
  const averageScore = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.percentage, 0) / rows.length) : 0;
  const recent = rows.slice().sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt))[0];
  const totalTime = rows.reduce((sum, row) => sum + (Number(row.timeSeconds) || 0), 0);
  const sessionsCompleted = Object.keys(state.progress).reduce((sum, key) => {
    return sum + (state.progress[key].morning.completed ? 1 : 0) + (state.progress[key].afternoon.completed ? 1 : 0);
  }, 0);
  const supportSectionCounts = rows.reduce((acc, row) => {
    const key = row.section || 'Session';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const topSection = Object.entries(supportSectionCounts).sort((left, right) => right[1] - left[1])[0]?.[0] || '-';

  summary.innerHTML = `<article class="summary-item summary-item--highlight"><strong>Days completed</strong><p>${state.doneDays.length}</p><span class="muted">Unlocked through current progress</span></article>
    <article class="summary-item"><strong>Sessions completed</strong><p>${sessionsCompleted}</p><span class="muted">Across morning and afternoon work</span></article>
    <article class="summary-item"><strong>Total time</strong><p>${Math.floor(totalTime / 60)}m</p><span class="muted">From saved score entries</span></article>
    <article class="summary-item"><strong>Average score</strong><p>${averageScore}%</p><span class="muted">Filtered rows only</span></article>
    <article class="summary-item"><strong>Most tracked section</strong><p>${topSection}</p><span class="muted">Useful for extra review</span></article>
    <article class="summary-item"><strong>Most recent activity</strong><p>${recent ? new Date(recent.updatedAt).toLocaleString() : '-'}</p><span class="muted">Latest saved update</span></article>`;
};

export const renderHistoryRows = (tbody, rows) => {
  tbody.innerHTML = rows.map((row) => {
    return `<tr><td>${new Date(row.updatedAt).toLocaleString()}</td><td>${row.day}</td><td>${row.session}</td><td>${row.section || 'Session'}</td><td>${row.source || 'required'}</td><td>${row.score}/${row.maxScore}</td><td>${row.percentage}%</td><td>${row.notes || ''}</td><td><button class="btn" data-edit="${row.id}">Edit</button><button class="btn" data-del="${row.id}">Delete</button></td></tr>`;
  }).join('');
};

export const fillScoreForm = (form, row) => {
  Object.entries(row).forEach(([key, value]) => {
    if (form.elements[key]) {
      form.elements[key].value = value;
    }
  });
};
