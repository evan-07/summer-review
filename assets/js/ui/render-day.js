import { CATEGORY_ORDER, TOTAL_DAYS, STATUS, SCORE_SOURCE, SESSION_KEYS } from '../content/config.js';
import { getBonusQuestions } from '../content/bonus-generators.js';
import { parseDayFromSearch, getDayUrl } from '../content/generators.js';
import { getDayConfig, getRequiredQuestions } from '../content/question-bank.js';
import { getDayProgress } from '../state.js';
import { markSectionCompleted, recalcDay } from '../features/progress.js';
import { startTimer, stopTimer } from '../features/timer.js';
import { saveState } from '../storage.js';
import { formatDuration, renderTracker } from './components.js';

export const renderDayPage = (state) => {
  const day = parseDayFromSearch(window.location.search);
  const cfg = getDayConfig(day);
  const dayProgress = getDayProgress(state, day);
  let session = state.activeSession || 'morning';
  let section = state.activeSection || CATEGORY_ORDER[0];
  let timerInterval = null;

  document.body.classList.add(cfg.theme.className);
  document.querySelector('[data-day-title]').textContent = `Day ${day} ${cfg.theme.icon} — ${cfg.theme.name}`;
  document.querySelector('[data-day-note]').textContent = cfg.note;
  document.querySelector('[data-day-inspiration]').textContent = cfg.inspiration;
  renderTracker(document.querySelector('[data-progress-tracker]'), day, state.doneDays);

  const jump = document.querySelector('[data-day-jump]');
  jump.innerHTML = Array.from({ length: TOTAL_DAYS }, (_, i) => `<option value="${i + 1}" ${i + 1 === day ? 'selected' : ''}>Day ${i + 1}</option>`).join('');
  jump.onchange = () => { window.location.href = getDayUrl(jump.value); };
  document.querySelector('[data-prev-day]').href = getDayUrl(day - 1);
  document.querySelector('[data-next-day]').href = getDayUrl(day + 1);

  const renderSessionTimer = () => {
    const timerEl = document.querySelector('[data-session-timer]');
    if (!timerEl) return;
    const live = state.timerState?.isRunning && state.timerState.day === day && state.timerState.session === session;
    const baseSeconds = dayProgress[session]?.totalSeconds || 0;
    const runningSeconds = live ? Math.floor((Date.now() - state.timerState.startedAt) / 1000) : 0;
    timerEl.textContent = `Session timer: ${formatDuration(baseSeconds + Math.max(0, runningSeconds))}`;
  };

  const restartTimerTicker = () => {
    if (timerInterval) clearInterval(timerInterval);
    renderSessionTimer();
    timerInterval = window.setInterval(renderSessionTimer, 1000);
  };

  const renderSection = () => {
    const required = getRequiredQuestions({ day, session, category: section });
    const sectionWrap = document.querySelector('[data-session-content]');
    const bonusKey = `${day}-${session}-${section}`;
    const attempts = state.bonusAttempts[bonusKey] || [];

    sectionWrap.innerHTML = `<section class="card"><h3>${section}</h3><ol>${required.map((q) => `<li>${q}</li>`).join('')}</ol>
      <button class="btn btn-secondary" data-get-bonus>Get 5 More</button><p class="muted">Optional extra practice</p>
      <div class="bonus-area">${attempts.map((a) => `<article class="bonus-panel"><h4>Bonus Round ${a.attempt}</h4><ol>${a.questions.map((q) => `<li>${q}</li>`).join('')}</ol></article>`).join('')}</div>
      <div class="button-row"><button class="btn btn-primary" data-next>${section === 'Problem Solving' ? 'Finish Session' : 'Next Section'}</button></div></section>`;

    sectionWrap.querySelector('[data-get-bonus]').onclick = () => {
      const nextAttempt = attempts.length + 1;
      if (nextAttempt > 3) return;
      const questions = getBonusQuestions({ day, session, category: section, attempt: nextAttempt });
      const entry = { day, session, section, attempt: nextAttempt, source: SCORE_SOURCE.BONUS, generatedAt: new Date().toISOString(), questions };
      state.bonusAttempts[bonusKey] = [...attempts, entry];
      saveState(state);
      renderSection();
    };

    sectionWrap.querySelector('[data-next]').onclick = () => {
      stopTimer(state);
      markSectionCompleted(state, day, session, section);
      const idx = CATEGORY_ORDER.indexOf(section);
      if (idx < CATEGORY_ORDER.length - 1) {
        section = CATEGORY_ORDER[idx + 1];
        startTimer(state, day, session, section);
        state.activeSession = session;
        state.activeSection = section;
      }
      saveState(state);
      if (idx < CATEGORY_ORDER.length - 1) renderSection();
      else document.querySelector('[data-session-content]').innerHTML = '<section class="card"><h3>Session complete! ✅</h3></section>';
      recalcDay(state, day);
      renderSessionTimer();
      if (dayProgress.dayCompleted) document.querySelector('[data-finish-day]').classList.remove('hidden');
      renderPills();
    };
  };

  const renderPills = () => {
    const pills = document.querySelector('[data-section-pills]');
    pills.innerHTML = CATEGORY_ORDER.map((c) => {
      const st = dayProgress[session].sections[c].status;
      const badge = st === STATUS.COMPLETED ? '✓' : st === STATUS.IN_PROGRESS ? 'In progress' : 'Ready';
      return `<button class="pill ${st}" data-section="${c}">${c}<span>${badge}</span></button>`;
    }).join('');
    pills.querySelectorAll('[data-section]').forEach((btn) => {
      btn.onclick = () => { section = btn.dataset.section; startTimer(state, day, session, section); renderSection(); renderPills(); renderSessionTimer(); saveState(state); };
    });
  };

  document.querySelectorAll('[data-start-session]').forEach((btn) => {
    btn.onclick = () => {
      session = btn.dataset.startSession;
      section = CATEGORY_ORDER[0];
      document.querySelector('[data-session-title]').textContent = `${session === SESSION_KEYS[0] ? 'Morning' : 'Afternoon'} Session`;
      startTimer(state, day, session, section);
      saveState(state);
      renderSection();
      renderPills();
      restartTimerTicker();
    };
  });

  document.querySelector('[data-finish-day-btn]').onclick = () => {
    recalcDay(state, day);
    const complete = getDayProgress(state, day).dayCompleted;
    document.querySelector('[data-finish-day-msg]').textContent = complete ? 'Day complete! Fantastic perseverance!' : 'Complete both sessions first.';
    if (complete) saveState(state);
  };

  document.querySelector('[data-parent-link]').href = 'parent.html';
  restartTimerTicker();
  window.addEventListener('beforeunload', () => {
    if (timerInterval) clearInterval(timerInterval);
  });
};
