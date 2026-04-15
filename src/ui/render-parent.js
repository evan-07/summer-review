import { filterScores, saveParentScore, updateParentScore, deleteParentScore } from '../features/parent-scores.ts';
import { saveState } from '../storage.ts';
import { createDefaultState } from '../state.ts';
import { fillScoreForm, getFilterValues, getParentElements, populateParentFilters, renderHistoryRows, renderParentSummary, renderTrendChart } from './parent-view.js';

export const renderParentPage = (state) => {
  const elements = getParentElements();
  const { form, historyBody, summary, clearBtn, resetBtn, trendChart, filterEls } = elements;
  let editId = null;

  populateParentFilters(elements);

  const rerender = () => {
    const rows = filterScores(state.parentScores, getFilterValues(filterEls));
    renderParentSummary(summary, state, rows);
    renderHistoryRows(historyBody, rows);
    renderTrendChart(trendChart, rows);
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

  historyBody.onclick = (e) => {
    const ed = e.target.closest('[data-edit]');
    const del = e.target.closest('[data-del]');
    if (ed) {
      const row = state.parentScores.find((r) => r.id === ed.dataset.edit);
      editId = row.id;
      fillScoreForm(form, row);
    }
    if (del) {
      deleteParentScore(state, del.dataset.del);
      saveState(state);
      rerender();
    }
  };

  Object.values(filterEls).forEach((el) => (el.onchange = rerender));
  if (clearBtn) {
    clearBtn.onclick = () => {
      if (!window.confirm('Clear all saved parent score history?')) return;
      state.parentScores = [];
      saveState(state);
      rerender();
    };
  }
  if (resetBtn) {
    resetBtn.onclick = () => {
      if (!window.confirm('Reset all progress? This clears day completions, timers, and activity data. Parent scores are kept.')) return;
      const preserved = state.parentScores;
      Object.assign(state, createDefaultState());
      state.parentScores = preserved;
      state.activeDay = null;
      saveState(state);
      window.location.href = 'index.html';
    };
  }
  rerender();
};
