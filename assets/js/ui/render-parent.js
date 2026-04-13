import { CATEGORY_ORDER, TOTAL_DAYS } from '../content/config.js';
import { filterScores, saveParentScore, updateParentScore, deleteParentScore } from '../features/parent-scores.js';
import { saveState } from '../storage.js';

export const renderParentPage = (state) => {
  const form = document.querySelector('[data-score-form]');
  const tbody = document.querySelector('[data-history-body]');
  const summary = document.querySelector('[data-parent-summary]');
  const clearBtn = document.querySelector('[data-clear-parent-scores]');
  const filters = {
    day: document.querySelector('[data-filter-day]'),
    session: document.querySelector('[data-filter-session]'),
    section: document.querySelector('[data-filter-section]'),
    source: document.querySelector('[data-filter-source]')
  };
  let editId = null;

  const dayOptions = Array.from({ length: TOTAL_DAYS }, (_, i) => `<option value="${i + 1}">Day ${i + 1}</option>`).join('');
  document.querySelector('[data-day-options]').innerHTML = dayOptions;
  filters.day.innerHTML += dayOptions;
  filters.section.innerHTML += CATEGORY_ORDER.map((s) => `<option>${s}</option>`).join('');

  const renderTrends = (rows) => {
    const svg = document.querySelector('[data-score-trend]');
    const values = rows.map((r) => r.percentage);
    if (!values.length) return void (svg.innerHTML = '');
    const points = values.map((v, i) => `${(i / Math.max(values.length - 1, 1)) * 100},${38 - v * 0.32}`).join(' ');
    svg.innerHTML = `<polyline points="${points}" fill="none" stroke="#2d6df6" stroke-width="2"/>`;
  };

  const rerender = () => {
    const rows = filterScores(state.parentScores, Object.fromEntries(Object.entries(filters).map(([k, el]) => [k, el.value])));
    const avg = rows.length ? Math.round(rows.reduce((s, r) => s + r.percentage, 0) / rows.length) : 0;
    const recent = rows.slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
    const totalTime = rows.reduce((s, r) => s + (Number(r.timeSeconds) || 0), 0);
    const sessionsCompleted = Object.keys(state.progress).reduce((sum, key) => sum + (state.progress[key].morning.completed ? 1 : 0) + (state.progress[key].afternoon.completed ? 1 : 0), 0);
    summary.innerHTML = `<article class="summary-item"><strong>Days completed</strong><p>${state.doneDays.length}</p></article>
      <article class="summary-item"><strong>Sessions completed</strong><p>${sessionsCompleted}</p></article>
      <article class="summary-item"><strong>Total time</strong><p>${Math.floor(totalTime / 60)}m</p></article>
      <article class="summary-item"><strong>Average score</strong><p>${avg}%</p></article>
      <article class="summary-item"><strong>Most recent activity</strong><p>${recent ? new Date(recent.updatedAt).toLocaleString() : '-'}</p></article>`;
    tbody.innerHTML = rows.map((r) => `<tr><td>${new Date(r.updatedAt).toLocaleString()}</td><td>${r.day}</td><td>${r.session}</td><td>${r.section || 'Session'}</td><td>${r.source || 'required'}</td><td>${r.score}/${r.maxScore}</td><td>${r.percentage}%</td><td>${r.notes || ''}</td><td><button class="btn" data-edit="${r.id}">Edit</button><button class="btn" data-del="${r.id}">Delete</button></td></tr>`).join('');
    renderTrends(rows);
  };

  form.onsubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const payload = { ...data, day: Number(data.day), score: Number(data.score), maxScore: Number(data.maxScore), timeSeconds: Number(data.timeSeconds || 0), source: data.source || 'required' };
    if (editId) updateParentScore(state, editId, payload);
    else saveParentScore(state, payload);
    saveState(state);
    editId = null;
    form.reset();
    rerender();
  };

  tbody.onclick = (e) => {
    const ed = e.target.closest('[data-edit]');
    const del = e.target.closest('[data-del]');
    if (ed) {
      const row = state.parentScores.find((r) => r.id === ed.dataset.edit);
      editId = row.id;
      Object.entries(row).forEach(([k, v]) => { if (form.elements[k]) form.elements[k].value = v; });
    }
    if (del) {
      deleteParentScore(state, del.dataset.del);
      saveState(state);
      rerender();
    }
  };

  Object.values(filters).forEach((el) => (el.onchange = rerender));
  if (clearBtn) {
    clearBtn.onclick = () => {
      if (!window.confirm('Clear all saved parent score history?')) return;
      state.parentScores = [];
      saveState(state);
      rerender();
    };
  }
  rerender();
};
